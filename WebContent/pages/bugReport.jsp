<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Bug Analytics</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description"
	content="<fmt:message key="project.description"/>">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src="//code.highcharts.com/highcharts.js"></script>
<script type="text/javascript"
	src="//code.highcharts.com/modules/exporting.js"></script>
<script type="text/javascript"
	src='<c:url value="/script/fluidpages/bugReport.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body>
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<div id="contPaginatorTop">
		<div class="row" id="notificationBoxContainer">
			<div class="col-xs-12" id="notificationBox"></div>
		</div>
		<div class="row" id="paginatorTop">
			<div class="col-xs-12 col-sm-4 pull-right">
				<ul class="idPaginator pagination pagination-sm pull-right">
				</ul>
			</div>
		</div>
	</div>
	<div id="device_bugAnalytics">
		<div id="device_BugReports" class="row">
			<div class="col-md-12">
				<div class="table-responsive">
					<table id="table_bugReportList" class="table table-hover">
						<thead>
							<tr class="cursor_default">
								<th width="1%"><input type="checkbox" class="checkAll"
									onclick="activateCheckAll('table_bugReportList');"></th>
								<th width="15%"><fmt:message key="common.listH.device.serialno" /> <span
									class="glyphicon  sorter glyphicon-chevron-down pull-right "
									data_field="deviceSerialNo"></span></th>
								<th width="15%"><fmt:message key="log.package.name" /></th>
								<th width="15%"><fmt:message key="common.listH.message" /><span
									class="glyphicon  sorter glyphicon-chevron-down pull-right "
									data_field="message"></span></th>
								<th width="10%"><fmt:message key="common.listH.status" /></th>
								<th width="15%"><fmt:message key="log.time" /><span
									class="glyphicon  sorter glyphicon-chevron-down pull-right "
									data_field="timeStamp"></span></th>
								<th width="14%"><fmt:message key="log.event.data" /></th>
								<th width="15%"><fmt:message key="log.download.log" /></th>
							</tr>
						</thead>
						<tbody>

						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</body>

</html>