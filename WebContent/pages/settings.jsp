<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Settings</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<!-- <script type="text/javascript" src='<c:url value="/script/fluidpages/common/common_graph.js"/>?change=<c:out value="${changeCount}"/>'></script> -->
<script type="text/javascript" src='<c:url value="/script/fluidpages/settings.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body id="body">
	<div class="row" id="notificationBoxContainer">
		<div class="col-xs-12" id="notificationBox"></div>
	</div>
	<div id="settings_configration">
	<div id="primaryAxis">
	<div class="row">
		<div class="col-xs-12">
			<h5 class="rActive">Primary Event</h5>
			<hr />
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12 col-md-5 col-md-offset-1">
			<br>
			<p class="h6">Selected Events</p>
			<hr>
			<div class="panel-body recordSelected panel-mx-height" id="id_primaryEvent_selected">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
			</div>
		</div>
		<div class="col-xs-12 col-md-5 padding_right_0px">
			<br>
			<p class="h6">Available Events</p>
			<hr>
			<div class="panel-body recordAvailable panel-mx-height" id="id_primaryEvent_available">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
			<h5 class="rActive">Primary Package</h5>
			<hr />
		</div>
	</div>
	<div class="row rowSpace_2">
		<div class="col-xs-12 selectPrimaryEvent">
			<div class="row">
				<div class="dropdown col-md-offset-4 col-md-3 col-xs-12 text-center">
					<button data-toggle="dropdown" id="dropdownMenu3" type="button" class="btn btn-primary btn-sm modelDropDrown dropdown-toggle">
						<span id="select-primaryAxisEvent" class="pull-left">Select Event</span>
						<span class="caret pull-right"></span>
					</button>
					<ul aria-labelledby="dropdownMenu3" role="menu" class="dropdown-menu model-dropdown-menu">
						<li role="presentation"><a tabindex="-1" href="javascript:void(0)" package-name="">No Event</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12 col-md-5 col-md-offset-1">
			<br>
			<p class="h6">Selected Package</p>
			<hr>
			<div class="panel-body recordSelected panel-mx-height" id="id_primaryPackage_selected">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
			</div>
		</div>
		<div class="col-xs-12 col-md-5 padding_right_0px">
			<br>
			<p class="h6">Available Package</p>
			<hr>
			<div class="panel-body recordAvailable panel-mx-height" id="id_primaryPackage_available">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
			</div>
		</div>
	</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
			<h5><span class="rActive">Secondary Index</span></h5>
			<hr />
		</div>
	</div>
	<div id="secondaryAxis">
	<div class="row">
		<div class="col-xs-12 col-md-5 col-md-offset-1">
			<br>
			<p class="h6">Selected Index</p>
			<hr>
			<div class="panel-body recordSelected panel-mx-height" id="id_secondaryEvent_selected">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
			</div>
		</div>
		<div class="col-xs-12 col-md-5 padding_right_0px">
			<br>
			<p class="h6">Available Index</p>
			<hr>
			<div class="panel-body recordAvailable panel-mx-height" id="id_secondaryEvent_available">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
			<h5 class="rActive">Secondary Package</h5>
			<hr />
		</div>
	</div>
	<div class="row rowSpace_2">
		<div class="col-xs-12 selectSecondaryEvent">
			<div class="row">
				<div class="dropdown col-md-offset-4 col-md-3 col-xs-12">
					<button data-toggle="dropdown" id="dropdownMenu3" type="button" class="btn btn-primary btn-sm modelDropDrown dropdown-toggle">
						<span id="select-secondaryAxisEvent" class="pull-left">Select Event</span>
						<span class="caret pull-right"></span>
					</button>
					<ul aria-labelledby="dropdownMenu3" role="menu" class="dropdown-menu model-dropdown-menu">
						<li role="presentation"><a tabindex="-1" href="javascript:void(0)" package-name="">No Event</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12 col-md-5 col-md-offset-1">
			<br>
			<p class="h6">Selected Package</p>
			<hr>
			<div class="panel-body recordSelected panel-mx-height" id="id_secondaryPackage_selected">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
			</div>
		</div>
		<div class="col-xs-12 col-md-5 padding_right_0px">
			<br>
			<p class="h6">Available Package</p>
			<hr>
			<div class="panel-body recordAvailable panel-mx-height" id="id_secondaryPackage_available">
				<ul class="list-group ulAccordian ulStyle"></ul>
				<div class="row divNavIndex" style="display: none;"></div>
			</div>
		</div>
	</div>
	</div>
	<div class="row"><p>&nbsp;</p></div>
	<div class="row">
		<div class="col-xs-12 text-center">
			<input id="submitEventPkg" class="btn btn-primary" type="submit" value="Submit">
		</div>
	</div>
	</div>
</body>
</html>