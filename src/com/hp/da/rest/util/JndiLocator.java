package com.hp.da.rest.util;

import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Anshu 
 * This class is a utility class for doing JNDI Lookup of EJB Bean's.
 */
public class JndiLocator {
	private static final Logger logger = LoggerFactory
			.getLogger(JndiLocator.class);

	/**
	 * This method will lookup EJB bean with the beanName passed as the
	 * parameter for the Onvelop Cloud App.
	 * 
	 * @param beanName
	 * @return Object the EJB reference object
	 */
	public static Object doJndiLookup(String beanName) {
		Object ejbBean = null;
		try {
			InitialContext ctx = new InitialContext();
			ejbBean = ctx.lookup("java:global/DataAnalytics/DataAnalyticsEJB/"
					+ beanName);
			// logger.info("Found EJB with Name: " + ejbBean.toString());

		} catch (NamingException ne) {
			logger.error("Could not lookup ejb bean : " + beanName + ne);
			logger.error("Reason :" + ne.getMessage());
		}
		return ejbBean;
	}

}
