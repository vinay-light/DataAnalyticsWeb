var pageNumber = 1;
$(document).ready(function() {
	$('#tn_user').addClass('active');
	$('#navTabContainer').remove();
	objMode.nav.selected = 'userList';
	getPageStatusData();
	if(isAdmin == null || isAdmin == "false") {
		actionMenu.userList.add_user = false;
		actionMenu.disable.add_disable = false;
		actionMenu.disable.add_delete = false;
	}
	loadActionBar('userList');
	getUsersList(pageNumber);
	$('button.add_user').click(addUser);
	$('button.add_disable').click(dactivateUser);
	$('button.add_enable').click(dactivateUser);
	$('button.add_delete').click(function(){
		$('#div_confirmDialog1').modal('show');
	});
	$('#div_confirmDialog1 #btn_delete').click(deleteUsers);
	objActionMapper.loadPage = 'getUsersList';
	objActionMapper.search = 'getUsersList';
	activateSearchTrigger();
	$(document).on("click",".goto_details",gotoDetails);
});

function dactivateUser(event) {
	var idList = [];
	var status = $(event.target).hasClass("add_enable") ? true : false;
	var selectedCheckBox = jQuery("#table_userList :checkbox:not(.checkAll):checked");
	if (selectedCheckBox.length) {
		$.each(selectedCheckBox, function(key, val) {
			idList.push(val.id.split('_')[1]);
		});
	}
	deactivateActivateRecord(idList, "user", status);
}

function deleteUsers(){
	$('#div_confirmDialog1').modal('hide');
	var onlyCheckItem = jQuery("#table_userList :checkbox:not(.checkAll):checked");
	var arr = [];
	if(onlyCheckItem.length){
		$.each(onlyCheckItem, function(key, val){
			arr.push($(this).attr('id').split('_')[1]);
		});
	}
	deleteRecords(arr, "user");
}
function getUsersList(pageNo) {
	pageNumber = pageNo;
	var objCheckAll = jQuery("#table_userList :checkbox." + clsCheckAll);
	objCheckAll.prop("checked", false);
    objCheckAll.removeClass("checked");
	if(pageNumber == null) {
		pageNumber = 1;
	}
	var postData;
	var searchString = $('#searchCommon').val();
	var order = 'asc';
	var sortColumn = "firstName";
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
				"searchString" : searchString
		};
	} else {
		postData = {
				"page" : pageNumber,
				"rows" : objGrid.limit,
				"sortOn" : sortColumn,
				"order" : order,
				"usePagination" : true,
				"isSearch" : "false"
		};
	}
	$('#table_userList tbody').empty();
	disableObject("#table_userList");
	$.ajax({
		type : 'POST',
		url : "/api/user/v1/getall",
		data : createDataPacket(postData),
		contentType : "application/json",
		dataType : 'json'
	}).complete(
			function(responseData) {
				try {
					if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
						drawTable(responseData.responseJSON.list, 'userList');
						objGrid.total = responseData.responseJSON.total;
						objGrid.page = responseData.responseJSON.page;
						drawPaginator();
						activateCheckAll('table_userList', updateCheckBox);
						setPageStatusData();
					} else {
						$('.messages').html(responseData.responseJSON.message);
					}
				} catch (error) {
					$('.messages').html(error.message);
				}
				disableObject("#table_userList",true);
			});
}

function addUser() {
	window.location = "./addUser.jsp";
}
function getUserTable(list){
	 if(list.length){
		 var temp =  objUrlParam;
		 $.each(list, function(key,val){
			 var tableRow='';
			 objUrlParam = {};
			 objUrlParam.id = val.userId;
			 objUrlParam.userName = val.userName;
			 objUrlParam.firstName =  val.firstName;
			 objUrlParam.lastName = val.lastName;
			 objUrlParam.groupList = val.groupList;
			 objUrlParam.status = val.status;
			 objUrlParam.isAdmin = (val.adminAccess == "true");
			 objUrlParam.isReadOnly = val.isReadOnly;
			 tableRow 	= '<tr>'
				 +'<td><input class="tbl_checkbox" data_status="'+val.status+'" status="'+val.status+'" type="checkbox" data_id="'+val.userId+'" id="checkbox_'+val.userId+'" ' + (val.isReadOnly ? "disabled" : "") + '></td>'
				 +'<td><span class="rActive"><a href="./userInfo.jsp?'+getEncodedNotification()+'" title="'+val.firstName+'">'+firstName(val.firstName +' '+ val.lastName)+'</a></span></td>'
				 +'<td class="rActive">' + getGroupNames(val.groupList, val.userId) + '</td>'
				 +'<td>'+getStatus(val.status)+'</td>'
				 +'</tr>';
			 $('#table_userList tbody').append(tableRow);
		 });
		 objUrlParam = temp;
	 }else{
		 $('#table_userList tbody').html('<td colspan="4" class="text-center">Data Not found.</td>');
	 }
}
function getGroupInfoUrl(group) {
	objUrlParam.groupId = group.groupId;
	objUrlParam.groupName = group.groupName;
	return './deviceGroupInfo.jsp?'+ getEncodedNotification();
}
function getGroupNames(deviceGroups, userId) {
	 if(deviceGroups != null && deviceGroups.length > 0) {
		 if(deviceGroups.length == 1) {
			 return '<a href="' + getGroupInfoUrl(deviceGroups[0]) + '" class="rActive rMargin nowrap">' + deviceGroups[0].groupName + '</a>';
		 } else if(deviceGroups.length == 2) {
			 return '<a href="' + getGroupInfoUrl(deviceGroups[0]) + '" class="rActive rMargin nowrap">' + deviceGroups[0].groupName + '</a>' + '<a href="' + getGroupInfoUrl(deviceGroups[1]) + '" class="rActive rMargin nowrap">, &nbsp;' + deviceGroups[1].groupName + '</a>';
		 } else {
			 return '<a href="' + getGroupInfoUrl(deviceGroups[0]) + '" class="rActive rMargin nowrap">' + deviceGroups[0].groupName + '</a>' + ', &nbsp;<a href="' + getGroupInfoUrl(deviceGroups[1]) + '" class="rActive rMargin nowrap">' + deviceGroups[1].groupName + '</a>' + ', &nbsp;<a href="javascript:" title="View Details" class="goto_details rActive rMargin nowrap">' + (deviceGroups.length - 2) + '&nbsp; more</a>';
		 }
	 }
	 return '--';
}

function gotoDetails(obj){
	if(obj.type == 'click'){
		obj = $(obj.target);
		obj.closest("tr").find("td:nth-child(2) a")[0].click();
	}
}