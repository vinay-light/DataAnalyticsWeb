<!--  Get all the session variables -->

<% 
//	String displayName = StringEscapeUtils.escapeHtml4((String)session.getAttribute("userName"));
	boolean isAdmin = (Boolean)session.getAttribute("isAdmin");
	Long userId =  (Long)session.getAttribute("userId");
	String displayName =  (String)session.getAttribute("displayName");
	String currentGroupName =  (String)session.getAttribute("currentGroupName");
	Long currentGroupId =  (Long)session.getAttribute("currentGroupId");
	String currentDeviceModel =  (String)session.getAttribute("currentDeviceModel");
	Long currentModelId =  (Long)session.getAttribute("currentModelId");
	
%> 


<script type="text/javascript">
    var loggedInUserID="<%=userId%>";
    var site_path = "<c:url value='/'/>";
    var displayName ="<%=displayName%> ";
    var currentGroupName = '<%=currentGroupName%>';
     var currentGroupId = '<%=currentGroupId%>';
    var currentDeviceModel = '<%=currentDeviceModel%>';
    var currentModelId = '<%=currentModelId%>';
	$(document).ready(function(){       	
       	$('.nav a:contains(window.location.pathname)').addClass('active');
     });
	
	$(window).resize(function() {
	       if(this.resizeTO) clearTimeout(this.resizeTO);
	       this.resizeTO = setTimeout(function() {
	           $(this).trigger('resizeEnd');
	       }, 500);
	   });
	   
	
	
	
</script>

<!-- ================================================== Navbar ================================================== -->

	<!-- ----------------------------- Top Nav Bar ---------------------------------------------->
	<!--- Top Navbar has following : 
		Left Aligned:
			| HP Logo | Dashboard | Users | Admins | Devices 

		Right Aligned : 
			| Alerts (Icon) | Notifs (Icon) | Settings (Icon - Image of person) |
	!-->

     <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
		<div class="navbar-inner">
		<div class="container">
		<div class="row">
	        <div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
	            <a class="navbar-brand" href='./home.jsp'><img src="/images/common/logo-40x40.png"></a>
	        </div>
        <div id="topNav" class="collapse navbar-collapse">
          <ul class="nav navbar-nav navbar-left"  id = "ul_navBar">
          	<li id="tn_home"><a href="./home.jsp">Home</a></li>
          	<li id="tn_wizard"><a href="./wizardList.jsp">Wizards</a></li>
          	<li id="tn_device"><a href="./deviceModels.jsp">Devices</a></li>
          	<li id="tn_groups"><a href="./deviceGroup.jsp">Groups</a></li>
          	<li id="tn_user"><a href="./userList.jsp">User</a></li>
            <li id="tn_settings"><a href="./settings.jsp">Settings</a></li>
          </ul>

		  <ul class="nav navbar-nav navbar-right dropdown_floatLeft">			
				<!--  FIXME : Should have a full page for alerts -->
				<li id="tn_bell" class="hidden">
					<a id="notificationDropdownId" href="javascript:" onclick="drawNavbarActionRequired()" class="dropdown-toggle" data-toggle="dropdown">
						<span class="glyphicon glyphicon-bell"></span>
					</a>
					<ul id="navbarActionRequiredDropdown" class="dropdown-menu custom notificationDropdown"></ul>
				</li>	
				
				<!-- Language dropdown !-->
				<li class="dropdown" id="liNavLanguageSetting"><a
					id="languageSetting" href="#" class="dropdown-toggle"
					data-toggle="dropdown"> <span class="icon_en_US"></span>
				</a>
					<ul id="langSelectMenu" class="dropdown-menu pull-right"
						role="menu">
					</ul></li>
				<!-- /Language dropdown !-->
				<li class="dropdown" id="liNavAccountSetting">
					<a id="accountSetting" href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">
						<span class="glyphicon glyphicon-user"></span>
					</a>
					<ul id="accountSettingMenu" class="dropdown-menu pull-right"
						role="menu">
						<li><a href="javascript:void(0);" onclick="logout();" id="link_header_logout">Logout</a></li>
						<li><a id="lnkNavbarChangePass" class="dropdown-toggle" href="#changePasswordBox" data-toggle="modal">Change Password</a></li>
					</ul></li>
				<!-- /settings dropdown !-->
			</ul><!-- Right aligned nav !-->
			</div><!--/.nav-collapse -->
		</div>
		</div><!-- navbar-inner !-->
      </div>
    </div> <!-- Navbar level 1 !-->



	<!-- -------------------------------------------------- Level 2 Navbar -------------------------------------------- !-->
	<!-- Nav Bar Level 2 - Users, Groups !-->
	<!--  FIXME : Only show navbar when required, using js -->
		<!-- <div>  -->
		<div id="navTabContainer">
		 <div id="navContainer" class="container">
		 <div class="row">
		  <a id="placeHolder" class="navbar-brand" href="<c:url value='/'/>">
              <img src="/images/common/logo-40x40.png">
          </a>
            <ul class="nav hidden nav-tabs" id="ul_tab_device">
                <!-- <li  id="li_allDevices"><a href="./deviceList.jsp">All Devices</a></li>
                <li id="li_deviceGroup"><a href="./deviceGroup.jsp">Devices Groups</a></li> -->
                <li id="li_deviceModels"><a href="./deviceModels.jsp">Devices Models</a></li>
            </ul>
            <ul class="nav hidden nav-tabs" id="ul_tab_wizard">
                <li id="li_stabilityAnalytics"><a href="./stabilityAnalytics.jsp">Stability Analytics</a></li>
                <li id="li_batteryAnalytics"><a href="./batteryAnalytics.jsp">Battery Analytics</a></li>
                <li id="li_uiAnalytics"><a href="./uiAnalytics.jsp">UI Analytics</a></li>
                <li id="li_bugAnalytics"><a href="./bugReport.jsp">Bug Report</a></li>
                <li  id="li_debugLogs"><a href="./debugLog.jsp">Debug Logs</a></li>
                <li  id="li_viewLogs"><a href="./deviceLogList.jsp">Device Activity Logs</a></li>
                <!-- <li  id="li_CrashModelAnalytics"><a href="./crashModelAnalytics.jsp">Crash Model Analytics</a></li> -->
            </ul>
             <ul class="nav hidden nav-tabs" id="ul_tab_home">
                <li  id="li_predefinedAnalytics"><a href="./home.jsp">Predefined Analytics</a></li>
                <li id="li_userDefinedAnalytics"><a href="./home_userDefinedGraph.jsp">User Defined Analytics</a></li>
            </ul>
         </div>
         </div>
       </div>

