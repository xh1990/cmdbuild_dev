package org.cmdbuild.servlets.json.management.dataimport.xls;

import java.util.List;
import java.util.Map;

public class XLSData {

	private final Iterable<String> headers;
	private final Map<Long, XLSCard> tempIdToXlsCard;
	private final String className;
	private final List<Map<String,Object>> xlsMapData;

	public XLSData( //
			final Iterable<String> headers, //
			final Map<Long, XLSCard> tempIdToXlsCard,
			final String className,
			final List<Map<String,Object>> xlsMapData
		) {

		this.headers = headers;
		this.tempIdToXlsCard = tempIdToXlsCard;
		this.className = className;
		this.xlsMapData=xlsMapData;
	}

	public Iterable<String> getHeaders() {
		return headers;
	}

	public Iterable<XLSCard> getCards() {
		return tempIdToXlsCard.values();
	}

	public String getImportedClassName() {
		return className;
	}

	public XLSCard getCard(final Long id) {
		return tempIdToXlsCard.get(id);
	}

	public void removeCard(final Long id) {
		tempIdToXlsCard.remove(id);
	}

	public List<Map<String, Object>> getXlsMapData() {
		return xlsMapData;
	}

}
