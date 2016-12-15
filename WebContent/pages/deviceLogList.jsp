<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>View Logs</title>
<script type="text/javascript" src='<c:url value="/script/fluidpages/deviceLogList.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body>
	<div class="row" id="notification">
		<span class="col-xs-12 notification_error"></span>
	</div>
	<p>&nbsp;</p>
	<div id="deviceLog">
		<div class="row form-horizontal">
			<div class="col-xs-12">
				<div class="row form-group">
					<div id="device_softwareBuilds" class="dropdown col-xs-6">
						<div class="col-xs-5">
							<span class="margin_right_15px rActive required fontLarge">Select Software Build</span>
						</div>
						<div class="col-xs-6">
						
						<select id="swBuildIdList" multiple></select>
							<!-- <button
								class="btn btn-primary btn-sm modelDropDrown sw-build-dropdown-menu dropdown-toggle"
								type="button" id="dropdownMenu2" data-toggle="dropdown">
								<span class="pull-left" id="selectSwBuild">Select Software Build</span> <span class="caret pull-right"></span>
							</button>
							<ul class="dropdown-menu model-dropdown-menu sw-build-dropdown-menu" role="menu"
								aria-labelledby="dropdownMenu2">
							</ul> -->
						</div>
					</div>
					<div id="device_LogType" class="col-xs-6">
						<div class="col-xs-4">
							<span class="margin_right_15px rActive required levelLogType fontLarge">Select Log Type</span>
						</div>
						<div class="col-xs-6">
							<select id="select_logType" multiple></select>
						</div>
					</div>			
				</div>
				<div class="form-group row">
					<div class="col-xs-6">
						<div class="col-xs-5">
							<span class="control-label rActive required fontLarge"><fmt:message key="common.placeholder.from.date"/></span>
						</div>
						<div class="col-xs-6">
							 <input type="text" class="form-control" id="idFromDate">
						</div>
					</div>
					<div class="col-xs-6">
						<div class="col-xs-4">
							<span class="control-label rActive required fontLarge"><fmt:message key="common.placeholder.to.date"/></span>
						</div>
						<div class="col-xs-6">
							<input type="text" class="form-control" id="idToDate">
						</div>
					</div>
				</div>&nbsp;</p>
				<div class="form-group row">
					<div class="col-xs-10 col-xs-offset-1 text-center">
							<button type="button" class="btn btn-primary activityLogSubmitButton"
								id="idSubmitActivityLog"><fmt:message key="landing_page.frmLanding.submit"/></button>
					</div>
				</div>
			</div>
		</div>
		<div class="container" id="contPaginatorTop">
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
		<div class="row" >
		 	<div id="maindevice_LogList" class="table-responsive" style="display:none;">
				<table id="table_deviceLogList" class="table table-hover">
					<thead>
						<tr class="cursor_default">
							<th width="1%"><input type="checkbox" class="checkAll" onclick="activateCheckAll('table_deviceLogList');"></th>
							<th width="18%"><fmt:message key="common.type"/><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="type"></span></th>
							<th width="14%"><fmt:message key="common.listH.device.serialno"/><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="deviceSerialNo"></span></th>
							<th width="12%"><fmt:message key="log.package.name"/></th>
							<th width="14%"><fmt:message key="log.time"/><span class="glyphicon  sorter glyphicon-chevron-down pull-right " data_field="timeStamp"></span></th>
							<th width="14%"><fmt:message key="log.event.data"/></th>
							<th width="14%"><fmt:message key="common.listH.message"/></th>
							<th><fmt:message key="log.download.log"/></th>
						 </tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div> 
		</div>
	</div>
	<div id="div_eventData" class="modal fade">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header"><button class="close" aria-hidden="true" data-dismiss="modal" type="button">X</button><br/></div>
				<div class="modal-body"></div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
	
	<div class="container" id="contPaginatorBtm">
        <div class="row" id="paginatorBtm">
            <div class="col-xs-12 col-sm-4 pull-right">
                    <ul class="idPaginator pagination pagination-sm pull-right">
                    </ul>                
            </div>
        </div>
    </div>
</body>
</html>