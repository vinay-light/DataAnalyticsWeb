var modelId = 0;
var modelStatus = 'ACTIVE';
var pageNumber = 1;
$(document).ready(function() {
	$('#tn_device').addClass('active');
	objMode.nav.selected = 'device';
	loadNav();
	getPageStatusData();
	showUrlNotification();
	if(objUrlParam.modelId != null) {
		modelId = objUrlParam.modelId;
		modelStatus = objUrlParam.modelStatus;
	}
	getSoftwareBuildList(pageNumber); 
	$('button.add_disable, button.add_enable').click(disableSwBuilds);
	$('button.add_delete').click(function(){
		$('#confirmMessage').html("Are you sure you want to delete device(s)?");
		$('#div_confirmDialog1').modal('show');
	});
	$('#div_confirmDialog1 #btn_delete').click(deleteSwBuilds);
	objActionMapper.search = 'getSoftwareBuildList';
	$('#div_commonSearchBox').removeClass("hideElementCls");
	$('#searchCommon').attr('placeholder', 'search by build name');
	activateSearchTrigger();
	objActionMapper.loadPage = 'getSoftwareBuildList';
	$('.breadcrumb1').attr('onclick', "javascript:window.location='./deviceModels.jsp'");
	$('#breadcrumActionbar').removeClass("hideElementCls");
	$('#actionDeviceModel').removeClass('hidden');
	$('#actionBuild').removeClass('hidden');
	$('#actionBuild').addClass('active');
	if(isAdmin == null || isAdmin == "false") {
		actionMenu.device.add_disable = false;
		actionMenu.device.add_delete = false;
		actionMenu.disable.add_disable = false;
		actionMenu.disable.add_delete = false;
	}
});

function disableSwBuilds(event) {
	var idList = getSelectedDeviceIds();
	var status = $(event.target).hasClass("add_enable")?true:false;
	deactivateActivateRecord(idList, "deviceSwBuild", status);
}

function getSelectedDeviceIds() {
	var idList = [];
	var selectedCheckBox = jQuery("#table_buildList :checkbox:not(.checkAll):checked");
	if (selectedCheckBox.length) {
		$.each(selectedCheckBox, function(key, val) {
			idList.push(val.id.split('_')[1]);
		});
	}
	return idList;
}
function deleteSwBuilds() {
	var idList = getSelectedDeviceIds();
	deleteRecords(idList, "deviceSwBuild");
	$('#div_confirmDialog1').modal('hide');
}

function getSoftwareBuildList(pageNo) {
	if(pageNo == null && pageNo <= 0) {
		pageNo = 1;
	}
	pageNumber = pageNo;
	var postData;
	var searchString = $('#searchCommon').val();
	var order = 'asc';
	var sortColumn = "buildName";
	var objCheckAll = jQuery("#table_buildList :checkbox." + clsCheckAll);
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
				"usePagination" : "true"
		};
	} else {
		postData = {
				"page" : pageNumber,
				"rows" : objGrid.limit,
				"sortOn" : sortColumn,
				"order" : order,
				"modelId" : modelId,
				"isSearch" : "false",
				"usePagination" : "true"
		};
	}
	$.ajax({
		type : 'POST',
		url : "/api/model/v1/getAllSoftwareBuilds",
		data : createDataPacket(postData),
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				drawTable(responseData.responseJSON.list, 'deviceBuildList');
				objGrid.total = responseData.responseJSON.total;
				objGrid.page = responseData.responseJSON.page;
				drawPaginator();
				activateCheckAll('table_buildList', updateCheckBox);
				setPageStatusData();
			} else {
				$('.messages').html(responseData.responseJSON.message);
			}
		} catch (error) {
			$('.messages').html(error.message);
		}
	});
}
function getBuildTable(list){
	if(list.length){
		 $.each(list, function(key,val){
			 var tableRow =
				 '<tr>'
				 +'<td><input type="checkbox" class="tbl_checkbox" data_status="' + val.status + '" data_id="'+val.buildId+'"  id="checkbox_' + val.buildId + '" ' + (modelStatus == "INACTIVE" ? "disabled" : "") + '></td>'
				 +'<td><span>' + val.buildName + '</span></td>'
				 +'<td>' + val.status + '</td>'
				 +'<td>' + val.buildType + '</td>'
				 +'<td>' + getCustomDate(new Date(val.createdTs)) + '</td>'
				 +'</tr>';
			 $('#table_buildList tbody').append(tableRow);
		 });
	 }else{
		 $('#table_buildList tbody').html('<td colspan="7" class="text-center">Data Not found.</td>');
	 }
	if(modelStatus == "INACTIVE") {
		 var parentCheckBox = $("#table_buildList").find('.checkAll');
		 parentCheckBox.attr("disabled", true);
		 $('#notification').html("<span class='col-xs-12 rowSpace_2 notification_error'>Build selection is disabled since parent Model is disabled.</span>");
	 }
}