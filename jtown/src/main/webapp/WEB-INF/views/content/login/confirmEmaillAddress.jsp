<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<!DOCTYPE HTML>
<html>
<head>
<title>MIRROS</title>
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