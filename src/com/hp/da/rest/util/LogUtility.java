/**
 * 
 */
package com.hp.da.rest.util;

import java.util.Date;

import com.google.gson.Gson;

public class LogUtility {

	static Gson gson = new Gson();

	// Logging Request Details
	/**
	 * This method will log all incoming request. This will log the HTTP params
	 * & URL Info.
	 * 
	 * @param url
	 * @param obj
	 * @return
	 */
	public static String logRequest(String url, Object obj) {
		StringBuilder sb = new StringBuilder();
		sb.append("Client IP Address: " + url + "####");
		sb.append("Time: " + new Date() + "####");
		sb.append("Request: " + gson.toJson(obj));
		return sb.toString();
	}

	// Logging Response Details
	/**
	 * This method will log all outgoing response. This will log all outgoing
	 * HTTP response from MSC.
	 * 
	 * @param url
	 * @param obj
	 * @return
	 */
	public static String logResponse(String url, Object obj) {
		StringBuilder sb = new StringBuilder();
		sb.append("Client IP Address: " + url + "####");
		sb.append("Time: " + new Date() + "####");
		sb.append("Response: " + gson.toJson(obj));
		return sb.toString();
	}

}
