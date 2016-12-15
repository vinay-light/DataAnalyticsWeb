var arrNewAccordians = ["device"];
$(document).ready(function() {
	$('#tn_device').addClass('active');
	objMode.nav.selected = 'groups';
	showUrlNotification();
	if(objUrlParam.pageMode=="Create")
		loadActionBar("edit");
	loadNav();
	activateAccordians();
	$('form#groupUpdate').submit(function(){
		if(inputBoxLengthVaidate($(this))){
			deviceInfo('save');
		}
	});

	if(objUrlParam.groupId != null){
		$('#action_addUser').addClass('hidden');
		$('#action_viewEditUser').removeClass('hidden');
		initGroupInfo();
		$('.breadcrumb1').attr('onclick', "javascript:window.location='./deviceGroup.jsp'");
		$('.breadcrumb1').html("Groups");
		$('#breadcrumActionbar').removeClass("hideElementCls");
		$('#actionDeviceModel').removeClass('hidden');
		$('#actionBuild').removeClass('hidden');
		$('#actionBuild').addClass('active');
		$('.breadcrumb2').html(objUrlParam.groupName);
	}else{
		switchMode('edit','#deviceGroup_Info');
		var arrDevices = [];
		getDevices(arrDevices);
		$('#action_addUser').removeClass('hidden');
		$('#action_viewEditUser').addClass('hidden');
	}
	$('.btnGroupActionBar .add_edit').click(function(){
		$('input#edit').trigger("click");
		loadActionBar("edit");
	});
	$('.btnGroupActionBar .add_disable').click(function(){
		deviceInfo("deactivate");
	});
	$('.btnGroupActionBar .add_enable').click(function(){
		deviceInfo("activate");
	});
	$('.btnGroupActionBar .add_delete').click(function(){
		$('#confirmMessage').html("Are you sure you want to delete group?");
		$('#div_confirmDialog1').modal('show');
	});
	$('#div_confirmDialog1 #btn_delete').click(deleteInfo);
	$('.btnGroupActionBar .add_cancel').click(function(){
		deviceInfo('cancel');
	});
	$('.btnGroupActionBar .add_save').click(function(){
		$('input#save').trigger("click");
	});
});

function deactivateInfo(isSuccess){
	if(typeof isSuccess == 'undefined'){
		deactivateActivateRecord([objUrlParam.groupId], 'deviceGroup',false,"deactivateInfo");
	}else if(isSuccess){
		$("#activate,#deactivate").toggleClass("hidden");
		$("#info-status").toggleClass("inactive");
		actionMenu.view.add_disable = false;
		actionMenu.view.add_enable = true;
		loadActionBar("view");
	}
}
function activateInfo(isSuccess){
	if(typeof isSuccess == 'undefined'){
		deactivateActivateRecord([objUrlParam.groupId], 'deviceGroup',true,"activateInfo");
	}else if(isSuccess){
		$("#activate,#deactivate").toggleClass("hidden");
		$("#info-status").toggleClass("inactive");
		actionMenu.view.add_disable = true;
		actionMenu.view.add_enable = false;
		loadActionBar("view");
		
	}
}
function deleteInfo(){
	deleteRecords([objUrlParam.groupId], 'deviceGroup');
}
function getDevices(arrDevices){   
   $.ajax({
       type: 'GET',
       url: '/api/device/v1/allDevices',
       contentType: "application/json",
       dataType: 'json'
   }).complete(function (data) {
    	if(validateResponse(data)) {  
    		deviceData = data.responseJSON.data;
    		var fnAppend;
    		addRecords("device", deviceData, "deviceSerialNo", "deviceId", true, fnAppend, "getAccordianContent");
    		if(arrDevices.length != 0){
				selectRecords("device", arrDevices, "deviceSerialNo", "deviceId", true, fnAppend, "getAccordianContent");
    		}
    		addRecords("viewDevice", deviceData, "deviceSerialNo", "deviceId", true, fnAppend, "getAccordianContent");
    		if(arrDevices.length != 0){
				selectRecords("viewDevice", arrDevices, "deviceSerialNo", "deviceId", true, fnAppend, "getAccordianContent");
    		}
		}
    });    	
}

