package org.cmdbuild.servlets.json.management;

import static org.cmdbuild.common.Constants.DESCRIPTION_ATTRIBUTE;
import static org.cmdbuild.common.Constants.ID_ATTRIBUTE;
import static org.cmdbuild.servlets.json.CommunicationConstants.CARD;
import static org.cmdbuild.servlets.json.CommunicationConstants.FILE_XLS;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.fileupload.FileItem;
import org.cmdbuild.common.utils.PagedElements;
import org.cmdbuild.dao.entry.CMCard;
import org.cmdbuild.dao.entrytype.CMAttribute;
import org.cmdbuild.dao.entrytype.CMClass;
import org.cmdbuild.data.store.lookup.Lookup;
import org.cmdbuild.data.store.lookup.LookupType;
import org.cmdbuild.exception.ConsistencyException;
import org.cmdbuild.logic.GISLogic;
import org.cmdbuild.logic.data.QueryOptions;
import org.cmdbuild.logic.data.QueryOptions.QueryOptionsBuilder;
import org.cmdbuild.logic.data.access.CardStorableConverter;
import org.cmdbuild.logic.data.access.DataAccessLogic;
import org.cmdbuild.logic.data.access.DataAccessLogic.AttributesQuery;
import org.cmdbuild.logic.data.lookup.LookupLogic.LookupQuery;
import org.cmdbuild.model.data.Card;
import org.cmdbuild.servlets.json.JSONBaseWithSpringContext;
import org.cmdbuild.servlets.json.management.dataimport.xls.XLSCard;
import org.cmdbuild.servlets.json.management.dataimport.xls.XLSData;
import org.cmdbuild.servlets.json.serializers.AttributeSerializer;
import org.cmdbuild.servlets.utils.Parameter;
import org.cmdbuild.utils.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.common.collect.Lists;

public class ImportXLS extends JSONBaseWithSpringContext {
	
	private static final AttributesQuery USE_ATTRIBUTE_QUERY = new AttributesQuery() {

		@Override
		public Integer limit() {
			return null;
		}

		@Override
		public Integer offset() {
			return null;
		}

	};
	
	private static final LookupQuery USE_LOOKUP_QUERY = new LookupQuery() {

		@Override
		public Integer limit() {
			return null;
		}

		@Override
		public Integer offset() {
			return null;
		}

	};
	
