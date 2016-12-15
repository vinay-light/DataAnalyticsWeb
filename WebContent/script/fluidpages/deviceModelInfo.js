
var arrSoftwareBuilds = [];
var arrNewAccordians = ["build"];
var modelId = 0;
$(document).ready(function() {
	$('#tn_device').addClass('active');
	objMode.nav.selected = 'device';
	showUrlNotification();
	loadNav();
	activateAccordians();
	if(objUrlParam.modelId != null) {
		$('#action_addModel').addClass('hidden');
		$('#action_viewEditModel').removeClass('hidden');
		modelId = objUrlParam.modelId;
		var deviceModel = objUrlParam.deviceModel;
		getModelInfo();
		$('.breadcrumb1').attr('onclick', "javascript:window.location='./deviceModels.jsp'");
		$('#breadcrumActionbar').removeClass("hideElementCls");
		$('#actionDeviceModel').removeClass('hidden');
		$('#actionBuild').removeClass('hidden');
		$('#actionBuild').addClass('active');
		$('.breadcrumb2').html(deviceModel);
	}
	$('#deviceModelInfo form').submit(function(e){
		return false;
	});
	loadActionBar("edit");
	if(objUrlParam.pageMode == "Create") {
		$('#action_addModel').removeClass('hidden');
		$('#action_viewEditModel').addClass('hidden');
		loadActionBar("edit");
		switchMode('edit','#deviceModelInfo');
		$('#div_modelDetailsInfo').hide();
		//$('#div_addSoftwareBuild').hide();
		//$('#div_swBuildsForModel').hide();
		$('#div_addModelDetails').removeClass('hideElementCls');
	}
	$('.add_search').hide();
	$('#div_confirmDialog1 #btn_delete').click(deleteModel);
	    $('form#userUpdate').submit(function(){
	    	if(checkValidity( $('#deviceModelInfo form'))){
	    		deviceInfo('save');
	    	}else{
	    		$('#deviceModelInfo form input:submit').trigger("click");
	    	}
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

function confirmDeleteModel() {
	// $('#confirmMessage').html(translate("common.dialog.delete.models"));
	$('#confirmMessage').html("Are you sure you want to delete device model(s)?");
	$('#div_confirmDialog1').modal('show');
}

function deleteModel() {
	var idList = [];
	idList.push(modelId);
	deleteRecords(idList, "deviceModel");
}

function deactivateModel(isSuccess) {
	if(typeof isSuccess == 'undefined'){
		deactivateActivateRecord([objUrlParam.modelId], 'deviceModel',false,"deactivateModel");
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
		deactivateActivateRecord([objUrlParam.modelId], 'deviceModel',true,"activateInfo");
	}else if(isSuccess){
		$("#activate,#deactivate").toggleClass("hidden");
		$("#info-status").toggleClass("inactive");
		actionMenu.view.add_disable = true;
		actionMenu.view.add_enable = false;
		loadActionBar("view");
	}
}

function getModelInfo() {
	$.ajax({
		type : 'GET',
		url : "/api/model/v1/modelInfo/"+objUrlParam.modelId,
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				var data = responseData.responseJSON.data;
				$('#span_deviceModel').html(data.deviceModel);
				showLatestBuildVersion(data.builds);
				$('#span_status').html(data.status);
				if(isAdmin == null || isAdmin == "false") {
					loadActionBar("none");
				} else {
					if(data.status != "ACTIVE") {
						$("#activate,#deactivate").toggleClass("hidden");
						$("#info-status").toggleClass("inactive");
						actionMenu.view.add_disable = false;
						actionMenu.view.add_enable = true;
					}
					else{
						actionMenu.view.add_disable = true;
						actionMenu.view.add_enable = false;
					}
					loadActionBar("view");
				}
				arrSoftwareBuilds = data.builds;
				if(arrSoftwareBuilds == null) {
					arrSoftwareBuilds = [];
				}
				addRecords("build", arrSoftwareBuilds, "buildName", "buildId");
				selectRecords("build", arrSoftwareBuilds, "buildName", "buildId");
			} else {
				$('.messages').html(responseData.responseJSON.message);
			}
		} catch (error) {
			$('.messages').html(error.message);
		}
	});
}

function showLatestBuildVersion(builds) {
	var latestBuildName = "";
	if(builds != null && builds.length > 0) {
		latestBuildName = builds[0].buildName;
		for(var i = 1; i < builds.length; i++) {
			if(latestBuildName.localeCompare(builds[i].buildName) < 0) {
				latestBuildName = builds[i].buildName;
			}
		}
	}
	$('#span_buildVersion').html(latestBuildName);
}

var counter = 0;
function addSoftwareBuild() {
	var buildName = $("#new_buildName").val().trim();
	if(buildName != null && buildName.length > 0) {
		if(arrAlphabet.indexOf(buildName.charAt(0).toUpperCase()) >= 0) {
			if(isBuildNameExist(buildName)) {
				$('.notification_error').html("Build name already exist.");
				$("#new_buildName").css("borderColor", "red");
			} else {
				$("#new_buildName").css("borderColor", "");
				$('.notification_error').html("");
				counter++;
				var arr = [ { "buildId" : "new_" + counter, "buildName" : buildName } ];
				addRecords("build", arr, "buildName", "buildId");
				selectRecords("build", arr, "buildName", "buildId");
			}
		} else {
			$('.notification_error').html("Software build name should start with an alphabet or a digit.");
			$("#new_buildName").css("borderColor", "red");
		}
	} else {
		$('.notification_error').html("Add software build name.");
		$("#new_buildName").css("borderColor", "red");
	}
	$("#new_buildName").val("");
}

function isBuildNameExist(buildName) {
	var list = $("#id_build_selected>ul>li.selected");
	if(list != null && list.length > 0) {
		for(var i = 0; i < list.length; i++) {
			var bldName = list[i].attributes["name"].value;
			if(buildName == bldName) {
				return true;
			}
		}
	}
	return false;
}

function save() {
	if(!checkValidity( $('#deviceModelInfo'))){
		$('#deviceModelInfo form input:submit').trigger("click");
		return false;
	}
	var postData = '';
	var url = '';
	var objRequestData = {};
	objRequestData.builds = [];
	objRequestData.softwareBuildName = [];
	if (objUrlParam.pageMode == 'Edit') {
		$.each($("#id_build_selected>ul>li.selected"), function(index, value) {
			var buildName = $(value).attr("name");
			var buildId = $(value).attr("data_id");
			if(isNaN(parseFloat(buildId))) {
				buildId = '0';
			}
			objRequestData.builds.push({"buildName" : buildName, "buildId" : buildId});
		});
		postData = {
			'modelName' : $('#span_deviceModel').html(),
			"modelId" : modelId,
			"builds" : objRequestData.builds
		};
		url = "/api/model/v1/update";
	} else if (objUrlParam.pageMode == 'Create') {
		var deviceModel = $('#input_modelName').val().trim();
		if(deviceModel == "") {
			$('.notification_error').html('Enter device model name');
			return false;
		}
		$('.notification_error').html('&nbsp;');
		$.each($("#id_build_selected>ul>li.selected"), function(index, value) {
			var buildName = $(value).attr("name");
			var buildId = $(value).attr("data_id");
			if(isNaN(parseFloat(buildId))) {
				buildId = '0';
			}
			objRequestData.softwareBuildName.push(buildName.trim());
		});
		postData = {
			'deviceModel' :deviceModel,
			'softwareBuildName' : objRequestData.softwareBuildName
		};
		url = "/api/model/v1/add";
	}
	if (!isBusy()) {
		isBusy(true);
		$.ajax({
			type : 'POST',
			url : url,
			contentType : "application/json;charset=utf-8",
			data : createDataPacket(postData),
			dataType : 'json',
			contentType : "application/json"
		}).complete( function(data) {
			if (validateResponse(data)) {
				data = data.responseJSON;
				if ((data.httpStatusCode == 200)
						|| (data.httpStatusCode == 201)) {
					if (objUrlParam.pageMode == 'Edit') {
						objUrlParam = {};
						objNotification.success = "Device model updated successfully.";
						window.location = '/pages/deviceModels.jsp?'
								+ getEncodedNotification();
					} else {
						objUrlParam = {};
						objNotification.success = "Device model added successfully.";
						window.location = '/pages/deviceModels.jsp?'
								+ getEncodedNotification();
					}
				}
			} else {
				if (data.responseJSON.httpStatusCode == 500) {
					if (objUrlParam.pageMode != 'Edit') {
						$('.notification_error').html("Device model already exist.");
					} else {
						$('.notification_error').html(data.responseJSON.message);
					}
				} else {
					$('.notification_error').html(data.responseJSON.message);
				}
			}
			isBusy(false);

		}).error(function(jqXHR, textStatus, errorThrown) {
			showError("Error while group creation!");
		});
	}
}