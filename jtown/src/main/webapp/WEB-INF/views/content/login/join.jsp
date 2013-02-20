<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/layout_header.jspf" %>
<div class="createUserWrap">
	<div class="createUserInformation">
		<h2>회원정보입력</h2>
		<span>회원정보는 개인정보취급방침에 따라 안전하게 보호되며<br>회원님의 명백한 동의 없이 공개 또는 제3자에게 제공되지 않습니다.</span>
	</div>
	<form:form commandName="jtownUser" action="joinSubmit" htmlEscape="true" method="post">
	<table class="createUserTable">
	<tfoot>
		<tr>
			<td colspan="2">
				<input type="button" value="<spring:message code='join.common.createBtn'/>" class="joinBtn" />
			</td>
		</tr>
	</tfoot>
	<tbody>
		<tr>
			<th>
				<form:label path="username" ><spring:message code="join.common.username"/></form:label>
			</th>
			<td>
				<form:input path="username" htmlEscape="true" data-type="create"/>
				<span class="invalid" id="confirmEmail" style="display: none;"><spring:message code="join.common.confirmEmail"/></span>
				<form:errors path="username" cssClass="commonError"></form:errors>
			</td>
		</tr>
		<tr>
			<th>
				<form:label path="password" ><spring:message code="join.common.password"/></form:label>
			</th>
			<td>
				<form:password path="password" />
				<span class="invalid" id="passwordLength"><spring:message code="join.common.password.require.length"/></span>
				<form:errors path="password" cssClass="commonError"></form:errors>
			</td>
		</tr>
		<tr>
			<th>
				<label for="confirmPassword"><spring:message code="join.common.confirmPassword"/></label>
			</th>
			<td>
				<input type="password" id="confirmPassword" name="confirmPassword" />
				<span id="confirmPW" class="invalid"><spring:message code="join.common.confirmPassword"/></span>
			</td>
		</tr>
		<tr>
			<th>
				<form:label path="name"><spring:message code="join.common.nickName"/></form:label>
			</th>
			<td>
				<form:input path="name"/>
				<span class="invalid" id="nameLength"><spring:message code="join.nickName.notAllow" /></span>
				<form:errors path="name" cssClass="commonError"></form:errors>
			</td>
		</tr>
	</tbody>
	</table>
	</form:form>
</div>
<%@ include file="../../layout/layout_footer.jspf" %>