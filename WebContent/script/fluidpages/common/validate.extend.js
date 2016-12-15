/*global $:false, jQuery:false */
var frmErrorDiv = {"ident":"#div_error","enclosed":true,"onfocusout":true};
var strContainer = '<div class="validation rowSpace_2 col-xs-12" id="validationErrorBox"></div>';
function frmValidate(objFrm) {
	if (frmErrorDiv.ident == 'new' || typeof objFrm.find(frmErrorDiv.ident).attr("id") == 'undefined') {
		$("#notificationBoxContainer").append(strContainer);
		frmErrorDiv.ident = "#validationErrorBox";
	}
	var frmInputs = $(objFrm).find("input,select,textarea");
	
	$(objFrm).submit(function (event) {
	    event.preventDefault();
	});
	var objErrorDiv;  
	if (frmErrorDiv.enclosed) {
		objErrorDiv =  objFrm.find(frmErrorDiv.ident);
	} else {
		objErrorDiv = $(frmErrorDiv.ident);
	}
    var tmpValidator = $(objFrm).validate({
//    		errorPlacement: function (error, element) {
//    		objErrorDiv.html('');
//    		frmInputs.removeClass("errorTarget");
//    		element.addClass("errorTarget");
//    		error.appendTo(objErrorDiv);
//    	}
    });
    return tmpValidator;
}


//Available Classes
//Default Classes:	required	email	number	url  maxlength minlength max min
//Custom: textonly	organizationName	domain	ipAddress	pwWifi	description
//ipRoute	numeric1	port	phoneNumber	isPassword	confirmPassword

/**
* Begin: Text only validation for jquery validate
* */
if (typeof jQuery.validator != 'undefined') {
      jQuery.validator.addMethod(
            "textonly", 
            function(value, element)
            {
                valid = false;
                check = /^[a-zA-Z]+$/.test(value);
                if(check)
                    valid = true;
                return this.optional(element) || valid;
            }, 
            jQuery.format("Please only enter alphabetic characters.")
        );
}


/**
* Begin: Greater than
* */
if (typeof jQuery.validator != 'undefined') {
      jQuery.validator.addMethod(
            "is_greater", 
            function(value, element)
            {
            	var valTarget = $("#" + $(element).attr("data_target")).val();
                valid = false;
                if(value >= valTarget){
                    valid = true;                	
                }
                return this.optional(element) || valid;
            }, 
            jQuery.format("Invalid value")
        );
}


/**
* Begin: Greater than
* */
if (typeof jQuery.validator != 'undefined') {
      jQuery.validator.addMethod(
            "is_lesser", 
            function(value, element)
            {
            	var valTarget = $("#" + $(element).attr("data_target")).val();
                valid = false;
                if(value <= valTarget){
                    valid = true;                	
                }
                return this.optional(element) || valid;
            }, 
            jQuery.format("Invalid value")
        );
}

/**
* Begin: Description validation for jquery validate. Description is allowed to have some special chars[] but to avoid XSS attacks will replace unwanted chars.
* */
var arrDescrChars = [">","<","#"];
if(typeof jQuery.validator != 'undefined'){
      jQuery.validator.addMethod(
            "descr_char", 
            function(value, element)
            {
                valid = true;
                $.each(arrDescrChars,function(index,val){
                	if(value.indexOf(val) > -1){
                		valid = false;
                		return false;
                	}
                });
                return this.optional(element) || valid;
            }, 
            jQuery.format("Decription can not have special charecters [\">\",\"<\",\"#\"]")
        );
}
$.validator.addClassRules("descr", { descr_char: true, maxlength: 200});

//End:Text only validation for jquery validate-----

/**
* Begin: Text with '-' validation for jquery validate
* */
if(typeof jQuery.validator != 'undefined'){
      jQuery.validator.addMethod(
            "organizationName", 
            function(value, element)
            {
                valid = false;
                check = /^[a-zA-Z][a-zA-Z0-9\-\_\ ]+$/.test(value);
                if(check)
                    valid = true;
                return this.optional(element) || valid;
            }, 
            jQuery.format("Please enter a valid name.")
        );
}
//End:Text with '-' validation for jquery validate-----

