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
<%@ include file="../../layout/style.jspf" %>
<%@ include file="../../layout/header_script.jspf" %>
</head>
<body>
	<sec:authorize access="anonymous">
		<section class="jt-body">
			<header class="jt-join-user-header">
				<div class="jt-join-user-banner">
					<a href="${cp }/">J TOWN</a>
					
				</div>
			</header>
			<div id="jt-login-form">
				<c:url value="/j_spring_security_check" var="loginUrl"/>
				<form action="${loginUrl }" method="post">
				<table class="jt-login-form-table">
					<thead>
						<tr>
							<th colspan="2"> 
								J-TOWN
							</th>
						</tr>
					</thead>
					<tfoot>
						<tr>
							<th colspan="2">
								<label for="_spring_security_remember_me">자동 로그인</label>
								<input id="_spring_security_remember_me" name="_spring_security_remember_me" type="checkbox" value="true"/>	
							</th>
						</tr>
						<tr>
							<th colspan="2">
								<input type="submit" value="LOGIN" class="jt-btn-orange"/>
								<c:url value="/login/join" var="joinUrl"/>
								<input type="button" value="JOIN" class="jt-btn-orange" onclick="location.href='${joinUrl}'"/>
							</th>
						</tr>
					</tfoot>
					<tbody>
						<tr>
							<th>
								<label for="j_username">이메일</label>
							</th>
							<td>
								<input id="j_username" name="j_username" size="20" maxlength="50" type="text" class="createUserInputBox"/>
							</td>
						</tr>
						<tr>
							<th>
								<label for="j_password">비밀번호</label>
							</th>
							<td>
								<input id="j_password" name="j_password" size="20" maxlength="50" type="password" class="createUserInputBox"/>
							</td>
						</tr>
					</tbody>
				</table>
				</form>
			</div>
		</section>
	</sec:authorize>	
	<%@ include file="../../layout/login.jspf" %>
	<%@ include file="../../layout/script.jspf" %>
</body>
</html>