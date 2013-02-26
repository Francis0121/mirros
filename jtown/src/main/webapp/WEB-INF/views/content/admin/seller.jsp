<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/layout_admin_header.jspf" %>
<div>
	<table class="jt-join-user-table">
		<thead>
			<tr>
				<th>번호</th>
				<th>가게 이름</th>
				<th>가게 주소</th>
				<th>판매자 아이디</th>
				<th>관심사</th>
				<th>불량사용자 여부</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${sellerList }" var="seller" varStatus="i">
				<c:set var="sellerPn" value="${seller.pn }" />
				<tr class="jt-admin-seller-table-tr" data-pn=${sellerPn }>
					<td>${i.count }</td>
					<td>${seller.shopName }</td>
					<td class="jt-admin-seller-table-shopUrl">${seller.shopUrl }</td>
					<td>${seller.username }</td>
					<td class="jt-admin-seller-table-interestList">${interestMap[sellerPn].interestSectionNameList }</td>
					<td>
						<select>
							<option value="1">정상 사용자</option>
							<option value="0">불량 사용자</option>					
						</select>
					</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</div>
<%@ include file="../../layout/layout_admin_footer.jspf" %>