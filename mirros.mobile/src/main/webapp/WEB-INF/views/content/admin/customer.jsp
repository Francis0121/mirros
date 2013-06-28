<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/admin_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<c:set var="pagination" value="${userFilter.pagination }"/>
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
	
	var form = document.forms['userFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>

<ul class="jt-admin-filter">
<form:form commandName="userFilter" action="${cp }/admin/customer" method="get" htmlEscape="true">
	<form:hidden path="page" value="${pagination.currentPage}"/>
	<li>
		<form:label path="enabled">불량사용자</form:label>
		<form:select path="enabled" cssClass="jt-admin-filter-select" htmlEscape="true" onchange="document.forms['userFilter'].submit();">
			<form:option value="">전체</form:option>
			<form:option value="true">정상사용자</form:option>
			<form:option value="false">불량사용자</form:option>
		</form:select>
	</li>
	<li>
		<form:label path="name">이름</form:label>
		<form:input path="name" cssClass="jt-admin-filter-input "/>
		<form:label path="userId">아이디</form:label>
		<form:input path="userId" cssClass="jt-admin-filter-input "/>
		<button type="submit" class="jt-btn-white-small">
			<span class="btnText">검색</span>
		</button>
	</li>
</form:form>
</ul>

<table class="jt-admin-base-table jt-manage-table">
	<thead>
		<tr>
			<th>번호</th>
			<th>아이디</th>
			<th>이름</th>
			<th>불량사용자 여부</th>
			<th>가입날짜</th>
			<th>관심사</th>
		</tr>
	</thead>
	<tfoot class="jt-pagination">
		<tr>
			<td colspan="6">
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
		<c:forEach items="${customerList }" var="customer" varStatus="i">
			<c:set var="customerPn" value="${customer.pn }" />
			<tr class="jt-admin-customer-table-tr" data-cpn="${customerPn}">
				<td><c:out value="${pagination.numItems - (pagination.currentPage - 1)* 10-i.count+1}"/></td>
				<td class="jt-admin-customer-table-customerId"><c:out value="${customer.username }"/></td>
				<td><c:out value="${customer.name }"/></td>
				<td>
					<select class="jt-admin-customer-enable">
						<option value="1" ${customer.enabled eq true ? 'selected=selected' : ''}>정상 사용자</option>
						<option value="0" ${customer.enabled eq false ? 'selected=selected' : ''}>불량 사용자</option>					
					</select>
				</td>
				<td><c:out value="${customer.salt }"/></td>
				<td><c:out value="${interestMap[customerPn].interestSectionList }"/></td>
			</tr>
		</c:forEach>
	</tbody>
</table>
<%@ include file="../../layout/admin_footer.jspf" %>