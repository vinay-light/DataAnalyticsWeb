var buildData ={};
var setModalIdForCrashAnalytics;
var setGroupIdForCrashAnalytics;
var objToggelGraphData = {};
$(document).ready(function(){
	$('#tn_wizard').addClass('active');
	objMode.nav.selected = 'wizard';
	objMode.nav.selected_tab='stabilityAnalytics';
	loadNav();
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel); 
});
function drawToggleGraph(){
	params = objToggelGraphData.params;
	window[objToggelGraphData.fnName](params[0],params[1],params[2],params[3],params[4],params[5],params[6]);
}
function drawGraphs(modelId,groupId){
	setModalIdForCrashAnalytics = modelId;
	setGroupIdForCrashAnalytics = groupId;
	currentDeviceModel = $("#current_device_model").text();
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel);
	objToggelGraphData.fnName = "getStabilityAnalyticsChartData";
	objToggelGraphData.params = ['/api/graph/v1/stability-uptime/build',modelId, groupId, $('#highchart_crashModel_analytics'),'Crash Count',['Device Software Builds'], drawChartForOnePrimarryAxis];
	if($('#highchart_crashModel_analytics:visible').length)
		getStabilityAnalyticsChartData('/api/graph/v1/stability-uptime/build',modelId, groupId, $('#highchart_crashModel_analytics'),'Crash Count',['Device Software Builds'], drawChartForOnePrimarryAxis);
	getStabilityAnalyticsChartData('/api/graph/v1/stability-uptime/build',modelId, groupId, $('#highchart_stability-statistics'),'Total Stability (in hrs)','Total Stability', drawTertiaryGraphForStablity);
}
function getStabilityAnalyticsChartData(url, modelId, groupId, $elem, title, categories, onSuccess){
	buildData.groupId=groupId;
	buildData.modelId=modelId;
	buildData.elem=$elem;
	buildData.onSuccess = 'drawTertiaryGraphForStablity';
	$('span.action_breadcrumb').addClass('hidden');
	$('#table_stabilityAnalytics thead th#th_col1').html('SW Release');
	$('#table_stabilityAnalytics thead th#th_col2').html('Total Device Uptime');
	$('#table_stabilityAnalytics thead th#th_col3').html('MTBF');
	$('#table_stabilityAnalytics thead th#th_col4').html('Total Stability Hrs');
	$('#table_stabilityAnalytics thead th#th_col5').html('Critical Crashes');
	$('#table_stabilityAnalytics thead th#th_col6').html('Device Count').removeClass('hidden');
	$('#table_stabilityAnalytics tbody').html('');
	$('span#actionDeviceModel a').attr('onclick', '');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	disableObject("#device_stabilityAnalytics");
	$.ajax({
		url : url,
		data : groupId ? {modelId : modelId, groupId : groupId} : {modelId : modelId},
		contentType : "application/json",
		dataType : 'json',
		success: function(response){
			if(response.httpStatusCode === 200){
				if( $.isEmptyObject(response.data) || response.data.length === 0){
					$elem.html('');
					if($elem.attr('id') == "highchart_stability-statistics")
						$('#table_stabilityAnalytics tbody').append('<tr><td colspan="6"><span>No Data Found</span></td></tr>');
					return emptyGraph($elem);
				}
				drawGraphTable(response);
				var deviceStatusArr = [];
				var deviceStatus = {};
				var categoriesArray= [];
				var rArray = [];
				var rObj = {};
				var arrInd = {};
				$.each(response.data,function(ind,catData){
					categoriesArray.push(catData["key"]);
					if(catData.crash){
						$.each(catData.crash,function(index,value){
							arrInd[index] = 0;
							rObj[index] = {"name":index,"data":[], cursor: 'pointer', point:{events:{
								click: function (event) {
									callEvent(event.point.category, groupId, modelId, $('#highchart_crashModel_analytics'), title, [ 'Devices' ], onSuccess);
								}
							}
							}};
						});
					}
				});
				$.each(response.data,function(key, val){
					val.crash = val.crash ? val.crash : {};
						$.each(arrInd, function(k,v){
							var tV = val.crash[k] ? val.crash[k] : 0;
							rObj[k].data.push(tV);
						});
					deviceStatus = {name:key,data:[val]};
					deviceStatusArr.push(deviceStatus);
				});
				$.each(rObj,function(ind,val){
					rArray.push(val);
				});
				if(!rArray.length){
					var objReturn = {"name": "","data": []};
					$.each(response.data,function(ind,val){
					        var val = val.totalCrashCount ? val.totalCrashCount : 0;
							objReturn.data.push(val);
					});
					rArray = [objReturn];
				}
				
				if(typeof onSuccess == "function"){
					if(onSuccess.name == "drawTertiaryGraphForStablity")
						onSuccess(categories, deviceStatusArr, $elem, title);
					else if(onSuccess.name == "drawChartForOnePrimarryAxis")
						onSuccess(categoriesArray, rArray, $elem, title);
				}
			}
		}
	}).complete(function(data){
		disableObject("#device_stabilityAnalytics",true);
	});
}
function callEvent(buildName,groupId,modelId, $elem, title, categories, onSuccess){
	disableObject('#table_stabilityAnalytics');
	disableObject("#"+$elem.attr("id"));
	$('#table_stabilityAnalytics thead th#th_col1').html('Device Serial No');
	$('#table_stabilityAnalytics thead th#th_col2').html('Total Device Uptime');
	$('#table_stabilityAnalytics thead th#th_col3').html('MTBF');
	$('#table_stabilityAnalytics thead th#th_col4').html('Total Stability Hrs');
	$('#table_stabilityAnalytics thead th#th_col5').html('Critical Crashes');
	$('#table_stabilityAnalytics thead th#th_col6').html('Device Count').addClass('hidden');
	$('#table_stabilityAnalytics tbody').html('');
	$('span#actionBuild, span#actionDeviceModel').removeClass('hidden').addClass('active');
	$('span#actionDeviceModel a').attr('onclick', 'drawBuildData();');
	$('span#actionBuild a').html(buildName);
	$.ajax({
		url : '/api/graph/v1/stability-uptime/device',
		data : {modelId : modelId, groupId : groupId, buildName : buildName},
		contentType : "application/json",
		dataType : 'json',
		success: function(response){
			if(response.httpStatusCode === 200){
				if( $.isEmptyObject(response.data) || response.data.length === 0){
					$elem.html('');
					$('#table_stabilityAnalytics tbody').append('<tr><td colspan="6"><span>No Data Found</span></td></tr>');
					return emptyGraph($elem);
				}
				drawTable(response);
				var deviceStatusArr = [];
				var deviceStatus = {};
				var categoriesArray= [];
				var rArray = [];
				var rObj = {};
				var arrInd = {};
				$.each(response.data, function(ind,catData){
					categoriesArray.push(catData["key"]);
					if(catData.crash){
						$.each(catData.crash,function(index,value){
							arrInd[index] = 0;
							rObj[index] = {"name":index,"data":[], cursor: 'pointer', point:{events:{
								click: function (event) {
									rediectToDebugLogs(buildName, event.point.category);
								}
							}
							}};

						});
					}
				});
				$.each(response.data,function(key, val){
					val.crash = val.crash ? val.crash : {};
					$.each(arrInd, function(k,v){
						var tV = val.crash[k] ? val.crash[k] : 0;
						rObj[k].data.push(tV);
					});
					deviceStatus = {name:key,data:[val]};
					deviceStatusArr.push(deviceStatus);
				});
				$.each(rObj,function(ind,val){
					rArray.push(val);
				});
				
				if(!rArray.length){
					var objReturn = {"name": "Device Software Builds","data": []};
					$.each(response.data,function(ind,val){
					        var val = val.totalCrashCount ? val.totalCrashCount : 0;
							objReturn.data.push(val);
					});
					rArray = [objReturn];
				}
				objToggelGraphData.fnName = "drawChartForOnePrimarryAxis";
				objToggelGraphData.params = [categoriesArray, rArray , $("#highchart_crashModel_analytics"), "Crash Count"];
				if($("#highchart_crashModel_analytics:visible").length)
					drawChartForOnePrimarryAxis(categoriesArray, rArray , $("#highchart_crashModel_analytics"), "Crash Count");
				drawTertiaryGraphForStablity('Total Stability', deviceStatusArr, $("#highchart_stability-statistics"), 'Total Stability (in hrs)');
			}
		}
	}).complete(function(){
		$('#highchart_stability-statistics *[style*="cursor:pointer"]').css('cursor','default');
		disableObject('#table_stabilityAnalytics',true);
	});
}
function drawGraphTable(data){
	$('#table_stabilityAnalytics tbody').html('');
	for(var key in data.data){
		var rowObject = data.data[key];
		if(typeof rowObject == "object" && !$.isEmptyObject(rowObject)){
			tableRow 	= '<tr>'
				+'<td><span>' + (rowObject.key?rowObject.key:"--") + '</span></td>'
				+'<td>' +(rowObject.avgDeviceUptime?rowObject.avgDeviceUptime + ' hours':"--")  + ' </td>'
				+'<td>' +(rowObject.mtbf?rowObject.mtbf+' hours':"--")  + '  </td>'
				+'<td class="rActive">' +(rowObject.value?rowObject.value + ' hours':"--")  + ' </td>'
				+'<td>' +(rowObject.criticalCrashCount?rowObject.criticalCrashCount:"--")  + '  </td>'
				+'<td>' +(rowObject.deviceCount?rowObject.deviceCount:"--")  + '  </td>'
					+'</tr>';
			$('#table_stabilityAnalytics tbody').append(tableRow);
		}
	}
	var tblId = "#table_stabilityAnalytics";
	fixThead(tblId);
}
function drawTable(data){
	$('#table_stabilityAnalytics tbody').html('');
	for(var key in data.data){
		var rowObject = data.data[key];
		if(typeof rowObject == "object" && !$.isEmptyObject(rowObject)){
			tableRow 	= '<tr>'
				+'<td><span>' +(rowObject.key?rowObject.key:"--")  + '</span></td>'
				+'<td>' +(rowObject.avgDeviceUptime?rowObject.avgDeviceUptime + ' hours':"--")  + ' </td>'
				+'<td>' +(rowObject.mtbf?rowObject.mtbf+' hours':"--")  + '  </td>'
				+'<td class="rActive">' +(rowObject.value?rowObject.value + ' hours':"--")  + ' </td>'
				+'<td>' +(rowObject.criticalCrashCount?rowObject.criticalCrashCount:"--")  + '  </td>'
				+'</tr>';
			$('#table_stabilityAnalytics tbody').append(tableRow);
		}
	}
	var tblId = "#table_stabilityAnalytics";
	fixThead(tblId);
}
function hideShowCrashModal(getObj){
	$(getObj).closest('.panel-heading').next().toggleClass("hide");
	if(!$(getObj).closest('.panel-heading').next().hasClass("hide"))
		drawToggleGraph();
}

