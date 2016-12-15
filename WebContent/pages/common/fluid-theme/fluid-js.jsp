<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<c:set var="scriptPath" value="../script/"/>
<c:set var="imagesCdnPath" value="../images"/>

<!-- ================================================== javascript start================================================== -->
<script src="<c:out value="${scriptPath}"/>jQuery/jquery-1.10.1.min.js"></script>
<script src="<c:out value="${scriptPath}"/>jQuery/jquery-ui-1.10.3.custom.min.js"></script>
<script src="<c:out value="${scriptPath}"/>jQuery/jquery.ocupload-1.1.2.js"></script>
<script src="<c:out value="${scriptPath}"/>jQuery/jQuery_Forms.js"></script>
<script src="<c:out value="${scriptPath}"/>jQuery/jquery-ui-timepicker-addon.js"></script>
<script src="/bootstrap3/js/bootstrap.min.js"></script>
<script src="<c:out value="${scriptPath}"/>holder/holder.js"></script>
<script src="<c:out value="${scriptPath}"/>google/prettify.js"></script>
<script src="<c:out value="${scriptPath}"/>grid/jquery.jqGrid.min.js"></script>
<script src="<c:out value="${scriptPath}"/>grid/grid.locale-en.js"></script>
<link href="<c:out value="${scriptPath}"/>jQuery/jquery-ui-1.10.3.custom.min.css" rel="stylesheet" />
<link href="<c:out value="${scriptPath}"/>jQuery/jquery-ui-timepicker-addon.css" rel="stylesheet" />
<c:set var="userType" value="${isAdmin ? 'admin' : 'user'}"  />
<script type="text/javascript">
	var homeURL = '/';
	var changeCount='<c:out value="${changeCount}"/>';
	var isAdmin = '<%= (Boolean)session.getAttribute("isAdmin") %>';
    var username = '<%= session.getAttribute("username") %>';
    var isTempPassword = '<%= session.getAttribute("isTempPassword") %>';
    var displayName = '<%= session.getAttribute("displayName") %>';
    var userEmail = '<%= session.getAttribute("userEmail") %>';
	var snLanguage;
    if(typeof snLanguage =="undefined" || snLanguage == 'null'){
    	snLanguage = "en_US";
     }
	$.ajaxSetup({
	    headers: { 
		  'User-Language' : snLanguage
	    },
	    cache: false 
	});
	
	/* if (isTempPassword == "true") {
		window.location = userChangePasswordURL+"?ajax=true";
	} */
	var objLocale = {};
	$.ajax({
		url : '<c:url value="/locale"/>',
		async : false
	}).complete(function(data) {
		objLocale = data.responseJSON;
		if (typeof objLocale != 'object') {
			objLocale = {};
		}
	});

	function translate(tag) {
		if (typeof objLocale[tag] == 'undefined') {
			return tag;
		}
		return objLocale[tag];
	}
</script>
<script src="<c:out value="${scriptPath}"/>jQuery/jquery.base64.min.js"></script>       
<script src="<c:out value="${scriptPath}"/>jQuery/typeahead.js"></script>       
<script src="<c:url value="/script/fluidpages/common/url_encryption.js"/>?change=<c:out value="${changeCount}"/>"></script>
<script src="<c:url value="/script/fluidpages/common/jquery.cookie.js"/>?change=<c:out value="${changeCount}"/>"></script>
<script src="<c:out value="${scriptPath}"/>jQuery/jquery.validate.js"></script>   
<script src="<c:url value="/script/fluidpages/common/validate.extend.js"/>?change=<c:out value="${changeCount}"/>"></script> 
<script src="<c:url value="/script/fluidpages/common/common_helper.js"/>?change=<c:out value="${changeCount}"/>"></script>
<script src="<c:url value="/script/fluidpages/common/common_navigator.js"/>?change=<c:out value="${changeCount}"/>"></script>
<script src="<c:url value="/script/fluidpages/common/common_functions.js"/>?change=<c:out value="${changeCount}"/>"></script>
<script src="<c:url value="/script/fluidpages/common/common_grid.js"/>?change=<c:out value="${changeCount}"/>"></script>
<script src="<c:url value="/script/fluidpages/common/common_notification.js"/>?change=<c:out value="${changeCount}"/>"></script>
<script src="<c:url value="/script/fluidpages/common/common_accordian.js"/>?change=<c:out value="${changeCount}"/>"></script>
<script src="<c:url value="/script/fluidpages/common/common_help.js"/>?change=<c:out value="${changeCount}"/>"></script>

 <!-- ================================================== javascript end================================================== -->

 	<div class="modal fade" id="div_confirmDialog1">
		<div class="modal-dialog">
			 <div class="modal-content">
				<div class="modal-header">
				  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				  <h4 class="modal-title"><fmt:message key="common.dialog.confirm.head"/></h4>
				</div>
				<div class="modal-body">
				  <p id="confirmMessage"><fmt:message key="common.dialog.delete.users"/></p>
				</div>
				<div class="modal-footer">
				 <a href="#" class="btn btn-default" data-dismiss="modal"><fmt:message key="common.delete.no"/></a>
            	 <a href="#" id="btn_delete" class="btn btn-primary"><fmt:message key="common.delete.yes"/></a>
				</div>
			 </div><!-- /.modal-content -->
		</div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
 
