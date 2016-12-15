/*global $:false, jQuery:false */
var objHelp={};
objHelp.pageName={};
objHelp.pageDescription={};
$(document).ready(function(){
	$('button#helpBtn').addClass('showHelp');
	//$('button#helpBtn').remove();
	addFilpContainer();
});

function addFilpContainer(){
	if (objActionMapper.pageId != "buyplan"
			&& objActionMapper.pageId != 'device_list'
			&& objActionMapper.pageId != 'locate_device'
			&& objActionMapper.pageId != "device_details"
			&& objActionMapper.pageId != "users_list"
			&& objActionMapper.pageId != "group_list") {
		$('div#body + .container').wrap('<div class="flip-toggle"><div class="flip-container"><div class="flipper"><div class="front">');
		$('.flipper .front').after('<div class="back hidden"><div class="helpContaint container"></div></div>');
	}
}
var $helpText = $('<div class="container action-bar"><form class="navbar-form1 row" role="search"><div class="btn-group pull-right col-xs-4 col-md-3 col-lg-3"><span class="pull-right">'+
		'<button id="helpBtn" type="button" onclick="javascript:document.querySelector(\'.flip-toggle\').classList.toggle(\'flip\');objHelpDescription();" class="btn btn-default rActive closeHelp"><span class="glyphicon glyphicon-remove rInactive"></span> <span class="rInactive"> Close</span></button>'+
'</span></div></form></div>');

var $helpEditText = $('<div class="container action-bar"><form class="navbar-form1 row" ><div class="btn-group pull-right col-xs-4 col-md-3 col-lg-3"><span class="pull-right">'+
		'<button id="helpSaveBtn" type="button" onclick="saveHelpHtml()" class="btn btn-default rActive "><span class="glyphicon glyphicon-save rInactive"></span> <span class="rInactive"> Save</span></button>'+
		'<button id="helpBtn" type="button" onclick="javascript:document.querySelector(\'.flip-toggle\').classList.toggle(\'flip\');objHelpDescription();" class="btn btn-default rActive closeHelp"><span class="glyphicon glyphicon-remove rInactive"></span> <span class="rInactive"> Close</span></button>'+
'</span></div></form></div>');
var editAdded = false
$(document).on('click','.showHelp',function(){
	objHelp.originalActionBar = $('.container.action-bar').clone(true);	
	$('.container.action-bar').remove();
	$helpText.appendTo('div#actionNavbar');
	if(isSuperAdmin && !editAdded){
		$("button#helpBtn").before('<button id="helpEditBtn" type="button" onclick="loadHelpEditor(\'openHelpEditor\')" class="btn btn-default rActive "><span class="glyphicon glyphicon-edit rInactive"></span> <span class="rInactive"> Edit</span></button>');
		editAdded = true;
	}
});

$(document).on('click','.closeHelp',function(){
	$('div#actionNavbar').html(objHelp.originalActionBar[0]);
	$(".flip-container .flipper div.back>div:last").addClass("hidden");
	$(".flip-container .flipper div.back>div:first").removeClass("hidden");
	
	//Remove Html so no new images would be fetched once the help panel is closed
	$(".flip-container .flipper div.back #txtHelp").html("");
	$('.helpContaint').html('');
	if(typeof helpEditor.options =='object'){
		$(window).unbind("scroll",adjustEditorToolbar);		
		helpEditor.removeInstance('txtHelp');
		$("#helpEditor").remove();
	}
});

function objHelpDescription(){
	$('.flipper .back').toggleClass('hidden','active');
	$('.flipper .front').toggleClass('hidden','active');
	gethelpDescription();
}