<!-- -----------------------------------Notification Box --------------------------------------------- -->
	<div class="row" id="navNotificationBoxContainer">
           <div class="col-xs-12" id="navNotificationBox"></div>                
    </div>
<!-- -----------------------------------End: Notification Box ---------------------------------------- -->

<!-- -----------------------------------Dialog Boxes --------------------------------------------- -->


<div class="modal fade" id="changePasswordBox">
    <div class="modal-dialog">
    <form class="frmChangePassword" method="post">
    <div class="modal-content col-xs-10 col-xs-offset-1 col-sm-offset-2 col-sm-8">
        <div class="modal-body">
            <div class="row">
                <div class="col-xs-12 text-center">
                  <h4>Change Password</h4>
                </div>
            </div>
            <div class="row col-xs-12">
                <span id="validationErrorBox" class="control-label modal_notification_error"> </span>
            </div>
            <div class="row">
                <div class="col-xs-12 col-sm-61">
                   <label>Current Password</label>
                </div>
                <div class="col-xs-12 col-sm-61">
                   <input class="form-control required" placeholder="Enter current password" autocomplete="off"  tabindex="1" type="password"  name="password" id="header_txt_currentPwd" autofocus/>
                </div>
            </div>
            <div class="row rowSpace_2">
                <div class="col-xs-12 col-sm-61">
                   <label>Enter New Password</label>
                </div>
                <div class="col-xs-12 col-sm-61">
                   <input class="form-control isPassword" placeholder="Enter new password" autocomplete="off"  tabindex="2" type="password"  name="password" id="header_txt_newPwd"/>
                </div>
            </div>
            <div class="row rowSpace_2">
                <div class="col-xs-12 col-sm-61">
                   <label>Confirm Password</label>
                </div>
                <div class="col-xs-12 col-sm-61">
                   <input class="form-control confirmPassword "  placeholder="Re-enter password" autocomplete="off"  tabindex="3" type="password" name="confirmPassword" id="header_txt_confirmPwd"  />
                </div>
            </div>
           <div class="row rowSpace_2">
                    <div class="col-xs-12 text-right">
                        <button class="btn btn-default btn-sm close_link" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i> Cancel</button>
                        <button class="btn btn-primary btn-sm" tabindex="4" id="header_btn_changePwdDlgSave" type="button" onclick="updatePassword();"><i class="glyphicon glyphicon-floppy-disk"></i> Save</button>
                   </div>
            </div>
        </div>
    </div>
    </form>
