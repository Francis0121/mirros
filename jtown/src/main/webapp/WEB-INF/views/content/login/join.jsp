<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<c:url var="cp" value="<%=request.getContextPath() %>"/>
<!DOCTYPE HTML>
<html>
<head>
<title>J TOWN</title>
<%@ include file="../../layout/style.jspf" %>
<%@ include file="../../layout/header_script.jspf" %>
</head>
<body style="background: #f2f2f2;">
	<section class="jt-body">
		<header class="jt-header">
			<div class="jt-header-title jt-seller-header-title">
				<div class="jt-header-banner">
					<a href="${cp }/seller/<c:out value="${jtownUser.pn}"/>"><h1>J Town</h1></a>
				</div>
				<div class="jt-header-banner">
					<a href="${cp }/"><h1>J Town</h1></a>
				</div>
				<ul class="jt-header-login-menu">
					<sec:authorize access="hasRole('ROLE_USER')">
						<li id="jt-mypage">
							<a href="#none" class="jt-common-a-base"><sec:authentication property="principal.name" />&nbsp;<span class="jt-btn-underArrow">▼</span></a>
							<ul class="jt-under-wrap" id="jt-mypage-wrap">
								<li>
									<c:url value="/login/modify" var="modifyUrl"/>
									<a href="${modifyUrl }" class="jt-common-a-base" id="jt-modify">비밀번호 변경</a>
								</li>
								<li>
									<c:url value="/login/logout" var="logoutUrl"/>
									<a href="${logoutUrl }" class="jt-common-a-base" id="jt-logout">로그아웃</a>
								</li>	
								<sec:authorize access="hasRole('ROLE_SELLER')">
								<li>
									<c:url value="/seller/${jtownUser.pn}" var="sellerUrl"/>
									<a href="${sellerUrl }" class="jt-common-a-base" id="jt-logout">판매자 페이지</a>
								</li>	
								</sec:authorize>
								<sec:authorize access="hasRole('ROLE_ADMIN')">
								<li>
									<c:url value="/admin" var="sellerUrl"/>
									<a href="${adminUrl }" class="jt-common-a-base" id="jt-logout">관리자 페이지</a>
								</li>	
								</sec:authorize>
							</ul>
						</li>
					</sec:authorize>
					<sec:authorize access="anonymous">
						<li>
							<a href="#none" class="jt-common-a-base" id="jt-login-smartPopup">LOG IN</a>
						</li>
						<li>
							<c:url var="join" value="/login/join"/>
							<a href="${join }" class="jt-common-a-base">SIGN UP</a>
						</li>
					</sec:authorize>
					<li id="jt-help">
						<c:url var="help" value="/help/question"/>
						<a href="#none" class="jt-common-a-base">HELP&nbsp;<span class="jt-btn-underArrow">▼</span></a>
						<ul class="jt-help-under-wrap" id="jt-help-wrap">
							<li>HELP</li>
							<li>HELP</li>
						</ul>
					</li>
				</ul>
			</div>
		</header>
		<section class="jt-join-user-wrap">
			<header class="jt-join-user-info">
				<h1>회원가입</h1>
			</header>
			<c:url value="/login/joinSubmit.jt" var="joinSubmit"/>
			<form:form commandName="jtownUser" action="${joinSubmit }" htmlEscape="true" method="post">
			<table class="jt-join-user-table">
				<tfoot>
					<tr>
						<td colspan="2">
							<input type="button" value="FINISH" class="jt-join-submit jt-btn-orange" />
						</td>
					</tr>
				</tfoot>
				<tbody>
					<tr>
						<th>
							<form:label path="name">이름</form:label>
						</th>
						<td>
							<form:input path="name" cssClass="jt-join-user-input" maxlength="10"/>
							<br/>
							<span class="jt-form-invalid jt-join-user-nameLength" id="nameLength">10글자&nbsp;이하</span>
							<form:errors path="name" cssClass="commonError"></form:errors>
						</td>
					</tr>
					<tr>
						<th>
							<form:label path="username" >이메일</form:label>
						</th>
						<td>
							<form:input path="username" htmlEscape="true" data-type="create" cssClass="jt-join-user-input" maxlength="50"/>
							<br/>
							<span class="jt-form-invalid jt-join-user-confirmEmail" id="confirmEmail">정확한&nbsp;이메일&nbsp;주소를&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.(ex&nbsp;abcde@abc.com)</span>
							<form:errors path="username" cssClass="commonError"></form:errors>
						</td>
					</tr>
					<tr>
						<th>
							<form:label path="password" >비밀번호</form:label>
						</th>
						<td>
							<form:password path="password" cssClass="jt-join-user-input" maxlength="16" />
							<br/>
							<span class="jt-form-invalid jt-join-user-passwordLength" id="passwordLength">비밀번호는&nbsp;8자&nbsp;이상&nbsp;16자&nbsp;이하&nbsp;이어야&nbsp;합니다.</span>
							<form:errors path="password" cssClass="commonError"></form:errors>
						</td>
					</tr>
					<tr>
						<th>
							<label for="confirmPassword">비밀번호&nbsp;확인</label>
						</th>
						<td>
							<input type="password" id="confirmPassword" name="confirmPassword" class="jt-join-user-input" maxlength="16"/>
							<br/>
							<span class="jt-form-invalid jt-join-user-confirmPw" id="confirmPW">비밀번호를&nbsp;동일하게&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.</span>
						</td>
					</tr>
					<tr>
						<th>
							<label for="">성별</label>
						</th>
						<td>
							<form:select path="sex" cssClass="jt-join-user-select">
								<form:option value="">성별을 선택하세요</form:option>
								<form:option value="true">남자</form:option>
								<form:option value="false">여자</form:option>
							</form:select><br/>
							<form:errors path="sex" cssClass="commonError"></form:errors>
						</td>
					</tr>
					<tr>
						<th>
							<label for="confirmPassword">생년월일</label>
						</th>
						<td>
							<form:select path="year" cssClass="jt-join-user-select jt-join-user-select-year">
								<form:option value="">연도</form:option>
								<c:forEach begin="0" end="100" varStatus="loop">
									<form:option value="${jtownUser.nowYear - loop.index }">${jtownUser.nowYear - loop.index }</form:option>	
								</c:forEach>
							</form:select>
							<form:select path="month" cssClass="jt-join-user-select jt-join-user-select-month">
								<form:option value="">월</form:option>
								<c:forEach begin="1" end="12" varStatus="loop">
									<form:option value="${loop.index }">${loop.index }</form:option>
								</c:forEach>
							</form:select>
							<form:select path="day" cssClass="jt-join-user-select jt-join-user-select-day">
								<form:option value="">일</form:option>
								<c:forEach begin="1" end="31" varStatus="loop">
									<form:option value="${loop.index }">${loop.index }</form:option>
								</c:forEach>
							</form:select><br/>
							<form:errors path="year" cssClass="commonError"></form:errors><br/>
							<form:errors path="month" cssClass="commonError"></form:errors><br/>
							<form:errors path="day" cssClass="commonError"></form:errors>
						</td>
					</tr>
				</tbody>
			</table>
			</form:form>
			<footer class="jt-join-user-warning">
				<ul>
					<li>‘FINISH’를&nbsp;누르면&nbsp;<a href="#none">이용약관</a>&nbsp;및&nbsp;<a href="#none">개인정취급방침</a>에&nbsp;동의한&nbsp;것으로&nbsp;간주합니다.</li>
					<li>판매자&nbsp;회원가입은&nbsp;고객센터로&nbsp;문의주시기&nbsp;바랍니다.</li>
				</ul>
			</footer>
		</section>
	</section>
	<%@ include file="../../layout/login.jspf" %>
	<%@ include file="../../layout/script.jspf" %>
</body>
</html>