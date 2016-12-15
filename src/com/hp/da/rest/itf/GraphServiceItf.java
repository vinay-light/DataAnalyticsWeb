package com.hp.da.rest.itf;

import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.hp.da.rest.dto.AnalyticsData;
import com.hp.da.rest.dto.BuildwiseGraphDataEntry;
import com.hp.da.rest.dto.GraphDataDto;
import com.hp.da.rest.dto.GraphDataEntry;
import com.hp.da.rest.dto.UIAnalytics;
import com.hp.da.rest.dto.UserDefinedGraphSettingsDto;
import com.hp.da.rest.dto.UserDefinedGraphSettingsDto.GraphConfigurationDto;
import com.hp.da.rest.response.Response;

@Path("/api/graph/v1")
@Produces(MediaType.APPLICATION_JSON)
public interface GraphServiceItf {
	/**
	 * Retrieve stability-uptime for all the build for selected model and group.
     * @param      modelId   This is user selected model.
     * @param      groupId   This is user allocated group.
	 * @return 	   List&ltBuildwiseGraphDataEntry&ltDouble&gt&gt	 This api return list of <code>BuildwiseGraphDataEntry</code>,
	 * where <code> BuildwiseGraphDataEntry </code> contains buildName, deviceCount, and its stability-uptime with device up-time.
	 */
	@GET
	@Path("/stability-uptime/build")
	Response<List<BuildwiseGraphDataEntry<Double>>> generateStabilityUptimePerBuildByModelAndGroup(@QueryParam("modelId") long modelId,@QueryParam("groupId")  long groupId);

	/**
	 * Retrieve stability-uptime for all the devices for selected model, group and build.
     * @param      modelId   	This is user selected model.
     * @param      groupId   	This is user allocated group.
     * @param      buildName   	This is user selected build.
	 * @return 	   List&GraphDataEntry&ltDouble&gt&gt	 This api return list of <code>GraphDataEntry</code>,
	 * where <code> GraphDataEntry </code> contains buildName, deviceCount, stability-uptime and device uptime.
	 */
	@GET
	@Path("/stability-uptime/device")
	Response<List<GraphDataEntry<Double>>> generateStabilityUptimePerDeviceByModelAndGroup(@QueryParam("modelId") long modelId,@QueryParam("groupId")  long groupId, @QueryParam("buildName") String buildName);
	
	@GET
	@Path("/batteryAnalytics/build")
	Response<List<BuildwiseGraphDataEntry<Double>>> generateBatteryAnalyticsChartPerBuild(@QueryParam("modelId") long modelId, @QueryParam("groupId") long groupId);
	
	@GET
	@Path("/batteryAnalytics/device")
	Response<List<GraphDataEntry<Double>>> generateBatteryAnalyticsChartPerDevice(@QueryParam("modelId") long modelId, @QueryParam("groupId") long groupId, @QueryParam("buildName") String buildName);

	@GET
	@Path("/batteryAnalytics/deviceComponents")
	Response<Map<String, Double>> generateBatteryAnalyticsChartPerComponentOfDevice(@QueryParam("modelId") long modelId, @QueryParam("groupId") long groupId, @QueryParam("buildName") String buildName, @QueryParam("deviceSerialNo") String deviceSerialNo);
	
	
	@GET
	@Path("/uiAnalytics/build")
	Response<UIAnalytics> generateUiAnalyticsChartPerBuild(@QueryParam("modelId") long modelId, @QueryParam("groupId")  long groupId, @QueryParam("type") String type);
	
	@GET
	@Path("/uiAnalytics/device")
	Response<UIAnalytics> generateUiAnalyticsChartPerDevice(@QueryParam("modelId") long modelId, @QueryParam("groupId")  long groupId , @QueryParam("buildName")  String buildName, @QueryParam("type") String type);
	
	@GET
	@Path("/analytics-table-data/build")
	Response<List<AnalyticsData>> generateAnalyticsTableDataBuildWise(@QueryParam("modelId") long modelId, @QueryParam("groupId")  long groupId);

	/**
	 * This method is used to get list of all events with its packages.
	 * This method only return those packages, whose defaultDataType is TIME_IN_SECONDS
	 * @return
	 */
	@GET
	@Path("/dynamic-graph/events")
	Response<Map<String, Set<String>>> generateDynamicGraphEventDetails();

	/**
	 * This method is used to get graph content, which is already created by user.
	 * @param dynamicGraphId
	 * @return
	 */
	@GET
	@Path("/dynamic-graph/content")
	Response<GraphDataDto> generateDynamicGraphContentDetails(@QueryParam("dynamicGraphId") long dynamicGraphId,@QueryParam("modelId") long modelId, @QueryParam("groupId")  long groupId);

	/**
	 * This method is used to get crash count per build wise.
	 * @param modelId
	 * @param groupId
	 * @return
	 */
	@GET
	@Path("/crashModelAnalytics/build")
	Response<Map<String, Map<String, Integer>>> generateCrashModelPerBuild(@QueryParam("modelId") long modelId, @QueryParam("groupId")  long groupId);

	/**
	 * This method is used to get crash count per device wise.
	 * @param modelId
	 * @param groupId
	 * @param buildName
	 * @return
	 */
	@GET
	@Path("/crashModelAnalytics/device")
	Response<Map<String, Map<String, Integer>>> generateCrashModelPerDevice(@QueryParam("modelId") long modelId, @QueryParam("groupId")  long groupId , @QueryParam("buildName")  String buildName);
	
	@POST
	@Path("/userDefinedGraph/add-configuration")
	public Response<GraphConfigurationDto> addUserDefinedGraphSettings(UserDefinedGraphSettingsDto settingsRequest);

	@GET
	@Path("/userDefinedGraph/get-configuration")
	public Response<Map<String, Map<String, Set<String>>>> getEventSettings();
}

