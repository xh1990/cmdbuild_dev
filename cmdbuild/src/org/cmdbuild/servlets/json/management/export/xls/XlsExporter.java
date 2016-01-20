package org.cmdbuild.servlets.json.management.export.xls;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.cmdbuild.dao.entry.CMEntry;
import org.cmdbuild.dao.entry.IdAndDescription;
import org.cmdbuild.logger.Log;
import org.cmdbuild.servlets.json.management.export.CMDataSource;
import org.cmdbuild.servlets.json.management.export.DataExporter;
import org.cmdbuild.utils.ExcelUtils;

import com.google.common.collect.Iterables;
import com.google.common.collect.Maps;

public class XlsExporter implements DataExporter {

	private final File xlsFile;
	private final String sheetName;

	public XlsExporter(final File file,String classname) {
		this.xlsFile = file;
		this.sheetName=classname;
	}

	@Override
	public File export(final CMDataSource source) {
		try {
			return writeXlsDataToFile(source);
		} catch (final IOException ex) {
			throw new RuntimeException(ex.getCause());
		}
	}

	private File writeXlsDataToFile(final CMDataSource source) throws IOException {
		final FileOutputStream fout = new FileOutputStream(xlsFile);
		HSSFWorkbook wb = new HSSFWorkbook();
		HSSFSheet sheet = wb.createSheet(sheetName);
		final Iterable<String> attributeNames = source.getHeaders();
		final String[] headers = Iterables.toArray(attributeNames, String.class);
		ExcelUtils.fillHeaderCell(wb, sheet, headers);
		final Iterable<CMEntry> entriesToExport = source.getEntries();
		try {
			int rownumber=0;
			for (final CMEntry entry : entriesToExport) {
				try {
					final Map<String, Object> attributeNameToValue = createMapFrom(entry, attributeNames);
					rownumber++;
					ExcelUtils.fillSheetDataWithMap(sheet,headers,rownumber,attributeNameToValue);
				} catch (final RuntimeException e) {
					Log.PERSISTENCE.warn(String.format("Error exporting CSV for %s card %d", entry.getType()
							.getIdentifier().getLocalName(), entry.getId()));
					throw e;
				}
			}
		} finally {
			wb.write(fout);
			fout.close();
		}
		return xlsFile;
	}

	private Map<String, Object> createMapFrom(final CMEntry entry, final Iterable<String> attributeNames) {
		final Map<String, Object> map = Maps.newHashMap();
		for (final String attributeName : attributeNames) {
			final Object value = (entry.get(attributeName) != null) ? entry.get(attributeName) : "";
			if (value instanceof IdAndDescription) {
				final String description = ((IdAndDescription) value).getDescription();
				map.put(attributeName, description != null ? description : "");
			} else {
				map.put(attributeName, value);
			}
		}

		return map;
	}

}
