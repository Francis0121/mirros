<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="../../layout/admin_header.jspf"%>
<style>
.jt-admin-view-count-form input{width: 40px;}
#jt-admin-main-lovers-table{display: none; float: left; margin-left: 40px;}
#jt-admin-main-partnerships-table{float: left;}
</style>
<h1>조회수 현황</h1>
<table id="jt-admin-main-partnerships-table" class="jt-admin-base-table">
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
				<td>
					<a class="jt-admin-love-count" href="#none" data-seller-pn="${partnership.pn}">
						<c:out value="${partnership.loveCount eq null? 0 : partnership.loveCount}"/>
					</a>
				</td>
			</tr>
		</c:forEach>
	</tfoot>
</table>

<table id="jt-admin-main-lovers-table" class="jt-admin-base-table">
	<thead>
		<tr>
			<th>하트</th>
			<th>이름</th>
		</tr>
	</thead>
	<tfoot>
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
	var table = $("#jt-admin-main-lovers-table");
	var tfoot = table.children("tfoot");
	
	var onCheck = function(){
		var checkbox = this;
		var sellerPn = this.sellerPn;
		$.postJSON("${cp }/ajax/clickLove.jt", {customerPn: this.customerPn, sellerPn: sellerPn}, function(count){
			switch(count.message){
			case "1":
				alert("로그인 후 사용 가능합니다.");
				return;
			case "2":
				alert("판매자는 사용하실 수 없습니다.");
				return;
			}
			
			switch(count.crudType){
			case "insert":
				checkbox.checked = "checked";
				break;
			case "delete":
				checkbox.checked = null;
				break;
			default:
				return;
			}
			
			$(".jt-admin-love-count[data-seller-pn="+sellerPn+"]").text(count.count);
		});
		return false;
	};
	
	$(".jt-admin-love-count").click(function(){
		var sellerPn = $(this).attr("data-seller-pn");
		tfoot.empty();
		table.show();
		$.postJSON("${cp }/admin/ajax/selectSellerLovers.jt?sellerPn=" + sellerPn).success(function(lovers){
			for(var i in lovers){
				var lover = lovers[i];
				var tr = document.createElement("tr");
				tfoot.append(tr);
				tr = $(tr);
				
				var tdHeart = document.createElement("td");
				tr.append(tdHeart);

				var inputHeart = document.createElement("input");
				inputHeart.type = "checkbox";
				inputHeart.customerPn = lover.customerPn;
				inputHeart.sellerPn = sellerPn;
				inputHeart.onclick = onCheck;
				if(lover.inputDate){
					inputHeart.checked = 'checked';
				}
				$(tdHeart).append(inputHeart);
				
				var tdName = document.createElement("td");
				$(tdName).text(lover.message);
				tr.append(tdName);
			}
		});
	});
</script>