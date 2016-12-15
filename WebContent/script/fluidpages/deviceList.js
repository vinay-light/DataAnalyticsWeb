var modelId = 0;
var modelStatus = 'ACTIVE';
var getGroupId = null;
var pageNumber = 1;
$(document).ready(function() {
	disableObject("#deviceList");
	$('#tn_device').addClass('active');
	objMode.nav.selected = 'device';
//	objMode.nav.selected_tab = 'allDevices';
	loadNav();
	getPageStatusData();
	showUrlNotification();
	if(objUrlParam.modelId != null) {
		modelId = objUrlParam.modelId;
		modelStatus = objUrlParam.modelStatus;
	} else if(objUrlParam.groupId != null) {
		getGroupId = objUrlParam.groupId;
		modelId = null;
	} else {
		getGroupId = currentGroupId;
		modelId = currentModelId;
	}
	//loadActionBar('deviceList');
	getDeviceList(pageNumber);
	$('button.add_disable, button.add_enable').click(disableDevices);
	$('button.add_delete').click(function(){
		$('#confirmMessage').html("Are you sure you want to delete device(s)?");
		$('#div_confirmDialog1').modal('show');
	});
	$('#div_confirmDialog1 #btn_delete').click(deleteDevices);
	// $('button.searchCommonMirror').click(searchDevices);
	objActionMapper.search = 'getDeviceList';
	$('#div_commonSearchBox').removeClass("hideElementCls");
	$('#searchCommon').attr({'placeholder':'Search by device serial no, device model, software build', 'title':'Search by device serial no, device model, software build'});
	activateSearchTrigger();
	objActionMapper.loadPage = 'getDeviceList';
	if(objUrlParam.pageMode=='Groups'){
		$('.breadcrumb1').html(objUrlParam.pageMode);
		$('.breadcrumb1').attr('onclick', "javascript:window.location='./deviceGroup.jsp'");
	}else{
		$('.breadcrumb1').html('Model');
		$('.breadcrumb1').attr('onclick', "javascript:window.location='./deviceModels.jsp'");
	}
	$('#breadcrumActionbar').removeClass("hideElementCls");
	$('#actionDeviceModel').removeClass('hidden');
	$('#actionDevice').removeClass('hidden');
	$('#actionDevice').addClass('active');
	if(isAdmin == null || isAdmin == "false") {
		actionMenu.device.add_disable = false;
		actionMenu.device.add_delete = false;
		actionMenu.disable.add_disable = false;
		actionMenu.disable.add_delete = false;
	}
});

function deleteDevices() {
	var idList = getSelectedDeviceIds();
	deleteRecords(idList, "device");
	$('#div_confirmDialog1').modal('hide');
}

function getSelectedDeviceIds() {
	var idList = [];
	var selectedCheckBox = jQuery("#table_deviceList :checkbox:not(.checkAll):checked");
	if (selectedCheckBox.length) {
		$.each(selectedCheckBox, function(key, val) {
			idList.push(val.id.split('_')[1]);
		});
	}
	return idList;
}
function disableDevices(event) {
	var idList = getSelectedDeviceIds();
	var status = $(event.target).hasClass("add_enable")?true:false;
	deactivateActivateRecord(idList, "device", status);
}

