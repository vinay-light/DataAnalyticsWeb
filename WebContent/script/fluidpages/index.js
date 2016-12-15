/*global $:false, jQuery:false, objGrid:true, document:false, window:false, objActionMapper:true, objMode:true, getPageStatusData:true, 
 loadNav:true, showUrlNotification:true, objUrlParam:true, boxSelected:true, setActionMode:true, searchCommon:true, loadUserTable:true,
 activateGrid:true, getEncodedNotification:true, getSelectedRowIds:true, getSelectedIds:true, updateUserStatus:true, translate:false,
 clsCheckAll:true, deleteRecordInfo:true, getSearchData:true, objNotification:true, showNotification:true, updateStatus:true,
 loadGridView:true, loadTableView:true,  drawPaginator:true, setPageStatusData:true, typeAheadTriggerLimit:true, validateResponse:true,
 processAutocompleteData:true, addDeviceNames:true, addProfileImage:true, addCheckbox:true , getStatus:true , getUserName:true , getDeviceDetails:true,
 getName:true, shortenName:true, activateGrid:true, autoLogin:true, bannerResolution:true */
var access_token = "";
var moreAddOnsFlag = false;
var isPasswordModified = false;
var homeURL = '/';


function translate(tag) {
	if (typeof objLocale[tag] == 'undefined') {
		return "";		
	}	
	return objLocale[tag];
}
var viewPage = false;
footerAdjuster.offset = 45;
$(document).ready(function() {
	$("html, body").css("background-color","#00a7ef;");
	$("#txt_username").val("");
	$("#txt_password").val("");
	$('#navTabContainer').hide();
	$('div#actionNavbar').hide();
	var screenMode='login';
	$("#loginBox").keypress(function(event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == '13' && $("#loginBox").is(":visible")) {
			if(event.target.id != 'btn_signIn') {
				login();
			}
		}
	});
	$("#forgetPassword").keypress(function(event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == '13' && $("#forgetPassword").is(":visible")) {
			if(event.target.id != 'btn_requestPassword') {
				forgetPassword();
			}
		}
	});
	$('#link_forgetPassword').click(function(){
    	screenMode='forgetPass';
    	showForgotPassword();
    });
    if(GetURLParameter('loginMode')){
    	$('#loginBox').modal('show');
    	setTimeout(function() { $('#txt_username').focus(); }, 500);
    }
    $('#create_domain_form').submit(userRegistration);
    $('#userRegistration').on('hidden.bs.modal', function () {
    	 	 window.location = homeURL;
    	});
    $('#userRegistration').on('show.bs.modal', function () {
    	setTimeout(function() { $('#firstName').focus(); }, 500);
	});
	$('#loginBox').on('show.bs.modal', function(){
		$('#div_errorMessage').html('');
		$("#txt_username").val('').css("borderColor", "#767676");
		$("#txt_password").val('').css("borderColor", "#767676");
		setTimeout(function() { $('#txt_username').focus(); }, 500);
	});
	$("#frmLanding").submit(function(e){
		  return false;
		  $("#btn_changePwd").trigger("click");
	});
	$("#btn_changePwd").click(function(event){
		  event.preventDefault();
		  return false;
	});
   $("#signinEnterpriseButton").click(function(event){
		  event.preventDefault();
		  enterpriseClick();
	});
	loadFonts();
	$("#txt_username").focus(function(){
		homeChangedFocus = true;
	});
	var key = GetURLParameter('key');
	if(key != null && key != "") {
		$('#changePasswordBox').modal('show');
		$("#header_txt_currentPwd").attr("readonly", true);
		$("#header_txt_currentPwd").val("****");
	}
	onResize();
	$(window).resize(onResize);
});
var homeChangeFocus = false;
function showForgotPassword(){
	$("#loginBox").modal("hide");
	$("#forgetPassword").modal("show");
}
function cancel(){
	window.location = homeURL;
}
$.urlParam = function(name) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)')
			.exec(window.location.href);
	if (results != null && results.length > 0) {
		return results[1] || 0;
	}
	return 0;
};
function passwordModified(){
	isPasswordModified = true;
}

