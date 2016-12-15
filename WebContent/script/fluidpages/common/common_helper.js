/*
 * *
global $:false, jQuery:false, objGrid:true, document:false, window:false, objActionMapper:true, loadNav:true, showUrlNotification:true, 
 objUrlParam:true, boxSelected:true, setActionMode:true, searchCommon:true, loadUserTable:true, activateGrid:true, 
 getEncodedNotification:true, getSelectedRowIds:true, getSelectedIds:true, updateUserStatus:true, translate:false,
 clsCheckAll:true, deleteRecordInfo:true, getSearchData:true, objNotification:true, showNotification:true, updateStatus:true,
 loadGridView:true, loadTableView:true,  drawPaginator:true, setPageStatusData:true, typeAheadTriggerLimit:true, validateResponse:true,
 processAutocompleteData:true, addDeviceNames:true, addProfileImage:true, addCheckbox:true , getStatus:true , getUserName:true , getDeviceDetails:true,
 getName:true, shortenName:true, activateAccordians:true, snLanguage:true, site_path:true, objData:true, isAdmin:true, defaultAction:true, 
 switchFooter:true, drawNavbarLists:true, deleteRecord:true, loadFonts:true, authRedirect:true, updateNotification:true,
 getUseInfoForEditProfile:true, updateAccountSetting:true, rolePermission:true, getNotificationData:true, sessionStorage:true,
 frmErrorDiv:true, frmValidate:true, updatePassword:true, displayName:true,
 setTimeout:true, objLocale:true*/
/**
 * This has common helper functions, prototype extensions, doc.ready etc. This file is loaded before other common files.
 * */

// Document Ready function of fluid theme
/*global $:false, jQuery:false */
var navPwValidator, objActionRequired, objPendingNotifications, isUpdatePwdDlgOpen = false, isSearch = false;

var objGrid = {};
objGrid.sort = {};
var objTblData = {};
var typeAheadTriggerLimit = 1;
var objLangData = {"en_US": {"name": "English (US)", "code": "en_US"}, "en_GB": {"name": "English (UK)", "code": "en_GB"}};
function setLanguage() {
	$("#languageSetting span").attr("class", "icon_" + snLanguage);
	$("#langSelectMenu").html("");
	$.each(objLangData, function (index, val) {
		if (index.toLocaleLowerCase() != snLanguage.toLocaleLowerCase()) {
			$("#langSelectMenu").append('<li><a href="javascript:switchLanguage(\'' + val.code + '\')">' + val.name + '</li>');
		}
	});
}
function switchLanguage(local) {
	if (typeof local == 'undefined') {
		local = "en_US";
	}
	$.ajax({
        type: 'POST',
        url : '../locale',
        data: "locale=" + local,
        locale: JSON.stringify({"locale": local}),
        dataType: 'json'
    }).complete(function (data) {
    	objData = JSON.parse(data.responseText);
    	if (objData.result) {
    		snLanguage = local;
    		setLanguage();
        	window.location.href = window.location.href;    		
    	}
    });
}

$( document ).ajaxComplete(function() {
	footerAdjuster.adjust();
});
$(document).ready(function () {
		footerAdjuster.adjust();
       // $.cookie("isAdmin", isAdmin.toString());
        if (typeof isAdmin == 'undefined') {
            isAdmin = false;
        }
        $("form.navbar-form1.row").submit(function () {
        	return false; 
        });
		switchFooter();
        drawNavbarLists();
        //loadFonts();
        setLanguage();
        addNavbarGroupList();
        $('.panel.panel-default .panel-heading input[onkeyup] + span').remove();
        //$(document).on("click", '.authRedirect', authRedirect); 
        
        //$('.panel.panel-default .panel-heading input[onkeyup]').attr('placeholder', 'Type to search..').css('border-radius', '4px');
        $('#navAccountSettingAdmin').click(function () {
        	getUseInfoForEditProfile($(this).attr("data_id"));
        });
        $('#saveUpdateUser').click(function () {
        	updateAccountSetting();
        });
        $('#actionNavbar:first').css('border-top','none');
        getDeviceModels(drawGraphs);
        $('#modal_changeDeviceModel').on('hidden.bs.modal', function(e){
        	$('#notificationBoxContainer #notificationBox').html('');
			$('#header_select_device_group').attr('selected','selected').val(currentGroupId);
			$('#header_select_device_model').attr('selected','selected').val(currentModelId);
        });
    });
