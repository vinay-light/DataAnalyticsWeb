var buildData ={};
$(document).ready(function() {
	objMode.nav.selected = 'wizard';
	objMode.nav.selected_tab='batteryAnalytics';
	loadNav();
	$('#tn_wizard').addClass('active');
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel); 
});
function callEventRequest(){
	if($.urlParam("category")){
		var buidName = sessionStorage[$.urlParam("category")];
		if(buidName){
    	   buidName = buidName.substr(0, buidName.indexOf('<'));
    	   callEvent(buidName, buildData.groupId, buildData.modelId,buildData.elem,'Battery Uptime (in hrs)', ['Devices'],buildData.onSuccess);
		}
	}
}
function drawGraphs(modelId,groupId){
	groupId = groupId ? groupId : $("#header_select_device_group").val();
	modelId = modelId ? modelId : $("#header_select_device_model").val();
	currentDeviceModel = $("#current_device_model").text();
	disableObject("#device_batteryAnalytics");
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel); 
	getBatteryAnalyticsChartData('/api/graph/v1/batteryAnalytics/build',modelId,groupId,$('#highchart_battery-analytics'),'Avg. Battery Uptime (in hrs)', 'Avg. Battery Uptime', drawChartForTwoPrimaryAndOneSecondaryAxis);
}
function callEvent(buildName,groupId,modelId,$elem,title,categories,onSuccess){
	disableObject('#table_deviceModel');
	disableObject("#"+$elem.attr("id"));
	$('#table_deviceModel tbody').html('');
	$('#table_deviceModel thead th#th_col1').html('Device Serial No');
	$('#table_deviceModel thead th#th_col2').html('Avg. Battery Life');
	$('#table_deviceModel thead th#th_col3').html('Total Screen ON').removeClass('hidden');
	$('#table_deviceModel thead th#th_col4').html('Total Device Uptime').removeClass('hidden');
	$('#table_deviceModel thead th#th_col5').html('').addClass('hidden');
	$('#table_deviceModel thead th#th_col6').html('Avg. Time on Battery').removeClass('hidden');
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionBuild,  span#actionDeviceModel').removeClass('hidden').addClass('active');
	$('span#actionBuild a').html(buildName);
	$('span#actionBuild a').attr('onclick', '');
	$('span#actionDeviceModel a').attr('onclick', 'drawBuildData();');
	buildData.buildName=buildName;
	$.ajax({
		url : '/api/graph/v1/batteryAnalytics/device',
		data : {modelId : modelId, groupId : groupId, buildName: buildName},
		contentType : "application/json",
		dataType : 'json',
		success: function(response){
			if(response.httpStatusCode === 200){
				if( $.isEmptyObject(response.data) || response.data.length === 0){
					$elem.html('');
					return emptyGraph($elem);
				}
				drawGraphTableForDevice(response, 'hours');
				var deviceStatusArr = [];
				var deviceStatus = {};
				$.each(response.data,function(key, val){
					if(val.avgBatteryLifetime == undefined)
						val['avgBatteryLifetime']= 0;
					deviceStatus = {name:key,data:[val]};
					deviceStatusArr.push(deviceStatus);
				});
				if(typeof onSuccess == "function")
					onSuccess(categories, deviceStatusArr, $elem, 'Avg. Battery Uptime (in hrs)');
			}
		}
	}).complete(function(){
		disableObject('#table_deviceModel',true);
		disableObject("#device_batteryAnalytics",true);
	});
}

function callEventForComponents(buildName, deviceSerialNo,$elem,title,categories,onSuccess){
	disableObject('#table_deviceModel');
	disableObject("#"+$elem.attr("id"));
	$('#table_deviceModel tbody').html('');
	$('#table_deviceModel thead th#th_col1').html('Component');
	$('#table_deviceModel thead th#th_col2').html('Battery Consumption');
	$('#table_deviceModel thead th#th_col3').html('').addClass('hidden');
	$('#table_deviceModel thead th#th_col4').html('').addClass('hidden');
	$('#table_deviceModel thead th#th_col5').html('').addClass('hidden');
	$('#table_deviceModel thead th#th_col6').html('').addClass('hidden');
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionBuild, span#actionDevice, span#actionDeviceModel').removeClass('hidden').addClass('active');
	$('span#actionDeviceModel a').attr('onclick', 'drawBuildData();');
	$('span#actionBuild a').attr('onclick', 'drawComponentData();');
	$('span#actiondevice a').html(deviceSerialNo);
	$.ajax({
		url : '/api/graph/v1/batteryAnalytics/deviceComponents',
		data : {modelId : $("#header_select_device_model").val(), groupId : $("#header_select_device_group").val(),buildName: buildName, deviceSerialNo: deviceSerialNo},
		contentType : "application/json",
		dataType : 'json',
		success: function(response){
			if(response.httpStatusCode === 200){
				if( $.isEmptyObject(response.data) || response.data.length === 0){
					$elem.html('');
					return emptyGraph($elem);
				}
				drawGraphTable(response, '%');
				var deviceStatusArr = [];
				for(var key in response.data){
					var deviceStatus = {name:key,data:[response.data[key]],point:{events:{
						click: function (event) {
							//callEventForComponents(event.currentTarget.series.name, groupId, modelId);
						}
					}
					}};
					deviceStatusArr.push(deviceStatus);
				}
				if(typeof onSuccess == "function")
					onSuccess(categories, deviceStatusArr, $elem, title);
			}
		}
	}).complete(function(){
		disableObject('#table_deviceModel',true);
		disableObject("#device_batteryAnalytics",true);
	});
}

