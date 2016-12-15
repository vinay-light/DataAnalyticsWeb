package com.hp.da.rest.impl;

import java.util.LinkedHashSet;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import org.jboss.resteasy.spi.HttpRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hp.da.common.exception.DataAnalyticsException;
import com.hp.da.ejb.itf.ModelManager;
import com.hp.da.rest.dto.SearchResult;
import com.hp.da.rest.itf.ModelServiceItf;
import com.hp.da.rest.request.ActivationRequest;
import com.hp.da.rest.request.DeleteRequest;
import com.hp.da.rest.request.DeleteRequest.IdListInfo;
import com.hp.da.rest.request.DeviceSearchOptionsRequest;
import com.hp.da.rest.request.DeviceSearchOptionsRequest.DeviceSearchOptions;
import com.hp.da.rest.request.ModelInfoRequest;
import com.hp.da.rest.request.ModelInfoRequest.ModelInfo;
import com.hp.da.rest.request.ModelInfoRequest.SoftwareBuildInfo;
import com.hp.da.rest.request.SearchOptionsRequest;
import com.hp.da.rest.request.SearchOptionsRequest.SearchOptions;
import com.hp.da.rest.response.ListResponse;
import com.hp.da.rest.response.Response;
import com.hp.da.rest.util.JndiLocator;
import com.hp.da.rest.util.LogUtility;
import com.hp.da.util.enums.Status;
import com.hp.da.util.misc.HttpStatusCode;

public class ModelServiceImpl extends RESTService implements ModelServiceItf {

	private static final Logger logger = LoggerFactory
			.getLogger(ModelServiceImpl.class);

	@Context
	HttpServletRequest servletRequest;

	@Context
	HttpRequest httpRequest;

