<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>UI Analytics</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src="//code.highcharts.com/highcharts.js"></script>
<script type="text/javascript"
	src="//code.highcharts.com/modules/exporting.js"></script>
<script type="text/javascript"
	src='<c:url value="/script/fluidpages/common/common_graph.js"/>?change=<c:out value="${changeCount}"/>'></script>
<script type="text/javascript"
	src='<c:url value="/script/fluidpages/uiAnalytics.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body>
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<div id="device_uiAnalytics">
		<div class="row">
			<div class="col-sm-offset-0 col-sm-12 graphTableHeight">
				<table id="table_deviceModel" class="table">
					<thead>
						<tr>
							<th class="tableTitleTypeClass">SW&nbsp;Release</th>
							<th class="titled-tooltip" >Actuals</th>
							<th class="titled-tooltip" >UI&nbsp;Performance</th>
						</tr>
					</thead>
					<tbody>

					</tbody>
				</table>
			</div>
			<p>&nbsp;</p>
		</div>
	</div>
	<div class="row">
			<div class="col-xs-12 col-md-offset-0">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3 class="panel-title">
							<span>UI&nbsp;Performance&nbsp;Statistics</span>
						</h3>
					</div>
					<div class="panel-body">
						<div class="row">
							<div class="col-xs-12 text-center">
								<div id="highchart_uiAnalytics_open"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>