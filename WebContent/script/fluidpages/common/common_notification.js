/**
 * This file contains Notifications functions such as show notification, progressbar related functions etc.
 * */
/*global $:false, jQuery:false */

/**
 * Function to simulate progressbar. Id and initial width are set by
 * progressBarId and progressBarWidth This function only supports one progress
 * bar per page.
 */
var objProgressBar = {};
var uploadCompleted = 0;
objProgressBar.id = "containerProgressBar";
objProgressBar.width = 1;
objProgressBar.height = 15;
objProgressBar.margin = '5px 5px';
objProgressBar.created = false;
objProgressBar.type = "info"; //danger/success/warning
objProgressBar.interrupt = false;
function simulateProgressBar(target) {
	var target = target;
	if(typeof target !='object'){
		if(typeof target =='string'){
			objProgressBar.id = target;
		}
		target =  $("#" + objProgressBar.id);
	}
	if(typeof target.attr("data_created")=='undefined'){
		target.attr("data_width",objProgressBar.width);
		target.attr("data_height",objProgressBar.height);
		target.attr("data_margin",objProgressBar.margin);
		target.attr("data_created",objProgressBar.created);
		target.attr("data_type",objProgressBar.type);
		target.attr("data_interrupt",objProgressBar.interrupt);
	}
    if(target.attr("data_created")!="true"){
        target.removeAttr("data_uploadCompleted"); 
        var strProgressBar = '<div class="progress progress-striped">';
        strProgressBar +='<div class="progress-bar progress-bar-'+target.attr("data_type")+'" role="progressbar" aria-valuenow="0"';
        strProgressBar +=' aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
        strProgressBar +='<span class="sr-only">0% '+translate("common.notification.complete")+'</span>';
        strProgressBar +='</div></div>';
        target.html('');//target.attr("data_")
        target.html(strProgressBar);
		target.find(".progress").css('height', target.attr("data_height")+'px');
		target.find(".progress").css('margin',target.attr("data_margin"));
		target.attr("data_created","true");
    }
	var progressLine = target.find(".progress-bar");
	var progressSrc = target.find(".sr-only");
    target.css('display', '');
    target.css('visibility', '');
    var uploadDone = "0";
    if(typeof target.attr("data_uploadCompleted") == "undefined"){
    	uploadDone = uploadCompleted;
    }else{
    	uploadDone = target.attr("data_uploadCompleted");
    }
    if(target.attr("data_interrupt")=='true'){
    	target.attr("data_interrupt","false");
    }else if (uploadDone == 0){
    		var width = parseFloat(target.attr("data_width"));
            if (width < 98) {
                var widthF = Math.floor(width);
                var widthF2 = width.toFixed(2)
                progressLine.attr("aria-valuenow", widthF2);
                progressLine.css("width", widthF2+'%');
                progressSrc.html(widthF+"% "+translate("common.notification.complete"));
                i = (100 - width) / 150;
                i = 0.3 + 0.5 * Math.random();
                // console.log(i + '---' + progressBarWidth);
                width = width + i;
                target.attr("data_width",width);
            }
            objProgressBar.id = target.attr("id");
            setTimeout(simulateProgressBar, 50);

    } else {
    	progressLine.css("trastion","all 200ms linear");
    	progressLine.attr("aria-valuenow", 100);
    	progressLine.css("width", 100+'%');
    	progressSrc.html(100+"% "+translate("common.notification.complete"));
    	setTimeout(function(){
            target.css('visibility', 'hidden');
            target.attr("aria-valuenow", 0);
//            $("#" + objProgressBar.id + " .progress-bar").css("trastion","all 200ms linear");
            progressLine.css("width", 0+'%');
            progressSrc.html(Math.floor(0)+"% "+translate("common.notification.complete"));
            uploadCompleted = 0;
            target.attr("data_width",0); 
		},600);
    }
}

// End: Function to simulate progressbar.---------------------



function showError(errMsg) {
	objNotification.error = errMsg;
	showNotification();
}

var objPageLoad = {};
var pageLoadTypes ={
	"ready":{"type":"ready","percentage":10,"count":1,"text":"Getting Ready"}
	,"request":{"type":"request","percentage":10,"count":1,"text":"Fetching Data"}
	,"process":{"type":"process","percentage":40,"count":1,"text":"Processing Data"}
	,"images":{"type":"ready","percentage":40,"count":1,"text":"Loading Images"}
} ;
function loadProgess(target){
	var objProgress = {};
	objProgress.target = target;
	if(typeof target == "string"){
		objProgress.objTarget = $(target);
	}else if(typeof target == 'object'){
		objProgress.objTarget = target;
	} else{
		objProgress.objTarget = $(".navbar.navbar-inverse.navbar-fixed-top");		
	}
	objProgress.progress = 0;
	objProgress.template = '<div class="progressLine" role="bar"><div class="peg"></div></div>';//<div class="spinner" role="spinner"><div class="spinner-icon"></div></div>
	objProgress.config = pageLoadTypes;
	objProgress.update = function(type){
		
		if(objProgress.objTarget.find(".progressLine").length==0){
			objProgress.objTarget.prepend(objProgress.template);
			objProgress.progressBar = objProgress.objTarget.find(".progressLine")[0];
		}else{
			objProgress.progressBar = objProgress.objTarget.find(".progressLine")[0];		
		}
		
		if(typeof objProgress.target =='undefined'){
			$(objProgress.progressBar).addClass("lower");
		}
		
		if(type != 'undefined'){
			if(typeof objProgress.config[type] != 'undefined'){
				objProgress.progress += objProgress.config[type].percentage/objProgress.config[type].count;
			}
		}		
		$(objProgress.progressBar).css("width",objProgress.progress+"%");	
		if(objProgress.progress >= 99){
			objProgress.progress = 0;
			setTimeout(function(){$(objProgress.progressBar).remove();},700);
			
		}
	}
	
	return objProgress;
	
}
