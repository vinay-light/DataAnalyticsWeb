var tblArr = [];
var count = 0;
var modelIdForRefreshgraph;
var groupIdForRefreshgraph;
$(document).ready(function() {
	objMode.nav.selected = 'home';
	objMode.nav.selected_tab = 'predefinedAnalytics';
	loadNav();
	$('div#actionNavbar').hide();
	loadActionBar('addGraph');
	$('.add_graph').click(function(){
		alert('This feature not implemented yet.');
	});

});
function getAnalyticsTableData(modelId,groupId){
	$("#table_deviceModel > tbody").html('<tr><td colspan="'+$("#table_deviceModel tr:first th").length+'">&nbsp;</td></tr>');
	disableObject("#table_deviceModel > tbody>tr:first");
	$.ajax({
		url : '/api/graph/v1/analytics-table-data/build',
		data : {modelId : modelId, groupId : groupId},
		contentType : "application/json",
		dataType : 'json',
		success: function(response){
			disableObject("#table_deviceModel > tbody>tr:first",true);
			if(response.httpStatusCode === 200){
				var tableRows = "";
				$("#table_deviceModel > tbody").html("");
				$(response.data).each(function(i){
					tableRows += '<tr><td>'+this.build+'</td>';
					if(undefined != this.totalUptime)
						tableRows += '<td>'+this.totalUptime+' hours</td>';
					else
						tableRows += '<td>--</td>';
					if((undefined != this.stabilitymtbf) && (0 !== this.stabilitymtbf))
						tableRows += '<td>'+this.stabilitymtbf+' hours</td>';
					else
						tableRows += '<td>--</td>';
					if(undefined != this.totalScreenOnTime)
						tableRows += '<td>'+this.totalScreenOnTime+' hours</td>';
					else
						tableRows += '<td>--</td>';
					if(undefined != this.batteryLife)
						tableRows += '<td>'+this.batteryLife+' hours</td>';
					else
						tableRows += '<td>--</td>';
					if(undefined != this.performance)
						tableRows += '<td>'+this.performance+'% </td>';
					else
						tableRows += '<td>--</td>';
					if(undefined != this.deviceCount)
						tableRows += '<td>'+this.deviceCount+' </td></tr>';
					else
						tableRows += '<td>--</td></tr>';
					$("#table_deviceModel > tbody").append(tableRows);
					tableRows = "";
				});
				var tblId = "#table_deviceModel";
				fixThead(tblId);
			}
		}
	}).complete(function(data){
		disableObject("#table_deviceModel > tbody>tr:first",true);
	});
}
function drawGraphs(modelId,groupId){
	modelIdForRefreshgraph = modelId
	groupIdForRefreshgraph = groupId
	getAnalyticsTableData(modelId,groupId);
	
	$("[id^='dashboard_']").each(function(key, value){
		if($(this).width() > 200){
			var tH = ($(this).width() > window.innerHeight?window.innerHeight*.6:$(this).width())*.8;
			$(this).height(tH);
		}
		if($(this).attr('id')=='dashboard_stability-statistics'){
			fetchDataAndDrawGraph("/api/graph/v1/stability-uptime/build",$(this),modelId,groupId, 'Total Stability (in hrs)', 'Total Stability', drawTertiaryGraphForStablity);
		}else if($(this).attr('id')=='dashboard_battery-statistics'){
			fetchDataAndDrawGraph("/api/graph/v1/batteryAnalytics/build", $(this),modelId,groupId, 'Avg. Battery Uptime (in hrs)', 'Avg Battery Uptime',drawChartForTwoPrimaryAndOneSecondaryAxis);
		}else if($(this).attr('id')=='dashboard_uiAnalytics'){
			getUIChartData("/api/graph/v1/uiAnalytics/build", $(this), modelId, groupId,'Time in seconds', drawUIChart);
		}else{
			$('.notification_error').html('Data field not defined.');
		}
	});
}

