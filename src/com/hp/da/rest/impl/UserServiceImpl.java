/**
 * 
 */
package com.hp.da.rest.impl;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import org.jboss.resteasy.spi.HttpRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hp.da.common.AppInitializer;
import com.hp.da.common.exception.DataAnalyticsException;
import com.hp.da.ejb.impl.UserManagerBean;
import com.hp.da.ejb.itf.UserManager;
import com.hp.da.rest.dto.GraphDataDto;
import com.hp.da.rest.dto.SearchResult;
import com.hp.da.rest.itf.UserServiceItf;
import com.hp.da.rest.request.ActivationRequest;
import com.hp.da.rest.request.AddGraphDto;
import com.hp.da.rest.request.DeleteRequest;
import com.hp.da.rest.request.DeleteRequest.IdListInfo;
import com.hp.da.rest.request.ForgetPasswordRequest;
import com.hp.da.rest.request.ForgetPasswordRequest.ForgetPasswordInfo;
import com.hp.da.rest.request.GroupRequest.GroupInfo;
import com.hp.da.rest.request.LoginRequest;
import com.hp.da.rest.request.ModelInfoRequest.ModelInfo;
import com.hp.da.rest.request.NotificationRequest;
import com.hp.da.rest.request.NotificationRequest.NotificationInfo;
import com.hp.da.rest.request.NotificationSearchRequest;
import com.hp.da.rest.request.NotificationSearchRequest.NotificationOptions;
import com.hp.da.rest.request.SearchOptionsRequest;
import com.hp.da.rest.request.SearchOptionsRequest.SearchOptions;
import com.hp.da.rest.request.UpdatePasswordRequest;
import com.hp.da.rest.request.UpdatePasswordRequest.PasswordInfo;
import com.hp.da.rest.request.UserRequest;
import com.hp.da.rest.request.UserRequest.UserInfo;
import com.hp.da.rest.response.ListResponse;
import com.hp.da.rest.response.Response;
import com.hp.da.rest.response.UsersResponse.UsersDto;
import com.hp.da.rest.util.JndiLocator;
import com.hp.da.rest.util.LogUtility;
import com.hp.da.util.enums.Status;
import com.hp.da.util.misc.HttpStatusCode;

public class UserServiceImpl extends RESTService implements UserServiceItf {

	private static final Logger logger = LoggerFactory
			.getLogger(UserServiceImpl.class);

	@Context
	HttpRequest httpRequest;

	@Context
	HttpServletRequest servletRequest;

