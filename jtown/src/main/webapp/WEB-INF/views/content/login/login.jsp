<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/none_header.jspf" %>
<section id="jt-login-form-page">
	<sec:authorize access="anonymous">	
			<c:url value="/j_spring_security_check" var="loginUrl"/>
			<form action="${loginUrl }" method="post" name="jtown-login-form">
			<table class="jt-login-form-table-page">
				<thead>
					<tr>
						<th colspan="2"> 
							LOG&nbsp;IN&nbsp;
						</th>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<th>
							<input id="_spring_security_remember_me" name="_spring_security_remember_me" type="checkbox" value="true"/>	
							<label for="_spring_security_remember_me">자동 로그인</label>
						</th>
						<c:url var="findPasswordUrl" value="/login/findPassword"/>
						<td><a href="${findPasswordUrl}" class="jt-login-form-find-password">비밀번호를&nbsp;잊으셨나요?</a></td>
					</tr>
					<tr>
						<th>
							<input type="submit" class="jt-btn-orange" value="LOG&nbsp;IN"/>
						</th>
						<td>&nbsp;</td>
					</tr>
				</tfoot>
				<tbody>
					<tr>
						<td colspan="2">
							<input id="j_username_page" name="j_username" size="20" maxlength="50" type="text" class="jt-login-form-table-input" placeholder="Email Address"/>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<input id="j_password_page" name="j_password" size="20" maxlength="50" type="password" class="jt-login-form-table-input"  placeholder="Password"/>
						</td>
					</tr>
				</tbody>
			</table>
			</form>
			<c:if test="${not empty param.login_error}">  
			<div class="jt-login-error-box">
		        <spring:message code="login.error.message"/>
		        <br/>
		        <c:out value="${SPRING_SECURITY_LAST_EXCEPTION.message}"/>
		    </div>
			</c:if>	
			<c:url value="/login/join" var="joinUrl"/>
			<span class="jt-login-form-join-span-page">아직&nbsp;회원이&nbsp;아니신가요?</span><a href="${joinUrl}" class="jt-login-form-join-btn-page">J&nbsp;Town&nbsp;가입하기</a>
	</sec:authorize>	
	<sec:authorize access="hasRole('ROLE_USER')">
		<span style="font-size: 12px; "><sec:authentication property="principal.name" />님 반갑습니다.</span>
	</sec:authorize>
</section>
<%@ include file="../../layout/none_footer.jspf" %>