	public static Iterable<String> toIterable(final JSONArray json) {
		try {
			final List<String> values = Lists.newArrayList();
			if (json != null && json.length() > 0) {
				for (int index = 0; index < json.length(); index++) {
					values.add(json.getString(index));
				}
			}
			return values;
		} catch (final Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * Stores in the session the records of the file that the user has uploaded
	 *
	 * @param file
	 *            is the uploaded file
	 * @param separatorString
	 *            the separator of the xls file
	 * @param classId
	 *            the id of the class where the records will be stored
	 */
	@JSONExported
	public void uploadXLS(@Parameter(FILE_XLS) final FileItem file, //
			@Parameter("idClass") final Long classId) throws IOException, JSONException {
		clearSession();
		final DataAccessLogic dataAccessLogic = systemDataAccessLogic();
		final XLSData importedXlsData = dataAccessLogic.importXlsFileFor(file, classId);
		sessionVars().setXlsData(importedXlsData);
	}

	/**
	 *
	 * @return the serialization of the cards
	 */
	@JSONExported
	public JSONObject getXLSRecords() throws JSONException {
		final JSONObject out = new JSONObject();
		final JSONArray rows = new JSONArray();
		out.put("rows", rows);
		final XLSData xlsData = sessionVars().getXlsData();
		final DataAccessLogic dataAccessLogic = systemDataAccessLogic();
		out.put("headers", xlsData.getHeaders());

		final CMClass entryType = dataAccessLogic.findClass(xlsData.getImportedClassName());
		for (final XLSCard xlsCard : xlsData.getCards()) {
			rows.put(serializeXLSCard(xlsCard, entryType));
		}

		return out;
	}

	@JSONExported
	// TODO: move to the logic to the logic??
	public void updateXLSRecords(
	) throws JSONException {

		final DataAccessLogic dataAccessLogic = systemDataAccessLogic();
		final XLSData xlsData = sessionVars().getXlsData();
		List<Map<String,Object>> xlsMapData=xlsData.getXlsMapData();
		Map<String,String> typeMap=new HashMap<String, String>();
		String className=xlsData.getImportedClassName();
		Map<String,Map<String,Long>> allKeyValues=new HashMap<String, Map<String,Long>>();
		//lookup
		final DataAccessLogic dataLogic = userDataAccessLogic();
		final Iterable<? extends CMAttribute> attributes = dataLogic.getAttributes(className, true,
				USE_ATTRIBUTE_QUERY);
		final AttributeSerializer attributeSerializer = AttributeSerializer.newInstance() //
			.withDataView(dataLogic.getView()) //
			.build();
		JSONArray array= attributeSerializer.toClient(attributes, true);
		for (int i = 0; i < array.length(); i++) {
			   JSONObject o =(JSONObject)array.get(i);
			   String type=StringUtils.objToString(o.get("type"));
			   if(type.equals("LOOKUP")){
				    String name=StringUtils.objToString(o.get("name"));
				    String na=StringUtils.objToString(o.get("lookup"));
					final LookupType lookupType = LookupType.newInstance().withName(na).build();
					final Iterable<Lookup> elements = lookupLogic().getAllLookup(lookupType, true, USE_LOOKUP_QUERY);
					Map<String,Long> attMap=new HashMap<String, Long>();
					for(Lookup up:elements){
						attMap.put(up.getDescription(), up.getId());
					}
					allKeyValues.put(name, attMap);
					typeMap.put(name, "LOOKUP");
			   }else if(type.equals("REFERENCE")){
				   String name=StringUtils.objToString(o.get("name"));
				   String na=StringUtils.objToString(o.get("referencedClassName"));
				   Map<String,String> ap=new HashMap<String, String>();
					ap.put("direction", "ASC");
					ap.put("property", "Description");
					JSONArray ord=new JSONArray();
					ord.put(ap);
					JSONArray attributesToSerialize = new JSONArray();
					attributesToSerialize.put(DESCRIPTION_ATTRIBUTE);
					attributesToSerialize.put(ID_ATTRIBUTE);
					final QueryOptionsBuilder queryOptionsBuilder = QueryOptions.newQueryOption() //
							.limit(500) //
							.offset(0) //
							.orderBy(ord) //
							.onlyAttributes(toIterable(attributesToSerialize));

					final QueryOptions queryOptions = queryOptionsBuilder.build();
					final PagedElements<Card> response = dataLogic.fetchCards(na, queryOptions);
					Iterable<Card> cards=response.elements();
					Map<String,Long> attMap=new HashMap<String, Long>();
					for (Card card : cards) {						
						Long id=card.getId();
						String desc=StringUtils.objToString(card.getAttribute("Description"));
						attMap.put(desc, id);
					}
					allKeyValues.put(name, attMap);
					typeMap.put(name, "REFERENCE");
			   }
		 }
		
		//更新
		for(Map<String,Object> records:xlsMapData){
			String description=StringUtils.objToString(records.get("Description"));
			if(!description.equals("")){
				Card card=dataAccessLogic.fetchCardByDescription(className, description);
				if(card==null){
					updateRecords(records,allKeyValues,typeMap);
					saveCard(className,records);
				}else{
					Boolean isupdate=isUpdated(records,card,typeMap);
					if(isupdate){
						updateRecords(records,allKeyValues,typeMap);
						updateCard(card.getId(), className, records);
					}
				}
			}
		}
	}
	
	/**
	 * 是否更新
	 * @param records
	 * @param card
	 * @param typeMap
	 * @return
	 * @throws JSONException
	 */
	private Boolean isUpdated(Map<String,Object> records,Card card,Map<String,String> typeMap) throws JSONException {
		Boolean isupdate=false;
		JSONObject jsobject=cardSerializer().toClient(card, CARD);
		JSONObject oldMap=jsobject.getJSONObject(CARD);
		Set<String> sts=records.keySet();
		Iterator<String>  sits=sts.iterator();
		while(sits.hasNext()){
			String key=sits.next();
			String newValue=StringUtils.objToString(records.get(key));
			String oldValue="";
			String type=typeMap.get(key);
			if(type!=null&&(type.equals("LOOKUP")||type.equals("REFERENCE"))){
				Map tempMap=(Map)oldMap.get(key);
				oldValue=StringUtils.objToString(tempMap.get("description"));
				if(!newValue.equals(oldValue)){
					isupdate=true;
					break;
				}
			}else{
				try {
					oldValue=StringUtils.objToString(oldMap.get(key));
					if(!newValue.equals(oldValue)){
						isupdate=true;
						break;
					}
				} catch (JSONException e) {
					if(newValue!=null && !newValue.equals("")){
						isupdate=true;
						break;
					}
				}
			}
		}
		return isupdate;
	}
	
	/**
	 * 更新
	 * @param records
	 * @param allKeyValues
	 * @param typeMap
	 */
	private void updateRecords(Map<String,Object> records,Map<String,Map<String,Long>> allKeyValues
			,Map<String,String> typeMap){
		Set<String> rset=records.keySet();
		Iterator<String> its=rset.iterator();
		while(its.hasNext()){
			String key=its.next();
			if(typeMap.containsKey(key)){
				Long vl=allKeyValues.get(key).get(records.get(key));
				records.put(key, vl);
			}
		}
	}
	
	/**
	 * 插入
	 * @param className
	 * @param attributes
	 */
	private void saveCard(String className,Map<String,Object> attributes){
		Long cardId=-1L;
		final DataAccessLogic dataLogic = userDataAccessLogic();
		final Card cardToBeCreatedOrUpdated = Card.newInstance() //
				.withClassName(className) //
				.withId(cardId) //
				.withUser(operationUser().getAuthenticatedUser().getUsername()) //
				.withAllAttributes(attributes) //
				.build();
		
		cardId = dataLogic.createCard(cardToBeCreatedOrUpdated);

		try {
			final Card card = dataLogic.fetchCard(className, cardId);
			updateGisFeatures(card, attributes);
		} catch (final Exception ex) {
			logger.warn("The card with id " + cardId
					+ " is not present in the database or the logged user can not see it");
		}
	}
	
	/**
	 * 更新
	 * @param cardId
	 * @param className
	 * @param attributes
	 */
	private void updateCard(Long cardId,String className,Map<String,Object> attributes){
		final DataAccessLogic dataLogic = userDataAccessLogic();
		final Card cardToBeCreatedOrUpdated = Card.newInstance() //
				.withClassName(className) //
				.withId(cardId) //
				.withUser(operationUser().getAuthenticatedUser().getUsername()) //
				.withAllAttributes(attributes) //
				.build();
		try {
			dataLogic.updateCardBatch(cardToBeCreatedOrUpdated);
		} catch (final ConsistencyException e) {
			notifier().warn(e);
		}
		
		try {
			final Card card = dataLogic.fetchCard(className, cardId);
			updateGisFeatures(card, attributes);
		} catch (final Exception ex) {
			logger.warn("The card with id " + cardId
					+ " is not present in the database or the logged user can not see it");
		}
	}
	
	private void updateGisFeatures(final Card card, final Map<String, Object> attributes) throws Exception {
		final GISLogic gisLogic = gisLogic();
		if (gisLogic.isGisEnabled()) {
			gisLogic.updateFeatures(card, attributes);
		}
	}

	@JSONExported
	public void storeXLSRecords() {
		
	}

	@JSONExported
	public void clearSession() {
		sessionVars().setXlsData(null);
	}

	private JSONObject serializeXLSCard( //
			final XLSCard xlsCard, //
			final CMClass entryType //

	) throws JSONException {

		final DataAccessLogic dataAccessLogic = systemDataAccessLogic();
		final CMCard cmCard = dataAccessLogic.resolveCardReferences(entryType, xlsCard.getCMCard());
		final Card card = CardStorableConverter.of(cmCard).convert(cmCard);

		final JSONObject jsonCard = cardSerializer().toClient(card);
		addEmptyAttributesToSerialization(jsonCard, cmCard);
		final JSONObject output = new JSONObject();
		final JSONObject notValidValues = new JSONObject();
		jsonCard.put("Id", xlsCard.getFakeId());
		jsonCard.put("IdClass_value", xlsCard.getCMCard().getType().getName());
		output.put("card", jsonCard);

		for (final Entry<String, Object> entry : xlsCard.getInvalidAttributes().entrySet()) {
			notValidValues.put(entry.getKey(), entry.getValue());
		}
		output.put("not_valid_values", notValidValues);

		return output;
	}

	/*
	 * The client needs to know all the attributes for each card, but the
	 * serializer does not add the attributes with no value to the JSONCard. Use
	 * this method to check the output of the serializer and add the empty
	 * attributes
	 */
	private void addEmptyAttributesToSerialization(final JSONObject jsonCard, final CMCard cmCard) throws JSONException {
		final CMClass entryType = cmCard.getType();
		for (final CMAttribute cmAttribute : entryType.getAttributes()) {
			final String attributeName = cmAttribute.getName();
			if (jsonCard.has(attributeName)) {
				continue;
			} else {
				jsonCard.put(attributeName, "");
			}
		}
	}

};
