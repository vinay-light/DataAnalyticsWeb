package com.hp.da.web.server;

import java.io.IOException;
import java.io.PrintWriter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class SSOAuthConsumerService
 */
@WebServlet("/servlets/samlConsumerServlet")
public class SamlConsumerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	/** Our logger */
	private static final Logger logger = LoggerFactory.getLogger(SamlConsumerServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		accessControlService(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		accessControlService(request, response);
	}

	/**
	 * This is the handler for the initial acs(Access Control Service) page.
	 * This receives the browser after it has visited the IdP(Identity
	 * Provider).
	 * @throws IOException 
	 */
	public void accessControlService(HttpServletRequest request, HttpServletResponse response) throws IOException {
		logger.info("User login with SAML response begin.");
		boolean isMSA = false;
		if(!(null == request.getCookies())){
			for (Cookie cookie : request.getCookies()) {
				if (cookie.getName().equals("type") && cookie.getValue().equals("MSA")) {
					isMSA = true;
					cookie.setMaxAge(0);
					response.addCookie(cookie);
				}
			}
		}
		StringBuilder htmlDoc = new StringBuilder("<html>");
		htmlDoc.append("<head>");
		htmlDoc.append("<script src='/script/jQuery/jquery-1.10.1.min.js'></script>");
		if(isMSA){
			htmlDoc.append("<script>window.location='msaconnect://saml/targetresponse?SAMLResponse="+request.getParameter("SAMLResponse")+"';</script>");
		} else {
			htmlDoc.append("<script> var samlObj = {SAMLResponse:'"+request.getParameter("SAMLResponse")+"'}; \n "
					+ "$(function() {"
						+ "if(window.opener!=null){"
							+ "window.opener.doAdfsSAMLLogin(samlObj);"
						+ "}else{"
						+ 	"$.ajax({"
						+ "		type : 'POST',"
					    + "   	url : '/servlets/login',"
					    + "    	data : {"
					    + "        'SAMLResponse' : samlObj.SAMLResponse,"
					    + "        'isSAMLLogin' : 'true'"
					    + "    	},"
					    + "    	dataType : 'json'"
					    + "	}).complete(function(data) {"
					    + " 	if (data.responseJSON != null) {"
					    + "     	if (data.responseJSON.httpStatusCode == 200) {"
					    + "         	window.location='/'"
					    + "         } else if (data.responseJSON.httpStatusCode == 400 || data.responseJSON.httpStatusCode == 401) {"
					    + "         	$('body').html('No such user with enterprise id exists in HP Mobile Smart<a href=\"/\">Click here</a>');"
					    + "         }"
					    + "     }"
					    + "	});"
						+ "}"
					+ "});</script>");
		}
		htmlDoc.append("</head>");
		htmlDoc.append("<body></body></html>");
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();		
		out.print(htmlDoc);
		out.flush();
		out.close();
		logger.info("User login with SAML response end.");
	}
}