function callDeviceGraph(data, $elem, title, onSuccess){ // Placeholder/abstract
	window.location = "/pages/uiAnalytics.jsp";
}
function graphRefresh(id){
	if(id=='dashboard_stability-statistics'){
		fetchDataAndDrawGraph("/api/graph/v1/stability-uptime/build",$('#'+id),modelIdForRefreshgraph, groupIdForRefreshgraph, 'Total Stability (in hrs)', 'Total Stability', drawTertiaryGraphForStablity);
	}else if(id=='dashboard_battery-statistics'){
		fetchDataAndDrawGraph("/api/graph/v1/batteryAnalytics/build", $('#'+id),modelIdForRefreshgraph,groupIdForRefreshgraph, 'Avg. Battery Uptime (in hrs)', 'Avg Battery Uptime',drawChartForTwoPrimaryAndOneSecondaryAxis);
	}else if(id=='dashboard_uiAnalytics'){
		getUIChartData("/api/graph/v1/uiAnalytics/build", $('#'+id), modelIdForRefreshgraph, groupIdForRefreshgraph,'Time in seconds', drawUIChart);
	}
}
function drawChartForTwoPrimaryAndOneSecondaryAxis(categories, deviceStatusArr,
		$elem, title) {
	var categoriesArray = [];
	var valueArray = [];
	var avgDeviceUpTimeArray = [];
	var baterryLifeTime = [];
	var totalScreenOnTime = [];
	var valMin, valMax;
	valMin = valMax = 1;
	var suffix = title.lastIndexOf("in min") > 0 ? " min" : " hrs";
	$
			.each(
					deviceStatusArr,
					function(index, value) {
						if (typeof value.data[0] != "function") {
							categoriesArray.push(value.data[0].key
									+ '<br/>Devices: '
									+ value.data[0].deviceCount);
							valMax = valMax < value.data[0].value ? value.data[0].value
									: valMax;
							valMin = valMin > value.data[0].value ? value.data[0].value
									: valMin;
							avgDeviceUpTimeArray
									.push(value.data[0].avgDeviceUptime);
							baterryLifeTime
									.push(value.data[0].avgBatteryLifetime);
							totalScreenOnTime
									.push(value.data[0].totalScreenOnTime != undefined ? value.data[0].totalScreenOnTime
											: 0);
						}
					});

	var calibrator = graphCalibrator;
	valMin = valMin < 1 ? 1 : valMin;
	var t = graphCalibrator.setting.offset_x;
	graphCalibrator.setting.offset_x += 120;
	calibrator.adjustGraph($elem, valMax, valMin, categoriesArray.length);
	graphCalibrator.setting.offset_x = t;
	$elem.highcharts({
		chart : {
			renderTo : $elem.attr("id"),
			type : 'column'
		},
		legend : {
			itemStyle : {
				fontWeight : 'normal',
				fontSize : '10px'
			}
		},
		title : {
			text : null
		},
		xAxis : [ {
			categories : categoriesArray,
			labels : {
				formatter : function() {
					return calibrator.formatLabel(this.value);
				},
				style : {
					width : 'auto'
				},
				useHTML : true
			}
		} ],
		yAxis : [ { // Primary yAxis
			labels : {
				format : '{value}',
				style : {
					color : Highcharts.getOptions().colors[1],
					fontSize : '10px'
				}
			},
			title : {
				text : 'Avg Battery Life(in hrs)',
				style : {
					color : Highcharts.getOptions().colors[1],
					fontSize : '10px'
				}
			},
			min : 0,
		}, { // Secondary yAxis
			labels : {
				format : '{value}',
				style : {
					color : Highcharts.getOptions().colors[2],
					fontSize : '10px'
				}
			},
			title : {
				text : 'Total Device Uptime(in hrs)',
				style : {
					color : Highcharts.getOptions().colors[2],
					fontSize : '10px'
				}
			},
			min : 0,
			opposite : true
		}, { // tertiary yAxis
			title : {
				text : 'Total Screen On(in hrs)',
				style : {
					color : Highcharts.getOptions().colors[3],
					fontSize : '10px'
				}
			},
			labels : {
				format : '{value}',
				style : {
					color : Highcharts.getOptions().colors[3],
					fontSize : '10px'
				}
			},
			min : 0
		} ],
		credits : {
			enabled : false
		},
		exporting : {
			enabled : false
		},
		tooltip : {
			shared : true
		},
		plotOptions : {
			series : {
				cursor : 'pointer',
				point : {
					events : {
						click : function(event) {
							var container = $(event.target).closest(
									".panel-body div.graph_container");
							if (container.attr("data-column_click_target")) {
								// We can't send it through url, text gets
								// scrambled. Save in in local session and send
								// the index instead
								// var timeV = Number(new Date());
								// sessionStorage['tmpVar_'+timeV] =
								// this[container.attr("data-target_field")];
								window.location = container
										.attr("data-column_click_target");// +'tmpVar_'+timeV;
							} else if (typeof buildData != 'undefined') {
								var buidName = event.currentTarget.category;
								buidName = buidName.substr(0, buidName
										.indexOf('<'));
								callEvent(buidName, buildData.groupId,
										buildData.modelId, buildData.elem,
										'Total Device Uptime (in hrs)',
										[ 'Avg. Battery Uptime' ],
										buildData.onSuccess);
							}
						}
					}
				}
			}
		},
		series : [ {
			name : 'Avg Battery Life',
			type : 'column',
			color : '#434348',
			data : baterryLifeTime,
			tooltip : {
				valueSuffix : ' hrs'
			}
		}, {
			name : 'Total Device Uptime',
			type : 'spline',
			color : '#90ed7d',
			yAxis : 1,
			data : avgDeviceUpTimeArray,
			tooltip : {
				valueSuffix : ' hrs'
			}
		}, {
			name : 'Total Screen On',
			type : 'spline',
			data : totalScreenOnTime,
			yAxis : 2,
			color : '#f7a35c',
			tooltip : {
				valueSuffix : ' hrs'
			}
		} ]
	});
	disableObject("#" + $elem.attr("id"), true);
}
function drawTertiaryGraphForStablity(categories, deviceStatusArr, $elem, title) {
	var categoriesArray = [];
	var valueArray = [];
	var avgUpTimeArray = [];
	var MTBF = [];
	valMax = valMin = 1;
	var suffix = title.lastIndexOf("in min") > 0 ? " min" : " hrs";
	$.each(deviceStatusArr, function(index, value) {
		if (typeof value.data[0] != "function" && value.data[0] != undefined) {
			if (value.data[0].deviceCount != undefined) {
				categoriesArray.push(value.data[0].key + '<br/>Devices: '
						+ value.data[0].deviceCount);
			} else {
				categoriesArray.push(value.data[0].key);
			}
			if (typeof value.data[0].avgDeviceUptime != 'undefined') {
				avgUpTimeArray.push(value.data[0].avgDeviceUptime);
			}
			if (typeof value.data[0].mtbf != 'undefined') {
				MTBF.push(value.data[0].mtbf);
			}
		}
	});
	var calibrator = graphCalibrator;
	var t = graphCalibrator.setting.offset_x;
	graphCalibrator.setting.offset_x += 170;
	valMin = valMin < 1 ? 1 : valMin;
	calibrator.adjustGraph($elem, false, false, categoriesArray.length);
	graphCalibrator.setting.offset_x = t;
	$elem.highcharts({
		chart : {
			type : 'column'
		},
		legend : {
			itemStyle : {
				fontWeight : 'normal',
				fontSize : '10px'
			}
		},
		title : {
			text : null
		},
		xAxis : [ {
			categories : categoriesArray,
			labels : {
				formatter : function() {
					return calibrator.formatLabel(this.value);
				},
				style : {
					width : 'auto'
				},
				useHTML : true
			}
		} ],
		yAxis : [ { // Primary yAxis
			labels : {
				format : '{value}',
				style : {
					color : Highcharts.getOptions().colors[1],
					fontSize : '10px'
				}
			},
			title : {
				text : 'MTBF (in hrs)',
				style : {
					color : Highcharts.getOptions().colors[1],
					fontSize : '10px'
				}
			},
			min : 0
		}, { // Secondary yAxis
			title : {
				text : 'Total Device Uptime (in hrs)',
				style : {
					color : Highcharts.getOptions().colors[2],
					fontSize : '10px'
				}
			},
			labels : {
				format : '{value}',
				style : {
					color : Highcharts.getOptions().colors[2],
					fontSize : '10px'
				}
			},
			min : 0,
			opposite : true
		} ],
		credits : {
			enabled : false
		},
		exporting : {
			enabled : false
		},
		tooltip : {
			shared : true
		},
		plotOptions : {
			series : {
				cursor : 'pointer',
				point : {
					events : {
						click : function(event) {
							var container = $(event.target).closest(
									".panel-body div.graph_container");
							if (container.attr("data-column_click_target")) {
								//We can't send it through url, text gets scrambled. Save in in local session and send the index instead
								//	                    		   var timeV =  Number(new Date());
								//	                    		   sessionStorage['tmpVar_'+timeV] = this[container.attr("data-target_field")];
								window.location = container
										.attr("data-column_click_target");//+'tmpVar_'+timeV;
							} else if (typeof buildData != 'undefined') {
								var buidName = event.currentTarget.category;
								if (buidName.indexOf('<') != -1) {
									buidName = buidName.substr(0, buidName
											.indexOf('<'));
									callEvent(buidName, buildData.groupId,
											buildData.modelId, buildData.elem,
											'Device Uptime (in hrs)',
											[ 'Device Uptime' ],
											buildData.onSuccess);
								}
							}
						}
					}
				}
			}
		},
		series : [ {
			name : 'MTBF',
			type : 'column',
			color : '#434348',
			data : MTBF,
			tooltip : {
				valueSuffix : ' hrs'
			}
		}, {
			name : 'Total Device Uptime',
			type : 'spline',
			yAxis : 1,
			color : '#90ed7d',
			data : avgUpTimeArray,
			tooltip : {
				valueSuffix : ' hrs'
			}
		} ]
	});
	disableObject("#" + $elem.attr("id"), true);
}