function doLogin(data){
	var tValidationErrorMessage = "";
	disableObject("#loginBox .modal-body");
	$.ajax({
		type : 'POST',
		url : "/api/user/v1/login",
		data : createDataPacket(data),
		contentType: "application/json;charset=utf-8",
		dataType : 'json',
		timeout : 20000
	}).complete(function(responseData) {
		disableObject("#loginBox .modal-body",true);
		try {
			if(responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				if(responseData.responseJSON.data.isTempPassword == 'true') {
					hideSignInPage();
					$('#changePasswordBox').modal('show');	
				} else {
					window.location = "/pages/home.jsp";
				}
			} else {
				if(responseData.responseJSON != null) {
					$('#div_errorMessage').html(responseData.responseJSON.message);
				} else {
					$('#div_errorMessage').html(translate("common.msgResponse.unknown"));
				}
			}
		} catch(error) {
			$('#div_errorMessage').html(error.message);
		}
	});
	objValidateResponse.msg = tValidationErrorMessage;
}

function login() {
	disableObject("#loginBox .modal-body",true);
	$("#div_errorMessage img").removeClass('hidden');
	if (!validateUser('txt_username')) {
		$("#div_errorMessage").html("Enter your email address.");
		$("#txt_password").css("borderColor", "#767676");
		$("#txt_username").css("borderColor", "red");
		$("#txt_username").focus();
		
	}else if(!isValidEmailAddress($("#txt_username").val())){
		$("#div_errorMessage").html("Invalid email address.");	
		$("#txt_password").css("borderColor", "#767676");
		$("#txt_username").css("borderColor", "red");
		$("#txt_username").focus();
	} else if(!validatePassword()){
		$("#div_errorMessage").html("Enter your password.");
		$("#txt_username").css("borderColor", "#767676");
		$("#txt_password").css("borderColor", "red");
		$("#txt_password").focus();
	}else {
		$("#txt_username").css("borderColor", "#767676");
		$("#txt_password").css("borderColor", "#767676");
		
		var username = $("#txt_username").val();
		var rData = {
			'userName' : username,
			'password' : $("#txt_password").val(),
			'authType':'HP-ID'
		};
		if($('#checkbox_hpp').is(':checked')){
			rData.authType = 'HP-Passport';
		}
		doLogin(rData);
	}
}


function forgetPassword() {
	$(".messages").html('');
	if (!validateUser('id_username')) {
		$(".messages").html("Enter your email address.");
		$("#forUserName span").css('color','red');
		$("#id_username").css("borderColor", "red");
		$("#id_username").focus();

	}else if(!isValidEmailAddress($("#id_username").val())){
		$(".messages").html("Invalid email address.");	
		$("#forUserName span").css('color','red');
		$("#id_username").css("borderColor", "red");
		$("#id_username").focus();
	} else {
		$("#id_username").css("borderColor", "#767676");
		$("#forUserName span").css('color','black');
		$("#id_username").html();
		var arr = {		
			'userName' : $("#id_username").val()		
		};
			$.ajax({
				type : 'POST',
				data : createDataPacket(arr),
				url : '/api/user/v1/forgetPassword',
				contentType: "application/json"
			}).complete(function(data) {
				if (data.responseJSON.httpStatusCode == 200) {
					$(".messages").html("<span class='rActive'>" + data.responseJSON.message + "</span>");
					setTimeout(function() {
							window.location = site_path;
						}, 1000);
				}else{
					$(".messages").html(data.responseJSON.message);
				}
			}).error(function(jqXHR, textStatus, errorThrown) {
				$("div.messages").html("");
				if (textStatus == 'error') {
					$("div.messages").html("Invalid user id");
					$("#forUserName span").css('color','red');
				} else if (textStatus == 'timeout') {
					$("div.messages").html("Connection timeout");

				} else if (textStatus == 'abort') {
					$("div.messages").html("Connection aborted");
				}

			});
		}
}

function goToCompansated(idDom){
	$('html, body').animate({
        scrollTop: $("#"+idDom).offset().top-$(".navbar-fixed-top").height()
    }, 500);
}

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
	return pattern.test(emailAddress);
}

function validateUser(id) {
	if ($("#"+id).val() == null || $("#"+id).val() == '') {
		return false;
	} else {
		return true;
	}
}

function validatePassword() {
	if ($("#txt_password").val() == null || $("#txt_password").val() == '') {
		return false;
	} else {
		return true;
	}
}

function userRegistration(e){
	   e.preventDefault();
	var postData = {
		'firstName' : $('#firstName').val().trim(),
		'lastName' : $('#lastName').val().trim(),
		'userName' : $('#userEmail').val().trim(),
		'adminAccess' : 'false'
	};
	$.ajax({
		type : 'POST',
		url : "./api/user/v1/add",
		data : createDataPacket(postData),
		contentType: "application/json",
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if(responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				$('.messages').html(responseData.responseJSON.message);
				setTimeout(window.location = homeURL, 1000);
			}else{
				$('.messages').html(responseData.responseJSON.message);
			}
		} catch(error) {
			$('.messages').html(error.message);
		}
	});
}

