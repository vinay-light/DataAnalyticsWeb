var errorMsg = 'This feature not implemented yet.';
var arrDeviceGroups = [];
var arrNewAccordians = ["group"];
var deviceId = 0;
var deviceData = {};
var deviceSerialNo = 'No device';
$(document).ready(function() {
	$('#tn_device').addClass('active');
	$("#action_deviceInfo").after('<button class="pull-right btn btn-info btn-sm" id="toggleViewSummary">Group Info</button><button class="pull-right btn-sm btn btn-info hidden" id="toggleViewDetails">Details</button>');
	objMode.nav.selected = 'device';
	$("#toggle_map_size").click(toggleMapSize);
	activateAccordians();
	loadNav();
	showUrlNotification();
	if (objUrlParam.deviceId != null) {
		deviceId = objUrlParam.deviceId;
		deviceSerialNo = objUrlParam.deviceSerialNo;
		getDeviceInfo();
	}
	if(isAdmin == null || isAdmin == "false") {
		actionMenu.device.add_disable = false;
		actionMenu.device.add_enable = false;
		actionMenu.device.add_delete = false;
	}
	loadActionBar("device");
	$('.add_search').hide();
	$('.btnGroupActionBar .add_disable').click(function(){
		$('input#deactivate').trigger("click");
	});
	$('.btnGroupActionBar .add_enable').click(function(){
		$('input#activate').trigger("click");
	});
	$('.btnGroupActionBar .add_delete').click(function(){
		$('#confirmMessage').html("Are you sure you want to delete device?");
		$('#div_confirmDialog1').modal('show');
	});
	$('#div_confirmDialog1 #btn_delete').click(deletedevice);

	$("#toggleViewDetails,#toggleViewSummary").click(function(){
		$("#toggleViewDetails,#toggleViewSummary,#div_moreDeviceInfo,#div_deviceGroups").toggleClass("hidden");
	});
	$("#div_device_Info").on("click","input#deactivate",function(){deactivateActivateRecord([deviceData.deviceId], "device", false,"toggleDeviceStatus");});
	$("#div_device_Info").on("click","input#activate",function(){deactivateActivateRecord([deviceData.deviceId], "device", true,"toggleDeviceStatus");});
	$("#div_device_Info").on("click","input#delete",function(){deleteRecords([deviceData.deviceId], "device");});
	
	if(objUrlParam.pageMode=='Groups'){
		$('.breadcrumb1').html(objUrlParam.pageMode);
		$('.breadcrumb1').attr('onclick', "javascript:window.location='./deviceGroup.jsp'");
	}else{
		$('.breadcrumb1').html('Model');
		$('.breadcrumb1').attr('onclick', "javascript:window.location='./deviceModels.jsp'");
	}
	$('.breadcrumb3').attr('onclick', "javascript:window.location='./deviceList.jsp?" + getEncodedNotification() + "'");
	$('#breadcrumActionbar').removeClass("hideElementCls");
	$('#actionDeviceModel').removeClass('hidden');
	$('#actionDevice').removeClass('hidden');
	$('.breadcrumb4').html(deviceSerialNo);
	$('#actionComponent').removeClass('hidden');
	$('#actionComponent').addClass('active');
	$('#actionDevice').addClass('active');
});

function expandMap(){
	if($("#lnk_expandMap").attr("data-expanded")){
		$("#lnk_expandMap").removeAttr("data-expanded");
		$("#lnk_expandMap").text("Expand");
		$("#mapOverlay").css("height","auto");
		$("#lnk_expandMap").attr("title","Expand Map");
	}else{
		$("#lnk_expandMap").attr("data-expanded","true");
		$("#mapOverlay").css("height",((window.innerHeight-200)>250?(window.innerHeight-250):250)+"px");
		$("#lnk_expandMap").text("Shrink");
		$("#lnk_expandMap").attr("title","Shrink Map");
	}
}
function toggleMapSize(e){
	var obj = $(e.target);
	if(obj.hasClass("expanded")){
		obj.parent().css("height","");
	}else{
		obj.parent().css("height",obj.parent().height()*2);
	}
	obj.toggleClass("expanded");
	
}

