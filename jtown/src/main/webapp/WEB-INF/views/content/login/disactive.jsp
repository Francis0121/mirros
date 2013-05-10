<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/none_header.jspf" %>
<section class="jt-modify-content-wrap">
	<section class="jt-disactive-content">
		<header>
			<h2>계정삭제</h2>
		</header>
		<article>
			<p>
				계정삭제시 Facebook 이나 Twitter와 연결된 계정은 삭제 되며, 사용자 개인정보, 작성한 댓글에 대한 정보는
				전부 삭제되어 집니다. 삭제된 정보는 어떠한 방법으로도 복구가 불가능 하오니 반드시 삭제전에 신중히 생각해 주시기 바랍니다.
			</p>
			<br/>
			<p>
				계정삭제 방법은 아래에 비밀번호를 작성하고 삭제를 누르시면 14 일 후에 계정이 삭제가 되도록 되어 있습니다. 
				만약 그 기간 중에 계정삭제를 취소하시기 위해서는 다시 비밀번호 작성 후 취소하시면 됩니다. 
			</p>
			<br/>
			<p>
				Mirros를 사용해 주셔서 감사합니다.
			</p>
		</article>
		<footer>
			<c:url value="/login/disactive.jt" var="disactiveUrl"/>
			<c:choose>
				<c:when test="${registerDate ne null }">	
					<ul>
						<li>등록날짜 : ${registerDate }</li>
						<li>삭제날짜 : ${deleteDate }</li>
					</ul>
					<div>
					<form:form commandName="jtownUser" action="${disactiveUrl }" htmlEscape="true" method="delete">
						<form:label path="password">비밀번호</form:label>
						<form:password path="password" cssClass="jt-disactive-input" cssErrorClass="jt-disactive-input-error"/>
						<input type="button" value="취소" class="jt-disactive-cancle-btn jt-btn-white-small"/>
						<div class="jt-disactive-content-error">	
							<form:errors path="password" cssClass="commonError"></form:errors>
						</div>
					</form:form>
					</div>
				</c:when>
				<c:otherwise>
					<div>
					<form:form commandName="jtownUser" action="${disactiveUrl }" htmlEscape="true">
						<form:label path="password">비밀번호</form:label>
						<form:password path="password" cssClass="jt-disactive-input" cssErrorClass="jt-disactive-input-error"/>
						<input type="button" value="삭제" class="jt-disactive-btn jt-btn-white-small"/>
						<div class="jt-disactive-content-error">	
							<form:errors path="password" cssClass="commonError"></form:errors>
						</div>
					</form:form>
					</div>
				</c:otherwise>
			</c:choose>
		</footer>
	</section>
</section>
<%@ include file="../../layout/none_footer.jspf" %>