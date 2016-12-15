<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Debug Logs</title>
<script type="text/javascript" src='<c:url value="/script/fluidpages/debugLog.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body>
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<div id="div_swBuildSelection" class="row">
		<div class="col-md-6  col-xs-12 text-right">
			<span class="margin_right_15px rActive fontLarge">Select Software Build</span>
		</div>
		<div class="dropdown col-md-3 col-xs-12" id="device_softwareBuilds">
			<button data-toggle="dropdown" id="dropdownMenu2" type="button" class="btn btn-primary btn-sm modelDropDrown sw-build-dropdown-menu dropdown-toggle">
				<span id="selectSwBuild" class="pull-left"> <span>Select Software Build</span> </span>  <span class="caret pull-right"></span>
			</button>
			<ul class="dropdown-menu model-dropdown-menu sw-build-dropdown-menu" role="menu" aria-labelledby="dropdownMenu2"></ul>
		</div>
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
	<div id="device_debugLogs">
		<div id="div_deviceList">
		<div id="deviceLogList" class="row">
			<div class="col-md-12">
				<div class="table-responsive">
					<table id="table_deviceLogList" class="table table-hover">
						<thead>
							<tr class="cursor_default">
								<!-- <th width="1%"><input type="checkbox" class="checkAll" onclick="activateCheckAll('table_deviceLogList');"></th> -->
								<th><fmt:message key="common.type" /></th>
								<th><fmt:message key="common.listH.device.serialno" /><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="deviceSerialNo"></span></th>
								<th><fmt:message key="common.listH.last_sync" /><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="updatedTs"></span></th>
								<th><fmt:message key="common.listH.register_time" /><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="createdTs"></span></th>
								<th><fmt:message key="common.listH.status" /><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="status"></span></th>
								<th><fmt:message key="common.listH.log_count" /></th>
							</tr>
						</thead>
						<tbody>

						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<div id="device_debugLogList" class="row hidden">
		<div id="debugLogList" class="row">
			<div class="col-md-12">
				<div class="table-responsive">
					<table id="table_debugLogList" class="table table-hover">
						<thead>
							<tr>
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