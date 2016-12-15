
var deviceId = 0;
var buildId = 0;
var deviceSerialNo = "";
var deviceModel = "";
var swBuildVersion = "";
$(document).ready(function() {
	$('#tn_wizard').addClass('active');
	objMode.nav.selected = 'wizard';
	objMode.nav.selected_tab='debugLogs';
	loadNav();
	showUrlNotification();
	if (objUrlParam.deviceId != null) {
		deviceId = objUrlParam.deviceId;
		buildId = objUrlParam.buildId;
		deviceSerialNo = objUrlParam.deviceSerialNo;
		deviceModel = objUrlParam.deviceModel;
		swBuildVersion = objUrlParam.swBuildVersion;
		getDebugLogs(1);
	}
});


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
				 +'<a href="'+getUrl(deviceId)+'" class="rActive rMargin nowrap">' + deviceSerialNo + '</a>'
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
		 $('#table_debugLogList tbody').html('<td colspan="7" class="text-center">Data Not found.</td>');
	 }
}

function getDownloadUrl(item) {
	var url = item.logUrl;
	if(url == null || url == "") {
		return "--";
	}
	var n = url.lastIndexOf("/");
	if(n >= 0) {
		url = url.substring(n + 1, url.length);
	}
	return '<a href="/downloadFile?URL=' + item.logUrl + '"><span title="' + url + '" class="rActive">' + shortenName(url, 30) + '</span></a>';
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