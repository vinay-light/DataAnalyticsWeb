package com.hp.da.rest.itf;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.hp.da.rest.dto.EventDto;
import com.hp.da.rest.request.ActivationRequest;
import com.hp.da.rest.request.DeleteRequest;
import com.hp.da.rest.request.DeviceInfoRequest;
import com.hp.da.rest.request.DeviceInfoRequest.DeviceInfo;
import com.hp.da.rest.request.DeviceSearchOptionsRequest;
import com.hp.da.rest.request.LogSearchOptionsRequest;
import com.hp.da.rest.request.PostEventsRequest;
import com.hp.da.rest.response.ListResponse;
import com.hp.da.rest.response.Response;

@Path("/api/device/v1/")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface DeviceServiceItf {

	@POST
	@Path("/register")
	public Response<DeviceInfo> registerDevice(DeviceInfoRequest deviceRequest);

	@GET
	@Path("/storageAuthKey/{deviceAuthKey}")
	@Consumes(MediaType.WILDCARD)
	public Response<DeviceInfo> getHPCloudStorageAuthToken(
			@PathParam("deviceAuthKey") String deviceAuthKey);

	/**
	 * This method is used to activate/deactivate device(s).
	 * 
	 * @param request
	 * @return
	 */
	@POST
	@Path("/activate")
	public Response<Object> activateDevices(ActivationRequest request);

	/**
	 * This method is used to delete device(s).
	 * 
	 * @param request
	 * @return
	 */
	@DELETE
	@Path("/delete")
	public Response<Object> deleteDevices(DeleteRequest request);

	/**
	 * This method is used to get all devices
	 * 
	 * @param request
	 * @return
	 */
	@POST
	@Path("/getall")
	public ListResponse<DeviceInfo> getAllDevices(DeviceSearchOptionsRequest request);

	/**
	 * Post device and swBuildVersion specific events
	 * 
	 * @param request
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@POST
	@Path("/events")
	public Response postEvents(PostEventsRequest request);

	/**
	 * This method is used to get device information
	 * 
	 * @param deviceId
	 * @return
	 */
	@GET
	@Path("/deviceInfo/{deviceId}")
	public Response<DeviceInfo> getDeviceInfo(
			@PathParam("deviceId") Long deviceId);

	/**
	 * This method is used to get all group names with groupId.
	 * 
	 * @return
	 */
	@GET
	@Path("/allDevices")
	public Response<List<DeviceInfo>> getAllDevices();

	/**
	 * This method is used to sync device information.
	 * 
	 * @param request
	 * @return
	 */
	@POST
	@Path("syncdevice")
	public Response<Object> syncDevice(DeviceInfoRequest request);

	/**
	 * This method is used to get debug log list of given device.
	 * 
	 * @param request
	 * @return
	 */
	@POST
	@Path("/debugLogList")
	public ListResponse<EventDto<Object>> getDebugLogList(LogSearchOptionsRequest request);
	
	@GET
	@Path("getHPObjectStorageToken")
	public abstract Response<Object> getHPObjectStorageToken();

	
	/**
	 * This method is used to get all Logs between given start time and end time.
	 * 
	 * @return
	 */
	@POST
	@Path("/getAllLog")
	public ListResponse<EventDto<Object>> getAllLogs(LogSearchOptionsRequest request);

	/**
	 * This method is used to get all event type.
	 * 
	 * @return
	 */
	@GET
	@Path("/allEventType")
	public Response<List<String>> getAllEventType();
	
	/**
	 * This method is used to delete device log(s).
	 * 
	 * @param request
	 * @return
	 */
	@DELETE
	@Path("/deleteLogs")
	public Response<Object> deleteDeviceLogs(DeleteRequest request);
	
	/**
	 * This method is used to get all bug report logs.
	 * 
	 * @param request
	 * @return
	 */
	@POST
	@Path("/getBugReportLogs")
	public ListResponse<EventDto<Object>> getBugReportLogs(
			LogSearchOptionsRequest request);

	/**
	 * This method is used to change event status.(ACTIVE/FIXED/REJECTED)
	 *  
	 * @param request
	 * @return
	 */
	@POST
	@Path("/changeEventStatus")
	public Response<Object> changeEventStatus(ActivationRequest request);
}