// End Doc.ready--
function addNavbarGroupList(){
		$.ajax({
			type : 'GET',
			url : '/api/group/v1/assignedGroups',
			contentType : "application/json;charset=utf-8"
		}).complete(function(data) {
			if(validateResponse(data)){
				try {
					if(data.status == 200){
						data = data.responseJSON.data;
						if(data.length > 0) {
							var isCurrentGroupPresent = false;
							for(var index = 0; index < data.length; index++) {
								if(data[index].groupId == currentGroupId) {
									isCurrentGroupPresent = true;
									break;
								}
							}
							if(isCurrentGroupPresent == false) {
								switchGroup(data[0].groupId);
								return false;
							}
						}
						drawNavGroupList(data);
					}else{
						$('#navTenantList').append('<li><a href="javascript:void(0); style="cursor:default;">No Group Name</a></li>');
					}				
				} catch (exception) {
				}
				$("#header_select_device_group").change(getDeviceModels);
			}
		});
}

function drawNavGroupList(list){
	if(typeof list =='object' && list != null){
		if(list.length){
			//Create Empty container
			if($("#lnkNavbarChangeModel").length <= 0){
				$("li#tn_bell").before(strLiChangeModel);
			}
			var strList = '';	
			strList +='<a href="#" class="dropdown-toggle " data-toggle="dropdown">';
			strList +='<li><a id="lblTenantDisplayName" href="javascript:void();">';
			strList += currentGroupName+'</a></li>'; //currentGroupName
			$("#current_stability_measure").text(currentGroupName);
			strList +='<li class="divider"></li>';
			$.each(list, function(index,value){
				$("select#header_select_device_group").append('<option value="'+value.groupId+'">'+value.groupName+'</option>');
				if(value.groupId != currentGroupId){
//						$("#lnkNavbarChangeModelUl").append('<li title ="'+value.groupName+'"><a data_id="'+value.groupId+'" href="javascript:switchGroup('+value.groupId+')">'+value.groupName+'</a></li>');
						strList +='<li title ="'+value.groupName+'"><a data_id="'+value.groupId+'" href="javascript:switchGroup('+value.groupId+')">'+value.groupName+'</a></li>';
				}else{
					$("select#header_select_device_group option[value="+value.groupId+"]").prop("selected",true);
				}
			});		
			$("#navTenantList").html(strList);
			$("#navTenantList").parent().removeClass("disabledLnk");
			return true;			
		}
	}
	$("#navTenantList").parent().find("b.caret").remove();
	$("#navTenantList").css("visibility","hidden");
	$("#navDisplayName").css("cursor","default");
}

function updateDeviceSetting(){
	currentDeviceModel = $('#header_select_device_model option:selected').text();
	$("#header_prefModelName").html(currentGroupName+'/'+currentDeviceModel);
	switchModel($("#header_select_device_model").val(), "switchGroup", $("#header_select_device_group").val(), altCallback="");
	return false;
}

