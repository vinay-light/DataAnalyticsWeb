/**
 * 
 */
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
import com.hp.da.ejb.itf.GroupManager;
import com.hp.da.rest.dto.SearchResult;
import com.hp.da.rest.itf.GroupServiceItf;
import com.hp.da.rest.request.ActivationRequest;
import com.hp.da.rest.request.DeleteRequest;
import com.hp.da.rest.request.DeleteRequest.IdListInfo;
import com.hp.da.rest.request.GroupRequest;
import com.hp.da.rest.request.GroupRequest.GroupInfo;
import com.hp.da.rest.request.SearchOptionsRequest;
import com.hp.da.rest.request.SearchOptionsRequest.SearchOptions;
import com.hp.da.rest.response.ListResponse;
import com.hp.da.rest.response.Response;
import com.hp.da.rest.util.JndiLocator;
import com.hp.da.rest.util.LogUtility;
import com.hp.da.util.enums.Status;
import com.hp.da.util.misc.HttpStatusCode;

/**
 * @author machindra
 * 
 */
public class GroupServiceImpl extends RESTService implements GroupServiceItf {

	private static final Logger logger = LoggerFactory
			.getLogger(GroupServiceImpl.class);

	@Context
	HttpRequest httpRequest;

	@Context
	HttpServletRequest servletRequest;

