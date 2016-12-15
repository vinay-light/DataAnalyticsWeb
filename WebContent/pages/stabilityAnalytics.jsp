<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Stability Analytics</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src="//code.highcharts.com/highcharts.js"></script>
<script type="text/javascript" src="//code.highcharts.com/modules/exporting.js"></script>
<script type="text/javascript" src='<c:url value="/script/fluidpages/common/common_graph.js"/>?change=<c:out value="${changeCount}"/>'></script>
<script type="text/javascript" src='<c:url value="/script/fluidpages/stabilityAnalytics.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body>
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<div id="device_stabilityAnalytics">
	<div class="row ">
			<div class="col-xs-12 col-xs-offset-0 div-overlay graphTableHeight">
				<!-- <img class="img-overlay-right" src="/images/common/sample_resource.png"/> -->
				<table id="table_stabilityAnalytics" class="table">
					<thead>
						<tr>
							<th id="th_col1"></th>
							<th id="th_col2"></th>
							<th id="th_col3"></th>
							<th id="th_col4"></th>
							<th id="th_col5"></th>
							<th id="th_col6"></th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
		</div>
		<div id="crashModelAnalytics" class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3 class="panel-title">
							<span>Crash Analytics</span>
							<span class="pull-right"><a  id="crashModal" href="javascript:" onclick="hideShowCrashModal(this);">Show/Hide Crash Analytics</a></span>
						</h3>
					</div>
					<div class="panel-body hide">
						<div class="row">
							<div class="col-xs-12 text-center">
								<div id="highchart_crashModel_analytics"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="stabilityAnalytics" class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3 class="panel-title">
							<span>Stability Statistics</span>
						</h3>
					</div>
					<div class="panel-body">
						<div class="row">
							<div class="col-xs-12 text-center">
								<div id="highchart_stability-statistics"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
			
		</div>
</body>
      
</html>