<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/help_header.jspf" %>
<c:url value="/resources/images/jt-about-us.png" var="aboutUsImageUrl"/>
<div style="width: 990px; margin: auto;">
<img alt="Mirros" src="${aboutUsImageUrl }" style="width: 990px; height: 1654px; margin-top: -15px;">
</div>
<%@ include file="../../layout/help_footer.jspf" %>