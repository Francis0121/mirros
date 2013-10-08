<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<!DOCTYPE HTML>
<html>
<head>
<title>Mirros :: 페이지를 찾을 수 없습니다.</title>
<link rel="shortcut icon" href="${cp }/resources/images/favicon.ico" type="image/x-icon"/>
</head>
<body>
<a href="${cp }/"><img alt="400 Bad request" src="${cp }/resources/images/error/400.jpg" style="border: 0;"></a>
</body>
</html>