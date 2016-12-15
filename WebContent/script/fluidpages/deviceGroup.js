var pageNumber = 1;
$(document).ready(function() {
	$('#tn_groups').addClass('active');
	objMode.nav.selected = 'groups';
//	objMode.nav.selected_tab='deviceGroup';
	loadNav();
	getPageStatusData();
	loadActionBar('deviceGroup');
	$('button.add_group').click(addGroup);
	$('button.add_delete').click(function() {
		var idList = getIdList();
		var message = "Are you sure you want to delete device group(s)?";
		if(idList.indexOf(currentGroupId) >= 0) {
			message = "Selected group list contains your preferred group '" + currentGroupName + "'.<br>" + message;
		}
		$('#confirmMessage').html(message);
		$('#div_confirmDialog1').modal('show');
	});
	$('#div_confirmDialog1 #btn_delete').click(deleteGroup);
	$('button.add_disable').click(deactivateGroup);
	$('button.add_enable').click(activateGroup);
	getDeviceGroupList(pageNumber);
	objActionMapper.search = 'getDeviceGroupList';
	$('#div_commonSearchBox').removeClass("hideElementCls");
	$('#searchCommon').attr('placeholder', 'search by group name');
	activateSearchTrigger();
	objActionMapper.loadPage = 'getDeviceGroupList';
	$('#breadcrumActionbar').removeClass("hideElementCls");
	$('#actionDeviceModel').removeClass('hidden');
	$('.breadcrumb1').html("Groups");
});
function addGroup() {
	objUrlParam.pageMode = 'Create';
	window.location = "/pages/deviceGroupInfo.jsp?"+ getEncodedNotification();
}

function getIdList() {
	var idList = [];
	var selectedCheckBox = jQuery("#table_groupList :checkbox:not(.checkAll):checked");
	if(selectedCheckBox.length){
		$.each(selectedCheckBox, function(key,val){			
			idList.push(val.id.split('_')[1]);
		});
	}
	return idList;
}
function deleteGroup(){
	var idList = getIdList();
	deleteRecords(idList,"deviceGroup");
	$('#div_confirmDialog1').modal('hide');
}
function deactivateGroup(){
	var idList = [];
	var selectedCheckBox = jQuery("#table_groupList :checkbox:not(.checkAll):checked[data_status=ACTIVE]");
	if(selectedCheckBox.length){
		$.each(selectedCheckBox, function(key,val){			
			idList.push(val.id.split('_')[1]);
		});
	}
	deactivateActivateRecord(idList,"deviceGroup",false);
}
function activateGroup(){
	var idList = [];
	var selectedCheckBox = jQuery("#table_groupList :checkbox:not(.checkAll):checked[data_status=INACTIVE]");
	if(selectedCheckBox.length){
		$.each(selectedCheckBox, function(key,val){			
			idList.push(val.id.split('_')[1]);
		});
	}
	deactivateActivateRecord(idList,"deviceGroup",true);
}
//jQuery("#table_groupList :checkbox:not(.checkAll):checked").attr('id').split('_')[1]
function getDeviceGroupList(pageNo) {
	disableObject("#table_groupList");
	if(pageNo == null && pageNo <= 0) {
		pageNo = 1;
	}
	pageNumber = pageNo;
	var postData;
	var searchString = $('#searchCommon').val();
	var order = 'asc';
	var sortColumn = "groupName";
    var objCheckAll = jQuery("#table_groupList :checkbox." + clsCheckAll);
    objCheckAll.prop("checked", false);
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
				"usePagination" : "true"
		};
	} else {
		postData = {
				"page" : pageNumber,
				"rows" : objGrid.limit,
				"sortOn" : sortColumn,
				"order" : order,
				"isSearch" : "false",
				"usePagination" : "true"
		};
	}
	$.ajax({
		type : 'POST',
		url : "/api/group/v1/getall",
		data : createDataPacket(postData),
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				drawTable(responseData.responseJSON.list, 'groupList');
				objGrid.total = responseData.responseJSON.total;
				objGrid.page = responseData.responseJSON.page;
				drawPaginator();
				activateCheckAll('table_groupList', updateCheckBox);
				setPageStatusData();
			} else {
				$('.messages').html(responseData.responseJSON.message);
			}
		} catch (error) {
			$('.messages').html(error.message);
		}
		disableObject("#table_groupList",true);
	});
}
function getGroupTable(list){
	 if(list.length){
		 $.each(list, function(key,val){
			 var tableRow='';
			 objUrlParam.groupId = val.groupId;
			 objUrlParam.groupName = val.groupName;
			 objUrlParam.pageMode = "Edit";
			 tableRow 	= '<tr>'
				 +'<td><input type="checkbox" data_status="'+val.status+'" class="tbl_checkbox" data_id="'+val.groupId+'" id="checkbox_'+val.groupId+'" '+ (val.isReadOnly ? "disabled" : "") + '></td>'
				 +'<td><span class="rActive"><a href="/pages/deviceGroupInfo.jsp?' + getEncodedNotification()  + '">'+val.groupName+'</a></span></td>'
				 +'<td>'+deviceCount(val, './deviceList.jsp?')+'</td>'
				 +'<td>'+getStatus(val.status)+'</td>'
				 +'</tr>';
			 $('#table_groupList tbody').append(tableRow);
		 });
	 }else{
		 $('#table_groupList tbody').html('<td colspan="7" class="text-center">Data Not found.</td>');
	 }
}
function deviceCount(val,fileName){
	if(val.deviceCount)
		return '<a href="' + getUrl(val, fileName) + '">' + val.deviceCount+'</a>';
	else
		return 0;
}
function getUrl(val, fileName) {
	var temp = objUrlParam;
	objUrlParam = {};
	objUrlParam.groupId = val.groupId;
	objUrlParam.modelStatus = val.status;
	objUrlParam.pageMode = 'Groups';
	var url = fileName + getEncodedNotification();
	objUrlParam = temp;
	return url;
}