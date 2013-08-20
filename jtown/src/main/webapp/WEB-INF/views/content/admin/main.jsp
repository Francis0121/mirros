<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/admin_header.jspf" %>
<style>
.jt-admin-view-count{width: 40px;}
</style>
<h1>조회수 현황</h1>
<table class="jt-admin-base-table">
	<thead>
		<tr>
			<th>고유번호</th>
			<th>회사명</th>
			<th>조회수</th>
			<th>댓글수</th>
			<th>하트</th>
		</tr>
	</thead>
	<tfoot>
		<c:forEach items="${partnerships}" var="partnership">
			<tr>
				<td>${partnership.pn}</td>
				<td>${partnership.name}</td>
				<td><a class="jt-admin-view-count" href="#">${partnership.viewCount}</a></td>
				<td>${partnership.commentCount}</td>
				<td>${partnership.loveCount}</td>
			</tr>
		</c:forEach>
	</tfoot>
</table>
<%@ include file="../../layout/admin_footer.jspf" %>

<script>
	$(".jt-admin-view-count").click(function(){
		var viewCount = $(this);
		var sellerPn = viewCount.parents("tr").children("td:first").text();
		console.log("sellerPn: " + sellerPn);
		$.postJSON('${cp }/admin/ajax/insertViewCount.jt', {sellerPn: sellerPn}, function(count){
			console.log("count: " + count.count);
			viewCount.text(count.count);
		});
		return true;
	});
</script>