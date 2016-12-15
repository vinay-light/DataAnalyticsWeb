var arrNewAccordians = ["primaryEvent", "primaryPackage","secondaryEvent","secondaryPackage"];
var selectedResponse;
$(document).ready(function() {
	$('#tn_settings').addClass('active');
	objMode.nav.selected_tab = 'configrationSettings';
	$('#navTabContainer').remove();
	$('div#actionNavbar:last').hide();
	$('div#actionNavbar .btnGroupActionBar:first').html('<h4 class="rActive">Configure user defined graph</h4>');
	$('.settings_configration').removeClass('hidden');
	activateAccordians();
	getAllEventAndPackageList(getEventAndPackage);
	$('#submitEventPkg').click(saveEvntPkg);
});
$(document).on('click', '.model-dropdown-menu li > a[title]', function(){
	$(this).closest('ul').siblings('button').prop('title',$(this).attr('title'));
	$(this).closest('ul').siblings('button').find('span:first').html($(this).attr('title'));
	if($(this).closest('.selectPrimaryEvent').length)
		drawPackageForAccordian($(this).attr('title'), $(this).attr('package-name'));
	else if($(this).closest('.selectSecondaryEvent').length)
		drawPackageForAccordian($(this).attr('title'), $(this).attr('package-name'));
});
function getAllEventAndPackageList(getEventAndPackage){
	disableObject('#settings_configration');
	$.ajax({
		type : 'GET',
		url : '/api/graph/v1/dynamic-graph/events',
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(data) {
		try {
			if (data.responseJSON != null
					&& data.responseJSON.httpStatusCode == 200) {
				fetchAccordianData(data.responseJSON.data);
			} else {
				objNotification.error = data.responseJSON.message;
			}
		} catch (error) {
		}
		if(typeof getEventAndPackage == 'function'){
			getEventAndPackage();
		}
	});
}
function getEventAndPackage(){
	$.ajax({
		type : 'GET',
		url : '/api/graph/v1/userDefinedGraph/get-configuration',
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(data) {
		try {
			if (data.responseJSON != null
					&& data.responseJSON.httpStatusCode == 200) {
				selectedResponse = data.responseJSON.data;
				fetchSelectedAccordianData();
			} else {
				objNotification.error = data.responseJSON.message;
			}
		} catch (error) {
		}
		disableObject('#settings_configration',true);
	});
}
function fetchAccordianData(data){
	var primaryEventData = [];
	var primaryPackageData =[];
	var secondaryEventData =[];
	$.each(data.primary, function(ind, value){
		primaryEventData.push({'id':ind,'eventName':value});
	});
	$.each(data['package'], function(ind,value){
		primaryPackageData.push({'id':ind,'packageName':value});
	});
	$.each(data.secondary, function(ind, value){
		secondaryEventData.push({'id':ind,'eventName':value});
	});
	addRecords("primaryEvent", primaryEventData, "eventName", "id", true);
	addRecords("primaryPackage", primaryPackageData, "packageName", "id", true);
	addRecords("secondaryEvent", secondaryEventData, "eventName", "id", true);
	addRecords("secondaryPackage", primaryPackageData, "packageName", "id", true);
}
function fetchSelectedAccordianData(){
	$.each(selectedResponse.PRIMARY_AXIS, function(ind,value){
		$.each(value,function(pkgInd,pkgVal){
			$('#id_primaryPackage_available ul > li[name="'+pkgVal+'"]').find('a.anchorCls').trigger('click');
		});
		$('#id_primaryEvent_available ul > li[name="'+ind+'"]').find('a.anchorCls').trigger('click');
	});
	$.each(selectedResponse.SECONDARY_AXIS, function(ind,value){
		$.each(value,function(pkgInd,pkgVal){
			$('#id_secondaryPackage_available ul > li[name="'+pkgVal+'"]').find('a.anchorCls').trigger('click');
		});
		$('#id_secondaryEvent_available ul > li[name="'+ind+'"]').find('a.anchorCls').trigger('click');
	});
}
function addEventToDropdownList(elem, elemTxt){
	if(elem.hasClass('selected')){
		if(elem.attr('data_type')=='primaryEvent'){
			$('.selectPrimaryEvent ul > li > a').attr('package-name') == '' ? $('.selectPrimaryEvent ul').html('<li role="presentation"><a tabindex="-1" href="javascript:void(0)" package-name="prm_event" title="'+$.trim(elemTxt)+'">'+$.trim(elemTxt)+'</a></li>') : $('.selectPrimaryEvent ul').append('<li role="presentation"><a tabindex="-1" href="javascript:void(0)" package-name="prm_event" title="'+$.trim(elemTxt)+'">'+$.trim(elemTxt)+'</a></li>');
		}else if(elem.attr('data_type')=='secondaryEvent'){
			$('.selectSecondaryEvent ul > li > a').attr('package-name') == '' ? $('.selectSecondaryEvent ul').html('<li role="presentation"><a tabindex="-1" href="javascript:void(0)" package-name="sec_event" title="'+$.trim(elemTxt)+'">'+$.trim(elemTxt)+'</a></li>') : $('.selectSecondaryEvent ul').append('<li role="presentation"><a tabindex="-1" href="javascript:void(0)" package-name="sec_event" title="'+$.trim(elemTxt)+'">'+$.trim(elemTxt)+'</a></li>');
		}
	}else{
		if(elem.attr('data_type')=='primaryEvent'){
			$('.selectPrimaryEvent ul > li').length === 1 ? $('.selectPrimaryEvent ul').html('<li role="presentation"><a tabindex="-1" href="javascript:void(0)" package-name="">No Event</a></li>') : $('.selectPrimaryEvent ul > li a[title="'+elemTxt+'"]').closest("li").remove();
			if($('.selectPrimaryEvent button').attr('title') == elemTxt){
				$('.selectPrimaryEvent button').prop('title','');
				$('.selectPrimaryEvent button').find('span:first').html('Select Event');
				clearSelectedPackage('PRIMARY_AXIS');
			}
		}else if(elem.attr('data_type')=='secondaryEvent'){
			$('.selectSecondaryEvent ul > li').length === 1 ? $('.selectSecondaryEvent ul').html('<li role="presentation"><a tabindex="-1" href="javascript:void(0)" package-name="">No Event</a></li>') : $('.selectSecondaryEvent ul > li a[title="'+elemTxt+'"]').closest("li").remove();
			if($('.selectSecondaryEvent button').attr('title') == elemTxt){
				$('.selectSecondaryEvent button').prop('title','');
				$('.selectSecondaryEvent button').find('span:first').html('Select Event');
				clearSelectedPackage('SECONDARY_AXIS');
			}
		}
	}
}
function drawPackageForAccordian(eventName, pkgName){
	var getAxis='';
	if(pkgName=='prm_event'){
		getAxis = 'PRIMARY_AXIS';
	}
	else if(pkgName=='sec_event'){
		getAxis = 'SECONDARY_AXIS';
	}
	clearSelectedPackage(getAxis);
	$.each(selectedResponse[getAxis],function(key,value){
		if(eventName == key){
			$.each(value, function(ind, val){
				$('#id_'+getAxis.split('_')[0].toLowerCase()+'Package_available li[name="'+val+'"]').length ? $('#id_'+getAxis.split('_')[0].toLowerCase()+'Package_available li[name="'+val+'"]').find('a.anchorCls').trigger('click'):'';
			});
		}
	});
}
function clearSelectedPackage(getAxis){
	if(getAxis=='PRIMARY_AXIS'){
		$('#id_primaryPackage_selected ul > li.selected').each(function(){
			$(this).find('a.anchorCls').trigger('click');
		});
	}
	else if(getAxis=='SECONDARY_AXIS'){
		$('#id_secondaryPackage_selected ul > li.selected').each(function(){
			$(this).find('a.anchorCls').trigger('click');
		});
	}
}
function saveEvntPkg(){
	var primaryPackageDataList = [], secondaryPackageDataList= [];
	$.each($('#id_primaryPackage_selected ul > li.selected'),function(){
		primaryPackageDataList.push($(this).attr('name'));
	});
	$.each($('#id_secondaryPackage_selected ul > li.selected'),function(){
		secondaryPackageDataList.push($(this).attr('name'));
	});

	var postData={};
	if($('#id_primaryEvent_selected ul > li.selected').length){
		postData = {"eventType":"PRIMARY_AXIS", "eventName":$('.selectPrimaryEvent button').attr('title'), "packageList":primaryPackageDataList};
		ajaxCall(postData);
	}
	if($('#id_secondaryEvent_selected ul > li.selected').length){
		postData = {"eventType":"SECONDARY_AXIS", "eventName":$('.selectSecondaryEvent button').attr('title'), "packageList":secondaryPackageDataList};
		ajaxCall(postData);
	}
}
function ajaxCall(postData){
	if(!postData.eventName){
		objNotification.error = 'Please select the event.';
		showNotification();
		return false;
	}
	$.ajax({
		type : 'POST',
		url : '/api/graph/v1/userDefinedGraph/add-configuration',
		data:createDataPacket(postData),
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(data) {
		try {
			if (data.responseJSON != null
					&& data.responseJSON.httpStatusCode == 200) {
				objNotification.success = data.responseJSON.message;
				window.location = './settings.jsp';
			} else {
				objNotification.error = data.responseJSON.message;
			}
		} catch (error) {

		}
		showNotification();
	});
}