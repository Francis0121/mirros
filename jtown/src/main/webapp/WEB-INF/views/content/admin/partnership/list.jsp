<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../../layout/admin_header.jspf" %>
<c:set var="pagination" value="${partnershipFilter.pagination }"/>
<c:set var="processMap" value="${partnershipFilter.processMap }"/>
<c:set var="processList" value="${partnershipFilter.processList}"/>
<c:set var="depositMap" value="${partnershipFilter.depositMap }"/>
<c:set var="depositList" value="${partnershipFilter.depositList}"/>
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

<ul class="jt-admin-filter">
	<form:form commandName="partnershipFilter" action="${cp }/admin/partnership" htmlEscape="true" method="get">
		<form:hidden path="page" value="${pagination.currentPage}"/>
		<li>
			<sec:authorize ifAnyGranted="ROLE_ROOT,ROLE_SALES">
				<form:label path="adminPn">담당자</form:label>
				<form:select path="adminPn" onchange="document.forms['partnershipFilter'].submit();" cssClass="jt-admin-filter-select">
					<form:option value="">전체</form:option>
					<form:option value="0">담당자 미지정</form:option>
					<form:options items="${usersAdmin }" itemValue="pn" itemLabel="name"/>
				</form:select>
			</sec:authorize>
			<form:label path="process">처리상황</form:label>
			<form:select path="process" onchange="document.forms['partnershipFilter'].submit();" cssClass="jt-admin-filter-select">
				<form:option value="">전체</form:option>
				<form:options items="${processMap }"/>
			</form:select>
			<form:label path="deposit">입금현황</form:label>
			<form:select path="deposit" onchange="document.forms['partnershipFilter'].submit();" cssClass="jt-admin-filter-select">
				<form:option value="">전체</form:option>
				<form:options items="${depositMap }"/>
			</form:select>
			<form:label path="categoryPn">사업아이템</form:label>
			<form:select path="categoryPn" onchange="document.forms['partnershipFilter'].submit();" cssClass="jt-admin-filter-select">
				<form:option value="">전체</form:option>
				<form:options items="${interestCategories }" itemLabel="name" itemValue="categoryPn"/>
			</form:select>
		 	<form:label path="enabled">활성화</form:label>
			<form:select path="enabled" onchange="document.forms['partnershipFilter'].submit();" cssClass="jt-admin-filter-select">
				<form:option value="">전체</form:option>
				<form:option value="true">활성화</form:option>
				<form:option value="false">비활성화</form:option>
			</form:select>
		</li>
		<li>
			<form:label path="shopPn">ShopNo</form:label><form:input path="shopPn" cssClass="jt-admin-filter-input"/>
			<form:label path="sellerId">아이디</form:label><form:input path="sellerId" cssClass="jt-admin-filter-input"/>
			<form:label path="sellerName">회사명</form:label><form:input path="sellerName" cssClass="jt-admin-filter-input"/>
			<form:label path="email">이메일</form:label><form:input path="email" cssClass="jt-admin-filter-input"/>	
			<form:label path="phoneNumber">핸드폰번호</form:label><form:input path="phoneNumber" cssClass="jt-admin-filter-input"/>	
			<form:label path="shopUrl">홈페이지</form:label><form:input path="shopUrl" cssClass="jt-admin-filter-input"/>
			<button type="button" class="jt-btn-white-small" id="jt-search-partnership-btn">
				<span class="btnText">검색</span>
			</button>
		</li>
	</form:form>
</ul>

<sec:authorize access="principal.groupName eq 'Administrator'">
	<table class="jt-partnership-table jt-admin-base-table">
</sec:authorize>
<sec:authorize ifAnyGranted="ROLE_ROOT,ROLE_SALES">
	<table class="jt-partnership-root-table jt-admin-base-table">