</div>
</div>
<div class="modal fade" id="modal_changeDeviceModel" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content col-xs-10 col-xs-offset-1 col-sm-offset-2 col-sm-8">
        <div class="modal-body frmChangeDeviceModel" >
            <div class="row">
                <div class="col-xs-12 text-center">
                  <h4>Change Settings</h4>
                </div>
            </div>
				<div class="row" id="notificationBoxContainer">
					<div class="col-xs-12" id="notificationBoxForModal"></div>
				</div>
				<div class="row rowSpace_2">
                <div class="col-xs-12 col-sm-61">
                   <label>Device Group</label>
                </div>
                <div class="col-xs-12 col-sm-61">
                   <select class="form-control" onchange=""  autocomplete="off" tabindex="2"  id="header_select_device_group">
                   </select>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12 col-sm-61">
                   <label>Device Model</label>
                </div>
                <div class="col-xs-12 col-sm-61">
                   <select class="form-control" onchange=""  autocomplete="off" tabindex="1"  id="header_select_device_model">
                   </select>
                </div>
            </div>
			<div class="row rowSpace_2">
                    <div class="col-xs-12 text-right">
                        <button class="btn btn-default btn-sm close_link" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i> Cancel</button>
                        <button class="btn btn-primary btn-sm" tabindex="4" id="header_btn_changeDeviceModel" type="button" onclick="updateDeviceSetting();"><i class="glyphicon glyphicon-floppy-disk"></i> Save</button>
                   </div>
            </div>
        </div>
    </div>
    </form>
