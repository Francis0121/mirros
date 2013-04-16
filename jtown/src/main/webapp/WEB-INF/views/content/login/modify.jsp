<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../layout/none_header.jspf" %>
<section class="jt-modify-content-wrap">
	<div id="folderBar">
		<div id="folderTabName">
			<span id="digonalFolderImage">My Page</span>
		</div>
	</div>
	<section class="jt-modify-content">
		<hgroup>
			<h2>비밀번호&nbsp;변경</h1>
			<h1>본인확인을&nbsp;위해&nbsp;본&nbsp;계정의&nbsp;비밀번호를&nbsp;입력해&nbsp;주신&nbsp;후에&nbsp;변경하실&nbsp;비밀번호를&nbsp;입력해&nbsp;주세요.</h1>
		</hgroup>
		<c:url value="/login/modify.jt" var="modifyUrl"/>
		<form:form commandName="jtownUser" method="post" action="${modifyUrl }" htmlEscape="true">
			<table class="jt-modify-content-table">
				<tfoot>
					<tr>
						<td colspan="2">
							<input type="button" value="완료" class="jt-change-password-btn jt-btn-orange" />	
						</td>
					</tr>
				</tfoot>
				<tbody>
					<tr>
						<th>현재&nbsp;비밀번호</th>
						<td>
							<form:password path="password" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
							<div class="jt-modify-content-error">	
								<form:errors path="password" cssClass="commonError"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>새&nbsp;비밀번호</th>
						<td>
							<div class="jt-join-user-vaild-wrap" id="passwordLength">
								<span class="jt-form-invalid">비밀번호는&nbsp;8자&nbsp;이상&nbsp;16자&nbsp;이하&nbsp;이어야&nbsp;합니다.</span>
							</div>
							<form:password path="newPassword" data-form="modify" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
							<div class="jt-modify-content-error">
								<form:errors path="newPassword" cssClass="commonError"></form:errors>
							</div>
						</td>
					</tr>
					<tr>
						<th>새&nbsp;비밀번호&nbsp;재입력</th>
						<td>
							<div class="jt-join-user-vaild-wrap" id="confirmPW">
								<span class="jt-form-invalid" id="confirmPW">비밀번호를&nbsp;동일하게&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.</span>
							</div>
							<input type="password" name="confirmPassword" class="jt-modify-content-input"/>
						</td>
					</tr>
				</tbody>
			</table>
		</form:form>
	</section>
</section>
<%@ include file="../../layout/none_footer.jspf" %>