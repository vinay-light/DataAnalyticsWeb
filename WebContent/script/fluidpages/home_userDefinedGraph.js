var testModelId, testGroupId;
var retriveResponseForPackage;
var settingId = [];
var newGraph = false;
noEventNoPackage = false;
$(document).ready(function(){
	objMode.nav.selected = 'home';
	objMode.nav.selected_tab = 'userDefinedAnalytics';
	loadNav();
	loadActionBar('addGraph');
	$('.add_graph').attr({'data-target':'#dynamicGraph','data-toggle':'modal'});
	$('#dynamicGraph').on('hidden.bs.modal', function(e){
		onHideDynamicGraphPopover($(this));
	});
	getEvent();
	$('#blanckGraph').submit(createNewGraph);	
	$('#activeSecondaryAxis').click(function(){
		if($(this).prop('checked')){
			if(!noEventNoPackage){
				if($('.selectSecondaryPackage ul li a[title]').length)
					$('#select-secondaryAxisEvent, #select-secondaryAxisPackage').parent().removeClass('disabledFields');
				else
					$('#select-secondaryAxisEvent').parent().removeClass('disabledFields');
				}
		}else{
			$('#select-secondaryAxisEvent, #select-secondaryAxisPackage').parent().addClass('disabledFields');
		}
	});
	$('#div_confirmDialog1 .modal-body #confirmMessage').html('<p>Are you sure you want to delete Custom Graph?</p>');
	onHideDynamicGraphPopover($('#dynamicGraph'));
});

function onHideDynamicGraphPopover(obj){
	$('.notification_error').html('&nbsp;');
	obj.css('position','');
	$('#dynamicGraph form:first .dropdown-menu').find("li:nth-child(1)").trigger("click");
	$('#select-function').html('Average');
	$('#primaryUnit').html('Minutes');
	$('#secondaryUnit').html('Minutes');
	obj.find('form')[0].reset();
	settingId = [];
	$.each($('#select-secondaryAxisEvent, #select-secondaryAxisPackage'),function(ind,val){
		$(val).parent().addClass('disabledFields');
	});
}

