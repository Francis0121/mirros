<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/admin_header.jspf" %>
<c:set var="pagination" value="${partnershipFilter.pagination }"/>
<c:set var="processMap" value="${partnershipFilter.processMap }"/>
<c:set var="processList" value="${partnershipFilter.processList}"/>
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
	
	var form = document.forms['partnershipFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>

<c:url value="/admin/partnership" var="partnershipUrl"/>
<ul class="jt-partnership-filter">
	<form:form commandName="partnershipFilter" action="${partnershipUrl }" htmlEscape="true" method="get">
		<form:hidden path="page" value="${pagination.currentPage}"/>
		<li>
			<form:select path="categoryPn" onchange="document.forms['partnershipFilter'].submit();">
				<form:option value="">전체</form:option>
				<form:options items="${interestCategoryMap }"/>
			</form:select>
			<form:select path="process" onchange="document.forms['partnershipFilter'].submit();">
				<form:option value="">전체</form:option>
				<form:options items="${processMap }"/>
			</form:select>
		</li>
		<li>
			<form:label path="email">이메일</form:label><form:input path="email"/>	
			<form:label path="phoneNumber">핸드폰번호</form:label><form:input path="phoneNumber"/>	
			<input type="submit" value="전송"/>
		</li>
	</form:form>
</ul>

<table class="jt-partnership-table">
	<thead>
		<tr>
			<th>번호</th>
			<th>성명</th>
			<th>이메일&nbsp;주소</th>
			<th>전화번호</th>
			<th>사업아이템</th>
			<th>입력날짜</th>
			<th>처리상황</th>
		</tr>
	</thead>
	<tfoot>
		<tr>	
			<th colspan="7">
				<a href="javascript:void(goToPage(1))" onfocus="blur();">
						처음
<%-- 					<img src="<c:url value='/images/mims_pageFirst_btn.gif'/>" alt="처음" style="vertical-align: middle; border: none" /> --%>
				</a>
				<a href="javascript:void(goToPreviousPages())" onfocus="blur();">
						다음
<%-- 					<img src="<c:url value='/images/button/mims_prev_btn.gif'/>" alt="다음" style="vertical-align: middle; border: none" /> --%>
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
						다음
<%-- 					<img src="<c:url value='/images/button/mims_next_btn.gif'/>" alt="다음" style="vertical-align: middle; border: none" /> --%>
				</a>
				<a href="javascript:void(goToPage(${pagination.numPages}))" onfocus="blur();">
						끝
<%-- 					<img src="<c:url value='/images/mims_pageLast_btn.gif'/>" alt="끝" style="vertical-align: middle; border: none" /> --%>
				</a>
			</th>
		</tr>
	</tfoot>
	<tbody>
		<c:forEach items="${partnerships }" var="partnership" varStatus="loop">
			<tr class="jt-partnership-table-information" data-pspn="<c:out value="${partnership.pn }"/>">
				<td><c:out value="${partnership.pn }"/></td>
				<td><c:out value="${partnership.name }"/></td>
				<td><c:out value="${partnership.email }"/></td>
				<td><c:out value="${partnership.phoneNumber }"/></td>
				<td><c:out value="${interestCategoryMap[partnership.categoryPn] }"/></td>
				<td><c:out value="${partnership.inputDate }"/></td>
				<td>
					<select class="jt-partnership-process" data-pspn="<c:out value="${partnership.pn }"/>">
						<c:forEach items="${processList }" var="process">
							<c:choose>
								<c:when test="${process.key eq partnership.process}">
									<option value="<c:out value="${process.key }"/>" selected="selected"><c:out value="${process.value }"/></option>
								</c:when>							
								<c:otherwise>
									<option value="<c:out value="${process.key }"/>"><c:out value="${process.value }"/></option>
								</c:otherwise>
							</c:choose>
						</c:forEach> 
					</select>
				</td>
			</tr>
			<tr class="jt-partnership-table-content" id="partnership-content-<c:out value="${partnership.pn }"/>">
				<td colspan="7">
					<pre><c:out value="${partnership.content }"/></pre>
				</td>
			</tr>
		</c:forEach>
	</tbody>
</table>

<%@ include file="../../layout/admin_footer.jspf" %>