function rediectToDebugLogs(buildName, deviceSerialNo){
	objUrlParam.buildName = buildName;
	objUrlParam.deviceSerialNo = deviceSerialNo;
	window.location = './debugLog.jsp?'+getEncodedNotification();
	
}
function drawBuildData(){
	objToggelGraphData.fnName = "getStabilityAnalyticsChartData";
	objToggelGraphData.params = ['/api/graph/v1/stability-uptime/build',setModalIdForCrashAnalytics, setGroupIdForCrashAnalytics, $('#highchart_crashModel_analytics'),'Crash Count',['Device Software Builds'], drawChartForOnePrimarryAxis];
	if($("#highchart_crashModel_analytics:visible").length)
		getStabilityAnalyticsChartData('/api/graph/v1/stability-uptime/build',setModalIdForCrashAnalytics, setGroupIdForCrashAnalytics, $('#highchart_crashModel_analytics'),'Crash Count',['Device Software Builds'], drawChartForOnePrimarryAxis);
	getStabilityAnalyticsChartData('/api/graph/v1/stability-uptime/build',setModalIdForCrashAnalytics, setGroupIdForCrashAnalytics, $('#highchart_stability-statistics'),'Total Stability (in hrs)','Total Stability', drawTertiaryGraphForStablity);
}