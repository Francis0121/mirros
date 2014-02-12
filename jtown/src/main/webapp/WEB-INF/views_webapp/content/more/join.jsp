<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ include file="../../layout/home-header.jspf" %>
<div data-role="page" data-theme="g" style="overflow: auto;">
<%@ include file="../../layout/header.jspf" %>
	<div data-role="content" class="jt-app-item-content" data-theme="c">
	
	<div class="jt-app-more-join-wrap">
		<header class="jt-join-direct-form-user-info">
			<div class="jt-app-more-join-title">회원가입</div>
		</header>
		<form id="jt-app-more-join-form" name="jt-join-direct-join-form"  htmlEscape="true" method="post">
			<div>
					<input name="name" data-form="join" class="jt-join-direct-user-input jt-join-direct-user-name" data-theme="d" maxlength="20" placeholder="이름"/>
					<div class="jt-join-validation jt-app-more-join-name-check"></div>
			</div>
			<div>
				<input name="username" htmlEscape="true" data-type="create" class="jt-join-direct-user-input jt-join-direct-user-username" data-theme="d"  maxlength="50"  type="email" placeholder="이메일"/>
				<span class="jt-join-validation jt-join-direct-user-username-check"></span>
			</div>
			<div>
				<input type="password" name="password" data-form="joinPw" class="jt-join-direct-user-input jt-join-direct-user-password" maxlength="16" data-theme="d"  placeholder="비밀번호 (8~16자)"/>
				<span class="jt-join-validation jt-join-direct-user-password-check"></span>
			</div>
			<div>
				<input type="password" id="confirmPassword" name="confirmPassword" class="jt-join-direct-user-input jt-join-direct-user-confirmPassword"  maxlength="16" data-theme="d" placeholder="비밀번호 확인"/>
				<span class="jt-join-validation jt-join-direct-user-confirmPassword-check"></span>
			</div>
		</form>
		<footer class="jt-join-user-footer jt-join-direct-user-footer">
		<div>
		<a type="button" class="jt-app-more-join-submit jt-btn-orange" onclick="$.joinSubmit()">가입하기</a>
		</div>
		<ul class="jt-app-more-join-text">
			<li>‘가입하기’를&nbsp;누르면&nbsp;<a href="${cp }/app/individual" data-transition="fade">이용약관</a>&nbsp;및&nbsp;<a href="${cp }/app/agreement" data-transition="fade">개인정보취급방침</a>에
			&nbsp;동의한&nbsp;것으로&nbsp;간주합니다.</li>
			<li>판매자&nbsp;회원가입은&nbsp;고객센터로&nbsp;문의주시기 바랍니다.</li>
		</ul>
	</footer>
	</div>
	
	
	
	</div>
	<%@ include file="../../layout/footer.jspf" %>
</div>
<%@ include file="../../layout/home-footer.jspf" %>
