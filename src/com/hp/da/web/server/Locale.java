package com.hp.da.web.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.MediaType;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import com.google.gson.Gson;

/**
 * Servlet implementation class Locale
 */
@WebServlet("/locale")
public class Locale extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    
	/**
	 *  This function will be used for setting user custom locale  language.
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Properties localeData = new Properties();
		String locale = (String) request.getSession().getAttribute("userLocale");
		URL url = null;
		if(null != locale && locale.equalsIgnoreCase("en_gb")){
				url = Thread.currentThread().getContextClassLoader().getResource("/com/hp/da/web/locale/locale_en_GB.properties"); 
		}else{
			url = Thread.currentThread().getContextClassLoader().getResource("/com/hp/da/web/locale/locale_en_GB.properties"); 
		}
		localeData.load(url.openStream());	
		Gson gson = new Gson();
		PrintWriter out = response.getWriter();
		response.setContentType(MediaType.APPLICATION_JSON);
		out.print(gson.toJson(localeData));
	}

	/**
	 * This function will be used for setting user custom locale  language.
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String requestedLocale = request.getParameter("locale");
		PrintWriter out = response.getWriter();
		response.setContentType(MediaType.APPLICATION_JSON);
		if(null != requestedLocale && !requestedLocale.equals("")){	
			if(requestedLocale.equals("en_GB") || requestedLocale.equals("en_US")){
				HttpSession session = request.getSession();
				
				session.setAttribute("userLocale", requestedLocale);
				Long userId = (Long) session.getAttribute("userId");
				if (userId != null) {
					setLanguage(userId, requestedLocale,
							session.getAttribute("sessionSecret").toString(),
							response);
				}
				out.print("{ \"result\" : true}");
				out.flush();
				out.close();
				return;
			} else {
				out.print("{ \"result\" : false}");
				out.flush();
				out.close();
				return;
			}
		} else {
			out.print("{ \"result\" : false}");
			out.flush();
			out.close();
			return;
		}
	}

	private void setLanguage(long userId, String language,
			String sessionSecret, HttpServletResponse response)
			throws ClientProtocolException, IOException {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String uri = "http://localhost:8080"
				+ "/api/user/v1/changeLanguage";
		uri = uri + "?userId=" + userId + "&language=" + language;
		HttpGet httpGet = new HttpGet(uri);
		httpGet.setHeader("Content-Type", "application/json");
		httpGet.setHeader("X-Session-Auth", sessionSecret);
		response.setContentType("application/json");
		CloseableHttpResponse resp = httpclient.execute(httpGet);
		StringBuilder sb = new StringBuilder();
		if (resp.getStatusLine().getStatusCode() == 200) {

			HttpEntity entity = resp.getEntity();
			// System.out.println("entity value; "+entity.getContent());
			InputStream is = entity.getContent();
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					is, "iso-8859-1"), 8);

			String line = null;
			while ((line = reader.readLine()) != null) {
				sb.append(line + "\n");
			}
			is.close();
		}
	}
}
