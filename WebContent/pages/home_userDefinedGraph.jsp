<%@include file="/pages/common/taglib.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>Home</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script type="text/javascript" src="//code.highcharts.com/highcharts.js"></script>
<script type="text/javascript" src="//code.highcharts.com/modules/exporting.js"></script>
<script type="text/javascript" src='<c:url value="/script/fluidpages/common/common_graph.js"/>?change=<c:out value="${changeCount}"/>'></script>
<script type="text/javascript" src='<c:url value="/script/fluidpages/home_userDefinedGraph.js"/>?change=<c:out value="${changeCount}"/>'></script>
</head>
<body>
	<div id="device_userDefinedAnalytics">
		<div class="row" id="notificationBoxContainer">
            <div class="col-xs-12" id="notificationBoxForGraph"></div>
        </div>
		<div class="row" id="addGraph">
		</div>
	</div>
	<div class="modal fade" id="dynamicGraph" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h4>
						<img class="margin_right_15px" src="/images/add_new_graph_icon.png"> Add New Graph
					</h4>
				</div>
				<div class="modal-body" id="userDefined_DynamicGraph">
					<div id="notification" class="row">
						<div class="col-md-6">
							<div class="row">
								<div class="col-md-12 col-md-offset-1 notification_error">&nbsp;</div>
							</div>
						</div>
						<div class="col-md-6"></div>
					</div>
					<p></p>
					<form id="blanckGraph" class="ng-pristine ng-valid" method="post" onsubmit="return false;">
						<div class="row">
							<div class="col-md-6 col-xs-12 ">
								<div class="row">
									<div class="col-md-4 col-md-offset-1">
										<span class="margin_right_10px">Graph Title</span>
									</div>
									<div class="col-md-6 col-xs-12">
										<input type="text" class="form-control" id="graphTitle" maxlength="31" autofocus="on" pattern="(?=.{0,30}$)[a-zA-Z0-9()_\-\s]+" oninput="invalidMsg(this);" oninvalid="invalidMsg(this);" required>
									</div>
								</div>
							</div>
							<div class="col-md-6 col-xs-12 ">
								<div class="row">
									<div class="col-md-4 col-md-offset-1">
										<span class="margin_right_10px">Select Function</span>
									</div>
									<div class="dropdown col-md-7 col-xs-12 ">
										<button data-toggle="dropdown" id="dropdownMenu3" type="button" class="btn btn-primary btn-sm modelDropDrown dropdown-toggle">
											<span id="select-function" class="pull-left">Average</span><span class="caret pull-right"></span>
										</button>
										<ul aria-labelledby="dropdownMenu3" role="menu" class="dropdown-menu model-dropdown-menu">
											<li role="presentation"><a href="javascript:void(0)" tabindex="-1" role="menuitem" function-name="Total">Total</a></li>
											<li role="presentation"><a href="javascript:void(0)" tabindex="-1" role="menuitem" function-name="Average">Average</a></li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6 col-xs-12">
								<div class="row">
									<div class="col-md-4 col-xs-12 col-md-offset-1"></div>
									<div class="col-md-7 col-xs-12"></div>
								</div>
							</div>
							<div class="col-md-6 col-xs-12">
								<div class="row">
									<div class="col-md-4 col-xs-12 col-md-offset-1">
										<span class="margin_right_10px">Select Unit</span>
									</div>
									<div class="dropdown col-md-7 col-xs-12">
										<button data-toggle="dropdown" id="dropdownMenu3" type="button" class="btn btn-primary btn-sm modelDropDrown dropdown-toggle">
											<span id="primaryUnit" class="pull-left">Minutes</span><span class="caret pull-right"></span>
										</button>
										<ul aria-labelledby="dropdownMenu3" role="menu" class="dropdown-menu model-dropdown-menu">
											<li role="presentation"><a href="javascript:void(0)" tabindex="-1" role="menuitem" unit-name="Hours">Hours</a></li>
											<li role="presentation"><a href="javascript:void(0)" tabindex="-1" role="menuitem" unit-name="Minutes">Minutes</a></li>
											<li role="presentation"><a href="javascript:void(0)" tabindex="-1" role="menuitem" unit-name="Seconds">Seconds</a></li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div class="row hidden">
							<div class="col-md-4 col-md-offset-1">&nbsp;</div>
							<div class="col-md-6 col-xs-12 ">
								<div class="row">
									<div class="col-md-4 col-xs-12 col-md-offset-1">
										<span class="margin_right_10px">Enter Min Value</span>
									</div>
									<div class="col-md-6 col-xs-12 ">
										<input type="number" required="" value="0" autofocus="on" maxlength="61" oninput="invalidMsg(this);" oninvalid="invalidMsg(this);" pattern="(?=.{0,60}$)[0-9]+" placeholder="enter time in sec." id="idealTime" class="form-control">
									</div>
								</div>
							</div>
						</div>
						<div class="class-md-12"><hr/></div>
						<div class="row">
							<div class="col-md-6 col-xs-12 ">
								<div class="row">
									<div class="col-md-6 col-xs-12 ">
										<strong>Primary Y Axis</strong>
									</div>
									<div class="col-md-6 col-xs-12 ">&nbsp;</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6 col-xs-12 selectPrimaryEvent">
								<div class="row">
									<div class="col-md-4 col-xs-12 col-md-offset-1">Select Event</div>
									<div class="dropdown col-md-7 col-xs-12 ">
										<button data-toggle="dropdown" id="dropdownMenu3" type="button" class="btn btn-primary btn-sm modelDropDrown dropdown-toggle">
											<span id="select-primaryAxisEvent" class="pull-left">Select</span><span class="caret pull-right"></span>
										</button>
										<ul aria-labelledby="dropdownMenu3" role="menu" class="dropdown-menu model-dropdown-menu">
										</ul>
									</div>
								</div>
							</div>
							<div class="col-md-6 col-xs-12  selectPrimaryPackage hide">
								<div class="row">
									<div class="col-md-4 col-xs-12 col-md-offset-1">
										<span class="margin_right_10px">Select Package</span>
									</div>
									<div class="dropdown col-md-7 col-xs-12 ">
										<button data-toggle="dropdown" id="dropdownMenu3" type="button" class="btn btn-primary btn-sm modelDropDrown dropdown-toggle">
											<span id="select-primaryAxisPackage" class="pull-left">Select</span><span class="caret pull-right"></span>
										</button>
										<ul aria-labelledby="dropdownMenu3" role="menu" class="dropdown-menu model-dropdown-menu">
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-6 col-xs-12 col-md-offset-3">
							<hr/>
						</div>
						<div class="row">
							<label class="col-md-6 col-xs-12 ">
								<div class="row">
									<div class="col-md-6 col-xs-12 ">
										<input id="activeSecondaryAxis" type="checkbox">
										<strong>Secondary Y Axis</strong>
									</div>
									<div class="col-md-6 col-xs-12 ">&nbsp;</div>
								</div>
							</label>
						</div>
						<div class="row">
							<div class="col-md-6 col-xs-12 selectSecondaryEvent">
								<div class="row">
									<div class="col-md-4 col-xs-12 col-md-offset-1">Select Event</div>
									<div class="dropdown col-md-7 col-xs-12 ">
										<button class="btn btn-primary btn-sm modelDropDrown dropdown-toggle disabledFields" type="button" id="dropdownMenu3" data-toggle="dropdown">
											<span class="pull-left" id="select-secondaryAxisEvent">Select</span><span class="caret pull-right"></span>
										</button>
										<ul class="dropdown-menu model-dropdown-menu" role="menu" aria-labelledby="dropdownMenu3">
										</ul>
									</div>
								</div>
							</div>
							<div class="col-md-6 col-xs-12  selectSecondaryPackage hide">
								<div class="row">
									<div class="col-md-4 col-xs-12 col-md-offset-1">
										<span class="margin_right_10px">Select Package</span>
									</div>
									<div class="dropdown col-md-7 col-xs-12 ">
										<button class="btn btn-primary btn-sm modelDropDrown dropdown-toggle disabledFields" type="button" id="dropdownMenu3" data-toggle="dropdown">
												<span class="pull-left" id="select-secondaryAxisPackage">Select</span><span class="caret pull-right"></span>
										</button>
										<ul class="dropdown-menu model-dropdown-menu" role="menu" aria-labelledby="dropdownMenu3">
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div class="row">&nbsp;</div>
						<div class="row">
							<div class="col-xs-12 text-center">
								<input type="button" value="Cancel" id="sumbitGraph" class="btn btn-default margin_right_10px close_link"  data-dismiss="modal">
								<input type="submit" class="btn btn-primary" id="sumbitGraph" value="Submit">
							</div>
						</div>
					</form>
				</div><!-- /.modal-body -->
			</div><!-- /.modal-content -->
		</div><!-- /.modal-dialog -->
	</div>
	<div class="col-xs-12 col-md-6 hidden" id="emptyDynamicGraph">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">
						<span id="dynamicGraph_title">Slimport Usage</span>
						<span class="pull-right"><img id="idUserProfileRefresh" onclick="refreshGraph('graph1');" title="Refresh" class="img-responsive margin_right_10px" src="<c:out value="${imagesCdnPath}"/>/refresh.png"></span>
						<span class="pull-right"><img id="idUserProfileGraphSettings" onclick="refreshGraph('graph1');" title="Settings" class="img-responsive margin_right_10px" src="<c:out value="${imagesCdnPath}"/>/graph_settings.png"></span>
						<span class="pull-right"><img id="idUserProfileDelete" onclick="refreshGraph('graph1');" title="Delete" class="img-responsive margin_right_10px" src="<c:out value="${imagesCdnPath}"/>/del.png"></span>
					</h3>
				</div>
				<div class="panel-body">
					<div class="row">
						<div class="col-xs-12 text-center" id="graphId">
							<div class="graph_container"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
</body>
</html>