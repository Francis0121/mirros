<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ include file="../layout/home-header.jspf" %>
<div data-role="page">
<%@ include file="../layout/header.jspf" %>
	<div data-role="content" class="jt-app-item-content" data-nav="${categoryType}">
		<div class="jt-app-item-change-mode"></div>
		<div class="jt-app-item-list"></div>
	</div>
	<%@ include file="../layout/footer.jspf" %>
</div>
<%@ include file="../layout/home-footer.jspf" %>


