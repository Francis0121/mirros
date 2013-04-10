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
			<section id="jt-findpassword-page">
				<header>
					<hgroup>
						<h1>비밀번호 찾기</h1>
					</hgroup>

					<ul>
						<li>J TOWN 회원가입할 때 사용하신 email 을 아래에 입력해 주시기 바랍니다.</li>
						<li>기존에 사용하신 비밀번호를 초기화하고 해당 email 에 임의로 생성된 비밀번호가 제공됩니다.</li>
					</ul>
				</header>
				<section>
					<c:url var="findPassword" value="/login/findPassword.jt"/>
					<form:form commandName="jtownUser" method="post" action="${findPassword }" htmlEscape="true">
						<form:input id="username_findPassword" path="username" cssClass="jt-findpassword-input" cssErrorClass="jt-findpassword-input-error" placeholder="Email Address"/>
						<input type="submit" value="보내기" class="jt-btn-orange"/>
						<div class="jt-join-user-error">
							<form:errors path="username" cssClass="commonError"></form:errors>
						</div>
					</form:form>				
				</section>
				<footer>
					<ul>
						<li>문제가 있을 경우 고객센터에 연락주시면 적극 도와드리겠습니다</li>
					</ul>
				</footer>
			</section>
		</section>
	<%@ include file="../../layout/login.jspf" %>
	<%@ include file="../../layout/script.jspf" %>
	<script type="text/javascript">
		$(document).ready(function(){
			$('#username_findPassword').placeholder();
		});
	</script>
</body>
</html>