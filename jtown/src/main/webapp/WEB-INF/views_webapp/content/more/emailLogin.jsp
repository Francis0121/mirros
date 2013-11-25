<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ include file="../../layout/home-header.jspf" %>
<div data-role="page">
<%@ include file="../../layout/header.jspf" %>
	<div data-role="content" class="jt-app-item-content">
	
	<sec:authorize access="anonymous">
		<form action="${cp }/j_spring_security_check" data-ajax="false" method="post">
			<div>
				<input id="j_username_page" name="j_username" size="20" maxlength="50" type="email" class="jt-login-form-table-input" placeholder="Email Address"/>
			</div>
			<div class="jt-app-more-pw-wrap">
				<input id="j_password_page" name="j_password" size="20" maxlength="50" type="password" class="jt-login-form-table-password"  placeholder="Password"/>
			</div>
			<div class="jt-app-more-pw-find-wrap">
				<a data-role="button" data-corners="false" data-iconshadow="false" href='${cp}/login/findPassword'" title="비밀번호를&nbsp;잊으셨나요?" class="jt-login-findPassword">?</a>
			</div>
			<div>
				<input id="_spring_security_remember_me" name="_spring_security_remember_me" type="checkbox" value="true" checked="checked"/>	
			</div>
			<div>
				<a data-role="button" class="jt-app-more-login-btn" type="button" onclick="javascript:$.emailLogin()">Log&nbsp;In</a>
			</div>
			<div>
				<a type="button" class="jt-btn-orange" href="${cp}/app/join">간편가입</a>
			</div>
		</form>
			
			<div class="jt-login-error-box">
				<c:if test="${message ne null }">
					로그인에 실패하였습니다.<br/>
					<c:out value="${message }"/>
				</c:if>
		    </div>	
	</sec:authorize>	
	
	
	<div class="jt-app-more-login-message-box">
		<div class="jt-app-more-login-message-box-text">
			<h3>Weclode to Mirros</h3>
				Mirros에 가입하시면 다양한 이벤트에 <br/> 
				바로 참여 가능합니다. 혜택을 누리세요!
		</div>
	</div>
	
	</div>
	<%@ include file="../../layout/footer.jspf" %>
</div>
<%@ include file="../../layout/home-footer.jspf" %>