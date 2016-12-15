<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Add User</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src='<c:url value="/script/fluidpages/addUser.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body id="body">
	<div class="row" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<!-- Add user-->
	<div id="user_addUser">
		<div class="row">
			<div class="col-xs-12 col-xs-offset-1">
				<h4 class="rActive" id="action_addUser"><span class="glyphicon glyphicon-user"></span> Add User</h4>
			</div>
		</div>
		<div class="row">&nbsp;</div>
		<div class="row">
			<div class="col-xs-12 col-md-2 col-md-offset-1">
				<img src="/images/user_icon.png" class="img-responsive">
			</div>
			<div class="col-xs-12 col-md-8">
				<form class="ng-pristine ng-valid" id="form_addUser" method="post" onsubmit="return false;">
				<div class="col-sm-5">
					<p>
						<label class="margin_right_10px label1 required">First Name</label>
						<input id="userFirstName" type="text" pattern="(?=.{0,30}$)[a-zA-Z]+" oninvalid="invalidMsg(this);" oninput="invalidMsg(this);" maxlength="31" tabindex="1" class="form-control" placeholder="First Name" autocomplete="on"
							autofocus='on' required>
					</p>
					<p>
						<label class="margin_right_10px label1 required">Last Name</label>
						<input id="userLastName" type="text" pattern="(?=.{0,30}$)[a-zA-Z]+" maxlength="31" oninvalid="invalidMsg(this);" oninput="invalidMsg(this);" tabindex="2" class="form-control" placeholder="Last Name" autocomplete="on" required>
					</p>
					<p>
						<label class="margin_right_10px label1 required">Email ID</label>
						<input id="userEmail" type="email" placeholder="Email ID"
							tabindex="3" class="form-control" autocomplete="on" maxlength="61" oninvalid="invalidMsg(this);" oninput="invalidMsg(this);"
							pattern="(?=.{0,60}$)([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)"
							required>
					</p>
					</div>
					<div class="col-sm-offset-8 col-sm-4">
					<p id="user_status">
						<!-- <span id="edit_active" class="label label-success"> Active </span> -->
					</p>
					<p>
						<span class="pull-right"><input type="button" id="cancel"
							value="Cancel" class="btn btn-info btn-sm"
							onclick="deviceInfo('cancel');" style="display: none;"> <input type="submit"
							id="save" value="Save" class="btn btn-primary btn-sm" style="display: none;">
						</span>
					</p>
					</div>
				</form>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
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