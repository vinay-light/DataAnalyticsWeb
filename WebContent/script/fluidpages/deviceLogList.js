var buildId = 0;
var pageNo = 1;
$(document).ready(function() {
	disableObject("#deviceLog");
	$('#tn_wizard').addClass('active');
	objMode.nav.selected = 'wizard';
	objMode.nav.selected_tab='viewLogs';
	loadNav();
	getPageStatusData();
	$('#idFromDate').val('');
	$('#idToDate').val('');
	$('#idFromDate').datetimepicker({
		timeFormat: "HH:mm", maxDate : '0'
	});
	$('#idToDate').datetimepicker({
		timeFormat: "HH:mm", maxDate : '0',
		hour: 23,
		minute: 59
	});
	$('#idToDate,#idFromDate').click(function() {
		$('#ui-datepicker-div').css({
		    top: 100
		});
	});
	$('#idToDate,#idFromDate').change(validateDates);
//	getDeviceModels(deviceLogListCallback);
	$('#idSubmitActivityLog').click(showlog);
	objActionMapper.search = 'showlog';
	objActionMapper.loadPage = 'showlog';
	$('#div_commonSearchBox').removeClass("hideElementCls");
	$('#searchCommon').attr('placeholder', 'Search by package name.');
	activateSearchTrigger();
	$('button.add_delete').click(function(){
		$('#confirmMessage').html("Are you sure you want to delete device log(s)?");
		$('#div_confirmDialog1').modal('show');
	});
	$('#div_confirmDialog1 #btn_delete').click(deleteDeviceLogs);
	$(".add_search").addClass("least_z_index");
});

function showlog(pageNum){
	if($('#swBuildIdList').val() == null) {
		showErrorMessage(translate("log.validation.select.build_type"));
		return false;
	}
	if($('#select_logType').val() == null) {
		showErrorMessage(translate("log.validation.select.log_type"));
		return false;
	}
	if(isNaN(pageNum)) {
		pageNum = 1;
	}
	activeValidation =true;
	var toDate1 = new Date($("#idToDate").val()).getTime();	
	var fromDate1 = new Date($("#idFromDate").val()).getTime();
	if(validateDates()){
		showErrorMessage("");
		$("#maindevice_LogList").show();
		getDeviceLogList(pageNum, toDate1, fromDate1);		
	}
}

function getSelectedDeviceIds() {
	var idList = [];
	var selectedCheckBox = jQuery("#table_deviceLogList :checkbox:not(.checkAll):checked");
	if (selectedCheckBox.length) {
		$.each(selectedCheckBox, function(key, val) {
			idList.push(val.id.split('_')[1]);
		});
	}
	return idList;
}

function deleteDeviceLogs() {
	$('#div_confirmDialog1').modal('hide');
	var postJSON =   {"idList": getSelectedDeviceIds()};
	$.ajax({
		type : "DELETE",
		url : "/api/device/v1/deleteLogs",
		contentType : "application/json",
		data : createDataPacket(postJSON),
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				$('.notification_error').html('<span class="rActive">' + responseData.responseJSON.message + '<span>');
				showlog(1);
			} else {
				$('.notification_error').html(responseData.responseJSON.message);
			}
		} catch (error) {
			$('.notification_error').html(error.message);
		}
	});
}

var activeValidation = false;
function validateDates(){	
	if(activeValidation){
		toDate = $('#idToDate').val();
		fromDate = $('#idFromDate').val();
		$('#idToDate').css("borderColor", "");
		$('#idFromDate').css("borderColor", "");	
		if (toDate == '') {
			showErrorMessage(translate('log.validation.select.to.date'));
			$('#idToDate').css("borderColor", "red");
			return false;
		} else if(fromDate == ''){
			$('#idFromDate').css("borderColor", "red");
			showErrorMessage(translate('log.validation.select.from.date'));
			return false;
		} else {
			if (new Date(toDate).getTime() <= new Date(fromDate).getTime()) {
				showErrorMessage(translate('log.validation.select.invalid_dates'));
				$('#idToDate').css("borderColor", "red");
				$('#idFromDate').css("borderColor", "red");	
				return false;
			}
		}
		showErrorMessage("");
		showNotification();
		return true;
		
	}
}
function showErrorMessage(errMessage) {
	$('.notification_error').html(errMessage);
}

