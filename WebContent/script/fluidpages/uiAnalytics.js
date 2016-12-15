var buildData ={ elem : $("#highchart_uiAnalytics_open")};
$(document).ready(function() {
	$('#tn_wizard').addClass('active');
	objMode.nav.selected = 'wizard';
	objMode.nav.selected_tab='uiAnalytics';
	graphCalibrator.setting.height_ratio = .6;
	loadNav();
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel); 
});
function drawGraphs(modelId, groupId){
	draw_graphs_for_ui_event(modelId, groupId, 'OPEN');
}
function draw_graphs_for_ui_event(modelId, groupId, type){
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	currentDeviceModel = $("#current_device_model").text();
	$(".col-lg-6.btnGroupActionBar .breadcrumb1").html(currentDeviceModel); 
	disableObject("#device_uiAnalytics");
	getUIChartData("/api/graph/v1/uiAnalytics/build", $('#highchart_uiAnalytics_'+type.toLowerCase()), modelId, groupId , 'Time in seconds', uiChartCallback);
}

function uiChartCallback(uiChartObject, $elem, title){
	drawUITable(uiChartObject.tableData, 'SW Release');
	drawUIChart(uiChartObject, $elem, title);
}

function callDeviceGraph(data, $elem, title, onSuccess){
	disableObject("#"+$elem.attr("id"));
	$('span#actionBuild,  span#actionDeviceModel').removeClass('hidden').addClass('active');
	$('span#actionDeviceModel a').attr('onclick', 'drawBuildData();');
	$('span#actionBuild a').html(data.buildName);
	$.ajax({
		url : '/api/graph/v1/uiAnalytics/device',
		data : data,
		contentType : "application/json",
		dataType : 'json',
		success: function(response){
			if(response.httpStatusCode === 200){
				var kpiData = response.data.kpis;
				if( $.isEmptyObject(response.data.actuals) || response.data.length === 0){
					$elem.html('');
					drawUITable([], 'Device Serial No');
					return emptyGraph($elem);
				}
				var uiChartObject = {
						categories : [],
						series : [],
						plotLines : [],
						tableData : []
				};
				var count = 0;
				uiChartObject.deviationLine = {
		            type: 'spline',
		            name: 'KPI Pass Rate',
		            data: [],
		            maxKpi: {},
		            marker: {
		                lineWidth: 2,
		                fillColor: 'white'
		            }
		        };
				var plotLineObj = new Object();
				var maxKpi = kpiData[Object.keys(kpiData)[0]];
				var minKpi = kpiData[Object.keys(kpiData)[0]];
				for(var key in kpiData){
					var seriesObj = new Object();
					maxKpi = maxKpi < kpiData[key] ? kpiData[key] : maxKpi;
					minKpi = minKpi > kpiData[key] ? kpiData[key] : minKpi;
					seriesObj['name'] = key +' ( KPI: '+ kpiData[key] +')';
					seriesObj['name_count'] = key +' ( KPI: '+ kpiData[key] +'; Launch Count:';
					seriesObj['id'] = key;
					seriesObj['kpis'] = kpiData[key];
					seriesObj['data'] = [];
					seriesObj['color'] = Highcharts.getOptions().colors[count++];
					uiChartObject.series.push(seriesObj);
					var tmpObject = {};
					if(typeof plotLineObj[kpiData[key]] == "object"){
						plotLineObj[kpiData[key]]["color_keys"].push(seriesObj.color);
					}else{
						tmpObject['name'] = key +' ( KPI: '+ kpiData[key] +')';
						tmpObject['value'] = kpiData[key];
						tmpObject['width'] = 2;
						tmpObject['color'] = seriesObj.color;
						tmpObject['color_keys'] = [seriesObj.color];
						tmpObject['id'] = 'plot-line-'+count;
						plotLineObj[kpiData[key]] = tmpObject;
					}
				}
				$.each(plotLineObj,function(iTmp,vTmp){
					vTmp.label = {
		                    text: getPloatlineLabel(this),
		                    align: 'right',
		                    x: -10,
		                    useHTML: true
		                };
					uiChartObject.plotLines.push(vTmp);
				});
				kpiRange = maxKpi - minKpi;
				uiChartObject.deviationLine.minKpi = minKpi;
				uiChartObject.deviationLine.kpiRange = kpiRange;
				var deviation_sub_total = 0;
				var appCount = 0;
				for(var key in response.data.actuals){
					var tableRowObj = new Object();
					tableRowObj['title'] = key;
					tableRowObj['actuals'] = {};
					tableRowObj['deviation'] =  response.data.deviation[key];
					uiChartObject.categories.push(key);
					for(var i=0; i< uiChartObject.series.length; i++){
						var tVal = undefined;
						var objActual = response.data.actuals[key];
						var app_i = uiChartObject.series[i];
						var objActual_app = objActual[app_i.id];
						if(undefined != objActual_app){
							appCount++;
							tVal= objActual_app.avg;
							deviation_sub_total += (objActual_app.avg < kpiData[app_i.id])? 1 : 0 ;
							uiChartObject.max = (tVal > uiChartObject.max)? tVal:uiChartObject.max;
							uiChartObject.min = (tVal < uiChartObject.min)? tVal:uiChartObject.min;
							app_i.data.push(objActual_app.avg);
							tableRowObj.actuals[app_i.name_count+''+objActual_app.count+')'] = objActual_app.avg;
						}else{
							app_i.data.push(0);
						}
					}
					uiChartObject.deviationLine.data.push((deviation_sub_total / appCount*kpiRange)+minKpi);
					uiChartObject.tableData.push(tableRowObj);
				}
				uiChartObject.deviationLine.marker.lineColor = Highcharts.getOptions().colors[count+1];
				uiChartObject.deviationLine.color = Highcharts.getOptions().colors[count+1];
				uiChartObject.series.push(uiChartObject.deviationLine);
				if(typeof onSuccess == "function")
					onSuccess(uiChartObject, $elem, title);
				drawUITable(uiChartObject.tableData, 'Device Serial No');
			}
		}
	});
}
function drawBuildData(){
	getUIChartData("/api/graph/v1/uiAnalytics/build", buildData.elem, buildData.modelId, buildData.groupId, 'Time in seconds', uiChartCallback);
}
function drawUITable(tableData, type){
	$(".tableTitleTypeClass").html(type);
	var tableRows = "";
	$(tableData).each(function(i){
		tableRows += '<tr><td>'+this.title+'</td><td><table class="table">';
		for(var key in this.actuals){
			tableRows += '<tr><td>'+key+'</td><td align="right">'+this.actuals[key].toFixed(2)+'</td></tr>';
		}
		tableRows += '</table></td>';
		tableRows += '<td >'+this.deviation.toFixed(2)+' %</td>';
		tableRows += '</tr>';

	});
	$("#table_deviceModel > tbody").html(tableRows);
	var tblId = "#table_deviceModel";
	fixThead(tblId);
}