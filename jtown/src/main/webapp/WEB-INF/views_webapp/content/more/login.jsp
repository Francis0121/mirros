<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ include file="../../layout/home-header.jspf" %>
<div data-role="page" data-theme="g" style="overflow: hidden;">
<%@ include file="../../layout/header.jspf" %>
	<div data-role="content" class="jt-app-item-content" data-theme="c">
	<ul class="jt-app-more-login-wrap" >
		<li>
			<form action="${cp}/signin/facebook" method="post" data-ajax="false" class="jt-app-more-fb-form">
				<input type="hidden" class="fbScope" name="scope" value="publish_stream,offline_access,email,user_birthday,user_likes" />
			    <a class="jt-btn-fbLogin" data-role="button" type="button" onclick="javascript:$.fbLogin()">
			    	<span class="loginImage"></span>
			    	<span class="loginText">간편하게 로그인하세요</span>
			    </a>
		    </form>
		</li>
		<li>
			<a class="jt-btn-orange jt-btn-emailLogin" data-role="button" type="button" onclick="javascript:$.goEmailLogin()">
				<span class="loginImage"></span>
				<span class="loginText">이메일로 로그인 하세요</span>
			</a>
		</li>
		<li>
			<div class="jt-app-more-login-join">
				<a class="jt-app-more-join-btn" onclick="$.goJoin()" data-transition="slide">간편 가입</a>
			</div>
		</li>
	</ul>
	<div class="jt-app-more-login-message-box">
		<div class="jt-app-more-login-message-box-text">
			<h3>Welcome to Mirros</h3>
				Mirros에 가입하시면 다양한 이벤트에 <br/> 
				바로 참여 가능합니다. 혜택을 누리세요!
		</div>
	</div>
	</div>
	<%@ include file="../../layout/footer.jspf" %>
</div>
<%@ include file="../../layout/home-footer.jspf" %>
