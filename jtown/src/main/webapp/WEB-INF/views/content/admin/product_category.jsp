<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/admin_header.jspf" %>

<div class="jt-admin-category">
	<div style="overflow: hidden;">
		<div class="jt-admin-category-wrap">
			<div class="jt-admin-category-wrap-title">대분류</div>
			<ul class="jt-admin-category-wrap-ul jt-admin-category-sections-wrap-ul">
			<c:forEach items="${sectionsList }" var="sectionsList">
				<li data-sections-pn="${sectionsList.sectionsPn }">${sectionsList.sectionsName } <div class="jt-edit-btn"></div></li> 	
			</c:forEach>
			</ul>
		</div>
		<div class="jt-admin-category-wrap">
			<div class="jt-admin-category-wrap-title">중분류</div>
			<ul class="jt-admin-category-wrap-ul jt-admin-category-divisions-wrap-ul">
			</ul>
		</div>
		<div class="jt-admin-category-wrap">
			<div class="jt-admin-category-wrap-title">소분류</div>
			<ul class="jt-admin-category-wrap-ul jt-admin-category-groups-wrap-ul">
			</ul>
		</div>
	</div>
	<div style="overflow: hidden;">
		<div class="jt-admin-category-button-wrap">
			<input type="text" class="jt-admin-filter-input" />
			<button type="button" class="jt-admin-category-sections-btn"><img alt="plus" src="${cp}/resources/images/jt-plus-btn.png" style="width:18px;margin: 0 3px -5px 0;">대분류 추가</button>
		</div>
		<div class="jt-admin-category-button-wrap">
			<input type="text" class="jt-admin-filter-input" />
			<button type="button" class="jt-admin-category-divisions-btn"><img alt="plus" src="${cp}/resources/images/jt-plus-btn.png" style="width:18px;margin: 0 3px -5px 0;">중분류 추가</button>
		</div>
		<div class="jt-admin-category-button-wrap">
			<input type="text" class="jt-admin-filter-input" />
			<button type="button" class="jt-admin-category-groups-btn"><img alt="plus" src="${cp}/resources/images/jt-plus-btn.png" style="width:18px;margin: 0 3px -5px 0;">소분류 추가</button>
		</div>
	</div>
</div>

<%@ include file="../../layout/home_footer.jspf" %>
