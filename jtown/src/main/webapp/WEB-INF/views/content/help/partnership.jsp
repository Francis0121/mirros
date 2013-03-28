<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/layout_help_header.jspf" %>
<c:url value="/help/partnership.jt" var="action"/>
<section class="jt-partnership-section">
	
	<header class="jt-partnership-header">
		<hgroup>
			<h1>Business(제휴문의)</h1>
			<h2>당신의&nbsp;쇼핑몰을&nbsp;쉽게&nbsp;홍보하세요.</h2>
		</hgroup>
	</header>
	
	<section class="jt-partnership-content">
	
	</section>
	
	<section class="jt-partnership-form">
		<form:form commandName="partnership" htmlEscape="true" method="post" action="${action }">
			<table class="jt-partnership-form-table">
				<tfoot>
					<tr>
						<td colspan="2">
							<input type="submit" value="문의하기" class="jt-partnership-submit jt-btn-orange"/>
						</td>
					</tr>
				</tfoot>
				<tbody>
					<tr>
						<th>
							<form:label path="categoryPn">아이템</form:label>
						</th>
						<td>
							<form:select path="categoryPn" htmlEscape="true" cssClass="jt-partnership-select" cssErrorClass="jt-partnership-input-error">
								<form:option value="">아이템&nbsp;분야를&nbsp;선택해주세요</form:option>
								<form:options items="${interest }" itemLabel="name" itemValue="categoryPn"/>
							</form:select>
							<div class="jt-partnership-error">
								<form:errors path="categoryPn"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>
							<form:label path="name">성함</form:label>
						</th>
						<td>
							<div class="jt-partnership-wrap" id="nameLength">
								<span class="jt-form-invalid">이름은&nbsp;한글만&nbsp;가능합니다.</span>
							</div>
							<form:input path="name" data-form="partnership" htmlEscape="true" maxlength="10" cssClass="jt-partnership-input" cssErrorClass="jt-partnership-input-error"/>
							<div class="jt-partnership-error">
								<form:errors path="name"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>
							<form:label path="phoneNumber">연락처</form:label>
						</th>
						<td>
							<div class="jt-partnership-wrap" id="confirmPhoneNumber">
								<span class="jt-form-invalid">연락처는&nbsp;숫자만&nbsp;입력&nbsp;가능합니다.</span>
							</div>
							<form:select path="phoneNumberSt" htmlEscape="true" cssClass="jt-partnership-select jt-partnership-select-phone" cssErrorClass="jt-partnership-select-error">
								<form:option value="010">010</form:option>
								<form:option value="011">011</form:option>
								<form:option value="016">016</form:option>
								<form:option value="017">017</form:option>
								<form:option value="018">018</form:option>
								<form:option value="019">019</form:option>
							</form:select>&nbsp;-&nbsp;<form:input path="phoneNumberNd" htmlEscape="true" maxlength="4" cssClass="jt-partnership-input jt-partnership-select-phone" cssErrorClass="jt-partnership-input-error jt-partnership-select-phone"/>&nbsp;-&nbsp;<form:input path="phoneNumberRd" htmlEscape="true" maxlength="4" cssClass="jt-partnership-input jt-partnership-select-phone" cssErrorClass="jt-partnership-input-error jt-partnership-select-phone"/>
							<div class="jt-partnership-error">
								<form:errors path="phoneNumber"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>
							<form:label path="email">이메일</form:label>
						</th>
						<td>
							<div class="jt-partnership-wrap" id="confirmEmail">
								<span class="jt-form-invalid">정확한&nbsp;이메일&nbsp;주소를&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.</span>
							</div>
							<form:input path="email" htmlEscape="true" maxlength="50" cssClass="jt-partnership-input" cssErrorClass="jt-partnership-input-error"/>
							<div class="jt-partnership-error">
								<form:errors path="email"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>
							<form:label path="content">문의내용</form:label>
						</th>
						<td>
							<form:textarea path="content" htmlEscape="true" maxlength="3000" cssClass="jt-partnership-textarea" cssErrorClass="jt-partnership-textarea-error"/>
							<div class="jt-partnership-error">
								<form:errors path="content"/>
							</div>
						</td>
					</tr>
				</tbody>
			</table>	
		</form:form>
	</section>
	
	<footer class="jt-partnership-footer">
		<ul>
			<li>입력하신&nbsp;정보는&nbsp;상담처리를&nbsp;위한&nbsp;목적으로만&nbsp;사용되며,&nbsp;관련&nbsp;담당자&nbsp;외에는&nbsp;함부로&nbsp;열람할&nbsp;수&nbsp;없습니다.</li>
			<li>‘문의하기’를&nbsp;누르면&nbsp;<a href="#none">개인정보보호를&nbsp;위한&nbsp;동의</a>에&nbsp;동의한&nbsp;것으로&nbsp;간주합니다.</li>
		</ul>
	</footer>

</section>
<%@ include file="../../layout/layout_help_footer.jspf" %>