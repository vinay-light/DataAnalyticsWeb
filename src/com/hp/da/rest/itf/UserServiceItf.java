/**
 * 
 */
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

import com.hp.da.rest.dto.GraphDataDto;
import com.hp.da.rest.request.ActivationRequest;
import com.hp.da.rest.request.AddGraphDto;
import com.hp.da.rest.request.DeleteRequest;
import com.hp.da.rest.request.ForgetPasswordRequest;
import com.hp.da.rest.request.LoginRequest;
import com.hp.da.rest.request.NotificationRequest;
import com.hp.da.rest.request.NotificationSearchRequest;
import com.hp.da.rest.request.NotificationRequest.NotificationInfo;
import com.hp.da.rest.request.SearchOptionsRequest;
import com.hp.da.rest.request.SearchOptionsRequest.SearchOptions;
import com.hp.da.rest.request.UpdatePasswordRequest;
import com.hp.da.rest.request.UserRequest;
import com.hp.da.rest.request.UserRequest.UserInfo;
import com.hp.da.rest.response.ListResponse;
import com.hp.da.rest.response.Response;

@Path("/api/user/v1")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface UserServiceItf {

	/**
	 * This method is used to login.
	 * 
	 * @param loginRequest
	 * @return
	 */
	@POST
	@Path("/login")
	public Response<Object> login(LoginRequest loginRequest);

	/**
	 * This method is used to add new user.
	 * 
	 * @param userRequest
	 * @return
	 */
	@POST
	@Path("/add")
	public Response<Object> addUser(UserRequest userRequest);

	/**
	 * This method is used to delete user(s).
	 * 
	 * @param request
	 * @return
	 */
	@DELETE
	@Path("/delete")
	public Response<Object> deleteUsers(DeleteRequest request);

	/**
	 * This method is used to update user details.
	 * 
	 * @param userRequest
	 * @return
	 */
	@POST
	@Path("/update")
	public Response<Object> updateUser(UserRequest userRequest);

	/**
	 * This method is used to activate/deactivate user(s).
	 * 
	 * @param request
	 * @return
	 */
	@POST
	@Path("/activate")
	public Response<Object> activateUsers(ActivationRequest request);

	/**
	 * This method is used to get all devices
	 * 
	 * @param request
	 * @return
	 */
	@POST
	@Path("/getall")
	public ListResponse<UserInfo> getAllUsers(
			SearchOptionsRequest<SearchOptions> request);

	/**
	 * This method is used to logout user.
	 * 
	 * @return
	 */
	@POST
	@Path("/updatePassword")
	public Response<Object> updatePassword(UpdatePasswordRequest request);

	@POST
	@Path("/logout")
	public Response<Object> logout();

	/**
	 * This method is used to get user information.
	 * 
	 * @param userId
	 * @return
	 */
	@GET
	@Path("/userInfo/{userId}")
	public Response<UserInfo> getUserInfo(@PathParam("userId") Long userId);

	/**
	 * This method is used to switch group.
	 * 
	 * @param groupId
	 * @return
	 */
	@GET
	@Path("/switchGroup/{groupId}")
	public Response<Object> switchGroup(@PathParam("groupId") Long groupId);

	/**
	 * This method is used to send password by email.
	 * 
	 * @param request
	 * @return
	 */
	@POST
	@Path("/forgetPassword")
	public Response<Object> forgetPassword(ForgetPasswordRequest request);
	
	/**
	 * This method is used to switch model.
	 * 
	 * @param modelId
	 * @return
	 */
	@GET
	@Path("/switchModel/{modelId}")
	public Response<Object> switchModel(@PathParam("modelId") Long modelId);
	
	/**
	 * This method is used to approve notifications by admin.
	 * @param request
	 * @return
	 */
	@POST
	@Path("/approveNotification")
	public Response<Object> approveNotification(NotificationRequest request);
	
	@POST
	@Path("/notifications")
	public ListResponse<NotificationInfo> getNotifications(NotificationSearchRequest request);

	/**
	 * This method will be used to add/update user graph details.
	 * @param request
	 * @return
	 */
	@POST
	@Path("/add-update-graph")
	public Response<GraphDataDto> addUpdateGraph(AddGraphDto request);

	/**
	 * This method will be used to get list of custom graphs info. 
	 * @param
	 * @return
	 */
	@GET
	@Path("/custom-graphs")
	public Response<List<Long>> customGraphs();

	/**
	 * This method is used to delete custom-graph(s) created by user.
	 *
	 * @param request
	 * @return
	 */
	@DELETE
	@Path("/custom-graph")
	public Response<Object> deleteCustomGraphs(DeleteRequest request);
}