function drawGraphs(modelId,currentGroupId){
	disableObject("div.container.action-bar",false,true);
	getcustomGraphsId(showPreCreatedDynamicGraph);
}
function getcustomGraphsId(onComplete){
	var temp = objNotification.containerId;
	objNotification.containerId = 'notificationBoxForGraph';
	$('.dynamicGraph').remove();
	$.ajax({
		url: '/api/user/v1/custom-graphs',
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(data) {
		try {
			if (data.responseJSON != null
					&& data.responseJSON.httpStatusCode == 200) {
				var dynamicGraphId=new Array();
				dynamicGraphId=data.responseJSON.data;
				if(dynamicGraphId.length){
					if(typeof onComplete=='function')
						onComplete(dynamicGraphId);
				}else{
					objNotification.error = translate('common.notification.dashboard.no_graph_found');
					disableObject("div.container.action-bar", true, true);
				}
			} else {
				objNotification.error = data.responseJSON.message;
			}
		} catch (error) {
			objNotification.error = error.message;
		}
		showNotification();
		objNotification.containerId = temp;
	});
}
function showPreCreatedDynamicGraph(dynamicGraphId, mode){
	var tLen = dynamicGraphId.length;
	$.each(dynamicGraphId, function(key,val){
		if(mode!="refresh")
			createPlaceHolderGraph(val);
		$.ajax({
			type:'GET',
			url: '/api/graph/v1/dynamic-graph/content',
			data: {dynamicGraphId:val, groupId:currentGroupId, modelId:currentModelId},
			contentType : "application/json",
			dataType : 'json'
		}).complete(function(data) {
			tLen --;
			try {
				if (data.responseJSON != null
						&& data.responseJSON.httpStatusCode == 200) {
						data=data.responseJSON.data;
						if($.isEmptyObject(data.content) || data.content.length){
							if(mode=='refresh'){
								emptyDynamicGraph(data, val, mode);
							}else{
								emptyDynamicGraph(data, val);
							}
						}else{
							if(mode=='refresh'){
								if(!data.info.isSecondaryYAxis){
									drawGraph(data.info['function'], data.content, $('#dashboardDynamicGraphId_'+val), data.info);
								}
								else{
									drawGraphWithOneSecondaryAxis(data.info['function'], data.content, $('#dashboardDynamicGraphId_'+val), data.info);
								}
							}else{
							  drawDynamicGraph(data, val);
							}
						}
				}
			} catch (error) {
				objNotification.error = error.message;
			}
			if(tLen==0){
				disableObject("div.container.action-bar", true, true);
			}
			showNotification();
		});
	});
}
function createNewGraph(){
	disableObject('#blanckGraph', false, false);
	$('.notification_error').html('&nbsp;');
	var postData =  {'title': $(this).find('#graphTitle').val(),
			"id": settingId[0] != undefined ? settingId[0] : 0,
			"function": $(this).find('#select-function').text(),
			"idealValue": $(this).find('#idealTime:visible').val() > 0 ? $(this).find('#idealTime:visible').val(): 0,
			"primaryEvent": $(this).find('#select-primaryAxisEvent').parent('button').attr('title') != undefined ? $(this).find('#select-primaryAxisEvent').parent('button').attr('title') : '',
			"primaryPackage": $(this).find('#select-primaryAxisPackage').parent('button').attr('title') != undefined ? $(this).find('#select-primaryAxisPackage').parent('button').attr('title'): '',
			"primaryUnit" : $(this).find('#primaryUnit').text(),
			"isSecondaryYAxis": $(this).find('#activeSecondaryAxis').is(':checked'),
			"secondaryEvent": $(this).find('#activeSecondaryAxis').is(':checked') ? $(this).find('#select-secondaryAxisEvent').parent('button').attr('title'): '',
			"secondaryPackage": $(this).find('#activeSecondaryAxis').is(':checked') ? $(this).find('#select-secondaryAxisPackage').parent('button').attr('title'): '',		
			"secondaryUnit" : $(this).find('#primaryUnit').text(),
			"modelId": currentModelId,
			"groupId": currentGroupId
	};
	if((postData.primaryEvent!= undefined && postData.primaryEvent != '') || (postData.isSecondaryYAxis && postData.secondaryEvent!= undefined)){
		$.ajax({
			type : 'POST',
			url : '/api/user/v1/add-update-graph',
			data: createDataPacket(postData),
			contentType : "application/json",
			dataType : 'json'
		}).complete(function(data) {
			try {
				if (data.responseJSON != null
						&& data.responseJSON.httpStatusCode == 200) {
					data = data.responseJSON.data;
					if(!settingId.length){
						createPlaceHolderGraph(data.info.id);
						newGraph = true;
					}
					if($.isEmptyObject(data.content)){
						emptyDynamicGraph(data, data.info.id);
						disableObject('#dynamicGraph', true, false);
						return false;
					}else{
						drawDynamicGraph(data, data.info.id);
					}
				} else {
					$('.notification_error').html(data.responseJSON.message);
				}
			} catch (error) {
				$('.notification_error').html(error.message);
			}
			disableObject('#blanckGraph', true, false);
			if(newGraph)
				scrollDownForNewGraph(data.info.id);
			showNotification();
		});
	}else{
		$('.notification_error').html('Custom Graph data not found.');
		disableObject('#blanckGraph', true, false);
	}
}
function scrollDownForNewGraph(id){
	var $anchor = $('#dashboardDynamicGraphId_'+id).offset();
	$('body').animate({ scrollTop: $anchor.top });
	newGraph = false;
}
function selectEvent(){
	$('.model-dropdown-menu li').click(function(){
		$(this).parent().siblings('button').prop('title',$(this).find('[title]').attr('title'));
		$(this).parent().siblings('button').find('span:first').html($(this).find('[event-name]').attr('event-name'));
		if($(this).closest('.selectPrimaryEvent').length)
			drawPackage($(this).find('[title]').attr('title'), $(this).closest('.selectPrimaryEvent').next());
		else if($(this).closest('.selectSecondaryEvent').length)
			drawPackage($(this).find('[title]').attr('title'), $(this).closest('.selectSecondaryEvent').next());
	});
}
function drawPackage(eventName, $elem,disable){
	var axis='';
	$elem.find('button > span:first').html('No Package');
	$elem.find('ul').empty();
	if($elem.hasClass('selectSecondaryPackage')){
		axis = 'SECONDARY_AXIS';
		eventName == 'COMPONENT_LAUNCH_COUNT' ? $('.selectSecondaryPackage').removeClass('hide') :  $('.selectSecondaryPackage').addClass('hide');
		$elem.find('ul > li').length > 0 ? $elem.find('button').removeClass('disabledFields') : $elem.find('button').addClass('disabledFields');
	}else if($elem.hasClass('selectPrimaryPackage')){
		axis = 'PRIMARY_AXIS';
	}
	$.each(retriveResponseForPackage[axis], function(index, value){
		if(index==eventName){
			if(value.length){
				if(!disable)
					$elem.find('button').removeClass('disabledFields');
				addPackage(value, eventName, $elem);
			}else{
				$elem.find('button').attr('title','');
				$elem.addClass('hide');
			}
			return false;
		}
	});
	selectPackage();
}
function selectPackage(){
	$('.model-dropdown-menu li').click(function(){
		$(this).parent().siblings('button').prop('title',$(this).find('[title]').attr('title'));
		$(this).parent().siblings('button').find('span:first').html($(this).find('[package-name]').attr('package-name'));
	});
}
function getEvent(){
	disableObject('#blanckGraph');
	$.ajax({
		type : 'GET',
		url : '/api/graph/v1/userDefinedGraph/get-configuration',
		data: {modelId:currentModelId, groupId:currentGroupId},
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(data) {
		try {
			if (data.responseJSON != null
					&& data.responseJSON.httpStatusCode == 200) {
				$('.selectPrimaryEvent ul, .selectSecondaryEvent ul').empty();
				$('.selectPrimaryPackage ul').empty();
				if($.isEmptyObject(data.responseJSON.data)){
					$('#select-primaryAxisEvent, #select-secondaryAxisEvent').html('No Event').parent().addClass('disabledFields');
//					$('.selectPrimaryPackage').html('No Package').parent().addClass('disabledFields');
					noEventNoPackage = true;
				} else{
					retriveResponseForPackage = data.responseJSON.data;
					addEventForPrmAxis(retriveResponseForPackage.PRIMARY_AXIS);
					addEventForSecAxis(retriveResponseForPackage.SECONDARY_AXIS);
					selectEvent();
				}

			} else {
				objNotification.error = data.responseJSON.message;
			}
		} catch (error) {
			//objNotification.error = error.message;
		}
		disableObject('#blanckGraph',true);
	});
}
function createPlaceHolderGraph(id){
	var graphData = '<div class="col-xs-12 col-md-6 dynamicGraph">'
		+'<div class="panel panel-default">'
		+'<div class="panel-heading">'
		+'<h3 class="panel-title">&nbsp;</h3>'
		+'</div>'
		+'<div class="panel-body">'
		+'<div class="row">'
		+'<div class="col-xs-12 text-center">'
		+'<div class="graph_container" id="dashboardDynamicGraphId_'+id+'"><img src="/images/no_data_available_450x200px.png"></div>'
		+'</div>'
		+'</div>'
		+'</div></div></div>';
		$('#addGraph').append(graphData);
		$elem = $('#dashboardDynamicGraphId_'+id);
		var calibrator = graphCalibrator;
		calibrator.adjustGraph($elem, false, false);
		disableObject('#dashboardDynamicGraphId_'+id, false, false);
}
function emptyDynamicGraph(data, id, mode){
	var gPanel = $('#dashboardDynamicGraphId_'+id).closest('.dynamicGraph');
	var strTitle = '<span id="graph_title">'+data.info.title+'</span>'
	+'<span class="pull-right"><img id="idUserProfileRefresh" onclick="refreshGraph(\'refresh\',this);" title="Refresh" class="img-responsive margin_right_10px cursor_pointer" src="'+imagesCdnPath+'/refresh.png"></span>'
	+'<span class="pull-right" prm_unit="'+data.info['primaryUnit']+'" sec_unit="'+data.info['secondaryUnit']+'" settingId="'+data.info['id']+'" graph_title="'+data.info.title+'" select_function="'+data.info['function']+'" select_prm_event="'+data.info['primaryEvent']+'" select_prm_pkg="'+data.info['primaryPackage']+'" is_sec_axis="'+data.info['isSecondaryYAxis']+'" select_sec_event="'+data.info['secondaryEvent']+'"  select_sec_pkg="'+data.info['secondaryPackage']+'">'
	+'<img id="idUserProfileGraphSettings" onclick="refreshGraph(\'settings\', this);" title="Settings" class="img-responsive margin_right_10px cursor_pointer" src="'+imagesCdnPath+'/graph_settings.png"></span>'
	+'<span class="pull-right"><img id="idUserProfileDelete" onclick="refreshGraph(\'delete_graph\',this);" title="Delete" class="img-responsive margin_right_10px cursor_pointer" src="'+imagesCdnPath+'/del.png"></span>';	
	gPanel.find("h3.panel-title:first").html(strTitle);
	$('#dashboardDynamicGraphId_'+id).html('<img src="/images/no_data_available_450x200px.png">');
	
	if(settingId.length || mode=='refresh')
		settingId=[];
	$elem = $('#dashboardDynamicGraphId_'+id);
	var calibrator = graphCalibrator;
	calibrator.adjustGraph($elem, false, false);
	$('#dynamicGraph').modal('hide');
	disableObject('#dashboardDynamicGraphId_'+id, true, false);
}
function drawDynamicGraph(data, id){
	var gPanel = $('#dashboardDynamicGraphId_'+id).closest('.dynamicGraph');
	var strTitle = '<span id="graph_title">'+data.info.title+'</span>'
	+'<span class="pull-right"><img id="idUserProfileRefresh" onclick="refreshGraph(\'refresh\',this);" title="Refresh" class="img-responsive margin_right_10px cursor_pointer" src="'+imagesCdnPath+'/refresh.png"></span>'
	+'<span class="pull-right" prm_unit="'+data.info['primaryUnit']+'" sec_unit="'+data.info['secondaryUnit']+'" settingId="'+data.info['id']+'" graph_title="'+data.info.title+'" select_function="'+data.info['function']+'" select_prm_event="'+data.info['primaryEvent']+'" select_prm_pkg="'+data.info['primaryPackage']+'" is_sec_axis="'+data.info['isSecondaryYAxis']+'" select_sec_event="'+data.info['secondaryEvent']+'"  select_sec_pkg="'+data.info['secondaryPackage']+'">'
	+'<img id="idUserProfileGraphSettings" onclick="refreshGraph(\'settings\', this);" title="Settings" class="img-responsive margin_right_10px cursor_pointer" src="'+imagesCdnPath+'/graph_settings.png"></span>'
	+'<span class="pull-right"><img id="idUserProfileDelete" onclick="refreshGraph(\'delete_graph\',this);" title="Delete" class="img-responsive margin_right_10px cursor_pointer" src="'+imagesCdnPath+'/del.png"></span>';	
	gPanel.find("h3.panel-title:first").html(strTitle);
	$('#dashboardDynamicGraphId_'+id).html('');
	
	if(settingId.length)
		settingId=[];
	$('#dynamicGraph').modal('hide');
	if(!data.info.isSecondaryYAxis){
		 drawGraph(data.info['function'], data.content, $('#dashboardDynamicGraphId_'+id), data.info);
	}
	else{
		drawGraphWithOneSecondaryAxis(data.info['function'], data.content, $('#dashboardDynamicGraphId_'+id), data.info);
	}
	disableObject('#dashboardDynamicGraphId_'+id, true, false);
}
function drawGraph(categories,deviceStatusArr, $elem, graphInfo){
	var categories=[];
	var xAxis=[];
	var min, max;
	min = max = 1;
	$.each(deviceStatusArr, function(index,value){
		categories.push(index);
		min = min > value['primaryYAxis'] ? value['primaryYAxis'] : min; 
		max = max < value['primaryYAxis'] ? value['primaryYAxis'] : max; 
		xAxis.push(value['primaryYAxis']);
	});
	min = min > 1 ? min : 1;
	max = max > 1 ? max : 1;
	var calibrator = graphCalibrator;
	var objComp = calibrator.adjustGraph($elem, max, min, categories.length);
	max_lbl_width = objComp.max_lbl_width;
	$elem.highcharts({
		legend: {
			itemStyle: {
				fontWeight: 'normal',
				fontSize: '10px'
			}
		},
		title: {
			text: null
		},
		xAxis: [{
			categories: categories,
			labels: {
		      formatter: function () {
		          return calibrator.formatLabel(this.value);
		      },
		      style: {
		          width: 'auto'
		      },
		      useHTML: true
			}
		}],
		yAxis: [{ // Primary yAxis
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[0],
					fontSize: '10px'
				}
			},
			title: {
				text: 'Primary Y Axis (in '+graphInfo.primaryUnit+')',
				style: {
					color: Highcharts.getOptions().colors[0],
					fontSize: '10px'
				}
			},
			min:0
		}],
		credits :{
			enabled: false
		},
		exporting: {
			enabled: false
		},
		tooltip: {
			shared: true
		},
		plotOptions: {
			series: {
				cursor: 'default',
				point: {
					events: {
						click: function (event) {

						}
					}
				}
			}
		},
		series: [{
			name: getEventAndPackageName(graphInfo.primaryEvent, graphInfo.primaryPackage),
			type: 'column',
			data: xAxis,
			tooltip: {
				valueSuffix: ' '+graphInfo.primaryUnit
			}
		}]
	});
}
function drawGraphWithOneSecondaryAxis(categories,deviceStatusArr, $elem, graphInfo){
	var categories=[];
	var xAxis=[];
	var yAxis=[];
	var min, max;
	min = max = 1;
	$.each(deviceStatusArr, function(index,value){
		categories.push(index);
		value['primaryYAxis'] = value['primaryYAxis'] == undefined ? 0: value['primaryYAxis'];
		min = min > value['primaryYAxis'] ? value['primaryYAxis'] : min; 
		max = max < value['primaryYAxis'] ? value['primaryYAxis'] : max; 
		xAxis.push(value['primaryYAxis'] == undefined ? 0: value['primaryYAxis']);
		yAxis.push(value['secondaryYAxis'] == undefined ? 0: value['secondaryYAxis']);
	});
	min = min > 1 ? min : 1;
	max = max > 1 ? max : 1;
	var calibrator = graphCalibrator;
	calibrator.setting.offset_x = 170;
	var t  = calibrator.setting.offset_x;
	calibrator.setting.offset_x += 97; 
	var objComp = calibrator.adjustGraph($elem, max, min, categories.length);
	calibrator.setting.offset_x = t;
	max_lbl_width = objComp.max_lbl_width;
	$elem.highcharts({
		legend: {
			itemStyle: {
				fontWeight: 'normal',
				fontSize: '10px'
			}
		},
		title: {
			text: null
		},
		xAxis: [{
			categories: categories,
			labels: {
		      formatter: function () {
		          return calibrator.formatLabel(this.value);
		      },
		      style: {
		          width: 'auto'
		      },
		      useHTML: true
			}
		}],
		yAxis: [{ // Primary yAxis
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[2],
					fontSize: '10px'
				}
			},
			title: {
				text: 'Secondary Y Axis (in '+graphInfo.primaryUnit+')',
				style: {
					color: Highcharts.getOptions().colors[2],
					fontSize: '10px'
				}
			},
			min:0,
			opposite: true
		}, { // Secondary yAxis
			title: {
				text: 'Primary Y Axis (in '+graphInfo.primaryUnit+')',
				style: {
					color: Highcharts.getOptions().colors[0],
					fontSize: '10px'
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[0],
					fontSize: '10px'
				}
			},
			min:0
		}],
		credits :{
			enabled: false
		},
		exporting: { 
			enabled: false
		},
		tooltip: {
			shared: true
		},
		plotOptions: {
			series: {
				cursor: 'default',
				point: {
					events: {
						click: function (event) {

						}
					}
				}
			}
		},
		series: [{
			name: getEventAndPackageName(graphInfo.primaryEvent, graphInfo.primaryPackage),
			type: 'column',
			yAxis: 1,
			data: xAxis,
			tooltip: {
				valueSuffix: ' '+graphInfo.primaryUnit
			}
		}, {
			name: getEventAndPackageName(graphInfo.secondaryEvent, graphInfo.secondaryPackage),
			type: 'spline',
			color : '#43EB29',
			data: yAxis,
			tooltip: {
				valueSuffix: ' '+graphInfo.primaryUnit
			}
		}]
	});
}
function getEventAndPackageName(seriesEventName, seriesPackageName){
	if(seriesPackageName != undefined && seriesPackageName != "")
		return seriesEventName+'('+seriesPackageName+')';
	else
		return seriesEventName;
}
function deleteDynamicGraph(elemId){
	var postJSON =   {"idList": [elemId]};
	var temp = objNotification.containerId;
	objNotification.containerId = 'notificationBoxForGraph';
	$.ajax({
		type : "DELETE",
		url : '/api/user/v1/custom-graph',
		contentType : "application/json",
		data : createDataPacket(postJSON),
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				$('#dashboardDynamicGraphId_'+elemId).closest('.dynamicGraph').remove();
				objNotification.success = responseData.responseJSON.message;
			}
			else {
				objNotification.error = responseData.responseJSON.message;
			}
		} catch (error) {
			objNotification.error= error.message;
		}
		showNotification();
		objNotification.containerId = temp;
	});
}
function graphRefresh(id){
	disableObject('#dashboardDynamicGraphId_'+id, false, false);
	showPreCreatedDynamicGraph([id],'refresh');
}
function graphSettings(elem){
		(elem.attr('select_sec_event') == 'undefined' || elem.attr('select_sec_event') == 'COMPONENT_LAUNCH_COUNT') ? $('.selectSecondaryPackage').removeClass('hide') : $('.selectSecondaryPackage').addClass('hide');
		$('#dynamicGraph #graphTitle').val(elem.attr('graph_title'));
		$('#dynamicGraph #select-function').html(elem.attr('select_function'));
		$('#dynamicGraph #select-primaryAxisEvent').parent().attr('title', getSettingPrmDynamicValue(elem, 'select_prm_event') == 'No Event' ? '' : getSettingPrmDynamicValue(elem, 'select_prm_event'));
		$('#dynamicGraph #select-primaryAxisEvent').html(shortenName(getSettingPrmDynamicValue(elem, 'select_prm_event'),35));
		$('#dynamicGraph #select-primaryAxisPackage').parent().attr('title', getSettingPrmDynamicValue(elem, 'select_prm_pkg') == 'No Package' ? '' : getSettingPrmDynamicValue(elem, 'select_prm_pkg'));
		$('#dynamicGraph #select-primaryAxisPackage').html(shortenName(getSettingPrmDynamicValue(elem, 'select_prm_pkg'),35));
		$('#dynamicGraph #primaryUnit').html(elem.attr('prm_unit'));
		if(elem.attr('is_sec_axis')=='true'){
			$('#dynamicGraph #activeSecondaryAxis').prop('checked',true);
			$('#select-secondaryAxisEvent').parent().removeClass('disabledFields');
			$('#dynamicGraph #select-secondaryAxisEvent').parent().attr('title', getSettingSecDynamicValue(elem ,'select_sec_event') == 'No Event' ? '' :getSettingSecDynamicValue(elem ,'select_sec_event'));
			$('#dynamicGraph #select-secondaryAxisEvent').html(shortenName(getSettingSecDynamicValue(elem ,'select_sec_event'),35));
			$('#dynamicGraph #select-secondaryAxisPackage').parent().attr('title', getSettingSecDynamicValue(elem, 'select_sec_pkg' == 'No Package' ? '' : getSettingSecDynamicValue(elem, 'select_sec_pkg')));
			$('#dynamicGraph #select-secondaryAxisPackage').html(shortenName(getSettingSecDynamicValue(elem, 'select_sec_pkg'),35));
		}else{
			$('#dynamicGraph #activeSecondaryAxis').prop('checked',false);
			$('#select-secondaryAxisEvent, #select-secondaryAxisPackage').parent().addClass('disabledFields');
		}
	settingId.push(elem.attr('settingId'));
	$('#dynamicGraph').modal('show');
}
function getSettingPrmDynamicValue(elem, selectElem){
	if(selectElem == 'select_prm_event'){
		if(elem.attr('select_prm_event') != '' && elem.attr('select_prm_event') != 'undefined'){
			if($('.selectPrimaryEvent ul li a[title]').length){
				drawPackage(elem.attr(selectElem), $('#select-primaryAxisPackage').parents('.selectPrimaryPackage'));
				$('#select-primaryAxisEvent').parent().removeClass('disabledFields');
				return elem.attr('select_prm_event');
			}else{
				return elem.attr('select_prm_event');
			}
		}else{
			$('#select-primaryAxisEvent').parent().addClass('disabledFields');
			$('#select-primaryAxisPackage').parent().addClass('disabledFields');
			return 'No Event';
		}
	}else if(selectElem == 'select_prm_pkg'){
		if(elem.attr('select_prm_pkg') != '' && elem.attr('select_prm_pkg') != 'undefined'){
			if($('.selectPrimaryPackage ul li a[title]').length){
				$('#select-primaryAxisPackage').parent().removeClass('disabledFields');
				return elem.attr('select_prm_pkg');
			}else{
				return elem.attr('select_prm_pkg');
			}
		}else{
			$('.selectPrimaryPackage').addClass('hide');
			return 'No Package';
		}
	}
}
function getSettingSecDynamicValue(elem, selectElem){
	if(selectElem == 'select_sec_event'){
		if(elem.attr('select_sec_event') !='' && elem.attr('select_sec_event') != 'undefined'){
			if($('.selectSecondaryEvent ul li a[title]').length){
				$('#select-secondaryAxisEvent').parent().removeClass('disabledFields');
				return elem.attr('select_sec_event');
			}else{
				$('#select-secondaryAxisEvent').parent().addClass('disabledFields');
				return elem.attr('select_sec_event');
			}
		}else{
			$('#select-secondaryAxisEvent').parent().addClass('disabledFields');
			return 'No Event';
		}
	}else if(selectElem == 'select_sec_pkg' ){
		if(elem.attr('select_sec_pkg') !='' && elem.attr('select_sec_pkg') != 'undefined'){
			if($('.selectSecondaryEvent ul li a[title]').length){
				$('#select-secondaryAxisPackage').parent().removeClass('disabledFields');
				return elem.attr('select_sec_pkg');
			}else{
				$('#select-secondaryAxisPackage').parent().addClass('disabledFields');
				return elem.attr('select_sec_pkg');
			}
		}else{
			$('#select-secondaryAxisPackage').parent().addClass('disabledFields');
			return 'No Package';
		}
	}
}
function addEventForPrmAxis(responseDataForEvent){
	$.each(responseDataForEvent, function(index,value){
			$('.selectPrimaryEvent ul').append('<li role="presentation"><a tabindex="-1" href="javascript:void(0)" event-name="'+shortenName(index, 35)+'" title="'+index+'">' + shortenName(index, 30)+ '</a></li>');
	});
	if($('.selectPrimaryEvent ul > li').length){
		$('.selectPrimaryPackage').removeClass("hide");
		$('#select-primaryAxisEvent').html(shortenName($('.selectPrimaryEvent ul > li > a:first').text(), 30));
		$('#select-primaryAxisEvent').closest('button').prop('title',$('.selectPrimaryEvent ul > li > a:first').attr('event-name'));
		var disable = $('.selectPrimaryEvent ul > li > a:first').closest("div").find("button:first").hasClass("disabledFields");
		drawPackage($('.selectPrimaryEvent ul > li > a:first').attr('event-name'), $('#select-primaryAxisPackage').parents('.selectPrimaryPackage'), disable);
	}else{
		$('.selectPrimaryPackage').addClass("hide");
		$('#select-primaryAxisEvent').html('No Event').parent().addClass('disabledFields');
	}
}
function addEventForSecAxis(responseDataForEvent){
	$.each(responseDataForEvent, function(index,value){
			$('.selectSecondaryEvent ul').append('<li role="presentation"><a tabindex="-1" href="javascript:void(0)" event-name="'+shortenName(index, 35)+'" title="'+index+'">' + shortenName(index, 30)+ '</a></li>');
	});
	if($('.selectSecondaryEvent ul > li').length){
		$('#select-secondaryAxisEvent').html(shortenName($('.selectSecondaryEvent ul > li > a:first').text(), 30));
		$('#select-secondaryAxisEvent').closest('button').prop('title',$('.selectSecondaryEvent ul > li > a:first').attr('event-name'));
		var disable = $('.selectSecondaryEvent ul > li > a:first').closest("div").find("button:first").hasClass("disabledFields");
		drawPackage($('.selectSecondaryEvent ul > li > a:first').attr('event-name'), $('#select-secondaryAxisPackage').parents('.selectSecondaryPackage'), disable);
	}else{
		$('#select-secondaryAxisEvent').html('No Event');
		noEventNoPackage =true;
	}
}
function addPackage(responseDataForPackage, eventName, $elem){
	if($elem.find('#select-primaryAxisPackage').length){
		$.each(responseDataForPackage, function(key, val){
				$('.selectPrimaryPackage ul').append('<li role="presentation"><a tabindex="-1" href="javascript:void(0)" package-name="'+shortenName(val, 35)+'" title="'+val+'">' + shortenName(val, 30)+ '</a></li>');
		});	
	}else if($elem.find('#select-secondaryAxisPackage').length){
		$.each(responseDataForPackage, function(key, val){
				$('.selectSecondaryPackage ul').append('<li role="presentation"><a tabindex="-1" href="javascript:void(0)" package-name="'+shortenName(val, 35)+'" title="'+val+'">' + shortenName(val, 30)+ '</a></li>');
		});	
	}
	if($elem.find('ul > li').length){
		$elem.removeClass('hide');
		$elem.find('button span:first').html(shortenName($elem.find('ul > li > a:first').text(), 30));
		$elem.find('button').prop('title',$elem.find('ul > li > a:first').attr('package-name'));
	}else{
		$elem.addClass('hide');
	}
}