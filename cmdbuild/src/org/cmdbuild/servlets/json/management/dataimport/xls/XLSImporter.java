package org.cmdbuild.servlets.json.management.dataimport.xls;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.commons.fileupload.FileItem;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.cmdbuild.dao.entry.DBCard;
import org.cmdbuild.dao.entrytype.CMClass;
import org.cmdbuild.dao.view.CMDataView;
import org.cmdbuild.data.store.lookup.LookupStore;
import org.cmdbuild.servlets.json.management.dataimport.CardFiller;
import org.cmdbuild.utils.ExcelUtils;
import org.json.JSONException;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

public class XLSImporter {

	// a casual number from which start
	private static Long idCounter = 1000L;

	private final CMDataView view;
	private final CMClass importClass;
	private final LookupStore lookupStore;

	public XLSImporter( //
			final CMDataView view, //
			final LookupStore lookupStore, //
			final CMClass importClass
		) {

		this.view = view;
		this.lookupStore = lookupStore;
		this.importClass = importClass;
	}

	public XLSData getXlsDataFrom(final FileItem xlsFile) throws IOException, JSONException {
		return new XLSData(getHeaders(xlsFile), getXlsCardsFrom(xlsFile), importClass.getName(),getXlsMapData(xlsFile));
	}

	private Map<Long, XLSCard> getXlsCardsFrom(final FileItem xlsFile) throws IOException, JSONException {
		HSSFWorkbook wb=new HSSFWorkbook(xlsFile.getInputStream());
		return createXlsCards(wb);
	}
	
	private Map<Long, XLSCard> createXlsCards(HSSFWorkbook wb) throws IOException, JSONException {
		final Map<Long, XLSCard> xlsCards = Maps.newHashMap();
		try {
			final String[] headers = ExcelUtils.getHeadersArry(wb);
			HSSFSheet sheet = wb.getSheetAt(0);
			final CardFiller cardFiller = new CardFiller(importClass, view, lookupStore);
			int rowNum = sheet.getLastRowNum(); 
            for(int i=1;i<=rowNum;i++){    
                HSSFRow row = sheet.getRow(i); 
				final Long fakeId = getAndIncrementIdForCsvCard();
				final DBCard mutableCard = (DBCard) view.createCardFor(importClass);
				final XLSCard xlsCard = new XLSCard(mutableCard, fakeId);
				for(int j=0;j<headers.length;j++){
					try {
						cardFiller.fillCardAttributeWithValue( //
								mutableCard, //
								headers[j], //
								ExcelUtils.getStringCellValue(row.getCell(j)) //
							);
					} catch (CardFiller.CardFillerException ex) {
						xlsCard.addInvalidAttribute(ex.attributeName, ex.attributeValue);
					}
				}
				xlsCards.put(fakeId, xlsCard);
			}
		} finally {
			
		}
		return xlsCards;
	}
	
	private List<Map<String,Object>> getXlsMapData(final FileItem xlsFile) throws IOException, JSONException {
		HSSFWorkbook wb=new HSSFWorkbook(xlsFile.getInputStream());
		return ExcelUtils.getListMapData(wb);
	}

	private static synchronized Long getAndIncrementIdForCsvCard() {
		return idCounter++;
	}

	private Iterable<String> getHeaders(final FileItem xlsFile) throws IOException {
		HSSFWorkbook wb=new HSSFWorkbook(xlsFile.getInputStream());
        return Lists.newArrayList(ExcelUtils.getHeadersArry(wb));
	}
}