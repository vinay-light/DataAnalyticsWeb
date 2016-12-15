<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Device Group</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src='<c:url value="/script/fluidpages/deviceGroup.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body id="body">
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<div id="contPaginatorTop">
		<div class="row" id="paginatorTop">
			<div class="col-xs-12 col-sm-4 pull-right">
				<ul class="idPaginator pagination pagination-sm pull-right">
				</ul>
			</div>
		</div>
	</div>
	<div id="deviceGroup" class="row">
			<div class="col-md-12">
				<div class="table-responsive">
					<table id="table_groupList" class="table table-hover">

						<thead>
							<tr class="cursor_default">
								<th width="1%"><input type="checkbox" class="checkAll" onclick="activateCheckAll('table_groupList');"></th>
								<th><fmt:message key="common.listH.device.group_name"/><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="groupName"></span></th>
								<th><fmt:message key="common.listH.device.no_of_devices"/></th>
								<th><fmt:message key="common.listH.status"/><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="status"></span></th>
							 </tr>
						</thead>
						<tbody>
					</tbody>
					</table>
				</div>
			</div>
		</div>
	<div id="contPaginatorBtm">
		<div class="row" id="paginatorBtm">
			<div class="col-xs-12 col-sm-4 pull-right">
				<ul class="idPaginator pagination pagination-sm pull-right">
				</ul>
			</div>
		</div>
	</div>
</body>
</html>