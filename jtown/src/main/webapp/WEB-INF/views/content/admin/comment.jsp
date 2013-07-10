<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/admin_header.jspf" %>
<c:set var="pagination" value="${adminCommentFilter.pagination }"/>
<%-- Page 처리 Script --%>
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
	
	var form = document.forms['adminCommentFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>

<form:form commandName="adminCommentFilter" action="${cp }/admin/comment" method="get">
	<form:hidden path="page" value="${pagination.currentPage}"/>
</form:form>


<table class="jt-admin-base-table jt-admin-comment-table">
	<thead>
		<tr>
			<th>순번</th>
			<th>고객고유번호</th>
			<th>아이디</th>
			<th>내용</th>
			<th>입력날짜</th>
			<th>숨기기</th>
			<th>아이디정지</th>
		</tr>
	</thead>
	<tfoot class="jt-pagination">
		<tr>
			<td colspan="7">
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
		<c:forEach items="${comments }" var="comment" varStatus="i">
			<tr data-copn="<c:out value="${comment.commentPn }"/>" data-spn="<c:out value="${comment.sellerPn }"/>">
				<td><c:out value="${pagination.numItems - (pagination.currentPage - 1)* 10-i.count+1}"/></td>
				<td><c:out value="${comment.customerPn }"/></td>
				<td><c:out value="${comment.customerName }"/></td>
				<td><c:out value="${comment.comment }"/></td>
				<td><c:out value="${comment.inputDate }"/></td>
				<td></td>
				<td></td>
			</tr>
		</c:forEach>
	</tbody>
</table>

<%@ include file="../../layout/admin_footer.jspf" %>