function getAccordianContent(obj){
	return obj['deviceSerialNo']+"<br><span class='accordianText'>"+obj['deviceModel']+"</span><span class='accordianText'>("+obj['swBuildVersion']+")</span>";
}
function initGroupInfo(){
		$.ajax({
		type : 'GET',
		url : "/api/group/v1/groupInfo/"+objUrlParam.groupId,
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				isReadOnlyGroup = responseData.responseJSON.data.isReadOnly;
				if(isReadOnlyGroup) {
					actionMenu.view.add_delete = false;
				}
				else{
					actionMenu.view.add_delete = true;
					if(responseData.responseJSON.data.status == "ACTIVE"){
						actionMenu.view.add_disable = true;
					}else{
						actionMenu.view.add_enable = true;
					}
				}
				loadActionBar("view");
//				$('#group_status').html(getStatus(responseData.responseJSON.data.status, 'info'));
				$('#groupName').html(responseData.responseJSON.data.groupName);
				$('#deviceCount').html(responseData.responseJSON.data.deviceCount+" (devices in group)");
				$('#txt_groupName').val(responseData.responseJSON.data.groupName);
				$('#txt_deviceCount').html(responseData.responseJSON.data.deviceCount+" (devices in group)");
				arrDevices = responseData.responseJSON.data.deviceList;
				getDevices(arrDevices);
				
				$("#info-status").removeClass("hidden");
				if(responseData.responseJSON.data.status != "ACTIVE"){
					$("#activate,#deactivate").toggleClass("hidden");
					$("#info-status").toggleClass("inactive");
					actionMenu.view.add_disable = false;
					actionMenu.view.add_enable = true;
				}else{
					actionMenu.view.add_disable = true;
					actionMenu.view.add_enable = false;
				}
				loadActionBar("view");

				if(responseData.responseJSON.data.isReadOnly){
					makePageReadOnly();
					actionMenu.view.add_edit = false;
					actionMenu.view.add_disable = false;
					actionMenu.view.add_enable = false;
				}
				loadActionBar("view");
			} else {
				$('.messages').html(responseData.responseJSON.message);
			}
			
		} catch (error) {
			$('.messages').html(error.message);
		}
	});
	
}

function save() {
	var postJSON = '';
	var url = '';
	var objRequestData = {};
	objRequestData.devices = [];
	$.each($("#id_device_selected>ul>li.selected"), function(index, value) {
		objRequestData.devices.push($(value).attr("data_id"));
	});
	if(objUrlParam.pageMode == 'Edit' || objUrlParam.pageMode == null) {
		postJSON = {
					'groupName' : $("#txt_groupName").val().trim(),
					"groupId":objUrlParam.groupId,
					"deviceIds": objRequestData.devices
		};
		url = '/api/group/v1/update';			
	}if(objUrlParam.pageMode =='Create'){

		postJSON = {
					'groupName' : $("#txt_groupName").val().trim(),
					'deviceIds' : objRequestData.devices
		};
		url = '/api/group/v1/add';
	}
	if(!isBusy()){
		isBusy(true);
		$ .ajax({
			type : 'POST',
			url : url,
			contentType : "application/json;charset=utf-8",
			data : createDataPacket(postJSON),
			dataType : 'json',
			timeout: 20000,
			contentType:"application/json"
			}).complete(function(data) {
				if(validateResponse(data)){
					data=data.responseJSON;
					if ( (data.httpStatusCode == 200) || (data.httpStatusCode == 201) ){
						window.location ='./deviceGroup.jsp';
						$('.notification_error').html(data.message);
					}
				}else{
					if(data.responseJSON.httpStatusCode == 500){
						$('.notification_error').html(data.responseJSON.message);
					}
				}
				isBusy(false);
			
			}).error(function(jqXHR, textStatus, errorThrown){
				$('.notification_error').html(data.responseJSON.message);
			});   
		}
}

function redirectToGroupList(msg) {
	objUrlParam = {};
	objNotification.success = msg;
	window.location = '/pages/deviceGroup.jsp?'
			+ getEncodedNotification();
}
