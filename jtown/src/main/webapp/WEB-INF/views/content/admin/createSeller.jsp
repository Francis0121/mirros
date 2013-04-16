<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/admin_header.jspf" %>
<form:form commandName="jtownUser" method="post">
<table class="jt-create-table">
	<tfoot>
		<tr>
			<td colspan="2"><input type="button" value="판매자 생성" class="jt-create-seller-submit jt-btn-orange" /></td>
		</tr>
	</tfoot>
	<tbody>
		<tr>
			<th>
				<form:label path="interestCategory">판매물품 대분류</form:label>
			</th>
			<td>
				<form:select path="interestCategory">
					<c:forEach items="${categoryList }" var="category">
						<form:option value="${category.categoryPn }">${category.name }</form:option>
					</c:forEach>
				</form:select>
			</td>
		</tr>
		<tr>
			<th>
				<form:label path="interestSectionList">판매물품 소분류</form:label>
			</th>
			<td>
				<form:input path="interestSectionList" cssClass="jt-join-user-input"/>
				<form:errors path="interestSectionList" cssClass="commonError" />
			</td>
		</tr>
		<tr>
			<th>
				<form:label path="name">가게 이름</form:label>
			</th>
			<td>
				<form:input path="name" cssClass="jt-join-user-input" />
				<form:errors path="name" cssClass="commonError"/>
			</td>
		</tr>
		<tr>
			<th>
				<form:label path="shopUrl">가게 주소</form:label>
			</th>
			<td>
				<form:input path="shopUrl" cssClass="jt-join-user-input" />
				<form:errors path="shopUrl" cssClass="commonError" />
			</td>
		</tr>
	</tbody>
</table>
</form:form>
<%@ include file="../../layout/admin_footer.jspf" %>