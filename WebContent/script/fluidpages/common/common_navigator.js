/**
 * This navigator functions including paginator, selectAll, pageMode related functions etc..
 * */

// Draw Paginator
/*global $:false, jQuery:false */
objGrid.total = 0;
objGrid.page = 1;
objGrid.mode = "table";
objGrid.limit = "12";
objGrid.searchString = "";
var defaultMode = 'listNs';
var idPagingContainer = 'idPaginator';
var maxLnk = 5;
var checkBoxStatus;
var navPwValidator;
$(document).ready(function(){
	if (isAdmin == "true") {
		$('#tn_bell').removeClass("hidden");
	}
	$('#changePasswordBox' ).on( 'keypress', function( e ) {
        if( e.keyCode === 13 ) {
            e.preventDefault();
            $('#header_btn_changePwdDlgSave').click();
        }
    });
	commonOnResize();
    $(window).resize(commonOnResize);
	    $('#changePasswordBox').on('hidden.bs.modal', function() {
		if (typeof navPwValidator != 'undefined')
			navPwValidator.resetForm();
		$('#validationErrorBox').html('');
	});
    $(document).on("click",".ul_singleton_toggle",function(){
    	$(this).toggleClass("toggle");
    });
});

function commonOnResize(){
	$("#topNav").css("max-height",window.innerHeight*.7);
}

function drawPaginator() {
	isBusy(false);
	var obj = objGrid;
	var page = obj.page;
	var pMax, page, pMin, margin;
	var objPage = $("." + idPagingContainer);
	objPage.html('');
	if (obj.total <= obj.limit) {
		var pMax = last = 1;
	} else {
		last = parseInt(Math.ceil(obj.total / obj.limit));
	}
	$(".idPaginator").parent().find(".piEntries").remove();
	if (objGrid.total > 0 || true) {
		var entries = "";
		if (obj.total <= obj.limit) {
			entries = ((obj.total == 0) ? "0-" : "1-") + obj.total + " of " + obj.total;
		} else {
			var startValue = (obj.page - 1) * obj.limit + 1;
			var endValue = obj.page * (obj.limit);
			if(endValue > obj.total) {
				endValue = obj.total;
			}
			entries = startValue + "-" + endValue + " of " + obj.total;
		}
		$(".idPaginator").parent().append(
				'<span class="badge pull-right piEntries label-default">'
						+ entries + ' '
						+ ((objGrid.total <= 1) ? translate("common.notification.entry"):translate("common.notification.entries"))
						+ '</span>');
	}
	if (obj.total <= obj.limit) {
		return true;
	}
	// If all pages can fit within paginator
	margin = (maxLnk - 1) / 2;
	var marginL = marginR = margin;
	if (last <= maxLnk) {
		pMax = last;
		pMin = 1;
	} else {
		if ((last - page) < margin) {
			marginL = margin + (margin - (last - page));
		}
		marginL = (page - 1) > marginL ? marginL : (page - 1);
		if (marginL < margin) {
			marginR = margin + (margin - marginL);
		}
		marginR = (last - page) > marginR ? marginR : (last - page);
		pMax = page + marginR;
		pMin = page - marginL;
		if (pMin <= 0) {
			pMin = 1;
		}
	}

	if ((page - 1) == '0') {
		objPage
				.append('<li class="disabled"><a class="lnkPaginator" href="#" data-page="0" title="Previous">&laquo;</a></li>');
	} else {
		objPage.append('<li><a class="lnkPaginator" data-page="' + (page - 1)
				+ '" href="#" title=""'+translate("common.notification.previous")+'(' + (page - 1)
				+ ')">&laquo;</a></li>');
	}
	while (pMin <= pMax) {
		var objLi;
		if (pMin == page && pMin > 0) {
			objPage
					.append('<li class="active"><a class="lnkPaginator" href="#" data-page="0" title=""'+translate("common.notification.current")+'">'
							+ pMin + '</a></li>');
		} else if (pMin > 0) {
			objPage.append('<li class=""><a class="lnkPaginator" data-page="'
					+ pMin + '" href="#" title="' + pMin + '">' + pMin
					+ '</a></li>');
		}
		++pMin;
	}
	if (page == last || (page + 1) > last) {
		objPage
				.append('<li class="disabled"><a data-page="0" class="lnkPaginator" href="#" title=""'+translate("common.notification.next")+'">&raquo;</a></li>');
	} else {
		objPage.append('<li><a data-page="' + (page + 1)
				+ '" href="#" class="lnkPaginator"  title=""'+translate("common.notification.next")+'(' + (page + 1)
				+ ')">&raquo;</a></li>');
	}
	$(".lnkPaginator").click(function(event) {
		
		var page = parseInt($(this).attr('data-page'));
		if (page > 0) {
			var fnName = 'loadPage';
			if (typeof objActionMapper[fnName] == 'string') {
				fnName = objActionMapper[fnName];
			}
			if(!isBusy()){
				isBusy(true);
				window[fnName](page);
			}
			

		}
	});
	$('html, body').animate({
		scrollTop : 0
	}, 500);
}

