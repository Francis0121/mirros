<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/layout_admin_header.jspf" %>

<table class="jt-manage-table">
	<thead>
		<tr>
			<th>번호</th>
			<th>가게 주소</th>
			<th>가게 이름</th>
			<th>관심사</th>
			<th>판매자 아이디</th>
			<th>불량사용자 여부</th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td colspan="6"></td>
		</tr>
	</tfoot>
	<tbody>
		<c:forEach items="${sellerList }" var="seller" varStatus="i">
			<c:set var="sellerPn" value="${seller.pn }" />
			<tr class="jt-admin-seller-table-tr" data-pn="<c:out value="${sellerPn }"/>" data-categoryPn="<c:out value="${interestMap[sellerPn].categoryPn }"/>">
				<td><c:out value="${i.count }"/></td>
				<td class="jt-admin-seller-table-shopUrl"><c:out value="${seller.shopUrl }"/></td>
				<td><c:out value="${seller.name }"/></td>
				<td class="jt-admin-seller-table-interestList"><c:out value="${interestMap[sellerPn].interestSectionNameList }"/></td>
				<td class="jt-admin-seller-table-sellerId"><c:out value="${seller.username }"/></td>
				<td>
					<select class="jt-admin-seller-enable">
						<option value="1" ${seller.enabled eq true ? 'selected=selected' : ''}>정상 사용자</option>
						<option value="0" ${seller.enabled eq false ? 'selected=selected' : ''}>불량 사용자</option>					
					</select>
				</td>
			</tr>
		</c:forEach>
	</tbody>
</table>
<%@ include file="../../layout/layout_admin_footer.jspf" %>