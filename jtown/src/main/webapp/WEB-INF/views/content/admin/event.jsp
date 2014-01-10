<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/admin_header.jspf" %>
<style type="text/css">
.jt-admin-event-wrap{padding: 10px;}
.jt-admin-event-title{height: 60px;font-size: 18px;font-weight: bold;padding: 10px 0 0;}
.jt-admin-event-title-wrap{float:left;font-size: 13px; width:100px;padding: 10px 5px;}
.jt-admin-event-content-text {width:500px;height: 200px;}
.jt-admin-event-name-input{width:500px;}
.jt-admin-event-url-input{width:500px;}
.jt-admin-event-partition-wrap{overflow: hidden;padding: 5px 0;}
.jt-admin-event-facebook-message{width: 500px;height: 50px;}
#jt-admin-event-image-upload-btn{font-size:13px;}
#jt-admin-event-fb-img-upload-btn{font-size:13px;}
.jt-admin-event-insert-btn{background-color: #fff; color: 888;border-radius: 8px; border: 1px solid #bbb; width:70px; height: 43px;cursor: pointer; }
.jt-admin-event-insert-btn:HOVER {background-color: #fafafa}
.jt-admin-event-footer{margin: 35px 0 0 290px}
.jt-admin-event-image-upload-img{margin: 0 0 0 110px;}
.jt-admin-event-fb-upload-img{margin: 0 0 0 110px;}
</style>

<div class="jt-admin-event-wrap">
	<form class="jt-admin-event-form" method="post" >
		<div class="jt-admin-event-title">메인 배너 관리</div>
		
		<c:forEach items="${bannerList }" var="bannerList">
			<div>
				<img src="${cp}/photo/thumbnail/${bannerList.saveName }" />
			</div>
		</c:forEach>
		
		<div class="jt-admin-event-partition-wrap">
			<div class="jt-admin-event-title-wrap">구분</div>
			<div style="float: left;padding: 5px 0;">
				<select name="bannerType">
					<option value="1">이벤트</option>
					<option value="2">링크</option>
				</select>
			</div>
		</div>
		<div class="jt-admin-event-partition-wrap">
			<div class="jt-admin-event-title-wrap">이벤트 이름</div>
			<div style="float: left;">
				<input type="text" class="jt-admin-filter-input jt-admin-event-name-input" name="eventName" />
			</div>
		</div>
		
		<div class="jt-admin-event-partition-wrap jt-admin-event-content-wrap">
			<div class="jt-admin-event-title-wrap">이벤트 내용</div>
			<div style="float: left;">
				<textarea class="jt-admin-filter-input jt-admin-event-content-text" rows="" cols="" placeholder="이벤트 페이지를 열어 사용자들에게 보여줄 내용입니다. " name="content"></textarea>
			</div>
		</div>
		<div class="jt-admin-event-partition-wrap">
			<div class="jt-admin-event-title-wrap jt-admin-event-memo-text-title">추가사항</div>
			<div style="float: left;">
				<input type="text" class="jt-admin-filter-input jt-admin-event-url-input" placeholder="ex) 수요일 18시/ 19시 (없으면 비워둡니다.)" name="variableData">
			</div>
		</div>
		
		<div class="jt-admin-event-partition-wrap">
			<input type="hidden" name="image">
			<div class="jt-admin-event-title-wrap">
				메인 이미지<br/>
				(496*289)
			</div>
			<div style="float: left;padding: 10px 0;"><input type="file" id="jt-admin-event-image-upload-btn"/> </div>
		</div>
		<div class="jt-admin-event-image-upload-img"></div>
		<div class="jt-admin-event-facebook-wrap">
			<input type="hidden" name="fb_thumbnail">
			<div class="jt-admin-event-partition-wrap">
				<div class="jt-admin-event-title-wrap">
					페이스 북<br/> 이미지<br/>(116*116)
				</div>
				<div style="float: left;padding: 10px 0;"><input type="file" id="jt-admin-event-fb-img-upload-btn" /></div>
			</div>
			<div class="jt-admin-event-fb-upload-img"></div>
			<div class="jt-admin-event-partition-wrap">
				<div class="jt-admin-event-title-wrap">페이스북<br/> 메세지</div>
				<div style="float: left;"><textarea class="jt-admin-filter-input jt-admin-event-facebook-message" rows="" cols="" placeholder="페이스북에 공유되어 보여질 메시지입니다."></textarea> </div>
			</div>
		</div>
		<div class="jt-admin-event-partition-wrap jt-admin-event-footer">
			<button type="button" class="jt-admin-event-insert-btn">저장</button>
		</div>
	</form>
</div>

<%--
	//TODO
	구분 - 링크일때 URL 입력으로 메세지 변경, 이벤트내용, 페이스북 이미지, 페이스북 메세지 hide
	구분 - 이벤트일때 URL입력 ->  추가 입력, placeholder (추가사항 (날짜, 시간등을 수동으로 입력받아야 할 경우에 입력합니다. 없으면 비워둡니다. )   
	
	필수 사항 - 메인이미지, 구분(banner_type), eventName
 --%>

<%@ include file="../../layout/home_footer.jspf" %>
