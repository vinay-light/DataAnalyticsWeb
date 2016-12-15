var pageNumber = 1;
$(document).ready(function() {
	$('#tn_device').addClass('active');
	objMode.nav.selected = 'device';
	objActionMapper.loadPage = 'getModelList';
	objActionMapper.search = 'getModelList';
	activateSearchTrigger();
	loadNav();
	getPageStatusData();
	if(isAdmin == null || isAdmin == "false") {
		actionMenu.deviceModel.add_model = false;
		actionMenu.device.add_disable = false;
		actionMenu.device.add_delete = false;
		actionMenu.disable.add_disable = false;
		actionMenu.disable.add_delete = false;
	}
	loadActionBar('deviceModel');
	getModelList(pageNumber);
	$('button.add_model').click(addModel);
	$('button.add_disable').click(disableModel);
	$('button.add_enable').click(disableModel);
	$('button.add_delete').click(function() {
		var message = "Are you sure you want to delete device model(s)?";
		var idList = getIdList();
		if(idList.indexOf(currentModelId) >= 0) {
			message = "Selected model list contains your preferred model '" + currentDeviceModel + "'.<br>" + message;
		}
		$('#confirmMessage').html(message);
		$('#div_confirmDialog1').modal('show');
	});
	$('#div_confirmDialog1 #btn_delete').click(deleteModel);
	$('#breadcrumActionbar').removeClass("hideElementCls");
	$('#actionDeviceModel').removeClass('hidden');
});

function getIdList() {
	var idList = [];
	var selectedCheckBox = jQuery("#table_modelList :checkbox:not(.checkAll):checked");
	if (selectedCheckBox.length) {
		$.each(selectedCheckBox, function(key, val) {
			idList.push(val.id.split('_')[1]);
		});
	}
	return idList;
}

function deleteModel() {
	var idList = getIdList();
	if(idList.indexOf(currentModelId) >= 0) {
		$('.messages').html("Selected model list contains currently selected model.");
	}
	deleteRecords(idList, "deviceModel");
}
function disableModel(event) {
	var idList = [];
	var status = $(event.target).hasClass("add_enable") ? true : false;
	var selectedCheckBox = jQuery("#table_modelList :checkbox:not(.checkAll):checked");
	if (selectedCheckBox.length) {
		$.each(selectedCheckBox, function(key, val) {
			idList.push(val.id.split('_')[1]);
		});
	}
	deactivateActivateRecord(idList, "deviceModel", status);
}

function getModelList(pageNo) {
	disableObject("#table_modelList");
	if(pageNo == null && pageNo <= 0) {
		pageNo = 1;
	}
	pageNumber = pageNo;
	var postData;
	var searchString = $('#searchCommon').val();
	var order = 'asc';
	var sortColumn = "modelName";
    var objCheckAll = jQuery("#table_modelList :checkbox." + clsCheckAll);
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
		url : "/api/model/v1/getall",
		data : createDataPacket(postData),
		contentType : "application/json",
		dataType : 'json'
	}).complete(
			function(data) {
				try {
					if (data.responseJSON != null
							&& data.responseJSON.httpStatusCode == 200) {
						drawTable(data.responseJSON.list, 'modelList');
						objGrid.total = data.responseJSON.total;
						objGrid.page = data.responseJSON.page;
						drawPaginator();
						activateCheckAll('table_modelList', updateCheckBox);
						setPageStatusData();
					} else {
						$('.messages').html(data.responseJSON.message);
					}
				} catch (error) {
					$('.messages').html(error.message);
				}
				disableObject("#table_modelList",true);
			});
}

function getModelTable(list) {
	if (list.length) {
		$.each(list, function(key, val) {
			var tableRow = '';
			var clsSingleton = "";
			try{
				clsSingleton = (val.builds != null && val.builds.length > 0) ? "ul_singleton_toggle" : "";
			}catch (e) {
				clsSingleton = "";
			}
			tableRow = '<tr>'
					+ '<td><input class="tbl_checkbox" data_status="' 
					+ val.status + '" type="checkbox" data_id="'+val.modelId+'" id="checkbox_'
					+ val.modelId + '"></td>' 
					+ '<td><a href="'
					+ getUrl(val,'./deviceModelInfo.jsp?')
					+ '" class="rActive rMargin nowrap limit-width" style="max-width:20em;">'
					+ val.deviceModel + '</a></td>'
					+ '<td class="">' + val.status + '</td>'
					+ '<td class="text-center">'+buildCount(val, './deviceBuildList.jsp?')+'</td>' 
					+ '<td class="text-center">'+deviceCount(val, './deviceList.jsp?')+'</td></tr>';
			$('#table_modelList tbody').append(tableRow);
		});
	} else {
		$('#table_modelList tbody').html(
				'<td colspan="4" class="text-center">Data Not found.</td>');
	}
}
function buildCount(val, fileName){
	if(val.builds != null)
		return '<a href="' + getUrl(val, fileName) + '">' + val.builds.length + '</a>';
	else
		return 0;
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
	objUrlParam.modelId = val.modelId;
	objUrlParam.deviceModel = val.deviceModel;
	objUrlParam.modelStatus = val.status;
	objUrlParam.pageMode = "Edit";
	var url = fileName + getEncodedNotification();
	objUrlParam = temp;
	return url;
}

function addModel() {
	var temp = objUrlParam;
	objUrlParam = {};
	objUrlParam.pageMode = "Create";
	var url = './deviceModelInfo.jsp?' + getEncodedNotification();
	objUrlParam = temp;
	window.location = url;
}