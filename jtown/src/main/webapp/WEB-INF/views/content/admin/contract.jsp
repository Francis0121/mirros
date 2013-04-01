<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<!DOCTYPE HTML>
<html>
<head>
<title>J TOWN</title>
<link rel="stylesheet" type="text/css" href="${cp}/resources/jquery/jquery-ui-1.10.0.custom.min.css" />
<link rel="stylesheet" type="text/css" href="${cp}/resources/css/common.css" />
<style type="text/css">
body{font-size: 12px; font-family: Dotum, Gulim; background: #f2f2f2; }
ul{list-style: none; margin: 0; padding: 0;}
.contract-header{ font-weight: bold; margin: 10px;}
.contract-body{ margin: 5px; }
.contract-body-header{ font-weight: bold; margin: 5px;}
.contract-body-content{ margin: 5px;}
.contract-body-content li { margin:  5px;}
.contract-body-footer{ margin: 5px;}
.jt-input { width: 220px; padding: 2px 3px; border: 1px solid #ad9c9c; height: 25px;
 	-webkit-border-radius: 5px 5px;
    -moz-border-radius: 5px 5px;
    border-radius: 5px 5px;
}
.jt-input:FOCUS{	border: 1px solid #ff8a00; }
.jt-input-error { width: 220px; padding: 2px 3px; border: 1px solid #ff8a00; height: 25px;
 	-webkit-border-radius: 5px 5px;
    -moz-border-radius: 5px 5px;
    border-radius: 5px 5px;
}
.jt-input-error:FOCUS{ border: 1px solid #ff0000;  }
.jt-select{width: 225px; padding: 2px 3px; border: 1px solid #ad9c9c; height: 30px;
 	-webkit-border-radius: 5px 5px;
    -moz-border-radius: 5px 5px;
    border-radius: 5px 5px;
}
.jt-select-error{width: 225px; padding: 2px 3px; border: 1px solid #ff8a00; height: 30px;
 	-webkit-border-radius: 5px 5px;
    -moz-border-radius: 5px 5px;
    border-radius: 5px 5px;
}
.jt-select:FOCUS{ border: 1px solid #ff8a00;}
.jt-select-error:FOCUS{ border: 1px solid #ff0000;}
</style>
</head>
<body>

	<header class="contract-header">
		계약 횟수 :	${contract.contractCount eq null ? 0 : contract.contractCount }	
	</header>
	
	<section class="contract-body">
		<c:url value="/admin/contract.jt" var="contractUrl"></c:url>
		<form:form commandName="contract" action="${contractUrl }" method="post">
			<form:hidden path="sellerPn"/>
			<c:choose>
				<c:when test="${contract.contractEndDate eq null }">
					<header class="contract-body-header">
						계약
					</header>
					<article class="contract-body-content">
						<ul>
							<li>
								<form:label path="startDate">시작날짜</form:label>
								<form:input path="startDate" cssClass="jt-input" cssErrorClass="jt-input-error" readonly="true"/>	
								<form:errors path="startDate"/>
							</li>
				</c:when>
				<c:otherwise>
					<header class="contract-body-header">
						계약연장
					</header>
					<article class="contract-body-content">
						<form:hidden path="contractEndDate"/>
						<ul>
				</c:otherwise>
			</c:choose>
					<li>
						<form:label path="contractPeroid">계약기간</form:label>
						<form:select path="contractPeroid" cssClass="jt-select" cssErrorClass="jt-select-error">
							<form:option value="">계약기간</form:option>	
							<form:option value="15">15일</form:option>
							<form:option value="30">1달</form:option>
							<form:option value="60">2달</form:option>
							<form:option value="90">3달</form:option>
							<form:option value="365">1년</form:option>
						</form:select>
						<form:errors path="contractPeroid"></form:errors>
					</li>
				</ul>
			</article>
			<footer class="contract-body-footer">				
				<input type="submit" value="입력" class="jt-btn-orange"/>	
			</footer>
		</form:form>
	</section>
	
	<script src="${cp}/resources/jquery/jquery-1.8.2.min.js"></script>
	<script src="${cp}/resources/jquery/jquery-ui-1.10.0.custom.js"></script>
	<script src="${cp}/resources/jquery/jquery.ui.datepicker-ko.js"></script>
	<script type="text/javascript">
		$(function(){
			$('#startDate').datepicker({
				dateFormat: 'yy-mm-dd',
				changeYear: true,
				width: 220
			});
		});
	</script>
	
	<c:if test="${result eq 1 }">
	<script type="text/javascript">
		alert('입력 성공');
		window.opener.location.reload();
		window.close();
	</script>
	</c:if>
</body>
</html>
