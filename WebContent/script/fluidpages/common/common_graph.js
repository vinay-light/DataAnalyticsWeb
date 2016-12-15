Highcharts.getOptions().colors = ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#352acb", "#8d4653", "#91e8e1", "#0000A0", "#000000", "#ff0000"];
function fetchDataAndDrawGraph(url, $elem,modelId,groupId, title, categories, graphType){
	if(graphType != null || graphType != undefined){
		getChartData(url,modelId,groupId, $elem, title, categories, graphType);
	}else{
		getChartData(url,modelId,groupId, $elem, title, categories, drawChartForOnePrimaryAndOneSecondaryAxis);
	}
}
function getChartData(url, modelId, groupId, $elem, title, categories, onSuccess){
	disableObject("#"+$elem.attr("id"));
	$.ajax({
		url : url,
		data : groupId ? {modelId : modelId, groupId : groupId} : {modelId : modelId},
		contentType : "application/json",
		dataType : 'json',
		success: function(response){
			if(response.httpStatusCode === 200){
				if( $.isEmptyObject(response.data) || response.data.length === 0){
					$elem.html('');
					return emptyGraph($elem);
				}
				var deviceStatusArr = [];
	 			for(var key in response.data){
	 				  var deviceStatus = {name:key,data:[response.data[key]],point:{
	 					  events:{
	 		                    click: function (event) {
	 		                    }
	 		                }
	 		            }};
	 				  deviceStatusArr.push(deviceStatus);
	 			 }
				if(typeof onSuccess == "function")
					onSuccess(categories, deviceStatusArr, $elem, title);
			}
		}
	});
}
function drawChartForOnePrimarryAxis(categories, deviceStatusArr, $elem, title){
	if(title == "Crash Count" && deviceStatusArr != null && deviceStatusArr.length > 0) {
		var name = deviceStatusArr[0].name;
		deviceStatusArr[0].color = name == "APPLICATION" ? Highcharts
				.getOptions().colors[10] : (name == "TOMBSTONES" ? Highcharts
				.getOptions().colors[11] : Highcharts.getOptions().colors[12]);
		if(deviceStatusArr.length > 1) {
			name = deviceStatusArr[1].name;
			deviceStatusArr[1].color = name == "APPLICATION" ? Highcharts
					.getOptions().colors[10] : (name == "TOMBSTONES" ? Highcharts
					.getOptions().colors[11] : Highcharts.getOptions().colors[12]);
		}
		if(deviceStatusArr.length > 2) {
			name = deviceStatusArr[2].name;
			deviceStatusArr[2].color = name == "APPLICATION" ? Highcharts
					.getOptions().colors[10] : (name == "TOMBSTONES" ? Highcharts
					.getOptions().colors[11] : Highcharts.getOptions().colors[12]);
		}
	}
	var calibrator = graphCalibrator;
	valMax = valMin = 1;
	valMin = valMin < 1?1:valMin;
	calibrator.adjustGraph($elem,valMax,valMin,categories.length);
	$elem.highcharts({
       chart: {
           renderTo: $elem.attr("id"),
           type: 'column'
       },
       plotOptions: {
           series: {
               cursor: 'pointer',
               point: {
                   events: {
                       click: function () {
                           alert('Category: ' + this.category + ', value: ' + this.y);
                       }
                   }
               }
           }
       },
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
                   color: Highcharts.getOptions().colors[1],
                   fontSize: '10px'
               }
           },
           title: {
               text: title,
               style: {
                   color: Highcharts.getOptions().colors[1],
                   fontSize: '10px'
               }
           },
           min:0
       }],
       series: deviceStatusArr,
       credits :{
       	enabled: false
       },
       exporting: {
       	enabled: false
       },
       plotOptions: {
           series: {
               stacking: 'normal'
           }
       },
       tooltip: {
      	 formatter: function() {
      		 //Stability /Battery Uptime across N devices = XX
      		 var deviceName;
      		 if($elem.attr('id')=='highchart_stability-statistics'){
      			deviceName = 'Stability Uptime for';
      		 }else if($elem.attr('id')=='highchart_battery-statistics'){
      			deviceName = 'Battery Uptime for';
      		 }else{
      			deviceName = this.x;
      		 }
  		 	 if(deviceName == "Device Components"){
  		 		 return deviceName +'<br/><b>'+ this.series.name +' : '+ this.y +' %<b>';
  		 	 } else{
  		 		 // Data to be shown upto 2 decimal places
  		 	     return deviceName +'<br/><b>'+ this.series.name +' : '+ Highcharts.numberFormat(this.y, 2)+'</b>';
  		 	 }
      	  }
      }
   });
   disableObject("#"+$elem.attr("id"),true);
}
function drawChartForOnePrimaryAndOneSecondaryAxis(categories,deviceStatusArr, $elem, title){
	var categoriesArray = [];
	var valueArray = [];
	var avgUpTimeArray = [];
	valMax = valMin = 1;
	var suffix = title.lastIndexOf("in min") > 0 ? " min" : " hrs";
	$.each(deviceStatusArr, function(index,value){
		if(typeof value.data[0] != "function" && value.data[0] != undefined){
			if(value.data[0].deviceCount != undefined){
				categoriesArray.push(value.data[0].key +'<br/>Devices: '+ value.data[0].deviceCount);
			}else{
				categoriesArray.push(value.data[0].key);
			}
			valueArray.push(value.data[0].value);
			if(typeof value.data[0].avgDeviceUptime != 'undefined'){
				avgUpTimeArray.push(value.data[0].avgDeviceUptime);
			}
			if(typeof value.data[0].avgBatteryLifetime != 'undefined'){
				avgUpTimeArray.push(value.data[0].avgBatteryLifetime);
			}
		}
	});
	var calibrator = graphCalibrator;
	valMin = valMin < 1?1:valMin;
	calibrator.adjustGraph($elem,false,false,categoriesArray.length);
	$elem.highcharts({
       chart: {
           //height: 210,
           type: 'column'
       },
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
           categories: categoriesArray,
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
               text: 'Total Device Uptime(In Hours)',
               style: {
                   color: Highcharts.getOptions().colors[2],
                   fontSize: '10px'
               }
           },
           min:0,
           opposite: true
       }, { // Secondary yAxis
           title: {
               text: title,
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
               cursor: 'pointer',
               point: {
                   events: {
                       click: function (event) {
                    	   var container = $(event.target).closest(".panel-body div.graph_container");
                    	   if(container.attr("data-column_click_target")){
                    		   //We can't send it through url, text gets scrambled. Save in in local session and send the index instead
//                    		   var timeV =  Number(new Date());
//                    		   sessionStorage['tmpVar_'+timeV] = this[container.attr("data-target_field")];
                    		   window.location = container.attr("data-column_click_target");//+'tmpVar_'+timeV;
                    	   }else  if(typeof buildData != 'undefined'){
	                    	   var buidName = event.currentTarget.category;
	                    	   if(buidName.indexOf('<') != -1){
	                    		   buidName = buidName.substr(0, buidName.indexOf('<'));
	                    		   callEvent(buidName, buildData.groupId, buildData.modelId,buildData.elem,'Device Uptime (in hrs)', ['Device Uptime'],buildData.onSuccess);
	                    	   }else if (title == "Battery Uptime (in hrs)"){
	                    		   callEventForComponents(buildData.buildName,event.currentTarget.category,buildData.elem,'Battery Consumption (in %)',['Device Components'],drawChartForOnePrimarryAxis);
	                    	   }
                    	   }
                       }
                   }
               }
           }
       },
       series: [{
           name: categories,
           type: 'column',
           yAxis: 1,
           data: valueArray,
           tooltip: {
               valueSuffix: suffix
           }
       }, {
           name: 'Total Device Uptime',
           type: 'spline',
           color : '#43EB29',
           data: avgUpTimeArray,
           tooltip: {
               valueSuffix: ' hrs'
           }
       }]
   });
   disableObject("#"+$elem.attr("id"),true);
}
function drawTertiaryGraph(categories,deviceStatusArr, $elem, title){
	var categoriesArray = [];
	var valueArray = [];
	var avgUpTimeArray = [];
	var avgBatteryLifetime = [];
	var totalScreenOnTime = [];
	valMax = valMin = 1;
	var suffix = title.lastIndexOf("in min") > 0 ? " min" : " hrs";
	$.each(deviceStatusArr, function(index,value){
		if(typeof value.data[0] != "function" && value.data[0] != undefined){
			if(value.data[0].deviceCount != undefined){
				categoriesArray.push(value.data[0].key +'<br/>Devices: '+ value.data[0].deviceCount);
			}else{
				categoriesArray.push(value.data[0].key);
			}
			valueArray.push(value.data[0].value);
			if(typeof value.data[0].avgDeviceUptime != 'undefined'){
				avgUpTimeArray.push(value.data[0].avgDeviceUptime);
			}
			if(typeof value.data[0].avgBatteryLifetime != 'undefined'){
				avgBatteryLifetime.push(value.data[0].avgBatteryLifetime);
			}
			totalScreenOnTime.push(value.data[0].totalScreenOnTime != undefined ? value.data[0].totalScreenOnTime : 0)
		}
	});
//	var calibrator = graphCalibrator;
//	valMin = valMin < 1?1:valMin;
//	calibrator.adjustGraph($elem,false,false,categoriesArray.length);

	var calibrator = graphCalibrator;
	valMin = valMin < 1?1:valMin;
	var t = graphCalibrator.setting.offset_x;
	graphCalibrator.setting.offset_x += 170;
	calibrator.adjustGraph($elem,valMax,valMin,categoriesArray.length);
	graphCalibrator.setting.offset_x = t;



	$elem.highcharts({
		chart: {
			//height: 210,
			type: 'column'
		},
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
			categories: categoriesArray,
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
					color: Highcharts.getOptions().colors[1],
					fontSize: '10px'
				}
			},
			title: {
				text: 'Avg Battery Liftime(in Hours)',
				style: {
					color: Highcharts.getOptions().colors[1],
                    fontSize: '10px'
				}
			},
			min:0,
			opposite: true
		}, { // Secondary yAxis
			title: {
				text: title,
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
		},{ // Tertiary yAxis
			title: {
				text: 'Total Device Uptime(In Hours)',
				style: {
					color: Highcharts.getOptions().colors[2],
					fontSize: '10px'
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[2],
                    fontSize: '10px'
				}
			},
			min:0,
			opposite: true
		},{ // fourth yAxis
			title: {
				text: 'Total Screen On(in hrs)',
				style: {
					color: Highcharts.getOptions().colors[3],
                    fontSize: '10px'
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[3],
                    fontSize: '10px'
				}
			},
			min:0,
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
				cursor: 'pointer',
				point: {
					events: {
						click: function (event) {
							var container = $(event.target).closest(".panel-body div.graph_container");
							if(container.attr("data-column_click_target")){
								//We can't send it through url, text gets scrambled. Save in in local session and send the index instead
//								var timeV =  Number(new Date());
//								sessionStorage['tmpVar_'+timeV] = this[container.attr("data-target_field")];
								window.location = container.attr("data-column_click_target");//+'tmpVar_'+timeV;
							}else  if(typeof buildData != 'undefined'){
								var buidName = event.currentTarget.category;
								if(buidName.indexOf('<') != -1){
									buidName = buidName.substr(0, buidName.indexOf('<'));
									callEvent(buidName, buildData.groupId, buildData.modelId,buildData.elem,'Device Uptime (in hrs)', ['Device Uptime'],buildData.onSuccess);
								}else if (title == "Avg. Battery Uptime (in hrs)"){
									callEventForComponents(buildData.buildName,event.currentTarget.category,buildData.elem,'Battery Consumption (in %)',['Device Components'],drawChartForOnePrimarryAxis);
								}
							}
						}
					}
				}
			}
		},
		series: [{
			name: categories,
			type: 'column',
			yAxis: 1,
			data: valueArray,
			tooltip: {
				valueSuffix: suffix
			}
		},{
			name: 'Avg Battery Life',
			type: 'spline',
			data: avgBatteryLifetime,
			tooltip: {
				valueSuffix: ' hrs'
			}
		},{
			name: 'Total Device Uptime',
			type: 'spline',
			yAxis: 2,
			data: avgUpTimeArray,
			tooltip: {
				valueSuffix: ' hrs'
			}
		},{
			name: 'Total Screen On',
			type: 'spline',
			yAxis: 3,
			data: totalScreenOnTime,
			tooltip: {
				valueSuffix: ' hrs'
			}
		}]
	});
	disableObject("#"+$elem.attr("id"),true);
}
function drawChartForTwoPrimaryAndOneSecondaryAxis(categories,deviceStatusArr, $elem, title){
	var categoriesArray = [];
	var valueArray = [];
	var avgDeviceUpTimeArray = [];
	var baterryLifeTime = [];
	var totalScreenOnTime = [];
	var valMin, valMax;
	valMin = valMax = 1;
	var suffix = title.lastIndexOf("in min") > 0 ? " min" : " hrs";
	$.each(deviceStatusArr, function(index,value){
		if(typeof value.data[0] != "function"){
			categoriesArray.push(value.data[0].key +'<br/>Devices: '+ value.data[0].deviceCount);
			valMax = valMax < value.data[0].value ? value.data[0].value : valMax;
			valMin = valMin > value.data[0].value ? value.data[0].value : valMin;
			valueArray.push(value.data[0].value);
			avgDeviceUpTimeArray.push(value.data[0].avgDeviceUptime);
			baterryLifeTime.push(value.data[0].avgBatteryLifetime);
			totalScreenOnTime.push(value.data[0].totalScreenOnTime != undefined ? value.data[0].totalScreenOnTime : 0);
		}
	});

	var calibrator = graphCalibrator;
	valMin = valMin < 1?1:valMin;
	var t = graphCalibrator.setting.offset_x;
	graphCalibrator.setting.offset_x += 120;
	calibrator.adjustGraph($elem,valMax,valMin,categoriesArray.length);
	graphCalibrator.setting.offset_x = t;
	$elem.highcharts({
       chart: {
           renderTo: $elem.attr("id"),
           type: 'column'
       },
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
           categories: categoriesArray,
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
               text: 'Total Device Uptime(in hrs)',
               style: {
                   color: Highcharts.getOptions().colors[2],
                   fontSize: '10px'
               }
           },
           min:0,
           opposite: true
       }, { // Secondary yAxis
           title: {
               text: title,
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
           min:0,
           opposite: true
       },{ // Secondary yAxis
           title: {
               text: 'Avg. Battery Life(in hrs)',
               style: {
                   color: Highcharts.getOptions().colors[1],
                   fontSize: '10px'
               }
           },
           labels: {
               format: '{value}',
               style: {
                   color: Highcharts.getOptions().colors[1],
                   fontSize: '10px'
               }
           },
           min:0
       },{ // tertiary yAxis
           title: {
               text: 'Total Screen On(in hrs)',
               style: {
                   color: Highcharts.getOptions().colors[3],
                   fontSize: '10px'
               }
           },
           labels: {
               format: '{value}',
               style: {
                   color: Highcharts.getOptions().colors[3],
                   fontSize: '10px'
               }
           },
           min:0
       }
       ],
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
               cursor: 'pointer',
               point: {
                   events: {
                       click: function (event) {
                    	   var container = $(event.target).closest(".panel-body div.graph_container");
                    	   if(container.attr("data-column_click_target")){
                    		   //We can't send it through url, text gets scrambled. Save in in local session and send the index instead
//                    		   var timeV =  Number(new Date());
//                    		   sessionStorage['tmpVar_'+timeV] = this[container.attr("data-target_field")];
                    		   window.location = container.attr("data-column_click_target");//+'tmpVar_'+timeV;
                    	   }else if(typeof buildData != 'undefined'){
	                    	   var buidName = event.currentTarget.category;
	                    	   buidName = buidName.substr(0, buidName.indexOf('<'));
	                    	   callEvent(buidName, buildData.groupId, buildData.modelId,buildData.elem,'Total Device Uptime (in hrs)', ['Avg. Battery Uptime'],buildData.onSuccess);
                    	   }
                       }
                   }
               }
           }
       },
       series: [{
           name: categories,
           type: 'column',
           yAxis: 1,
           data: valueArray,
           tooltip: {
               valueSuffix: suffix
           }
       }, {
           name: 'Avg Battery Life',
           type: 'column',
           yAxis: 2,
           data: baterryLifeTime,
           tooltip: {
               valueSuffix: ' hrs'
           }
       }, {
           name: 'Total Device Uptime',
           type: 'spline',
           data: avgDeviceUpTimeArray,
           tooltip: {
               valueSuffix: ' hrs'
           }
       },
       {
           name: 'Total Screen On',
           type: 'spline',
           data: totalScreenOnTime,
           yAxis: 3,
           tooltip: {
               valueSuffix: ' hrs'
           }
       }]
   });
   disableObject("#"+$elem.attr("id"),true);
}
function emptyGraph(elem){
	var imgPath ='';
	var img = $('<img id="dynamic">');
	if($(elem).width() < 500 || true){
		imgPath= '/images/no_data_available_450x200px.png';
	}else{
		imgPath = '/images/no_data_available_913x200px.png';
	}
	img.attr('src', imgPath);
	img.addClass("img_placeholder");
	img.appendTo(elem);
}
function refreshGraph(action, event){
	switch (action) {
	case 'delete_graph':
		$('#div_confirmDialog1').modal('show');
		$('#btn_delete').unbind('click');
		$('#btn_delete').click(function(e){
			e.preventDefault();
			$('#div_confirmDialog1').modal('hide');
			deleteDynamicGraph($(event).parents('div.panel-heading').next().find('[id^=dashboardDynamicGraphId_]').attr('id').split('_')[1]);
		});
		break;
	case 'settings':
		graphSettings($(event).parent());
		break;
	case 'refresh':
		if($(event).parents('div.panel-heading').next().find('[id^=dashboardDynamicGraphId_]').length){
			graphRefresh($(event).parents('div.panel-heading').next().find('[id^=dashboardDynamicGraphId_]').attr('id').split('_')[1]);
		}
		else{
			graphRefresh($(event).parents('div.panel-heading').next().find('[id^=dashboard_]').attr('id'));
		}
		break;
	default:
		alert('This feature not implemented yet.');
		break;
	}
}


