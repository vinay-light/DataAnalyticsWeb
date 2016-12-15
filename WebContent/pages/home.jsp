<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Home</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src="//code.highcharts.com/highcharts.js"></script>
<script type="text/javascript" src="//code.highcharts.com/modules/exporting.js"></script>
<script type="text/javascript" src='<c:url value="/script/fluidpages/common/common_graph.js"/>?change=<c:out value="${changeCount}"/>'></script>
<script type="text/javascript" src='<c:url value="/script/fluidpages/home.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body>
<div class="row" id="notification">
	<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
</div>
<div id="device_deviceModel">
	<div class="row">
		<div class="col-sm-12 graphTableHeight">
			<table id="table_deviceModel" class="table">
					<thead>
						<tr>
							<th>SW&nbsp;Release</th>
							<th class="titled-tooltip" title="This means that the device was up for X hours">Total&nbsp;Device&nbsp;Uptime</th>
							<th class="titled-tooltip"  title="This means sw release has given device MTBF">MTBF</th>
							<th class="titled-tooltip"  title="This means sw release has given device total Screen On Time">Avg.&nbsp;Screen&nbsp;On&nbsp;Time</th>
							<th class="titled-tooltip"  title="This means device supports up to X hours of battery time, without charging">Avg.&nbsp;Battery&nbsp;Life</th>
							<th class="titled-tooltip"  title="This means device meets given % of KPI test cases">Avg.&nbsp;UI Performance</th>
							<th class="titled-tooltip"  title="This means sw release has given device count">Total&nbsp;Device&nbsp;Count</th>
						 </tr>
					</thead>
					<tbody>
						
					</tbody>
				</table>					
			</div>
		</div>
</div>
	<p>&nbsp;</p>
<div class="row">
	<div class="col-xs-12 col-md-6">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">
					<span>Stability Statistics</span>
					<span class="pull-right "><img id="idUserProfilePhoto" onclick="refreshGraph('refresh', this);" title="Refresh" class="img-responsive cursor_pointer" src="<c:out value="${imagesCdnPath}"/>/refresh.png"></span>
				</h3>
			</div>
			<div class="panel-body">
				<div class="row">
					<div class="col-xs-12 text-center">
						<div id="dashboard_stability-statistics" class="graph_container" data-column_click_target = "/pages/stabilityAnalytics.jsp"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-xs-12 col-md-6">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">
					<span>Battery Statistics</span>
					<span class="pull-right "><img id="idUserProfilePhoto" onclick="refreshGraph('refresh', this);" title="Refresh" class="img-responsive cursor_pointer" src="<c:out value="${imagesCdnPath}"/>/refresh.png"></span>
				</h3>
			</div>
			<div class="panel-body">
				<div class="row">
					<div class="col-xs-12 text-center">
						<div id="dashboard_battery-statistics" class="graph_container" data-target_field="category" data-column_click_target = "/pages/batteryAnalytics.jsp"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-xs-12">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">
					<span>UI Performance Statistics</span>
					<span class="pull-right"><img id="idUserProfilePhoto" onclick="refreshGraph('refresh', this);" title="Refresh" class="img-responsive cursor_pointer" src="<c:out value="${imagesCdnPath}"/>/refresh.png"></span>
				</h3>
			</div>
			<div class="panel-body">
				<div class="row">
					<div class="col-xs-12 text-center">
						<div id="dashboard_uiAnalytics" class="graph_container"  data-column_click_target = "/pages/uiAnalytics.jsp"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>
