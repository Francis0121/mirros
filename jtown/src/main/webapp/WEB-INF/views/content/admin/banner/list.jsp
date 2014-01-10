<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../../layout/admin_header.jspf" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="pagination" value="${bannerFilter.pagination }"/>
<div class="jt-admin-banner-list-wrap">
	<form:form commandName="bannerFilter" action="${cp }/admin/banner" method="get" htmlEscape="true">
		<form:hidden path="page" value="${pagination.currentPage}"/>	
		<div class="jt-admin-banner-title">메인 배너 관리</div>
		
		<div style="margin: 0 0 5px -2px;">
			<form:select path="deleted" onchange="document.forms['bannerFilter'].submit();">
				<form:option value="N">진행중</form:option>
				<form:option value="Y">삭제됨</form:option>
			</form:select>
		</div>
		
		<div style="overflow: hidden;">
			<div class="jt-admin-banner-list-name-title">배너 이름</div>
			<div class="jt-admin-banner-list-date-title">등록날짜</div>
		</div>
		
			<c:forEach items="${bannerList }" var="bannerList">
				<div class="jt-admin-banner-list-item-wrap" data-pn="${bannerList.pn }">
					<div class="jt-admin-banner-list-pn">${bannerList.pn}</div>
					<div class="jt-admin-banner-list-name">${bannerList.eventName }</div>
					<div class="jt-admin-banner-list-date"><fmt:formatDate value="${bannerList.inputDate }" pattern="yyyy-MM-dd HH:mm"/></div>
				</div>
			</c:forEach>
			<div class="jt-pagination jt-banner-pagination-wrap">
				<div id="page-wrap">
					<div class="jt-banner-pagination-item-wrap">
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
		</div>
	</form:form>
	<button type="button" class="jt-admin-banner-add-btn jt-admin-banner-btn" onclick="location.href='${cp}/admin/insertBanner'">
		<img alt="plus" src="/jtown/resources/images/jt-plus-btn.png" style="width:20px;margin: 0 5px -5px 0;">배너 추가
	</button>
</div>
 
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
	
	var form = document.forms['bannerFilter'];	
	form.submit();
}

function goToPreviousPages() {
	goToPage(Math.max(1, page - numPagesPerScreen));
}
/* ]]> */
</script>

<%@ include file="../../../layout/home_footer.jspf" %>