/**
* Begin: Text with '-' validation for jquery validate
* */
if(typeof jQuery.validator != 'undefined'){
      jQuery.validator.addMethod(
            "ssid", 
            function(value, element)
            {
                valid = false;
                check = /^[a-zA-Z][a-zA-Z0-9\$\@\^\`\,\|\%\;\.\~\(\)\/\\\{\}\:\?\[\]\=\-\+\#\!\-\_\ ]+$/.test(value);
                if(check)
                    valid = true;
                return this.optional(element) || valid;
            }, 
            jQuery.format("Please enter a valid Network SSID.")
        );
}
//End:Text with '-' validation for jquery validate-----


/**
* Begin: Text with '-', '_' validation for jquery validate
* */
if(typeof jQuery.validator != 'undefined'){
      jQuery.validator.addMethod(
            "graphName", 
            function(value, element)
            {
                valid = false;
                check = /^[a-zA-Z][a-zA-Z0-9\-\_\ ]+$/.test(value);
                if(check)
                    valid = true;
                return this.optional(element) || valid;
            }, 
            jQuery.format("Please enter a valid graph name.")
        );
}
//End:Text with '-', '_' validation for jquery validate-----

// Android package name validation
if(typeof jQuery.validator != 'undefined'){
    jQuery.validator.addMethod(
          "package", 
          function(value, element)
          {
              valid = false;
              check = /^[a-z][a-z]+$/.test(value);
              if(value != null && value.length >= 5) {
            	  var arr = value.split('.');
            	  if(arr != null && arr.length > 1) {
            		  var i = 0;
            		  for( ; i < arr.length; i++) {
            			  if(arr[i].length == 0 || !(/^[a-z][a-z]+$/.test(arr[i]))) {
            				  break;
            			  }
            		  }
            		  if(i == arr.length) {
            			  valid = true;
            		  }
            	  }
              }
              return this.optional(element) || valid;
          }, 
          jQuery.format("Please enter a valid package name.")
      );
}
//domain validaiton
jQuery.validator.addMethod(
      "domain", 
      function(value, element)
      {
        valid = false;
        
        ////Un-comment to Allow normal urls along with domain.
//        if(value.trim().indexOf("https://") == 0){
//        	value = value.replace("https://","");
//        }else if(value.trim().indexOf("http://") == 0){
//        	value = value.replace("http://","");
//        }
        
        var dot = value.lastIndexOf(".");
        if(dot < 2 || dot >= 57) {
                return this.optional(element) || valid;
        }
        var ext = value.substring(dot + 1, value.length);
        var regex = /^[a-zA-Z]*$/;
        if (!regex.test(ext) || ext.length < 2) {
                return this.optional(element) || valid;
        }
        var dname = value.substring(0,dot);
        for(var j=0; j < dname.length; j++) {
                var dh = dname.charAt(j);
                var hh = dh.charCodeAt(0);
                if((hh > 47 && hh<59) || (hh > 64 && hh<91) || (hh > 96 && hh<123) || hh==45 || hh==46) {
                        if((j==0 || j==dname.length-1) && hh == 45) {
                                return this.optional(element) || valid; // Domain name should not begin are end with '-'
                        }
                } else {
                        return this.optional(element) || valid; // domain name should not have special characters
                }
        }
        valid = true;
        return this.optional(element) || valid;
      }, 
      jQuery.format("Please enter a valid domain name")
  );
//End: Domain validation



//domain validaiton
jQuery.validator.addMethod(
    "domainUrl", 
    function(value, element)
    {
      valid = false;
      
      //Un-comment to Allow normal urls along with domain.
      if(value.trim().indexOf("https://") == 0){
      	value = value.replace("https://","");
      }else if(value.trim().indexOf("http://") == 0){
      	value = value.replace("http://","");
      }
      
      var dot = value.lastIndexOf(".");
      if(dot < 2 || dot >= 57) {
              return this.optional(element) || valid;
      }
      var ext = value.substring(dot + 1, value.length);
      var regex = /^[a-zA-Z]*$/;
      if (!regex.test(ext) || ext.length < 2) {
              return this.optional(element) || valid;
      }
      var dname = value.substring(0,dot);
      for(var j=0; j < dname.length; j++) {
              var dh = dname.charAt(j);
              var hh = dh.charCodeAt(0);
              if((hh > 47 && hh<59) || (hh > 64 && hh<91) || (hh > 96 && hh<123) || hh==45 || hh==46) {
                      if((j==0 || j==dname.length-1) && hh == 45) {
                              return this.optional(element) || valid; // Domain name should not begin are end with '-'
                      }
              } else {
                      return this.optional(element) || valid; // domain name should not have special characters
              }
      }
      valid = true;
      return this.optional(element) || valid;
    }, 
    jQuery.format("Please enter a valid domain name")
);
//End: Domain validation

//ipAddress validaiton

	jQuery.validator.addMethod(
	    "ipAddress", 
	    function(value, element)
	    {
	      valid = false;
	      var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	      if(!value.match(ipformat)) {
	    	  return this.optional(element) || valid;
	      }
      valid = true;
      return this.optional(element) || valid;
    }, 
    jQuery.format("Please enter a valid ip address")
);

//End: ipAddress validation

	
//serverAddress validaiton
jQuery.validator.addMethod(
      "serverAddress", 
      function(value, element)
      {
        valid = false;
        var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if(value.match(ipformat)) {
	    	  return this.optional(element) || true;
	    }else{
	    	 var dot = value.lastIndexOf(".");
	         if(dot < 2 || dot >= 57) {
	                 return this.optional(element) || valid;
	         }
	         var ext = value.substring(dot + 1, value.length);
	         var regex = /^[a-zA-Z]*$/;
	         if (!regex.test(ext) || ext.length < 2) {
	                 return this.optional(element) || valid;
	         }
	         var dname = value.substring(0,dot);
	         for(var j=0; j < dname.length; j++) {
	                 var dh = dname.charAt(j);
	                 var hh = dh.charCodeAt(0);
	                 if((hh > 47 && hh<59) || (hh > 64 && hh<91) || (hh > 96 && hh<123) || hh==45 || hh==46) {
	                         if((j==0 || j==dname.length-1) && hh == 45) {
	                                 return this.optional(element) || valid; // Domain name should not begin are end with '-'
	                         }
	                 } else {
	                         return this.optional(element) || valid; // domain name should not have special characters
	                 }
	         }	
	    }       
        valid = true;
        return this.optional(element) || valid;
      }, 
      jQuery.format("Please enter a valid domain name")
  );
//End: serverAddress validation


//ipRoute validaiton
jQuery.validator.addMethod(
"ipRoute", 
function(value, element)
{
  valid = false;
  var tempName = value;
  var slash = tempName.lastIndexOf("/");
  if(slash==-1){
  	 return this.optional(element) || valid;
  }
  var routes = tempName.substring(slash + 1, tempName.length);
  var ip = tempName.substring(0,slash);
  
  //Validate Ip
  var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if(!ip.match(ipformat)) {
	  return this.optional(element) || valid;
  }
  //Validate Route
  if(routes > 32 || !(routes.length > 0)){
  	  return this.optional(element) || valid;
	}
  
  valid = true;
  return this.optional(element) || valid;
}, 
jQuery.format("Please enter a valid forwarding route")
);
//End: ipRoute validation


//Numeric with value greater than 1
$.validator.addClassRules("numeric1", { number: true, min: 1 });

$.validator.addClassRules("port", { number: true, maxlength: 5,max:65535 });



$.validator.addMethod("phoneNumber_maxlength", $.validator.methods.maxlength,"Phone number should not be greater than {0} digit");
$.validator.addMethod("phoneNumber_minlength", $.validator.methods.minlength,$.format("Phone number must have at least {0} digit"));
$.validator.addClassRules("phoneNumber", { number: true, phoneNumber_maxlength: 12,phoneNumber_minlength:8 });

// Classes for nav password reset form
$.validator.addMethod("p_equalTo", $.validator.methods.equalTo,"Passwords did not match");
$.validator.addMethod("p_minlength", $.validator.methods.minlength,$.format("Password must have at least {0} characters"));

$.validator.addClassRules("isPassword", { required: true, p_minlength: 6,maxlength:50 });
$.validator.addClassRules("confirmPassword", { required: true, p_minlength: 6,maxlength:50,p_equalTo:'#header_txt_newPwd' });

$.validator.addClassRules("pwWifi", { required: true, p_minlength: 8, maxlength:50 });
$.validator.addClassRules("confirmWifiPassword", { required: true, maxlength:50, p_equalTo:'#password' });

//Firmware Version
$.validator.addMethod("firmware_is_greater", $.validator.methods.is_greater,"Upper version can't be less than lower version!");
$.validator.addMethod("firmware_is_lesser", $.validator.methods.is_lesser,"Lower version can't be greater than upper version!");

//Custom Messages
jQuery.extend(jQuery.validator.messages, {
	required: "Mandatory field/s is required.",
	remote: "Please fix this field.",
	number: "Please enter a valid number."});

function checkUrl(url) {
	var pattern = new RegExp(
			/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
	return pattern.test(url);
}