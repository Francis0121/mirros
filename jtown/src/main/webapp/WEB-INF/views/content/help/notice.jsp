<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/help_header.jspf" %>
<c:set var="pagination" value="${boardFilter.pagination }"/>
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
	
	var form = document.forms['boardFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>
<section class="jt-help-notice-wrap">

<c:url value="/help/notice" var="noticeUrl"/>
<form:form commandName="boardFilter" action="${noticeUrl }" method="get">
	<form:hidden path="page" value="${pagination.currentPage}"/>
</form:form>
<table class="jt-help-notice-table">
	<thead>
		<tr>
			<th><div>번호</div></th>
			<th><div>제목</div></th>
			<th><div>날짜</div></th>
			<th><div>조회</div></th>				
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td colspan="4">
				<a href="javascript:void(goToPage(1))" onfocus="blur();">
<!-- 						처음 -->
					<img src="<c:url value='/resources/images/arrow/pageFirst_btn.png'/>" alt="처음" style="vertical-align: middle; border: none" />
				</a>
				<a href="javascript:void(goToPreviousPages())" onfocus="blur();">
<!-- 						다음 -->
					<img src="<c:url value='/resources/images/arrow/prev_btn.png'/>" alt="다음" style="vertical-align: middle; border: none" />
				</a>
				<c:forEach var="i" begin="${pagination.pageBegin}" end="${pagination.pageEnd}">
					<c:if test="${i == pagination.currentPage}">
						<strong>${i}</strong>
					</c:if>
					<c:if test="${i != pagination.currentPage}">
						<a class="pageLink" href="javascript:void(goToPage(${i}))" onfocus="blur();">${i}</a>
					</c:if>
				</c:forEach>
				<a href="javascript:void(goToNextPages())" onfocus="blur();">
<!-- 						다음 -->
					<img src="<c:url value='/resources/images/arrow/next_btn.png'/>" alt="다음" style="vertical-align: middle; border: none" />
				</a>
				<a href="javascript:void(goToPage(${pagination.numPages}))" onfocus="blur();">
<!-- 						끝 -->
					<img src="<c:url value='/resources/images/arrow/pageLast_btn.png'/>" alt="끝" style="vertical-align: middle; border: none" />
				</a>			
			</td>
		</tr>
	</tfoot>
	<tbody>
		<c:forEach items="${noticeList }" var="notice" varStatus="i">
			<tr class="jt-help-notice-content-tr">
				<td><c:out value="${pagination.numItems - (pagination.currentPage - 1)* 10-i.count+1}"/></td>
				<c:url value="/help/notice/content?pn=${notice.pn }&amp;page=${pagination.currentPage}" var="noticeUrl"/>
				<td><a href="${noticeUrl }" class="jt-help-notice-content-title-a"><c:out value="${notice.title }"/></a></td>
				<td><c:out value="${fn:substring(notice.inputDate, 0, 19) }"/></td>
				<td><c:out value="${notice.readCount eq null ? 0 : notice.readCount}"/></td>
			</tr>
		</c:forEach>
	</tbody>
</table>

</section>
<%@ include file="../../layout/help_footer.jspf" %>