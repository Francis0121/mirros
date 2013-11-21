<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<%@ include file="../layout/home-header.jspf" %>
<div data-role="page">
<%@ include file="../layout/header.jspf" %>
	<div data-role="content" class="jt-app-more-content">
		<ul class="jt-app-more-menu">
		<sec:authorize ifNotGranted="ROLE_ANONYMOUS">
			<li><a onclick="$.logout()">로그아웃</a></li>
		</sec:authorize>
		<sec:authorize ifAnyGranted="ROLE_ANONYMOUS">
			<li><a href="${cp}/app/login">로그인</a></li>
		</sec:authorize>
			<li><a href="${cp}/app/join">회원가입</a></li>
			<li><a href="${cp}/app/mirros">미러스란?</a></li>
		</ul>
	</div>
	<%@ include file="../layout/footer.jspf" %>
</div>
<%@ include file="../layout/home-footer.jspf" %>
