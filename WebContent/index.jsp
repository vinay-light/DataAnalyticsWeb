<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="changeCount" value="6"/>
<c:set var="scriptPath" value="script/"/>
<c:set var="imagesCdnPath" value="images"/>
<c:if test="${empty userLocale}">
	<c:set var="userLocale" value="en_US" scope="session" />
</c:if>
<fmt:setLocale value="${userLocale}" /> 

<%@include file="/pages/common/fluid-theme/fluid-css.jsp"%>
<c:if test="${ not empty username }">
	<c:set var="userType" value="${isAdmin ? 'admin' : 'user'}"  />
	<c:if test="${ isTempPassword == 'false' }">
		<c:redirect url ="/pages/home.jsp" />
	</c:if>
</c:if>

<!DOCTYPE html>
<html>
<head>
<title>Data Analytics | Login Page</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Data Analytics Management Trial">
<meta name="author" content="Binay Prasad">
<script src="<c:out value="${scriptPath}"/>jQuery/jquery-1.10.1.min.js"></script>
<script src="<c:out value="${scriptPath}"/>jQuery/jquery-ui-1.10.3.custom.min.js"></script>
<script src="/bootstrap3/js/bootstrap.min.js"></script>

<script src="<c:out value="${scriptPath}"/>grid/grid.locale-en.js"></script>
<script src="<c:out value="${scriptPath}"/>jQuery/jquery.base64.min.js"></script>
<!-- Google Crypto JS Libraries -->
<%@ include file="/pages/common/fluid-theme/translate.jsp"%>		
<script src="<c:url value="/script/fluidpages/common/url_encryption.js"/>?change=<c:out value="${changeCount}"/>"></script>
<script src="<c:url value="/script/fluidpages/common/jquery.cookie.js"/>?change=<c:out value="${changeCount}"/>"></script>
<script src="<c:url value="/script/fluidpages/common/common_functions.js"/>?change=<c:out value="${changeCount}"/>"></script>

<script>
	var site_path = "<c:url value="/"/>";
	var tempSite_path = site_path.split(";");
	if (tempSite_path[1]) {
		site_path = tempSite_path[0];
	}
	var imagesCdnPath='<c:out value="${imagesCdnPath}"/>';
</script>
<script src="<c:url value="/script/fluidpages/index.js"/>?change=<c:out value="${changeCount}"/>"></script>

<link href='<c:url value="/bootstrap3/css/home.css"/>?change=<c:out value="${changeCount}"/>' rel="stylesheet">
<link href='<c:url value="/bootstrap3/css/fonts.css"/>?change=<c:out value="${changeCount}"/>' rel="stylesheet">
<link rel="shortcut icon" href="<c:out value="${imagesCdnPath}"/>/hp.ico" />
<link rel="shortcut icon" href="<c:out value="${imagesCdnPath}"/>/hp.ico"/>
<link rel="image_src" href="<c:out value="${imagesCdnPath}"/>/hp.ico"/>
</head>

