/**global $:false, jQuery:false, objGrid:true, document:false, window:false, objActionMapper:true, objMode:true, getPageStatusData:true,
 loadNav:true, showUrlNotification:true, objUrlParam:true, boxSelected:true, setActionMode:true, searchCommon:true, loadUserTable:true,
 activateGrid:true, getEncodedNotification:true, getSelectedRowIds:true, getSelectedIds:true, updateUserStatus:true, translate:false,
 clsCheckAll:true, deleteRecordInfo:true, getSearchData:true, objNotification:true, showNotification:true, updateStatus:true,
 loadGridView:true, loadTableView:true,  drawPaginator:true, setPageStatusData:true, typeAheadTriggerLimit:true, validateResponse:true,
 processAutocompleteData:true, addDeviceNames:true, addProfileImage:true, addCheckbox:true , getStatus:true , getUserName:true , getDeviceDetails:true,
 getName:true, shortenName:true */
/**
 * This has functions that are required on each page but are not used often; such as logout, changePassword
 * , get notification data, remove cookie etc.
 * */
/*global $:false, jQuery:false */


/**
 * Fix for chromes issue with custom fonts. After trying several things This is the only one that works consistently.
 * */
function loadFonts() {
	if (true && navigator.userAgent.indexOf('WebKit') > -1) {
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

/** thead replacer
 * This method will hide thead and replace it with a fixed div with similar design and content
 * */
function fixThead(selector){
	var obj = $(selector);
	if($('#mirror_'+obj.attr("id")).length >= 1){
		$('#mirror_'+obj.attr("id")).remove();
		fixThead(selector);
	}else{
		var wrapper = obj.parent();
		wrapper.css("position","relative");
		var tHead = $(selector+" thead:first");
		var mirror = '<table class="thead_mirror table hidden" id="mirror_'+obj.attr("id")+'"><thead>'+tHead.html()+'</thead><tbody></tbody></table>';
		wrapper.parent().prepend(mirror);
		wrapper.parent().css("position","relative");
		adjustThead(obj);
		tHead.css("visibility","hidden");
		$("#mirror_"+obj.attr("id")).removeClass("hidden");
		obj.resize(adjustThead);
		adjustThead(obj);
	}
}

function adjustThead(obj){
	if(obj.type == "change" || obj.type == "resize"){
		obj = $(obj.target);
	}
	var tHead = obj.find(" thead:first");
	var mirrorTds = $("#mirror_"+obj.attr("id")+">thead th");
	$.each(tHead.find("th"),function(ind,val){
		$(mirrorTds[ind]).css("width",$(val).width()+16);
	});
	if(obj.parent().height() < obj.parent()[0].scrollHeight){
		$("#mirror_"+obj.attr("id")).addClass("compansate_scrollbar");
	}else{
		$("#mirror_"+obj.attr("id")).removeClass("compansate_scrollbar");
	}
}

/*
 * This method will be used to create Hash in the desired format.
*/
function calcHmac(message,  secretKey) {
		console.log(message); //just for debugging, helps to check hmac verification. will remove later.
		var hash = CryptoJS.HmacSHA256(message, secretKey);
		var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
		return hashInBase64;
	}
var clientVersion = 'WEB 1.0';
/*
 * This method will be stored to complete data packet.
 */

function createDataPacket(packetData) {
	return JSON.stringify({ 'data': packetData});
}
/**
 * Returns an object with session auth data. if no data is found the default variables are set instead.
 * */
function getSessionData() {
	var objSnData = {};
	objSnData.clientVersion = localStorage.auth_clientVersion ? localStorage.auth_clientVersion : 'WEB 1.0';
	objSnData.sessionId = localStorage.auth_sessionId ? localStorage.auth_sessionId :0;
	objSnData.secretKey = localStorage.auth_sessionSecret ? localStorage.auth_sessionSecret : "";
	return objSnData;
}

function disableObject(selector,enable, isMultiple){
	var obj;
	if(isMultiple){
		obj = $(selector);
	}else{
		obj = $(selector+":first");
	}
	obj.css("position","relative");
	if(enable){
		obj.find("div.disable_overlay").remove();
	}else{
		$.each(obj,function(ind, objT){
			if($(objT).find(">div.disable_overlay").length <= 0)
				obj.prepend('<div class="disable_overlay"><span></span></div>');
		});
	}
}

function logout() {
    if(navigator.onLine == false){
    	showError('Unable to connect to the Internet');
    } else {
    	$.ajax({
            type : 'POST',
            url : '/api/user/v1/logout',
            complete : function(data) {
            	if(validateResponse(data)){
                    removeCookiesLogged();
                    $.each(localStorage,function(ind,val){
                    	if(ind.indexOf("auth_") > -1){
                    		localStorage.removeItem(ind);
                    	}
                     });
                    window.location = homeURL;
            	}
            },
    	timeout: 10000
    });
    }
    window.sessionStorage.clear();
}

function isValid(value,defVal,type ){
	if(typeof type =='undefined' || type==null){
		type = 'object';
	}
	if(typeof value == type && value != null){
		return value;
	}else{
		return defVal;
	}

}
function getDeviceModels(onSuccess) {
	var getList = false;
	targetGroupId = currentGroupId;
	if(onSuccess.type == "change"){
		targetGroupId = $(onSuccess.target).val();
		$("select#header_select_device_model").html("");
		getList = true;
		disableObject("#modal_changeDeviceModel div.modal-body");
	}
	$.ajax({
		type : 'GET',
		url : "/api/model/v1/models?groupId=" + targetGroupId,
		contentType : "application/json",
		dataType : 'json'
	}).complete(function(data) {
		var modelId = '';
		try {
			if (data.responseJSON != null
					&& data.responseJSON.httpStatusCode == 200) {
				//Create Empty li
				if($("#lnkNavbarChangeModel").length <= 0){
					$("li#tn_bell").before(strLiChangeModel);
				}
				$('[id^=device_] ul').empty();
				if(!data.responseJSON.data.length){
					$("select#header_select_device_model").append('<option value="">No Model Assigned</option>');
				} else{
					var flag = false;
					$.each(data.responseJSON.data, function(index,value){
						$("select#header_select_device_model").append('<option value="'+value.modelId+'">'+value.deviceModel+'</option>');
						if(currentModelId == value.modelId && !getList) {
							modelId = currentModelId;
							$("#current_device_model").html(value.deviceModel);
							currentDeviceModel = value.deviceModel;
							$("#header_prefModelName").html(currentGroupName+'/'+currentDeviceModel);
							$("select#header_select_device_model option[value="+value.modelId+"]").prop("selected",true);
							flag = true;
						}
						$('[id^=device_] ul').append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" modal-name="'+value.deviceModel+'" data-id="'+value.modelId+'">' + value.deviceModel + '</a></li>');
					});
					if(!flag && !getList) {
						currentDeviceModel = data.responseJSON.data[0].deviceModel;
						$("#header_prefModelName").html(currentGroupName+'/'+currentDeviceModel);
						$('#selectModel').html(currentDeviceModel);
						$("select#header_select_device_model option[value="+currentDeviceModel+"]").prop("selected",true);
						$("#current_device_model").html(currentDeviceModel);
						modelId = data.responseJSON.data[0].modelId;
						switchModel(modelId);
					}
					if(!getList){
						changeModelType();
					}
					//call drawGraphs function
					if (typeof onSuccess == "function"){
						onSuccess(modelId, targetGroupId);
					}
				}
			} else {
				$('.notification_error').html(
						data.responseJSON.message);
			}
		} catch (error) {
			$('.notification_error').html(error.message);
		}
		if(getList){
			disableObject("#modal_changeDeviceModel div.modal-body",true);
		}
	});
}
function changeModelType(){
	$('.model-dropdown-menu li a[role="menuitem"]').click(function(){
		if(typeof $(this).attr('function-name') != 'undefined'){
			$('#select-function').html($(this).attr('function-name'));
//			if($(this).attr('function-name')=='Deviation'){
//				$('#idealTime').closest('.row').removeClass('hidden');
//			}
//			else{
//				$('#idealTime').closest('.row').addClass('hidden');
//			}
		}else if(typeof $(this).attr('unit-name') != 'undefined'){
			$(this).parents('ul').siblings('button').find('span:first').html($(this).attr('unit-name'));
		}else{
			var modelId = $(this).data('id');
			$('#selectModel').html($(this).attr('modal-name'));
			drawGraphs(modelId,currentGroupId);
			switchModel(modelId);
			if(objMode.nav.selected_tab == 'userDefinedAnalytics')
				getcustomGraphsId();
		}
	});
}
function drawGraphs(modelId,groupId){

}
window.onresize = function(){footerAdjuster.adjust();};
footerAdjuster = {};
footerAdjuster.initialized = false;
footerAdjuster.offset = 65;
footerAdjuster.adjust = (function(){
	var w_height = window.innerHeight;
	var footer_height = $("footer#copyright").height();
	var s_height = $(body).height()+footer_height+footerAdjuster.offset;
	if(!footerAdjuster.initialized){
		footerAdjuster.initialized = true;
		if($("div.navbar#actionNavbar").length >1){
			$("body").addClass("has_actionNavbar");
			$("div.navbar#actionNavbar:last").addClass("footer");
			footerAdjuster.target = $("footer#copyright,div.navbar#actionNavbar:last");
		}else{
			footerAdjuster.target = $("footer#copyright");
		}
	}
	if (s_height > w_height) {
		footerAdjuster.target.css("position","absolute");
	}else{
		footerAdjuster.target.css("position","fixed");
	}
});
$.escape = (function(text){
	return text;
});

function getPageStatusData(pageId){
	if(typeof pageId =='undefined') {
		if(typeof objActionMapper.pageId =='undefined') {
			pageId = objActionMapper.pageName;
		} else {
			pageId = objActionMapper.pageId;
		}
	}
	//Iterate through localSessionStorage and remove data that is not common or from the current tab
	//Common Data is identified by prefix `common_data_`
	$.each(window.sessionStorage,function(index,value){
		if(index.indexOf("page_data_"+objMode.nav.selected+"_") == -1 && index.indexOf("common_data_") == -1){
			delete window.sessionStorage[index];
		}
	});
	var strCkPageData = window.sessionStorage["page_data_"+objMode.nav.selected];
	if(typeof strCkPageData !='undefined'){
		objCkPageData = JSON.parse(strCkPageData);
		if(typeof objCkPageData == 'object'){
			objGrid =  $.extend({}, objGrid, objCkPageData);
			setSearchData();
		}
	}
	return objGrid;
}

var floatingScrollbarActivated = false;
var objScrollbarMirror;
function activateFloatingScrollBar(){
//	$($(".scroll-float-container")[0]).remove();
	if(!floatingScrollbarActivated){
		objScrollbarMirror =  $(".table-responsive").closest(".container");
		floatingScrollbarActivated = true;
		$(".scroll-float").width($(".table-responsive > table").width());
		$(".scroll-float-container").width($(".table-responsive ").width());
		$(".scroll-float-container").css("left",($(window).width()-objScrollbarMirror.width())/2);
		$(".table-responsive").scroll(function(){
	        $(".scroll-float-container").scrollLeft($(".table-responsive").scrollLeft());
	    });
	    $(".scroll-float-container").scroll(function(){
	    	$(".table-responsive").scrollLeft($(".scroll-float-container").scrollLeft());
	    });
	    $(window).scroll(function(){
	    	adjustFloatingScroll();
	    });
	    $(window).resize(function(){
	    	if($(".table-responsive tr").length > 1){
	    		$(".scroll-float").width($(".table-responsive > table").width());
	    		$(".scroll-float-container").width($(".table-responsive ").width());
	    		$(".scroll-float-container").css("left",($(window).width()-objScrollbarMirror.width())/2);
	    	}
	    });
	}
}

function isScrolledIntoView(elem)
{
	if(typeof $(elem).offset() == 'undefined'){
		return true;
	}
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + window.innerHeight;

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
       );//&& (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop)
}

function adjustFloatingScroll(){
	if(($(".table-responsive").width() >= $(".table-responsive table").width())
			|| isScrolledIntoView($(".table-responsive tr:last"))
			|| !isScrolledIntoView($(".table-responsive tbody"))
	){
		$(".scroll-float-container").hide();
	}else{
		$(".scroll-float-container").show();
	}
}

function setPageStatusData(pageId) {
	if(typeof pageId !='string') {
		if(typeof objActionMapper.pageId =='undefined') {
			pageId = objActionMapper.pageName;
		} else {
			pageId = objActionMapper.pageId;
		}
	}
	objGrid.searchData =  getSearchData();
	objGrid.searchString = $("#searchCommon").val();
	var tmp = objGrid;
	window.sessionStorage["page_data_"+objMode.nav.selected] = JSON.stringify(tmp);
}

function removeCookiesNav(){

    $.removeCookie("tNav_NOTIFICATIONS",{path:site_path});
    $.removeCookie("tNav_ACTIONS",{path:site_path});
    $.removeCookie("setActionRequiredData",{path:site_path});
}

function removeCookiesLogged(){
     removeCookiesNav();
     $.removeCookie("isAdmin",{path:site_path});
     $.removeCookie("justLoggedIn",{path:site_path});
     $.removeCookie("setActionRequiredData",{path:site_path});
}

function updatePassword() {
	var t = frmErrorDiv.ident;
	frmErrorDiv.ident = "#validationErrorBox";
	$("#validationErrorBox").html("");
	$('#changePasswordBox').find("#validationErrorBox").html("");
	if(navigator.onLine == false){
    	 t1 = 	objNotification.containerId;
		objNotification.containerId = $("#validationErrorBox");
    	showError('Unable to connect to the Internet');
    	objNotification.containerId = t1;
    }else{
        if($(".frmChangePassword").valid()){
        	var currentPwd = $("#header_txt_currentPwd").val();
        	var newPwd = $("#header_txt_newPwd").val();
        	var confirmPwd = $("#header_txt_confirmPwd").val();
        	if(currentPwd == newPwd || currentPwd == confirmPwd) {
        		$('#changePasswordBox').find("#validationErrorBox").html(translate("common.notification.error.match_password"));
        	}else{
        	var email = userEmail;
        	var arr = {
        		"oldPassword" : currentPwd,
        		"newPassword" : newPwd
        	};
        	$.ajax({
        		type : 'POST',
        		url : '/api/user/v1/updatePassword',
        		dataType : 'json',
        		contentType : "application/json;charset=utf-8",
        		data : createDataPacket(arr)
        	}).complete(
                function(data) {
            		if (data.responseJSON != null) {
	                    if (data.responseJSON.httpStatusCode == 200) {
	                        objNotification.success = translate("common.notification.success_pw_update");
	                        showNotification();
	                        closePasswordPopover();
	                    } else {
	                        $('#changePasswordBox').find("#validationErrorBox").html(getValidationErrorMessage(data));
	                    }
            		}
                	frmErrorDiv.onfocusout = false;
                	navPwValidator = frmValidate($(".frmChangePassword"));
                	frmErrorDiv.onfocusout = true;
            });
        }
    }else{
    	frmErrorDiv.onfocusout = false;
    	navPwValidator = frmValidate($(".frmChangePassword"));
    	frmErrorDiv.onfocusout = true;
    }
   }
	frmErrorDiv.ident = t;
}

function closePasswordPopover() {
	$('.notification_error').delay(2000).css("visibility","visible");
    $('#changePasswordBox').modal('hide');
}

var objPendingNotifications = objActionRequired = [];
function setNotificationData(objNd){
    objPendingNotifications = objNd.notificationList;
}

var drawnavbarNotification = false;
function getNotificationData(notificationType, limit, page, strSearch,
		targetFunction) {
	if (typeof limit == 'undefined') {
		limit = 5;
	}
	if (typeof notificationType == 'undefined') {
		notificationType = "NOTIFICATIONS";
	}
	if (typeof page == 'undefined') {
		page = 1;
	}
	if (typeof strSearch == 'undefined') {
		strSearch = "";
	}
	pageNumber = page.toString();
	var objDataToSend = {
		"rows" : limit.toString(),
		"page" : pageNumber,
		"usePagination" : "true",
		"notificationType" : notificationType,
		"searchString" : $(".searchCommon").val()?$(".searchCommon").val().trim():""
	};
	var dataToSend = createDataPacket(objDataToSend);

	$.ajax({
		type : 'POST',
		url : '/api/user/v1/notifications',
		contentType : "application/json",
		dataType : 'json',
		data : dataToSend
	}).complete(function(data) {
		if (validateResponse(data)) {
			data = data.responseJSON;
			if (typeof data.list != "undefined") {
				notificationData.page = page;
				notificationData.total = data.total;
				notificationData.notificationType = notificationType;
				notificationData.limit = limit;
				notificationData.targetFunction = targetFunction;
				window[targetFunction](data);
				if(drawnavbarNotification) {
					$("#notificationDropdownId").click();
				}
			} else {
				return validateResponse(data);
			}
		}
	});
}

function setActionRequiredData(objRd){
	var objTmp = $('[onclick="drawNavbarActionRequired()"]');
    objActionRequired = objRd.list;
    if(typeof objTmp.find(".badge.danger")[0] != 'undefined'){
      	objTmp.find(".badge.danger").remove();
    }
    if(objRd.total > 0){
    	objTmp.append('<span class="badge danger bubble">' + objRd.total + '</span>');
    } else {
    	getNotificationData("NOTIFICATIONS",notificationData.limit,notificationData.page,"","setNotificationData");
    }
}

var navNotificationLimit = 3;
function drawNavbarNotification() {
	$("#navbarNotificationsDropdown").html("");
	var strNotification = '';
	if (!$.isEmptyObject(objPendingNotifications)) {
		if(notificationData.page > 1) {
			strNotification += '<li class="list-group-item text-center"><span class="btn btn-primary" onclick="getPreviousNotifications();">'+translate("common.notification.previous")+'</span></li>';
		}
		$.each(objPendingNotifications,function(index, value) {
			if(index <= 4){
				strNotification += '<li class="list-group-item"><div>'
					+ value.message + '</div>';
				strNotification += '<div><span class="">'
		            + $.getTimeDiff(value.createdTs)
		            + ' '+translate("common.notification.ago")+'</span></div></li>';
			//<span title="Mark as Read" data_status="DELETE" data_n_type="NOTIFICATIONS" data_type="'+value.type+'" data_id="'+value.id+'" class="glyphicon updateNotification pull-right glyphicon-remove-circle" ></span>

			}
		});
		if(objPendingNotifications.length){
			if(notificationData.page * notificationData.limit < notificationData.total)
				strNotification += '<li class="list-group-item text-center"><span class="btn btn-primary" onclick="getNextNotifications();">&nbsp;&nbsp;'+translate("common.notification.next")+'&nbsp;&nbsp;</span></li>';
		}
		else{
			strNotification += '<li class="list-group-item text-center disabledLnk"><a href="#">'+translate("common.notification.no_messages")+'</a></li>';
		}
	}

	$("#navbarNotificationsDropdown").html(strNotification);
    $(".updateNotification").unbind("click");
    $(".updateNotification").click(function(){
        msgUpdateNotification = translate("common.notification.success_delete_notification");
        msgUpdateNotificationError  = translate("common.notification.error_delete_notification");
       updateNotification($(this));
    });
}

var notificationData = {};
notificationData.limit = 5;
notificationData.page = 1;
function getNextNotifications() {
	getNotificationData(notificationData.notificationType, notificationData.limit, (notificationData.page + 1), "",
			notificationData.targetFunction);
	drawnavbarNotification = true;

}

function getPreviousNotifications() {
	getNotificationData(notificationData.notificationType, notificationData.limit, (notificationData.page - 1), "",
			notificationData.targetFunction);
	drawnavbarNotification = true;
}
function drawNavbarActionRequired() {
	drawnavbarNotification = false;
	$("#navbarActionRequiredDropdown").html("");
	var strNotification = '';
	if (!$.isEmptyObject(objActionRequired)) {
		if(notificationData.page > 1) {
			strNotification += '<li class="list-group-item text-center"><span class="btn btn-primary" onclick="getPreviousNotifications();">'+translate("common.notification.previous")+'</span></li>';
		}
		var t = objUrlParam;
		$.each(objActionRequired,function(index, value) {
			if(index <= 4){
				strNotification += '<li class="list-group-item"><div>'
						+ value.message + '</div>';
				strNotification += '<div><span class="">'
						+ $.getTimeDiff(value.updatedTs)
						+ ' '+translate("common.notification.ago")+'</span>';
				if(value.type =='DEVICE_DEBUG_LOG'){
					objUrlParam = {"id":value.typeID};
					var tHref = "\BugReport?"+getEncodedNotification();
					strNotification +='<span title="'+translate("common.view")+'" data_status="VIEWED" data_n_type="ACTIONS_REQD" data_type="'+value.objectType + '" data_redirect="'+tHref+'"  data_id="' + value.notificationId + '" class="glyphicon updateNotification pull-right glyphicon-eye-open"></span>';
				} else {
					strNotification += '<span title="'+translate("common.notification.approve") + '" data_status="APPROVE" data_n_type="ACTIONS" data_type="' + value.objectType + '" data_id="' + value.notificationId + '" class="glyphicon updateNotification btn btn-primary btn-xs pull-right glyphicon-ok cursor_pointer" ></span>'
                    + ' <span data_status="DELETE" data_n_type="ACTIONS_REQD" data_type="' + value.objectType + '" data_id="' + value.notificationId + '" title="'+translate("common.notification.deny")+'" class="glyphicon pull-right updateNotification btn btn-danger btn-xs glyphicon-remove cursor_pointer margin_right_5px" ></span></div></li>';
				}

			}
		});
		objUrlParam = t;
		if(objActionRequired.length){
			if(notificationData.page * notificationData.limit < notificationData.total)
				strNotification += '<li class="list-group-item text-center"><span class="btn btn-primary" onclick="getNextNotifications();">&nbsp;&nbsp;'+translate("common.notification.next")+'&nbsp;&nbsp;</span></li>';
		}
		else{
			strNotification += '<li class="list-group-item text-center disabledLnk"><a href="#">'+translate("common.notification.no_alerts")+'</a></li>';
		}
	}

	$("#navbarActionRequiredDropdown").html(strNotification);
    $(".updateNotification").unbind("click");
    $(".updateNotification").click(function(){
       updateNotification($(this));
    });
}

function updateNotification(obj, fnTarget) {
	if (obj.target) {
		obj = obj.target;
	}
	var ids = $(obj).attr('data_id');
	var type = $(obj).attr('data_type');
	var status = $(obj).attr('data_status');
	var reqData = {
		"notificationId" : ids,
		"action" : status
	};
	var strData = createDataPacket(reqData);
	var strRedirect = $(obj).attr('data_redirect') ? $(obj).attr(
			'data_redirect') : "";
	if (typeof fnTarget != 'string') {
		fnTarget = $(obj).attr('data_target');
	}
	if (ids) {
		$.ajax({
			type : "POST",
			url : "/api/user/v1/approveNotification",
			dataType : 'json',
			data : strData,
			contentType : "application/json"
		}).complete( function(data) {
			if (validateResponse(data)) {
				objNotification.success = getValidationErrorMessage(data);
				if (typeof fnTarget == 'string') {
					showNotification();
					return window[fnTarget](1);
				} else if (typeof strRedirect == 'string') {
					window.location = strRedirect;
					return;
				}
				if ($(obj).attr('data_n_type') == 'NOTIFICATIONS') {
					$.removeCookie("tNav_NOTIFICATIONS", { path : site_path });
					getNotificationData("NOTIFICATIONS", notificationData.limit, notificationData.page, "", "setNotificationData");
				} else if ($(obj).attr('data_n_type') == 'ACTIONS_REQD') {
					$.removeCookie("tNav_ACTIONS", { path : site_path });
					$.removeCookie("tNav_NOTIFICATIONS", { path : site_path });
					getNotificationData("ACTIONS_REQD", notificationData.limit, notificationData.page, "", "setActionRequiredData");
				}
			} else {
				window.location = strRedirect;
				return;
			}
			showNotification();
		});
	}

}

//Feature is not implemented
var msgInvalidOperation = translate("common.notification.not_implemented");
function invalidOperation() {
	objNotification.error = msgInvalidOperation;
	showNotification();
}
//End: Feature is not implemented

var deviceModelList = {
		"HP Slate 7" : "/slate_seven.png",
		"HP Slate 8 Pro" : "/slate_eight.png",
		"HP Slate 10 HD" : "/slate_ten.png",
		"Galaxy Nexus" : "/galaxy_nexus.png",
		"Nexus S" : "/nexus_s.png",
		"Nexus One" : "/nexus_one.png",
		"Nexus 4" : "/nexus_four.png",
		"Nexus 5" : "/nexus_five.png",
		"Nexus 7" : "/nexus_seven.png",
		"Nexus 10" : "/nexus_ten.png"
};

function getDeviceImage(deviceModel) {
	if(deviceModelList[deviceModel] != null && deviceModelList[deviceModel] != "") {
		return imagesCdnPath + deviceModelList[deviceModel];
	}
	return imagesCdnPath + '/device.png';
}


//Validate Response

var objValidateResponse = {};
objValidateResponse.msg = {"200":{"txt":translate("common.msgResponse.200"),"rtrn":true},"0":{"txt":translate("common.msgResponse.0"),"rtrn":false},"404":{"txt":translate("common.msgResponse.404"),"rtrn":false}};
$.extend(objValidateResponse.msg, {"201":{"txt":translate("common.msgResponse.201"),"rtrn":true},"400":{"txt":translate("common.msgResponse.400"),"rtrn":false},"401":{"txt":translate("common.msgResponse.401"),"rtrn":false}});
$.extend(objValidateResponse.msg, {"405":{"txt":translate("common.msgResponse.405"),"rtrn":false}});
$.extend(objValidateResponse.msg, {"500":{"txt":translate("common.msgResponse.500"),"rtrn":false},"501":{"txt":translate("common.msgResponse.501"),"rtrn":false},"504":{"txt":translate("common.msgResponse.504"),"rtrn":false}});
function validateResponse(data){
	if(!$.isEmptyObject(data.responseJSON)){
		var dataJ = data.responseJSON;
		//Creating an array of status codes for which we need to logout. This will be useful once more http codes come in.
		//406 is PAYLOAD_TIME_INVALID
		//407 is HMAC_FAILED
		//408 is INVALID_CLIENT_VERSION
		var httpStatusCodeArrayForLogout = new Array(406,407,408);
		if($.inArray(dataJ.httpStatusCode, httpStatusCodeArrayForLogout) > -1 ){
			logout();
		}
		if(dataJ.httpStatusCode){
			if(!$.isEmptyObject(objValidateResponse.msg[dataJ.httpStatusCode])){
				if(!objValidateResponse.msg[dataJ.httpStatusCode].rtrn){
					objNotification.error = getValidationErrorMessage(data);
					showNotification();
					return objValidateResponse.msg[dataJ.httpStatusCode].rtrn;
				}else{
					objValidateResponse.msg[dataJ.httpStatusCode].rtrn;
				}
			}else if(dataJ.opStatus.length && dataJ.opStatus !='SUCCESS'){
				objNotification.error = dataJ.message;
				showNotification();
				return false;
			}
		} else if(typeof dataJ.status != 'undefined') {
			return dataJ.status;
		}
	}

	// IF the data itself has an invalid response code there is unlikely to be a json in it
	if(typeof data.httpStatusCode != 'undefined'){
		data.status = data.httpStatusCode;
	}

	//If there is no responseJSON check the data itself.
	if((data.status||data.status=='0') && !$.isEmptyObject(objValidateResponse.msg[data.status])){
		if(!objValidateResponse.msg[data.status].rtrn){
			// If off-line show the error else assume that the request has been cancelled and no notification is required
			if(!navigator.onLine || data.statusText =="timeout" || data.status != 0){
				if(validateStr(data.message)){
					objNotification.error = data.message;
				}else{
					objNotification.error = objValidateResponse.msg[data.status].txt;
				}
				showNotification();
			}
			return objValidateResponse.msg[data.status].rtrn;
		}
	}

	return true;
}

function getValidationErrorMessage(data){
	var dataJ = data.responseJSON;
	if(typeof dataJ !="undefined"){
	    if(validateStr(dataJ.message) ){
	        if(dataJ.message.length > 0){
	            return dataJ.message;
	        }
	    }else if(validateStr(dataJ.eventLogMessage)){
	        if(dataJ.eventLogMessage.length > 0){
	            return dataJ.eventLogMessage;
	        }
	    }
	}else{
		if(data.status=="0" && data.statusText=="abort"){
			return "Request Aborted!";
		}else{
	        return objValidateResponse.msg[data.status].txt;
		}
	}
}

//End: Validate Response

function validateStr(varStr){
	if(typeof varStr!= 'undefined'){
		if(varStr != null){
			if(varStr.length){
				return true;
			}
		}
	}
	return false;
}

function getFormData(objForm){
	var objReturn = {};
	var objInputs = objForm.find('input:visible:not(.ignore),select:visible:not(.ignore),textarea:visible:not(.ignore)');
	$.each(objInputs,function(index,value){
		var objInput = $(value);
		var index = objInput.attr('name');
		if(typeof index !='undefined' && index.length > 0){
			if(objInput.is("select") && objInput.hasClass('phoneCode')){
				var phN = '';
				if(objInput.parent().parent().find("input:text").val().length > 0){
					phN = objInput.val()+"-"+objInput.parent().parent().find("input:text").val();

				}
				objReturn[index] = phN;
			}else if(objInput.is(":checkbox") || objInput.is(":radio")){
                            if(objInput.hasClass("chkTrigger")){
                                if(objInput.is(":checked")){
                                	if(objForm.find(".chkTarget."+objInput.attr("name")).attr("name").length){
                                		objReturn[index] = true;//"true";
                                	}else{
                                        objReturn[index] = objForm.find(".chkTarget."+objInput.attr("name")).val();
                                	}
                                }else{
                                    objReturn[index] = false; // "false";
                                }
                            }else{
                            	if(objInput.is(":checkbox")){
	                                if(objInput.is(":checked") && !objInput.hasClass("disabled") ){
	                                        objReturn[index] = objInput.hasClass("valInvert")?	false: true;	//"false":"true";
	                                }else{
	                                	   	objReturn[index] = objInput.hasClass("valInvert")?true:false;
	                                }
                            	}else{
                            		if(objInput.is(":checked") && !objInput.hasClass("disabled") ){
                            			objReturn[index] = objInput.val();
                            		}
                            	}
                            }
			}else if(objInput.is(":text") || objInput.is(":password") || objInput.is("select") || objInput.attr('type')=='email' ){
				if(objInput.hasClass("txt_group")){
					if(objInput.val()){
						if(objReturn[index] == null || !(typeof objReturn[index] =='object')){
							objReturn[index] = [];
						}
						objReturn[index].push(objInput.val());
					}
				}else{
					objReturn[index] = objInput.val();
				}
			}else if(objInput.is("textarea")){
				objReturn[index] = objInput.html();
			}
		}
	});
	return objReturn;
}


function loadJS(src, callback) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onreadystatechange = s.onload = function() {
        var state = s.readyState;
        if (!callback.done && (!state || /loaded|complete/.test(state))) {
            callback.done = true;
            callback();
        }
    };
    document.getElementsByTagName('head')[0].appendChild(s);
}