var switchRequestRunning = false;
var objSwitchTenant = {};
objSwitchTenant.redirect = './home.jsp';
function switchGroup(groupId) {
	if(groupId.type == "change"){
		groupId = $(groupId.target).val();
		$("#current_stability_measure").text($("select#header_select_device_group option[value="+groupId+"]").html());
		$("#modal_changeDeviceModel").modal("hide");
	}
	if (groupId != currentGroupId) {
		disableObject("div.frmChangeDeviceModel");
		$.ajax({
				type : 'GET',
				url : '/api/user/v1/switchGroup/' + groupId,
				contentType : "application/json;charset=utf-8"
			}).complete(function(data) {
				if(validateResponse(data)){
					try {
						if (data.responseJSON != null 
							&& data.responseJSON.httpStatusCode == 200) {
							currentGroupId = groupId;
							 window.location.reload();
							
						} else {
							objNotification.error = "* Error : " + data.responseJSON.message;
							showNotification();
						}
					} catch (e) {
						objNotification.error = translate("common.msgResponse.unknown");
						showNotification();
					}
					
				}
				disableObject("div.frmChangeDeviceModel",true);
				$("#modal_changeDeviceModel").modal("hide");
			});
	} else {
		$("#modal_changeDeviceModel").modal("hide");
		return;
	}
}
// End:Function to switch group --------

//$('#navTenantList').append('<li><a href="javascript:void(0);" id="LoggedInAs" style="cursor:default;">Logged in as '+ displayName +' </a></li>');
$.urlParam = function (name) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)')
			.exec(window.location.href);
	if (results != null && results.length > 0) {
		return results[1] || 0;
	}
	return 0;
};

//Adding startsWith function to string prototype
if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (str) {
	    return this.slice(0, str.length) == str;
	};
}

// Default Action to be performed on doc.ready
function drawNavbarLists() {
    if (isAdmin && isAdmin != "false") {
		getNotificationData("ACTIONS_REQD", notificationData.limit, notificationData.page, "", "setActionRequiredData");
    }
}
$.customFormatedDate = function (date) {
	var formatDate = "";
	try {
		var d = new Date(parseInt(date));
		formatDate = $.datepicker.formatDate('D, d M yy', d);
		if (parseInt(d.getHours()) < 10)
			formatDate += " 0" + d.getHours();
		else
			formatDate += " " + d.getHours();
		formatDate += ":";
		if (parseInt(d.getMinutes()) < 10)
			formatDate += "0" + d.getMinutes();
		else
			formatDate += "" + d.getMinutes();
	} catch (err) {
		formatDate = null;
	}
	return formatDate;
};

var objStrTimeDiff = {"year": 31506000, "month": 2592000, "day": 86400, "hour": 3600, 'minute': 60, 'second': 1};
$.getTimeDiff = function (date) {
	var now = new Date().getTime() / 1000;
    if (date > now) {
        date = date / 1000;
    }
	now = parseInt(now);
	var diff = now - date;
	var returnStr = '';
	$.each(objStrTimeDiff, function (ind, val) {
		if (diff > val) {
			var t =  parseInt(diff / val) + " " + ind + (parseInt(diff / val) > 1 ? "s" : "");
			returnStr =  t;
			return false;
		}
	});
	return returnStr;	
};


// Formatter functions
function formatCount(varCnt) {
	return parseInt(varCnt) > 0 ? varCnt : '-';
}
function formatCountUrl(varCnt, varUrl) {
	return parseInt(varCnt) > 0 ? '<a href="' + varUrl + '">' + varCnt + '</a>'
			: '-';
}
// End: Formatter Functions


function keySearchTrigger(e) {
	if (e.which == 13) {
		searchCommon(e);
	}
}

