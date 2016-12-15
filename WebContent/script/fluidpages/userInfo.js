var arrNewAccordians = ["group"];
var data={};
var isReadOnlyUser = false;
$(document).ready(function() {
	$('#tn_user').addClass('active');
	activateAccordians();
	$('#navTabContainer').hide();
	$('.add_search').hide();
//	$('#action_userInfo').removeClass('hidden');
	data = JSON.parse($.base64.decode(window.location.href.split('?strParam=')[1]));
	if(isAdmin == null || isAdmin == "false") {
		actionMenu.view.add_disable = false;
		actionMenu.view.add_delete = false;
		actionMenu.edit.add_disable = false;
		actionMenu.edit.add_delete = false;
	}
	loadActionBar("edit");
	userInfo();
	$('form#userUpdate').submit(function(){
		deviceInfo('save');
	});
	$('.btnGroupActionBar .add_edit').click(function(){
		$('input#edit').trigger("click");
		loadActionBar("edit");
	});
	$('.btnGroupActionBar .add_disable').click(function(){
		$('input#deactivate').trigger("click");
	});
	$('.btnGroupActionBar .add_enable').click(function(){
		$('input#activate').trigger("click");
	});
	$('.btnGroupActionBar .add_delete').click(function(){
		$('input#delete').trigger("click");
	});
	$('.btnGroupActionBar .add_cancel').click(function(){
		deviceInfo('cancel');
	});
	$('.btnGroupActionBar .add_save').click(function(){
		$('input#save').trigger("click");
	});
});
function deleteInfo(){
	callAjaxDelete('/api/user/v1/delete',[data.id],'/pages/userList.jsp?');
}
var userData = {};
function userInfo(){
	userData = data = JSON.parse($.base64.decode(window.location.href.split('?strParam=')[1]));
	if(userData.id){ //Edit User
		if(isAdmin == null || isAdmin == "false") {
			loadActionBar("none");
		} else {
			isReadOnlyUser = userData.isReadOnly;
			if(isReadOnlyUser) {
				actionMenu.view.add_delete = false;
			} else {
				actionMenu.view.add_delete = true;
				if(data.status != "ACTIVE") {
					$("#activate,#deactivate").toggleClass("hidden");
					$("#info-status").toggleClass("inactive");
					actionMenu.view.add_disable = false;
					actionMenu.view.add_enable = true;
				} else {
					actionMenu.view.add_disable = true;
					actionMenu.view.add_enable = false;
				}
			}
			if(userData.isAdmin) {
				actionMenu.view.add_edit = false;
			}
			loadActionBar("view");
		}
		$('#info_user_userName.view-mode').html(userData.firstName +' '+ userData.lastName);
//		$('#user_status').html(getStatus(data.status, 'info'));
		$("#user_firstName").val(data.firstName);
		$("#user_lastName").val(data.lastName);
		$("#info_email").html(userData.userName);
		if(typeof data.groupList != 'undefined'){
		if(data.groupList.length){
			var groupLength = data.groupList.length > 1 ? '&amp; '+(data.groupList.length - 1) +' more..' : '';
			$('#user_deviceGroup').html(data.groupList[0].groupName +' '+ groupLength);
		}else{
			data.groupList = [];
			$('#user_deviceGroup').html('No device');
		}
		}else{
			data.groupList = [];
			$('#user_deviceGroup').html('No device');
		}
	}else{ //Add user
		switchMode('edit','#user_userInfo');
		data.groupList = [];	
	}
	getAllGroups(data.groupList);
}

function getAllGroups(arrGroups){
	$.ajax({
		type : 'GET',
		url : "/api/group/v1/allGroupNames",
		contentType: "application/json",
	}).complete(function(responseData) {
		try {
			if(responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				groupData = responseData.responseJSON.data;
	    		addRecords("group", groupData, "groupName", "groupId", true);
	    		if(arrGroups.length != 0){
					selectRecords("group", arrGroups, "groupName", "groupId", true);
	    		}
			}else{
				$('.notification_error').html(responseData.responseJSON.message);
			}
		} catch(error) {
			$('.notification_error').html(error.message);
		}
	});
}

function save(){
//	$('form#userUpdate').submit(function(){
	var groupIDJSONArray = [];
	$.each($("#id_group_selected>ul>li.selected"), function(index, value) {
		groupIDJSONArray.push($(value).attr("data_id"));
	});
	var postData = {"userId" : data.id,
			"userName" : data.userName,
			"firstName" : $('#user_firstName').val().trim(),
			"lastName" : $('#user_lastName').val().trim(),
			"groups" : groupIDJSONArray.toString()
	};
	
	$.ajax({
		type : 'POST',
		url : "/api/user/v1/update",
		data : createDataPacket(postData),
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if (responseData.responseJSON != null
					&& responseData.responseJSON.httpStatusCode == 200) {
				window.location ='./userList.jsp';
				$('.notification_error').html(responseData.responseJSON.message);
			} else {
				$('.notification_error').html(responseData.responseJSON.message);
			}
		} catch (error) {
			$('.notification_error').html(error.message);
		}
	});
//	});
}


function deactivateInfo(isSuccess){
	if(typeof isSuccess == 'undefined'){
		deactivateActivateRecord([userData.id], 'user',false,"deactivateInfo");
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
		deactivateActivateRecord([userData.id], 'user',true,"activateInfo");
	}else if(isSuccess){
		$("#activate,#deactivate").toggleClass("hidden");
		$("#info-status").toggleClass("inactive");
		actionMenu.view.add_disable = true;
		actionMenu.view.add_enable = false;
		loadActionBar("view");
		
	}
}

function editUser() {
	switchMode('edit','#user_userInfo');
	if(isReadOnlyUser) {
		$('#user_firstName, #user_lastName').hide();
		$('#user_firstName, #user_lastName').removeAttr( "pattern");
		$('#info_user_userName, #user_deviceGroup').show();
	}
}