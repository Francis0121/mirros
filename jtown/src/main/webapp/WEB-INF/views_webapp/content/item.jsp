<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ include file="../layout/home-header.jspf" %>
<div data-role="page" data-theme="g" >
<%@ include file="../layout/header.jspf" %>
	<div class="jt-app-contents-wrap">
		<div data-role="content" class="jt-app-item-content" data-theme="c" data-nav="${navType}"> 
			<div class="jt-app-item-change-mode"></div>
			<div data-role="popup" id="jt-app-reply-dialog" data-theme="d" data-overlay-theme="a">
				<input type="text" placeholder="Write your secret comment" maxlength="20" class="jt-app-reply-input-text" >
				<a type="button" class="jt-btn-gray jt-app-reply-submit" >댓글 완료</a>
			</div>
			<div data-role="popup" class="jt-app-item-like-popup-dialog" data-theme="c" data-overlay-theme="a">
				<div data-role="content" data-theme="c" role="main" >
					<div class="jt-app-item-like-popup-q-text">체크리스트에 추가하시겠습니까?</div>
					<div class="jt-app-item-like-popup-btn-wrap">
						<a data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-theme="d" class="jt-app-item-like-popup-ok">추가</a>
						<a data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-theme="d" class="jt-app-item-like-popup-cancel">취소</a>
					</div>
				</div>
			</div>
			<div class="jt-app-item-list"></div>
		</div>
	</div>
	<%@ include file="../layout/footer.jspf" %>
</div>
<%@ include file="../layout/home-footer.jspf" %>