function getDeviceLogList(pageNum, toDate1, fromDate1) {
	var objCheckAll = jQuery("#table_deviceLogList :checkbox." + clsCheckAll);
	objCheckAll.prop("checked", false);
    objCheckAll.removeClass("checked");
	pageNo = pageNum;
	var order = 'asc';
	var sortColumn = "timeStamp";
	var searchString = $('#searchCommon').val();
	if(objGrid.sort != null && objGrid.sort.field != "" && objGrid.sort.type != "") {
		sortColumn = objGrid.sort.field;
		order = objGrid.sort.type;
	}
	var postData = null;
	if(searchString != null && searchString.length > 0) {
		postData = {
				"groupId" : currentGroupId,
				"modelId" : currentModelId,
				"sortOn" : sortColumn,
				"order" : order,
				"page" : pageNo,
				"rows" : objGrid.limit,
				"isSearch" : "true",
				"searchString" : searchString,
				"usePagination" : true,
				"logType" : $('#select_logType').val(),
				"startTime" : fromDate1,
				"endTime" : toDate1,
				"swBuildIdList":$('#swBuildIdList').val()
		};
	} else {
		postData = {
				"groupId" : currentGroupId,
				"modelId" : currentModelId,
				"sortOn" : sortColumn,
				"order" : order,
				"page" : pageNo,
				"rows" : objGrid.limit,
				"isSearch" : "false",
				"usePagination" : true,
				"logType" : $('#select_logType').val(),
				"startTime" : fromDate1,
				"endTime" : toDate1,
				"swBuildIdList":$('#swBuildIdList').val()
		};
	}
//	$('#table_deviceLogList tbody').html("<tr><td colspan='"+$('#table_deviceLogList thead th').length+"'></td></tr>");
	disableObject("#table_deviceLogList");
	$.ajax({
		type : 'POST',
		url : "/api/device/v1/getAllLog",
		data : createDataPacket(postData),
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(responseData) {
		disableObject("#table_deviceLogList",true);
		$('#table_deviceLogList tbody').html("");
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				drawTable(responseData.responseJSON.list, 'logList');
				objGrid.total = responseData.responseJSON.total;
				objGrid.page = responseData.responseJSON.page;
				drawPaginator();
				activateCheckAll('table_deviceLogList', updateCheckBox);
				setPageStatusData();
			} else {
				$('#table_deviceLogList tbody').html("<tr><td colspan='"+$('#table_deviceLogList thead th').length+"'>"+responseData.responseJSON.message+"</td></tr>");
				$('.messages').html(responseData.responseJSON.message);
			}
		} catch (error) {
			$('#table_deviceLogList tbody').html("<tr><td colspan='"+$('#table_deviceLogList thead th').length+"'>"+responseData.responseJSON.message+"</td></tr>");
			$('.messages').html(error.message);
		}
	});
}
function getLogTable(responseData){
	$('#table_deviceLogList tbody').html("");
	 if(responseData.length){
		 
		 $.each(responseData, function(key,val){
		var tableRow = '<tr>'
				 +'<td><input type="checkbox" class="tbl_checkbox" data_id="'+val.eventId+'"  id="checkbox_' + val.eventId + '"' + (isAdmin == "true" ? "" : "disabled") + '></td>'
				 +'<td><span>' + val.eventName + '</span></td>'
				 +'<td><div>' + val.deviceSerialNo + '</div><div class="rInActive fontItalicClass">' + val.swBuildVersion + '</div></td>'
				 +'<td>'+ getPackageName(val.packageName) +'</td>'
				 +'<td>'+getCustomDate(new Date(parseInt(val.timeStamp)))+'</td>'				
				 +'<td>'+ getEventData(val) +'</td>'
				 +'<td>' + getEventMessage(val.message) + '</td>'
				 +'<td class="rActive">'+getDownloadUrl(val)+'</td>'
				 +'</tr>';
			 $('#table_deviceLogList tbody').append(tableRow);
		 });
	 }else{
		 $('#table_deviceLogList tbody').html('<tr><td colspan="7" class="text-center">Data Not found.</td></tr>');
	 }
	 if(isAdmin == "false") {
		 var objCheckAll = jQuery("#table_deviceLogList :checkbox." + clsCheckAll);
		 objCheckAll.prop("disabled", true);
		 
	 }
	 $('[id^=eventData_]').click(function(){
			$('#div_eventData .modal-body').html($(this).find('span').text());
	 });
}

