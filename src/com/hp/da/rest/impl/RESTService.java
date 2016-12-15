package com.hp.da.rest.impl;

import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;

import org.jboss.resteasy.spi.HttpRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class RESTService {
	@Context public HttpServletRequest servletRequest;
	@Context public HttpHeaders headers;
	@Context public HttpRequest httpRequest;
	
	private static final Logger logger = LoggerFactory.getLogger(RESTService.class);
		
	protected String getMessageForKeyInLanguage(String key){
		if(key == null || key.isEmpty()) {
			return null;
		}
		List<String> languages = headers.getRequestHeader("User-Language");
		String language = languages == null ? "en_US" : languages.get(0);
		if(!(language.equals("en_US") || language.equals("en_GB"))) {
			language = "en_US";
		}
		//Pass the null value to the bundle while generating the enunciate
		ResourceBundle bundle = (ResourceBundle) servletRequest.getServletContext().getAttribute(language);
//		ResourceBundle bundle = null;
		if(bundle == null){
			String[] languageParts = language.split("_");
			try {
				bundle = ResourceBundle.getBundle("com.hp.da.rest.locale.locale", new Locale(languageParts[0], languageParts[1]));
				//commenting this line while generating the enunciate
				servletRequest.getServletContext().setAttribute(language, bundle);
			} catch (Exception e) {
				return null;
			}
		}		
		return bundle.getString(key);
	}
}
