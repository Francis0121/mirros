<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/none_header.jspf" %>
<div class="jt-statistic-container">
	<div id="folderBar">
	</div>
	<div class="jt-seller-content jt-statistic-content" data-time="" data-sellerPn="${sellerPn}" data-admin="${admin}">
		<div class="jt-statistic-title">
			<button type="button" value="-1" class="jt-statistic-next-month-btn">◀</button>
			<span></span>
			<button type="button" value="1" class="jt-statistic-next-month-btn">▶</button>
		</div>
		<div id="jt-statistic-graph" class="plot" style="width:930px;height:300px;"></div>
		<div class="jt-statistic-tip-wrap">
			 <span class="jt-statistic-tip"><b>Tip :</b> 매력적인 상품과 이벤트를 정기적으로 업데이트 해보세요! 보다 높은 유입효과를 볼 수 있습니다.<br/></span>
			<span class="jt-statistic-tip-go"><b>내 쇼핑몰 업데이트하러 가기</b></span>
		</div>
	</div>
</div>

<%@ include file="../layout/home_footer.jspf" %>
