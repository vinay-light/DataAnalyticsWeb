<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Debug Logs</title>
<script type="text/javascript"
	src='<c:url value="/script/fluidpages/debugLogList.js"/>?change=<c:out value="${changeCount}"/>'></script>
<script type="text/javascript"
	src='<c:url value="/script/fluidpages/common/common_graph.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body>
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<div id="device_debugLogList">
		<div id="debugLogList" class="row">
			<div class="col-md-12">
				<div class="table-responsive">
					<table id="table_debugLogList" class="table table-hover">
						<thead>
							<tr class="cursor_default">
							<!-- 	<th width="1%"><input type="checkbox" class="checkAll"
									onclick="activateCheckAll('table_debugLogList');"></th> -->
								<th><fmt:message key="common.type" /></th>
								<th><fmt:message key="common.listH.device.serialno" /></th>
								<th><fmt:message key="common.listH.log_type" /></th>
								<th><fmt:message key="common.listH.log_time" /></th>
								<th><fmt:message key="common.listH.download" /></th>
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