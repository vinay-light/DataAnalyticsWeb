package com.hp.da.rest.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hp.da.common.exception.DataAnalyticsException;
import com.hp.da.ejb.impl.GraphManagerBean;
import com.hp.da.ejb.impl.UserManagerBean;
import com.hp.da.ejb.itf.GraphManager;
import com.hp.da.rest.dto.AnalyticsData;
import com.hp.da.rest.dto.BuildwiseGraphDataEntry;
import com.hp.da.rest.dto.GraphDataDto;
import com.hp.da.rest.dto.GraphDataEntry;
import com.hp.da.rest.dto.UIAnalytics;
import com.hp.da.rest.dto.UserDefinedGraphSettingsDto;
import com.hp.da.rest.dto.UserDefinedGraphSettingsDto.GraphConfigurationDto;
import com.hp.da.rest.itf.GraphServiceItf;
import com.hp.da.rest.response.Response;
import com.hp.da.rest.util.JndiLocator;
import com.hp.da.util.enums.SecondaryParameterTypes;
import com.hp.da.util.misc.HttpStatusCode;

public class GraphServiceImpl implements GraphServiceItf {
	
	private static final Logger logger = LoggerFactory.getLogger(UserManagerBean.class);

	@Override
	public Response<List<BuildwiseGraphDataEntry<Double>>> generateStabilityUptimePerBuildByModelAndGroup(long modelId, long groupId) {
		Response<List<BuildwiseGraphDataEntry<Double>>> response = new Response<List<BuildwiseGraphDataEntry<Double>>>("Invalid Parameters", HttpStatusCode.INCORRECT_PARAMS, null);
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			List<BuildwiseGraphDataEntry<Double>> graphData = graphManager.getDeviceStabilityUptimeForModelAndGroupPerBuildInHours(modelId, groupId, false);

			response.buildResponseForSuccess();
			response.setData(graphData);
			return response;
		} catch (DataAnalyticsException e) {
			logger.error("Exception occurred. Trace : "+e);
			response.setMessage(e.getMessage());
			return response;
		}
	}

	@Override
	public Response<List<GraphDataEntry<Double>>> generateStabilityUptimePerDeviceByModelAndGroup(long modelId, long groupId, String buildName) {
		Response<List<GraphDataEntry<Double>>> response = new Response<List<GraphDataEntry<Double>>>("Invalid Parameters", HttpStatusCode.INCORRECT_PARAMS, null);
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			List<GraphDataEntry<Double>> graphData = graphManager.getDeviceStabilityUptimeForModelAndGroupPerDeviceInHours(modelId, groupId, buildName, false);

			response.buildResponseForSuccess();
			response.setData(graphData);
			return response;
		} catch (DataAnalyticsException e) {
			logger.error("Exception occurred. Trace : "+e);
			response.setMessage(e.getMessage());
			return response;
		}
	}

	@Override
	public Response<List<BuildwiseGraphDataEntry<Double>>> generateBatteryAnalyticsChartPerBuild(long modelId, long groupId) {
		Response<List<BuildwiseGraphDataEntry<Double>>> response = new Response<List<BuildwiseGraphDataEntry<Double>>>("Invalid Parameters", HttpStatusCode.INCORRECT_PARAMS, null);
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			List<BuildwiseGraphDataEntry<Double>> graphData = graphManager.getBatteryAnalyticsPerBuild(modelId, groupId, false);
			response.buildResponseForSuccess();
			response.setData(graphData);
			response.setMessage("Graph data retrieved successfully");
			return response;
		} catch (DataAnalyticsException e) {
			logger.error("Exception occurred. Trace : "+e);
			e.printStackTrace();
			response.setMessage(e.getMessage());
			return response;
		}
	}

	@Override
	public Response<List<GraphDataEntry<Double>>> generateBatteryAnalyticsChartPerDevice(
			long modelId, long groupId, String buildName) {
		Response<List<GraphDataEntry<Double>>> response = new Response<List<GraphDataEntry<Double>>>("Invalid Parameters", HttpStatusCode.INCORRECT_PARAMS, null);
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			List<GraphDataEntry<Double>> graphData = graphManager.getBatteryAnalyticsPerDevice(modelId, groupId, buildName, false);
			response.buildResponseForSuccess();
			response.setData(graphData);
			response.setMessage("Graph data retrieved successfully");
			return response;
		} catch (DataAnalyticsException e) {
			logger.error("Exception occurred. Trace : "+e);
			e.printStackTrace();
			response.setMessage(e.getMessage());
			return response;
		}
	}

	@Override
	public Response<Map<String, Double>> generateBatteryAnalyticsChartPerComponentOfDevice(long modelId, long groupId,
			String buildName, String deviceSerialNo) {
		Response<Map<String, Double>> response = new Response<Map<String, Double>>("Invalid Parameters", HttpStatusCode.INCORRECT_PARAMS, null);
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			Map<String,Double> graphData = graphManager.getBatteryAnalyticsForDevicesComponents(modelId, groupId, buildName, deviceSerialNo);
			response.buildResponseForSuccess();
			response.setData(graphData);
			response.setMessage("Graph device component data retrieved successfully");
			return response;
		} catch (DataAnalyticsException e) {
			logger.error("Exception occurred. Trace : "+e);
			e.printStackTrace();
			response.setMessage(e.getMessage());
			return response;
		}
	}

	@Override
	public Response<UIAnalytics> generateUiAnalyticsChartPerBuild(
			long modelId, long groupId, String type) {
		Response<UIAnalytics> response = new Response<UIAnalytics>("Invalid Parameters", HttpStatusCode.INCORRECT_PARAMS, null);
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			UIAnalytics graphData = graphManager.generateUiAnalyticsChartPerBuild(modelId, groupId, type, false);
			response.buildResponseForSuccess();
			response.setData(graphData);
			response.setMessage("Graph data retrieved successfully");
			return response;
		} catch (DataAnalyticsException e) {
			logger.error("Exception occurred. Trace : " + e.getMessage());
			response.setMessage(e.getMessage());
			return response;
		}
	}

	@Override
	public Response<UIAnalytics> generateUiAnalyticsChartPerDevice(
			long modelId, long groupId, String buildName, String type) {
		Response<UIAnalytics> response = new Response<UIAnalytics>("Invalid Parameters", HttpStatusCode.INCORRECT_PARAMS, null);
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			UIAnalytics graphData = graphManager.generateUiAnalyticsChartPerDevice(modelId, groupId, buildName, type, false);
			response.buildResponseForSuccess();
			response.setData(graphData);
			response.setMessage("Graph data retrieved successfully");
			return response;
		} catch (DataAnalyticsException e) {
			logger.error("Exception occurred. Trace : " + e.getMessage());
			response.setMessage(e.getMessage());
			return response;
		}
	}

	@Override
	public Response<List<AnalyticsData>> generateAnalyticsTableDataBuildWise(
			long modelId, long groupId) {
		Response<List<AnalyticsData>> response = null;
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			List<AnalyticsData> graphData = graphManager.generateAnalyticsTableDataBuildWise(modelId, groupId, false);
			response = new Response<List<AnalyticsData>>("Table data retrieved successfully", HttpStatusCode.SUCCESS, graphData);
		} catch (DataAnalyticsException e) {
			response = new Response<List<AnalyticsData>>(e.getMessage(), HttpStatusCode.INCORRECT_PARAMS, null);
			logger.error("Exception occurred. Trace : " + e.getMessage());
		}
		return response;
	}

	@Override
	public Response<Map<String,Set<String>>> generateDynamicGraphEventDetails() {
		Response<Map<String,Set<String>>> response = null;
		
		GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
		Map<String,Set<String>> settingsDetails = graphManager.getAllEventsAndPackages();
			
			
			/**
			 * code to add secondary axis indices values with package names.
			 * Package name is included only for COMPONENT_LAUNCH_COUNT indices
			 */
		Set<String> secondaryEventDetails = new HashSet<String>();
		for(SecondaryParameterTypes val : SecondaryParameterTypes.values()){
			secondaryEventDetails.add(val.toString());
				
		}
		settingsDetails.put("secondary", secondaryEventDetails);
		response = new Response<Map<String,Set<String>>>("Settings details retrieved successfully", HttpStatusCode.SUCCESS, settingsDetails);
		return response;
	}

	@Override
	public Response<GraphDataDto> generateDynamicGraphContentDetails(long dynamicGraphId, long modelId, long groupId) {
		Response<GraphDataDto> response = null;
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			GraphDataDto eventDetails = graphManager.generateDynamicGraphContentDetails(dynamicGraphId, modelId, groupId);
			response = new Response<GraphDataDto>("Event details retrieved successfully", HttpStatusCode.SUCCESS, eventDetails);
		} catch (DataAnalyticsException e) {
			response = new Response<GraphDataDto>(e.getMessage(), HttpStatusCode.INCORRECT_PARAMS, null);
			logger.error("Exception occurred. Trace : " + e.getMessage());
		}
		return response;
	}

	@Override
	public Response<Map<String, Map<String, Integer>>> generateCrashModelPerBuild(
			long modelId, long groupId) {
		Response<Map<String, Map<String, Integer>>> response = null;
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			Map<String, Map<String, Integer>> graphData = graphManager.generateCrashCountBuildWise(modelId, groupId);
			response = new Response<Map<String, Map<String, Integer>>>("Graph data retrieved successfully", HttpStatusCode.SUCCESS, graphData);
		} catch (DataAnalyticsException e) {
			response = new Response<Map<String, Map<String, Integer>>>(e.getMessage(), HttpStatusCode.INCORRECT_PARAMS, null);
			logger.error("Exception occurred. Trace : " + e.getMessage());
		}
		return response;
	}

	@Override
	public Response<Map<String,  Map<String, Integer>>> generateCrashModelPerDevice(
			long modelId, long groupId, String buildName) {
		Response<Map<String,  Map<String, Integer>>> response = null;
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			Map<String, Map<String, Integer>> graphData = graphManager.generateCrashCountDeviceWise(modelId, groupId, buildName);
			response = new Response<Map<String,  Map<String, Integer>>>("Graph data retrieved successfully", HttpStatusCode.SUCCESS, graphData);
		} catch (DataAnalyticsException e) {
			response = new Response<Map<String,  Map<String, Integer>>>(e.getMessage(), HttpStatusCode.INCORRECT_PARAMS, null);
			logger.error("Exception occurred. Trace : " + e.getMessage());
		}
		return response;
	}

	@Override
	public Response<GraphConfigurationDto> addUserDefinedGraphSettings(UserDefinedGraphSettingsDto settingsRequest){
		Response<GraphConfigurationDto> response= null;
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			GraphConfigurationDto details = graphManager.addUserDefinedGraphSettings(settingsRequest);;
			response = new Response<GraphConfigurationDto>("Graph Settings added successfully", HttpStatusCode.SUCCESS,details);
		} catch (DataAnalyticsException e) {
			response = new Response<GraphConfigurationDto>(e.getMessage(), HttpStatusCode.INCORRECT_PARAMS, null);
			logger.error("Exception occurred. Trace : " + e.getMessage());
		}
		return response;
	}
	
	@Override
	public Response<Map<String,Map<String,Set<String>>>> getEventSettings() {		
		Response<Map<String,Map<String,Set<String>>>> response= null;
		try{
			GraphManager graphManager = (GraphManager) JndiLocator.doJndiLookup(GraphManagerBean.GRAPH_MANAGER_BEAN_NAME);
			Map<String,Map<String,Set<String>>> details = graphManager.getEventSettings();;
			response = new Response<Map<String,Map<String,Set<String>>>>("Graph Settings added successfully", HttpStatusCode.SUCCESS,details);
		} catch (DataAnalyticsException e) {
			response = new Response<Map<String,Map<String,Set<String>>>>(e.getMessage(), HttpStatusCode.INCORRECT_PARAMS, null);
			logger.error("Exception occurred. Trace : " + e.getMessage());
		}
		return response;
	}

}
