package com.hp.da.rest.impl;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import org.jboss.resteasy.spi.HttpRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hp.da.common.exception.DataAnalyticsException;
import com.hp.da.common.exception.InvalidAuthKeyException;
import com.hp.da.ejb.itf.DeviceManager;
import com.hp.da.rest.dto.EventDto;
import com.hp.da.rest.dto.SearchResult;
import com.hp.da.rest.itf.DeviceServiceItf;
import com.hp.da.rest.request.ActivationRequest;
import com.hp.da.rest.request.DeleteRequest;
import com.hp.da.rest.request.DeleteRequest.IdListInfo;
import com.hp.da.rest.request.DeviceInfoRequest;
import com.hp.da.rest.request.DeviceInfoRequest.DeviceInfo;
import com.hp.da.rest.request.DeviceSearchOptionsRequest;
import com.hp.da.rest.request.DeviceSearchOptionsRequest.DeviceSearchOptions;
import com.hp.da.rest.request.LogSearchOptionsRequest;
import com.hp.da.rest.request.LogSearchOptionsRequest.LogSearchOptions;
import com.hp.da.rest.request.PostEventsRequest;
import com.hp.da.rest.response.ListResponse;
import com.hp.da.rest.response.Response;
import com.hp.da.rest.util.JndiLocator;
import com.hp.da.rest.util.LogUtility;
import com.hp.da.util.enums.Status;
import com.hp.da.util.misc.Constants;
import com.hp.da.util.misc.HttpStatusCode;

public class DeviceServiceImpl extends RESTService implements DeviceServiceItf {

	private static final Logger logger = LoggerFactory
			.getLogger(DeviceServiceImpl.class);

	@Context
	HttpServletRequest servletRequest;

	@Context
	HttpRequest httpRequest;

