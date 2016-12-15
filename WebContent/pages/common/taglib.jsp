<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator" prefix="decorator" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="changeCount" value="6"/>
<c:if test="${empty userLocale}">
	<c:set var="userLocale" value="en_US" scope="session" />
</c:if>
<fmt:setLocale value="${userLocale}" />
<c:set var="scriptPath" value="../script/"/>
<c:set var="imagesCdnPath" value="../images"/> 

 <%if(session.getAttribute("username") == null){ %>
	<c:redirect url ="/" />  
<%} %> 

<script type="text/javascript">
var imagesCdnPath = '<c:out value="${imagesCdnPath}"/>';
</script>