function searchDevices() {
	getDeviceList(1);
}
function getDeviceList(pageNo) {
	if(pageNo == null && pageNo <= 0) {
		pageNo = 1;
	}
	disableObject("#deviceList");
	pageNumber = pageNo;
	var postData;
	var searchString = $('#searchCommon').val();
	var order = 'asc';
	var sortColumn = "deviceSerialNo";
	var objCheckAll = jQuery("#table_deviceList :checkbox." + clsCheckAll);
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
				"isSearch" : "true",
				"searchString" : searchString,
				"modelId" : modelId,
				"groupId" : getGroupId,
				"usePagination" : "true"
		};
	} else {
		postData = {
				"page" : pageNumber,
				"rows" : objGrid.limit,
				"sortOn" : sortColumn,
				"modelId" : modelId,
				"groupId" : getGroupId,
				"order" : order,
				"modelId" : modelId,
				"groupId" : getGroupId,
				"isSearch" : "false",
				"usePagination" : "true"
		};
	}
	$.ajax({
		type : 'POST',
		url : "/api/device/v1/getall",
		data : createDataPacket(postData),
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				drawTable(responseData.responseJSON.list, 'deviceList');
				objGrid.total = responseData.responseJSON.total;
				objGrid.page = responseData.responseJSON.page;
				drawPaginator();
				activateCheckAll('table_deviceList', updateCheckBox);
				setPageStatusData();
				if(modelId != 0) {
					locateMap(responseData.responseJSON.list);
				}
			} else {
				$('.messages').html(responseData.responseJSON.message);
			}
		} catch (error) {
			$('.messages').html(error.message);
		}
		disableObject("#deviceList",true);
	});
}
function getDeviceTable(list){
	 if(list.length){
		 $.each(list, function(key,val){
			 var tableRow='';
			 tableRow 	= '<tr>'
				 +'<td><input type="checkbox" class="tbl_checkbox" data_status="'+val.status+'" data_id="'+val.deviceId+'" id="checkbox_'+val.deviceId+'" ' + (modelStatus == "INACTIVE" ? "disabled" : "") + '></td>'
				 +'<td><img class="img-circle" src="../../images/device.png"></td>'
				 +'<td><div>'
				 +'<a href="'+getUrl(val.deviceId, val.deviceSerialNo)+'" class="rActive rMargin nowrap">' + val.deviceSerialNo + '</a>'
				 +'<div class="rInActive fontItalicClass">' + val.swBuildVersion + '</div>'
				 +'</div></td>'
				 +'<td><span>' + val.deviceModel + '</span></td>'
				 +'<td class="rActive">' + getGroupNames(val) + '</td>'
				 +'<td>' + getCustomDate(new Date(val.updateTs)) + '</td>'
				 +'<td>' + getCustomDate(new Date(val.createdTs)) + '</td>'
				 +'<td>' + getDeviceStatus(val.status, val.syncStatus) + '</td>'
				 +'</tr>';
			 $('#table_deviceList tbody').append(tableRow);
		 });
	 }else{
		 $('#table_deviceList tbody').html('<td colspan="7" class="text-center">Data Not found.</td>');
	 }
	 if(modelStatus == "INACTIVE") {
		 var parentCheckBox = $("#table_deviceList").find('.checkAll');
		 parentCheckBox.attr("disabled", true);
		 $('#notification').html("<span class='col-xs-12 rowSpace_2 notification_error'>Device selection is disabled since parent Model is disabled.</span>");
	 }
}

function getDeviceStatus(status, syncStatus) {
	var statusField = "";
	if (status != null) {
		statusField = '<span class="label label-success">ACTIVE</span>';
		if (status != 'ACTIVE') {
			statusField = '<span class="label label-default">' + status + '</span>';
		}
	}
	var syncStatusField = "";
	if (syncStatus != null) {
		syncStatusField = '<span class="label label-primary">SYNC</span>';
		if(syncStatus != "SYNC") {
			syncStatusField = '<span class="label label-danger">' + syncStatus + '</span>';
		}
	}
	if(statusField != "" || syncStatusField != "") {
		return statusField + "&nbsp;&nbsp;" + syncStatusField;
	}
	return '--';
}
function getUrl(deviceId, deviceSerialNo){
	objUrlParam.deviceId=deviceId;
	objUrlParam.deviceSerialNo = deviceSerialNo;
	return './deviceInfo.jsp?'+ getEncodedNotification();
}

function getGroupInfoUrl(group) {
	var temp = objUrlParam;
	objUrlParam = {};
	objUrlParam.groupId = group.groupId;
	objUrlParam.groupName = group.groupName;
	var url = './deviceGroupInfo.jsp?'+ getEncodedNotification();
	objUrlParam = temp;
	return url;
}
function getGroupNames(val) {
	var deviceGroups = val.deviceGroups;
	 if(deviceGroups != null && deviceGroups.length > 0) {
		 if(deviceGroups.length == 1) {
			 return '<a href="' + getGroupInfoUrl(deviceGroups[0]) + '" class="rActive rMargin nowrap">' + deviceGroups[0].groupName + '</a>';
		 } else if(deviceGroups.length == 2) {
			 return '<a href="' + getGroupInfoUrl(deviceGroups[0]) + '" class="rActive rMargin nowrap">' + deviceGroups[0].groupName + '</a>' + '<a href="' + getGroupInfoUrl(deviceGroups[1]) + '" class="rActive rMargin nowrap">, &nbsp;' + deviceGroups[1].groupName + '</a>';
		 } else {
			 return '<a href="' + getGroupInfoUrl(deviceGroups[0]) + '" class="rActive rMargin nowrap">' + deviceGroups[0].groupName + '</a>' + '<a href="' + getGroupInfoUrl(deviceGroups[1]) + '" class="rActive rMargin nowrap">, &nbsp;' + deviceGroups[1].groupName + '</a>' + '<a href="' + getUrl(val.deviceId, val.deviceSerialNo) + '" class="rActive rMargin nowrap">, &nbsp;' + (deviceGroups.length - 2) + '&nbsp; more</a>';
		 }
	 }
	 return '--';
}

