<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:url var="cp" value="<%=request.getContextPath() %>"/>
<!DOCTYPE HTML>
<html>
<head>
<title>MIRROS</title>
<%@ include file="../../layout/style.jspf" %>
<%@ include file="../../layout/header_script.jspf" %>
</head>
<body style="background: #f2f2f2;">
		<section class="jt-body">
			<header class="jt-header">
				<div class="jt-header-title jt-one-header-title">
					<div class="jt-header-banner">
						<a href="${cp }/"><h1 class="jt-header-banner-h1">J Town</h1></a>
					</div>
					<ul class="jt-header-login-menu">
						<sec:authorize access="hasRole('ROLE_USER')">
							<li id="jt-mypage">
								<a href="#none" class="jt-common-a-base"><sec:authentication property="principal.name" />&nbsp;<span class="jt-btn-underArrow">▼</span></a>
								<ul class="jt-under-wrap" id="jt-mypage-wrap">
									<li>
										<c:url value="/login/modify" var="modifyUrl"/>
										<a href="${modifyUrl }" class="jt-common-a-base" id="jt-modify">비밀번호 변경</a>
									</li>
									<li>
										<c:url value="/login/logout" var="logoutUrl"/>
										<a href="${logoutUrl }" class="jt-common-a-base" id="jt-logout" data-cpn="<sec:authentication property="principal.pn" />">로그아웃</a>
									</li>	
									<sec:authorize access="hasRole('ROLE_SELLER')">
									<li>
										<c:url value="/seller/${jtownUser.pn}" var="sellerUrl"/>
										<a href="${sellerUrl }" class="jt-common-a-base">판매자 페이지</a>
									</li>	
									</sec:authorize>
									<sec:authorize access="hasRole('ROLE_ADMIN')">
									<li>
										<c:url value="/admin" var="sellerUrl"/>
										<a href="${adminUrl }" class="jt-common-a-base">관리자 페이지</a>
									</li>	
									</sec:authorize>
								</ul>
							</li>
						</sec:authorize>
						<sec:authorize access="anonymous">
							<li>
								<a href="#none" class="jt-common-a-base" id="jt-login-smartPopup">LOG IN</a>
							</li>
							<li>
								<c:url var="join" value="/login/join"/>
								<a href="${join }" class="jt-common-a-base">SIGN UP</a>
							</li>
						</sec:authorize>
						<li id="jt-help">
							<c:url var="help" value="/help/question"/>
							<a href="#none" class="jt-common-a-base">HELP&nbsp;<span class="jt-btn-underArrow">▼</span></a>
							<ul class="jt-help-under-wrap" id="jt-help-wrap">
								<li>
									<c:url var="serviceGuide" value="/help/serviceGuide"/>
									<a href="${serviceGuide }" class="jt-common-a-base">About US</a>
								</li>
								<li>
									<c:url var="notice" value="/help/notice"/>
									<a href="${notice }" class="jt-common-a-base">News</a>
								</li>
								<li>
									<c:url var="question" value="/help/question"/>
									<a href="${question }" class="jt-common-a-base">FAQ</a>
								</li>
								<li>
									<c:url var="partnership" value="/help/partnership"/>
									<a href="${partnership }" class="jt-common-a-base">Business</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</header>
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
		</section>
	<%@ include file="../../layout/login.jspf" %>
	<%@ include file="../../layout/script.jspf" %>
	<script type="text/javascript">
		$(document).ready(function(){
			$('#j_username_page, #j_password_page').placeholder();
		});
	</script>
</body>
</html>