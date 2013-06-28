<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<!DOCTYPE HTML>
<html>
<head>
<title>Mirros :: 요청이 올바르지 않습니다.</title>
<link rel="shortcut icon" href="${cp }/resources/images/favicon.ico" type="image/x-icon"/>
</head>
<body>
<a href="javascript:history.back();"><img alt="500 Internal server error" src="${cp }/resources/images/error/500.jpg" style="border: 0;"></a>
</body>
</html>