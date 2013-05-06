<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../layout/none_header.jspf" %>
<section class="jt-modify-content-wrap">
	<section class="jt-modify-content">
		<ul class="jt-modify-content-header">
			<li>
				<h2>계정&nbsp;설정</h1>
			</li>
			<sec:authorize access="principal.groupName eq 'Customer'">
				<li class="jt-modify-content-disactive-btn">
					<a href="<c:url value='/login/disactive'/>">계정삭제</a>
				</li>
			</sec:authorize>
		</ul>
		
		<%--계정설정 --%>
		<c:url var="modifyUrl" value="/login/modify.jt"/>
		<form:form commandName="jtownUser" method="post" action="${modifyUrl }" htmlEscape="true">
			<table class="jt-modify-content-table">
				<tbody>
					<sec:authorize access="principal.groupName eq 'Customer'">
					<tr>
						<th>이메일</th>
						<td>
							<div class="jt-join-user-vaild-wrap" id="confirmEmail">
								<span class="jt-form-invalid">정확한&nbsp;이메일&nbsp;주소를&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.(ex&nbsp;abcde@abc.com)</span>
							</div>
							<form:input path="username" data-type="create" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
							<div class="jt-modify-content-error">	
								<form:errors path="username" cssClass="commonError"/>
							</div>	
						</td>
					</tr>
					<tr>
						<th>이름</th>
						<td>
							<div class="jt-join-user-vaild-wrap" id="nameLength">
								<span class="jt-form-invalid">이름은&nbsp;20글자&nbsp;이하&nbsp;이어야&nbsp;합니다.</span>
							</div>
							<form:input path="name" data-form="join" cssClass="jt-modify-content-input" maxlength="20" cssErrorClass="jt-modify-content-input-error"/>
							<div class="jt-modify-content-error">	
								<form:errors path="name" cssClass="commonError"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>성별</th>
						<td>
							<form:select path="sex" cssClass="jt-join-user-select" cssErrorClass="jt-join-user-select-error">
								<form:option value="true">남자</form:option>
								<form:option value="false">여자</form:option>
							</form:select>
						</td>
					</tr>
					<tr>
						<th>생년월일</th>
						<td>
							<form:select path="year" cssClass="jt-join-user-select jt-join-user-select-year" cssErrorClass="jt-join-user-select-error jt-join-user-select-year">
								<c:forEach begin="0" end="100" varStatus="loop">
									<form:option value="${jtownUser.nowYear - loop.index }">${jtownUser.nowYear - loop.index }</form:option>	
								</c:forEach>
							</form:select>
							<form:select path="month" cssClass="jt-join-user-select jt-join-user-select-month" cssErrorClass="jt-join-user-select-error jt-join-user-select-month">
								<c:forEach begin="1" end="12" varStatus="loop">
									<form:option value="${loop.index }">${loop.index }</form:option>
								</c:forEach>
							</form:select>
							<form:select path="day" cssClass="jt-join-user-select jt-join-user-select-day" cssErrorClass="jt-join-user-select-error jt-join-user-select-day">
								<c:forEach begin="1" end="31" varStatus="loop">
									<form:option value="${loop.index }">${loop.index }</form:option>
								</c:forEach>
							</form:select>
						</td>
					</tr>
					</sec:authorize>
					<tr>
						<th>현재&nbsp;비밀번호</th>
						<td>
							<c:url value="/login/findPassword" var="findPasswordUrl"/>
							<form:password path="password" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>&nbsp;<a href="${findPasswordUrl }">비밀번호를 모르시나요?</a>
							<div class="jt-modify-content-error">	
								<form:errors path="password" cssClass="commonError"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>새&nbsp;비밀번호</th>
						<td>
							<div class="jt-join-user-vaild-wrap" id="passwordLength">
								<span class="jt-form-invalid">비밀번호는&nbsp;8자&nbsp;이상&nbsp;16자&nbsp;이하&nbsp;이어야&nbsp;합니다.</span>
							</div>
							<form:password path="newPassword" data-form="modify" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
							<div class="jt-modify-content-error">
								<form:errors path="newPassword" cssClass="commonError"></form:errors>
							</div>
						</td>
					</tr>
					<tr>
						<th>새&nbsp;비밀번호&nbsp;재입력</th>
						<td>
							<div class="jt-join-user-vaild-wrap" id="confirmPW">
								<span class="jt-form-invalid" id="confirmPW">비밀번호를&nbsp;동일하게&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.</span>
							</div>
							<input type="password" name="confirmPassword" class="jt-modify-content-input"/>
						</td>
					</tr>
				</tbody>
			</table>
		</form:form>
		
		<%-- Twitter, Facebook 동기화 --%>
		<sec:authorize access="principal.groupName eq 'Customer'">
		<ul class="jt-modfiy-connect-social">
			<c:forEach var="providerId" items="${providerIds}">
				<li>
				<c:set var="connections" value="${connectionMap[providerId]}" />
				<spring:message code="${providerId}.displayName" var="providerDisplayName" />
					<spring:message code="${providerId}.icon" var="iconUrl"/>
					<ul class="jt-modify-connect-social-info">
						<li>
							<img src="<c:url value="${iconUrl}" />" width="36" height="36" />
						</li>
					<c:if test="${not empty connections}">
						<li>
							<span>Login with ${providerDisplayName}</span>
						</li>
						<li>
						<c:if test="${providerId eq 'twitter' }">
							<form id="disconnect" action="<c:url value="/connect/twitter" />" method="post">
								<input type="hidden" name="_method" value="delete" />
								<button type="submit" class="jt-btn-silver">Disconnect</button>	
							</form>
						</c:if>
						<c:if test="${providerId eq 'facebook' }">
							<form id="disconnect" action="<c:url value="/connect/facebook" />" method="post">
								<input type="hidden" name="_method" value="delete" />
								<button type="submit" class="jt-btn-silver">Disconnect</button>	
							</form>
						</c:if>
						</li>
					</c:if>
					<c:if test="${empty connections}">
						<li>
						<c:if test="${providerId eq 'twitter' }">
							<form action="<c:url value="/connect/twitter" />" method="POST">
								<p><button type="submit"><img src="<c:url value="/resources/images/connect-with-twitter.png" />"/></button></p>
								<label for="postTweet"><input id="postTweet" type="checkbox" name="postTweet" checked="checked"/> 친구들에게 Mirros 정보를 Follow 해보세요.</label>
							</form>
						</c:if>
						
						<c:if test="${providerId eq 'facebook' }">
							<form action="<c:url value="/connect/facebook" />" method="POST">
								<input type="hidden" name="scope" value="publish_stream,offline_access,email,user_birthday,user_likes" />
								<p><button type="submit"><img src="<c:url value="/resources/images/connect_light_medium_short.gif" />"/></button></p>
								<label for="postToWall"><input id="postToWall" type="checkbox" name="postToWall" checked="checked"/> 담벼락에 Mirros 정보를 게시해보세요.</label>
							</form>
						</c:if>
						</li>
					</c:if>
					</ul>
				</li>
			</c:forEach>
			<li>
				<c:if test="${socialDuplicate eq true}">
					${socialErrorProviderId }에서 이미 동기화된 아이디 입니다.
				</c:if>
			</li>
		</ul>
		
		<div class="jt-modfiy-submit-wrap">
			<input type="button" value="저장" class="jt-change-user-btn jt-btn-orange" />
		</div>
		
		</sec:authorize>
	</section>
</section>
<%@ include file="../../layout/none_footer.jspf" %>