var buildData = {};
$(document).ready(function() {
	objMode.nav.selected = 'wizard';
	objMode.nav.selected_tab = 'CrashModelAnalytics';
	loadNav();
	$('#tn_wizard').addClass('active');
//	getDeviceModels(drawGraphs);
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel); 
});

function drawGraphs(modelId, groupId) {
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	currentDeviceModel = $("#current_device_model").text();
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel);
	disableObject("#device_crashModelAnalytics", false, false);
	getCrashModelChartData("/api/graph/v1/crashModelAnalytics/build", modelId, groupId, $('#highchart_CrashModel_analytics'), 'Crash Count', [ 'Device Software Builds' ], drawChartForOnePrimarryAxis);
}


function drawCrashGraphTable(responseData) {
	$('#table_crashModel tbody').html('');
	for (var key in responseData) {
		var tableRow = '<tr><td><span>'+(key ? key : "--")+'</span></td>'
		+'<td>'+(responseData[key].totalCount > 0 ? responseData[key].totalCount : "--")+''
		+'</td></tr>';
		$('#table_crashModel tbody').append(tableRow);
	}
}

function getCrashModelChartData(url, modelId, groupId, $elem, title, categories, onSuccess) {
	buildData.groupId = groupId;
	buildData.modelId = modelId;
	buildData.elem = $elem;
	$('span.action_breadcrumb').addClass('hidden');
	$('#table_crashModel thead th#th_col1').html('SW Release');
	$('#table_crashModel thead th#th_col2').html('Crash Count');
	$('#table_crashModel tbody').html('');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
		$.ajax({url : url,
			data : groupId ? {modelId : modelId, groupId : groupId } : {modelId : modelId},
			contentType : "application/json",
			dataType : 'json',
			success : function(response) {
			if (response.httpStatusCode === 200) {
				if ($.isEmptyObject(response.data)
						|| response.data.length === 0) {
					$elem.html('');
					$('#table_crashModel tbody').append('<tr><td colspan="2"><span>No Data Found</span></td></tr>');
					return emptyGraph($elem);
				}
				drawCrashGraphTable(response.data);
				var rObj = {};
				var categories = [];
				var arrInd = {};
				$.each(response.data,function(ind,catData){
					categories.push(ind);
					$.each(catData,function(index,value){
						arrInd[index] = 0;
					} );
				});
				delete arrInd.totalCount;
				$.each(response.data,function(ind,catData){
					$.each(arrInd,function(index,value){
						rObj[index] = rObj[index]?rObj[index]:[];
						var tV = catData[index] ? catData[index] : 0;
						rObj[index].push(tV);
					} );
				});
				var rArray = [];
				$.each(rObj, function(ind,val){
					var tObj = {"name":ind,"data":[]};
					tObj.data = val;
					var pointObj = {};
					var eventObj = new Object();
					eventObj['click'] = function(event){
						callEventForDevices(event.point.category, groupId, modelId, $elem, title, [ 'Devices' ], onSuccess);
					};
					pointObj['events'] = eventObj;
					tObj['point'] = pointObj;
					tObj['cursor'] = "pointer";
					rArray.push(tObj);
				});				
				rArray;
				if (typeof onSuccess == "function")
					onSuccess(categories, rArray, $elem, title);
			}
		}
	}).complete(function() {
		disableObject("#device_crashModelAnalytics", true, false);
	});
}
function callEventForDevices(buildName, groupId, modelId, $elem, title, categories, onSuccess) {
	$('#table_crashModel tbody').html('');
	$('#table_crashModel thead th#th_col1').html('Device Serial No');
	$('#table_crashModel thead th#th_col2').html('Crash Count');
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$('span#actionBuild').removeClass('hidden').addClass('active');
	$('span#actionBuild a').html(buildName);
	$('span#actionDeviceModel a').attr('onclick', 'drawCrashData();');
	$.ajax({
		url : '/api/graph/v1/crashModelAnalytics/device',
		data : {buildName : buildName, groupId : groupId, modelId : modelId},
		contentType : "application/json",
		dataType : 'json',
		success : function(response) {
			if (response.httpStatusCode === 200) {
				if ($.isEmptyObject(response.data)
						|| response.data.length === 0) {
					$elem.html('');
					return emptyGraph($elem);
				}
				drawCrashGraphTable(response.data);
				var rObj = {};
				var categories = [];
				var arrInd = {};
				$.each(response.data,function(ind,catData){
					categories.push(ind);
					$.each(catData,function(index,value){
						arrInd[index] = 0;
					} );
				});
				delete arrInd.totalCount;
				$.each(response.data,function(ind,catData){
					$.each(arrInd,function(index,value){
						rObj[index] = rObj[index]?rObj[index]:[];
						var tV = catData[index] ? catData[index] : 0;
						rObj[index].push(tV);
					} );
				});
				var rArray = [];
				$.each(rObj, function(ind,val){
					var tObj = {"name":ind,"data":[]};
					tObj.data = val;
					rArray.push(tObj);
				});				
				rArray;

				if (typeof onSuccess == "function")
					onSuccess(categories, rArray, $elem, title);
			}
		}
	});
}

function drawCrashData() {
	getCrashModelChartData('/api/graph/v1/crashModelAnalytics/build', buildData.modelId, buildData.groupId, buildData.elem, 'Crash Count', [ 'Device Software Builds' ], drawChartForOnePrimarryAxis);
}