function loadPage(intPage) {
	console.log('load page ' + intPage + ' called');
	objGrid.page = intPage;
	drawPaginator(objGrid);
}

//End: -- Draw Paginator


//Begin: Actionbar
var objMode = {};
objMode.nav = {};
objMode.nav.selected = '';
objMode.nav.selected_tab = '';
function setSearchBoxPlaceHolder(){
	var placeHolder = "Search ";
	if(typeof objActionMapper['pageName'] !='undefined'){
		placeHolder += objActionMapper['pageName'];
	}
	$(".searchCommon").attr("placeholder",placeHolder); 
}
var objActionMapper = {};
objActionMapper.add = 'addUser';
objActionMapper.getTableData = 'getGroupData';

/**
 * Takes the data from objActionBar and draws the action bars accordingly.
 * */
var objPages = {};
objPages.Users = [""];
objPages.Devices = ["All Devices", "Device Groups", "Device Models"];
objPages.Wizards = [""];
objPages.Home = [""];
objPages.Alerts = ["Alerts","Notifications"];

var permissionNull = {
		"Home": {"View": false, "Edit": false},
		"Wizards": {"View": false, "Edit": false},
		"Devices": {"View": false, "Edit": false},
		"Users": {"View": false, "Edit": false},
		"Alerts": {"Approve": false, "Notify": false }
	};
var rolePermission = permissionNull;

	rolePermission.Billing = {
	        "View": true,
	        "Edit": true};
	rolePermission.download = {
	        "View": true,
	        "Edit": false
	};
	

var objRoles = [
		 {"role":"Home","url":"./Home","name":"Home","id":"header_home","li_id":"tn_home"}
		,{"role":"Wizards","url":"./Wizards","name":"Wizards","id":"header_wizards","li_id":"tn_wizards"}
		,{"role":"Device","url":"./Device","name":"Device","id":"header_device","li_id":"tn_device"}
		,{"role":"Users","url":"./Users","name":"Users","id":"header_users","li_id":"tn_users"}
	];