function gethelpDescription(){
	switch (objActionMapper.pageId) {
//	case "dashboard":
//		$('.helpContaint').html(objHelp.pageDescription.dashboard);
//		break;
//	case "Admins":
//		$('.helpContaint').html(objHelp.pageDescription.Admins);
//		break;
//	case "admin_view":
//		$('.helpContaint').html(objHelp.pageDescription.admin_view);
//		break;
//	case "role_list":
//		$('.helpContaint').html(objHelp.pageDescription.role_list);
//		break;
//	case "role_view":
//		$('.helpContaint').html(objHelp.pageDescription.role_view);
//		break;
//	case "users_list":
//		$('.helpContaint').html(objHelp.pageDescription.users_list);
//		break;
//	case "user_view":
//		$('.helpContaint').html(objHelp.pageDescription.user_view);
//		break;
//	case "group_list":
//		$('.helpContaint').html(objHelp.pageDescription.group_list);
//		break;
//	case "group_view":
//		$('.helpContaint').html(objHelp.pageDescription.group_view);
//		break;
	default:
		$('.helpContaint').html('<h1 class="rActive text-center">Loading Help....</h1>');
		$('.helpContaint').load("/hp_help/help.html?ajax=true");//html('<iframe src="resources/help?ajax=true"></iframe>'+'');
	}
}

//Start Page Description

objHelp.pageDescription.dashboard='<h1 class="rActive text-center">Help page under construction...</h1>';

//---------------Start Admin Menu-------------------
objHelp.pageDescription.Admins=
	'<img class="img-responsive pull-left padding_1" src="'+imagesCdnPath+'/ic_admin.png">'+
	'<h2>Admin</h2>'+
	'<p>Admin is a specialised user who gets access to the web management console and depending on his role priviledges to view and change data. An admin can also be a user.</p>';

objHelp.pageDescription.admin_view=
	'<img class="img-responsive pull-left padding_1" src="'+imagesCdnPath+'/ic_admin.png">'+
	'<h2>Admin</h2>'+
	'<p>Admin is a specialised user who gets access to the web management console and depending on his role priviledges to view and change data. An admin can also be a user.</p>';

objHelp.pageDescription.role_list=
	'<img class="img-responsive pull-left padding_1" src="'+imagesCdnPath+'/Roles.png">'+
	'<h2>Role</h2>'+
	'<p>A role is only applicable to admins. Role is associated with various priviledges that allow admins to view and operate on various parts of the Web Console.</p>';

objHelp.pageDescription.role_view=
	'<img class="img-responsive pull-left padding_1" src="'+imagesCdnPath+'/Roles.png">'+
	'<h2>Role</h2>'+
	'<p>A role is only applicable to admins. Role is associated with various priviledges that allow admins to view and operate on various parts of the Web Console.</p>';

//---------------Start User Menu-------------------
objHelp.pageDescription.users_list=
	'<img class="img-responsive pull-left padding_1" src="'+imagesCdnPath+'/ic_user.png">'+
	'<h2>User</h2>'+
	'<p>User is mobile device owner.  If any user is active, the user will be able to login using HP Mobile Smart Application.</p>'+
	'<p><u>A user can be in 4 states:</u></p>'+
	'<p><i>Active</i> : User will have full access to enterprise resources.<br>'+
	'<i>Activation Pending</i> : Admin will require to approve user to reach active state.<br>'+
	'<i>Inactive</i> : User will not get any updates<br>'+
	'<i>Deleted</i> : Enterprise data from user\'s devices has been triggered for removal'+
	'</p>';
objHelp.pageDescription.user_view=
	'<img class="img-responsive pull-left padding_1" src="'+imagesCdnPath+'/ic_user.png">'+
	'<h2>User</h2>'+
	'<p>User is mobile device owner.  If any user is active, the user will be able to login using HP Mobile Smart Application.</p>'+
	'<p><u>A user can be in 4 states:</u></p>'+
	'<p><i>Active</i> : User will have full access to enterprise resources.<br>'+
	'<i>Activation Pending</i> : Admin will require to approve user to reach active state.<br>'+
	'<i>Inactive</i> : User will not get any updates<br>'+
	'<i>Deleted</i> : Enterprise data from user\'s devices has been triggered for removal'+
	'</p>';
objHelp.pageDescription.group_list=
	'<img class="img-responsive pull-left padding_1" src="'+imagesCdnPath+'/ic_group.png">'+
	'<h2>Group</h2>'+
	'<p>Groups is a collection of users. Policies can also be assigned to groups, which will be applied to all users in the group.</p>';
