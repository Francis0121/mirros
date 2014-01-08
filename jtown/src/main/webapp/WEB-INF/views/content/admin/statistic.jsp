<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/admin_header.jspf" %>
<div class="jt-statistic-container">
	<div id="folderBar">
	</div>
	<div class="jt-seller-content jt-statistic-content" data-time="" data-role="${admin}">
		<div class="jt-statistic-title">
			<button type="button" value="-1" class="jt-statistic-next-month-btn">◀</button>
			<span></span>
			<button type="button" value="1" class="jt-statistic-next-month-btn">▶</button>
		</div>
		<div id="jt-statistic-graph" class="plot" style="width:930px;height:300px;"></div>
	</div>
</div>

<%@ include file="../../layout/home_footer.jspf" %>
