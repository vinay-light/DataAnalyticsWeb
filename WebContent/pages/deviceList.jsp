<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Device</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src='<c:url value="/script/fluidpages/deviceList.js"/>?change=<c:out value="${changeCount}"/>'></script>
<script type="text/javascript" src="//ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&s=1"></script>
</head>
<body id="body">
	<div class="row">
		<div class="col-xs-12 col-md-11 map-container">
		<div class="col-xs-11 rowSpace_2 hideElementCls" id="deviceLocationsMapContainer">
		</div>
		</div>
	</div>
	
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
	<div id="deviceList" class="row">
		<div class="col-md-12">
			<div class="table-responsive">
				<table id="table_deviceList" class="table table-hover">
					<thead>
						<tr class="cursor_default">
							<th width="1%"><input type="checkbox" class="checkAll" onclick="activateCheckAll('table_deviceList');"></th>
							<th><fmt:message key="common.type"/></th>
							<th><fmt:message key="common.listH.device.serialno"/><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="deviceSerialNo"></span></th>
							<th><fmt:message key="common.listH.device.model"/><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="deviceModel"></span></th>
							<th><fmt:message key="common.page_title.device.group"/></th>
							<th><fmt:message key="common.listH.last_sync" /><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="updatedTs"></span></th>
							<th><fmt:message key="common.listH.register_time" /><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="createdTs"></span></th>
							<th><fmt:message key="common.listH.status"/></th>
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