</div>
</div>
<div  id="updateUser" class="modal fade">
  <div class="modal-dialog"> 	
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title"><fmt:message key="common.placeholder.updateuser"/></h4>
      </div>
      <div class="modal-body">
        <form id="frmUpdateUser" method="post">
        <div class="row">
             <span id="div_error" class="control-label div_error col-xs-12"> </span>
        </div>
        <p class="small"><fmt:message key="common.placeholder.update_user_details"/></p>
      		<!-- row 1 -->
      		<div class="row rowSpace_2">
      			<div class="col-xs-6"><fmt:message key="common.placeholder.displayname"/></div>
      		</div>
      		<div class="row inputFeild">
      			<div class="col-xs-6">
					<input class="form-control input-sm required" autocomplete="off" type="text"  name="userName" id="userName" readonly/>
				</div>
      			<div class="col-xs-6">
      				<input class="form-control input-sm required organizationName" autocomplete="off" placeholder="<fmt:message key="common.placeholder.displayname"/>"  tabindex="1" type="text"  name="displayName" id="displayName"/>
      			</div>
      		</div>
      		<!-- row 2 -->
      		<div class="row rowSpace_2">
      			<div class="col-xs-6"><fmt:message key="common.placeholder.firstname"/></div>
      			<div class="col-xs-6"><fmt:message key="common.placeholder.lastname"/></div>
      		</div>
      		<div class="row inputFeild">
      			<div class="col-xs-6">
					<input class="form-control input-sm required textonly" autocomplete="off" placeholder="<fmt:message key="common.placeholder.firstname"/>"  tabindex="2" type="text"  name="firstName" id="firstName"/>
				</div>
      			<div class="col-xs-6">
      				<input class="form-control input-sm required textonly" autocomplete="off" placeholder="<fmt:message key="common.placeholder.lastname"/>"  tabindex="3" type="text"  name="lastName" id="lastName"/>
      			</div>
      		</div>
      		<!-- row 3 -->
      		<div class="row rowSpace_2">
      			<div class="col-xs-6"><fmt:message key="common.panel.status"/></div>
      			<div class="col-xs-6"><fmt:message key="common.email"/></div>
      		</div>
      		<div class="row inputFeild">
      			<div class="col-xs-6 rowSpace_2" id="frmStatus">
				</div>
      			<div class="col-xs-6">
      				<input class="form-control input-sm required" autocomplete="off" type="email"  name="emailId" id="emailId" readonly/>
      			</div>
      		</div>
      		<!-- row 4 -->
      		<div class="row rowSpace_2">
      			<div class="col-xs-6"><fmt:message key="common.placeholder.phone_number"/></div>
      			<!-- <div class="col-xs-6">Company</div> -->
      		</div>
      		<div class="row inputFeild">
      			<div class="col-xs-6">
      				<div class="input-group">
						<span class="input-group-addon select">
										<select tabindex="4" class="selectCountryCls phoneCode" name="mobilePhoneNumber" id="userUpdateCountrycode">
											<option value="1" selected>USA &amp; Canada (+1)</option>
											<option value="44">UK (+44)</option>
											<option value="49">Germany (+49)</option>
											<option value="33">France (+33)</option>
											<option value="34">Spain (+34)</option>
											<option value="91">India (+91)</option>
											<option value="86">China (+86)</option>
											<option value="55">Brazil (+55)</option>
											<option value="213">Algeria (+213)</option>
											<option value="376">Andorra (+376)</option>
											<option value="244">Angola (+244)</option>
											<option value="1264">Anguilla (+1264)</option>
											<option value="1268">Antigua &amp; Barbuda (+1268)</option>
											<option value="599">Antilles (Dutch) (+599)</option>
											<option value="54">Argentina (+54)</option>
											<option value="374">Armenia (+374)</option>
											<option value="297">Aruba (+297)</option>
											<option value="247">Ascension Island (+247)</option>
											<option value="61">Australia (+61)</option>
											<option value="43">Austria (+43)</option>
											<option value="994">Azerbaijan (+994)</option>
											<option value="1242">Bahamas (+1242)</option>
											<option value="973">Bahrain (+973)</option>
											<option value="880">Bangladesh (+880)</option>
											<option value="1246">Barbados (+1246)</option>
											<option value="375">Belarus (+375)</option>
											<option value="32">Belgium (+32)</option>
											<option value="501">Belize (+501)</option>
											<option value="229">Benin (+229)</option>
											<option value="1441">Bermuda (+1441)</option>
											<option value="975">Bhutan (+975)</option>
											<option value="591">Bolivia (+591)</option>
											<option value="387">Bosnia Herzegovina (+387)</option>
											<option value="267">Botswana (+267)</option>
											<option value="673">Brunei (+673)</option>
											<option value="359">Bulgaria (+359)</option>
											<option value="226">Burkina Faso (+226)</option>
											<option value="257">Burundi (+257)</option>
											<option value="855">Cambodia (+855)</option>
											<option value="237">Cameroon (+237)</option>
											<option value="238">Cape Verde Islands (+238)</option>
											<option value="1345">Cayman Islands (+1345)</option>
											<option value="236">Central African Republic (+236)</option>
											<option value="56">Chile (+56)</option>
											<option value="57">Colombia (+57)</option>
											<option value="269">Comoros (+269)</option>
											<option value="242">Congo (+242)</option>
											<option value="682">Cook Islands (+682)</option>
											<option value="506">Costa Rica (+506)</option>
											<option value="385">Croatia (+385)</option>
											<option value="53">Cuba (+53)</option>
											<option value="90392">Cyprus North (+90392)</option>
											<option value="357">Cyprus South (+357)</option>
											<option value="42">Czech Republic (+42)</option>
											<option value="45">Denmark (+45)</option>
											<option value="2463">Diego Garcia (+2463)</option>
											<option value="253">Djibouti (+253)</option>
											<option value="1809">Dominica (+1809)</option>
											<option value="1809">Dominican Republic (+1809)</option>
											<option value="593">Ecuador (+593)</option>
											<option value="20">Egypt (+20)</option>
											<option value="353">Eire (+353)</option>
											<option value="503">El Salvador (+503)</option>
											<option value="240">Equatorial Guinea (+240)</option>
											<option value="291">Eritrea (+291)</option>
											<option value="372">Estonia (+372)</option>
											<option value="251">Ethiopia (+251)</option>
											<option value="500">Falkland Islands (+500)</option>
											<option value="298">Faroe Islands (+298)</option>
											<option value="679">Fiji (+679)</option>
											<option value="358">Finland (+358)</option>
											<option value="594">French Guiana (+594)</option>
											<option value="689">French Polynesia (+689)</option>
											<option value="241">Gabon (+241)</option>
											<option value="220">Gambia (+220)</option>
											<option value="7880">Georgia (+7880)</option>
											<option value="233">Ghana (+233)</option>
											<option value="350">Gibraltar (+350)</option>
											<option value="30">Greece (+30)</option>
											<option value="299">Greenland (+299)</option>
											<option value="1473">Grenada (+1473)</option>
											<option value="590">Guadeloupe (+590)</option>
											<option value="671">Guam (+671)</option>
											<option value="502">Guatemala (+502)</option>
											<option value="224">Guinea (+224)</option>
											<option value="245">Guinea - Bissau (+245)</option>
											<option value="592">Guyana (+592)</option>
											<option value="509">Haiti (+509)</option>
											<option value="504">Honduras (+504)</option>
											<option value="852">Hong Kong (+852)</option>
											<option value="36">Hungary (+36)</option>
											<option value="354">Iceland (+354)</option>
											<option value="62">Indonesia (+62)</option>
											<option value="98">Iran (+98)</option>
											<option value="964">Iraq (+964)</option>
											<option value="972">Israel (+972)</option>
											<option value="39">Italy (+39)</option>
											<option value="225">Ivory Coast (+225)</option>
											<option value="1876">Jamaica (+1876)</option>
											<option value="81">Japan (+81)</option>
											<option value="962">Jordan (+962)</option>
											<option value="7">Kazakhstan (+7)</option>
											<option value="254">Kenya (+254)</option>
											<option value="686">Kiribati (+686)</option>
											<option value="850">Korea North (+850)</option>
											<option value="82">Korea South (+82)</option>
											<option value="965">Kuwait (+965)</option>
											<option value="996">Kyrgyzstan (+996)</option>
											<option value="856">Laos (+856)</option>
											<option value="371">Latvia (+371)</option>
											<option value="961">Lebanon (+961)</option>
											<option value="266">Lesotho (+266)</option>
											<option value="231">Liberia (+231)</option>
											<option value="218">Libya (+218)</option>
											<option value="417">Liechtenstein (+417)</option>
											<option value="370">Lithuania (+370)</option>
											<option value="352">Luxembourg (+352)</option>
											<option value="853">Macao (+853)</option>
											<option value="389">Macedonia (+389)</option>
											<option value="261">Madagascar (+261)</option>
											<option value="265">Malawi (+265)</option>
											<option value="60">Malaysia (+60)</option>
											<option value="960">Maldives (+960)</option>
											<option value="223">Mali (+223)</option>
											<option value="356">Malta (+356)</option>
											<option value="692">Marshall Islands (+692)</option>
											<option value="596">Martinique (+596)</option>
											<option value="222">Mauritania (+222)</option>
											<option value="269">Mayotte (+269)</option>
											<option value="52">Mexico (+52)</option>
											<option value="691">Micronesia (+691)</option>
											<option value="373">Moldova (+373)</option>
											<option value="377">Monaco (+377)</option>
											<option value="976">Mongolia (+976)</option>
											<option value="1664">Montserrat (+1664)</option>
											<option value="212">Morocco (+212)</option>
											<option value="258">Mozambique (+258)</option>
											<option value="95">Myanmar (+95)</option>
											<option value="264">Namibia (+264)</option>
											<option value="674">Nauru (+674)</option>
											<option value="977">Nepal (+977)</option>
											<option value="31">Netherlands (+31)</option>
											<option value="687">New Caledonia (+687)</option>
											<option value="64">New Zealand (+64)</option>
											<option value="505">Nicaragua (+505)</option>
											<option value="227">Niger (+227)</option>
											<option value="234">Nigeria (+234)</option>
											<option value="683">Niue (+683)</option>
											<option value="672">Norfolk Islands (+672)</option>
											<option value="670">Northern Marianas (+670)</option>
											<option value="47">Norway (+47)</option>
											<option value="968">Oman (+968)</option>
											<option value="92">Pakistan (+92)</option>
											<option value="680">Palau (+680)</option>
											<option value="507">Panama (+507)</option>
											<option value="675">Papua New Guinea (+675)</option>
											<option value="595">Paraguay (+595)</option>
											<option value="51">Peru (+51)</option>
											<option value="63">Philippines (+63)</option>
											<option value="48">Poland (+48)</option>
											<option value="351">Portugal (+351)</option>
											<option value="1787">Puerto Rico (+1787)</option>
											<option value="974">Qatar (+974)</option>
											<option value="262">Reunion (+262)</option>
											<option value="40">Romania (+40)</option>
											<option value="7">Russia (+7)</option>
											<option value="250">Rwanda (+250)</option>
											<option value="378">San Marino (+378)</option>
											<option value="239">Sao Tome &amp; Principe (+239)</option>
											<option value="966">Saudi Arabia (+966)</option>
											<option value="221">Senegal (+221)</option>
											<option value="381">Serbia (+381)</option>
											<option value="248">Seychelles (+248)</option>
											<option value="232">Sierra Leone (+232)</option>
											<option value="65">Singapore (+65)</option>
											<option value="421">Slovak Republic (+421)</option>
											<option value="386">Slovenia (+386)</option>
											<option value="677">Solomon Islands (+677)</option>
											<option value="252">Somalia (+252)</option>
											<option value="27">South Africa (+27)</option>
											<option value="94">Sri Lanka (+94)</option>
											<option value="290">St. Helena (+290)</option>
											<option value="1869">St. Kitts (+1869)</option>
											<option value="1758">St. Lucia (+1758)</option>
											<option value="249">Sudan (+249)</option>
											<option value="597">Suriname (+597)</option>
											<option value="268">Swaziland (+268)</option>
											<option value="46">Sweden (+46)</option>
											<option value="41">Switzerland (+41)</option>
											<option value="963">Syria (+963)</option>
											<option value="886">Taiwan (+886)</option>
											<option value="7">Tajikstan (+7)</option>
											<option value="66">Thailand (+66)</option>
											<option value="228">Togo (+228)</option>
											<option value="676">Tonga (+676)</option>
											<option value="1868">Trinidad &amp; Tobago (+1868)</option>
											<option value="216">Tunisia (+216)</option>
											<option value="90">Turkey (+90)</option>
											<option value="7">Turkmenistan (+7)</option>
											<option value="993">Turkmenistan (+993)</option>
											<option value="1649">Turks &amp; Caicos Islands
												(+1649)</option>
											<option value="688">Tuvalu (+688)</option>
											<option value="256">Uganda (+256)</option>

											<option value="380">Ukraine (+380)</option>
											<option value="971">United Arab Emirates (+971)</option>
											<option value="598">Uruguay (+598)</option>

											<option value="7">Uzbekistan (+7)</option>
											<option value="678">Vanuatu (+678)</option>
											<option value="379">Vatican City (+379)</option>
											<option value="58">Venezuela (+58)</option>
											<option value="84">Vietnam (+84)</option>
											<option value="1284">Virgin Islands - British
												(+1284)</option>
											<option value="1340">Virgin Islands - US (+1340)</option>
											<option value="681">Wallis &amp; Futuna (+681)</option>
											<option value="969">Yemen (North)(+969)</option>
											<option value="967">Yemen (South)(+967)</option>
											<option value="381">Yugoslavia (+381)</option>
											<option value="243">Zaire (+243)</option>
											<option value="260">Zambia (+260)</option>
											<option value="263">Zimbabwe (+263)</option>
									</select>
									</span>
						<input class="form-control input-sm phoneNumber" autocomplete="off" placeholder="<fmt:message key="common.placeholder.phone_number"/>"  tabindex="4" type="text"  name="phoneNumber" id="phoneNumber" data-bind="value:replyNumber"/>
					</div>
      				
      			</div>
      		</div>
      	</form>
      </div>
      <div class="modal-footer" id="userUpdateFooter">
        <button type="button" class="btn btn-default" data-dismiss="modal"><fmt:message key="common.buy.cancel"/></button>
        <button id="saveUpdateUser" type="button" class="btn btn-primary"><fmt:message key="common.placeholder.updateuser"/></button>
      </div>
      
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
