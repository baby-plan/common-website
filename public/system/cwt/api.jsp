<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Random"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String api = request.getParameter("api");
int pagenumber = 1;
int dataSize = 35;
int pageSize = 5;
int pageCount = dataSize/pageSize;
if( pageCount * pageSize < dataSize){
  pageCount+=1;
}
if(request.getParameter("pagenumber")!=null){
  pagenumber = Integer.parseInt( request.getParameter("pagenumber") );
}/*
if( pageCount==pagenumber-1){
  pageSize = pageSize - dataSize*pageSize - pagenumber*pageSize;
}*/

// 输出客户端请求参数
//=====================================================================
System.out.println("request:{");
System.out.println("\r\nCLIENT ===> SERVER ["+api+"]");
System.out.println("\t"+basePath);
String ip = request.getHeader("X-Forwarded-For");  
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
    ip = request.getHeader("Proxy-Client-IP");  
}  
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
    ip = request.getHeader("WL-Proxy-Client-IP");  
}  
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
    ip = request.getHeader("HTTP_CLIENT_IP");  
}  
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
    ip = request.getHeader("HTTP_X_FORWARDED_FOR");  
}  
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
    ip = request.getRemoteAddr();  
}
System.out.println("\tIP:"+ip);
System.out.println("\tUser-Agent:"+request.getHeader("User-Agent"));
System.out.println("}");
//=====================================================================

// 输出客户端接口参数
//=====================================================================
System.out.println("params:{");
java.util.Enumeration eNames = request.getParameterNames();
String key=null;
String value=null;
while(eNames.hasMoreElements()){
  key = (String)eNames.nextElement();
  value = request.getParameter(key);
  if( key.length() >7){
    System.out.println("\t" +key +"\t:" + value);
  }else{
    System.out.println("\t" +key +"\t\t:" + value);
  }
}
System.out.println("}");
//=====================================================================

String output="";
output += ("{");
output += "\"c\":\"0\"";

if(api.equals("queryTargetList")){
    output += ",\"data\":[";
    output += "{\"total\":2,\"groupId\":\"g1\",\"groupName\":\"5oGS5L+h\",\"groupS\":[],\"targetIdS\":[{\"sid\":\"120331\",\"tName\":\"6IuPRTJFMTg1\",\"tmnId\":\"100546126\",\"tId\":\"t1\",\"sim\":\"14752530802\",\"t_type\":\"1\"}]}";
    output += "]";
}else if( api.equals("addSubscribe") ){
}else if( api.equals("queryLastTrack") ){
    output += ",\"data\":{\"plist\":[";
    output += "{\"cLat\":112661851,\"lon\":434993466,\"mileage\":82040,\"desc\":\"\",\"tName\":\"6IuPRTJOODE1\",\"speed\":0,\"cLon\":435008772,\"type\":\"P\",\"builtTime\":1451658919,\"dir\":0,\"sim\":\"14752530802\",\"lat\":112669404}";
    output += "]}";
}else if( api.equals("getTrack") ){
    output += ",\"data\":{\"plist\":[";
    int number=(int)(Math.random()*100*3600 + 438397030);
    output += "{\"clon\":"+number+",\"clat\":112201003,\"mileage\":82040,\"speed\":0,\"type\":\"P\",\"builtTime\":1468804627,\"dir\":0,\"sim\":\"14752530802\"}";    
    output += "]}";
}else if( api.equals("locationStat")){
    output = "{";
    output += "\"data\":{";
    output += "\"count\":22";
    output += ",\"pList\":[";
    for( int i=0;i<10;i++){
        if( i!=0){ output += ","; }
        output += "{\"posNum\":\""+new Random().nextInt(50)+"\"";
        output += ",\"sim\":\"13402674453\"";
        output += ",\"targetName\":\"6IuPRTJMNjIz\"";
        output += ",\"targetId\":\""+java.util.UUID.randomUUID().toString()+"\"}";
    }
    output += "]}";
}

output += ("}");
out.println(output);
System.out.println("SERVER ===> CLIENT ["+api+"]\r\n\t"+output);
%>