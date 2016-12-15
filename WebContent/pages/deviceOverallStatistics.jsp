<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Device Overall Statics</title>
	<script type="text/javascript" src="//code.highcharts.com/highcharts.js"></script>
	<script type="text/javascript" src="//code.highcharts.com/modules/exporting.js"></script>
	<script type="text/javascript" src="//code.highcharts.com/modules/drilldown.js"></script>
	<script type="text/javascript" src='<c:url value="/script/fluidpages/common/common_graph.js"/>?change=<c:out value="${changeCount}"/>'></script>	
	<script type="text/javascript" src='<c:url value="/script/fluidpages/deviceOverallStatistics.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body>
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<div id="device_batteryAnalytics">
		<div class="row ">
			<div class="col-xs-12 div-overlay graphTableHeight">
				<!-- <img class="img-overlay-right" src="/images/common/sample_resource.png"/> -->
				<table id="table_deviceModel" class="table">
					<thead>
						<tr>
							<th id="th_col1">Device Serial Number</th>
							<th id="th_col2">Uptime Stability Hours</th>
							<th id="th_col3">Battery life</th>
							<th id="th_col4">UI performance</th>
							<th id="th_col5">Crash Count</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>
			<!-- <div class="row">
				<div class="col-xs-10 col-md-offset-1" id="batteryAnalyticsBreadcrumb">
				</div>
			</div> -->	
			<div class="row">
					<div class="col-xs-12 col-md-offset-0">
						<div class="panel panel-default">
							<div class="panel-heading">
								<h3 class="panel-title">
									<span>Device Overall Statistics</span>
								</h3>
							</div>
							<div class="panel-body">
								<div class="row">
									<div class="col-xs-12 text-center">
										<div id="highchart_device_overall_statistics"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
	</div>
</body>
</html>