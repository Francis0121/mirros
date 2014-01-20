<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/admin_header.jspf" %>

<style>
.jt-admin-category{margin: 80px 15px 15px;overflow: hidden;}
.jt-admin-category-wrap{float: left; margin: 0 5px;}
.jt-admin-category-wrap-ul{width:220px;height: 400px;background-color: #fff;font-size: 12px;line-height: 2;overflow-y: scroll; padding: 5px 10px; border-right: 1px solid #000;border-bottom: 1px solid #000;border-left: 1px solid #000; }
.jt-admin-category-wrap-title {width:220px;padding: 10px 10px;background-color: #808080;color: #fff;font-weight: bold;text-align: center;font-size: 13px;border: 1px solid #000;}
.jt-admin-category-wrap-ul>li:HOVER{background: rgba( 250,172,73, .5);}
.jt-admin-category-wrap-ul>li{border-top: 1px solid #fff;border-bottom: 1px solid #fff;position: relative; }
.jt-admin-category-button-wrap{float: left;width:240px;margin: 0 7px 0 5px;}
.jt-admin-category-sections-active{background-color: rgba( 250,172,73, .5);padding: 0 10px;}
.jt-admin-category-divisions-active{background-color: rgba( 250,172,73, .5);padding: 0 10px;}
.jt-admin-category-groups-active{background-color: rgba( 250,172,73, .5);padding: 0 10px;}
.jt-admin-category-button-wrap>button{margin: 6px 0 0 0;border: 1px solid #ad9c9c;padding: 2px 12px 2px 8px;border-radius:3px;color: #2e2e2e;background-color: #fff;}
.jt-admin-category-button-wrap>button:HOVER {background-color: rgba( 250,172,73, .8);}
.jt-admin-category-button-wrap>button:ACTIVE {background-color: rgba( 250,172,73, .8);color: #fff;}
.jt-edit-btn{display: none;}
</style>
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