function search() {
    objNotification.warning = objLocale["enter_search_text"];
    showNotification();
}
//var objSort = {"field":"","type":""};
objGrid.sort = {"field" : "", "type" : ""};
function searchCommon(objTrigger) {
	var fnName = 'search';
    isSearch = true;
    if (typeof objTrigger != 'undefined') {
        if ($(objTrigger).hasClass("sorter")) {
            $("#" + objGrid.table + " table tr:first .sorter").addClass("glyphicon-sort");
            $(objTrigger).removeClass("glyphicon-sort");
            objGrid.sort.field = $(objTrigger).attr("data_field");
            if ($(objTrigger).hasClass("glyphicon-chevron-down")) {
                $(objTrigger).toggleClass("glyphicon-chevron-down glyphicon-chevron-up");
                objGrid.sort.type = "desc";
            } else if ($(objTrigger).hasClass("glyphicon-chevron-up")) {
                objGrid.sort.type = "asc";
                $(objTrigger).toggleClass("glyphicon-chevron-up glyphicon-chevron-down");
            }
        }
    }
    if (typeof objUrlParam.strSearch != 'undefined' && $(".searchCommon").length) {        	
        if (objUrlParam.strSearch.length > 0 && !$(".searchCommon").val().trim().length) {
            $(".searchCommon").val(objUrlParam.strSearch);
            delete objUrlParam.strSearch;
            setTimeout(function () {
                fnName = objActionMapper[fnName];
                window[fnName](1);  
            }, 10);
        }            
    }
    else {
    	var targetInput = $(objTrigger.target);
    	if ($(this).hasClass("triggerSearchable")) {
    		targetInput = $($(this).parent().find("select.searchable,input.searchable")[0]);
    	}else if( $(this).hasClass("searchCommonMirror")){
    		targetInput = $($(this).parent().parent().find("select.searchable,input.searchable")[0]);
    	}
    	if (typeof objActionMapper[fnName] == 'string') {
            strSearchString =  objTrigger.target==undefined?"":targetInput.val().trim();
            
            if(typeof objTrigger.target == 'object' && strSearchString.length == 0 && false){
            	objNotification.error = objLocale["common.notification.enter_search_text"];
            	showNotification();
            } else {
//                	$('.alert-dismissable').hide();
            	fnName = objActionMapper[fnName];
                window[fnName](1);
                
            }
                   
    	} else {
                fnName = "invalidOperation";
                window[fnName]();
    	}
        	
        }

}


function getSearchData(target){
	if(typeof target == "string"){
		target = $(target);
	}else if(typeof target == "undefined"){
		target = $(document);
	}
	var rtrnObj = {};
	target.find(".searchable").each(function(){
		if($(this).val().length && $(this).attr("name")){
			rtrnObj[$(this).attr("name")] = $(this).val().trim();
		}
	});
	return rtrnObj;
}

function setSearchData(objSearchData){
	if(typeof objSearchData=='undefined'){
		objSearchData = objGrid.searchData;
	}
	if(typeof objGrid.searchData =='object'){
		$.each(objGrid.searchData,function(index,value){
			if(value.length){
				$(".searchable[name='"+index+"']").val(value);
			}
		});		
	}
	if(objGrid.searchString != 'undefined'){
		if(objGrid.searchString.length > 0){
			$(".searchCommon.searchable").val(objGrid.searchString);
		}
	}
	if(typeof objGrid.sort == 'object'){
		if(objGrid.sort.type== "desc"){
			var objTarget = $(".sorter[data_field='"+objGrid.sort.field+"']:visible");
			if(typeof objTarget != 'undefined'){
				objTarget.removeClass("glyphicon-chevron-down");
				objTarget.addClass("glyphicon-chevron-up");			
			}
		}		
	}
	
} 



/**
 * Shorten name
 */
var maxLen = 10;
function shortenName(varStr, maxLen) {
	if(typeof varStr != 'undefined' && varStr){
		if (varStr.toString().length > maxLen) {
			return $.escape(varStr.toString().substr(0, (maxLen - 2)) + '..');
		} else {
			return $.escape(varStr.toString());
		}		
	}
	return "";
}
// End:Shorten name----------

function add() {
	console.log('add Called');
	return true;
}
function addUser(event) {
	console.log('add User Called');
	return true;
}

/**
 * Begin: Implementing search trigger
 */
