package org.cmdbuild.spring.configuration;

import static org.cmdbuild.spring.util.Constants.PROTOTYPE;
import static org.cmdbuild.spring.util.Constants.SOAP;
import static org.cmdbuild.spring.util.Constants.USER;

import org.apache.commons.lang3.builder.Builder;
import org.cmdbuild.auth.UserStore;
import org.cmdbuild.auth.user.OperationUser;
import org.cmdbuild.dao.view.CMDataView;
import org.cmdbuild.dao.view.user.UserDataView;
import org.cmdbuild.data.view.PermissiveDataView;
import org.cmdbuild.logic.data.access.WebServiceDataAccessLogicBuilder;
import org.cmdbuild.logic.data.access.UserDataAccessLogicBuilder;
import org.cmdbuild.logic.workflow.UserWorkflowLogicBuilder;
import org.cmdbuild.services.FilesStore;
import org.cmdbuild.services.event.ObservableDataView;
import org.cmdbuild.workflow.DataViewWorkflowPersistence;
import org.cmdbuild.workflow.DefaultWorkflowEngine;
import org.cmdbuild.workflow.DefaultWorkflowEngine.DefaultWorkflowEngineBuilder;
import org.cmdbuild.workflow.WorkflowPersistence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class User {

	@Autowired
	private Authentication authentication;

	@Autowired
	private Data data;

	@Autowired
	private FilesStore filesStore;

	@Autowired
	private Lock lock;

	@Autowired
	private PrivilegeManagement privilegeManagement;

	@Autowired
	private Properties properties;

	@Autowired
	private SystemUser systemUser;

	@Autowired
	private TaskManager taskManager;

	@Autowired
	private UserStore userStore;

	@Autowired
	private Workflow workflow;

	@Bean
	@Scope(PROTOTYPE)
	@Qualifier(SOAP)
	public WebServiceDataAccessLogicBuilder webServiceDataAccessLogicBuilder() {
		return new WebServiceDataAccessLogicBuilder( //
				data.systemDataView(), //
				data.lookupStore(), //
				permissiveDataView(), //
				userDataView(), //
				userStore.getUser(), //
				lock.dummyLockLogic());
	}

	@Bean
	@Scope(PROTOTYPE)
	@Qualifier(USER)
	public UserDataAccessLogicBuilder userDataAccessLogicBuilder() {
		return new UserDataAccessLogicBuilder( //
				data.systemDataView(), //
				data.lookupStore(), //
				permissiveDataView(), //
				userDataView(), //
				userStore.getUser(), //
				lock.configurationAwareLockLogic());
	}

	public static final String BEAN_USER_DATA_VIEW = "UserDataView";

	@Bean(name = BEAN_USER_DATA_VIEW)
	@Scope(PROTOTYPE)
	@Qualifier(USER)
	public CMDataView userDataView() {
		final CMDataView userDataView = new UserDataView( //
				data.systemDataView(), //
				userStore.getUser().getPrivilegeContext(), //
				privilegeManagement.rowAndColumnPrivilegeFetcher(), //
				userStore.getUser());
		return new ObservableDataView( //
				userDataView, //
				taskManager.defaultObserverCollector().allInOneObserver());
	}

	@Bean
	@Scope(PROTOTYPE)
	protected PermissiveDataView permissiveDataView() {
		return new PermissiveDataView(userDataView(), data.systemDataView());
	}

	@Bean
	@Scope(PROTOTYPE)
	@Qualifier(USER)
	protected Builder<DefaultWorkflowEngine> userWorkflowEngineBuilder() {
		return new DefaultWorkflowEngineBuilder() //
				.withOperationUser(systemUser.operationUserWithSystemPrivileges()) //
				.withPersistence(userWorkflowPersistence()) //
				.withService(workflow.workflowService()) //
				.withTypesConverter(workflow.workflowTypesConverter()) //
				.withEventListener(workflow.workflowLogger()) //
				.withAuthenticationService(authentication.defaultAuthenticationService());
	}

	@Bean
	@Scope(PROTOTYPE)
	protected WorkflowPersistence userWorkflowPersistence() {
		final OperationUser operationUser = userStore.getUser();
		return DataViewWorkflowPersistence.newInstance() //
				.withPrivilegeContext(operationUser.getPrivilegeContext()) //
				.withOperationUser(operationUser) //
				.withDataView(userDataView()) //
				.withProcessDefinitionManager(workflow.processDefinitionManager()) //
				.withLookupHelper(workflow.lookupHelper()) //
				.withWorkflowService(workflow.workflowService()) //
				.withActivityPerformerTemplateResolverFactory(workflow.activityPerformerTemplateResolverFactory()) //
				.build();
	}

	@Bean
	@Scope(PROTOTYPE)
	@Qualifier(USER)
	public UserWorkflowLogicBuilder userWorkflowLogicBuilder() {
		return new UserWorkflowLogicBuilder( //
				userStore.getUser(), //
				userStore.getUser().getPrivilegeContext(), //
				userWorkflowEngineBuilder(), //
				userDataView(), //
				properties.workflowProperties(), //
				filesStore, //
				lock.configurationAwareLockLogic());
	}

}
