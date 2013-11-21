<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ include file="../layout/home-header.jspf" %>
<div data-role="page">
<%@ include file="../layout/header.jspf" %>
	<div data-role="content" class="jt-app-item-content" data-nav="${categoryType}">
		<div class="jt-app-item-change-mode"></div>
		<div class="jt-app-item-list"></div>
<%-- 
	<ul data-role= "listview" data-inset="true" style="width:200px;">
		<li data-role="list-divider">Item</li>
		<li><a href="">검색결과1</a></li>
		<li><a href="">검색결과2</a></li>
		<li><a href="">검색결과3</a></li>
		<li><a href="">검색결과4</a></li>
	</ul>
--%>
	
	</div>
	<%@ include file="../layout/footer.jspf" %>
</div>
<%@ include file="../layout/home-footer.jspf" %>


