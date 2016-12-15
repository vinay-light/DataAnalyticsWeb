<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>User Info</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src='<c:url value="/script/fluidpages/userInfo.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body id="body">
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<!-- user information-->
	<div id="user_userInfo" class="view-mode">
		<div class="row">
			<div class="col-xs-12 col-xs-offset-1">
				<h4 class="rActive" id="action_userInfo"><span class="glyphicon glyphicon-user"></span> User Information</h4>
			</div>
		</div>	
		<div class="row">&nbsp;</div>
		<div class="row">
			<div class="col-xs-12 col-md-2 col-md-offset-1">
				<img src="/images/user_icon.png" class="img-responsive">
			</div>
			<div class="col-xs-12 col-md-8">
			<form id="userUpdate" onsubmit="return false;" method="POST">
				<p id="info_user_userName" class="view-mode"></p>
				<p class="edit-mode">
					<input id="user_firstName" name="firstName" title="Only alphabetic characters are allowed" type="text" pattern="[a-zA-Z]+" required/>
				</p>
				<p class="edit-mode">
					<input id="user_lastName" name="lastName" title="Only alphabetic characters are allowed" type="text" pattern="[a-zA-Z]+" required/>
				</p>
				<p>
					<span id="info_email"></span>
				</p>
				<p id="user_deviceGroup"></p>
				<p id="user_status">
						<span class="lbl-status view-mode" id="info-status"> &nbsp; </span>
				</p>
				<p>
					<span class="pull-right">
						<input type="button" id="delete" value="Delete" class="btn edit-only view-mode btn-danger btn-sm" onclick="deviceInfo('delete');"  style="display:none;">
						<input type="button" id="deactivate" value="Deactivate" class="btn edit-only view-mode btn-danger btn-sm" onclick="deviceInfo('deactivate');" style="display:none;">
						<input type="button" id="activate" value="Activate" class="btn edit-only view-mode btn-danger btn-sm" onclick="deviceInfo('activate');" style="display:none;">
						<input type="button" id="edit" value="Edit" class="btn view-only edit-only view-mode btn-primary btn-sm"  onclick="editUser();"  style="display:none;">
						<input type="button" id="cancel" value="Cancel" class="btn edit-mode btn-info btn-sm" onclick="deviceInfo('cancel');"  style="display:none;">
						<input id="save" value="Save" type="submit" class="btn edit-mode btn-primary btn-sm" style="display:none;">
					</span>
				</p>
				</form>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 col-md-5 col-md-offset-1">
				<br>
				<p>Devices groups assigned to User</p>
				<hr>
				<div class="panel-body recordSelected panel-mx-height" id="id_group_selected">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
				</div>
			</div>
			<div class="col-xs-12 col-md-5 padding_right_0px">
				<br>
				<p>All Groups</p>
				<hr>
				<div class="panel-body recordAvailable panel-mx-height" id="id_group_available">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>