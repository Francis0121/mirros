<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="../../layout/admin_header.jspf"%>
<style>
.jt-admin-view-count-form input {
	width: 40px;
}
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
				<c:set var="viewCount" value="${partnership.viewCount eq null? 0 : partnership.viewCount}" />
				<td>
					<form class="jt-admin-view-count-form">
						<label>${viewCount}</label>
						<input name="sellerPn" type="hidden" value="${partnership.pn}" />
						<input name="count" type="number" />
						<input type="submit" value="+" />
					</form>
				</td>
				<td>${partnership.commentCount}</td>
				<td>${partnership.loveCount}</td>
			</tr>
		</c:forEach>
	</tfoot>
</table>
<%@ include file="../../layout/admin_footer.jspf"%>

<script>
	$(".jt-admin-view-count-form").submit(function() {
		var form = this;
		var data = {count: form.count.value, sellerPn: form.sellerPn.value};
		$.postJSON("${cp }/admin/ajax/insertViewCount.jt", data, function(count) {
			form.count.value = "";
			$(form).children("label").text(count.count);
		});
		return false;
	});
</script>