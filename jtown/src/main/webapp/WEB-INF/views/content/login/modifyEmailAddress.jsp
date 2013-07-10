<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/none_header.jspf" %>
<section class="jt-account-setting-section">
	<header class="jt-account-setting-section-header">
		<h1>이메일&nbsp;변경</h1>
	</header>
	<form:form commandName="jtownUser" method="post" action="${cp }/login/modifyEmailAddress.jt" htmlEscape="true">
	<article class="jt-account-setting-article">
		<p class="jt-emailAddress-comment">본인확인을&nbsp;위해&nbsp;본&nbsp;계정의&nbsp;비밀번호를&nbsp;입력해&nbsp;주신&nbsp;후에&nbsp;변경하실&nbsp;이메일를&nbsp;입력해&nbsp;주세요.</p>
		<table class="jt-account-setting-article-table">
			<tfoot>
				<tr>
					<td colspan="2" style="text-align: center;">
						<button type="submit" class="jt-btn-orange jt-emailAddress-user-btn">변경</button>	
					</td>
				</tr>
			</tfoot>
			<tbody>
				<tr>
					<th>현재&nbsp;이메일&nbsp;주소</th>
					<td><sec:authentication property="principal.username" /></td>
				</tr>
				<tr>
					<th>새&nbsp;이메일&nbsp;주소</th>
					<td>
						<div class="jt-join-user-vaild-wrap" id="confirmEmail">
							<span class="jt-form-invalid">정확한&nbsp;이메일&nbsp;주소를&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.(ex&nbsp;abcde@abc.com)</span>
						</div>
						<form:input path="username" data-type="create" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
						<div class="jt-modify-content-error">	
							<form:errors path="username" cssClass="commonError"/>
						</div>
					</td>
				</tr>
				<tr>
					<th>비밀번호</th>
					<td>
						<form:password path="password" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
						<div class="jt-modify-content-error">	
							<form:errors path="password" cssClass="commonError"/>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</article>	
	</form:form>
</section>
<%@ include file="../../layout/none_footer.jspf" %>