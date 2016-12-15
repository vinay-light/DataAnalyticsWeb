package com.hp.da.web.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.hp.da.common.AppInitializer;
import com.hp.da.util.misc.Constants;

/**
 * Servlet implementation class DownloadLogServlet
 */
@WebServlet("/downloadFile")
public class DownloadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DownloadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String uri = "http://localhost:"+AppInitializer.getAppConstant(Constants.HTTP_PORT_NUMBER_KEY)+"/api/device/v1/getHPObjectStorageToken";
		String resourceURL = request.getParameter("URL");
		HttpGet httpGet = new HttpGet(uri);
		httpGet.setHeader("Content-Type", "application/json");
		httpGet.setHeader("X-Session-Auth", (String)request.getSession().getAttribute("sessionSecret"));
		CloseableHttpResponse  resp = httpclient.execute(httpGet);
		StringBuilder sb = new StringBuilder();
		if(resp.getStatusLine().getStatusCode() == 200){
			HttpEntity entity = resp.getEntity();
			InputStream is = entity.getContent();
			BufferedReader reader = new BufferedReader(new InputStreamReader(is , "iso-8859-1"), 8);

			String line = null;
			while ((line = reader.readLine()) != null) {
				sb.append(line + "\n");
			}
			is.close();
			JsonParser parser = new JsonParser();
			JsonObject o = (JsonObject)parser.parse(sb.toString());
			String token = null;
			if(o.get("httpStatusCode").toString().equals("200")){
				token = o.get("data").getAsJsonObject().get("token").getAsString();
				setContentTypeAndHeader(response, resourceURL);
				getResourceAndWriteToStream(response, httpclient, resourceURL,token);			
				response.setStatus(200);
			} else {
				response.sendError(400, "Debug Log file cannot be exported. Please try after some time.");
			}
		}
	}

	/**
	 * @param response
	 * @param httpclient
	 * @param resourceURL
	 * @param token
	 * @throws IOException
	 * @throws ClientProtocolException
	 */
	private void getResourceAndWriteToStream(HttpServletResponse response,
			CloseableHttpClient httpclient, String resourceURL, String token)
			throws IOException, ClientProtocolException {
		HttpGet httpGet;
		HttpEntity entity;
		httpGet = new HttpGet(resourceURL);
		httpGet.setHeader("X-Auth-Token", token);
		CloseableHttpResponse  cloudResp = httpclient.execute(httpGet);
		entity = cloudResp.getEntity();
		OutputStream out = response.getOutputStream();
		InputStream in = entity.getContent();
		byte[] buffer = new byte[4096];
		int length;
		while ((length = in.read(buffer)) > 0){
			out.write(buffer, 0, length);
		}
		in.close();
		out.flush();
	}

	/**
	 * @param response
	 * @param resourceURL
	 */
	private void setContentTypeAndHeader(HttpServletResponse response,String resourceURL) {
		response.setContentType("text/*; charset=us-ascii");
		int index = resourceURL.lastIndexOf("/");
		String name = resourceURL.substring(index+1, resourceURL.length());
		if (resourceURL.contains("txt.gz") || resourceURL.contains(".txt")) {
			response.setHeader("Content-Disposition","attachment; filename="  + name);
		} else if(resourceURL.contains("apk")){
			String[] apkNameParts = resourceURL.split("/");
			response.setHeader("Content-Disposition","attachment; filename=\""+apkNameParts[apkNameParts.length-1]+"\"");
			response.setContentType("application/vnd.android.package-archive");
		} 
		else {
			response.setHeader("Content-Disposition","attachment; filename=\"device.log\"");
		}
	}

}