function resetPassword() {
	$("#validationErrorBox").html("");
	var currentPwd = $("#header_txt_currentPwd").val().trim();
	var newPwd = $("#header_txt_newPwd").val().trim();
	var confirmPwd = $("#header_txt_confirmPwd").val().trim();
	var key = GetURLParameter("key");
	if(key == null || key == "") {
		if (currentPwd == "") {
			$('#changePasswordBox').find("#validationErrorBox").html("Enter current password.");
			$("#header_txt_currentPwd").focus();
			return false;
		}
	}
	if (newPwd == "") {
		$('#changePasswordBox').find("#validationErrorBox").html("Enter new password.");
		$("#header_txt_newPwd").focus();
		return false;
	}
	if (newPwd.length < 6) {
		$('#changePasswordBox').find("#validationErrorBox").html("Password must contain atleast 6 characters.");
		$("#header_txt_newPwd").focus();
		return false;
	}
	if(key == null || key == "") {
		if (currentPwd == newPwd && currentPwd == confirmPwd) {
			$('#changePasswordBox').find("#validationErrorBox").html("The current and new password shouldn't be same.");
			$("#header_txt_newPwd").focus();
			return false;
		}
	}
	if(currentPwd == newPwd || currentPwd == confirmPwd) {
		$('#changePasswordBox').find("#validationErrorBox").html("Current password and new password must not be same.");
		return false;
	}
	if(newPwd != confirmPwd) {
		$('#changePasswordBox').find("#validationErrorBox").html("New password and confirm password should be same.");
		$("#header_txt_confirmPwd").focus();
		return false;
	}
	var arr = null;
	if(key == null || key == "") {
		arr = {
			"oldPassword" : currentPwd,
			"newPassword" : newPwd
		};
	} else {
		arr = {
				"userIdKey" : key,
				"newPassword" : newPwd
			};
	}
	$.ajax({
		type : 'POST',
		url : '/api/user/v1/updatePassword',
		dataType : 'json',
		contentType : "application/json;charset=utf-8",
		data : createDataPacket(arr),
		timeout : 20000,
	}).complete(function(data) {
		if (data.responseJSON != null 
				&& data.responseJSON.httpStatusCode == 200) {
			$('#changePasswordBox').modal('hide');
			window.location = "/pages/home.jsp";
		} else if (data.responseJSON != null 
				&& data.responseJSON.message != null
				&& data.responseJSON.message.length > 0) {
			$('#changePasswordBox').find("#validationErrorBox").html(data.responseJSON.message);
		} else {
			$('#changePasswordBox').find("#validationErrorBox").html("Failed to update password.");
		}
	});
}

function hideSignInPage(){
	$('#loginBox').modal('hide');
}
function errorMassage(){
	$('#div_errorMessage').html('This feature is not implemented');
	setInterval(function(){$('#div_errorMessage').html('');}, 2000);
}
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function headerColor(){
	$('.top-buffer.col-md-3.col-sm-6, .top-buffer.col-md-4.col-sm-6').mouseover(function(){
	    $(this).find('.pricingBloc h3').css('background-color','#4FAFC2');
	    $(this).find('.pricingBloc h2').css('background-color','#000000');
});
$('.top-buffer.col-md-3.col-sm-6, .top-buffer.col-md-4.col-sm-6').mouseout(function(){
	     $(this).find('.pricingBloc h3').css('background-color', '#777777');
	     $(this).find('.pricingBloc h2').css('background-color','#555555');
});
}

/**
 * Fix for chromes issue with custom fonts. After trying several things This is the only one that works consistently. 
 * */
function loadFonts(){
	if(true && navigator.userAgent.indexOf('WebKit') > -1){
		$.ajax({
		    url: site_path+"bootstrap3/css/fonts.css",
		    beforeSend: function ( xhr ) {
		      xhr.overrideMimeType("application/octet-stream");
		    },
		    success: function(data) {
		      $("<link />", {
		        'rel': 'stylesheet'
		        ,'href': site_path+"bootstrap3/css/fonts.css"
		      }).appendTo('head');
		    }
		  });
		
	}
}
function onResize(event){
	footerAdjuster.adjust();
}