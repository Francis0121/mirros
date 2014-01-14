<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../../layout/admin_header.jspf" %>

<div class="jt-admin-event-wrap" data-pn="${bannerItem.pn}">
	<form class="jt-admin-event-form" method="post" >
		<input type="hidden" name="pn" value="${bannerItem.pn }"/>
		<div class="jt-admin-event-title">메인 배너 관리</div>
		
		<div class="jt-admin-event-partition-wrap">
			<div class="jt-admin-event-title-wrap">구분</div>
			<div style="float: left;padding: 5px 0;">
				<select name="bannerType">
					<option value="1" ${bannerItem.bannerType ==1 ? 'selected="selected"' : ''}>이벤트</option>
					<option value="2" ${bannerItem.bannerType ==2 ? 'selected="selected"' : ''}>링크</option>
				</select>
			</div>
		</div>
		<div class="jt-admin-event-partition-wrap">
			<div class="jt-admin-event-title-wrap">이벤트 이름</div>
			<div style="float: left;">
				<input type="text" class="jt-admin-filter-input jt-admin-event-name-input" name="eventName"  value="${bannerItem.eventName}"/>
			</div>
		</div>
		
		<div class="jt-admin-event-partition-wrap jt-admin-event-content-wrap" ${bannerItem.bannerType ==2 ? 'style="display: none"' : ''}>
			<div class="jt-admin-event-title-wrap">이벤트 내용</div>
			<div style="float: left;">
				<textarea class="jt-admin-filter-input jt-admin-event-content-text" rows="" cols="" placeholder="이벤트 페이지를 열어 사용자들에게 보여줄 내용입니다. " name="content">${bannerItem.content}</textarea>
			</div>
		</div>
		<div class="jt-admin-event-partition-wrap">
			<div class="jt-admin-event-title-wrap jt-admin-event-memo-text-title">${bannerItem.bannerType ==2 ? 'URL 입력' : '추가사항' }</div>
			<div style="float: left;">
				<input type="text" class="jt-admin-filter-input jt-admin-event-url-input" placeholder="${bannerItem.bannerType == 2 ? 'ex) http://www.mirros.net' : 'ex) 수요일 18시/ 19시 (없으면 비워둡니다.)'}" name="variableData" value="${bannerItem.variableData}">
			</div>
		</div>
		<div class="jt-admin-event-partition-wrap">
			<input type="hidden" name="image" value="${bannerItem.saveName}">
			<div class="jt-admin-event-title-wrap">
				메인 이미지<br/>
				(496*289)
			</div>
			<div style="float: left;padding: 10px 0;"><input type="file" id="jt-admin-event-image-upload-btn"/> </div>
		</div>
		<div class="jt-admin-event-image-upload-img"><c:if test="${!empty bannerItem.saveName}"><img src="${cp}/photo/thumbnail/${bannerItem.saveName}" alt="" /></c:if></div>
		<div class="jt-admin-event-facebook-wrap" ${bannerItem.bannerType ==2 ? 'style="display: none"' : ''}>
			<input type="hidden" name="fbThumbnail" value="${bannerItem.fbThumbnail}">
			<div class="jt-admin-event-partition-wrap">
				<div class="jt-admin-event-title-wrap">
					페이스 북<br/> 이미지<br/>(116*116)
				</div>
				<div style="float: left;padding: 10px 0;"><input type="file" id="jt-admin-event-fb-img-upload-btn" /></div>
			</div>
			<div class="jt-admin-event-fb-upload-img"><c:if test="${!empty bannerItem.fbThumbnail}"><img src="${cp}/photo/thumbnail/${bannerItem.fbThumbnail}" alt="" /></c:if></div>
			<div class="jt-admin-event-partition-wrap">
				<div class="jt-admin-event-title-wrap">페이스북<br/> 메세지</div>
				<div style="float: left;"><textarea class="jt-admin-filter-input jt-admin-event-facebook-message" rows="" cols="" name="fbMessage" placeholder="페이스북에 공유되어 보여질 메시지입니다.">${bannerItem.fbMessage}</textarea> </div>
			</div>
		</div>
		<div class="jt-admin-event-partition-wrap jt-admin-event-footer">
			<c:if test="${insertFlag == true}">
				<button type="button" class="jt-admin-event-insert-btn jt-admin-banner-btn">저장</button>
			</c:if>
			<c:if test="${insertFlag != true && bannerItem.deleted == 'N'}">
				<button type="button" class="jt-admin-event-modify-btn jt-admin-banner-btn">수정</button>
				<button type="button" class="jt-admin-event-delete-btn jt-admin-banner-btn">삭제</button>
			</c:if>
		</div>
	</form>
</div>

<%@ include file="../../../layout/home_footer.jspf" %>
