<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../../layout/admin_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<c:set var="pagination" value="${questionFilter.pagination }"/>
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
	
	var form = document.forms['questionFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>


<ul class="jt-admin-filter">
<form:form commandName="questionFilter" action="${cp }/admin/questions" method="get" htmlEscape="true">
	<form:hidden path="page" value="${pagination.currentPage}"/>
		<li>
			<form:label path="categoryPn">고객유형</form:label>
			<form:select path="categoryPn" onchange="document.forms['questionFilter'].sectionPn.value=''; document.forms['questionFilter'].submit();" cssClass="jt-admin-filter-select">
				<form:option value="">전체</form:option>
				<form:options items="${questionCategories }" itemValue="pn" itemLabel="name"/>
			</form:select>
			<form:label path="sectionPn">문의유형</form:label>
			<form:select path="sectionPn" onchange="document.forms['questionFilter'].submit();" cssClass="jt-admin-filter-select">
				<form:option value="">전체</form:option>
				<form:options items="${questionSections }" itemValue="pn" itemLabel="name"/>
			</form:select>
		</li>
</form:form>
</ul>

<table class="jt-admin-base-table jt-admin-question-table">
	<thead>
		<tr>
			<th colspan="2">제목</th>
			<th>등록날짜</th>
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
		<c:forEach items="${questions }" var="question" varStatus="loop">
			<c:set var="section" value="${question.questionSection }"/>
			<c:set var="category" value="${section.questionCategory }"/>
			<tr>
				<td><c:out value="${question.pn }"/></td>
				<td>
					<a href="${cp }/admin/question?qpn=<c:out value="${question.pn }"/>">[<c:out value="${category.name }"/>-<c:out value="${section.name }"/>] <c:out value="${question.title }"/></a>
				</td>
				<td><c:out value="${fn:substring(question.inputDate , 0, 10) }"/></td>
			</tr>
		</c:forEach>
	</tbody>
</table>

<%@ include file="../../../layout/admin_footer.jspf" %>