</sec:authorize>
	<thead>
		<tr>
			<sec:authorize ifAnyGranted="ROLE_ROOT,ROLE_SALES">
			<th rowspan="2">담당자</th>
			</sec:authorize>
			<th colspan="7">문의사항정보</th>
			<th colspan="8">판매자정보</th>
			<th colspan="2">계약정보</th>
			<th rowspan="2">비고</th>
			<sec:authorize ifAnyGranted="ROLE_ROOT">
			<th rowspan="2">비밀번호</th>
			</sec:authorize>
		</tr>
		<tr>
			<th>접수번호</th>
			<th>문의날짜</th>
			<th>성명</th>
			<th>이메일&nbsp;주소</th>
			<th>전화번호</th>
			<th>사업아이템</th>
			<th>처리상황</th>
			<th>입금현황</th>
			<th>기본입력현황</th>
			<th>아이디정보</th>
			<th>ShopNo</th>
			<th>홈페이지</th>
			<th>회사명</th>
			<th>Tag</th>
			<th>활성화</th>
			<th>기간</th>
			<th>조회</th>
		</tr>
	</thead>
	<tfoot class="jt-pagination">
		<tr>
			<sec:authorize access="principal.groupName eq 'Administrator'">
				<td colspan="18">
			</sec:authorize>
			<sec:authorize ifAnyGranted="ROLE_SALES">
				<td colspan="19">
			</sec:authorize>
			<sec:authorize ifAnyGranted="ROLE_ROOT">
				<td colspan="20">
			</sec:authorize>
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
		<c:forEach items="${partnerships }" var="partnership" varStatus="loop">
			<c:set var="userInfo" value="${partnership.jtownUser }"/>
			<tr class="jt-partnership-info" data-pspn="<c:out value="${partnership.pn }"/>" data-spn="<c:out value="${userInfo.pn}"/>">
				<sec:authorize ifAnyGranted="ROLE_ROOT,ROLE_SALES">
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
				</sec:authorize>
				<td class="jt-partnership-table-information"><c:out value="${partnership.pn }"/></td>
				<td class="jt-partnership-insert-date"><c:out value="${fn:substring(partnership.inputDate , 0, 10) }"/></td>
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
				<td class="jt-partnership-deposit">
					<select class="jt-partnership-deposit-select">
						<c:forEach items="${depositList }" var="deposit">
							<c:choose>
								<c:when test="${deposit.key eq partnership.deposit}">
									<option value="<c:out value="${deposit.key }"/>" selected="selected"><c:out value="${deposit.value }"/></option>
								</c:when>							
								<c:otherwise>
									<option value="<c:out value="${deposit.key }"/>"><c:out value="${deposit.value }"/></option>
								</c:otherwise>
							</c:choose>
						</c:forEach> 
					</select>
				</td>
				<td class="jt-partnership-baseInputStatus">
					<c:choose>
						<c:when test="${baseStatusMap[userInfo.pn] }">
							<span style="color: #003cff;">완료</span>
						</c:when>
						<c:otherwise>
							<span style="color: #ff4621;">미완료</span>
						</c:otherwise>
					</c:choose>
				</td>
				<c:choose>
					<c:when test="${userInfo.username ne null and userInfo.username ne ''}">
						<td class="jt-partnership-username"><a href="${cp }/seller/${userInfo.pn }"><c:out value="${userInfo.username  }"/></a></td>
						<td class="jt-partnership-shopPn"><c:out value="${userInfo.sixShopPn }"/></td>
						<td class="jt-partnership-shopUrl"><c:out value="${userInfo.shopUrl }"/></td>
						<td class="jt-partnership-sellerName"><c:out value="${userInfo.name }"/></td>
						<td class="jt-partnership-interest"><c:out value="${interestMap[userInfo.pn].interestSectionList }"/></td>
						<td class="jt-partnership-enabled">
							<select class="jt-partnership-enabled-select">
								<option value="1" ${userInfo.enabled eq true ? 'selected=selected' : ''}>활성화</option>
								<option value="0" ${userInfo.enabled eq false ? 'selected=selected' : ''}>비활성화</option>					
							</select>
						</td>
						<td class="jt-partnership-contract-date">
							<c:if test="${userInfo.contractEndDate ne null }">
								<span style="color: #003cff;">게시중</span>
							</c:if>
							<c:if test="${userInfo.contractEndDate eq null and userInfo.beginStartDate eq null}">
								<span style="color: #ff4621;">게시완료</span>
							</c:if>
							<c:if test="${userInfo.contractEndDate eq null and  userInfo.beginStartDate ne null}">
								<span style="color: #ff8b1a;">예정일</span>
							</c:if>
							<span style="color: #3b3b3b;"><c:out value="${userInfo.beginStartDate}"/></span>
						</td>
						<td class="jt-partnership-contract-register">
							<button type="button" class="jt-admin-contract jt-btn-white-small">
								<span class="btnText">조회</span>
							</button>
						</td>					
					</c:when>
					<c:otherwise>
						<td class="jt-seller-create">
							<button type="button" class="jt-seller-create-btn jt-btn-white-small"
									data-shopUrl="<c:out value="${userInfo.shopUrl }"/>"
									data-name="<c:out value="${userInfo.name }"/>">
								<span class="btnImage"></span>
								<span class="btnText">아이디 생성</span>
							</button>
						</td>
						<td class="jt-seller-shopPn">&nbsp;</td>
						<td class="jt-seller-shopUrl"><c:out value="${userInfo.shopUrl }"/></td>
						<td class="jt-seller-name"><c:out value="${userInfo.name }"/></td>
						<td class="jt-seller-interest">&nbsp;</td>
						<td class="jt-seller-enabled">
							<select class="jt-partnership-enabled-select" style="display: none;">
								<option value="1" ${userInfo.enabled eq true ? 'selected=selected' : ''}>활성화</option>
								<option value="0" ${userInfo.enabled eq false ? 'selected=selected' : ''}>비활성화</option>					
							</select>
						</td> 	
						<td class="jt-seller-date"></td>
						<td class="jt-seller-register"></td>	
					</c:otherwise>
				</c:choose>
				<td class="jt-partnership-note"><pre><c:out value="${partnership.note }"/></pre></td>
				<sec:authorize ifAnyGranted="ROLE_ROOT">
					<td>
						<c:if test="${!empty userInfo.username }">
							<button type="button" class="jt-seller-reset-password jt-btn-white-small" data-sellername="${userInfo.username }">
								<span class="btnImage"></span>
								<span class="btnText">초기화</span>
							</button>
						</c:if>
					</td>
				</sec:authorize>
			</tr>
			<tr class="jt-partnership-table-content" id="partnership-content-<c:out value="${partnership.pn }"/>">
				<sec:authorize access="principal.groupName eq 'Administrator'">
					<td colspan="18">
				</sec:authorize>
				<sec:authorize ifAnyGranted="ROLE_SALES">
					<td colspan="19">
				</sec:authorize>
				<sec:authorize ifAnyGranted="ROLE_ROOT">
					<td colspan="20">
				</sec:authorize>
					<pre><c:out value="${partnership.content }"/></pre>
				</td>
			</tr>
		</c:forEach>
	</tbody>
</table>
<%@ include file="../../../layout/admin_footer.jspf" %>