<body>

	<div id="body" >
		<!--  Navbars (Two Levels will be rendered -->
		<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
			<div class="navbar-inner">
				<div class="container">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle" data-toggle="collapse"
							data-target=".navbar-collapse">
							<span class="sr-only">Toggle navigation</span> <span
								class="icon-bar"></span> <span class="icon-bar"></span> <span
								class="icon-bar"></span>
						</button>
						<a class="navbar-brand" href='<c:url value=""/>'><img
							src="/images/common/logo-40x40.png"></a>
					</div>

					<div id="topNav" class="collapse navbar-collapse">
						<ul class="nav navbar-nav navbar-left">
						</ul>

						<ul class="nav navbar-nav navbar-right">
						<li class="dropdown">
                                <a id="lnkNavbarLogin" class="dropdown-toggle login-link" data-toggle="modal" href="#loginBox">Login</a>
				        </li>
                        </ul>
                        
					</div>
				</div>
			</div>
		</div>
		<!-- <img width="100%" height="100%" src="/images/da_landing.png" class="img-responsive"> -->
		<div id="bannerHome">
			<div class="container">
			<div class="row">
			<div class="col-xs-12 col-sm-4 col-md-2">
				<div class="box-quick-link1">
					<div class="row">
						<div class="col-xs-12 thumbImg">
							<img class="img-responsive color_light_red" src="/images/stability_analytics.png">
							<div class="text-center img-responsive ">Stability Analytics</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-4 col-md-2">
				<div class="box-quick-link1">
					<div class="row">
						<div class="col-xs-12 thumbImg">
							<img class="img-responsive  color_light_purpule" src="/images/battery_analytics.png">
							<div class="text-center img-responsive ">Battery Analytics</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-4 col-md-2">
				<div class="box-quick-link1">
					<div class="row">
						<div class="col-xs-12 thumbImg">
							<img class="img-responsive  color_light_green" src="/images/ui_analytics.png">
							<div class="text-center img-responsive ">UI Analytics</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-4 col-md-2">
				<div class="box-quick-link1">
					<div class="row">
						<div class="col-xs-12 thumbImg">
							<img class="img-responsive  color_light_blue" src="/images/bug_report.png">
							<div class="text-center img-responsive ">Bug Report</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-4 col-md-2">
				<div class="box-quick-link1">
					<div class="row">
						<div class="col-xs-12 thumbImg">
							<img class="img-responsive color_light_yellow" src="/images/debug_logs.png">
							<div class="text-center img-responsive ">Debug Logs</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-4 col-md-2">
				<div class="box-quick-link1">
					<div class="row">
						<div class="col-xs-12 thumbImg">
							<img class="img-responsive  color_light_orange" src="/images/activity_icon.png">
							<div class="text-center img-responsive ">Device Activity Logs</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		</div>
		</div>
		<footer class="navbar navbar-default" id="copyright">
			<div class="container container_body">
				<p>&copy; 2014 Hewlett-Packard Development Company, L.P.<br>
				HP Cloud legal documents and privacy policy</p>
			</div>
		</footer>
		<div class="modal fade" id="loginBox" >
		<div class="modal-dialog bufferHeight">
			 <div class="modal-content col-xs-12">
			 	
				<div class="modal-body">
					<div class="row">
                    	<div class="col-xs-12">
                        <h2 class="rActive">Sign In</h2>
                        </div>
                    </div>
                    <div class="row col-xs-12">
						<span id="div_errorMessage" class="control-label"><img class="hidden" src="/images/progress.gif"></span>
					</div>
		            <div class="row">
                    	<div class="col-xs-12">
                    	<i class="glyphicon glyphicon-user"></i>
                        <input tabindex="1" type="text" class="form-control" id="txt_username" pattern="(?=.{0,60}$)" maxlength="61" placeholder="User Id" autocomplete="on" autofocus>
                        </div>
                    </div>
	                <div class="row rowSpace_2">
                    	<div class="col-xs-12">
                        <i class="glyphicon glyphicon-lock"></i>
                        <input tabindex="2" type="password" class="form-control" id="txt_password" pattern="(?=.{0,30}$)" maxlength="31" placeholder="Password"
                        	onchange="javascript:passwordModified();">
                        </div>
                    </div>
					<div class="row rowSpace_2">
                    	<div class="col-xs-6 visually-hidden">
                        	<input tabindex="3" type="checkbox" id="checkbox_rememberMe"><span>&nbsp;&nbsp;<fmt:message key="common.txt.remember_me"/></span>
                    	</div>
						<div class="col-xs-6 text-right">
                        	<a tabindex="5" id="link_forgetPassword" href="#forgetPassword" data-toggle="modal" class="underline" onclick="hideSignInPage()">Forgot Password?</a> 
                    	</div>
                    	
                    </div>
	                <div class="row rowSpace_2">
                    	<div class="col-xs-12 text-center">
                    		<input type="hidden" id="doLoginWithCookie" value="false"/>
                    		<input type="hidden" id="userNameFromCookie" value=""/>
							<input tabindex="4" type="button" onclick="javascript:login();" id="btn_signIn" value="Login" class="btn btn-primary btn-sm">
                        </div>
                    </div>
                    <div class="row">
                    	<div class="col-xs-12 text-center">
						<hr class="line">
						<div class="box"> OR </div>
						</div>
                    </div>
					<div class="row">
                    	<div class="col-xs-12 text-center">
							<input type="button" class="btn btn-primary btn-sm" tabindex="5" id="btn_newAccount" data-toggle="modal" href="#userRegistration" onclick="hideSignInPage()" value="Sign Up"/>
                        </div>
                    </div>
	             
		        </div>
			 </div>
		</div>
		</div>
		
		<div class="modal fade" id="forgetPassword">
		<div class="modal-dialog">
			 
			 <div class="modal-content col-xs-12">
				<div class="modal-header">
					<div class="row">
					<div class="col-xs-12 col-xs-offset-2">					
					<img class="img-responsive" src='/images/common/logo1-40x40.png'/>
					</div>
					</div>					
					<h3 class="">Request Password Reset</h3>
				</div>
				<!-- <form class="ng-pristine ng-valid" id="create_domain_form"> -->
				<div class="modal-body custom">
					<div class="row">
						<div class="col-xs-12">
							<div class="messages"></div>
							<h3>Description:</h3>
							<p class="description">The user will receive an email to
								reset their password</p>
							<p id="forUserName" class="rowSpace_0">Email Id <span>*</span></p>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">
							<input type="email" pattern="(?=.{0,60}$)" maxlength="61" id="id_username" name="username" class="form-control input-sm" data-original-title=""
								tabindex="1" autocomplete="on" autofocus>
						</div>
					</div>
				</div>
				
				<div class="modal-footer">
					<button class="btn btn-small" type="button" onclick="cancel();">Cancel</button>
					<button id="btn_requestPassword" class="btn btn-small btn-primary" onclick="forgetPassword();">Request Reset</button>
				</div>
			<!-- </form> -->
			</div>
		</div>
		</div>
		<div id="userRegistration" class="modal fade in" aria-hidden="false">
		<div class="modal-dialog">
			 
			 <div class="modal-content col-xs-12">
				<div class="modal-header">
										
					<h3 class="text-center">User Registration</h3>
				</div>
				<form class="ng-pristine ng-valid" id="create_domain_form">
				<div class="modal-body custom">
					<div class="row">
						<div class="col-xs-12">
							<div class="messages">&nbsp;</div>
						</div>
					</div>
					<div class="row rowSpace_2">
						<div class="col-xs-12">
							<input type="text" maxlength="61" id="firstName" name="username" class="form-control input-sm" pattern="(?=.{0,60}$)[a-zA-Z]+" data-original-title="" tabindex="1" placeholder="First Name" oninvalid="invalidMsg(this);" oninput="invalidMsg(this);" autocomplete="on" autofocus='on' required>
						</div>
					</div>
  
  		<div class="row rowSpace_2">
						<div class="col-xs-12">
							<input type="text" maxlength="61" id="lastName" name="username" class="form-control input-sm" pattern="(?=.{0,60}$)[a-zA-Z]+" data-original-title="" placeholder="Last Name" oninvalid="invalidMsg(this);" oninput="invalidMsg(this);" tabindex="2" autocomplete="on" required>
						</div>
					</div>
  
  		<div class="row rowSpace_2">
						<div class="col-xs-12">
							<input type="email" maxlength="61" id="userEmail" name="username" class="form-control input-sm" data-original-title="" tabindex="3" placeholder="Email ID" autocomplete="on" oninvalid="invalidMsg(this);" oninput="invalidMsg(this);" pattern="(?=.{0,60}$)([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)" required>
						</div>
					</div>
  
				</div>
				
				<div class="modal-footer">
					<button onclick="cancel();" type="button" class="btn btn-small btn-sm">Cancel</button>
					<button type="submit" class="btn btn-small btn-primary btn-sm">Submit</button>
				</div>
			</form>
			</div>
		</div>
		</div>
	</div>
	
	<!-- Change password dialog -->
	<div id="changePasswordBox" class="modal fade in"
		style="display: none;" aria-hidden="false">
		<div class="modal-dialog">
			<div
				class="modal-content col-xs-10 col-xs-offset-1 col-sm-offset-2 col-sm-8">
				<div class="modal-body">
					<div class="row">
						<div class="col-xs-12 text-center">
							<h4>Change Password</h4>
						</div>
					</div>
					<div class="row col-xs-12">
						<span class="control-label notification_error" id="validationErrorBox">
						</span>
					</div>
					<div class="row">
						<div class="col-xs-12 col-sm-61">
							<label>Current Password</label>
						</div>
						<div class="col-xs-12 col-sm-61">
							<input type="password" autofocus="" id="header_txt_currentPwd"
								name="password" tabindex="1" autocomplete="off"
								placeholder="Enter current password"
								class="form-control required">
						</div>
					</div>
					<div class="row rowSpace_2">
						<div class="col-xs-12 col-sm-61">
							<label>Enter New Password</label>
						</div>
						<div class="col-xs-12 col-sm-61">
							<input type="password" id="header_txt_newPwd" name="password"
								tabindex="2" autocomplete="off" maxlength="51"
								placeholder="Enter new password" pattern="(?=.{0,50}$)"
								class="form-control isPassword">
						</div>
					</div>
					<div class="row rowSpace_2">
						<div class="col-xs-12 col-sm-61">
							<label>Confirm Password</label>
						</div>
						<div class="col-xs-12 col-sm-61">
							<input type="password" id="header_txt_confirmPwd"
								name="confirmPassword" tabindex="3" autocomplete="off"
								placeholder="Re-enter password" maxlength="51"  pattern="(?=.{0,50}$)"
								class="form-control confirmPassword ">
						</div>
					</div>
					<div class="row rowSpace_2">
						<div class="col-xs-12 text-right">
							<button data-dismiss="modal"
								class="btn btn-default btn-sm close_link">
								<i class="glyphicon glyphicon-remove"></i> Cancel
							</button>
							<button onclick="resetPassword();" type="submit"
								id="header_btn_changePwdDlgSave" tabindex="4"
								class="btn btn-primary btn-sm">
								<i class="glyphicon glyphicon-floppy-disk"></i> Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>