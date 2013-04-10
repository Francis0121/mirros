<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>MIRROS</title>
<script type="text/javascript" src="<c:url value='/js/jquery-1.6.2.min.js'/>"></script>
</head>
<body>
<c:choose>
	<c:when test="${confirm eq 1 }">
		<script type="text/javascript" language="javascript">
		/* <![CDATA[ */
		alert('인증되었습니다.');
		location.href='${cp}/';
		/* ]]> */
		</script>
	</c:when>
	<c:otherwise>
		<script type="text/javascript" language="javascript">
		/* <![CDATA[ */
		alert('잘못된 인증 번호 입니다.');
		location.href='${cp}/';
		/* ]]> */
		</script>
	</c:otherwise>
</c:choose>
</body>
</html>