function loadCSS(src, callback) {
    var s = document.createElement('link');
    s.href = src;
    s.rel = "stylesheet";
    s.async = true;
    s.onreadystatechange = s.onload = function() {
        var state = s.readyState;
        if (!callback.done && (!state || /loaded|complete/.test(state))) {
            callback.done = true;
            callback();
        }
    };
    document.getElementsByTagName('head')[0].appendChild(s);
}

function loadFormData(objFrm,objData){
	if(typeof objData == 'object'){
		$.each(objData,function(index,value){
			var objInput = objFrm.find("[name='"+index+"']");
			if(value && value !="false"){
				if(objInput.is(":checkbox") || objInput.is(":radio")){
					if(objInput.hasClass('chkTrigger')){
                        if(value){
                            objInput.prop('checked','true');
                            objFrm.find(".chkTarget."+objInput.attr("name")).val(value);
                            objInput.trigger('change');
                        }
                    }else{
                    	if(!objInput.hasClass("valInvert")){
							if(objInput.is(":checkbox")){
								objInput.prop('checked','true');
								objInput.trigger('change');
							}else{
								$("[name="+objInput[0].name+"][value="+objData.SEPolicy+"]").prop("checked",true)
							}
                    	}
                    }
				}else if(objInput.is(":text") || objInput.is(":password") || objInput.is("select")  || objInput.attr('type')=='email'){
					if(objInput.hasClass("txt_group")) {
						var objItem =  $(".txt_group_item");
						var objParent = objItem.parent();
						if(value != null && value.length > 0) {
							objParent.find(".txt_group:last").val(value[0]);
							var objItemHtml = "";
							for(var i = 1; i <value.length; i++) {
								objTarget = objParent.find(".glyphicon-plus");
								if(objItemHtml == "") {
									objItemHtml = objParent.html();
								}
								objParent.append(objItemHtml);
								objParent.find(".txt_group:last").val(value[i]);
								objTarget.removeClass("glyphicon-plus");
								objTarget.addClass("glyphicon-remove");
							}
						}
					} else if(objInput.hasClass("phoneCode")){
						var arrN = value.split('-');
						objInput.val(arrN[0]);
						objInput.parent().parent().find("input:text").val(arrN[1]);
					}else{
						objInput.val(value);
						objInput.trigger('change');
					}
					objInput.trigger('change');
				}else if(objInput.is("textarea")){
					objInput.html(value);
					objInput.trigger('change');
				}
			}else if(objInput.hasClass("valInvert")){
				objInput.prop('checked','true');
				objInput.trigger('change');
			}

		});
	}
}



