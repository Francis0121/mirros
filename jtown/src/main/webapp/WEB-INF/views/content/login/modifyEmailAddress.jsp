<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<c:url var="cp" value="<%=request.getContextPath() %>"/>
<!DOCTYPE HTML>
<html>
<head>
<title>J TOWN</title>
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
			<section class="jt-modify-content-wrap">
				<div id="folderBar">
					<div id="folderTabName">
						<span id="digonalFolderImage">My Page</span>
					</div>
				</div>
				<section class="jt-modify-content">
					<hgroup>
						<h2>이메일&nbsp;변경</h1>
						<h1>본인확인을&nbsp;위해&nbsp;본&nbsp;계정의&nbsp;비밀번호를&nbsp;입력해&nbsp;주신&nbsp;후에&nbsp;변경하실&nbsp;비밀번호를&nbsp;입력해&nbsp;주세요.</h1>
					</hgroup>
					<c:url value="/login/modifyEmailAddress.jt" var="modifyEmailAddressUrl"/>
					<form:form commandName="jtownUser" method="post" action="${modifyEmailAddressUrl }" htmlEscape="true">
						<table class="jt-modify-content-table">
							<tfoot>
								<tr>
									<td colspan="2">
										<input type="submit" value="변경" class="jt-btn-orange" />	
									</td>
								</tr>
							</tfoot>
							<tbody>
								<tr>
									<th>현재&nbsp;이메일&nbsp;주소</th>
									<td><sec:authentication property="principal.username" /></td>
								</tr>
								<tr>
									<th>새&nbsp;이메일&nbsp;주소</th>
									<td>
										<div class="jt-join-user-vaild-wrap" id="confirmEmail">
											<span class="jt-form-invalid">정확한&nbsp;이메일&nbsp;주소를&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.(ex&nbsp;abcde@abc.com)</span>
										</div>
										<form:input path="username" data-form="modifyAddress" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
										<div class="jt-modify-content-error">	
											<form:errors path="username" cssClass="commonError"/>
										</div>
									</td>
								</tr>
								<tr>
									<th>비밀번호</th>
									<td>
										<form:password path="password" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
										<div class="jt-modify-content-error">	
											<form:errors path="password" cssClass="commonError"/>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</form:form>
				</section>
			</section>
	</section>
	<%@ include file="../../layout/login.jspf" %>
	<%@ include file="../../layout/script.jspf" %>
</body>
</html>