objHelp.pageDescription.group_view=
	'<img class="img-responsive pull-left padding_1" src="'+imagesCdnPath+'/ic_group.png">'+
	'<h2>Group</h2>'+
	'<p>Groups is a collection of users. Policies can also be assigned to groups, which will be applied to all users in the group.</p>';

//---------------Start Device Menu-------------------

objHelp.pageDescription.installApps='<h1 class="rActive text-center">Help page under construction...</h1>';
objHelp.pageDescription.bundles='<h1 class="rActive text-center">Help page under construction...</h1>';
objHelp.pageDescription.marketPlace='<h1 class="rActive text-center">Help page under construction...</h1>';
objHelp.pageDescription.viewLogs='<h1 class="rActive text-center">Help page under construction...</h1>';
objHelp.pageDescription.imports='<h1 class="rActive text-center">Help page under construction...</h1>';
objHelp.pageDescription.exports='<h1 class="rActive text-center">Help page under construction...</h1>';
objHelp.pageDescription.importUsers='<h1 class="rActive text-center">Help page under construction...</h1>';
objHelp.pageDescription.debugHistory='<h1 class="rActive text-center">Help page under construction...</h1>';

//end Page Description--

//Upload help files
function uploadHelp(){
	if($("#uploadHelpModal").length == 0){
		$("body:first").append('<div class="modal fade" id="uploadHelpModal"></div>');
		$("#uploadHelpModal").load("resources/uploadHelp?ajax=true",function(){
			drawUploadHelpForm();
			$("#uploadHelpModal").modal('show');
		});
	}else{
		$("#uploadHelpModal").modal('show');
	}
}


function updateHelp(obj){
	var files = $('input[type="file"]#helpHtml').val();
	var imgExt = files.split('.').pop().toLowerCase(); 
	if(!isBusy()){
		if(imgExt=="html" || imgExt=="htm" ){		
			/*
			 * Upload image to server
			 */
			$("#frmUploadHelpFile").unbind("submit");
//			simulateProgressBar();
		} else{
			showError(translate("user.invalid.source_file"));	 
			return false;
		}		
	}	
}

function loadHelpEditor(target){
	$('.container.action-bar').remove();
	$helpEditText.appendTo('div#actionNavbar');
	if(!isHelpEditorLoaded){
		loadJS(site_path+"script/jQuery/wysiwyg/niceEdit.js", function(){
			isHelpEditorLoaded = true;
			window[target]();	
		});
//		loadJS(site_path+"script/jQuery/wysihtml5/lib/js/wysihtml5-0.3.0.js", function(){
//			loadJS(site_path+"script/jQuery/wysihtml5/bootstrap-wysihtml5.js",function(){		
//			});
//		} );
	}else{
		window[target]();
	}
}

var helpEditor = {};
function openHelpEditor(){
	$(".flip-container .flipper div.back").append('<div id="helpEditor" class="hidden container"><form><div contenteditable="true" class="textarea"  style="width:100%;" id="txtHelp"></div></form></div>');
	$(".flip-container .flipper div.back #txtHelp").html($('.helpContaint').html());	
	$(".flip-container .flipper div.back>div:first").addClass("hidden");
	$(".flip-container .flipper div.back>div:last").removeClass("hidden");
	helpEditor = new nicEditor(
				{
					buttonList : ['bold','italic','underline','left','center','right','justify','ol','ul','subscript','superscript','strikethrough','removeformat','indent','outdent','hr','link','unlink','fontSize','xhtml']
					,iconsPath : site_path+'script/jQuery/wysiwyg/nicEditorIcons.gif'
				}
			).panelInstance('txtHelp');
	$(window).scroll(adjustEditorToolbar);
//	$('#txtHelp').wysihtml5({"stylesheets": [site_path+"script/jQuery/wysihtml5/lib/css/wysiwyg-color.css"] })
}

function adjustEditorToolbar(event){
	var top = ($(window).scrollTop()-40);
	top = (top>0) ? top:0;
	$("#helpEditor>form>div[unselectable='on']:first").css("position","fixed").css("top",top);
}
//End: Upload help files