package org.cmdbuild.utils;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;

public class ExcelUtils {

    /**
     * ��ȡ��Ԫ����������Ϊ�ַ������͵�����
     * 
     * @param cell Excel��Ԫ��
     * @return String ��Ԫ����������
     */
    public static String getStringCellValue(HSSFCell cell) {
        String strCell = "";
        if(cell==null){
        	return strCell;
        }
        switch (cell.getCellType()) {
        case HSSFCell.CELL_TYPE_STRING:
            strCell = cell.getStringCellValue();
            break;
        case HSSFCell.CELL_TYPE_NUMERIC:
            strCell = String.valueOf(cell.getNumericCellValue());
            break;
        case HSSFCell.CELL_TYPE_BOOLEAN:
            strCell = String.valueOf(cell.getBooleanCellValue());
            break;
        case HSSFCell.CELL_TYPE_BLANK:
            strCell = "";
            break;
        default:
            strCell = "";
            break;
        }
        if (strCell.equals("") || strCell == null) {
            return "";
        }
        return strCell;
    }
    
    /**
     * ��ȡ��Ԫ����������Ϊ�������͵�����
     * 
     * @param cell
     *            Excel��Ԫ��
     * @return String ��Ԫ����������
     */
    public static String getDateCellValue(HSSFCell cell) {
        String result = "";
        try {
            int cellType = cell.getCellType();
            if (cellType == HSSFCell.CELL_TYPE_NUMERIC) {
                Date date = cell.getDateCellValue();
                result = (date.getYear() + 1900) + "-" + (date.getMonth() + 1)
                        + "-" + date.getDate();
            } else if (cellType == HSSFCell.CELL_TYPE_STRING) {
                String date = getStringCellValue(cell);
                result = date.replaceAll("[����]", "-").replace("��", "").trim();
            } else if (cellType == HSSFCell.CELL_TYPE_BLANK) {
                result = "";
            }
        } catch (Exception e) {
            System.out.println("���ڸ�ʽ����ȷ!");
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * ����ͷ
     * @param wb
     * @param sheet
     * @param headers
     */
    public static void fillHeaderCell(HSSFWorkbook wb,HSSFSheet sheet,String[] headers){
    	//���ñ�ͷ��ʽ
    	HSSFCellStyle style=setHeaderStyle(wb);
    	// ����Excel��� ��ͷ
		HSSFRow head = sheet.createRow(0);
		int cellCount = 0;
		for (String value : headers) {
			HSSFCell cell=head.createCell(cellCount++);
			cell.setCellStyle(style);
			cell.setCellValue(value);
		}
		setHeaderAutoSize(sheet,cellCount);
    }

    /**
     * ����ͷ
     * @param wb
     * @param sheet
     * @param headers
     */
    public static void fillHeaderCell(HSSFWorkbook wb,HSSFSheet sheet,List<String> headers){
    	//���ñ�ͷ��ʽ
    	HSSFCellStyle style=setHeaderStyle(wb);
    	// ����Excel��� ��ͷ
		HSSFRow head = sheet.createRow(0);
		int cellCount = 0;
		for (String value : headers) {
			HSSFCell cell=head.createCell(cellCount++);
			cell.setCellStyle(style);
			cell.setCellValue(value);
		}
		setHeaderAutoSize(sheet,cellCount);
    }
    
    /**
     * ���excel����
     * @param sheet
     * @param headers
     * @param rownumber
     * @param map
     */
    public static void fillSheetDataWithMap(HSSFSheet sheet,String[] headers,int rownumber,Map<String, Object> map){
    	HSSFRow row= sheet.createRow(rownumber);
    	int cellCount = 0;
    	for (String key : headers) {
			String val=StringUtils.objToString(map.get(key));
			HSSFCell cell=row.createCell(cellCount++);
			cell.setCellValue(val);
		}
    }
    
    public static List<Map<String,Object>> getListMapData(HSSFWorkbook wb){
    	List<Map<String,Object>> xlsDatas =new ArrayList<Map<String,Object>>();
    	String[] headers=getHeadersArry(wb);
    	HSSFSheet sheet = wb.getSheetAt(0);
		int rowNum = sheet.getLastRowNum(); 
        for(int i=1;i<=rowNum;i++){    
            HSSFRow row = sheet.getRow(i);
            Map<String,Object> map=new HashMap<String, Object>();
			for(int j=0;j<headers.length;j++){
				map.put(headers[j], ExcelUtils.getStringCellValue(row.getCell(j)));
			}
			xlsDatas.add(map);
		}
        return xlsDatas;
    }
    
    public static String[] getHeadersArry(HSSFWorkbook wb) {
		HSSFSheet sheet = wb.getSheetAt(0);
		HSSFRow row = sheet.getRow(0);
		int colNum = row.getPhysicalNumberOfCells();
        String[] title = new String[colNum];
        for (int i = 0; i < colNum; i++) {
            title[i] = ExcelUtils.getStringCellValue(row.getCell(i));
        }
        return title;
	}
    
    /**
     * ���ñ�ͷ��ʽ
     * @param wb
     */
    private static HSSFCellStyle setHeaderStyle(HSSFWorkbook wb){
    	Font headerFont = wb.createFont();
		headerFont.setFontName("Times New Roman");
		headerFont.setFontHeightInPoints((short)9);
		headerFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
		
    	HSSFCellStyle style=wb.createCellStyle();
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
		
		return style;
    }
    
    /**
     * ��ͷ�Զ�
     * @param sheet
     * @param count
     */
    public static void setHeaderAutoSize(HSSFSheet sheet,int count){
    	for(int i=0;i<=count;i++){
    		sheet.setColumnWidth(i, 15*256);
    	}
    }
    
}
