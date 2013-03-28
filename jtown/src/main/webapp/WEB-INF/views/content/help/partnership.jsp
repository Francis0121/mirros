<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/layout_help_header.jspf" %>
<c:url value="/help/partnership.jt" var="action"/>
<section>
	
	<hgroup>
		<h1>Business(제휴문의)</h1>
		<h2>당신의&nbsp;쇼핑몰을&nbsp;쉽게&nbsp;홍보하세요.</h2>
	</hgroup>
	
	<section>
	
	</section>
	
	<form:form commandName="partnership" htmlEscape="true" method="post" action="${action }">
		<table>
			<tfoot>
				<tr>
					<td colspan="2">
						<input type="submit" value="문의하기"/>
					</td>
				</tr>
			</tfoot>
			<tbody>
				<tr>
					<th>
						<form:label path="categoryPn">아이템</form:label>
					</th>
					<td>
						<form:select path="categoryPn" htmlEscape="true">
							<form:option value="">아이템</form:option>
							<form:options items="${interest }" itemLabel="name" itemValue="categoryPn"/>
						</form:select>
						<div>
							<form:errors path="categoryPn"/>
						</div>
					</td>
				</tr>
				<tr>
					<th>
						<form:label path="name">성함</form:label>
					</th>
					<td>
						<form:input path="name" htmlEscape="true" maxlength="30"/>
						<div>
							<form:errors path="name"/>
						</div>
					</td>
				</tr>
				<tr>
					<th>
						<form:label path="phoneNumber">연락처</form:label>
					</th>
					<td>
						<form:select path="phoneNumberSt" htmlEscape="true">
							<form:option value="010">010</form:option>
							<form:option value="011">011</form:option>
							<form:option value="016">016</form:option>
							<form:option value="017">017</form:option>
							<form:option value="018">018</form:option>
							<form:option value="019">019</form:option>
						</form:select>
						-
						<form:input path="phoneNumberNd" htmlEscape="true" maxlength="4"/>-
						<form:input path="phoneNumberRd" htmlEscape="true" maxlength="4"/>
						<div>
							<form:errors path="phoneNumber"/>
						</div>
					</td>
				</tr>
				<tr>
					<th>
						<form:label path="email">이메일</form:label>
					</th>
					<td>
						<form:input path="email" htmlEscape="true" maxlength="50"/>
						<div>
							<form:errors path="email"/>
						</div>
					</td>
				</tr>
				<tr>
					<th>
						<form:label path="content">문의내용</form:label>
					</th>
					<td>
						<form:textarea path="content" htmlEscape="true" maxlength="3000"/>
						<div>
							<form:errors path="content"/>
						</div>
					</td>
				</tr>
			</tbody>
		</table>	
	</form:form>

</section>
<%@ include file="../../layout/layout_help_footer.jspf" %>