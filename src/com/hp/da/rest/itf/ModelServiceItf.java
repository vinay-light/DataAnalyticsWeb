package com.hp.da.rest.itf;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.hp.da.rest.request.ModelInfoRequest;
import com.hp.da.rest.request.ModelInfoRequest.ModelInfo;
import com.hp.da.rest.request.ActivationRequest;
import com.hp.da.rest.request.DeleteRequest;
import com.hp.da.rest.request.DeviceSearchOptionsRequest;
import com.hp.da.rest.request.ModelInfoRequest.SoftwareBuildInfo;
import com.hp.da.rest.request.SearchOptionsRequest;
import com.hp.da.rest.request.SearchOptionsRequest.SearchOptions;
import com.hp.da.rest.response.ListResponse;
import com.hp.da.rest.response.Response;

/**
 * 
 * @author machindra
 * 
 */

@Path("/api/model/v1/")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface ModelServiceItf {

	/**
	 * This method is used to get all device models.
	 * 
	 * @param request
	 * @return
	 */
	@POST
	@Path("/getall")
	public ListResponse<ModelInfo> getAllDeviceModels(
			SearchOptionsRequest<SearchOptions> request);

	/**
	 * This method is used to get all device model names.
	 * 
	 * @return
	 */
	@GET
	@Path("/allModelNames")
	public Response<List<ModelInfo>> getAllDeviceModels();

	/**
	 * This method is used to add device model.
	 * @param modelRequest
	 * @return
	 */
	@POST
	@Path("/add")
	public Response<Object> addModel(ModelInfoRequest modelRequest);
	
	/**
	 * This method is used to update device model.
	 * @param modelRequest
	 * @return
	 */
	@POST
	@Path("/update")
	public Response<Object> updateModel(ModelInfoRequest modelRequest);

	/**
	 * This api is used to delete models.
	 * @param request
	 * @return
	 */
	@DELETE
	@Path("/delete")
	public Response<Object> deleteModels(DeleteRequest request);
	
	/**
	 * This method is used to get model information.
	 * @param modelId
	 * @return
	 */
	@GET
	@Path("/modelInfo/{modelId}")
	public Response<ModelInfo> getModelInfo(@PathParam("modelId") Long modelId);
	
	/**
	 * This method is used to activate/deactivate model(s).
	 * @param request
	 * @return
	 */
	@POST
	@Path("/activate")
	public Response<Object> activateModels(ActivationRequest request);
	
	/**
	 * This method is used to get model list assigned to given group.
	 * @param groupId
	 * @return
	 */
	@GET
	@Path("/models")
	public Response<List<ModelInfo>> getModelListByGroup(@QueryParam("groupId") Long groupId);

	/**
	 * This method is used to get sowftware build list for given model.
	 * @param modelId
	 * @return
	 */
	@GET
	@Path("/swBuilds")
	public Response<List<SoftwareBuildInfo>> getSwBuildListByModel(@QueryParam("modelId") Long modelId);

	/**
	 * This method is used to get all software builds.
	 * @param request
	 * @return
	 */
	@POST
	@Path("/getAllSoftwareBuilds")
	public ListResponse<SoftwareBuildInfo> getAllSoftwareBuilds(
			DeviceSearchOptionsRequest request);
	
	@DELETE
	@Path("/deleteSwBuilds")
	public Response<Object> deleteSwBuilds(DeleteRequest request);
	
	@POST
	@Path("/activateSwBuilds")
	public Response<Object> activateSwBuilds(ActivationRequest request);
}
