<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Device Information</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src='<c:url value="/script/fluidpages/deviceInfo.js"/>?change=<c:out value="${changeCount}"/>'></script>
<script type="text/javascript" src="//ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&s=1"></script>
<script type="text/javascript" src='<c:url value="/script/fluidpages/_device_details.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body id="body">
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<!-- Device Information-->
	<div id="div_device_Info" class="view-mode rowSpace_2">
		<div class="row">
				<div class="col-xs-11 col-xs-offset-1">
					<h4 class="rActive pull-left" id="action_addUser"><span class="glyphicon glyphicon-phone"></span> Device Information</h4>
					<div id="action_deviceInfo" class="pull-right"></div>
				</div>
		</div>
		<div class="row" >
			<div class="col-xs-12 col-md-10 col-md-offset-1 map-container">
				<div class="" id="mapOverlay">
						<div class="col-sm-6 col-xs-10" id="overlayContent">
							<div class="col-xs-12 col-sm-3">
								<img src="/images/device_info.png" class="img-responsive">
							</div>
							<div class="col-sm-9">
								<p><b><Span id="span_deviceSerialNo">&nbsp;</Span></b></p>
								<p><Span id="span_deviceModel">&nbsp;</Span></p>
								<p><Span id="span_buildVersion">&nbsp;</Span></p>
								<p><Span id="span_lastSeen">&nbsp;</Span></p>
								<p><span id="span_status" class="btn btn-success btn-sm">Active</span></p>
							</div>
						</div>
						<!-- <div class="col-xs-2 col-sm-1 col-sm-offset-5">
							<span class="pull-right"><a id="lnk_expandMap" href="javascript:expandMap();">Expand</a></span>
						</div> -->
					</div>
					<div class="col-xs-6" id="detailMapContainer">
					</div>
					<a id="toggle_map_size" href="javascript:" ></a>
				<div class="col-sm-3 col-sm-offset-9 " >
						<span class="pull-right padding_right_0px btn-group-right">
							<input type="button" id="delete" value="Delete" style="display:none;" class="btn btn-danger btn-sm edit-only view-mode">
							<input type="button" id="deactivate" value="Deactivate" style="display:none;" class="btn btn-danger btn-sm edit-only view-mode hidden" >
							<input type="button" id="activate" value="Activate" style="display:none;" class="btn btn-success btn-sm edit-only view-mode hidden" >								
							<input type="hidden" name="status" id="device_status" value="">
						</span>
				</div> 
			</div>
		</div>
		
		<div class="row view-only hidden" id="div_deviceGroups">
			<div class="col-xs-10 col-xs-offset-1"><hr></div>
			<div class="col-xs-12 col-md-5 col-md-offset-1">
				<br>
				<p>Device Assigned to Group</p>
				<hr>
				<div class="panel-body recordSelected panel-mx-height" id="id_group_selected">
					<ul class="list-group ulAccordian"></ul>
					<div class="row divNavIndex" style="display: none;"></div>
				</div>
			</div>
			<div class="col-xs-12 col-md-5 padding_right_0px">
				<br>
				<p>All Groups</p>
				<hr>
				<div class="panel-body recordAvailable panel-mx-height" id="id_group_available">
					<ul class="list-group ulAccordian"></ul>
					<div class="row divNavIndex" style="display: none;"></div>
				</div>
			</div>
		</div>
		<!--  Second Panel -->
		<div id="div_moreDeviceInfo" class="row view-mode" style="display: block;">
			<div class="col-xs-10 col-xs-offset-1"><hr></div>
			<div class="row">
				<div id="div_moreInfo" class="col-sm-10 col-sm-offset-1  spaced">
					<div class="row div-spaced">					
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>