var objAuth = {
	"Edit" : false,
	"View" : false
};
//var landing_page = '';
function setPermission() {	
	$('#ul_navBar').html('');
	var landing_page = '';
	$("#navAccountSettingUser").parent().addClass("hidden");
	$.each(objRoles,function(ind,val){
		
		if(typeof rolePermission[val['role']] !="undefined"){
			if (rolePermission[val['role']].View) {
				if (landing_page == '') {
					landing_page = val['url'];
				}
				$('#ul_navBar').append(
					'<li id="'+val['li_id']+'"><a href="'+val['url']+'" id ="'+val['id']+'">'+val['name']+'</a></li>');
			}
		}		
	});
	
	$("a.navbar-brand").attr("href",landing_page);
	if (!rolePermission.Alerts.Notify) {
		$('#tn_msg').hide();
		$('#tn_bell').hide();	
	}
	if (!rolePermission.Alerts.Approve) {
		$('#tn_bell').hide();
	}	
	objAuth = {
			"Edit" : false,
			"View" : false
	};
	// Begin: Get objAuth
	if (typeof rolePermission[objActionMapper.pageName] != 'undefined') {
		objAuth = rolePermission[objActionMapper.pageName];
		if(objActionMapper.pageName=='Notify' ||objActionMapper.pageName== 'Notifications'){
			objAuth = rolePermission[objActionMapper.pageName];
			objAuth.View = true;
			if(objActionMapper.pageId =='notification_alerts'){
				objAuth.Edit = false;
			}
		}else if(objActionMapper.pageName =='Alerts'){
			objAuth = rolePermission[objActionMapper.pageName];
			objAuth.View = true;
			objAuth.Edit = true;
			if(objActionMapper.pageId =='notification_alerts'){
				objAuth.Edit = false;
			}
		}
	} else {
		$.each(objPages, function(ind, val) {
			if ($.inArray(objActionMapper.pageName, val) != -1) {
				objAuth = rolePermission[ind];
				return false;
			}
		});
	}

}
function loadNav() {	
	$("#navContainer .nav-tabs").addClass('hidden');
	$("#topNav li").removeClass('active');
	if (objMode.nav.selected != 'undefined') {
		$("#navContainer #ul_tab_" + objMode.nav.selected).removeClass('hidden');
		$("#navContainer #ul_tab_" + objMode.nav.selected + " li").removeClass('active');
		if (objMode.nav.selected_tab.length) {
			$("#navTabContainer").removeClass('hidden');
			$("#navContainer #ul_tab_" + objMode.nav.selected + ' #li_'+ objMode.nav.selected_tab).addClass('active');
		} else {
			$("#navTabContainer").addClass('hidden');
		}
		$("#topNav .navbar-left #tn_" + objMode.nav.selected).addClass('active');
	}
}
// End: Actionbar

var objBusy = {};
objBusy.global = false;
function isBusy(status,target){
	//If status is not boolean, return the current status,
	//global or targeted based on the target param
	if(typeof status != 'boolean'){ 
            if(typeof target =='undefined'){
                    return objBusy.global;
            }else if(typeof objBusy[target]=='undefined'){
                    return false;
            }else{
                return objBusy[target];
            }		
	}
        else if(status == true){
           if(typeof target != "undefined"){
               var objTarget = $(target);
               objBusy[target] = true;
               objTarget.css("position","relative");               
               objTarget.prepend('<div class="clsImgWaiting"><img src="' + imagesCdnPath + '/loader.gif"/></div>');
           }else{
                objBusy.global = true;      
                $(".btnGroupActionBar button").addClass("disabled").addClass("busy");
           }
        }else{
           objBusy.global = false;
           if(typeof target != "undefined"){
               if(target=='global'){
            	   $(".clsImgWaiting").remove();
                   $(".btnGroupActionBar button.busy").removeClass("disabled").removeClass("busy");
               }else{
                   var objTarget = $(target);
                   objTarget.find(".clsImgWaiting").remove();       
                   objBusy[target] = false;
               }
           }else{
        	   $(".clsImgWaiting").remove();      
                   $(".btnGroupActionBar button.busy").removeClass("disabled").removeClass("busy");
           }        	   
        }
}

function multipleChecked(containerId) {}

function isDeviceAllocated() {
	var isDevAllocated = false;
	jQuery(".clsGrid:visible" + " :checkbox:checked").each(function() {
		varObj = $(this);
		if(typeof varObj.attr("data_id") != 'undefined') {
			if($('#div_deviceNames' + varObj.attr("data_id")).attr('id') != null) {
				isDevAllocated = true;
			}
		}
	});
	return isDevAllocated;
}

function isUsersAllocated() {
	var isuserAllocated = false;
	jQuery(".clsGrid:visible" + " :checkbox:checked").each(function() {
		varObj = $(this);
		if(typeof varObj.attr("data_id") != 'undefined') {
			if($('#tbl_link_groups' + varObj.attr("data_id")).attr('id') != null) {
				isuserAllocated = true;
			}
		}
	});
	return isuserAllocated;
}

// End: activateCheckAll---------

/**
 * Function to implement selectall checkbox functionality. It's better to use
 * the JqGrid's inbuilt feature. These functions are for the situations when
 * first option fails - like when using gq grid view.
 */
