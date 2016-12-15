var pageNumber = 1;
$(document).ready(function() {
	$('#tn_wizard').addClass('active');
	objMode.nav.selected = 'wizard';
	objMode.nav.selected_tab = 'bugAnalytics';
	loadNav();
	getPageStatusData();
	objActionMapper.search = 'getBugReportList';
	objActionMapper.loadPage = 'getBugReportList';
	activateSearchTrigger();
	$('button.add_disable, button.add_enable, button.add_delete').click(updateEventStatus);
	getBugReportList(pageNumber);
	$('#div_commonSearchBox').removeClass("hideElementCls");
	$('#searchCommon').attr({'placeholder':'Search by device serial no, package, message, softwareBuild','title':'Search by device serial no, package, message, softwareBuild'});
});

function getSelectedDeviceIds() {
	var idList = [];
	var selectedCheckBox = jQuery("#table_bugReportList :checkbox:not(.checkAll):checked");
	if (selectedCheckBox.length) {
		$.each(selectedCheckBox, function(key, val) {
			idList.push(val.id.split('_')[1]);
		});
	}
	return idList;
}

function updateEventStatus(event) {
	var idList = getSelectedDeviceIds();
	var status = "NEW";
	if($(event.target).hasClass("add_disable")) {
		status = "RESOLVED";
	} else if($(event.target).hasClass("add_delete")) {
		status = "REJECTED";
	}
	var postJSON = {
		"idList" : idList,
		"status" : status
	};
	$.ajax({
		type : "POST",
		url : "/api/device/v1/changeEventStatus",
		contentType : "application/json",
		data : createDataPacket(postJSON),
		dataType : 'json'
	}).complete(function(data) {
		try {
			if (data.responseJSON != null && data.responseJSON.httpStatusCode == 200) {
				objNotification.success = data.responseJSON.message;
				showNotification();
				getBugReportList(pageNumber);
			} else {
				$('.messages').html(responseData.responseJSON.message);
			}
		} catch (error) {
			$('.messages').html(error.message);
		}
	});
}

function getBugReportList(pageNo) {
	if(pageNo == null || pageNo == "") {
		pageNo = 1;
	}
	pageNumber = pageNo;
	var postData;
	var searchString = $('#searchCommon').val();
	var order = 'asc';
	var sortColumn = "timeStamp";
    var objCheckAll = jQuery("#table_bugReportList :checkbox." + clsCheckAll);
    objCheckAll.prop("checked", false);
    objCheckAll.removeClass("checked");
	if(objGrid.sort != null && objGrid.sort.field != "" && objGrid.sort.type != "") {
		sortColumn = objGrid.sort.field;
		order = objGrid.sort.type;
	}
	if(searchString != null && searchString.length > 0) {
		postData = {
				"page" : pageNumber,
				"rows" : objGrid.limit,
				"sortOn" : sortColumn,
				"order" : order,
				"usePagination" : true,
				"isSearch" : "true",
				"searchString" : searchString,
				"modelId" : currentModelId,
				"groupId" : currentGroupId
		};
	} else {
		postData = {
				"page" : pageNumber,
				"rows" : objGrid.limit,
				"sortOn" : sortColumn,
				"order" : order,
				"usePagination" : true,
				"isSearch" : "false",
				"modelId" : currentModelId,
				"groupId" : currentGroupId
		};
	}
	disableObject("#device_BugReports");
	$.ajax({
		type : 'POST',
		url : "/api/device/v1/getBugReportLogs",
		data : createDataPacket(postData),
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(data) {
		$('#table_bugReportList tbody').empty();
		try {
			if (data.responseJSON != null && data.responseJSON.httpStatusCode == 200) {
				drawTable(data.responseJSON.list, 'bugReportList');
				objGrid.total = data.responseJSON.total;
				objGrid.page = data.responseJSON.page;
				drawPaginator();
				activateCheckAll('table_bugReportList', updateCheckBox);
				setPageStatusData();
			} else {
				$('.messages').html(data.responseJSON.message);
			}
		} catch (error) {
			$('.messages').html(error.message);
		}
		disableObject("#device_BugReports",true);
	});
}

function drawBugReportTable(list) {
	 if(list.length){
		 $.each(list, function(key,val) {
			 var tableRow=''; 
			 tableRow 	= '<tr>'
				 + '<td><input type="checkbox" class="tbl_checkbox" data_status="' + val.eventStatus + '" data_id="'+val.eventId+'" id="checkbox_' + val.eventId + '"></td>'
				 + '<td>'
				 + '<div>' + val.deviceSerialNo + '</div>'
				 + '<div class="rInActive fontItalicClass">' + val.swBuildVersion + '</div>'
				 + '</td>'
				 + '<td><span>' + val.packageName + '</span></td>'
				 + '<td>' + getData(val.message) + '</td>'
				 + '<td><span>' + val.eventStatus + '</span></td>'
				 + '<td class="rActive">' + formatDate(new Date(parseInt(val.timeStamp))) + '</td>'
				 + '<td>' + getData(val.eventData) + '</td>'
				 + '<td>' + getDownloadUrl(val) + '</td>'
				 + '</tr>';
			 $('#table_bugReportList tbody').append(tableRow);
		 });
	 }else{
		 $('#table_bugReportList tbody').html('<td colspan="7" class="text-center">Data Not found.</td>');
	 }
}

function getData(data) {
	if(data == null || data == "") {
		return '<span">--</span>';
	}
	return '<span title="' + data + '">' + shortenName(data, 20) + '</span>';
}

function getDownloadUrl(item) {
	var url = item.logFile;
	if(url == null || url == "") {
		return "--";
	}
	var n = url.lastIndexOf("/");
	if(n >= 0) {
		url = url.substring(n + 1, url.length);
	}
	return '<a href="/downloadFile?URL=' + item.logFile + '"><span title="' + url + '" class="rActive">' + shortenName(url, 20) + '</span></a>';
}

function getUrl(deviceId){
	objUrlParam.deviceId=deviceId;
	return './deviceInfo.jsp?'+ getEncodedNotification();
}