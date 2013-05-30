<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/none_header.jspf" %>
<section id="jt-findpassword-page-section">
	
	<header>
		<h2>아이디/비밀번호 찾기</h2>
	</header>

	<article class="jt-findpassword-page">
		<header>
			<div>
				<h1>사용자</h1>
			</div>
	
			<ul>
				<li>Mirros 회원가입할 때 사용하신 email 을 아래에 입력해 주시기 바랍니다.</li>
				<li>임의로 생성된 비밀번호가 해당 email 에 제공됩니다.</li>
			</ul>
		</header>
		<section>
			<c:url var="findUserPassword" value="/login/findUserPassword.jt"/>
			<form:form commandName="jtownUser" method="post" action="${findUserPassword }" htmlEscape="true">
				<form:input id="username_findPassword" path="username" cssClass="jt-findpassword-input" cssErrorClass="jt-findpassword-input-error" placeholder="Email Address"/>
				<input type="submit" value="보내기" class="jt-btn-orange"/>
				<div class="jt-join-user-error">
					<form:errors path="username" cssClass="commonError"></form:errors>
				</div>
			</form:form>				
		</section>
	</article>
	
	<article class="jt-findpassword-page">
		<header>
			<div>
				<h1>판매자</h1>
			</div>
	
			<ul>
				<li>Mirros 제휴하신 고객분들만 사용 가능 합니다.</li>
				<li>Mirros 제휴문의시 사용하신 email 을 아래에 입력해 주시기 바랍니다.</li>
				<li>아이디와 임의로 생성된 비밀번호가 해당 email 에 제공됩니다.</li>
			</ul>
		</header>
		<section>
			<c:url var="findSellerPassword" value="/login/findSellerPassword.jt"/>
			<form:form commandName="sellerUser" method="post" action="${findSellerPassword }" htmlEscape="true">
				<form:input id="username_findPassword" path="username" cssClass="jt-findpassword-input" cssErrorClass="jt-findpassword-input-error" placeholder="Email Address"/>
				<input type="submit" value="보내기" class="jt-btn-orange jt-findpassword-submit-btn"/>
				<div class="jt-join-user-error">
					<form:errors path="username" cssClass="commonError"></form:errors>
				</div>
			</form:form>				
		</section>	
	</article>
	
	<footer>
		<ul>
			<li>문제가 있을 경우 고객센터에 연락주시면 적극 도와드리겠습니다</li>
		</ul>
	</footer>
</section>
<%@ include file="../../layout/none_footer.jspf" %>