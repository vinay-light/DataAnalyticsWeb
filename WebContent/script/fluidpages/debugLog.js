var buildId = 0;
var modelId = null;
var pageNumber = 1;
var deviceId = null;
var groupId = null;
var buildName = null;
deviceSerialNo = null;
$(document).ready(function() {
	$('#tn_wizard').addClass('active');
	objMode.nav.selected = 'wizard';
	objMode.nav.selected_tab='debugLogs';
	loadNav();
	showUrlNotification();
	if (objUrlParam.deviceSerialNo != null) {
		buildName = objUrlParam.buildName;
		deviceSerialNo = objUrlParam.deviceSerialNo;
	}
	objActionMapper.search = 'getDeviceLogList';
	objActionMapper.loadPage = 'getDeviceLogList';
	$('#div_commonSearchBox').removeClass("hideElementCls");
	$('#searchCommon').attr('placeholder', 'Search by Device serial no.');
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel); 
	activateSearchTrigger();
});
function drawGraphs(curModelId){
	disableObject("#deviceLogList");
	currentDeviceModel = $("#current_device_model").text();
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel); 
	changeModelType1();
	modelId = curModelId;
	setSwBuild(modelId);
	if(groupId == null) {
		groupId = currentGroupId;
	}
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
				if(!data.responseJSON.data.length){
					disableObject("#deviceLogList", true);
					$('#selectSwBuild').html('Select Build');
					$('[id^=device_softwareBuilds] ul').html('<li role="presentation"><a role="menuitem" tabindex="-1">No Build Assigned</a></li>');
					buildId = 0;
					$('#table_deviceLogList tbody').html('<tr><td colspan="8" class="text-center">Data Not found.</td></tr>');
				} else{
					$.each(data.responseJSON.data, function(index,value){
						$('[id^=device_softwareBuilds] ul').append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" build-name="' + value.buildName + '" data-id="'+value.buildId+'">' + value.buildName + '</a></li>');
					});
					setBuildName(data.responseJSON.data);
					changeBuildType();
					getDeviceLogList(1);
				}
			} else {
				disableObject("#deviceLogList", true);
				$('.notification_error').html(
						data.responseJSON.message);
			}
		} catch (error) {
			disableObject("#deviceLogList", true);
			$('.notification_error').html(error.message);
		}
	});
}

function setBuildName(data) {
	var tempBuildId = data[0].buildId;
	var bldName = data[0].buildName;
	$.each(data, function(index,value){
		if(buildName != null) {
			if(buildName == value.buildName) {
				bldName = value.buildName;
				tempBuildId = value.buildId;
			}
		} else if(value.buildName.localeCompare(bldName) < 0) {
			bldName = value.buildName;
			tempBuildId = value.buildId;
		}
	});
	var shortBuildName = shortenName(bldName, 30);
	$('#selectSwBuild').html('<span title="' + bldName + '">' + shortBuildName + '</span>');
	buildId = tempBuildId;
}