function deletedevice() {
	var idList = [];
	idList.push(deviceId);
	deleteRecords(idList, "device");
}
function toggleDeviceStatus(isSuccess) {
	if(isAdmin == null || isAdmin == "false") {
		return false;
	}
	var status = ($("#device_status").val()=="INACTIVE")?false:true;
	if(isSuccess){
		if(status){
			$("#span_status").text("INACTIVE").addClass("btn-danger").removeClass("btn-success");
			$("#device_status").val("INACTIVE");
			actionMenu.device.add_enable = true;
			actionMenu.device.add_disable = false;
			
		}
		else{
			$("#span_status").text("ACTIVE").addClass("btn-success").removeClass("btn-danger");		
			$("#device_status").val("ACTIVE");
			actionMenu.device.add_enable = false;
			actionMenu.device.add_disable = true;
		}
		loadActionBar("device");	
		//$("#div_device_Info input#deactivate").toggleClass("hidden");
		//$("#div_device_Info input#activate").toggleClass("hidden");
	}
}

function getDeviceInfo() {
	$.ajax({
		type : 'GET',
		url : "/api/device/v1/deviceInfo/"+objUrlParam.deviceId,
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(responseData) {
		var t=1;
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				var data = deviceData = responseData.responseJSON.data;
				$('#span_deviceModel').html(data.deviceModel);
				$('#span_deviceSerialNo').html(data.deviceSerialNo);
				$('#span_buildVersion').html(data.swBuildVersion);
				$('#span_lastSeen').html(new Date(data.updateTs));
				$('#span_status').html(data.status);
				$('#span_deviceModel1').html(data.deviceModel);
				$('#span_deviceSerialNo1').html(data.deviceSerialNo);
				$('#span_buildVersion1').html(data.swBuildVersion);
				$('#span_lastSeen1').html(new Date(data.updateTs));
				$('#span_status1').html(data.status);
				$("#device_status").val(data.status);
				if(isAdmin != null && isAdmin == "true") {
					if(data.status == "ACTIVE") {
						$('#deactivate').removeClass("hidden");
						actionMenu.device.add_disable = true;
						actionMenu.device.add_enable = false;
						
					} else {
						actionMenu.device.add_enable = true;
						actionMenu.device.add_disable = false;
						$('#activate').removeClass("hidden");
						$("#span_status").text("INACTIVE").addClass("btn-danger").removeClass("btn-success");
					}
					loadActionBar("device");
				}
				arrDeviceGroups = data.deviceGroups;
				if(arrDeviceGroups == null) {
					arrDeviceGroups = [];
				}

				getLocatingMap(deviceData.deviceInfo,"getDeviceGroups",arrDeviceGroups);
				drawDeviceInfo(deviceData);
//				getDeviceGroups(arrDeviceGroups);
			} else {
				$('.messages').html(responseData.responseJSON.message);
			}
		} catch (error) {
			$('.messages').html(error.message);
		}
	});
	
}

function getDeviceGroups(arrDeviceGroups){  
	   $.ajax({
	       type: 'GET',
	       url: '/api/group/v1/allGroupNames',
	       contentType: "application/json",
	       dataType: 'json'
	   }).complete(function (data) {
	    	if(validateResponse(data)) {  
	    		groupData = data.responseJSON.data;
	    		var fnAppend;
	    		addRecords("group", groupData, "groupName", "groupId", true);
	    		if(arrDeviceGroups.length != 0){
					selectRecords("group", arrDeviceGroups, "groupName", "groupId", true);
	    		}
//	    		addRecords("viewDevice", deviceData, "deviceSerialNo", "deviceId", true, fnAppend, "getAccordianContent");
//	    		if(arrDevices.length != 0){
//					selectRecords("viewDevice", arrDevices, "deviceSerialNo", "deviceId", true, fnAppend, "getAccordianContent");
//	    		}
			}
	    }); 	
}

function save(){
	//To-do: Add code to save device info
	$("#div_device_Info.edit-mode").addClass("view-mode").removeClass("edit-mode");
}