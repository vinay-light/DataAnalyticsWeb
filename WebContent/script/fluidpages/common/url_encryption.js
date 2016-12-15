/*global $:false, jQuery:false */
//Begin: Show notification function
var objNotification = new Object();
objNotification.success = '';
objNotification.warning = '';
objNotification.error = '';
objNotification.info = '';
objNotification.msgShown = false;
objNotification.data = new Object();
objNotification.timer= {"success":5000,"warning":5000,"error":0,"info":5000};
objNotification.containerId = 'notificationBox';
objNotification.type = 'inline';
objNotification.urlParam = 'strParam';
var objUrlParam = new Object();
var strBtnClose = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
//test case
//objUrlParam.groupId = 'test';
//objUrlParam.groupname = 'test2';

function showNotification(){
    var notificationContainer, strMsg = '';
    if(typeof objNotification.containerId == 'object'){
    	notificationContainer = $(objNotification.containerId);
    }else{
        if(typeof $("#"+objNotification.containerId).attr("id") =='undefined'){
        	if(typeof $("#navNotificationBoxContainerHover").attr("id") =='undefined'){
        		createTempNotificationContainer();
        	}
        }
        notificationContainer = $("#"+objNotification.containerId);
    }
    notificationContainer.html('');
    var isError = false, mode=[];
//    $("#"+objNotification.containerId).removeAttr('style');
    if(objNotification.type == 'inline'){
        if(objNotification.success.length){
            strMsg += '<div class="alert msgSuccess alert-success alert-dismissable">'+ getNotificationText(objNotification.success)+strBtnClose+'</div>';
            mode.push("success");
        }
        if(objNotification.warning.length){
            strMsg += '<div class="alert msgWarning alert-warning alert-dismissable">'+ getNotificationText(objNotification.warning)+strBtnClose+'</div>';
            mode.push("warning");
        }
        if(objNotification.error.length){
            strMsg += '<div class="alert msgError alert-danger alert-dismissable">'+ getNotificationText(objNotification.error)+strBtnClose+'</div>';
            mode.push("error");
            isError = true;
        }   
        if(objNotification.info.length){
            strMsg += '<div class="alert msgInfo alert-info alert-dismissable">'+ getNotificationText(objNotification.info)+strBtnClose+'</div>';
            mode.push("info");
        }      
    }
    objNotification.success = objNotification.warning =  objNotification.info = objNotification.error = '';
    if(strMsg.length > 8){
    	notificationContainer.append(strMsg);
    	notificationContainer.css('display','');
    	notificationContainer.stop().show().css("opacity",1);
    	$.each(mode,function(index,val){
    		if(objNotification.timer[val]!=0){
            	notificationContainer.find("div.msg"+val).delay(objNotification.timer[val]).fadeOut(objNotification.timer[val]); 
    		}
    	});
    	if(!isScrolledIntoView(notificationContainer.find("div:last"))){
    		$(window).scrollTop(notificationContainer.find("div:last").offset().top-notificationContainer.height()-20);
    	}
    	objNotification.msgShown = true;   
    }
    return 1;
}

function showValidationNotification(){
	var strBtnCloseT= strBtnClose;
	strBtnClose = '';
	showNotification();
	strBtnClose = strBtnCloseT;
}

function createTempNotificationContainer(){
	var strTmpNcontainer = '<div class="row" id="navNotificationBoxContainerHover"> <div class="col-xs-12" id="navNotificationBox"></div></div>';
	$("body").prepend(strTmpNcontainer);
	$("#navNotificationBoxContainerHover").click(function(){
		$("#navNotificationBoxContainerHover #navNotificationBox").hide(700);
	});
}

/**
 * If the trimmed text doesn't have space and have `.` assume that the text is a translation tag and return value.
 * */
function getNotificationText(strTxt){
	if(strTxt.trim().indexOf(" ") < 0 && strTxt.trim().indexOf(".") >= 0 ){
		return translate(strTxt);
	}else{
		return strTxt;
	}
}