var enterEvent = $.Event("keypress", {
	which : 13
});
var strSearchString = '';
var searchTriggerActivated = false;
function activateSearchTrigger() {
	if (!searchTriggerActivated) {
		searchTriggerActivated = true;
		$("form.navbar-form1").submit(function(e) {
			e.preventDefault();
		});



		$('.searchCommonMirror').click(searchCommon);
        $('.sorter').click(function() {
			searchCommon($(this));
		});

		$('.triggerSearchable').click(searchCommon);
		
        $('.searchable').unbind(keySearchTrigger);
        $('.searchable:not(.searchCommon)').keypress(keySearchTrigger);
        
        $('.searchCommon').change(function(){
        	$('.searchCommon').val($(this).val());
        });
        
        $('.searchCommon:first,.searchable').change(function(event){
        	if(!$(this).val().length){
        		searchCommon(event);
        	}
        });
        
        $('select.searchable').change(function(event){
            searchCommon(event);
        });
        
        $("#searchCommon,.searchable").change(setPageStatusData);
        
        if(typeof $('.searchCommon').typeahead =='function'){
            $('.searchCommon').typeahead({
                source: function(query, typeahead){
                	setPageStatusData();
                	return getAutocomplete(query,typeahead, $(this)[0]);
                }           
            });      
            $('.searchCommon').keyup(removeTypeaheadWhenEmpty);
        }
	}
}
// End: Implementing search trigger

//Begin: Default autocomplete to prevent code breaking. It would be overridden by the on page function.
function getAutocomplete(query,typeahead, objTa){
	var triggerObject = $(objTa.$element[0]);
	triggerObject.attr("autocomplete","");
	return typeahead([]);
}
function removeTypeaheadWhenEmpty(event){
	var obj = $(event.target);
	if(obj.val().length <= typeAheadTriggerLimit){
		obj.parent().find("ul.typeahead li").remove();
	}
}
//End: Default autocomplete to prevent code breaking. It would be overridden by the on page function.

function processAutocompleteData(objData,objTa,query){
	var arrRtrn = [];
	var strFields = $(objTa.$element[0]).attr("data_fields");
	if(!strFields){
		strFields = "name";
	}
	arrFields = strFields.split(",");
	$.each(objData,function(ind,item){
		if(arrFields.length){
			$.each(arrFields,function(ind1,field){
				if(item[field]){
					if(item[field].toLowerCase().indexOf(query.toLowerCase()) != -1 ){
						arrRtrn.push(item[field]);
					}
				}
			});
		}
	});
	return arrRtrn;
}


// SwitchFooter: To switch footer from/to fixed layout.
// Add/remove navbar-fixed-bottom
function switchFooter() {
	$("#copyright").removeClass('navbar-fixed-bottom');
	/*$(window).resize(function() {
		var hDoc = $(document).height();
		var hWin = $(window).height();
		if (hDoc < (hWin + 50)) {
			$("#copyright").addClass('navbar-fixed-bottom');
		} else {
			$("#copyright").removeClass('navbar-fixed-bottom');
		}
	});
	var hDoc = $(document).height();
	var hWin = $(window).height();
	if (hDoc < (hWin + 50)) {
		$("#copyright").addClass('navbar-fixed-bottom');
	} else {
		$("#copyright").removeClass('navbar-fixed-bottom');
	}*/

}
// End: SwitchFooter: To switch footer from/to fixed layout.


// Toggle Functions
function toggleEnabledId(varId) {
	if ($("#" + varId).css('display') == "none") {
		$("#" + varId).toggle(500);
		$("#" + varId).find("input,textarea,select").each(function() {
			$(this).removeAttr('disabled');
		});
	} else {
		$("#" + varId).toggle(500);
		$("#" + varId).find("input,textarea,select").each(function() {
			$(this).attr('disabled', 'disabled');
		});
	}
}

var toggleSelect = {"selector":"toggleSelect"};
function toggleEnableSelect(objTrigger, idTarget){
	var obj = $("#"+idTarget);
	var objHide = obj.find("."+toggleSelect.selector+":not(."+$(objTrigger).val()+")");
	objHide.hide(100);
	objHide.find("input,textarea,select").each(function() {
		$(this).attr('disabled', 'disabled');
	});
	var objShow = obj.find("."+toggleSelect.selector+"."+$(objTrigger).val());
	objShow.show(500);
	objShow.find("input,textarea,select").each(function() {
		$(this).removeAttr('disabled', 'disabled');
	});
}