	@Override
	public Response<DeviceInfo> registerDevice(DeviceInfoRequest deviceRequest) {
		Response<DeviceInfo> resp;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, deviceRequest));
			if (deviceRequest != null) {
				DeviceManager mgr = (DeviceManager) JndiLocator
						.doJndiLookup("DeviceManagerBean");
				String registrationCode = mgr.registerDevice(deviceRequest);
				if (registrationCode != null) {
					DeviceInfo deviceInfo = new DeviceInfo();
					deviceInfo.setDeviceAuthKey(registrationCode);
					deviceInfo
							.setLogURL(Constants.HP_CLOUD_OBJ_STORE_FOR_LOG_SVC_URL
									+ registrationCode);
					resp = new Response<DeviceInfo>(
							getMessageForKeyInLanguage("device.register_device.success"),
							HttpStatusCode.SUCCESS, deviceInfo);
				} else {
					resp = new Response<DeviceInfo>(
							getMessageForKeyInLanguage("device.register_device.fail"),
							HttpStatusCode.SERVER_ERROR, null);
				}
			} else {
				resp = new Response<DeviceInfo>(
						getMessageForKeyInLanguage("common.error.invalid_parameters"),
						HttpStatusCode.INCORRECT_PARAMS, null);
			}
		} catch(DataAnalyticsException e) {
			resp = new Response<DeviceInfo>(
					getMessageForKeyInLanguage(e.getMessage()),
					HttpStatusCode.SERVER_ERROR, null);
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			resp = new Response<DeviceInfo>(
					getMessageForKeyInLanguage("common.error.exception"),
					HttpStatusCode.SERVER_ERROR, null);
		}
		return resp;
	}

	@Override
	public Response<Object> deleteDevices(DeleteRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
			if (isAdmin != null && isAdmin) {
				DeviceManager mgr = (DeviceManager) JndiLocator
						.doJndiLookup("DeviceManagerBean");
				if (request != null && (request.getData() != null)) {
					IdListInfo listInfo = request.getData();
					LinkedHashSet<Long> idList = listInfo.getIdList();
					if (idList != null && idList.size() > 0) {
						boolean flag = mgr.deleteDevices(listInfo);
						if (flag) {
							resp = new Response<Object>(
									getMessageForKeyInLanguage("device.delete_device.success"),
									HttpStatusCode.SUCCESS, null);
						} else {
							errorMessage = "device.delete_device.fail";
							httpStatusCode = HttpStatusCode.SERVER_ERROR;
						}
					} else {
						errorMessage = "common.error.invalid_parameters";
					}
				} else {
					errorMessage = "common.error.invalid_parameters";
				}
			} else {
				errorMessage = "device.delete_device.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			errorMessage = e.getMessage();
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			errorMessage = "common.error.exception";
			httpStatusCode = HttpStatusCode.SERVER_ERROR;
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public Response<Object> activateDevices(ActivationRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
			if (isAdmin != null && isAdmin) {
				DeviceManager mgr = (DeviceManager) JndiLocator
						.doJndiLookup("DeviceManagerBean");
				if (request != null && (request.getData() != null)) {
					com.hp.da.rest.request.ActivationRequest.IdListInfo listInfo = request
							.getData();
					LinkedHashSet<Long> idList = listInfo.getIdList();
					if (idList != null && idList.size() > 0) {
						boolean flag = mgr.activateDevices(request);
						if (flag) {
							String message = (listInfo.isActivate()) ? "device.activate_device.success"
									: "device.deactivate_device.success";
							resp = new Response<Object>(
									getMessageForKeyInLanguage(message),
									HttpStatusCode.SUCCESS, null);
						} else {
							errorMessage = "device.activate_device.fail";
						}
					} else {
						errorMessage = "device.activate_device.fail.no_ids";
						httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
					}
				} else {
					errorMessage = "common.error.invalid_parameters";
					httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
				}
			} else {
				errorMessage = "device.activate_device.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	public ListResponse<DeviceInfo> getAllDevices(
			DeviceSearchOptionsRequest request) {
		ListResponse<DeviceInfo> resp = new ListResponse<DeviceInfo>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
		//	Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
		//	if (isAdmin != null && isAdmin) {
				if (request != null && request.getData() != null) {
					DeviceSearchOptions options = request.getData();
					DeviceManager mgr = (DeviceManager) JndiLocator
							.doJndiLookup("DeviceManagerBean");
					SearchResult<DeviceInfo> result = mgr
							.getAllDevices(request);
					if (result != null) {
						resp = new ListResponse<DeviceInfo>(
								HttpStatusCode.SUCCESS,
								getMessageForKeyInLanguage("device.get_list.success"),
								options.getPage(), result.getTotal(), result
										.getList());
					} else {
						errorMessage = "device.get_list.fail";
					}
				} else {
					errorMessage = "common.error.invalid_parameters";
					httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
				}
		/*	} else {
				errorMessage = "device.get_list.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}*/
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new ListResponse<DeviceInfo>(httpStatusCode,
					getMessageForKeyInLanguage(errorMessage), 1, 0, null);
		}
		return resp;

	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public Response postEvents(PostEventsRequest request) {
		Response response = new Response(
				getMessageForKeyInLanguage("common.error.invalid_parameters"),
				HttpStatusCode.INCORRECT_PARAMS, null);

		if (request == null) {
			return response;
		}

		List<EventDto> events = request.getData();
		String deviceAuthKey = request.getDeviceAuthKey();

		if (events == null || deviceAuthKey == null) {
			return response;
		}

		DeviceManager deviceManager = (DeviceManager) JndiLocator
				.doJndiLookup("DeviceManagerBean");
		try {
			deviceManager.postEvents(request);
			response.buildResponseForSuccess(getMessageForKeyInLanguage("device.post_event.success"));

		} catch (InvalidAuthKeyException e) {
			logger.debug("Exception : " + e.getMessage());
			response.setMessage(getMessageForKeyInLanguage(e.getMessage()));
			response.setHttpStatusCode(e.getErrorCode());
		} catch (DataAnalyticsException e) {
			logger.debug("Exception : " + e.getMessage());
			response.setMessage(getMessageForKeyInLanguage(e.getMessage()));
			response.setHttpStatusCode(e.getErrorCode());
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			response.setMessage(getMessageForKeyInLanguage("common.error.exception"));
			response.setHttpStatusCode(HttpStatusCode.SERVER_ERROR);
		}

		return response;
	}

	@Override
	public Response<DeviceInfo> getDeviceInfo(Long deviceId) {
		Response<DeviceInfo> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			DeviceManager mgr = (DeviceManager) JndiLocator
					.doJndiLookup("DeviceManagerBean");
			if (deviceId != null) {
				DeviceInfo deviceInfo = mgr.getDeviceInfo(deviceId);
				if (deviceInfo != null) {
					resp = new Response<DeviceInfo>(
							getMessageForKeyInLanguage("device.get_device_info.success"),
							HttpStatusCode.SUCCESS, deviceInfo);
				} else {
					errorMessage = getMessageForKeyInLanguage("device.get_device_info.fail.no_device");
				}
			} else {
				errorMessage = "Invalid deviceId. Failed to retrieve device information.";
				httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
			}

			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<DeviceInfo>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public Response<List<DeviceInfo>> getAllDevices() {
		Response<List<DeviceInfo>> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			DeviceManager mgr = (DeviceManager) JndiLocator
					.doJndiLookup("DeviceManagerBean");
			List<DeviceInfo> list = mgr.getAllDevices();
			if (list != null) {
				resp = new Response<List<DeviceInfo>>(
						getMessageForKeyInLanguage("device.get_list.success"),
						HttpStatusCode.SUCCESS, list);
			} else {
				errorMessage = "device.get_list.fail";
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<List<DeviceInfo>>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public Response<DeviceInfo> getHPCloudStorageAuthToken(String deviceAuthKey) {
		Response<DeviceInfo> response = new Response<DeviceInfo>(
				getMessageForKeyInLanguage("device.get_access_token.fail.invalid_token"),
				HttpStatusCode.INVALID_DEVICE_AUTH_KEY, null);
		try {
			DeviceManager deviceManager = (DeviceManager) JndiLocator
					.doJndiLookup("DeviceManagerBean");
			String storageAuthKey = deviceManager
					.getHPCloudStorageAuthTokenForDevice(deviceAuthKey);

			response = new Response<DeviceInfoRequest.DeviceInfo>();
			response.buildResponseForSuccess(getMessageForKeyInLanguage("device.get_access_token.success"));
			DeviceInfo info = new DeviceInfo();
			info.setStorageAuthKey(storageAuthKey);
			response.setData(info);
			return response;

		} catch (InvalidAuthKeyException e) {
			return response;
		}
	}

	@Override
	public Response<Object> syncDevice(DeviceInfoRequest request) {
		Response<Object> resp;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			if (request != null && request.getData() != null) {
				DeviceManager mgr = (DeviceManager) JndiLocator.doJndiLookup("DeviceManagerBean");
				if (mgr.syncDevice(request.getData())) {
					resp = new Response<Object>(getMessageForKeyInLanguage("device.sync_device.success"), HttpStatusCode.SUCCESS, null);
				} else {
					resp = new Response<Object>(getMessageForKeyInLanguage("device.sync_device.fail"), HttpStatusCode.SERVER_ERROR, null);
				}
			} else {
				resp = new Response<Object>(getMessageForKeyInLanguage("common.error.invalid_parameters"), HttpStatusCode.INCORRECT_PARAMS, null);
			}
		}
		catch (DataAnalyticsException e) {
			resp = new Response<Object>(getMessageForKeyInLanguage(e.getMessage()), e.getErrorCode(), null);
		}catch (Exception e) {
			logger.debug("Exception : Device syncDevice " + e.getMessage());
			resp = new Response<Object>(getMessageForKeyInLanguage("common.error.exception") + ":" + e.getMessage(), HttpStatusCode.SERVER_ERROR, null);
		}
		return resp;
	}

	@Override
	public ListResponse<EventDto<Object>> getDebugLogList(
			LogSearchOptionsRequest request) {
		ListResponse<EventDto<Object>> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			DeviceManager mgr = (DeviceManager) JndiLocator
					.doJndiLookup("DeviceManagerBean");
			if (request != null && request.getData() != null) {
				LogSearchOptions options = request.getData();
				SearchResult<EventDto<Object>> result = mgr
						.getDebugLogList(request.getData());
				if (result != null) {
					resp = new ListResponse<EventDto<Object>>(
							HttpStatusCode.SUCCESS,
							getMessageForKeyInLanguage("device.get_log_list.success"),
							options.getPage(), result.getTotal(),
							result.getList());
				} else {
					errorMessage = "device.get_log_list.fail";
				}
			} else {
				errorMessage = "common.error.invalid_parameters";
				httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
			}
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new ListResponse<EventDto<Object>>(httpStatusCode,
					getMessageForKeyInLanguage(errorMessage), 1, 0, null);
		}
		return resp;
	}

	@Override
	public Response<Object> getHPObjectStorageToken() {
		logger.info(LogUtility.logRequest(httpRequest.getUri()
				.getAbsolutePath().toString(), "Get HP Storage Token"));
		DeviceManager mgr = (DeviceManager) JndiLocator
				.doJndiLookup("DeviceManagerBean");
		Map<String, String> data = mgr.getHPObjectStorageToken();
		Response<Object> resp;
		if (data != null) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage("device.get_access_token.success"),
					HttpStatusCode.SUCCESS, data);
		} else {
			resp = new Response<Object>(
					getMessageForKeyInLanguage("device.get_access_token.fail"),
					HttpStatusCode.SERVER_ERROR, null);
		}
		logger.info(LogUtility.logResponse(httpRequest.getUri()
				.getAbsolutePath().toString(), resp));
		return resp;
	}

	@Override
	public ListResponse<EventDto<Object>> getAllLogs(LogSearchOptionsRequest request) {
		ListResponse<EventDto<Object>> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			DeviceManager mgr = (DeviceManager) JndiLocator
					.doJndiLookup("DeviceManagerBean");
			if (request != null && request.getData() != null) {
				LogSearchOptions options = request.getData();
				SearchResult<EventDto<Object>> result = mgr.getAllDeviceLog(request.getData());
				if (result != null) {
					resp = new ListResponse<EventDto<Object>>(
							HttpStatusCode.SUCCESS,
							getMessageForKeyInLanguage("device.get_log_list.success"),
							options.getPage(), result.getTotal(),
							result.getList());
				} else {
					errorMessage = "device.get_log_list.fail";
				}
			} else {
				errorMessage = "device.get_log_list.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		}  catch (DataAnalyticsException e) {
			logger.debug("Failed to retrieve logs : " + e.getMessage());
			errorMessage = e.getMessage();
		} catch (Exception e) {
			e.printStackTrace();
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new ListResponse<EventDto<Object>>(httpStatusCode,
					getMessageForKeyInLanguage(errorMessage), 1, 0, null);
		}
		return resp;
	}

	@Override
	public Response<List<String>> getAllEventType() {
		Response<List<String>> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			DeviceManager mgr = (DeviceManager) JndiLocator
					.doJndiLookup("DeviceManagerBean");
			List<String> list = mgr.getAllEventType();
			if (list != null) {
				resp = new Response<List<String>>(
						getMessageForKeyInLanguage("device.get_list.success"),
						HttpStatusCode.SUCCESS, list);
			} else {
				errorMessage = "device.get_list.fail";
			}			
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<List<String>>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public Response<Object> deleteDeviceLogs(DeleteRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
			if (isAdmin != null && isAdmin) {
				DeviceManager mgr = (DeviceManager) JndiLocator
						.doJndiLookup("DeviceManagerBean");
				if (request != null && (request.getData() != null)) {
					IdListInfo listInfo = request.getData();
					LinkedHashSet<Long> idList = listInfo.getIdList();
					if (idList != null && idList.size() > 0) {
						boolean flag = mgr.deleteDeviceLogs(listInfo);
						if (flag) {
							resp = new Response<Object>(
									getMessageForKeyInLanguage("device.delete_device_log.success"),
									HttpStatusCode.SUCCESS, null);
						} else {
							errorMessage = "device.delete_device_log.fail";
							httpStatusCode = HttpStatusCode.SERVER_ERROR;
						}
					} else {
						errorMessage = "common.error.invalid_parameters";
					}
				} else {
					errorMessage = "common.error.invalid_parameters";
				}
			} else {
				errorMessage = "device.delete_device_fail.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			errorMessage = e.getMessage();
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			errorMessage = "common.error.exception";
			httpStatusCode = HttpStatusCode.SERVER_ERROR;
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public ListResponse<EventDto<Object>> getBugReportLogs(
			LogSearchOptionsRequest request) {
		ListResponse<EventDto<Object>> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			DeviceManager mgr = (DeviceManager) JndiLocator
					.doJndiLookup("DeviceManagerBean");
			if (request != null && request.getData() != null) {
				LogSearchOptions options = request.getData();
				SearchResult<EventDto<Object>> result = mgr.getBugReportLogs(request.getData());
				if (result != null) {
					resp = new ListResponse<EventDto<Object>>(
							HttpStatusCode.SUCCESS,
							getMessageForKeyInLanguage("device.get_log_list.success"),
							options.getPage(), result.getTotal(),
							result.getList());
				} else {
					errorMessage = "device.get_log_list.fail";
				}
			} else {
				errorMessage = "device.get_log_list.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		}  catch (DataAnalyticsException e) {
			logger.debug("Failed to retrieve logs : " + e.getMessage());
			errorMessage = e.getMessage();
		} catch (Exception e) {
			e.printStackTrace();
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new ListResponse<EventDto<Object>>(httpStatusCode,
					getMessageForKeyInLanguage(errorMessage), 1, 0, null);
		}
		return resp;
	}

	@Override
	public Response<Object> changeEventStatus(ActivationRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			DeviceManager mgr = (DeviceManager) JndiLocator
					.doJndiLookup("DeviceManagerBean");
			if (request != null && (request.getData() != null)) {
				com.hp.da.rest.request.ActivationRequest.IdListInfo listInfo = request
						.getData();
				LinkedHashSet<Long> idList = listInfo.getIdList();
				if (idList != null && idList.size() > 0) {
					boolean flag = mgr.changeEventStatus(listInfo);
					if (flag) {
						String message = "device.new_event.success";
						if (listInfo.getStatus().equals(Status.REJECTED)) {
							message = "device.reject_event.success";
						} else if (listInfo.getStatus().equals(Status.RESOLVED)) {
							message = "device.resolve_event.success";
						}
						resp = new Response<Object>(
								getMessageForKeyInLanguage(message),
								HttpStatusCode.SUCCESS, null);
					} else {
						errorMessage = "device.activate_event.fail";
						if (listInfo.getStatus().equals(Status.REJECTED)) {
							errorMessage = "device.reject_event.fail";
						} else if (listInfo.getStatus().equals(Status.RESOLVED)) {
							errorMessage = "device.resolve_event.fail";
						}
					}
				} else {
					errorMessage = "common.error.invalid_parameters";
					httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
				}
			} else {
				errorMessage = "common.error.invalid_parameters";
				httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug("Exception : " + e.getMessage());
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}
}
