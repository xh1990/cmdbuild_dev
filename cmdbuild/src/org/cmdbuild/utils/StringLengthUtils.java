package org.cmdbuild.utils;

public class StringLengthUtils {

	public static boolean isLetter(char c) { 
        int k = 0x80; 
        return c / k == 0 ? true : false; 
    }
	
	/**
	 * �ж��ַ����Ƿ�Ϊ��
	 * @param str
	 * @return
	 */
	public static boolean isNull(String str){
		if(str==null||str.trim().equals("")||str.trim().equalsIgnoreCase("null")){
			return true;
		}else{
			return false;
		}
	}
	
	/** 
     * �õ�һ���ַ����ĳ���,��ʾ�ĳ���,һ�����ֻ��պ��ĳ���Ϊ2,Ӣ���ַ�����Ϊ1 
     * @param String s ��Ҫ�õ����ȵ��ַ��� 
     * @return int �õ����ַ������� 
     */ 
    public static int length(String s) {
        if (s == null)
            return 0;
        char[] c = s.toCharArray();
        int len = 0;
        for (int i = 0; i < c.length; i++) {
            len++;
            if (!isLetter(c[i])) {
                len++;
            }
        }
        return len;
    }
	
    
    /** 
     * �õ�һ���ַ����ĳ���,��ʾ�ĳ���,һ�����ֻ��պ��ĳ���Ϊ1,Ӣ���ַ�����Ϊ0.5 
     * @param String s ��Ҫ�õ����ȵ��ַ��� 
     * @return int �õ����ַ������� 
     */ 
    public static double getLength(String s) {
    	double valueLength = 0;  
        String chinese = "[\u4e00-\u9fa5]";  
        // ��ȡ�ֶ�ֵ�ĳ��ȣ�����������ַ�����ÿ�������ַ�����Ϊ2������Ϊ1  
        for (int i = 0; i < s.length(); i++) {  
            // ��ȡһ���ַ�  
            String temp = s.substring(i, i + 1);  
            // �ж��Ƿ�Ϊ�����ַ�  
            if (temp.matches(chinese)) {  
                // �����ַ�����Ϊ1  
                valueLength += 1;  
            } else {  
                // �����ַ�����Ϊ0.5  
                valueLength += 0.5;  
            }  
        }  
        //��λȡ��  
        return  Math.ceil(valueLength);  
    }
	
}
