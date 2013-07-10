<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../../layout/admin_header.jspf" %>
<form:form commandName="jtownUser" action="${cp }/admin//createAdministrator.jt" htmlEscape="true" method="post">
	<table class="jt-admin-base-table jt-administrator-create-table">
		<tfoot>
			<tr>
				<td colspan="2" style="text-align: right;">
					<button type="submit" class="jt-btn-white-small jt-make-administrator-btn">
						<span class="btnImage"></span>
						<span class="btnText">생성</span>
					</button>
				</td>
			</tr>
		</tfoot>
		<tbody>
			<tr>
				<th>ID</th>
				<td>
					<form:input path="username" cssClass="jt-admin-input" cssErrorClass="jt-admin-input-error" />
					<div class="jt-admin-error">
						<form:errors path="username" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>Name</th>
				<td>
					<form:input path="name" cssClass="jt-admin-input" cssErrorClass="jt-admin-input-error" />
					<div class="jt-admin-error">
						<form:errors path="name" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>Email</th>
				<td>
					<form:input path="email" cssClass="jt-admin-input" cssErrorClass="jt-admin-input-error" />
					<div class="jt-admin-error">
						<form:errors path="email" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>Password</th>
				<td>
					<form:password path="password" cssClass="jt-admin-input" cssErrorClass="jt-admin-input-error" />
					<div class="jt-admin-error">
						<form:errors path="password" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>Confirm Password</th>
				<td><input type="password" id="confirmPassword" name="confirmPassword" class="jt-admin-input"/></td>
			</tr>
		</tbody>
	</table>
	
</form:form>
<%@ include file="../../../layout/admin_footer.jspf" %>