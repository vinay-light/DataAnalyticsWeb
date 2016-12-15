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

import com.hp.da.rest.request.ActivationRequest;
import com.hp.da.rest.request.DeleteRequest;
import com.hp.da.rest.request.GroupRequest;
import com.hp.da.rest.request.GroupRequest.GroupInfo;
import com.hp.da.rest.request.SearchOptionsRequest;
import com.hp.da.rest.request.SearchOptionsRequest.SearchOptions;
import com.hp.da.rest.response.ListResponse;
import com.hp.da.rest.response.Response;

@Path("/api/group/v1/")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface GroupServiceItf {

	/**
	 * This method is used to add device groups.
	 * @param groupRequest
	 * @return
	 */
	@POST
	@Path("/add")
	public Response<Object> addGroup(GroupRequest groupRequest);
	
	/**
	 * This method is used to update device group. We can add/remove devices from groups.
	 * Also we can add/remove users from groups.
	 * @param groupRequest
	 * @return
	 */
	@POST
	@Path("/update")
	public Response<Object> updateGroup(GroupRequest groupRequest);

	/**
	 * This api is used to delete groups.
	 * @param request
	 * @return
	 */
	@DELETE
	@Path("/delete")
	public Response<Object> deleteGroups(DeleteRequest request);
	
	/**
	 * This method is used to get all Groups
	 * @param request
	 * @return
	 */
	@POST
	@Path("/getall")
	public ListResponse<GroupInfo> getAllGroups(SearchOptionsRequest<SearchOptions> request);
	
	/**

	 * This method is used to get groups assigned to logged in user. 
	 * @return
	 */
	@GET
	@Path("/assignedGroups")
	public Response<List<GroupInfo>> getAssignedGroups();
	
	/**
	 * This method is used to get group information.
	 * @param groupId
	 * @return
	 */

	@GET
	@Path("/groupInfo/{groupId}")
	public Response<GroupInfo> getGroupInfo(@PathParam("groupId") Long groupId);

	
	/**
	 * This method is used to get all group names with groupId.
	 * @return
	 */
	@GET
	@Path("/allGroupNames")
	public Response<List<GroupInfo>> getAllGroups();
	

	/**
	 * This method is used to activate/deactivate group(s).
	 * @param request
	 * @return
	 */
	@POST
	@Path("/activate")
	public Response<Object> activateGroups(ActivationRequest request);
}