function drawGraphTable(data, type){
	$('#table_deviceModel tbody').html('');
	for(var key in data.data){
		if(typeof data.data[key] != "function"){
			tableRow 	= '<tr>'
				+'<td><span>' +  (key?key:"--") + '</span></td>'
				+'<td class="rActive">' + (data.data[key]?data.data[key] + type:"--") + ' ' +' </td>'
				+'</tr>';
			$('#table_deviceModel tbody').append(tableRow);
		}
	}
	var tblId = "#table_deviceModel";
	fixThead(tblId);
}
function drawGraphTableForDevice(response, type){
	$('#table_deviceModel tbody').html('');
	for(var key in response.data){
		if(typeof response.data[key] != "function"){
			tableRow 	= '<tr>'
				+'<td><span>' +  (response.data[key].key?response.data[key].key:"--") + '</span></td>'
				+'<td class="rActive">' + (response.data[key].avgBatteryLifetime?response.data[key].avgBatteryLifetime + type:"--") + ' ' +' </td>'
				+'<td class="rActive">' + (response.data[key].totalScreenOnTime?response.data[key].totalScreenOnTime + type:"--") + ' ' +' </td>'
				+'<td class="rActive">' + (response.data[key].avgDeviceUptime?response.data[key].avgDeviceUptime + type:"--") + ' ' +' </td>'
				+'<td class="rActive">' + (response.data[key].value?response.data[key].value + type:"--") + ' ' +' </td>'
				+'</tr>';
			$('#table_deviceModel tbody').append(tableRow);
		}
	}
	var tblId = "#table_deviceModel";
	fixThead(tblId);
}
function drawBatteryGraphTable(data, type){
	$('#table_deviceModel tbody').html('');
	for(var key in data.data){
		var rowObject = data.data[key];
		if(typeof rowObject == "object" && !$.isEmptyObject(rowObject)){
			tableRow 	= '<tr>'
				+'<td><span>' + (rowObject.key?rowObject.key:"--")  + '</span></td>'
				+'<td>' +(rowObject.avgBatteryLifetime?rowObject.avgBatteryLifetime + type:"--")  + ' ' +' </td>'
				+'<td>' +(rowObject.totalScreenOnTime?rowObject.totalScreenOnTime + type :"--")  + ' </td>'
				+'<td>' + (rowObject.avgDeviceUptime?rowObject.avgDeviceUptime + type :"--") + ' ' +' </td>'
				+'<td class="rActive">' + (rowObject.value?rowObject.value + type:"--") + ' ' +' </td>'
				+'<td>' +(rowObject.deviceCount?rowObject.deviceCount:"--")  + ' </td>'
				+'</tr>';
			$('#table_deviceModel tbody').append(tableRow);
		}
	}
	var tblId = "#table_deviceModel";
	fixThead(tblId);
}

function getBatteryAnalyticsChartData(url, modelId, groupId, $elem, title, categories,  onSuccess){
	buildData.groupId=groupId;
	buildData.modelId=modelId;
	buildData.elem=$elem;
	buildData.onSuccess = drawTertiaryGraph;
	$('#table_deviceModel thead th#th_col1').html('SW Release');
	$('#table_deviceModel thead th#th_col2').html('Avg. Battery Life');
	$('#table_deviceModel thead th#th_col3').html('Avg. Screen On Time').removeClass('hidden');
	$('#table_deviceModel thead th#th_col4').html('Total Device Uptime').removeClass('hidden');
	$('#table_deviceModel thead th#th_col5').html('Avg. Time on Battery').removeClass('hidden');
	$('#table_deviceModel thead th#th_col6').html('Device Count').removeClass('hidden');
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$('#table_deviceModel tbody').html('');
	$('span#actionDeviceModel a, span#actionBuild a').attr('onclick', '');
	$.ajax({
		url : url,
		data : groupId ? {modelId : modelId, groupId : groupId} : {modelId : modelId},
				contentType : "application/json",
				dataType : 'json',
				success: function(response){
					if(response.httpStatusCode === 200){
						if( $.isEmptyObject(response.data) || response.data.length === 0){
							$elem.html('');
							$('#table_deviceModel tbody').append('<tr><td colspan="5"><span>No Data Found</span></td></tr>');
							return emptyGraph($elem);
						}
						drawBatteryGraphTable(response, 'hours');
						var deviceStatusArr = [];
						for(var key in response.data){
							var deviceStatus = {name:key,data:[response.data[key]]};
							deviceStatusArr.push(deviceStatus);
						}
						if(typeof onSuccess == "function")
							onSuccess(categories, deviceStatusArr, $elem, title);
					}
				}
	}).complete(function(){
		disableObject("#device_batteryAnalytics",true);
	});
}
function drawBuildData(){
	getBatteryAnalyticsChartData('/api/graph/v1/batteryAnalytics/build',buildData.modelId,buildData.groupId,buildData.elem,'Avg. Battery Uptime (in hrs)',['Avg battery Uptime'],drawChartForTwoPrimaryAndOneSecondaryAxis);
}
function drawComponentData(){
	disableObject("#device_batteryAnalytics");
	callEvent(buildData.buildName, buildData.groupId, buildData.modelId,buildData.elem,'Avg. Battery Uptime (in hrs)',['Avg. Battery Uptime'],drawTertiaryGraph);
}