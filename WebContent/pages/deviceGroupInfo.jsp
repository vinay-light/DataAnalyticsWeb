<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Device Group Info</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src='<c:url value="/script/fluidpages/deviceGroupInfo.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body id="body">
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<!-- Device Information-->
	<div id="deviceGroup_Info" class="view-mode">
	<div class="row">
			<div class="col-xs-12 col-xs-offset-1">
				<h4 class="rActive hidden" id="action_addUser"><span class="glyphicon device_icon">&nbsp;</span> Add Device Group</h4>
			</div>
			<div class="col-xs-12 col-xs-offset-1">
				<h4 class="rActive hidden" id="action_viewEditUser"><span class="glyphicon device_icon">&nbsp;</span>Device Group Information</h4>
			</div>
		</div>
		
		<div class="row">
			<div class="col-xs-12 col-md-2 col-md-offset-1">
				<img src="/images/device_info.png" class="img-responsive">
			</div>
			<div class="col-xs-12 col-md-8">
				<form id="groupUpdate" onsubmit="return false;" method="POST">
					<p class="view-mode" id="groupName"></p>
					<p class="view-mode" id="deviceCount"></p>
					<p class="edit-mode"><label class="margin_right_10px label1 required">Name</label>
					<input type="text" id="txt_groupName" name="groupName" pattern="(?=.{0,30}$)[a-zA-Z]+" oninvalid="invalidMsg(this);" oninput="invalidMsg(this);" maxlength="31" required/></p>
					<p class="edit-mode" id="txt_deviceCount">&nbsp;</p>				    
					<p id="group_status">
						<span class="lbl-status view-mode" id="info-status"> &nbsp; </span>
					</p>	
					
					<div class="col-sm-offset-8 col-sm-4">

						<span class="pull-right">
							<input type="button" id="delete" value="Delete" class="btn btn-danger btn-sm edit-only view-mode" onclick="deviceInfo('delete');" style="display:none;">
							<input type="button" id="deactivate" value="Deactivate" class="btn btn-danger btn-sm edit-only view-mode" onclick="deviceInfo('deactivate');" style="display:none;">
							<input type="button" id="edit" value="Edit" class="btn btn-primary btn-sm edit-only view-mode" onclick="switchMode('edit','#deviceGroup_Info');" style="display:none;">
							<input type="button" id="cancel" value="Cancel" class="btn btn-info btn-sm edit-only edit-mode" onclick="deviceInfo('cancel');" style="display:none;">
							<input id="save" value="Save" type="submit" class="btn edit-mode btn-primary btn-sm" style="display:none;">
						</span>

					</div>
				</form>
			</div>
		</div>
		<div class="row margin_bottom_15px">
			<div class="col-xs-12 col-md-5 col-md-offset-1">
				<br>
				<p>Member Devices</p>
				<hr>
				<div class="panel-body recordSelected panel-mx-height" id="id_device_selected">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
				</div>
			</div>
			<div class="col-xs-12 col-md-5 padding_right_0px">
				<br>
				<p>Devices Not In Group</p>
				<hr>
				<div class="panel-body recordAvailable panel-mx-height" id="id_device_available">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
