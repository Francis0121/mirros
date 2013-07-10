<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../../layout/admin_header.jspf" %>
<%-- Page 처리 Script --%>
<c:set var="pagination" value="${administratorFilter.pagination }"/>
<script type="text/javascript">
/* <![CDATA[ */
var numPagesPerScreen = <c:out value='${pagination.numPagesPerScreen}'/>;
var page = <c:out value='${pagination.currentPage}'/>;
var numPages = <c:out value='${pagination.numPages}'/>;

function goToNextPages() {
	goToPage(Math.min(numPages, page + numPagesPerScreen));
}

function goToPage(page) {
	var input = document.getElementById('page');
	input.value = page;
	
	var form = document.forms['administratorFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>

<a href="${cp}/admin/createAdministrator" class="jt-btn-white-small jt-make-administrator-btn">
	<span class="btnImage"></span>
	<span class="btnText">관리자 생성</span>
</a>

<table class="jt-admin-base-table jt-administrator-table">
	<thead>
		<tr>
			<th>아이디</th>
			<th>이름</th>
			<th>등록날짜</th>
			<th>비밀번호</th>
		</tr>
	</thead>
	<tfoot class="jt-pagination">
		<tr>	
			<td colspan="4">
				<div id="page-wrap">
					<div style="float: left;">
						<a href="javascript:void(goToPage(1))" onfocus="blur();">
							<img src="${cp }/resources/images/arrow/pageFirst_btn.png" alt="처음" title="First" style="vertical-align: middle; border: none;" />
						</a>
						<a href="javascript:void(goToPreviousPages())" onfocus="blur();" class="page-beforeafter">
							<img src="${cp }/resources/images/arrow/prev_btn.png" alt="이전" title="Before" style="vertical-align: middle; border: none;  margin-top: -2px;" />&nbsp;&nbsp;<span>PREV</span>
						</a>
						<c:forEach var="i" begin="${pagination.pageBegin}" end="${pagination.pageEnd}">
							<c:if test="${i == pagination.currentPage}">
								<a class="page-link page-now">${i}</a>
							</c:if>
							<c:if test="${i != pagination.currentPage}">
								<a class="page-link" href="javascript:void(goToPage(${i}))" onfocus="blur();">${i}</a>
							</c:if>
						</c:forEach>
						<a href="javascript:void(goToNextPages())" onfocus="blur();" class="page-beforeafter">
							<span>NEXT</span>&nbsp;&nbsp;<img src="${cp }/resources/images/arrow/next_btn.png" alt="다음" title="After" style="vertical-align: middle; border: none; margin-top: -2px;" />
						</a>
						<a href="javascript:void(goToPage(${pagination.numPages}))" onfocus="blur();">
							<img src="${cp }/resources/images/arrow/pageLast_btn.png" alt="끝" title="Last" style="vertical-align: middle; border: none; " />
						</a>
					</div>
				</div>
			</td>
		</tr>
	</tfoot>
	<tbody>
		<c:forEach items="${adminList }" var="admin" varStatus="loop">
			<tr>
				<td><c:out value="${admin.username }"/></td>
				<td><c:out value="${admin.name }"/></td>
				<td><c:out value="${admin.salt }"/></td>
				<td>
					<button type="button" class="jt-reset-password jt-btn-white-small" data-username="${admin.username }">
						<span class="btnImage"></span>
						<span class="btnText">초기화</span>
					</button>
				</td>
			</tr>
		</c:forEach>
	</tbody>
</table>

<form:form commandName="administratorFilter" action="${cp }/admin/administrator" htmlEscape="true" method="get">
	<form:hidden path="page" value="${pagination.currentPage}"/>
</form:form>

<%@ include file="../../../layout/admin_footer.jspf" %>