function activateChkTrigger(objTarget){
	var objTriggers = $(objTarget).find(".chkTrigger:visible");
	console.log(objTriggers);
    $.each(objTriggers,function(index,value){
        var trigger = $(value);
        trigger.unbind();
        trigger.bind('change',function(event){
            var objTargetT = objTarget.find(".chkTarget."+$(this).attr("name"));
            enableClass(objTargetT);
        });            
    });
}

function enableClass(target) {
    var objT;    
	if(typeof target =='object'){
            objT = target;            
        }else{
            objT = $("." + target+":visible");
        }
	var objTs = objT.find(
			'input:visible,textarea:visible,select:visible');
	if (objT.attr('disabled') == 'disabled'
			|| objT.hasClass('disabled')) {		
		objT.removeAttr('disabled');		
		objTs.removeAttr('disabled');
		if("bluetoothSetting" != target){
			objTs.removeClass("disabled");
			objT.removeClass("disabled");
		}
	} else {	
		if("bluetoothSetting" != target){
			objTs.addClass("disabled");
			objT.addClass("disabled");
		}
		objT.attr('disabled', 'disabled');		
		objTs.attr('disabled', 'disabled');		
	}
	
}

// End: Toggle function

//Begin: Added functionality to remove element from  array
//By value
//Ex: var arr = [1,2,[1,1], 'abc'];arr.remove([1,1]);arr== [1,2, 'abc'];
Array.prototype.remove = function(x) { 
    for(i in this){
        if(this[i].toString() == x.toString()){
            this.splice(i,1);
        }
    }
};
//By Index
//Ex: var arr = [1,2,[1,1], 'abc'];arr.removeId(2);arr== [1,2, 'abc'];
Array.prototype.removeId = function(x) { 
	this.splice(x, 1);
};
//End: Added functionality to remove element from  array

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



// This function for split large string

function getSplitString(str) {
	if(str.length > 30){
		return str.substring(0,13) + '...';
	}
	return str;
}



function alphanumeric(text) {
	  var res = isSpclChar(text,'');
	  return res;
	 }

