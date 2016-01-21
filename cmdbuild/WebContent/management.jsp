<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<%@ taglib uri="/WEB-INF/tags/translations.tld" prefix="tr" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ page import="java.util.Collection" %>
<%@ page import="com.google.common.base.Joiner" %>
<%@ page import="org.apache.commons.lang3.StringEscapeUtils" %>
<%@ page import="org.cmdbuild.auth.UserStore" %>
<%@ page import="org.cmdbuild.auth.acl.CMGroup" %>
<%@ page import="org.cmdbuild.auth.user.OperationUser" %>
<%@ page import="org.cmdbuild.services.SessionVars" %>
<%@ page import="org.cmdbuild.spring.SpringIntegrationUtils" %>
<%@ page import="org.cmdbuild.config.GisProperties" %>

<%
	final SessionVars sessionVars = SpringIntegrationUtils.applicationContext().getBean(SessionVars.class);
	final String lang = sessionVars.getLanguage();
	final UserStore userStore = SpringIntegrationUtils.applicationContext().getBean(UserStore.class);
	final OperationUser operationUser = userStore.getUser();
	final CMGroup group = operationUser.getPreferredGroup();
	final String defaultGroupName = operationUser.getAuthenticatedUser().getDefaultGroupName();
	final Collection<String> groupDescriptionList = operationUser.getAuthenticatedUser().getGroupDescriptions();
	final String groupDecriptions = Joiner.on(", ").join(groupDescriptionList);
	final String extVersion = "4.2.0";
%>

<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<link rel="stylesheet" type="text/css" href="stylesheets/cmdbuild.css" />
		<link rel="stylesheet" type="text/css" href="javascripts/ext-<%= extVersion %>/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="javascripts/ext-<%= extVersion %>-ux/css/MultiSelect.css" />
		<link rel="stylesheet" type="text/css" href="javascripts/ext-<%= extVersion %>-ux/css/portal.css" />
		<link rel="stylesheet" type="text/css" href="javascripts/extensible-1.5.1/resources/css/extensible-all.css" />
		<link rel="icon" href="images/favicon.ico" />

		<%@ include file="libsJsFiles.jsp"%>

		<script type="text/javascript">
			Ext.ns('CMDBuild.Runtime'); // runtime configurations
			CMDBuild.Runtime.UserId = <%= operationUser.getAuthenticatedUser().getId() %>;
			CMDBuild.Runtime.Username = '<%= StringEscapeUtils.escapeEcmaScript(operationUser.getAuthenticatedUser().getUsername()) %>';

			CMDBuild.Runtime.DefaultGroupId = <%= group.getId() %>;
			CMDBuild.Runtime.DefaultGroupName = '<%= StringEscapeUtils.escapeEcmaScript(group.getName()) %>';
			CMDBuild.Runtime.DefaultGroupDescription = '<%= StringEscapeUtils.escapeEcmaScript(group.getDescription()) %>';
			CMDBuild.Runtime.IsAdministrator = <%= operationUser.hasAdministratorPrivileges() %>;
			<%
				// FIXME: The field LoginGroupId is currently never used, remove it from here?
				if (operationUser.getAuthenticatedUser().getGroupNames().size() == 1) {
			%>
					CMDBuild.Runtime.LoginGroupId = <%= group.getId() %>;
			<%	} %>
					CMDBuild.Runtime.AllowsPasswordLogin = <%= operationUser.getAuthenticatedUser().canChangePassword() %>;
					CMDBuild.Runtime.CanChangePassword = <%= operationUser.getAuthenticatedUser().canChangePassword() %>;
			<%
				if (group.getStartingClassId() != null) {
			%>
					CMDBuild.Runtime.StartingClassId = <%= group.getStartingClassId() %>;
			<%
				}
			%>
		</script>
		<script type="text/javascript" src="javascripts/cmdbuild/application.js"></script>
		<script type="text/javascript" src="services/json/utils/gettranslationobject"></script>

		<%@ include file="coreJsFiles.jsp"%>
		<%@ include file="managementJsFiles.jsp"%>
		<%@ include file="bimJsFiles.jsp"%>
		
		<link rel="stylesheet" type="text/css" href="javascripts/ext-<%= extVersion %>-ux/grid/css/GridFilters.css" />
		<link rel="stylesheet" type="text/css" href="javascripts/ext-<%= extVersion %>-ux/grid/css/RangeMenu.css" />	
				
		<script type="text/javascript" src="javascripts/ext-<%= extVersion %>-ux/grid/FiltersFeature.js"></script>
		<script type="text/javascript" src="javascripts/ext-<%= extVersion %>-ux/grid/filter/Filter.js"></script>
		<script type="text/javascript" src="javascripts/ext-<%= extVersion %>-ux/grid/filter/StringFilter.js"></script>
		<script type="text/javascript" src="javascripts/ext-<%= extVersion %>-ux/grid/filter/ListFilter.js"></script>
		<script type="text/javascript" src="javascripts/ext-<%= extVersion %>-ux/grid/filter/BooleanFilter.js"></script>
		<script type="text/javascript" src="javascripts/ext-<%= extVersion %>-ux/grid/filter/NumericFilter.js"></script>
		<script type="text/javascript" src="javascripts/ext-<%= extVersion %>-ux/grid/filter/DateFilter.js"></script>
		<script type="text/javascript" src="javascripts/ext-<%= extVersion %>-ux/grid/menu/RangeMenu.js"></script>
		<script type="text/javascript" src="javascripts/ext-<%= extVersion %>-ux/grid/menu/ListMenu.js"></script>
		<script type="text/javascript" src="javascripts/ext-<%= extVersion %>-ux/grid/filter/DateTimeFilter.js"></script>