var clsCheckAll = "checkAll";
var objCheckAllData = {};
function activateCheckAll(containerId, onSucces) {
	// add multiple select / deselect functionality
	var objTable = $("#"+containerId);
	var objCheckAll = jQuery("#" + containerId + " :checkbox." + clsCheckAll);
	var objChecks = jQuery("#" + containerId + " :checkbox");
	var objCheckItem = jQuery("#" + containerId + " :checkbox:not(."+clsCheckAll+")[disabled!=disabled]");
	objCheckAll.removeAttr('disabled');
	if(objCheckAll.prop('checked') && objCheckItem != null && objCheckItem.length > 0) {
		objCheckItem.prop('checked',true);
		if(objMode.nav.selected=="userList" || objMode.nav.selected  == 'groups' || containerId == 'table_modelList'){
			setStatusToggle('disable', objTable);
			loadActionBar('disable');
		} else if(objMode.nav.selected_tab == 'viewLogs') {
			loadActionBar('deleteLog');
		} else if(objMode.nav.selected_tab == 'bugAnalytics') {
			setEventStatusToggle(objTable);
			loadActionBar('bugReportLog');
		} else {
			setStatusToggle(objMode.nav.selected, objTable);
		loadActionBar(objMode.nav.selected);
		}
	}else if(!objCheckItem.length){
		objCheckAll.prop('checked',false);
		objCheckAll.prop('disabled','disabled');
	}else{
		objCheckItem.prop('checked',false);
		if(objMode.nav.selected=="userList"){
			setStatusToggle(objMode.nav.selected, objTable);
			loadActionBar('userList');
		} else if(objMode.nav.selected  == 'groups'){
			setStatusToggle(objMode.nav.selected, objTable);
			loadActionBar('deviceGroup');
		}else if(containerId == 'table_modelList') {
			setStatusToggle(objMode.nav.selected, objTable);
			loadActionBar('deviceModel');
		}  else if(objMode.nav.selected_tab == 'bugAnalytics') {
			setEventStatusToggle(objTable);
			loadActionBar('bugReportLog');
		} else {
			setStatusToggle("none", objTable);
			loadActionBar('none');
		}
	}
	if(typeof onSucces == 'function' && objGrid.selected.length){
		onSucces(containerId);
	}
	updateGridSelected(objCheckItem);
}