//	LOCATING DEVICES 

var locate_map = "";
function locateMap(deviceList) {
	$('#deviceLocationsMapContainer').removeClass("hideElementCls");
	var arrObj = [];
	$.each(deviceList, function(ind, val) {
		if(val.deviceInfo != null) {
			var objPos = {
				latitude : val.deviceInfo.latitude,
				longitude : val.deviceInfo.longitude,
				title : val.deviceSerialNo,
				description : "Latitude:" + val.deviceInfo.latitude + "<br>Longitude:"
						+ val.deviceInfo.longitude + "<br>Time:" + val.deviceInfo.locationTime
			};
			arrObj[arrObj.length] = objPos;
		}
	});
	if (locate_map == "" || true) {
		Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme',
		{
			callback : function() {
				locate_map = new Microsoft.Maps.Map(
					document.getElementById('deviceLocationsMapContainer'),
					{
						credentials : "Ag-saxAGBY76bJdX8o5-TyxNtVjhV0hwsWMwIDUKIdniIWch78ce7hVRr3l3Xeg2",
						customizeOverlays : true,
						mapTypeId : Microsoft.Maps.MapTypeId.road,
						enableSearchLogo : false,
						showMapTypeSelector : false,
						theme : new Microsoft.Maps.Themes.BingTheme()
					});
				Microsoft.Maps.Events.addHandler(locate_map, 'onclick', showLabels);
				locate_map.setView({
					zoom : 0
				});
				locate_map.entities.clear();
				if (arrObj.length > 0) {
					showDeviceLocations(arrObj);
				}
			}
		});
	}
	return locate_map;
}

function showLabels() {
	$(".pushpin").addClass("labelPin");
}

function showDeviceLocations(arrObj) {
	var latitude = 0;
	var longitude = 0;
	$.each(arrObj, function(ind, val) {
		if(val.latitude != null && val.longitude != null) {
			latitude = val.latitude;
			longitude = val.longitude;
			var pin1 = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(val.latitude, val.longitude), {
	            text : val.title,    //The text for the label
	            width: 150,
	            typeName : 'labelPin',     //Assign a CSS class to the pin
	            anchor : new Microsoft.Maps.Point(val.latitude, val.longitude),  //Reset the anchor point of the pin to make aligning the text easier.
	            textOffset : new Microsoft.Maps.Point(-45,0) //Adjust textOffset point for better label positioning
	            //Adjust the x value as you see fit for better centering of text
	        });
			Microsoft.Maps.Events.addHandler(pin1, 'mouseout', showLabel);
	        Microsoft.Maps.Events.addHandler(pin1, 'mouseover', HideLabel);
	        Microsoft.Maps.Events.addHandler(pin1, 'onclick', getInfoBox);
	        Microsoft.Maps.Events.addHandler(locate_map, 'click', getInfoBox);
			locate_map.entities.push(pin1); 
			locate_map.entities.push(new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(val.latitude, val.longitude), {title: val.title, description: val.description, pushpin: pin1}));
		}
	});
	locate_map.setView({ zoom: 0, center: new Microsoft.Maps.Location(latitude, longitude) });
	$(".pushpin").addClass("labelPin");
}

function getInfoBox(event) {
	if (event.targetType == "map") {
		setTimeout(function() {
			$(".pushpin>div").show();
			$(".pushpin").addClass("labelPin");
		}, 100);
	}
}
function HideLabel(event) {
	setTimeout(function() {
		$(".pushpin>div:contains('" + event.target._text + "')").show();
		$(".pushpin").addClass("labelPin");
	}, 10);
}

function showLabel(event) {
	setTimeout(function() {
		$(".pushpin>div:contains('" + event.target._text + "')").show();
		$(".pushpin").addClass("labelPin");
	}, 10);
}
