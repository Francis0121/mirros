<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:url var="cp" value="/"/>
<!DOCTYPE HTML>
<html>
<head>
<title>J TOWN</title>
<%@ include file="../../layout/style.jspf" %>
</head>
<body>
	<section class="jt-body">
		<header class="jt-join-user-header">
			<div class="jt-join-user-banner">
				<a href="${cp }">J TOWN</a>
				
			</div>
			<c:url var="login" value="/login" />
			<a href="${login }" class="jt-join-user-login">로그인</a>
		</header>
		<div class="jt-join-user-wrap">
			<div class="jt-join-user-info">
				<h1>회원가입</h1>
				<span>회원정보는 개인정보취급방침에 따라 안전하게 보호되며<br>회원님의 명백한 동의 없이 공개 또는 제3자에게 제공되지 않습니다.</span>
			</div>
			<c:url value="/login/joinSubmit.jt" var="joinSubmit"/>
			<form:form commandName="jtownUser" action="${joinSubmit }" htmlEscape="true" method="post">
			<table class="jt-join-user-table">
			<tfoot>
				<tr>
					<td colspan="2">
						<input type="button" value="<spring:message code='join.common.createBtn'/>" class="jt-join-submit jt-btn-orange" />
					</td>
				</tr>
			</tfoot>
			<tbody>
				<tr>
					<th>
						<form:label path="username" ><spring:message code="join.common.username"/></form:label>
					</th>
					<td>
						<form:input path="username" htmlEscape="true" data-type="create" cssClass="jt-join-user-input" maxlength="50"/>
						<br/>
						<span class="jt-form-invalid jt-join-user-confirmEmail" id="confirmEmail">
							<spring:message code="join.common.confirmEmail"/>
						</span>
						<form:errors path="username" cssClass="commonError"></form:errors>
					</td>
				</tr>
				<tr>
					<th>
						<form:label path="password" ><spring:message code="join.common.password"/></form:label>
					</th>
					<td>
						<form:password path="password" cssClass="jt-join-user-input" maxlength="16" />
						<br/>
						<span class="jt-form-invalid jt-join-user-passwordLength" id="passwordLength">
							<spring:message code="join.common.password.require.length"/>
						</span>
						<form:errors path="password" cssClass="commonError"></form:errors>
					</td>
				</tr>
				<tr>
					<th>
						<label for="confirmPassword"><spring:message code="join.common.confirmPassword"/></label>
					</th>
					<td>
						<input type="password" id="confirmPassword" name="confirmPassword" class="jt-join-user-input" maxlength="16"/>
						<br/>
						<span class="jt-form-invalid jt-join-user-confirmPw" id="confirmPW">
							<spring:message code="join.common.confirmPassword.text"/>
						</span>
					</td>
				</tr>
				<tr>
					<th>
						<form:label path="name"><spring:message code="join.common.nickName"/></form:label>
					</th>
					<td>
						<form:input path="name" cssClass="jt-join-user-input" maxlength="10"/>
						<br/>
						<span class="jt-form-invalid jt-join-user-nameLength" id="nameLength">
							<spring:message code="join.nickName.notAllow" />
						</span>
						<form:errors path="name" cssClass="commonError"></form:errors>
					</td>
				</tr>
			</tbody>
			</table>
			</form:form>
		</div>
	</section>
	<%@ include file="../../layout/login.jspf" %>
	<%@ include file="../../layout/script.jspf" %>
</body>
</html>