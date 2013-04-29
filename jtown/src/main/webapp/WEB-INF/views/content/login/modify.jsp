<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../layout/none_header.jspf" %>
<section class="jt-modify-content-wrap">
	<div id="folderBar">
		<div id="folderTabName">
			<span id="digonalFolderImage">My Page</span>
		</div>
	</div>
	<section class="jt-modify-content">
		<hgroup>
			<h2>비밀번호&nbsp;변경</h1>
			<h1>본인확인을&nbsp;위해&nbsp;본&nbsp;계정의&nbsp;비밀번호를&nbsp;입력해&nbsp;주신&nbsp;후에&nbsp;변경하실&nbsp;비밀번호를&nbsp;입력해&nbsp;주세요.</h1>
		</hgroup>
		
		<c:url var="findPassword" value="/login/findPassword.jt"/>
		<c:url var="modifyUrl" value="/login/modify.jt"/>
		<form:form commandName="jtownUser" method="post" action="${modifyUrl }" htmlEscape="true">
			<sec:authentication property="principal.username" var="username"/>
			<table class="jt-modify-content-table">
				<tfoot>
					<tr>
						<td colspan="2">
							<input type="button" value="비밀번호 변경" class="jt-change-password-btn jt-btn-orange" />	
						</td>
					</tr>
				</tfoot>
				<tbody>
					<tr>
						<th>이메일</th>
						<td><c:out value="${username }"/><form:hidden path="username" value="${username }"/>&nbsp;<a href="<c:url value="/login/modifyEmailAddress"/>">이메일 변경</a></td>
					</tr>
					<tr>
						<th>현재&nbsp;비밀번호</th>
						<td>
							<form:password path="password" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
							<div class="jt-modify-content-error">	
								<form:errors path="password" cssClass="commonError"/>
							</div>
							새로운 비밀번호를 현재 이메일로 전송됩니다.<input type="button" value="보내기" class="jt-findPassword-btn jt-btn-orange"/>
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
		
		<div style="float: left; width: 500px;">
		
			<c:forEach var="providerId" items="${providerIds}">
				<c:set var="connections" value="${connectionMap[providerId]}" />
				<spring:message code="${providerId}.displayName" var="providerDisplayName" />
				<div class="accountConnection">
					<spring:message code="${providerId}.icon" var="iconUrl"/>
					<h4><img src="<c:url value="${iconUrl}" />" width="36" height="36" />${providerDisplayName}</h4>
					
					<p>
					<c:if test="${not empty connections}">
						You are connected to ${providerDisplayName} as ${connections[0].displayName}.
						<c:if test="${providerId eq 'twitter' }">
							<form id="disconnect" action="<c:url value="/connect/twitter" />" method="post">
								<button type="submit">Disconnect</button>	
								<input type="hidden" name="_method" value="delete" />
							</form>
						</c:if>
						<c:if test="${providerId eq 'facebook' }">
							<form id="disconnect" action="<c:url value="/connect/facebook" />" method="post">
								<button type="submit">Disconnect</button>	
								<input type="hidden" name="_method" value="delete" />
							</form>
						</c:if>
					</c:if>
					<c:if test="${empty connections}">
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
					</c:if>
					</p>
				</div>
			</c:forEach>
		
			<c:if test="${socialDuplicate eq true}">
				${socialErrorProviderId }에서 이미 동기화된 아이디 입니다.
			</c:if>
		</div>	
		
	</section>
</section>
<%@ include file="../../layout/none_footer.jspf" %>