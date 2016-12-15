var arrNewAccordians = ["group"];
$(document).ready(function() {
	$('#tn_user').addClass('active');
	objMode.nav.selected = 'userList';
	$('#navTabContainer').remove();
	$('.add_search').hide();
	$('#form_addUser').submit(function(e) {
		if(checkValidity($('#form_addUser')) && !$('#form_addUser').attr("data-is_invalid")){
			saveUser();
		}
//		e.preventDefault();
		return false;
	});
	loadActionBar("edit");
	activateAccordians();
	getAllGroups();
	$(".btnGroupActionBar .add_save").click(function(){
		$('input#save').trigger("click");
	});
	$(".btnGroupActionBar .add_cancel").click(function(){
		deviceInfo('cancel');
	});
});

function saveUser(){
	var groupIDJSONArray = [];
	$.each($("#id_group_selected>ul>li.selected"), function(index, value) {
		groupIDJSONArray.push($(value).attr("data_id"));
	});
	if(groupIDJSONArray.length){
		var postData = {
				'firstName' : $('#userFirstName').val().trim(),
				'lastName' : $('#userLastName').val().trim(),
				'userName' : $('#userEmail').val().trim(),
				'groups' : groupIDJSONArray.toString(),
				'adminAccess' : 'false'
		};
		$.ajax({
			type : 'POST',
			url : "/api/user/v1/add",
			data : createDataPacket(postData),
			contentType: "application/json",
			dataType : 'json'
		}).complete(function(responseData) {
			try {
				if(responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
					window.location = "./userList.jsp";
				}else{
					$('.notification_error').html(responseData.responseJSON.message);
				}
			} catch(error) {
				$('.notification_error').html(error.message);
			}
		});
	}else{
		$('.notification_error').html('Please add at least one group.');
	}
}

function getAllGroups(){
	$.ajax({
		type : 'GET',
		url : "/api/group/v1/allGroupNames",
		contentType: "application/json",
	}).complete(function(responseData) {
		try {
			if(responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				groupData = responseData.responseJSON.data;
	    		addRecords("group", groupData, "groupName", "groupId", true);
	    		var selectedRecord = [];
	    		$.each(groupData,function(key, val){
	    			if(val['isReadOnly']){
	    				selectedRecord.push(val);
	    			}
	    		});
	    		if(selectedRecord.length != 0){
					selectRecords("group", selectedRecord, "groupName", "groupId", true);
	    		}
			}else{
				$('.notification_error').html(responseData.responseJSON.message);
			}
		} catch(error) {
			$('.notification_error').html(error.message);
		}
	});
}