package org.cmdbuild.spring.configuration;

import static org.cmdbuild.spring.util.Constants.DEFAULT;
import static org.cmdbuild.spring.util.Constants.PROTOTYPE;

import org.cmdbuild.dms.CachedDmsService;
import org.cmdbuild.dms.DefaultDocumentCreatorFactory;
import org.cmdbuild.dms.DmsConfiguration;
import org.cmdbuild.dms.DmsService;
import org.cmdbuild.dms.DocumentCreatorFactory;
import org.cmdbuild.dms.LoggedDmsService;
import org.cmdbuild.dms.alfresco.AlfrescoDmsService;
import org.cmdbuild.logic.dms.DefaultDmsLogic;
import org.cmdbuild.logic.dms.PrivilegedDmsLogic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class Dms {

	@Autowired
	private Data data;

	@Autowired
	private DmsConfiguration dmsConfiguration;

	@Autowired
	private PrivilegeManagement privilegeManagement;

	@Bean
	@Qualifier(DEFAULT)
	public DmsService dmsService() {
		return new CachedDmsService(loggedDmsService());
	}

	@Bean
	protected DmsService loggedDmsService() {
		return new LoggedDmsService(alfrescoDmsService());
	}

	@Bean
	protected DmsService alfrescoDmsService() {
		return new AlfrescoDmsService();
	}

	@Bean
	public DocumentCreatorFactory documentCreatorFactory() {
		return new DefaultDocumentCreatorFactory();
	}

	@Bean
	@Scope(PROTOTYPE)
	@Qualifier(DEFAULT)
	public PrivilegedDmsLogic privilegedDmsLogic() {
		return new PrivilegedDmsLogic( //
				defaultDmsLogic(), //
				data.systemDataView(), //
				privilegeManagement.userPrivilegeContext() //
		);
	}

	@Bean
	public DefaultDmsLogic defaultDmsLogic() {
		return new DefaultDmsLogic( //
				dmsService(), //
				data.systemDataView(), //
				dmsConfiguration, //
				documentCreatorFactory(), //
				data.lookupStore() //
		);
	}

}
