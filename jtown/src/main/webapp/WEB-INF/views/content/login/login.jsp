<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/none_header.jspf" %>
<section id="jt-login-form-page">
	<sec:authorize access="anonymous">
		<form action="${cp }/j_spring_security_check" method="post" id="jt-page-login-form" onsubmit="onPageLoginSubmit(); return false;">
			<table class="jt-login-form-table-page">
				<thead>
					<tr>
						<th colspan="2"> 
							<span style="font-weight: normal;">LOG&nbsp;IN&nbsp;TO</span>&nbsp;Mirros
						</th>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<th>
							<input id="_spring_security_remember_me" name="_spring_security_remember_me" type="checkbox" value="true" checked="checked"/>	
							<label for="_spring_security_remember_me">자동 로그인</label>
						</th>
						<td><button type="submit" class="jt-btn-orange-login">Log&nbsp;In</button></td>
					</tr>
				</tfoot>
				<tbody>
					<tr>
						<td colspan="2">
							<input id="j_username_page" name="j_username" size="20" maxlength="50" type="text" class="jt-login-form-table-input" placeholder="Email Address"/>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<input id="j_password_page" name="j_password" size="20" maxlength="50" type="password" class="jt-login-form-table-password"  placeholder="Password"/><button type="button" onclick="location.href='${cp}/login/findPassword'" title="비밀번호를&nbsp;잊으셨나요?" class="jt-login-findPassword">?</button>
						</td>
					</tr>
				</tbody>
			</table>
			</form>
			<ul class="jt-login-sign-wrap" >
				<li>
					<!-- FACEBOOK login -->
					<form action="${cp }/signin/facebook" method="POST">
						<input type="hidden" name="scope" value="publish_stream,offline_access,email,user_birthday,user_likes" />
				    	<button class="jt-btn-fbLogin" type="submit"><span class="loginImage"></span><span class="loginText">페이스북으로&nbsp;로그인</span></button>
					</form>							
				</li>
				<li>
					<button class="jt-btn-orange jt-btn-emailLogin" onclick="location.href='${cp }/login/join'" type="button"><span class="loginImage"></span><span class="loginText">이메일로&nbsp;간편&nbsp;가입</span></button>
				</li>
			</ul>
			<div class="jt-login-message-box">
				<h1>Weclode to Mirros</h1>
			
				<p>
					Mirros에서 더 쉽고 간편하게<br/>
					당신을 위한 아이템을 모아보세요.
				</p>
			</div>
			<div class="jt-login-error-box">
				<c:if test="${message ne null }">
					로그인에 실패하였습니다.<br/>
					<c:out value="${message }"/>
				</c:if>
		    </div>	
	</sec:authorize>	
</section>
<sec:authorize access="hasRole('ROLE_USER')">
<script>
	location.href = contextPath;
</script>
</sec:authorize>
<%@ include file="../../layout/none_footer.jspf" %>