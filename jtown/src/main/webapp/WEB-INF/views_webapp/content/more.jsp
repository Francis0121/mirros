<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<%@ include file="../layout/home-header.jspf" %>
<div data-role="page" data-theme="g" style="overflow: hidden">
<%@ include file="../layout/header.jspf" %>

	<div class="jt-app-contents-wrap">
		<div data-role="content" class="jt-app-more-content">
			<ul class="jt-app-more-menu">
			<sec:authorize ifNotGranted="ROLE_ANONYMOUS">
				<li><a onclick="$.logout()"><div class="jt-app-more-logout"></div><div>로그아웃</div></a></li>
			</sec:authorize>
			<sec:authorize ifAnyGranted="ROLE_ANONYMOUS">
				<li><a href="${cp}/app/login"  data-transition="fade"><div class="jt-app-more-login"></div><div>로그인</div></a></li>
			</sec:authorize>
				<li><a href="${cp}/app/join" data-transition="fade"><div class="jt-app-more-join"></div><div>회원가입</div></a></li>
				<li><a href="${cp}/app/mirros" data-transition="fade"><div class="jt-app-more-mirros"></div><div>미러스란?</div></a></li>
				<li class="jt-app-more-cacao-invite"><a data-transition="fade"><div class="jt-app-more-cacao"></div><div>카톡 친구 초대</div></a></li>
				<li class="jt-app-more-facebook-invite"><a data-transition="fade"><div class="jt-app-more-fb"></div><div>페북 친구 초대</div></a></li>
			</ul>
		</div>
	</div>
	<%@ include file="../layout/footer.jspf" %>
</div>
<%@ include file="../layout/home-footer.jspf" %>