	@Override
	public Response<Object> login(LoginRequest loginRequest) {
		Response<Object> resp;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, loginRequest));
			if (loginRequest != null && loginRequest.getData() != null) {
				UserManager mgr = (UserManager) JndiLocator
						.doJndiLookup("UserManagerBean");
				UsersDto userDto = mgr.login(loginRequest);
				if (userDto == null) {
					resp = new Response<Object>(
							getMessageForKeyInLanguage("user.login.fail.invalid_credentials"),
							HttpStatusCode.INCORRECT_PARAMS, null);
				} else {
					Map<String, String> data = new HashMap<String, String>();
					data.put("userId", String.valueOf(userDto.getUserId()));
					data.put("userEmail", userDto.getUserName());
					data.put("displayName", userDto.getDisplayName());
					data.put("firstName", userDto.getFirstName());
					data.put("lastName", userDto.getLastName());
					data.put("userLocale", userDto.getLanguage().getValue());
					data.put("isAdmin", String.valueOf(userDto.isAdminAccess()));
					data.put("isTempPassword",
							String.valueOf(userDto.isTempPassword()));
					HttpSession httpSession = servletRequest.getSession();
					
					// Set new session timeout; Specifies the time, in seconds, between client requests before the servlet container will invalidate this session.
					httpSession.setMaxInactiveInterval(Integer.parseInt(AppInitializer.getAppConfigProperty("com.hp.da.user.session.timeout")));
					
					httpSession.setAttribute("userId", userDto.getUserId());
					httpSession
							.setAttribute("userEmail", userDto.getUserName());
					httpSession.setAttribute("displayName",
							userDto.getDisplayName());
					httpSession.setAttribute("firstName",
							userDto.getFirstName());
					httpSession.setAttribute("lastName", userDto.getLastName());
					httpSession
							.setAttribute("isAdmin", userDto.isAdminAccess());
					httpSession.setAttribute("username", userDto.getUserName());
					httpSession.setAttribute("isTempPassword",
							userDto.isTempPassword());
					httpSession.setAttribute("userLocale", userDto
							.getLanguage().getValue());
					GroupInfo groupInfo = userDto.getLastUsedGroup();
					if (groupInfo != null) {
						httpSession.setAttribute("currentGroupName",
								groupInfo.getGroupName());
						httpSession.setAttribute("currentGroupId",
								groupInfo.getGroupId());
					}
					ModelInfo modelInfo = userDto.getLastUsedModel();
					if (modelInfo != null) {
						httpSession.setAttribute("currentModelId",
								modelInfo.getModelId());
						httpSession.setAttribute("currentDeviceModel",
								modelInfo.getDeviceModel());
					}
					resp = new Response<Object>(
							getMessageForKeyInLanguage("user.login.success"),
							HttpStatusCode.SUCCESS, data);
				}
			} else {
				resp = new Response<Object>(
						getMessageForKeyInLanguage("user.login.fail.invalid_credentials"),
						HttpStatusCode.INCORRECT_PARAMS, null);
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(e.getMessage()),
					HttpStatusCode.SERVER_ERROR, null);
		} catch (Exception e) {
			logger.debug(e.getMessage());
			resp = new Response<Object>(
					getMessageForKeyInLanguage("common.error.exception"),
					HttpStatusCode.SERVER_ERROR, null);
		}
		return resp;
	}

	@Override
	public Response<Object> addUser(UserRequest userRequest) {
		Response<Object> resp = new Response<Object>();
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, userRequest));
			UserManager mgr = (UserManager) JndiLocator
					.doJndiLookup("UserManagerBean");
			if (userRequest != null && userRequest.getData() != null) {
				userRequest.validateData();
				HttpSession httpSession = servletRequest.getSession();
				String userEmail = (String) httpSession
						.getAttribute("userEmail");
				UserInfo userInfo = userRequest.getData();
				if (userEmail == null || userEmail.isEmpty()) {
					userInfo.setStatus(Status.ACTIVATION_PENDING);
				}
				Status status = mgr.addUser(userInfo);
				if (status == Status.SUCCESS) {
					resp.buildResponse(
							getMessageForKeyInLanguage("user.add_user.success"),
							HttpStatusCode.SUCCESS);
				} else {
					resp.buildResponse(
							getMessageForKeyInLanguage("user.add_user.fail.already_exist"),
							HttpStatusCode.SERVER_ERROR);
				}
			} else {
				resp.buildResponse(
						getMessageForKeyInLanguage("common.error.invalid_parameters"),
						HttpStatusCode.SERVER_ERROR);
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			resp.buildResponse(getMessageForKeyInLanguage(e.getMessage()),
					HttpStatusCode.SERVER_ERROR);
		} catch (Exception e) {
			e.printStackTrace();
			resp.buildResponse(
					getMessageForKeyInLanguage("common.error.exception"),
					HttpStatusCode.SERVER_ERROR);
		}
		return resp;
	}

	@Override
	public Response<Object> updateUser(UserRequest userRequest) {
		Response<Object> resp = new Response<Object>();
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, userRequest));
			UserManager mgr = (UserManager) JndiLocator
					.doJndiLookup("UserManagerBean");

			if (userRequest != null && userRequest.getData() != null) {
				userRequest.validateData();
				UserInfo userdata = userRequest.getData();
				HttpSession httpSession = servletRequest.getSession();
				Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
				if (isAdmin == null || !isAdmin) {
					Long userId = (Long) httpSession.getAttribute("userId");
					if (userId == null || userId != userdata.getUserId()) {
						resp = new Response<Object>(
								getMessageForKeyInLanguage("user.update_user.fail.access_denied"),
								HttpStatusCode.ACCESS_DENIED, null);
						return resp;
					}
				}
				Status status = mgr.updateUser(userRequest);
				if (status == Status.SUCCESS) {
					resp.buildResponse(
							getMessageForKeyInLanguage("user.update_user.success"),
							HttpStatusCode.SUCCESS);
				} else {
					resp.buildResponse(
							getMessageForKeyInLanguage("user.update_user.fail.no_user"),
							HttpStatusCode.SERVER_ERROR);
				}
			} else {
				resp.buildResponse(
						getMessageForKeyInLanguage("common.error.invalid_parameters"),
						HttpStatusCode.SERVER_ERROR);
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			resp.buildResponse(getMessageForKeyInLanguage(e.getMessage()),
					HttpStatusCode.SERVER_ERROR);
		} catch (Exception e) {
			e.printStackTrace();
			resp.buildResponse(
					getMessageForKeyInLanguage("common.error.exception"),
					HttpStatusCode.SERVER_ERROR);
		}
		return resp;
	}

	@Override
	public Response<Object> deleteUsers(DeleteRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessageKey = "";
		int httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");

			if (isAdmin != null && isAdmin) {
				UserManager mgr = (UserManager) JndiLocator
						.doJndiLookup("UserManagerBean");
				if (request != null && (request.getData() != null)) {
					IdListInfo listInfo = request.getData();
					LinkedHashSet<Long> idList = listInfo.getIdList();
					Long userId = (Long) httpSession.getAttribute("userId");
					if (idList != null && idList.size() > 0 && userId != null
							&& !idList.contains(userId)) {
						boolean flag = mgr.deleteUsers(listInfo);
						if (flag) {
							resp = new Response<Object>(
									getMessageForKeyInLanguage("user.delete_users.success"),
									HttpStatusCode.SUCCESS, null);
						} else {
							errorMessageKey = "user.delete_users.fail";
							httpStatusCode = HttpStatusCode.SERVER_ERROR;
						}
					} else {
						errorMessageKey = (idList == null || idList.size() == 0) ? "common.error.invalid_parameters"
								: "user.delete.fail.self.user";
					}
				} else {
					errorMessageKey = "common.error.invalid_parameters";
				}
			} else {
				errorMessageKey = "user.delete.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			errorMessageKey = e.getMessage();
		} catch (Exception e) {
			e.printStackTrace();
			errorMessageKey = "common.error.exception";
			httpStatusCode = HttpStatusCode.SERVER_ERROR;
		}
		if (!errorMessageKey.isEmpty()) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(errorMessageKey),
					httpStatusCode, null);
		}
		return resp;
	}

	@Override
	public Response<Object> activateUsers(ActivationRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessageKey = "";
		int httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
			if (isAdmin != null && isAdmin) {
				UserManager mgr = (UserManager) JndiLocator
						.doJndiLookup("UserManagerBean");
				if (request != null && (request.getData() != null)) {
					com.hp.da.rest.request.ActivationRequest.IdListInfo listInfo = request
							.getData();
					LinkedHashSet<Long> idList = listInfo.getIdList();
					Long userId = (Long) httpSession.getAttribute("userId");
					if (idList != null && idList.size() > 0 && userId != null
							&& !idList.contains(userId)) {
						boolean flag = mgr.activateUsers(request);
						if (flag) {
							String key = (listInfo.isActivate()) ? "user.activate_user.success"
									: "user.deactivate_user.success";
							resp = new Response<Object>(
									getMessageForKeyInLanguage(key),
									HttpStatusCode.SUCCESS, null);
						} else {
							errorMessageKey = "user.activate_user.fail";
							httpStatusCode = HttpStatusCode.SERVER_ERROR;
						}
					} else {
						errorMessageKey = (idList == null || idList.size() == 0) ? "common.error.invalid_parameters"
								: "user.activate_user.fail.self_user";
					}
				} else {
					errorMessageKey = "common.error.invalid_parameters";
				}
			} else {
				errorMessageKey = "user.activate_user.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
			errorMessageKey = "common.error.exception";
		}
		if (!errorMessageKey.isEmpty()) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(errorMessageKey),
					httpStatusCode, null);
		}
		return resp;
	}

	@Override
	public Response<Object> logout() {
		Response<Object> resp = new Response<Object>(
				getMessageForKeyInLanguage("user.logout.success"),
				HttpStatusCode.SUCCESS, null);
		try {
			HttpSession httpSession = servletRequest.getSession();
			httpSession.removeAttribute("userId");
			httpSession.removeAttribute("userEmail");
			httpSession.removeAttribute("displayName");
			httpSession.removeAttribute("firstName");
			httpSession.removeAttribute("lastName");
			httpSession.removeAttribute("isAdmin");
			httpSession.removeAttribute("username");
			httpSession.removeAttribute("userLocale");
		} catch (Exception e) {
			e.printStackTrace();
			resp.buildResponse(
					getMessageForKeyInLanguage("common.error.exception"),
					HttpStatusCode.SERVER_ERROR);
		}

		return resp;
	}

	@Override
	public ListResponse<UserInfo> getAllUsers(
			SearchOptionsRequest<SearchOptions> request) {
		ListResponse<UserInfo> resp = new ListResponse<UserInfo>();
		String errorMessageKey = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			if (request != null && request.getData() != null) {
				SearchOptions options = request.getData();
				UserManager mgr = (UserManager) JndiLocator
						.doJndiLookup("UserManagerBean");
				SearchResult<UserInfo> result = mgr.getAllUsers(request);
				if (result != null) {
					resp = new ListResponse<UserInfo>(
							HttpStatusCode.SUCCESS,
							getMessageForKeyInLanguage("user.get_list.success"),
							options.getPage(), result.getTotal(), result
									.getList());
				} else {
					errorMessageKey = "user.get_list.fail";
				}
			} else {
				errorMessageKey = "common.error.invalid_parameters";
				httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
			errorMessageKey = "common.error.exception";
		}
		if (!errorMessageKey.isEmpty()) {
			resp = new ListResponse<UserInfo>(httpStatusCode,
					getMessageForKeyInLanguage(errorMessageKey), 1, 0, null);
		}
		return resp;
	}

	@Override
	public Response<Object> updatePassword(UpdatePasswordRequest request) {
		Response<Object> resp = new Response<Object>();
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			UserManager mgr = (UserManager) JndiLocator
					.doJndiLookup("UserManagerBean");
			if (request != null && request.getData() != null) {
				PasswordInfo data = request.getData();
				if(data.getNewPassword().equals(data.getOldPassword())) {
					resp.buildResponse(
							getMessageForKeyInLanguage("user.update_password.fail.same_pwd"),
							HttpStatusCode.SERVER_ERROR);
				} else {
					request.validateData();
					HttpSession httpSession = servletRequest.getSession();
					String userName = (String) httpSession.getAttribute("username");
					data.setUserName(userName);
					Status status = mgr.updatePassword(data);
					if (status == Status.SUCCESS) {
						resp.buildResponse(
								getMessageForKeyInLanguage("user.update_password.success"),
								HttpStatusCode.SUCCESS);
					} else {
						resp.buildResponse(
								getMessageForKeyInLanguage("user.update_password.fail.incorrect_current_pwd"),
								HttpStatusCode.SERVER_ERROR);
					}
				}
			} else {
				resp.buildResponse(
						getMessageForKeyInLanguage("common.error.invalid_parameters"),
						HttpStatusCode.SERVER_ERROR);
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			resp.buildResponse(getMessageForKeyInLanguage(e.getMessage()),
					HttpStatusCode.SERVER_ERROR);
		} catch (Exception e) {
			e.printStackTrace();
			resp.buildResponse(
					getMessageForKeyInLanguage("common.error.exception"),
					HttpStatusCode.SERVER_ERROR);
		}
		return resp;
	}

	@Override
	public Response<UserInfo> getUserInfo(Long userId) {
		Response<UserInfo> resp = null;
		String errorMessageKey = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			UserManager mgr = (UserManager) JndiLocator
					.doJndiLookup("UserManagerBean");
			if (userId != null) {
				UserInfo userInfo = mgr.getUserInfo(userId);
				if (userInfo != null) {
					resp = new Response<UserInfo>(
							getMessageForKeyInLanguage("user.get_user.success"),
							HttpStatusCode.SUCCESS, userInfo);
				} else {
					errorMessageKey = "user.get_user.fail";
				}
			} else {
				errorMessageKey = "common.error.invalid_parameters";
				httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
			}

			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
			errorMessageKey = "common.error.exception";
		}
		if (!errorMessageKey.isEmpty()) {
			resp = new Response<UserInfo>(
					getMessageForKeyInLanguage(errorMessageKey),
					httpStatusCode, null);
		}
		return resp;
	}

	@Override
	public Response<Object> switchGroup(Long groupId) {
		Response<Object> resp = new Response<Object>();
		String errorMessageKey = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			UserManager mgr = (UserManager) JndiLocator
					.doJndiLookup("UserManagerBean");
			HttpSession session = servletRequest.getSession();
			Long userId = (Long) session.getAttribute("userId");
			if (userId != null && groupId != null) {
				String groupName = mgr.switchGroup(userId, groupId);
				if (groupName != null) {
					resp.buildResponseForSuccess(getMessageForKeyInLanguage("user.switch_group.success"));
					HttpSession httpSession = servletRequest.getSession();
					httpSession.setAttribute("currentGroupId", groupId);
					httpSession.setAttribute("currentGroupName", groupName);
				} else {
					errorMessageKey = "user.switch_group.fail";
				}
			} else {
				errorMessageKey = "user.switch_group.fail";
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
			errorMessageKey = "common.error.exception";
		}
		if (!errorMessageKey.isEmpty()) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(errorMessageKey),
					httpStatusCode, null);
		}
		return resp;
	}

	@Override
	public Response<Object> forgetPassword(ForgetPasswordRequest request) {
		Response<Object> resp = new Response<Object>();
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			UserManager mgr = (UserManager) JndiLocator
					.doJndiLookup("UserManagerBean");
			if (request != null && request.getData() != null) {
				ForgetPasswordInfo data = request.getData();
				Status status = mgr.forgetPassword(data);
				if (status == Status.SUCCESS) {
					resp.buildResponse(
							getMessageForKeyInLanguage("user.forget_password.success"),
							HttpStatusCode.SUCCESS);
				} else {
					resp.buildResponse(
							getMessageForKeyInLanguage("user.forget_password.fail"),
							HttpStatusCode.SERVER_ERROR);
				}
			} else {
				resp.buildResponse(
						getMessageForKeyInLanguage("common.error.invalid_parameters"),
						HttpStatusCode.INCORRECT_PARAMS);
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
			resp.buildResponse(
					getMessageForKeyInLanguage("common.error.exception"),
					HttpStatusCode.SERVER_ERROR);
		}
		return resp;
	}

	@Override
	public Response<Object> switchModel(Long modelId) {
		Response<Object> resp = new Response<Object>();
		String errorMessageKey = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			UserManager mgr = (UserManager) JndiLocator
					.doJndiLookup("UserManagerBean");
			HttpSession session = servletRequest.getSession();
			Long userId = (Long) session.getAttribute("userId");
			if (userId != null && modelId != null) {
				String deviceModel = mgr.switchModel(userId, modelId);
				if (deviceModel != null) {
					resp.buildResponseForSuccess(getMessageForKeyInLanguage("user.switch_model.success"));
					HttpSession httpSession = servletRequest.getSession();
					httpSession.setAttribute("currentModelId", modelId);
					httpSession.setAttribute("currentDeviceModel", deviceModel);
				} else {
					errorMessageKey = "user.switch_model.fail";
				}
			} else {
				errorMessageKey = "user.switch_model.fail";
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
			errorMessageKey = "common.error.exception";
		}
		if (!errorMessageKey.isEmpty()) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(errorMessageKey),
					httpStatusCode, null);
		}
		return resp;
	}

	@Override
	public Response<Object> approveNotification(NotificationRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessageKey = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
			if (isAdmin != null && isAdmin) {
				if (request != null && request.getData() != null) {
					NotificationInfo info = request.getData();
					UserManager mgr = (UserManager) JndiLocator
							.doJndiLookup("UserManagerBean");
					Status status = mgr.approveNotification(info);
					if (status.name().equals(Status.SUCCESS.name())) {
						String msgKey = info.getAction().equals("DELETE") ? "user.approve_notification.success.delete_notification"
								: "user.approve_notification.success";
						resp = new Response<Object>(
								getMessageForKeyInLanguage(msgKey),
								HttpStatusCode.SUCCESS, null);
					} else if (status.name()
							.equals(Status.NOT_INSTALLED.name())) {
						errorMessageKey = "user.approve_notification.fail.unknown_notification";
					} else if (status.name().equals(Status.INACTIVE.name())) {
						errorMessageKey = "user.approve_notification.fail.inactive_notification";
					} else if (status.name().equals(
							Status.NOT_APPLICABLE.name())) {
						errorMessageKey = "user.approve_notification.fail.no_required_action";
					} else {
						errorMessageKey = "user.approve_notification.fail";
					}
				} else {
					errorMessageKey = "common.error.invalid_parameters";
					httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
				}
			} else {
				errorMessageKey = "user.approve_notification.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch(DataAnalyticsException e) {
			errorMessageKey = e.getMessage();
		} catch (Exception e) {
			e.printStackTrace();
			errorMessageKey = "common.error.exception";
		}
		if (!errorMessageKey.isEmpty()) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(errorMessageKey),
					httpStatusCode, null);
		}
		return resp;
	}

	@Override
	public ListResponse<NotificationInfo> getNotifications(
			NotificationSearchRequest request) {
		ListResponse<NotificationInfo> resp = new ListResponse<NotificationInfo>();
		String errorMessageKey = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
			if (isAdmin != null && isAdmin) {
				if (request != null && request.getData() != null) {
					NotificationOptions options = request.getData();
					UserManager mgr = (UserManager) JndiLocator
							.doJndiLookup("UserManagerBean");
					SearchResult<NotificationInfo> result = mgr
							.getNotifications(options);
					if (result != null) {
						resp = new ListResponse<NotificationInfo>(
								HttpStatusCode.SUCCESS,
								getMessageForKeyInLanguage("user.get_notification.success"),
								options.getPage(), result.getTotal(), result
										.getList());
					} else {
						errorMessageKey = "user.get_notification.fail";
					}
				} else {
					errorMessageKey = "common.error.invalid_parameters";
					httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
				}
			} else {
				errorMessageKey = "user.get_notification.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			errorMessageKey = "common.error.exception";
		}
		if (!errorMessageKey.isEmpty()) {
			resp = new ListResponse<NotificationInfo>(httpStatusCode,
					getMessageForKeyInLanguage(errorMessageKey), 1, 0, null);
		}
		return resp;
	}

	@Override
	public Response<GraphDataDto> addUpdateGraph(AddGraphDto request) {
		Response<GraphDataDto> response = null;
		try{
			request.getData().setUserId(String.valueOf(servletRequest.getSession().getAttribute("userId")));
			UserManager userManager = (UserManager) JndiLocator.doJndiLookup(UserManagerBean.USER_MANAGER_BEAN_NAME);
			GraphDataDto graphData = userManager.addUpdateGraph(request);
			response = new Response<GraphDataDto>("Graph data retrieved successfully", HttpStatusCode.SUCCESS, graphData);
		} catch (DataAnalyticsException e) {
			response = new Response<GraphDataDto>(getMessageForKeyInLanguage(e.getMessage()), HttpStatusCode.INCORRECT_PARAMS, null);
			logger.error("Exception occurred. Trace : " + e.getMessage());
		}catch (Exception e) {
			response = new Response<GraphDataDto>("Exception occurred. Trace : " + e.getMessage(), HttpStatusCode.INCORRECT_PARAMS, null);
		}
		return response;
	}

	@Override
	public Response<List<Long>> customGraphs() {
		Response<List<Long>> response = null;
		try{
			UserManager userManager = (UserManager) JndiLocator.doJndiLookup(UserManagerBean.USER_MANAGER_BEAN_NAME);
			List<Long> customGraphsIDs = userManager.customGraphs(String.valueOf(servletRequest.getSession().getAttribute("userId")));
			response = new Response<List<Long>>("Custom Graphs details retrieved successfully", HttpStatusCode.SUCCESS, customGraphsIDs);
		} catch (DataAnalyticsException e) {
			response = new Response<List<Long>>(e.getMessage(), HttpStatusCode.INCORRECT_PARAMS, null);
			logger.error("Exception occurred. Trace : " + e.getMessage());
		}
		return response;
	}

	@Override
	public Response<Object> deleteCustomGraphs(DeleteRequest request) {
		Response<Object> response = null;
		try{
			UserManager userManager = (UserManager) JndiLocator.doJndiLookup(UserManagerBean.USER_MANAGER_BEAN_NAME);
			boolean flag = userManager.deleteCustomGraphs(request);
			if(flag)
				response = new Response<Object>("Custom graph deleted successfully", HttpStatusCode.SUCCESS, null);
			else
				response = new Response<Object>("Custom graph deletion failed", HttpStatusCode.SERVER_ERROR, null);
		} catch (DataAnalyticsException e) {
			response = new Response<Object>(getMessageForKeyInLanguage(e.getMessage()), HttpStatusCode.INCORRECT_PARAMS, null);
			logger.error("Exception occurred. Trace : " + e.getMessage());
		}
		return response;
	}
}