function isSpclChar(str,src) {
	  var firstChar = str.charAt(0); 
	  var result = true;
	  if(!isNaN(parseInt(firstChar))) { 
	   return false;
	  }
	  var re = /^[\w\-\s]+$/;
	  if(!re.test(str)) {
	   return false;
	  }
	  return result;
}
function getUseInfoForEditProfile(userId) {
	navPwValidator = frmValidate($("#frmUpdateUser"));
	$('#updateUser').on('show.bs.modal', function() {
		$('#updateUser input').removeClass('error errorTarget').val('');
		navPwValidator.resetForm();
    });
	$.ajax({
		type : 'GET',
		url : '/api/user/v1/getuser?userId=' + userId,
		contentType : "application/json;charset=utf-8"
	}).complete(function(data) {
		if(validateResponse(data)){
			try {
				if(typeof data.responseJSON == 'undefined'){
					showAccountSettingData(data);
				}else{
					showAccountSettingData(data.responseJSON);
				}				
			} catch (exception) {
			}
			if(data.responseJSON.readOnly == true){
				$('#userUpdateFooter > button').addClass('hidden');
				$('#userUpdateFooter').html('<button class="btn btn-default" type="button" onclick="javascript:hideModal();"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;Close</button>');
				$('#frmUpdateUser input').attr('readonly','');
				$('#frmUpdateUser select').attr('disabled','');
			}else{
				$('#userUpdateFooter').removeClass('hidden');
			}	
		}
	});
}
function hideModal(){
	$('#updateUser').modal('hide');
}
function showAccountSettingData(data){
	$('#frmStatus').html('');
	if(data != 'undefined'){
	//	$('form#frmUpdateUser #userName').val(data.userame);
		$('form#frmUpdateUser #displayName').val(data.displayName);
		$('form#frmUpdateUser #firstName').val(data.firstName);
		$('form#frmUpdateUser #lastName').val(data.lastName);
		if(data.status=='ACTIVE'){
			$('#frmStatus').append('<span class="label label-success">'+translate('common.user.status.active')+'</span>');
		}else{
			$('#frmStatus').append('<span class="label label-default">'+translate('common.user.status.inactive')+'</span>');
		}
		$('form#frmUpdateUser #emailId').val(data.userName);
		if ($.trim(data.phoneMobile) != '') {
			var homePhoneMobileArr = data.phoneMobile.split('-');
			if (homePhoneMobileArr.length > 1) {
				$("form#frmUpdateUser #userUpdateCountrycode").val(
						getCountryCodeFromPhoneNumber(homePhoneMobileArr[0], '+'));
				$('form#frmUpdateUser #phoneNumber').val(homePhoneMobileArr[1]);
			}
			$('form#frmUpdateUser #phoneNumber').show();
		} else {
			$('form#frmUpdateUser #phoneNumber').val("");
		}
	}else{
		
	}
}
function updateAccountSetting() {
	var postJSON;
		frmValidate($('#frmUpdateUser'));
		postJSON = {
				"userId":$('#navAccountSettingAdmin').attr('data_id'),
				"displayName": $('#frmUpdateUser #displayName').val(),
				"firstName" : $('#frmUpdateUser #firstName').val(),
				"lastName" : $('#frmUpdateUser #lastName').val(),
				"phoneMobile" : $("#phoneNumber").val().trim().length?("+"+$("#phoneNumber").parent().find("select").val()+"-"+$("#phoneNumber").val()):('')
		};
		if($("form#frmUpdateUser").valid()){
			var re = /\d+/;
			if(!$('#displayName').val().match(re)){
				$.ajax({
					type : 'POST',
					url : '/api/user/v1/update-user-profile',
					contentType : "application/json;charset=utf-8",
					data : JSON.stringify(postJSON),
					dataType : 'json',
					timeout : 10000
				}).complete(function(data) {
					if (validateResponse(data)) {			
						$('#updateUser').modal('hide');
						objNotification.success = translate("common.user.update.success");
						$.post(homeURL + '/actions',{
							actionType: 6,
							displayName: postJSON.displayName
						  },function(){
							location.reload();
						});
						
					}
					else {
						$('#updateUser').modal('hide');
					}
				}); 
			}else{
				$('#div_error').html('');
				$('#div_error').html('<label for="lastName" class="error">Please only enter alphabetic characters.</label>');
				$('#displayName').addClass('error errorTarget');
			}
		}
	}

function switchModel(modelId, onSuccess, groupId) {
	var temp = objNotification.containerId;
	objNotification.containerId = 'notificationBoxForModal';
	if(modelId.type == "change"){
		modelId = $(modelId.target).val();
		$("#modal_changeDeviceModel").modal("hide");
	}
	$("#current_device_model").text($("select#header_select_device_model option[value="+modelId+"]").html());
	if (modelId != currentModelId ) {
		disableObject(".frmChangeDeviceModel");
		$.ajax({
			type : 'GET',
			url : '/api/user/v1/switchModel/' + modelId + "?",
			contentType : "application/json;charset=utf-8"
		}).complete( function(data) {
			if (validateResponse(data)) {
				try {
					if (data.responseJSON != null
							&& data.responseJSON.httpStatusCode == 200) {
						currentModelId = modelId;
						if(onSuccess && groupId && groupId != currentGroupId){
							window[onSuccess](groupId);
						} else {
							if(typeof drawGraphs != 'undefined') {
								drawGraphs(modelId, groupId);
							}
							$("#modal_changeDeviceModel").modal("hide");
						}
						//window.location.reload();
					} else {
						objNotification.error = "* Error : "
								+ data.responseJSON.message;
						showNotification();
					}
				} catch (e) {
					objNotification.error = translate("common.msgResponse.unknown");
					showNotification();
				}
			}
			disableObject(".frmChangeDeviceModel",true);
		});
	}else{
		if(onSuccess && groupId && groupId != currentGroupId){
			window[onSuccess](groupId);
		}else{
			objNotification.error = 'Same request is occured.';
			showNotification();
		}
	}
	objNotification.containerId = temp;
}