function getUIChartData(url, $elem, modelId, groupId, title,  onSuccess){
	disableObject("#"+$elem.attr("id"));
	var data = {
			modelId : modelId,
			groupId : groupId,
			type : "OPEN"
		};
	$('span.action_breadcrumb').addClass('hidden');
	$('span#actionDeviceModel').removeClass('hidden').addClass('active');
	$('span#actionDeviceModel a').attr('onclick', '');
	$.ajax({
		url : url,
		data : data,
		contentType : "application/json",
		dataType : 'json',
		success: function(response){
			if(response.httpStatusCode === 200){
				if( $.isEmptyObject(response.data.actuals) || response.data.length === 0){
					$elem.html('');
					return emptyGraph($elem);
				}
				var kpiData = response.data.kpis;
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
				var maxKpi = kpiData[Object.keys(kpiData)[0]];
				var minKpi = kpiData[Object.keys(kpiData)[0]];
				var plotLineObj = new Object();
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
					seriesObj['cursor'] = 'pointer';
					var pointObj = new Object();
					var eventObj = new Object();
					eventObj['click'] = function(event){
						callDeviceGraph($.extend(data,{buildName:event.currentTarget.category.split('<')[0]}), $elem, title, onSuccess);
						buildData.type=data.type;
						buildData.groupId=data.groupId;
						buildData.modelId=data.modelId;
						buildData.elem=$elem;
					};
					pointObj['events'] = eventObj;
					seriesObj['point'] = pointObj;
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
				for(var key in response.data.actuals){
					var tableRowObj = new Object();
					tableRowObj['title'] = key;
					tableRowObj['actuals'] = {};
					tableRowObj['deviation'] =  response.data.deviation[key];
					uiChartObject.categories.push(key+'<br/>Devices:'+response.data.deviceCount[key]);
					var deviation_sub_total = 0;
					var appCount = 0;
					for(var i=0; i < uiChartObject.series.length; i++){
						var objActual = response.data.actuals[key];
						var tVal = undefined;
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
//				drawUITable(uiChartObject.tableData, 'SW Release');
				if(typeof onSuccess == "function")
					onSuccess(uiChartObject, $elem, title);
			}
		}
	}).complete(function(){
		disableObject("#device_uiAnalytics",true);
	});
}


function getPloatlineLabel(obj){
	var text = "KPI";
	if(obj.color_keys.length > 1){
		$.each(obj.color_keys,function(ind,val){
			if(ind > 0)
				text = '&nbsp;<span style="background: '+val+';">&nbsp;</span>&nbsp;'+text;
		});
	}
	return '<span id="'+obj.id+'">'+text+'</span>';
}

var buildData ={}; // Placeholder/abstract
var minVal = 0;
var maxVal = null;
function drawUIChart(uiChartObject, $elem, title){
	disableObject("#"+$elem.attr("id"));
	var isUIAnalyticsGraph = (($elem.attr("id") == "highchart_uiAnalytics_open" || $elem
			.attr("id") == "dashboard_uiAnalytics") && title == "Time in seconds");
	if(isUIAnalyticsGraph) {
		minVal = null;
		maxVal = uiChartObject.deviationLine.minKpi + uiChartObject.deviationLine.kpiRange;
	}
	var calibrator = graphCalibrator;
	valMin = uiChartObject.min < 1?1:uiChartObject.min;
	calibrator.adjustGraph($elem,uiChartObject.max,uiChartObject.min, uiChartObject.categories.length);
	max_lbl_width = calibrator.max_lbl_width;
	 $elem.highcharts({
      chart: {
          renderTo: $elem.attr("id"),
          type: 'column'
      },
      title: {
          text: null
      },
      lang : {
     	noData : "No data to display"
      },
      xAxis: [{
          categories: uiChartObject.categories,
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
                  color: Highcharts.getOptions().colors[1],
                  fontSize: '10px'
              }
          },
          title: {
              text: title,
              style: {
                  color: Highcharts.getOptions().colors[1],
                  fontSize: '10px'
              }
          },
          plotLines : uiChartObject.plotLines,
          min:0,
          max:maxVal
      }],
  plotOptions:{
	  column:{
		  events:{
			  legendItemClick: function() {
				  togglePlotLines(this.name, this.chart.yAxis[0].plotLinesAndBands);
			  }
		  }
	  }
  },
      credits :{
      	enabled: false
      },
      exporting: {
      	enabled: false
      },
      tooltip: {
    	  shared: false,
          useHTML: true,
    	  formatter: function(){
    		  var text = "";
    		  if(this.series.type == "spline"){
    			  text = '<span style="color:'+this.series.color+';padding:0">'+this.series.name+': '+Highcharts.numberFormat((this.y-this.series.options.minKpi)/this.series.options.kpiRange * 100, 0)+'% </span>';
    		  }else{
    			  text = '<div style="font-size:10px"><span>Deviation: </span><span>'+Highcharts.numberFormat(this.series.options.kpis - this.y, 2)+'</span><div>'+
    			  '<div><span style="color:'+this.series.color+';padding:0">'+this.series.name+': </span>' +
                  '<span style="padding:0"><b>'+Highcharts.numberFormat(this.y, 2)+' sec</b></span></div>'+
                  '</div>';
    		  }
    		  return text;
    	  },
    	  positioner: function(boxWidth, boxHeight, point) {
              return {
                  x: point.plotX - (boxWidth / 3),
                  y: (maxVal < point.plotY ? point.plotY : maxVal)
              };
          }
      },
      series: uiChartObject.series,
      dataLabels: {
          enabled: false
      }
  });
  disableObject("#"+$elem.attr("id"),true);
}
function togglePlotLines(clickedLegendsName, plotLinesObj) {
	$.each(plotLinesObj, function(index,el){
        if(el.options.name === clickedLegendsName && el.svgElem != undefined) {
            el.svgElem[ el.visible ? 'show' : 'hide' ]();
            $('span #'+el.id).toggleClass('hide');
            el.visible = !el.visible;
        }
    });
}
function drawTertiaryGraphForStablity(categories,deviceStatusArr, $elem, title){
	var categoriesArray = [];
	var valueArray = [];
	var avgUpTimeArray = [];
	var MTBF = [];
	valMax = valMin = 1;
	var suffix = title.lastIndexOf("in min") > 0 ? " min" : " hrs";
	$.each(deviceStatusArr, function(index,value){
		if(typeof value.data[0] != "function" && value.data[0] != undefined){
			if(value.data[0].deviceCount != undefined){
				categoriesArray.push(value.data[0].key +'<br/>Devices: '+ value.data[0].deviceCount);
			}else{
				categoriesArray.push(value.data[0].key);
			}
			valueArray.push(value.data[0].value);
			if(typeof value.data[0].avgDeviceUptime != 'undefined'){
				avgUpTimeArray.push(value.data[0].avgDeviceUptime);
			}
			if(typeof value.data[0].mtbf != 'undefined'){
				MTBF.push(value.data[0].mtbf);
			}
		}
	});
	var calibrator = graphCalibrator;
	var t = graphCalibrator.setting.offset_x;
	graphCalibrator.setting.offset_x += 170;
	valMin = valMin < 1?1:valMin;
	calibrator.adjustGraph($elem,false,false,categoriesArray.length);
	graphCalibrator.setting.offset_x = t;
	$elem.highcharts({
		chart: {
			//height: 210,
			type: 'column'
		},
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
			categories: categoriesArray,
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
					color: Highcharts.getOptions().colors[1],
					fontSize: '10px'
				}
			},
			title: {
				text: 'MTBF (in hrs)',
				style: {
					color: Highcharts.getOptions().colors[1],
					fontSize: '10px'
				}
			},
			min:0,
			opposite: true
		}, { // Secondary yAxis
			title: {
				text: title,
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
		},{ // Tertiary yAxis
			title: {
				text: 'Total Device Uptime (in hrs)',
				style: {
					color: Highcharts.getOptions().colors[2],
					fontSize: '10px'
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[2],
					fontSize: '10px'
				}
			},
			min:0,
			opposite: true
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
	               cursor: 'pointer',
	               point: {
	                   events: {
	                       click: function (event) {
	                    	   var container = $(event.target).closest(".panel-body div.graph_container");
	                    	   if(container.attr("data-column_click_target")){
	                    		   //We can't send it through url, text gets scrambled. Save in in local session and send the index instead
//	                    		   var timeV =  Number(new Date());
//	                    		   sessionStorage['tmpVar_'+timeV] = this[container.attr("data-target_field")];
	                    		   window.location = container.attr("data-column_click_target");//+'tmpVar_'+timeV;
	                    	   }else  if(typeof buildData != 'undefined'){
		                    	   var buidName = event.currentTarget.category;
		                    	   if(buidName.indexOf('<') != -1){
		                    		   buidName = buidName.substr(0, buidName.indexOf('<'));
		                    		   callEvent(buidName, buildData.groupId, buildData.modelId,buildData.elem,'Device Uptime (in hrs)', ['Device Uptime'],buildData.onSuccess);
		                    	   }
	                    	   }
	                       }
	                   }
	               }
	           }
	       },
		series: [{
			name: categories,
			type: 'column',
			yAxis: 1,
			data: valueArray,
			tooltip: {
				valueSuffix: suffix
			}
		},{
			name: 'MTBF',
			type: 'spline',
			data: MTBF,
			tooltip: {
				valueSuffix: ' hrs'
			}
		},{
			name: 'Total Device Uptime',
			type: 'spline',
			yAxis: 2,
			data: avgUpTimeArray,
			tooltip: {
				valueSuffix: ' hrs'
			}
		}]
	});
	disableObject("#"+$elem.attr("id"),true);
}
function callDeviceGraph(data, $elem, title, onSuccess){ // Placeholder/abstract
}

