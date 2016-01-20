package org.cmdbuild.servlets.json.management;

import static org.cmdbuild.servlets.json.CommunicationConstants.CLASS_NAME;
import static org.cmdbuild.servlets.json.CommunicationConstants.SEPARATOR;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.activation.DataHandler;
import javax.mail.util.ByteArrayDataSource;

import org.cmdbuild.servlets.json.JSONBaseWithSpringContext;
import org.cmdbuild.servlets.utils.Parameter;

public class ExportXLS extends JSONBaseWithSpringContext {

	@JSONExported(contentType = "application/vnd.ms-excel")
	public DataHandler export(
			@Parameter(CLASS_NAME) final String className) //
			throws IOException {
		final File xlsFile = systemDataAccessLogic().exportClassAsXlsFile(className);
		return createDataHandler(xlsFile);
	}

	private DataHandler createDataHandler(final File file) throws FileNotFoundException, IOException {
		final FileInputStream in = new FileInputStream(file);
		final ByteArrayDataSource ds = new ByteArrayDataSource(in, "application/vnd.ms-excel");
		ds.setName(file.getName());
		return new DataHandler(ds);
	}

}
