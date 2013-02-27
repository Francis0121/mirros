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
				<th>아이디</th>
				<th>이름</th>
				<th>관심사</th>
				<th>가입날짜</th>
				<th>불량사용자 여부</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${customerList }" var="customer" varStatus="i">
				<c:set var="customerPn" value="${customer.pn }" />
				<tr class="jt-admin-customer-table-tr">
					<td>${i.count }</td>
					<td class="jt-admin-customer-table-customerId">${customer.username }</td>
					<td>${customer.name }</td>
					<td>${interestMap[customerPn].interestSectionNameList }</td>
					<td>${customer.joinDate }</td>
					<td>
						<select class="jt-admin-customer-enable">
							<option value="1" ${customer.enabled eq true ? 'selected=selected' : ''}>정상 사용자</option>
							<option value="0" ${customer.enabled eq false ? 'selected=selected' : ''}>불량 사용자</option>					
						</select>
					</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</div>

<%@ include file="../../layout/layout_admin_footer.jspf" %>