function singleCheck(e) {
	var objTable = $(e.target).parents('[id^="table_"]');
	var containerId = objTable.attr('id');
	var parentCheckBox = objTable.find('.checkAll');
	var objCheckItem = jQuery("#" + containerId + " :checkbox:not(.checkAll)[disabled!=disabled]");
	var onlyCheckItem = jQuery("#" + containerId + " :checkbox:not(.checkAll):checked");
	//if checked the all item
	if(objCheckItem.length == onlyCheckItem.length) {
		if(objMode.nav.selected_tab == 'viewLogs') {
			loadActionBar('deleteLog');
		} else if(objMode.nav.selected_tab == 'bugAnalytics') {
			setEventStatusToggle(objTable);
			loadActionBar('bugReportLog');
		} else {
			setStatusToggle('disable', objTable);
			loadActionBar('disable');
		}
		parentCheckBox.prop('checked',true);
	//Default option appear if single check perform 
	}else if(!onlyCheckItem.length){
		parentCheckBox.prop('checked',false);
		if(objMode.nav.selected=='userList'){
			setStatusToggle('userList', objTable);
			loadActionBar('userList');
		}else if(objMode.nav.selected  == 'groups'){
			setStatusToggle('deviceGroup', objTable);
			loadActionBar('deviceGroup');
		} else if(containerId == 'table_modelList') {
			setStatusToggle('deviceModel', objTable);
			loadActionBar('deviceModel');
		}
		else{
			parentCheckBox.prop('checked',false);
			loadActionBar('none');
		}
	//if multiple check perform
	}else{
		parentCheckBox.prop('checked',false);
		if (objMode.nav.selected == 'userList'
				|| objMode.nav.selected  == 'groups'
				|| objMode.nav.selected_tab == 'device') {
			setStatusToggle('disable', objTable);
			loadActionBar('disable');
		} else if(objMode.nav.selected_tab == 'viewLogs') {
			loadActionBar('deleteLog');
		} else if(objMode.nav.selected_tab == 'bugAnalytics') {
			setEventStatusToggle(objTable);
			loadActionBar('bugReportLog');
		} else {
			setStatusToggle(objMode.nav.selected, objTable);
			loadActionBar(objMode.nav.selected);
		}
		
	}
	updateGridSelected($(e.target));
}
//checkbox activation using sessonStorage.
function updateCheckBox(containerId){
	var objTable = jQuery("#" + containerId);
	var objCheckAll = jQuery("#" + containerId + " :checkbox.checkAll");
	var objCheckItem = jQuery("#" + containerId + " :checkbox:not(.checkAll)[disabled!=disabled]");
	$.each(objGrid.selected, function(ind, value){
		$('input#checkbox_'+value).prop('checked',true);
	});
	if(objCheckItem.length == $("#"+containerId+" :checkbox:not(.checkAll)[disabled!=disabled]:checked").length){
		objCheckAll.prop('checked',true);
		if(objMode.nav.selected=="userList" || objMode.nav.selected  == 'groups' || containerId == 'table_modelList'){
			setStatusToggle('disable', objTable);
			loadActionBar('disable');
		} else if(objMode.nav.selected_tab == 'viewLogs') {
			loadActionBar('deleteLog');
		} else if(objMode.nav.selected_tab == 'bugAnalytics') {
			setEventStatusToggle(objTable);
			loadActionBar('bugReportLog');
		} else {
			setStatusToggle(objMode.nav.selected, objTable);
			loadActionBar(objMode.nav.selected);
		}
	}else if($("#"+containerId+" :checkbox:not(.checkAll)[disabled!=disabled]:checked").length){
		if (objMode.nav.selected == 'userList'
			|| objMode.nav.selected  == 'groups'
				|| objMode.nav.selected == 'device') {
			setStatusToggle('disable', objTable);
			loadActionBar('disable');
		} else if(objMode.nav.selected_tab == 'viewLogs') {
			loadActionBar('deleteLog');
		} else if(objMode.nav.selected_tab == 'bugAnalytics') {
			setEventStatusToggle(objTable);
			loadActionBar('bugReportLog');
		} else {
			setStatusToggle(objMode.nav.selected, objTable);
			loadActionBar(objMode.nav.selected);
		}
	}
}
function updateGridSelected(objs){
	$.each(objs,function(ind,obj){
		var tId = "0";
		var obj = $(obj);
		if(typeof obj.attr("data_id") != 'undefined'){
			tId = obj.attr("data_id");
		}else{
			return false;
		}
		if(obj.is(":checked")){
			if($.inArray(tId,objGrid.selected) == -1){
				objGrid.selected.push(tId);
			}
		}else{
			if($.inArray(tId,objGrid.selected) > -1){
				objGrid.selected.remove(tId);
			}
		}
	});
	setPageStatusData();
}
function setStatusToggle(type, objTable) {
	if (isAdmin == null || isAdmin == "false") {
		if (objTable.attr('id') == "table_modelList"
				|| objTable.attr('id') == "table_buildList"
				|| objTable.attr('id') == "table_userList"
				|| objTable.attr('id') == "table_deviceList") {
			return false;
		}
	}
	if(objTable.find('input:checkbox:not(.checkAll):checked').length > 0){
		if(objTable.find('input:checkbox:checked[data_status=ACTIVE]').length > 0){
			actionMenu[type]["add_disable"] = true;
		}else{
			actionMenu[type]["add_disable"] = false;
		}
		if(objTable.find('input:checkbox:checked[data_status=INACTIVE]').length > 0){
			actionMenu[type]["add_enable"] = true;
		}else{
			actionMenu[type]["add_enable"] = false;
		}
	}
	
}

function setEventStatusToggle(objTable) {
	type = "bugReportLog";
	// $('.add_enable').html('<span class="glyphicon glyphicon-plus-sign">New');
	$('.add_disable').html('<span class="glyphicon glyphicon-thumbs-up">Resolve');
	$('.add_delete').html('<span class="glyphicon glyphicon-thumbs-down">Reject');
	actionMenu[type]["add_enable"] = false;
	actionMenu[type]["add_disable"] = false;
	actionMenu[type]["add_delete"] = false;
	if(objTable.find('input:checkbox:not(.checkAll):checked').length > 0){
		if(objTable.find('input:checkbox:checked[data_status=NEW]').length > 0){
			actionMenu[type]["add_disable"] = true;
			actionMenu[type]["add_delete"] = true;
		}
		if(objTable.find('input:checkbox:checked[data_status=REJECTED]').length > 0){
		//	actionMenu[type]["add_enable"] = true;
			actionMenu[type]["add_disable"] = true;
		}
		if(objTable.find('input:checkbox:checked[data_status=RESOLVED]').length > 0){
		//	actionMenu[type]["add_enable"] = true;
			actionMenu[type]["add_delete"] = true;
		}
	}
}

