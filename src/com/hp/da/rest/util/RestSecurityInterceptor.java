/**
 * 
 */
package com.hp.da.rest.util;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;

import org.jboss.resteasy.annotations.interception.ServerInterceptor;
import org.jboss.resteasy.core.ResourceMethod;
import org.jboss.resteasy.core.ServerResponse;
import org.jboss.resteasy.spi.HttpRequest;
import org.jboss.resteasy.spi.UnauthorizedException;
import org.jboss.resteasy.spi.interception.PreProcessInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Provider
@ServerInterceptor
public class RestSecurityInterceptor implements PreProcessInterceptor {
	
	private static final Logger logger = LoggerFactory.getLogger(RestSecurityInterceptor.class);
	@Context HttpServletRequest httpRequest;
	@Override
	public ServerResponse preProcess(HttpRequest request, ResourceMethod method) throws UnauthorizedException {
		ServerResponse serverResponse = permissionsCheck(request, method);
		if(null != serverResponse){
			logger.info("IP:'"+ httpRequest.getRemoteAddr() +"' message:'"+ serverResponse.getEntity() +"' URI:'"+ request.getUri().getAbsolutePath().toString()+"'");
		}
		return serverResponse;
	}
	private ServerResponse permissionsCheck(HttpRequest request, ResourceMethod method){
		ServerResponse response = null;
		return response;
		/* Permissions permissions = method.getMethod().getAnnotation(Permissions.class);
		
		// if request is for noSession resource 
		if(permissions != null && permissions.noSession()){
			return response;
		}else{
			if(permissions == null){
				return new ServerResponse("@Permissions is missing in api", 401, new Headers<Object>());
			}
			//Get request headers
			final HttpHeaders headers = request.getHttpHeaders();
			
			//Fetch authorization header
			final List<String> authorization = headers.getRequestHeader("X-Session-Auth");

			//If no authorization information present; block access
			if(authorization == null || authorization.isEmpty())
			{
				return new ServerResponse("Auth Header Missing", 401, new Headers<Object>());
			}else{
				UserManager mgr = (UserManager) JndiLocator.doJndiLookup("UserManagerBean");
				UserSession userSession = mgr.getSession(authorization.get(0));
				if (null != userSession) {
					//Check to prevent DOS Attack.
					if(userSession.getDeviceType().equals("MSA") && userSession.getDailyApiLimit() <= 0 ){
						return 	new ServerResponse("DAILY_API_LIMIT_BREACHED", HttpStatusCode.DAILY_API_LIMIT_BREACHED, new Headers<Object>());
					}
				
					if(permissions.device() && userSession.getDeviceType().equals("MSA")){
						return response;
					}else if(permissions.noRole() && userSession.getDeviceType().equals("MSC")){
						return response;
					}else if(null != permissions.role() && !permissions.role().type().equals(Type.NONE) && !permissions.role().subType().equals(SubType.NONE)){
						if(null != userSession.getRole()){
							Gson gson = new Gson();
							UserRoleDto  userRoleDto  = gson.fromJson(userSession.getRole(), UserRoleDto .class);
							Map<String,Boolean> subtype = userRoleDto.getAccess().get(permissions.role().type().toString());
							if(null != subtype){
								if(new Boolean(subtype.get(permissions.role().subType().toString()))){
									return response;
								}else {
									response = new ServerResponse("Access denied for this resource", 401, new Headers<Object>());
								}
							} else {
								response = new ServerResponse("Access denied for this resource", 401, new Headers<Object>());
							}
						} else {
							response = new ServerResponse("Access denied for this resource", 401, new Headers<Object>());
						}
					}
				}else{
					response = new ServerResponse("Access denied for this resource", 401, new Headers<Object>());
				}
			}
		}
		return response;
	*/}
}