var objSorter = {"index":"id"};
function customObjectSorter(a,b){
	var aName = a[objSorter.index].toLowerCase();
	var bName = b[objSorter.index].toLowerCase();
	return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

//Searches the object array `arrC` for value matching obj iVal on index `index` and returns the position
//where the new value can be inserted withour disrupting the order
function getBinaryInsertIndex(arrC,iVal,index){
	if(arrC.length ==0){
		return 0;
	}
	var first = 0;
	var last = arrC.length-1;
	if(first==last){

	}
	var rIndex = first;
	var v = iVal[index].toLowerCase();
	var vF = arrC[first][index].toLowerCase();
	var vL =  arrC[last][index].toLowerCase();
	var order = 'asc';
	// If collection is in decending order flip the first and last
	if(vF > vL){
		first = last;
		last = 0;
		order = 'desc';
	}
	if(first == last){
		if(vF >= v){
			return 0;
		}else{
			return 1;
		}
	}
	while(last > first){
		vF = arrC[first][index].toLowerCase();;
		vL =  arrC[last][index].toLowerCase();;
		if(vF >= v){
			last = first;
			return first+1;
		}else if(vL < v){
			first = last;
			return first+1;
		}else if((last-first) > 1){

			middle = Math.ceil((last+first)/2);
			var vM = arrC[middle][index].toLowerCase();
			if(vM > v){
				last = middle;
			}else if(vM < v){
				first = middle;
			}else{
				return last = first =middle+1;
			}
		}else{
			return last = first+1;
		}
	}

}
function getDecimalValue(i) {
	return Math.floor(i / 10) + "" + i % 10;
}

function trunc (i){
	var j = Math.round(i * 100);
	j =  Math.floor(j / 100) + (j % 100 > 0 ? "." + getDecimalValue(j % 100) : "");
	return Math.round(j);
}

function getCreatedTime(d1) {
	if(typeof d1 =='string' ||typeof d1 =='number'){
		d1 = new Date(parseInt(d1));
	}
	var d2 = new Date();
	var sec = d2.getTime() - d1.getTime();
	var second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour, month = day * 30, year = day * 365;
	sec = (sec % year);
	var m = Math.floor(sec / month);
	sec = (sec % month);
	var d = Math.floor(sec / day);
	sec = (sec % day);
	var hrs = Math.floor(sec / hour);
	sec = (sec % hour);
	var min = Math.floor(sec / minute);

	var y = d2.getFullYear() - d1.getFullYear();
	var strMessage = "";

	var count = 0;

	if(y == 1) {
		strMessage = y + " "+translate('time.year');
		count ++;
	} else if(y > 1) {
		strMessage =  y + " "+translate('time.years');
		count ++;
	}
	if(m == 1) {
		strMessage = strMessage+ " " + m + " "+translate('time.month');
		count ++;
	} else if(m > 1) {
		strMessage = strMessage+ " " + m + " "+translate('time.months');
		count ++;
	}
	if(count == 2){
		return strMessage.length?strMessage + " "+translate('time.ago'):translate('time.Now');
	}
	if(d == 1) {
		strMessage = strMessage+ " " + d + " "+translate('time.day');
		count ++;
	} else if(d > 1) {
		strMessage = strMessage+ " " + d + " "+translate('time.days');
		count ++;
	}

	if(count == 2){
		return strMessage.length?strMessage + " "+translate('time.ago'):translate('time.Now');
	}

	if(hrs == 1) {
		strMessage = strMessage+ " " + hrs + " "+translate('time.hr');
		count ++;
	} else if(hrs > 1) {
		strMessage = strMessage+ " " + hrs + " "+translate('time.hrs');
		count ++;
	}

	if(count == 2){
		return strMessage.length?strMessage + " "+translate('time.ago'):translate('time.Now');
	}

	if(min == 1) {
		strMessage = strMessage+ " " + min + " "+translate('time.minute');
	} else if(min > 1) {
		strMessage = strMessage+ " " + min + " "+translate('time.minutes');
	}


	if(y == 0 && m == 0 && d == 0 && hrs == 0 && min == 0){
		return " "+translate('time.Now');
	}
	return strMessage.length?strMessage + " "+translate('time.ago'):translate('time.Now');
}

function formatDate(objDate){
	var strRt = '';
	strRt += (objDate.getMonth() >=10)?objDate.getMonth():"0"+objDate.getMonth();
	strRt += "/";
	strRt += (objDate.getDate() >=10)?objDate.getDate():"0"+objDate.getDate();
	strRt += "/";
	strRt += (objDate.getFullYear() >=10)?objDate.getFullYear():"0"+objDate.getFullYear();
	strRt += " ";
	strRt += (objDate.getHours() >=10)?objDate.getHours():"0"+objDate.getHours();
	strRt += ":";
	strRt += (objDate.getMinutes() >=10)?objDate.getMinutes():"0"+objDate.getMinutes();
	return strRt;
}


function cancel() {
	history.back();
}

function commonModal(header, body, footer){
	$('#div_confirmDialog1 .modal-header').html(header);
	$('#div_confirmDialog1 .modal-body').html(body);
	$('#div_confirmDialog1 .modal-footer').html(footer);
}


function getMaxHeight(arrObj){
	var maxH = 0;
	$.each(arrObj,function(ind,val){
		height = val.scrollHeight;
		if(maxH < height){
			maxH = height;
		}
	});
	return maxH;
}

jQuery.fn.putCursorAtEnd = function() {

	  return this.each(function() {
		  if(!homeChangedFocus){
			    $(this).focus();
		  }

	    // If this function exists...
	    if (this.setSelectionRange) {
	      // ... then use it (Doesn't work in IE)

	      // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
	      var len = $(this).val().length * 2;

	      this.setSelectionRange(len, len);

	    } else {
	    // ... otherwise replace the contents with itself
	    // (Doesn't work in Google Chrome)

	      $(this).val($(this).val());

	    }

	    // Scroll to the bottom, in case we're in a tall textarea
	    // (Necessary for Firefox and Google Chrome)
	    this.scrollTop = 999999;

	  });

	};

 function getCountryCodeFromPhoneNumber(phoneNumber, character) {
		var countryCode = "";
		var countryCodeArr = phoneNumber.split(character);
		if (countryCodeArr.length > 1) {
			countryCode = countryCodeArr[1];
		}
		return countryCode;
 }

 var clientVersion = 'WEB 1.0';
 function rectime(seconds) {
	// 1- Convert to seconds:
	    //var seconds = ms / 1000;
	    // 2- Extract hours:
	    var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
	    seconds = seconds % 3600; // seconds remaining after extracting hours
	    // 3- Extract minutes:
	    var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
	    // 4- Keep only seconds not extracted to minutes:
	    seconds = seconds % 60;
	    //alert( hours+" hours and "+minutes+" minutes and "+seconds+" seconds!" );
	    return hours+"."+minutes;
	}

 function manageInputGroup(event){
	 var objTarget = $(this);
	 var objItem =  objTarget.closest(".txt_group_item");
	 var objParent = objItem.parent();
	 var objItemHtml = '<div class="row txt_group_item">' + objItem.html() + '</div>';
	 if(objTarget.hasClass("glyphicon-plus")){
		 objParent.append(objItemHtml);
		 objParent.find(".txt_group_item :last").val("");
		 objTarget.removeClass("glyphicon-plus");
		 objTarget.addClass("glyphicon-remove");
	 }else if(objTarget.hasClass("glyphicon-remove")){
		 objItem.remove();
	 }
 }
 /*Draw table data*/
 function drawTable(dataList, pageType){
	 $("table>tbody").html("");
	 switch (pageType) {
	 case 'deviceList':
		 getDeviceTable(dataList);
		 break;
	 case 'deviceBuildList':
		 getBuildTable(dataList);
		 break;
	 case 'deviceLogList':
		 getDeviceLogTable(dataList);
		 break;
	 case 'debugLogList':
		 getDebugLogTable(dataList);
		 break;
	 case 'userList':
		 getUserTable(dataList);
		 break;
	 case 'groupList':
		 getGroupTable(dataList);
		 break;
	 case 'deviceGroupList':
		 getDeviceGroupTable(dataList);
		 break;
	 case 'modelList' :
		 getModelTable(dataList);
		 break;
	 case 'logList' :
		 getLogTable(dataList);
		 break;
	 case 'bugReportList' :
		 drawBugReportTable(dataList);
		 break;
	 }
	 drawPaginator();
	 $('.tbl_checkbox').click(singleCheck);
 }
  function getStatus(status, mode) {
	if (status != null) {
		if (mode != 'info') {
			return '<span>' + status + '</span>';
		} else {
			if (status == 'ACTIVE')
				return '<span class="label label-success">' + status + '</span>';
			else
				return '<span class="label label-default">' + status + '</span>';

		}
	}
	return '--';
}

 function getSoftwareBuildName(nameList) {
	 var listItems = "";
	 if(nameList != null && nameList.length > 0) {
		 $.each(nameList,function(ind,val) {
			 listItems += '<li>'+val.buildName+'</li>';
		 });
	 }
	 if(listItems.length < 2){
		 listItems += '<li>--</li>';
	 }
	 return listItems;
 }

 function getUserName(name) {
	if (name)
		return name;
	else
		return '--';
}
function firstName(firstName) {
	return firstName;
}


/*-------------*/
	var errorMsg = 'This feature not implemented yet.';
	function deviceInfo(mode){
		//$('.notification_error').html('');
		switch (mode) {
		case 'delete':
			$('#div_confirmDialog1').modal('show');
			$('#div_confirmDialog1 #btn_delete').click(deleteInfo);
			break;
		case 'deactivate':
			deactivateInfo();
			break;
		case 'activate':
			activateInfo();
			break;
		case 'edit':
			$("#device_Info.view-mode").addClass("edit-mode").removeClass("view-mode");
//			$('[id$="_Edit"]').removeClass('hidden');
//			$('[id$="_Info"]').addClass('hidden');
			break;
		case 'cancel':
			history.back();
			break;
		case 'save':
			save();
			break;
		default:
			break;
		}
	}

	/*delete/deactivate/activate*/

function switchMode(mode,target,redirect){
	var modeAlt = (mode=="edit")?"view":"edit";
	$(target+"."+modeAlt+"-mode").addClass(mode+"-mode").removeClass(modeAlt+"-mode");
	if(typeof redirect == 'undefined'){
		redirect = false;
	}
	if(redirect)
		history.back();
}

var objApiMapper = {
		"deviceGroup":{"status":"/api/group/v1/activate","delete":"/api/group/v1/delete","redirect":"/pages/deviceGroup.jsp?"},
		"deviceModel":{"status":"/api/model/v1/activate","delete":"/api/model/v1/delete","redirect":"/pages/deviceModels.jsp?"},
		"deviceSwBuild":{"status":"/api/model/v1/activateSwBuilds","delete":"/api/model/v1/deleteSwBuilds","redirect":"/pages/deviceBuildList.jsp?"},
		"device":{"status":"/api/device/v1/activate","delete":"/api/device/v1/delete","redirect":"/pages/deviceList.jsp?"},
		"user":{"status":"/api/user/v1/activate","delete":"/api/user/v1/delete","redirect":"/pages/userList.jsp?"}
	};
/**
 * Callback is optional callback function. It's called with boolean parameter based on weather the operations
 * is successful or not.
 * */
function deactivateActivateRecord(Ids, mode, status,callBack) {
	try{
		if(objApiMapper[mode]["status"] && objApiMapper[mode]["redirect"]){
			if(callBack){
				callAjaxActivate(objApiMapper[mode]["status"], Ids, callBack, status,true);
			}else{
				callAjaxActivate(objApiMapper[mode]["status"], Ids, objApiMapper[mode]["redirect"], status);
			}
		}else{
			alert('This feature not implemented yet.');
		}
	}catch (e) {
		alert('This feature not implemented yet.');
	}
}

function deleteRecords(Ids, mode) {
	try{
		if(objApiMapper[mode]["delete"] && objApiMapper[mode]["redirect"]){
			callAjaxDelete(objApiMapper[mode]["delete"], Ids, objApiMapper[mode]["redirect"]);
		}else{
			alert('This feature not implemented yet.');
		}
	}catch (e) {
		alert('This feature not implemented yet.');
	}
}

function callAjaxDelete(url,ids,redirectURL){
	var postJSON =   {"idList": ids};
	$.ajax({
		type : "DELETE",
		url : url,
		contentType : "application/json",
		data : createDataPacket(postJSON),
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				objNotification.success = "Sucessfully Deleted.";
				window.location = redirectURL + getEncodedNotification();
				}
				else {
				$('.notification_error').html(responseData.responseJSON.message);
			}
		} catch (error) {
			$('.notification_error').html(error.message);
		}
	});
}

