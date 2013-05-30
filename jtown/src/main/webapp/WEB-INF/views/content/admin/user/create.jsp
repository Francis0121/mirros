<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../../layout/admin_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<form:form commandName="jtownUser" action="${cp }/admin//createAdministrator.jt" htmlEscape="true" method="post">
	ID
	<form:input path="username"/>
	<form:errors path="username"/><br/>
	Name
	<form:input path="name"/>
	<form:errors path="name"/><br/>
	Email
	<form:input path="email"/>
	<form:errors path="email"/><br/>
	Password
	<form:password path="password"/>
	<form:errors path="password"/><br/>
	Confirm Password
	<input type="password" id="confirmPassword" name="confirmPassword"/><br/>
		
	<button type="submit">생성</button>
</form:form>
<%@ include file="../../../layout/admin_footer.jspf" %>