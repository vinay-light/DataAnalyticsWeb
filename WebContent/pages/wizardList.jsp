<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Wizard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src='<c:url value="/script/fluidpages/wizardList.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body id="body">
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<div id="recentList">
		<div class="row">
			<div class="col-xs-12 col-sm-6 col-md-3">
				<div class="box-quick-link">
					<div class="row">
						<div class="col-xs-12">
							<a href="./stabilityAnalytics.jsp" class="thumbImg"> <img
								class="img-responsive color_light_red"
								src="/images/stability_analytics.png">
							</a>
							<div class="text-center rActive ">
								<a href="./stabilityAnalytics.jsp">Stability Analytics</a>
							</div>
							<hr>
							<div class="col-xs-12">
								<p>Stability is defined as the number of hours a device is expected to run without crashing. This wizard displays the stability statistics for selected model</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-6 col-md-3">
				<div class="box-quick-link">
					<div class="row">
						<div class="col-xs-12">
							<a href="./batteryAnalytics.jsp" class="thumbImg"> <img
								class="img-responsive  color_light_purpule"
								src="/images/battery_analytics.png">
							</a>
							<div class="text-center rActive ">
								<a href="./batteryAnalytics.jsp">Battery Analytics</a>
							</div>
							<hr>
							<div class="col-xs-12">
								<p>This wizard displays statistics for various battery performance criteria such as battery life, and battery consumption</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-6 col-md-3">
				<div class="box-quick-link">
					<div class="row">
						<div class="col-xs-12">
							<a href="./uiAnalytics.jsp" class="thumbImg"> <img
								class="img-responsive  color_light_green"
								src="/images/ui_analytics.png">
							</a>
							<div class="text-center rActive ">
								<a href="./uiAnalytics.jsp">UI Analytics</a>
							</div>
							<hr>
							<div class="col-xs-12">
								<p>The UI Performance wizard displays the statistics for UI responsiveness. The UI responsiveness is measured by the time taken to launch / close predefined set of applications</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-6 col-md-3">
				<div class="box-quick-link">
					<div class="row">
						<div class="col-xs-12">
							<a href="./bugReport.jsp" class="thumbImg"> <img
								class="img-responsive  color_light_blue"
								src="/images/bug_report.png">
							</a>
							<div class="text-center rActive ">
								<a href="./bugReport.jsp">Bug Report</a>
							</div>
							<hr>
							<div class="col-xs-12">
								<p>This wizard manages the list of bugs and issues reported by devices</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 col-sm-6 col-md-3">
				<div class="box-quick-link">
					<div class="row">
						<div class="col-xs-12">
							<a href="./debugLog.jsp" class="thumbImg"> <img
								class="img-responsive  color_light_yellow"
								src="/images/debug_logs.png">
							</a>
							<div class="text-center rActive">
								<a href="./debugLog.jsp">Debug Logs</a>
							</div>
							<hr>
							<div class="col-xs-12">
								<p>This wizard displays the logs posted by device. The device posts different type of logs to the server which include debug logs, kernel logs and crash logs</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-6 col-md-3">
				<div class="box-quick-link">
					<div class="row">
						<div class="col-xs-12">
							<a href="./deviceLogList.jsp" class="thumbImg"> <img
								class="img-responsive  color_light_orange"
								src="/images/activity_icon.png">
							</a>
							<div class="text-center rActive"><a href="./deviceLogList.jsp">Device Activity Logs</a></div>
							<hr>
							<div class="col-xs-12">
								<p>This wizard helps manage the various events posted by the device</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-md-3 hidden">
				<div class="box-quick-link">
					<div class="row">
						<div class="col-xs-12">
							<a href="./crashModelAnalytics.jsp" class="thumbImg">
								<img class="img-responsive  color_light_orange" src="/images/activity_icon.png">
							</a>
							<div class="text-center rActive"><a href="./crashModelAnalytics.jsp">Crash Model Analytics</a></div>
							<hr>
							<div class="col-xs-12">
								<p>The Crash Model wizard displays the build wise crashes for selected model.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<p>&nbsp;</p>
</body>
</html>