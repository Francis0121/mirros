<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../../layout/admin_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>

<c:set var="section" value="${question.questionSection }"/>
<c:set var="category" value="${section.questionCategory }"/>
<section class="jt-admin-quetion-section">
	<header class="jt-admin-quetion-section-header">
		<ul>
			<li>[<c:out value="${category.name }"/>-<c:out value="${section.name }"/>] <c:out value="${question.title }"/></li>
			<li><c:out value="${fn:substring(question.inputDate , 0, 10) }"/></li>
		</ul>
	</header>
	<article class="jt-admin-quetion-section-article">
		<pre><c:out value="${question.content }"/></pre>
	</article>
	<footer class="jt-admin-quetion-section-footer">
		<div>
		<c:if test="${question.shopPn ne null }">	
			ShopNo : <c:out value="${question.sixShopPn }"/><br/>	
		</c:if>
		Name : <c:out value="${question.name }"/><br/>
		Email : <c:out value="${question.email }"/><br/>
		Browser : <c:out value="${question.browser }"/>
		</div>
	</footer>
</section>

<ul class="jt-admin-quetion-tool">
	<li>
		<a href="${cp }/admin/questions" class="jt-btn-white-small jt-admin-quetion-tool-list">
			<span class="btnImage"></span>
			<span class="btnText">목록</span>
		</a>
	</li>
</ul>

<%@ include file="../../../layout/admin_footer.jspf" %>