/**
 * Graph calibrator object. It's highly advisable to create a local copy of this object and work with that.
 * */
var graphCalibrator = {};
graphCalibrator.setting = {
	"max_data_p":100, //Maximum data points on y axis
	"max_v_mult": 2, // Maximum scroll height allowed
	"height_data_p": 5, //Estimated min height for one data point
	"height_ratio": .5,
	"force_height_ratio" : 0,
	"offset_x": 120
};
graphCalibrator.adjustGraph = (function($elem, max, min, categories_length){
	var objSetting = this.setting; //`this` is highly contextual and should be used with care.
	if(objSetting.force_height_ratio){
		$elem.height($elem.width()*objSetting.force_height_ratio);
	}else if(objSetting.height_ratio){
		var min_height = (($elem.width() > window.innerHeight)?window.innerHeight:$elem.width())*objSetting.height_ratio;
		if($elem.height() < min_height)
			$elem.height(min_height);
	}
	if(max && min){
		var factor = max / objSetting.max_data_p;
		factor = (factor < 1 ) ? 1 : factor;
		var desiredHeight = (max / min) / factor;
		var height = $elem.height();
		var max_multiplier = objSetting.max_v_mult;
		if(desiredHeight > height){
			height = (height*max_multiplier < desiredHeight)?height*max_multiplier:desiredHeight;
			var parent = $elem.parent();
			parent.css("height",parent.height());
			$elem.parent().css("overflow-y","scroll");
			$elem.height(height);
			parent.scrollTop(parent[0].scrollHeight);
		}
	}
	if(categories_length){
		objSetting.max_lbl_width =  parseInt(($elem.width()-objSetting.offset_x -(categories_length*5)) / categories_length);
	}
	this.setting = objSetting;
	return objSetting;

});
graphCalibrator.formatLabel = (function(text){
	return '<div class="overflow-wrapper" title="' + text.replace('<br/>','\n') + '" style="max-width:'+this.setting.max_lbl_width+'px;">' + text + '</div>';
});
