<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../../layout/admin_header.jspf" %>
<div style="width: 1700px; overflow-x : scroll;">
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
			<form:label path="categoryPn">사업아이템</form:label>
			<form:select path="categoryPn" onchange="document.forms['partnershipFilter'].submit();">
				<form:option value="">전체</form:option>
				<form:options items="${interestCategoryMap }"/>
			</form:select>
			<form:label path="process">처리상황</form:label>
			<form:select path="process" onchange="document.forms['partnershipFilter'].submit();">
				<form:option value="">전체</form:option>
				<form:options items="${processMap }"/>
			</form:select>
			불량사용자
			<form:select path="enabled">
				<form:option value="">전체</form:option>
				<form:option value="true">정상사용자</form:option>
				<form:option value="false">불량사용자</form:option>
			</form:select>
			담당자
			<form:select path="adminPn">
				<form:option value="">전체</form:option>
				<form:options items="${usersAdmin }" itemValue="pn" itemLabel="name"/>
			</form:select>
		</li>
		<li>
			<form:label path="email">이메일</form:label><form:input path="email"/>	
			<form:label path="phoneNumber">핸드폰번호</form:label><form:input path="phoneNumber"/>	
			<form:label path="sellerId">판매자아이디</form:label><form:input path="sellerId"/>
			<form:label path="shopUrl">판매자홈페이지</form:label><form:input path="shopUrl"/>
			<form:label path="sellerName">회사명</form:label><form:input path="sellerName"/>
			<input type="submit" value="전송"/>
		</li>
	</form:form>
</ul>

<table class="jt-partnership-table">
	<thead>
		<tr>
			<th>번호</th>
			<th>페이지탐색</th>
			<th>성명</th>
			<th>이메일&nbsp;주소</th>
			<th>전화번호</th>
			<th>사업아이템</th>
			<th>담당자</th>
			<th>처리상황</th>
			<th>문의날짜</th>
			<th>수정날짜</th>
			<th>아이디정보</th>
			<th>홈페이지</th>
			<th>회사명</th>
			<th>관심사</th>
			<th>불량사용자</th>
			<th>계약기간</th>
			<th>계약</th>
			<th>비고</th>
		</tr>
	</thead>
	<tfoot>
		<tr>	
			<th colspan="17">
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
			<c:set var="userInfo" value="${partnership.jtownUser }"/>
			<tr class="jt-partnership-info" data-pspn="<c:out value="${partnership.pn }"/>" data-spn="<c:out value="${userInfo.pn}"/>">
				<td class="jt-partnership-table-information"><c:out value="${partnership.pn }"/></td>
				<td><a href="<c:url value="/seller/${userInfo.pn }"/>">바로가기</a></td>
				<td class="jt-partnership-name"><c:out value="${partnership.name }"/></td>
				<td class="jt-partnership-email"><c:out value="${partnership.email }"/></td>
				<td class="jt-partnership-phoneNumber"><c:out value="${partnership.phoneNumber }"/></td>
				<td class="jt-partnership-category">
					<select class="jt-partnership-category-select">
						<c:forEach items="${interestCategories }" var="interestCategory">
							<c:choose>
								<c:when test="${partnership.categoryPn eq interestCategory.categoryPn}">
									<option value="${interestCategory.categoryPn }" selected="selected"><c:out value="${interestCategory.name }"/></option>
								</c:when>							
								<c:otherwise>
									<option value="${interestCategory.categoryPn }"><c:out value="${interestCategory.name }"/></option>
								</c:otherwise>
							</c:choose>
						</c:forEach>
					</select>
				</td>
				<td class="jt-partnership-adminPn">
					<select class="jt-partnership-adminPn-select">
						<option value="">선택</option>
						<c:forEach items="${usersAdmin }" var="adminUser">
							<c:choose>
								<c:when test="${adminUser.pn eq partnership.adminUser.pn}">
									<option value="${adminUser.pn }" selected="selected"><c:out value="${adminUser.name }"/></option>
								</c:when>							
								<c:otherwise>
									<option value="${adminUser.pn }"><c:out value="${adminUser.name }"/></option>
								</c:otherwise>
							</c:choose>
						</c:forEach>
					</select>
				</td>
				<td class="jt-partnership-process">
					<select class="jt-partnership-process-select">
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
				<td><c:out value="${partnership.inputDate }"/></td>
				<td><c:out value="${partnership.updateDate }"/></td>
				<c:choose>
					<c:when test="${userInfo.username ne null and userInfo.username ne ''}">
						<td><c:out value="${userInfo.username  }"/></td>
						<td class="jt-partnership-shopUrl"><c:out value="${userInfo.shopUrl }"/></td>
						<td class="jt-partnership-sellerName"><c:out value="${userInfo.name }"/></td>
						<td class="jt-partnership-interest"><c:out value="${interestMap[userInfo.pn].interestSectionList }"/></td>
						<td class="jt-partnership-enabled">
							<select class="jt-partnership-enabled-select">
								<option value="1" ${userInfo.enabled eq true ? 'selected=selected' : ''}>정상 사용자</option>
								<option value="0" ${userInfo.enabled eq false ? 'selected=selected' : ''}>불량 사용자</option>					
							</select>
						</td>
						<td>
							계약&nbsp;횟수&nbsp;:&nbsp;<span id="contract-count-${userInfo.pn }"><c:out value="${userInfo.contractCount eq null ? 0 : userInfo.contractCount}"/></span><button type="button" class="jt-admin-contract-list">조회</button><br/>
							계약&nbsp;만료&nbsp;:&nbsp;<span id="contract-end-date-${userInfo.pn }"><c:out value="${userInfo.contractEndDate}"/></span>
						</td>
						<td><button type="button" class="jt-admin-contract">계약</button></td>					
					</c:when>
					<c:otherwise>
						<td class="jt-seller-create"><button type="button" class="jt-seller-create-btn">아이디생성</button></td>
						<td class="jt-seller-shopUrl">&nbsp;</td>
						<td class="jt-seller-name">&nbsp;</td>
						<td class="jt-seller-interest">&nbsp;</td>
						<td class="jt-seller-enabled">
							<select class="jt-partnership-enabled-select" style="display: none;">
								<option value="1" ${userInfo.enabled eq true ? 'selected=selected' : ''}>정상 사용자</option>
								<option value="0" ${userInfo.enabled eq false ? 'selected=selected' : ''}>불량 사용자</option>					
							</select>
						</td> 	
						<td></td>
						<td></td>	
					</c:otherwise>
				</c:choose>
				<td class="jt-partnership-note"><pre><c:out value="${partnership.note }"/></pre></td>
			</tr>
			<tr class="jt-partnership-table-content" id="partnership-content-<c:out value="${partnership.pn }"/>">
				<td colspan="17">
					<pre><c:out value="${partnership.content }"/></pre>
				</td>
			</tr>
		</c:forEach>
	</tbody>
</table>
</div>
<%@ include file="../../../layout/admin_footer.jspf" %>