	@Override
	public Response<Object> addModel(ModelInfoRequest modelRequest) {
		Response<Object> resp = new Response<Object>();
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, modelRequest));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
			if (isAdmin != null && isAdmin) {
				ModelManager mgr = (ModelManager) JndiLocator
						.doJndiLookup("ModelManagerBean");
				if (modelRequest != null && modelRequest.getData() != null) {
					Status status = mgr.addModel(modelRequest.getData());
					if (status == Status.SUCCESS) {
						resp.buildResponseForSuccess(getMessageForKeyInLanguage("model.add_model.success"));
					} else {
						resp.buildResponse(
								getMessageForKeyInLanguage("model.add_model.fail.model_name_exist"),
								HttpStatusCode.SERVER_ERROR);
					}
				} else {
					resp.buildResponse(
							getMessageForKeyInLanguage("common.error.invalid_parameters"),
							HttpStatusCode.INCORRECT_PARAMS);
				}
			} else {
				resp.buildResponse(
						getMessageForKeyInLanguage("model.add_model.fail.access_denied"),
						HttpStatusCode.ACCESS_DENIED);
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			resp.buildResponse(getMessageForKeyInLanguage(e.getMessage()),
					HttpStatusCode.SERVER_ERROR);
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
			resp.buildResponse(
					getMessageForKeyInLanguage("common.error.exception"),
					HttpStatusCode.SERVER_ERROR);
		}
		return resp;
	}

	@Override
	public Response<Object> updateModel(ModelInfoRequest modelRequest) {
		Response<Object> resp = new Response<Object>();
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, modelRequest));
			ModelManager mgr = (ModelManager) JndiLocator
					.doJndiLookup("ModelManagerBean");
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
			if (isAdmin != null && isAdmin && modelRequest.getData() != null) {
				if (modelRequest != null && modelRequest.getData() != null) {
					Status status = mgr.updateModel(modelRequest.getData());
					if (status == Status.SUCCESS) {
						resp.buildResponseForSuccess(getMessageForKeyInLanguage("model.update_model.success"));
					} else {
						resp.buildResponse(
								getMessageForKeyInLanguage("model.update_model.fail.no_model"),
								HttpStatusCode.SERVER_ERROR);
					}
				} else {
					resp.buildResponse(
							getMessageForKeyInLanguage("common.error.invalid_parameters"),
							HttpStatusCode.INCORRECT_PARAMS);
				}
			} else {
				resp.buildResponse(
						getMessageForKeyInLanguage("model.update_model.fail.access_denied"),
						HttpStatusCode.ACCESS_DENIED);
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			resp.buildResponse(getMessageForKeyInLanguage(e.getMessage()),
					HttpStatusCode.SERVER_ERROR);
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
			resp.buildResponse(
					getMessageForKeyInLanguage("common.error.exception"),
					HttpStatusCode.SERVER_ERROR);
		}
		return resp;
	}

	@Override
	public Response<Object> deleteModels(DeleteRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");

			if (isAdmin != null && isAdmin) {
				ModelManager mgr = (ModelManager) JndiLocator
						.doJndiLookup("ModelManagerBean");
				if (request != null && (request.getData() != null)) {
					IdListInfo listInfo = request.getData();
					LinkedHashSet<Long> idList = listInfo.getIdList();
					if (idList != null && idList.size() > 0) {
						boolean flag = mgr.deleteModels(listInfo);
						if (flag) {
							resp.buildResponseForSuccess(getMessageForKeyInLanguage("model.delete_model.success"));
						} else {
							errorMessage = "model.delete_model.fail.no_model";
							httpStatusCode = HttpStatusCode.SERVER_ERROR;
						}
					} else {
						errorMessage = "common.error.invalid_parameters";
					}
				} else {
					errorMessage = "common.error.invalid_parameters";
				}
			} else {
				errorMessage = "model.delete_model.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			errorMessage = e.getMessage();
			httpStatusCode = HttpStatusCode.SERVER_ERROR;
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
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
	public Response<List<ModelInfo>> getAllDeviceModels() {
		Response<List<ModelInfo>> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			ModelManager mgr = (ModelManager) JndiLocator
					.doJndiLookup("ModelManagerBean");
			List<ModelInfo> list = mgr.getAllDeviceModels();
			if (list != null) {
				resp = new Response<List<ModelInfo>>(
						getMessageForKeyInLanguage("model.get_list.success"),
						HttpStatusCode.SUCCESS, list);
			} else {
				errorMessage = "model.get_list.fail";
			}

			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<List<ModelInfo>>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public ListResponse<ModelInfo> getAllDeviceModels(
			SearchOptionsRequest<SearchOptions> request) {
		ListResponse<ModelInfo> resp = new ListResponse<ModelInfo>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));

			if (request != null && request.getData() != null) {
				SearchOptions options = request.getData();
				ModelManager mgr = (ModelManager) JndiLocator
						.doJndiLookup("ModelManagerBean");
				SearchResult<ModelInfo> result = mgr
						.getAllDeviceModels(options);
				if (result != null) {
					resp = new ListResponse<ModelInfo>(
							HttpStatusCode.SUCCESS,
							getMessageForKeyInLanguage("model.get_list.success"),
							options.getPage(), result.getTotal(), result
									.getList());
				} else {
					errorMessage = "model.get_list.fail";
				}
			} else {
				errorMessage = "common.error.invalid_parameters";
				httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new ListResponse<ModelInfo>(httpStatusCode,
					getMessageForKeyInLanguage(errorMessage), 1, 0, null);
		}
		return resp;
	}

	@Override
	public Response<ModelInfo> getModelInfo(Long modelId) {
		Response<ModelInfo> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SUCCESS;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			ModelManager mgr = (ModelManager) JndiLocator
					.doJndiLookup("ModelManagerBean");
			if (modelId != null) {
				ModelInfo modelInfo = mgr.getModelInfo(modelId);
				if (modelInfo != null) {
					resp = new Response<ModelInfo>(
							getMessageForKeyInLanguage("model.get_model.success"),
							HttpStatusCode.SUCCESS, modelInfo);
				} else {
					errorMessage = "model.get_model.fail";
					httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
				}
			} else {
				errorMessage = "common.error.invalid_parameters";
				httpStatusCode = HttpStatusCode.SERVER_ERROR;
			}

			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
			errorMessage = "common.error.exception";
			httpStatusCode = HttpStatusCode.SERVER_ERROR;
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<ModelInfo>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public Response<Object> activateModels(ActivationRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
			if (isAdmin != null && isAdmin) {
				ModelManager mgr = (ModelManager) JndiLocator
						.doJndiLookup("ModelManagerBean");
				if (request != null && (request.getData() != null)) {
					com.hp.da.rest.request.ActivationRequest.IdListInfo listInfo = request
							.getData();
					LinkedHashSet<Long> idList = listInfo.getIdList();
					if (idList != null && idList.size() > 0) {
						boolean flag = mgr.activateModels(request);
						if (flag) {
							String message = (listInfo.isActivate()) ? "model.activate.success"
									: "model.deactivate.success";
							resp = new Response<Object>(
									getMessageForKeyInLanguage(message),
									HttpStatusCode.SUCCESS, null);
						} else {
							errorMessage = "model.activate.fail";
						}
					} else {
						errorMessage = "common.error.invalid_parameters";
						httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
					}
				} else {
					errorMessage = "common.error.invalid_parameters";
					httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
				}
			} else {
				errorMessage = "model.activate.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<Object>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public Response<List<ModelInfo>> getModelListByGroup(Long groupId) {
		Response<List<ModelInfo>> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			ModelManager mgr = (ModelManager) JndiLocator
					.doJndiLookup("ModelManagerBean");
			if (groupId != null) {
				List<ModelInfo> modelInfoList = mgr
						.getModelListByGroup(groupId);
				if (modelInfoList != null) {
					resp = new Response<List<ModelInfo>>(
							getMessageForKeyInLanguage("model.get_list.success"),
							HttpStatusCode.SUCCESS, modelInfoList);
				} else {
					errorMessage = "common.error.invalid_parameters";
				}
			} else {
				errorMessage = "common.error.invalid_parameters";
			}

			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
			errorMessage = "common.error.exception";
			httpStatusCode = HttpStatusCode.SERVER_ERROR;
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<List<ModelInfo>>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public Response<List<SoftwareBuildInfo>> getSwBuildListByModel(Long modelId) {
		Response<List<SoftwareBuildInfo>> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			ModelManager mgr = (ModelManager) JndiLocator
					.doJndiLookup("ModelManagerBean");
			if (modelId != null) {
				List<SoftwareBuildInfo> modelInfoList = mgr
						.getSwBuildListByModel(modelId);
				if (modelInfoList != null) {
					resp = new Response<List<SoftwareBuildInfo>>(
							getMessageForKeyInLanguage("model.get_sw_build.success"),
							HttpStatusCode.SUCCESS, modelInfoList);
				} else {
					errorMessage = "model.get_sw_build.fail";
				}
			} else {
				errorMessage = "common.error.invalid_parameters";
			}

			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
			errorMessage = "common.error.exception";
			httpStatusCode = HttpStatusCode.SERVER_ERROR;
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<List<SoftwareBuildInfo>>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public ListResponse<SoftwareBuildInfo> getAllSoftwareBuilds(
			DeviceSearchOptionsRequest request) {
		ListResponse<SoftwareBuildInfo> resp = new ListResponse<SoftwareBuildInfo>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			if (request != null && request.getData() != null) {
				DeviceSearchOptions options = request.getData();
				ModelManager mgr = (ModelManager) JndiLocator
						.doJndiLookup("ModelManagerBean");
				SearchResult<SoftwareBuildInfo> result = mgr
						.getAllSoftwareBuilds(options);
				if (result != null) {
					resp = new ListResponse<SoftwareBuildInfo>(
							HttpStatusCode.SUCCESS,
							getMessageForKeyInLanguage("model.get_sw_build_list.success"),
							options.getPage(), result.getTotal(), result
									.getList());
				} else {
					errorMessage = "model.get_sw_build_list.fail";
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
			resp = new ListResponse<SoftwareBuildInfo>(httpStatusCode,
					getMessageForKeyInLanguage(errorMessage), 1, 0, null);
		}
		return resp;
	}

	@Override
	public Response<Object> deleteSwBuilds(DeleteRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");

			if (isAdmin != null && isAdmin) {
				ModelManager mgr = (ModelManager) JndiLocator
						.doJndiLookup("ModelManagerBean");
				if (request != null && (request.getData() != null)) {
					IdListInfo listInfo = request.getData();
					LinkedHashSet<Long> idList = listInfo.getIdList();
					if (idList != null && idList.size() > 0) {
						boolean flag = mgr.deleteSwBuilds(listInfo);
						if (flag) {
							resp.buildResponseForSuccess(getMessageForKeyInLanguage("model.delete_sw_build.success"));
						} else {
							errorMessage = "model.delete_sw_build.fail.no_model";
							httpStatusCode = HttpStatusCode.SERVER_ERROR;
						}
					} else {
						errorMessage = "common.error.invalid_parameters";
					}
				} else {
					errorMessage = "common.error.invalid_parameters";
				}
			} else {
				errorMessage = "model.delete_sw_build.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
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
	public Response<Object> activateSwBuilds(ActivationRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			HttpSession httpSession = servletRequest.getSession();
			Boolean isAdmin = (Boolean) httpSession.getAttribute("isAdmin");
			if (isAdmin != null && isAdmin) {
				ModelManager mgr = (ModelManager) JndiLocator
						.doJndiLookup("ModelManagerBean");
				if (request != null && (request.getData() != null)) {
					com.hp.da.rest.request.ActivationRequest.IdListInfo listInfo = request
							.getData();
					LinkedHashSet<Long> idList = listInfo.getIdList();
					if (idList != null && idList.size() > 0) {
						boolean flag = mgr.activateSwBuilds(request);
						if (flag) {
							String message = (listInfo.isActivate()) ? "model.activate_sw_build.success"
									: "model.deactivate_sw_build.success";
							resp = new Response<Object>(
									getMessageForKeyInLanguage(message),
									HttpStatusCode.SUCCESS, null);
						} else {
							errorMessage = "model.activate_sw_build.fail";
						}
					} else {
						errorMessage = "common.error.invalid_parameters";
						httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
					}
				} else {
					errorMessage = "common.error.invalid_parameters";
					httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
				}
			} else {
				errorMessage = "model.activate_sw_build.fail.access_denied";
				httpStatusCode = HttpStatusCode.ACCESS_DENIED;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			logger.debug(ModelServiceImpl.class.getName(), e.getMessage());
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