function changeBuildType(){
	$('.sw-build-dropdown-menu li').click(function(){
		buildId = $(this).find('[data-id]').attr('data-id');
		var buildName = $(this).find('[build-name]').attr('build-name');
		var bldName = shortenName(buildName, 30);
		$('#selectSwBuild').html('<span title="' + buildName + '">' + bldName + '</span>');
		getDeviceLogList(1);
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
function getDeviceLogList(pageNo) {
	pageNumber = pageNo;
	if(pageNumber == null) {
		pageNumber = 1;
	}
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$('span#actionDeviceModel a').attr('onclick', '');
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel); 
	var postData;
	var searchString = $('#searchCommon').val();
	var order = 'asc';
	var sortColumn = "deviceSerialNo";
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
				"modelId" : modelId,
				"swBuildId" : buildId,
				"groupId" : groupId,
				"deviceId" : deviceId,
				"deviceSerialNo" : deviceSerialNo
		};
	} else {
		postData = {
				"page" : pageNumber,
				"rows" : objGrid.limit,
				"sortOn" : sortColumn,
				"order" : order,
				"usePagination" : true,
				"isSearch" : "false",
				"modelId" : modelId,
				"swBuildId" : buildId,
				"groupId" : groupId,
				"deviceId" : deviceId,
				"deviceSerialNo" : deviceSerialNo
		};
	}
	disableObject("#deviceLogList");
	$.ajax({
		type : 'POST',
		url : "/api/device/v1/getall",
		data : createDataPacket(postData),
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(data) {
		$('#table_deviceLogList tbody').empty();
		try {
			if (data.responseJSON != null && data.responseJSON.httpStatusCode == 200) {
				drawTable(data.responseJSON.list, 'deviceLogList');
				objGrid.total = data.responseJSON.total;
				objGrid.page = data.responseJSON.page;
				drawPaginator();
			} else {
				$('.messages').html(data.responseJSON.message);
			}
		} catch (error) {
			$('.messages').html(error.message);
		}
		disableObject("#deviceLogList",true);
	});
}

function getDeviceLogTable(list) {
	 if(list.length){
		 $.each(list, function(key,val) {
			 var tableRow='';
			 tableRow 	= '<tr>'
				/* +'<td><input type="checkbox" class="tbl_checkbox" data_status="'+val.status+'" id="checkbox_'+val.deviceId+'"></td>'*/
				 +'<td><img class="img-circle" src="/images/device.png"></td>'
				 +'<td><div>'
				 +((isAdmin == "true") ? ('<a href="'+getUrl(val.deviceId)+'" class="rActive rMargin nowrap">' + val.deviceSerialNo + '</a>') : ('<span class="rMargin nowrap">' + val.deviceSerialNo + '</span>'))
				 +'<div class="rInActive fontItalicClass">' + val.swBuildVersion + '</div>'
				 +'</div>'
				 +'</td>'
				 +'<td>' + getCustomDate(new Date(val.updateTs)) + '</td>'
				 +'<td>' + getCustomDate(new Date(val.createdTs)) + '</td>'
				 +'<td>' + getStatus(val.status)+ '</td>'
				 +'<td>' + (val.debugLogCount != 0 ? ('<a href="#" onclick="getDebugLogsList(this);" data="' + getLogData(val) + '">' + val.debugLogCount + '</a>') : ('<span>0<span>')) + '</td>'
				 +'</tr>';
			 $('#table_deviceLogList tbody').append(tableRow);
		 });
	 }else{
		 $('#table_deviceLogList tbody').html('<tr><td colspan="8" class="text-center">Data Not found.</td></tr>');
	 }
}

function getLogData(val) {
	if(val.debugLogCount == 0) {
		return "";
	}
	var data = {};
	data.deviceId= val.deviceId;
	data.buildId = buildId;
	data.deviceModel = val.deviceModel;
	data.deviceSerialNo = val.deviceSerialNo;
	data.swBuildVersion = val.swBuildVersion;
	return $.base64.encode(JSON.stringify(data));
}

function getGroupInfoUrl(groupId){
	objUrlParam.groupId=groupId;
	return './deviceGroupInfo.jsp?'+ getEncodedNotification();
}

	//	Debug log list	//

var deviceId = 0;
var buildId = 0;
var deviceSerialNo = "";
var deviceModel = "";
var swBuildVersion = "";
function getDebugLogsList(obj) {
	if(obj.firstChild.textContent == "0") {
		return false;
	}
	var logData = obj.getAttribute('data');
	var getJson = $.base64.decode( logData );
    var objMsg = JSON.parse(getJson);
    deviceId = objMsg.deviceId;
    buildId = objMsg.buildId;
    deviceSerialNo = objMsg.deviceSerialNo;
    deviceModel = objMsg.deviceModel;
    swBuildVersion = objMsg.swBuildVersion;
    searchText = $('#searchCommon').val();
    $('#searchCommon').val("");
	$('#div_commonSearchBox').addClass("hidden");
    $('#div_deviceList').addClass('hidden');
    $('#div_swBuildSelection').addClass('hidden');
    $('#device_debugLogList').removeClass('hidden');
    $('span.action_breadcrumb').addClass('hidden');
	$('span#actionBuild, span#actionDeviceModel').removeClass('hidden').addClass('active');
	$('span#actionBuild a').html(deviceSerialNo);
	$('span#actionDeviceModel a').attr('onclick', 'drawBuildData();');
	objActionMapper.loadPage = 'getDebugLogs';
    getDebugLogs(1);
}

function getDebugLogs(pageNo) {
	$('#table_deviceLogList tbody').empty();
	var postData;
	var searchString = $('#searchCommon').val();
	if(searchString != null && searchString.length > 0) {
		postData = {
				"page" : "1",
				"rows" : objGrid.limit,
				"sortOn" : "timeStamp",
				"order" : "asc",
				"isSearch" : "true",
				"searchString" : searchString,
				"deviceId" : deviceId,
				"swBuildId" : buildId
		};
	} else {
		postData = {
				"page" : "1",
				"rows" : objGrid.limit,
				"sortOn" : "timeStamp",
				"order" : "asc",
				"isSearch" : "false",
				"deviceId" : deviceId,
				"swBuildId" : buildId
		};
	}
	$.ajax({
		type : 'POST',
		url : "/api/device/v1/debugLogList",
		contentType : "application/json",
		data : createDataPacket(postData),
		dataType : 'json'
	}).complete(function(data) {
		try {
			if (data.responseJSON != null && data.responseJSON.httpStatusCode == 200) {
				drawTable(data.responseJSON.list, 'debugLogList');
				objGrid.total = data.responseJSON.total;
				objGrid.page = data.responseJSON.page;
				drawPaginator();
			} else {
				$('.messages').html(data.responseJSON.message);
			}
		} catch (error) {
			$('.messages').html(error.message);
		}
	});
}

function getUrl(deviceId){
	objUrlParam.deviceId=deviceId;
	return './deviceInfo.jsp?'+ getEncodedNotification();
}

function getDebugLogTable(list) {
	 if(list.length){
		 $.each(list, function(key,val) {
			 var tableRow=''; 
			 tableRow 	= '<tr>'
			/*	 +'<td><input type="checkbox" class="tbl_checkbox" id="checkbox_' + val.eventId + '"></td>'*/
				 +'<td><img class="img-circle" src="../../images/device.png"></td>'
				 +'<td><div>'
				 + ((isAdmin == "true") ? ('<a href="'+getUrl(deviceId)+'" class="rActive rMargin nowrap">' + deviceSerialNo + '</a>') : ('<span class="rMargin nowrap">' + deviceSerialNo + '</span>'))
				 +'<div class="rInActive fontItalicClass">' + swBuildVersion + '</div>'
				 +'</div>'
				 +'</td>'
				 +'<td><span>' + val.eventName + '</span></td>'
				 +'<td class="rActive">' + getCreatedTime(val.timeStamp) + '</td>'
				 +'<td>' + getDownloadUrl(val) + '</td>'
				 +'</tr>';
			 $('#table_debugLogList tbody').append(tableRow);
		 });
	 }else{
		 $('#table_debugLogList tbody').html('<tr><td colspan="8" class="text-center">Data Not found.</td></tr>');
	 }
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
	return '<a href="/downloadFile?URL=' + item.logFile + '"><span title="' + url + '" class="rActive">' + shortenName(url, 30) + '</span></a>';
}

function getCreatedTime(d1) {
	if (typeof d1 == 'string' || typeof d1 == 'number') {
		d1 = new Date(parseInt(d1));
	}
	var d2 = new Date();
	var sec = d2.getTime() - d1.getTime();
	var second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour, month = day * 30, year = day * 365;
	sec = (sec % year);
	var m = Math.floor(sec / month);
	sec = (sec % month);
	var d = Math.floor(sec / day);
	sec = (sec % day);
	var hrs = Math.floor(sec / hour);
	sec = (sec % hour);
	var min = Math.floor(sec / minute);
	var y = d2.getFullYear() - d1.getFullYear();
	var strMessage = "";
	var count = 0;
	if (y == 1) {
		strMessage = y + " " + translate('time.year');
		count++;
	} else if (y > 1) {
		strMessage = y + " " + translate('time.years');
		count++;
	}
	if (m == 1) {
		strMessage = strMessage + " " + m + " " + translate('time.month');
		count++;
	} else if (m > 1) {
		strMessage = strMessage + " " + m + " " + translate('time.months');
		count++;
	}
	if (count == 2) {
		return strMessage.length ? strMessage + " " + translate('time.ago')
				: translate('time.Now');
	}
	if (d == 1) {
		strMessage = strMessage + " " + d + " " + translate('time.day');
		count++;
	} else if (d > 1) {
		strMessage = strMessage + " " + d + " " + translate('time.days');
		count++;
	}
	if (count == 2) {
		return strMessage.length ? strMessage + " " + translate('time.ago')
				: translate('time.Now');
	}
	if (hrs == 1) {
		strMessage = strMessage + " " + hrs + " " + translate('time.hr');
		count++;
	} else if (hrs > 1) {
		strMessage = strMessage + " " + hrs + " " + translate('time.hrs');
		count++;
	}
	if (count == 2) {
		return strMessage.length ? strMessage + " " + translate('time.ago')
				: translate('time.Now');
	}
	if (min == 1) {
		strMessage = strMessage + " " + min + " " + translate('time.minute');
	} else if (min > 1) {
		strMessage = strMessage + " " + min + " " + translate('time.minutes');
	}
	if (y == 0 && m == 0 && d == 0 && hrs == 0 && min == 0) {
		return " " + translate('time.Now');
	}
	return strMessage.length ? strMessage + " " + translate('time.ago')
			: translate('time.Now');
}
var searchText = "";
function drawBuildData(){
	deviceSerialNo = '';
	$('#searchCommon').val(searchText);
	getDeviceLogList(1);
	$('#div_deviceList').removeClass('hidden');
	$('#div_commonSearchBox').removeClass("hidden");
	$('#device_debugLogList').addClass('hidden');
	$('#div_swBuildSelection').removeClass('hidden');
	objActionMapper.loadPage = 'getDeviceLogList';
}