	@Override
	public Response<Object> addGroup(GroupRequest groupRequest) {
		Response<Object> resp = new Response<Object>();
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, groupRequest));
			GroupManager mgr = (GroupManager) JndiLocator
					.doJndiLookup("GroupManagerBean");
			if (groupRequest != null && groupRequest.getData() != null) {
				groupRequest.validateData();
				Status status = mgr.addGroup(groupRequest);
				if (status == Status.SUCCESS) {
					resp.buildResponse(
							getMessageForKeyInLanguage("group.create_group.success"),
							HttpStatusCode.SUCCESS);
				} else {
					resp.buildResponse(
							getMessageForKeyInLanguage("group.create_group.fail.group_already_exist"),
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
			resp.buildResponse(e.getMessage(), HttpStatusCode.SERVER_ERROR);
		}
		return resp;
	}

	@Override
	public Response<Object> updateGroup(GroupRequest groupRequest) {
		Response<Object> resp = new Response<Object>();
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, groupRequest));
			GroupManager mgr = (GroupManager) JndiLocator
					.doJndiLookup("GroupManagerBean");
			if (groupRequest != null) {
				Status status = mgr.updateGroup(groupRequest);
				if (status == Status.SUCCESS) {
					resp.buildResponse(
							getMessageForKeyInLanguage("group.update_group.success"),
							HttpStatusCode.SUCCESS);
				} else {
					resp.buildResponse(
							getMessageForKeyInLanguage("group.update_group.fail"),
							HttpStatusCode.SERVER_ERROR);
				}
			} else {
				resp.buildResponse(
						getMessageForKeyInLanguage("common.error.invalid_parameters"),
						HttpStatusCode.SERVER_ERROR);
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			resp.buildResponse(e.getMessage(), HttpStatusCode.SERVER_ERROR);
		} catch (Exception e) {
			e.printStackTrace();
			resp.buildResponse(e.getMessage(), HttpStatusCode.SERVER_ERROR);
		}
		return resp;
	}

	@Override
	public Response<Object> deleteGroups(DeleteRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			GroupManager mgr = (GroupManager) JndiLocator
					.doJndiLookup("GroupManagerBean");
			if (request != null && (request.getData() != null)) {
				IdListInfo listInfo = request.getData();
				LinkedHashSet<Long> idList = listInfo.getIdList();
				if (idList != null && idList.size() > 0) {
					boolean flag = mgr.deleteGroups(listInfo);
					if (flag) {
						resp = new Response<Object>(
								getMessageForKeyInLanguage("group.delete_group.success"),
								HttpStatusCode.SUCCESS, null);
					} else {
						errorMessage = "group.delete_group.fail";
						httpStatusCode = HttpStatusCode.SERVER_ERROR;
					}
				} else {
					errorMessage = "group.delete_group.fail.no_group_ids";
				}
			} else {
				errorMessage = "common.error.invalid_parameters";
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (DataAnalyticsException e) {
			errorMessage = e.getMessage();
		} catch (Exception e) {
			e.printStackTrace();
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
	public ListResponse<GroupInfo> getAllGroups(
			SearchOptionsRequest<SearchOptions> request) {
		ListResponse<GroupInfo> resp = new ListResponse<GroupInfo>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			if (request != null && request.getData() != null) {
				SearchOptions options = request.getData();
				GroupManager mgr = (GroupManager) JndiLocator
						.doJndiLookup("GroupManagerBean");
				SearchResult<GroupInfo> result = mgr.getAllGroups(request);
				if (result != null) {
					resp = new ListResponse<GroupInfo>(HttpStatusCode.SUCCESS,
							getMessageForKeyInLanguage("group.list.success"),
							options.getPage(), result.getTotal(),
							result.getList());
				} else {
					errorMessage = "group.list.fail.no_groups";
				}
			} else {
				errorMessage = "common.error.invalid_parameters";
				httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new ListResponse<GroupInfo>(httpStatusCode,
					getMessageForKeyInLanguage(errorMessage), 1, 0, null);
		}
		return resp;
	}

	@Override
	public Response<List<GroupInfo>> getAssignedGroups() {
		Response<List<GroupInfo>> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			GroupManager mgr = (GroupManager) JndiLocator
					.doJndiLookup("GroupManagerBean");
			HttpSession session = servletRequest.getSession();
			Long userId = (Long) session.getAttribute("userId");
			if (userId != null) {
				List<GroupInfo> list = mgr.getAssignedGroups(userId);
				if (list != null) {
					resp = new Response<List<GroupInfo>>(
							getMessageForKeyInLanguage("group.get_asigned_group.success"),
							HttpStatusCode.SUCCESS, list);
				} else {
					errorMessage = "group.get_asigned_group.fail";
				}
			} else {
				errorMessage = "group.get_asigned_group.fail";
			}

			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<List<GroupInfo>>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public Response<GroupInfo> getGroupInfo(Long groupId) {
		Response<GroupInfo> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			GroupManager mgr = (GroupManager) JndiLocator
					.doJndiLookup("GroupManagerBean");
			if (groupId != null) {
				GroupInfo groupInfo = mgr.getGroupInfoById(groupId);
				if (groupInfo != null) {
					resp = new Response<GroupInfo>(
							getMessageForKeyInLanguage("group.get_group.success"),
							HttpStatusCode.SUCCESS, groupInfo);
				} else {
					errorMessage = "group.get_group.fail.no_group";
				}
			} else {
				errorMessage = "common.error.invalid_parameters";
				httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
			}

			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<GroupInfo>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public Response<List<GroupInfo>> getAllGroups() {
		Response<List<GroupInfo>> resp = null;
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, ""));
			GroupManager mgr = (GroupManager) JndiLocator
					.doJndiLookup("GroupManagerBean");
			List<GroupInfo> list = mgr.getAllGroups();
			if (list != null) {
				resp = new Response<List<GroupInfo>>(
						getMessageForKeyInLanguage("group.all_groups.success"),
						HttpStatusCode.SUCCESS, list);
			} else {
				errorMessage = "group.all_groups.fail.no_groups";
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
			errorMessage = "common.error.exception";
		}
		if (!errorMessage.isEmpty()) {
			resp = new Response<List<GroupInfo>>(
					getMessageForKeyInLanguage(errorMessage), httpStatusCode,
					null);
		}
		return resp;
	}

	@Override
	public Response<Object> activateGroups(ActivationRequest request) {
		Response<Object> resp = new Response<Object>();
		String errorMessage = "";
		int httpStatusCode = HttpStatusCode.SERVER_ERROR;
		try {
			String url = httpRequest.getUri().getAbsolutePath().toString();
			logger.info(LogUtility.logRequest(url, request));
			GroupManager mgr = (GroupManager) JndiLocator
					.doJndiLookup("GroupManagerBean");
			if (request != null && (request.getData() != null)) {
				com.hp.da.rest.request.ActivationRequest.IdListInfo listInfo = request
						.getData();
				LinkedHashSet<Long> idList = listInfo.getIdList();

				if (!idList.isEmpty()) {
					boolean flag = mgr.activateGroups(request);
					if (flag) {
						String message = (listInfo.isActivate()) ? "group.activate.success"
								: "group.deactivate.success";
						resp.buildResponseForSuccess(getMessageForKeyInLanguage(message));
					} else {
						errorMessage = "Failed to activate/deactivate Group(s).";
					}
				} else {
					errorMessage = "group.activate.fail.no_groups";
				}
			} else {
				errorMessage = "common.error.invalid_parameters";
				httpStatusCode = HttpStatusCode.INCORRECT_PARAMS;
			}
			logger.info(LogUtility.logResponse(url, resp));
		} catch (Exception e) {
			e.printStackTrace();
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
