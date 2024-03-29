<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/home-header.jspf" %>
<header class="mm-header">
	<div>
		<a href="${mcp }/">Mirros</a>
	</div>
</header>
<sec:authorize access="anonymous">
	<form method="post" id="mm-page-login-form" onsubmit="onPopupLoginSubmit(); return false;">
		<table class="mm-login-table">
			<tfoot>
				<tr>
					<th>
						<input id="_spring_security_remember_me" name="_spring_security_remember_me" type="checkbox" value="true" checked="checked"/>	
						<label for="_spring_security_remember_me">자동 로그인</label>
					</th>
					<td><button type="submit" class="mm-btn-orange-login">Log&nbsp;In</button></td>
				</tr>
			</tfoot>
			<tbody>
				<tr>
					<td colspan="2">
						<input id="j_username_page" name="j_username" size="20" maxlength="50" type="text" class="mm-login-table-input" placeholder="Email Address"/>
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<input id="j_password_page" name="j_password" size="20" maxlength="50" type="password" class="mm-login-table-password"  placeholder="Password"/><button type="button" onclick="location.href='${mcp}/login/findPassword'" title="비밀번호를&nbsp;잊으셨나요?" class="mm-login-findPassword">?</button>
					</td>
				</tr>
			</tbody>
		</table>
		</form>
		<ul class="mm-login-sign-wrap" >
			<li>
				<!-- FACEBOOK login -->
				<form action="${cp }/signin/facebook" method="POST">
					<input type="hidden" name="scope" value="publish_stream,offline_access,email,user_birthday,user_likes" />
			    	<button class="mm-btn-fbLogin" type="submit"><span class="loginImage"></span><span class="loginBar"></span><span>페이스북으로&nbsp;로그인</span></button>
				</form>
			</li>
			<li>
				<button class="mm-btn-orange mm-btn-emailLogin" onclick="location.href='${mcp }/login/join'" type="button"><span class="loginImage"></span><span class="loginBar"></span><span>이메일로&nbsp;간편&nbsp;가입</span></button>
			</li>
		</ul>
		<div class="mm-login-message-box">
			<h1>Weclome to Mirros</h1>
		
			<p>
				Mirros에서 더 쉽고 간편하게<br/>
				인터넷 쇼핑몰들을 체험하세요.
			</p>
		</div>
		
		<div class="mm-login-error-box">
			<c:if test="${message ne null }">
				로그인에 실패하였습니다.<br/>
				<c:out value="${message }"/>
			</c:if>
	    </div>
</sec:authorize>
<sec:authorize access="hasRole('ROLE_USER')">
<script>
	location.href= mobileContextPath + '/';
</script>
</sec:authorize>

<%@ include file="../../layout/home-footer.jspf" %>