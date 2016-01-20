package org.cmdbuild.utils;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;

public class CreateExcel {

	/**
	 * 
	 * @param sheetName
	 *            sheet页名
	 * @param title
	 *            <属性字段，中文名称>
	 * @param list
	 * @param fops
	 */
	public void createFile(String sheetName, Map<String, String> title,
			List list, OutputStream fops) {
		HSSFWorkbook workbook =new HSSFWorkbook();
		HSSFSheet worksheet = workbook.createSheet(sheetName);
		
		//设置默认页
		workbook.setActiveSheet(0);
		
		HSSFDataFormat format = workbook.createDataFormat();
		// TimeStamp格式样式
		HSSFCellStyle cellStyleTimeStamp = workbook.createCellStyle();
		cellStyleTimeStamp.setDataFormat(format
				.getFormat("yyyy-mm-dd HH:mm:ss"));

		// Date格式样式
		HSSFCellStyle cellStyleDate = workbook.createCellStyle();
		cellStyleDate.setDataFormat(format.getFormat("yyyy-mm-dd"));

		// Long格式样式
		HSSFCellStyle cellStyleLong = workbook.createCellStyle();
		// 防止最长年限被格式化
		// cellStyleLong.setDataFormat(format.getFormat("#,##0.0000"));
		
		//设置表头样式
		Font headerFont = workbook.createFont();
		headerFont.setFontName("Times New Roman");
		headerFont.setFontHeightInPoints((short)9);
		headerFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
		
		HSSFCellStyle style=workbook.createCellStyle();
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setWrapText(true);
		style.setFont(headerFont);

		// 构造Excel表格 表头
		HSSFRow head = worksheet.createRow(0);
		int cellStart = 0;
		for (String value : title.values()) {
			HSSFCell cell=head.createCell(cellStart++);
			cell.setCellStyle(style);
			cell.setCellValue(value);
		}

		// 构造Excel表格 内容
		Object[] pop = title.keySet().toArray();
		for (int i = 0; i < list.size(); i++) {
			HSSFRow worksheetrow = worksheet.createRow(i + 1);
			Object vo = list.get(i);
			Map voMap = new HashMap();
			try {
				voMap = PropertyUtils.describe(vo);
			} catch (Exception e) {
				e.printStackTrace();
			}
			for (int j = 0; j < pop.length; j++) {
				Object value = voMap.get(pop[j]);
				HSSFCell cell = worksheetrow.createCell(j);
				if (value == null) {
					cell.setCellValue("");
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				} else if (value instanceof String) {
					cell.setCellValue(value.toString());
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				} else if (value instanceof Long) {
					cell.setCellStyle(cellStyleLong);
					cell.setCellValue(((Long) value).longValue());
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
				} else if (value instanceof BigDecimal) {
					cell.setCellStyle(cellStyleLong);
					cell.setCellValue(((BigDecimal) value).doubleValue());
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
				} else if (value instanceof Timestamp) {
					cell.setCellValue((Timestamp) value);
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
					cell.setCellStyle(cellStyleTimeStamp);
				} else if (value instanceof Date) {
					cell.setCellValue((Date) value);
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
					cell.setCellStyle(cellStyleDate);
				}
			}
		}
		try {
			workbook.write(fops);
			fops.flush();
			fops.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 
	 * @param sheetName
	 *            sheet页名
	 * @param title
	 *            <属性字段，中文名称>
	 * @param list
	 * @param fops
	 */
	public void createFile(String sheetName, int index,
			List<String> list, OutputStream fops) {
		HSSFWorkbook workbook =new HSSFWorkbook();
		HSSFSheet worksheet = workbook.createSheet(sheetName);
		
		//设置默认页
		workbook.setActiveSheet(0);
		
		HSSFDataFormat format = workbook.createDataFormat();
		// TimeStamp格式样式
		HSSFCellStyle cellStyleTimeStamp = workbook.createCellStyle();
		cellStyleTimeStamp.setDataFormat(format
				.getFormat("yyyy-mm-dd HH:mm:ss"));

		// Date格式样式
		HSSFCellStyle cellStyleDate = workbook.createCellStyle();
		cellStyleDate.setDataFormat(format.getFormat("yyyy-mm-dd"));

		// Long格式样式
		HSSFCellStyle cellStyleLong = workbook.createCellStyle();
		// 防止最长年限被格式化
		// cellStyleLong.setDataFormat(format.getFormat("#,##0.0000"));
		
		//设置表头样式
		Font headerFont = workbook.createFont();
		headerFont.setFontName("Times New Roman");
		headerFont.setFontHeightInPoints((short)9);
		headerFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
		
		HSSFCellStyle style=workbook.createCellStyle();
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setWrapText(true);
		style.setFont(headerFont);

		// 构造Excel表格 表头
		HSSFRow head = worksheet.createRow(0);
		int cellStart = 0;
		for (int i=0;i<index;i++) {
			HSSFCell cell=head.createCell(cellStart++);
			cell.setCellStyle(style);
			cell.setCellValue(list.get(i));
		}
		ExcelUtils.setHeaderAutoSize(worksheet, cellStart);

		// 构造Excel表格 内容
		int sum=list.size();
		int count=sum/index-1;
		for (int i =1; i <=count; i++) {
			HSSFRow worksheetrow = worksheet.createRow(i);
			for(int j=0;j<index;j++){
				Object value = list.get(index*i+j);
				HSSFCell cell = worksheetrow.createCell(j);
				if (value == null) {
					cell.setCellValue("");
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				} else if (value instanceof String) {
					cell.setCellValue(value.toString());
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				} else if (value instanceof Long) {
					cell.setCellStyle(cellStyleLong);
					cell.setCellValue(((Long) value).longValue());
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
				} else if (value instanceof BigDecimal) {
					cell.setCellStyle(cellStyleLong);
					cell.setCellValue(((BigDecimal) value).doubleValue());
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
				} else if (value instanceof Timestamp) {
					cell.setCellValue((Timestamp) value);
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
					cell.setCellStyle(cellStyleTimeStamp);
				} else if (value instanceof Date) {
					cell.setCellValue((Date) value);
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
					cell.setCellStyle(cellStyleDate);
				}
			}
		}
		try {
			workbook.write(fops);
			fops.flush();
			fops.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 
	 * @param sheetName
	 *            sheet页名   生成多个Sheet
	 * @param title
	 *            <属性字段，中文名称>
	 * @param list
	 * @param fops
	 */
	public void createFile(HSSFWorkbook workbook,int sheetNum,String sheetName, Map<String, String> title,
			List list, OutputStream fops) {
//		workbook = createWorkBook(isCrdt);
		HSSFSheet worksheet = workbook.createSheet();
		workbook.setSheetName(sheetNum, sheetName);
		
		//设置默认页
//		workbook.setActiveSheet(isCrdt ? 1 : 0);
		
		HSSFDataFormat format = workbook.createDataFormat();
		// TimeStamp格式样式
		HSSFCellStyle cellStyleTimeStamp = workbook.createCellStyle();
		cellStyleTimeStamp.setDataFormat(format
				.getFormat("yyyy-mm-dd HH:mm:ss"));

		// Date格式样式
		HSSFCellStyle cellStyleDate = workbook.createCellStyle();
		cellStyleDate.setDataFormat(format.getFormat("yyyy-mm-dd"));

		// Long格式样式
		HSSFCellStyle cellStyleLong = workbook.createCellStyle();
		// 防止最长年限被格式化
		// cellStyleLong.setDataFormat(format.getFormat("#,##0.0000"));

		//设置表头样式
		Font headerFont = workbook.createFont();
		headerFont.setFontName("Times New Roman");
		headerFont.setFontHeightInPoints((short)9);
		headerFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
		
		HSSFCellStyle style=workbook.createCellStyle();
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setWrapText(true);
		style.setFont(headerFont);

		// 构造Excel表格 表头
		HSSFRow head = worksheet.createRow(0);
		int cellStart = 0;
		for (String value : title.values()) {
			HSSFCell cell=head.createCell(cellStart++);
			cell.setCellStyle(style);
			cell.setCellValue(value);
		}

		// 构造Excel表格 内容
		Object[] pop = title.keySet().toArray();
		for (int i = 0; i < list.size(); i++) {
			HSSFRow worksheetrow = worksheet.createRow(i + 1);
			Object vo = list.get(i);
			Map voMap = new HashMap();
			try {
				voMap = PropertyUtils.describe(vo);
			} catch (Exception e) {
				e.printStackTrace();
			}
			for (int j = 0; j < pop.length; j++) {
				Object value = voMap.get(pop[j]);
				HSSFCell cell = worksheetrow.createCell(j);
				if (value == null) {
					cell.setCellValue("");
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				} else if (value instanceof String) {
					cell.setCellValue(value.toString());
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
				} else if (value instanceof Long) {
					cell.setCellStyle(cellStyleLong);
					cell.setCellValue(((Long) value).longValue());
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
				} else if (value instanceof BigDecimal) {
					cell.setCellStyle(cellStyleLong);
					cell.setCellValue(((BigDecimal) value).doubleValue());
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
				} else if (value instanceof Timestamp) {
					cell.setCellValue((Timestamp) value);
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
					cell.setCellStyle(cellStyleTimeStamp);
				} else if (value instanceof Date) {
					cell.setCellValue((Date) value);
					cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
					cell.setCellStyle(cellStyleDate);
				}
			}
		}
		
	}
}