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
							<span style="font-weight: normal;">LOG&nbsp;IN&nbsp;TO</span>&nbsp;Mirros
						</th>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<th>
							<input id="_spring_security_remember_me" name="_spring_security_remember_me" type="checkbox" value="true" checked="checked"/>	
							<label for="_spring_security_remember_me">자동 로그인</label>
						</th>
						<td><button type="submit" class="jt-btn-orange-login">Log&nbsp;In</button></td>
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
							<c:url var="findPasswordUrl" value="/login/findPassword"/>
							<input id="j_password_page" name="j_password" size="20" maxlength="50" type="password" class="jt-login-form-table-password"  placeholder="Password"/><button type="button" onclick="location.href='${findPasswordUrl}'" title="비밀번호를&nbsp;잊으셨나요?" class="jt-login-findPassword">?</button>
						</td>
					</tr>
				</tbody>
			</table>
			</form>
			<ul class="jt-login-sign-wrap" >
				<li>
					<!-- FACEBOOK login -->
					<form action="<c:url value="/signin/facebook" />" method="POST">
						<input type="hidden" name="scope" value="publish_stream,offline_access,email,user_birthday,user_likes" />
				    	<button class="jt-btn-fbLogin" type="submit"><span class="loginImage"></span><span class="loginText">페이스북으로&nbsp;로그인</span></button>
					</form>							
				</li>
				<li>
					<c:url value="/login/join" var="joinUrl"/>
					<button class="jt-btn-orange jt-btn-emailLogin" onclick="location.href='${joinUrl }'" type="button"><span class="loginImage"></span><span class="loginText">이메일로&nbsp;간편&nbsp;가입</span></button>
				</li>
			</ul>
			<div class="jt-login-message-box">
				<h1>Weclode to Mirros</h1>
			
				<p>
					Mirros에서 더 쉽고 간편하게<br/>
					인터넷 쇼핑몰들을 체험하세요.
				</p>
			</div>
			
			<c:if test="${not empty param.login_error}">  
			<div class="jt-login-error-box">
		        <spring:message code="login.error.message"/>
		        <br/>
		        <c:out value="${SPRING_SECURITY_LAST_EXCEPTION.message}"/>
		    </div>
			</c:if>	
	</sec:authorize>	
	<sec:authorize access="hasRole('ROLE_USER')">
		<span style="font-size: 12px; "><sec:authentication property="principal.name" />님 반갑습니다.</span>
	</sec:authorize>
</section>
<%@ include file="../../layout/none_footer.jspf" %>