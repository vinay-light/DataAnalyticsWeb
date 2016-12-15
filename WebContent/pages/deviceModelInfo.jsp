<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Device Model Info</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src='<c:url value="/script/fluidpages/deviceModelInfo.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body id="body">
	<div class="row rowSpace_2" id="notification">
		<span class="col-xs-12 col-xs-offset-1 notification_error">&nbsp;</span>
	</div>
	<!-- Device Information-->
	<div id="deviceModelInfo" class="view-mode rowSpace_2">
		<div class="row">
			<div class="col-xs-12 col-xs-offset-1">
				<h4 class="rActive hidden" id="action_addModel"><span class="glyphicon glyphicon-phone"></span> Add Device Model</h4>
			</div>
			<div class="col-xs-12 col-xs-offset-1">
				<h4 class="rActive hidden" id="action_viewEditModel"><span class="glyphicon glyphicon-phone"></span> Device Model Information</h4>
			</div>
		</div>
		<div class="row">&nbsp;</div>
		<form class="row">
			<div class="col-xs-12 col-md-2 col-md-offset-1">
				<img src="/images/device_info.png" class="img-responsive">
			</div>
			<div class="col-xs-12 col-md-9">
				<div class="col-xs-12" id="div_modelDetailsInfo">
					<p><Span id="span_deviceModel">&nbsp;</Span></p>
					<p><Span id="span_buildVersion">&nbsp;</Span></p>
					<span class="lbl-status view-mode" id="info-status"> &nbsp; </span>
					<!-- <p><span id="span_status" class="label label-success">Active</span></p> -->
				</div>
				<div class="col-xs-5 hideElementCls" id="div_addModelDetails">
					<label class="margin_right_10px label1 required">Model Name</label>
					<input id="input_modelName" type="text" tabindex="1" maxlength="61"
						class="form-control" placeholder="Model Name" autocomplete="on" pattern=".{0,60}"
						oninvalid="invalidMsg(this);" oninput="invalidMsg(this);"
						required autofocus='on'>
					<br>
				</div>
				<div class="col-xs-12 col-sm-12">
					<br>
					<span class="pull-right">
						<input type="button" id="delete" value="Delete" class="btn btn-danger btn-la edit-only view-mode" onclick="confirmDeleteModel();"  style="display: none;">
						<input type="button" id="deactivate" value="Deactivate" class="btn btn-danger btn-la edit-only view-mode" onclick="deactivateModel();"  style="display: none;">
						<input type="button" id="activate" value="Activate" class="btn btn-success btn-la edit-only view-mode" onclick="activateInfo();"  style="display: none;">
						<input type="button" id="edit" value="Edit" class="btn btn-primary btn-la edit-only view-mode" onclick="switchMode('edit','#deviceModelInfo');"  style="display: none;">
						<input type="button" id="cancel" value="Cancel" class="btn btn-info btn-la edit-only edit-mode" onclick="switchMode('view','#deviceModelInfo');"  style="display: none;">
						<input type="button" id="save" value="Save" class="btn btn-primary btn-la edit-only edit-mode" onclick="deviceInfo('save');"  style="display: none;">
						<input type="submit" style="display: none;">						
					</span>
				</div>
			</div>
			<div class="col-xs-12 col-sm-12">&nbsp;</div>
		</form>
		<div class="row" id="div_swBuildsForModel">
			<div class="col-xs-12 col-md-5 col-md-offset-1">
				<p>Software builds for model</p>
				<hr>
				<div id="div_addSoftwareBuild" class="row margin_bottom_15px">
					<span class="pull-left edit-mode col-xs-8">
						<input name="new_build" id="new_buildName" class=" form-control pull-left" pattern="(?=.{0,60}$)" placeholder="Software builds for model"  maxlength="61"/>
						<button id="btnAddBuild" class="btn btn-info pull-left" onclick="addSoftwareBuild();">Add</button>
					</span>
				</div>
				<div class="panel-body recordSelected panel-mx-height margin_bottom_15px" id="id_build_selected">
					<ul class="list-group ulAccordian"></ul>
					<div class="row divNavIndex" style="display: none;"></div>
				</div>
			</div>
			<div class="col-xs-12 col-md-5 padding_right_0px hidden">
				<p>All Builds</p>
				<hr>
				<div class="panel-body recordAvailable panel-mx-height margin_bottom_15px" id="id_build_available">
					<ul class="list-group ulAccordian"></ul>
					<div class="row divNavIndex" style="display: none;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
