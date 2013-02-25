<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../layout/layout_header.jspf" %>
<div>
	<form:form commandName="jtownUser">
		<table>
			<tfoot>
				<input type="button" value="비밀번호 변경" class="jt-change-password-btn" />
			</tfoot>
			<tbody>
				<tr>
					<th>
						현재 비밀번호
					</th>
					<td>
						<form:password path="password"/>
						<form:errors path="password" cssClass="commonError" />
					</td>
				</tr>
				<tr>
					<th>
						새로운 비밀번호
					</th>
					<td>
						<form:password path="newPassword"/>
						<form:errors path="newPassword" cssClass="commonError"></form:errors>
					</td>
				</tr>
				<tr>
					<th>
						비밀번호 확인
					</th>
					<td>
						<input type="password" name="confirmPassword" />
					</td>
				</tr>
			</tbody>
		</table>
	</form:form>
</div>
<%@ include file="../../layout/layout_footer.jspf" %>