//action Menu
var actionMenu={};
actionMenu.view = JSON.parse('{"add_edit":true,"add_cancel":false,"add_save":false,"add_user": false,"add_to_group": false,"add_model": false,"add_enable": false,"add_disable": false,"add_delete": true}');
actionMenu.edit = JSON.parse('{"add_edit":false,"add_cancel":true,"add_save":true,"add_user": false,"add_to_group": false,"add_model": false,"add_enable": false,"add_disable": false,"add_delete": false}');
actionMenu.none = JSON.parse('{"add_user": false,"add_cancel":false,"add_save":false,"add_to_group": false,"add_model": false,"add_enable": false,"add_disable": false,"add_delete": false}');
actionMenu.device = JSON.parse('{"add_user": false,"add_to_group": false,"add_model": false,"add_enable": false,"add_disable": true,"add_delete": true}');
actionMenu.groups = JSON.parse('{"add_user": false,"add_to_group": false,"add_model": false,"add_enable": false,"add_disable": true,"add_delete": true}');
actionMenu.deviceGroup = JSON.parse('{"add_user": false,"add_to_group": false,"add_group":true,"add_model": false,"add_enable": false,"add_disable": false,"add_delete": false}');
actionMenu.deviceModel = JSON.parse('{"add_user": false,"add_to_group": false,"add_group":false,"add_model": true,"add_enable": false,"add_disable": false,"add_delete": false}');
actionMenu.userList = JSON.parse('{"add_user": true,"add_to_group": false,"add_group":false,"add_model": false,"add_enable": false,"add_disable": false,"add_delete": false}');
actionMenu.addGraph = JSON.parse('{"add_user": false,"add_to_group": false,"add_model": false,"add_enable": false,"add_disable": false,"add_delete": false,"add_graph":true}');
actionMenu.disable = JSON.parse('{"add_group": false, "add_user": false,"add_to_group": false,"add_model": false,"add_enable": false,"add_disable": true,"add_delete": true,"add_graph":false}');
actionMenu.deleteLog = JSON.parse('{"add_group": false, "add_user": false,"add_to_group": false,"add_model": false,"add_enable": false,"add_disable": false,"add_delete": true,"add_graph":false}');
actionMenu.bugReportLog = JSON.parse('{"add_group": false, "add_user": false,"add_to_group": false,"add_model": false,"add_enable": false,"add_disable": false,"add_delete": false,"add_graph":false}');
actionMenu.deviceInfo = JSON.parse('{"add_user": false,"add_to_group": false,"add_model": false,"add_enable": false,"add_disable": true,"add_delete": true,"add_graph":false}');

function loadActionBar(actionType) {
	$.each(actionMenu[actionType], function(index, val) {
		if(val){
			$('.'+index).removeClass('hidden');
		}else{
			$('.'+index).addClass('hidden');
		}
			
	});
}
var strLiChangeModel = '<li id="li_select_model" class="dropdown"><a id="lnkNavbarChangeModel"  href="#" class="dropdown-toggle" data-toggle="dropdown"><span>Device Group/Model:&nbsp;</span><span id="header_prefModelName" title="Change Global Settings"></span></a><ul id="lnkNavbarChangeModelUl" class="dropdown-menu" role="menu">';
strLiChangeModel += '<li class="li_seperator"><a href="javascript:">Device Group: <span id="current_stability_measure">--</span></a></li>';
strLiChangeModel += '<li class="li_seperator"><a href="javascript:">Device Model: <span id="current_device_model">--</span></a></li>';
strLiChangeModel += '<li><a href="#modal_changeDeviceModel" data-toggle="modal">Change Settings</a></li></ul></li>';
