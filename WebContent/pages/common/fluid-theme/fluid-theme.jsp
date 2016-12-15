<%@include file="/pages/common/taglib.jsp" %>
<!DOCTYPE html>
<html>
	<head>
		<title> Device Analytics | <decorator:title /> </title>
		<link rel="shortcut icon" href="<c:out value="${imagesCdnPath}"/>/hp.ico" />
		<link rel="shortcut icon" href="<c:out value="${imagesCdnPath}"/>/hp.ico" />
		<link rel="image_src" href="<c:out value="${imagesCdnPath}"/>/hp.ico" />
		<meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <meta name="description" content="HP Fleet Management System">
	    <meta name="author" content="Gaurav Roy">

		<%@include file="/pages/common/fluid-theme/fluid-css.jsp" %>
		<%@ include file="/pages/common/fluid-theme/fluid-js.jsp"%>		
		<decorator:head />
	</head>
	
	<!-- Structure of a page 
		______________________________________________________________________________
		Navbar #1				(fluid-theme-navbars.jsp) 
		______________________________________________________________________________
		Navbar #2 				(fluid-theme-navbars.jsp)
		______________________________________________________________________________
		ActionBar 				(ActionBar.jsp)	
		______________________________________________________________________________
		Alerts Area				?????
		______________________________________________________________________________
		NavPills/NavTabs/Filters
		______________________________________________________________________________
		Main form area			(as per page)
		______________________________________________________________________________
		Pagination Area			(as per page)
		______________________________________________________________________________
		ActionBar 				(ActionBar.jsp)	
		______________________________________________________________________________
		Footer					???????
		______________________________________________________________________________
	-->
	<%


	if(session.getAttribute("isTempPassword") == "true"){%>
		<c:set var="userType" value="${isAdmin ? 'admin' : 'user'}"  />
		<c:redirect url ="/pages/changePassword?ajax=true" />
		
	<%
	}
	%>
	<body>
		<div id="body">
			<!--  Navbars (Two Levels will be rendered -->
			<%@ include file="/pages/common/fluid-theme/fluid-theme-navbars.jsp"%>
			<%@ include file="/pages/common/fluid-theme/fluid-theme-actionbar.jsp"%>
		
			<div class="container" id="containerMain">
				<decorator:body />
			</div>
			
			<%@ include file="/pages/common/fluid-theme/fluid-theme-actionbar.jsp"%>
			<%@ include file="/pages/common/fluid-theme/fluid-theme-footer.jsp"%>
		</div>
	</body>
</html>