/**
 * if isCallback is true or not undefined, redirectUrl is the name of callback function
 * */

function callAjaxActivate(url,ids,redirectURL,status, isCallBack){
	var postJSON =   {	"idList": ids,
					  	"activate": status
					  };
	isCallBack = isCallBack?true:false;
	$.ajax({
		type : "POST",
		url : url,
		contentType : "application/json",
		data : createDataPacket(postJSON),
		dataType : 'json'
	}).complete(function(responseData) {
		try {
			if (responseData.responseJSON != null && responseData.responseJSON.httpStatusCode == 200) {
				objNotification.success = "Sucessfully updated.";
					if(isCallBack){
						window[redirectURL](true);
					}else{
						window.location = redirectURL + getEncodedNotification();
					}
				}
				else {
				if(isCallBack){
					window[redirectURL](false);
				}
				$('.messages').html(responseData.responseJSON.message);
			}
		} catch (error) {
			if(isCallBack){
				window[redirectURL](false);
			}
			$('.messages').html(error.message);
		}
	});
}
function makePageReadOnly(){
	$('.container#containerMain').addClass("view-only");
}
function inputBoxLengthVaidate(formObj){
	var flag=true;
	$('.notification_error').html('&nbsp;');
	formObj.find('input').css('border-color','');
	formObj.find('input').each(function(){
		if($(this).attr('maxlength')!='undefined' && $(this).attr('maxlength')!=''){
			if($(this).val().trim().length > ($(this).attr('maxlength')-1)){
				$('.notification_error').html('Enter the text less than '+($(this).attr("maxlength")-1)+' characters.');
				$(this).css('border-color','red');
				flag = false;
				return false;
			}
		}
	});
	return flag;
}
var validateSubmitController = {};
validateSubmitController.isValidating = false;
validateSubmitController.delay = (function(){validateSubmitController.isValidating = false;});
validateSubmitController.doValidate = (function(){
	if(!validateSubmitController.isValidating){
		validateSubmitController.isValidating = true;
		setTimeout(validateSubmitController.delay, 3000);
		return true;
	}else{
		return false;
	}
});
function invalidMsg(textbox) {
	var frm = $(textbox).closest("form");
	var msg = "";
	if(textbox.validity.patternMismatch){
		if($(textbox).attr("maxlength")){
			if($(textbox).val().length >= ($(textbox).attr("maxlength")-1)){
				msg = 'Maximum length is  '+($(textbox).attr("maxlength")-1)+' characters.';
				textbox.setCustomValidity(msg);
			}
		}
		if(textbox.type == 'text' && !msg.length){
			if(textbox.id=='graphTitle'){
				msg = 'Only Alphabetic, Numeric, (), -, _ characters are allowed.';
				textbox.setCustomValidity(msg);
			}else{
				msg = 'Only alphabetic characters are allowed.';
				textbox.setCustomValidity(msg);
			}
		}else if(textbox.type == 'email'){
			msg = 'Invalid email address.';
			textbox.setCustomValidity(msg);
		}else if(textbox.type == 'number'){
			msg = 'Only numeric characters are allowed.';
			textbox.setCustomValidity(msg);
		}
		$(textbox).addClass("error");
		var objTrigger = $(".btnGroupActionBar .add_save");
//		if(objTrigger.length && validateSubmitController.doValidate())
//			objTrigger.trigger("click");
	}else{
		textbox.setCustomValidity('');
		$(textbox).removeClass("error");
	}
	return true;
}
function checkValidity(objFrm){
	if(objFrm.find("input.error,select.error,textarea.error").length > 0){
		return false;
	}
	return true;
}
function getCustomDate(date) {
	var minutes = date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes());
	var hrs = date.getHours() > 9 ? date.getHours() : ("0" + date.getHours());
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1));
	var day = date.getDate() > 9 ? date.getDate() : ("0" + date.getDate());
	return day + "/" + month + "/" + date.getFullYear() + " at " + hrs + ":" + minutes;
}