<!--
		<script type="text/javascript" src="javascripts/cmdbuild/cmdbuild-core.js"></script>
		<script type="text/javascript" src="javascripts/cmdbuild/cmdbuild-management.js"></script>
-->

		<!-- GIS -->
			<%
				GisProperties g =  GisProperties.getInstance();
				if (g.isEnabled()) {
					if (g.isServiceOn(GisProperties.GOOGLE)) {
			%>
						<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
			<%
					}

					if (g.isServiceOn(GisProperties.YAHOO)) {
			%>
						<script src="http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=<%=g.getYahooKey()%>"></script>
			<%
					}
			%>
					<%@ include file="gisJsFiles.jsp" %>
			<%
				}
			%>

		<script type="text/javascript">
			Ext.onReady(function() {
				CMDBuild.app.Management.init();
				var url="http://"+window.location.hostname+":8080/visual/index.html";
				document.getElementById("logo_href").setAttribute("href",url);
			});
		</script>

		<title>CMDBuild</title>
	</head>
	<body>
		<div id="header" class="cm_no_display">
			<a href="" id="logo_href" target="_blank"><img alt="CMDBuild logo" src="images/logo1.png" /></a>
			<div id="instance_name"></div>
			<div id="header_po">China Foreign Exchange Trade System National InterBank Funding Center</div>
			<!-- required to display the map-->
			<div id="map"> </div>
			<div id="msg-ct" class="msg-blue">
				<div id="msg">
					<div id="msg-inner">
						<p><tr:translation key="common.user"/>: <strong><%= operationUser.getAuthenticatedUser().getDescription() %></strong> | <a href="logout.jsp"><tr:translation key="common.logout"/></a></p>
						<% if (defaultGroupName == null || "".equals(defaultGroupName) ) { %>
							<p id="msg-inner-hidden"><tr:translation key="common.group"/>: <strong><%= group.getDescription() %></strong>
						<%	} else { %>
							<p id="msg-inner-hidden"><tr:translation key="common.group"/>: <strong><tr:translation key="multiGroup"/></strong>

							<script type="text/javascript">
								CMDBuild.Runtime.GroupDescriptions = '<%= StringEscapeUtils.escapeEcmaScript(groupDecriptions) %>';
							</script>
						<% } %>

						<% if (operationUser.hasAdministratorPrivileges()) { %>
							| <a href="administration.jsp"><tr:translation key="administration.description"/></a>
						<% } %>
						</p>
					</div>
				</div>
			</div>
		</div>

		<div id="footer" class="cm_no_display">
			<div class="fl"><a href="http://www.cmdbuild.org" target="_blank">www.cmdbuild.org</a></div>
			<div id="cmdbuild_credits_link" class="fc"><tr:translation key="common.credits"/></div>
			<div class="fr"><a href="http://www.tecnoteca.com" target="_blank">Copyright &copy; Tecnoteca srl</a></div>
		</div>
	</body>
</html>