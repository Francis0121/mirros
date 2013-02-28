<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../../layout/layout_admin_header.jspf" %>
<div>
	<table class="jt-join-user-table">
		<tfoot>
			<tr>
				<td colspan="2"><input type="button" value="수정" id="jt-admin-noticeWrite-btn"/></td>
			</tr>
		</tfoot>
		<form:form commandName="board" action="/jtown/admin/noticeModify">
			<form:hidden path="pn"/>
			<tbody>
				<tr>
					<th>제목</th>
					<td><form:input path="title" /></td>
				</tr>
				<tr>
					<th>작성자</th>
					<td>관리자</td>
				</tr>
				<tr>
					<th>내용</th>
					<td><form:textarea path="content"/></td>
				</tr>
			</tbody>
		</form:form>
	</table>	
</div>
<%@ include file="../../../layout/layout_admin_footer.jspf" %>