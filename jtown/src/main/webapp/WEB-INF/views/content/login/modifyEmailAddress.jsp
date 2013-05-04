<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../layout/none_header.jspf" %>
<section class="jt-modify-content-wrap">
	<section class="jt-modify-content">
		<hgroup>
			<h2>이메일&nbsp;변경</h1>
			<h1>본인확인을&nbsp;위해&nbsp;본&nbsp;계정의&nbsp;비밀번호를&nbsp;입력해&nbsp;주신&nbsp;후에&nbsp;변경하실&nbsp;비밀번호를&nbsp;입력해&nbsp;주세요.</h1>
		</hgroup>
		<c:url value="/login/modifyEmailAddress.jt" var="modifyEmailAddressUrl"/>
		<form:form commandName="jtownUser" method="post" action="${modifyEmailAddressUrl }" htmlEscape="true">
			<table class="jt-modify-content-table">
				<tfoot>
					<tr>
						<td colspan="2">
							<input type="submit" value="변경" class="jt-btn-orange" />	
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
							<form:input path="username" data-form="modifyAddress" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
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
		</form:form>
	</section>
</section>
<%@ include file="../../layout/none_footer.jspf" %>