function getEncodedNotification(){
        var objTmpNotification = {} ;
        $.removeCookie("tmpNotification",{path:"/"});
        if(objNotification.success.length){
            objTmpNotification.success = objNotification.success;
        }
        if(objNotification.warning.length){
            objTmpNotification.warning = objNotification.warning;
        }
        if(objNotification.error.length){
            objTmpNotification.error = objNotification.error;
        } 
        if(!$.isEmptyObject(objTmpNotification)){
        	var str = JSON.stringify(objTmpNotification).toString();
//            $.cookie("tmpNotification",str,{path:"/"});
        	window.sessionStorage["common_data_urlNotification"] = str;
        }
	if(!$.isEmptyObject(objUrlParam)){
            var strJson = JSON.stringify(objUrlParam);
            return objNotification.urlParam+'='+$.base64.encode( strJson );            
        }else{
            return '';
        }
}

function showUrlNotification() {
//        var strTmpNotification = $.cookie("tmpNotification");    
        var strTmpNotification = window.sessionStorage["common_data_urlNotification"];
        if( typeof strTmpNotification != 'undefined'){
        	try{
                var objTmpNotification = JSON.parse(strTmpNotification);        		
        	}catch(e){
        		objTmpNotification = {};
        	}
            if (typeof objTmpNotification.success != 'undefined') {
                objNotification.success = objTmpNotification.success;
            }
            if (typeof objTmpNotification.error != 'undefined') {
                objNotification.error = objTmpNotification.error;
            }
            if (typeof objTmpNotification.warning != 'undefined') {
                objNotification.warning = objTmpNotification.warning;
            }
            showNotification();
            $.removeCookie("tmpNotification",{path:"/"});    
            delete window.sessionStorage["common_data_urlNotification"];
        }
        var msgParam = $.urlParam(objNotification.urlParam);
//                decodeURI(
//                (RegExp(objNotification.urlParam + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
//                );
        
        if (msgParam.length && msgParam != 'null') {
        	// decodeURIComponent() will convert any url safe characters like %3D to =
        	msgParam = decodeURIComponent(msgParam);
            getJson = $.base64.decode( msgParam );
            var objMsg = JSON.parse(getJson);
            objUrlParam = objMsg;
        }
		//If the mode ==create, remove all other values from urlParam
        if(objUrlParam.pageMode =="Create"){
        	objUrlParam = {"pageMode":"Create"};
        }
        
        
        //If there are no parameters - beside the messages - Remove the urlParam from 
		//url so the message won't show a second time.
//        if( typeof $.urlParam(objNotification.urlParam) != 'undefined' 
//            &&  typeof $.urlParam(objNotification.urlParam) != '0' ){
//            var url = $(location).attr('href');
//            var newParam = '';
//            if(!$.isEmptyObject(objUrlParam)){
//                    newParam = objNotification.urlParam+'='+$.base64.encode( JSON.stringify(objUrlParam) );
//            }
//            var urlNew = url.replace(objNotification.urlParam+'='+msgParam,newParam);
//            history.pushState(null, null, urlNew);
//        }
			
    }

// End: Notification Functions
//get the profile image or text.
function getProfileImage(item,fieldName,fieldImage){
	var strImg = '';
	var strProgress = "";
	if(typeof objLoader !="undefined" ){
		 strProgress = 'onload="objLoader.update(\'images\')"';
	}
	if(item[fieldImage] != null && item[fieldImage] != "null"){
		if(typeof item[fieldImage] != 'undefined'  ){
			if(item[fieldImage].length && objGrid.mode=='grid'){
				strImg = '<span><img class="gridProfileImg img-circle"  src="' +item[fieldImage] + '"></span>';// height ="75" widht="75"
			}else if(!item[fieldImage].length && objGrid.mode=='grid'){
				strImg = '<span class="gridProfileImg">'+item.displayName.split(' ')[0].substring(0,1)+''+item.displayName.split(' ')[1].substring(0,1)+'</span>';
			}
			else{
				strImg = '<span><img height ="45" widht="45" class="img-circle" '+strProgress+'   src="' +item[fieldImage] + '"></span>';
			}
		}
	}
	if(strImg.length < 10 && item[fieldName]){
		var strN = item[fieldName];
		var arrN = strN.split(' ');
		if(arrN.length >= 2){
			strI = arrN[0].substring(0,1)+arrN[1].substring(0,1).toLowerCase();	
		}else if(arrN.length == 1){
			strI = arrN[0].substring(0,1);	
		}
		if(objGrid.mode=='grid' && objGrid.mode !='undefined')
		{
			strImg = '<span class="gridProfileImg">'+strI+'</span>';
		}
		else{
			strImg = '<span class="profileImg">'+strI+'</span>';
		}
		if(typeof objLoader !="undefined" ){
			objLoader.update('images');
		}
		
	}
	return strImg;
}