<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../../layout/admin_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<form:form commandName="board" action="${cp}/admin/noticeWrite" method="put" htmlEscape="true">
<table class="boardWrite-table">
	<tfoot>
		<tr>
			<c:choose>
				<c:when test="${board.pn ne null and board.pn ne 0 }">
					<form:hidden path="pn"/>
					<td colspan="2">
						<a href="#none" class="jt-btn-white-small jt-admin-notice-tool-write" id="jt-admin-noticeUpdate-btn">
							<span class="btnImage"></span>
							<span class="btnText">수정</span>
						</a>
					</td>
				</c:when>
				<c:otherwise>				
					<td colspan="2">
						<a href="#none" class="jt-btn-white-small jt-admin-notice-tool-write" id="jt-admin-noticeWrite-btn">
							<span class="btnImage"></span>
							<span class="btnText">작성</span>
						</a>
					</td>
				</c:otherwise>
			</c:choose>
		</tr>
	</tfoot>
	<thead>
		<tr>
			<th><div>제목</div></th>
			<td><form:input path="title" htmlEscape="true" cssClass="write-board-title" placeholder="제목을 입력해주세요." cssErrorClass="write-board-title-error"/></td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td colspan="2"><textarea id="content" name="content"><c:out value="${board.content }"/></textarea><form:errors path="content"/></td>
		</tr>
	</tbody>
</table>
</form:form>
<%@ include file="../../../layout/admin_footer.jspf" %>