function getEventMessage(message) {
	if(message == null || message == "") {
		return "--";
	}
	return "<span title='" + message + "'>" + shortenName(message, 20) + "</span>";
}

function getEventData(item){
	if(item.eventName == "BATTERY_CONSUMPTION_EVENT"){
		return '<a class="rActive" href="#div_eventData" data-toggle="modal" id="eventData_'+item.eventId+'"><span class="hide">'+item.eventData+'</span>'+shortenName(item.eventData, 30)+'</a>';
	}else{
		return item.eventData + " Milliseconds";
	}
}
function getPackageName(packageName){
	if(packageName == undefined || packageName == null || packageName == "") {
		return '--';
	}else{
		return "<span title='" + packageName + "'>" + shortenName(packageName, 18) + "</span>";
	}
}
function getDownloadUrl(item) {
	if(item.logFile == undefined || item.logFile == null || item.logFile == "") {
		return '--';
	}else{
		var url = item.logFile;
		var n = url.lastIndexOf("/");
		if(n >= 0) {
			url = url.substring(n + 1, url.length);
		}
		return '<a href="/downloadFile?URL=' + item.logFile + '"><span title="' + url + '" class="rActive">' + shortenName(url, 20) + '</span></a>';
	}
}

function drawGraphs(modelId){
	if(modelId){
		changeModelType1();
		setSwBuild(modelId);
	}
	setEventType();
}

function setSwBuild(modelId) {
	$.ajax({
		type : 'GET',
		url : "/api/model/v1/swBuilds?modelId=" + modelId,
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(data) {
		try {
			if (data.responseJSON != null
					&& data.responseJSON.httpStatusCode == 200) {
				$('[id^=device_softwareBuilds] ul').empty();
				$('[id^=device_softwareBuilds] select').empty();
				if(!data.responseJSON.data.length){
					$('#selectSwBuild').html('Select Build');
					$('[id^=device_softwareBuilds] ul').html('<li role="presentation"><a role="menuitem" tabindex="-1">No Build Assigned</a></li>');
					buildId = 0;
					$('#table_deviceLogList tbody').html('<td colspan="7" class="text-center">Data Not found.</td>');
				} else{
					$.each(data.responseJSON.data, function(index,value){
						$('[id^=device_softwareBuilds] select').append('<option value="'+ value.buildId +'">'+ value.buildName +'</option>');
					});
					$('#selectSwBuild').html(data.responseJSON.data[0].buildName);
					buildId = data.responseJSON.data[0].buildId;
					changeBuildType();
				}
			} else {
				$('.notification_error').html(
						data.responseJSON.message);
			}
		} catch (error) {
			$('.notification_error').html(error.message);
		}
	});
}

function changeBuildType(){
	$('.sw-build-dropdown-menu li').click(function(){
		buildId = $(this).find('[data-id]').attr('data-id');
		$('#selectSwBuild').html($(this).find('[build-name]').attr('build-name'));
	});
}

function changeModelType1(){
	$('.model-dropdown-menu li').click(function(){
		modelId = $(this).find('[data-id]').attr('data-id');
		$('#selectModel').html($(this).find('[modal-name]').attr('modal-name'));
		switchModel(modelId);
		setSwBuild(modelId);
	});
}

function setEventType() {
	$.ajax({
		type : 'GET',
		url : "/api/device/v1/allEventType",
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(data) {
		try {
			if (data.responseJSON != null
					&& data.responseJSON.httpStatusCode == 200) {
				if(data.responseJSON.data.length){
					$.each(data.responseJSON.data, function(index,value){
						$('#select_logType').append('<option value="'+ value +'">'+ value +'</option>');
					});
				}
			} else {
				$('.notification_error').html(
						data.responseJSON.message);
			}
		} catch (error) {
			$('.notification_error').html(error.message);
		}
		disableObject("#deviceLog", true);
	});
}
