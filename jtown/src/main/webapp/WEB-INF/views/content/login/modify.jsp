<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<%@ include file="../../layout/none_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<section class="jt-account-setting-section">
	<header class="jt-account-setting-section-header">
		<h1>설정</h1>
		<sec:authorize access="principal.groupName eq 'Customer'">
			<c:if test="${registerDate ne null }">
				<span>계정삭제가 진행중인 계정입니다. [ 삭제 예정일 : ${deleteDate } ]</span>
			</c:if>
		</sec:authorize>
	</header>
	
	<%-- 계정 --%>
	<article class="jt-account-setting-article">
		<header class="jt-account-setting-article-header">
			<h2>계정</h2>
		</header>
	<form:form commandName="jtownUser" method="post" action="${cp }/login/modify.jt" htmlEscape="true">		
		<table class="jt-account-setting-article-table">
			<tbody>
				<sec:authorize access="principal.groupName eq 'Customer'">
				<tr>
					<th>이메일</th>
					<td>
						<div class="jt-join-user-vaild-wrap" id="confirmEmail">
							<span class="jt-form-invalid">정확한&nbsp;이메일&nbsp;주소를&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.(ex&nbsp;abcde@abc.com)</span>
						</div>
						<form:input path="username" data-type="create" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/>
						<div class="jt-account-setting-error">	
							<form:errors path="username" cssClass="commonError"/>
						</div>	
					</td>
				</tr>
				<tr>
					<th>이름</th>
					<td>
						<div class="jt-join-user-vaild-wrap" id="nameLength">
							<span class="jt-form-invalid">이름은&nbsp;20글자&nbsp;이하&nbsp;한글,영문,숫자&nbsp;이어야&nbsp;합니다.</span>
						</div>
						<form:input path="name" data-form="join" cssClass="jt-modify-content-input" maxlength="20" cssErrorClass="jt-modify-content-input-error"/>
						<div class="jt-account-setting-error">	
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
				<sec:authorize access="principal.groupName eq 'Seller' or principal.groupName eq 'Administrator'">
				<tr>
					<th>아이디</th>
					<td>
						<div class="jt-join-user-vaild-wrap" id="confirmEmail">
							<span class="jt-form-invalid">아이디는&nbsp;20글자&nbsp;이하&nbsp;한글,영문,숫자&nbsp;이어야&nbsp;합니다.</span>
						</div>
						<form:input path="username" data-type="createId" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error" maxlength="20"/>
						<div class="jt-account-setting-error">	
							<form:errors path="username" cssClass="commonError"/>
						</div>
					</td>
				</tr>
				</sec:authorize>
				<tr>
					<th>현재&nbsp;비밀번호</th>
					<td>
						<form:password path="password" cssClass="jt-modify-content-input" cssErrorClass="jt-modify-content-input-error"/><a href="${cp }/login/findPassword" class="jt-account-setting-findPassword-btn">비밀번호를 모르시나요?</a>
						<div class="jt-account-setting-error">	
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
						<div class="jt-account-setting-error">
							<form:errors path="newPassword" cssClass="commonError"></form:errors>
						</div>
					</td>
				</tr>
				<tr>
					<th>새&nbsp;비밀번호&nbsp;재입력</th>
					<td>
						<div class="jt-join-user-vaild-wrap" id="confirmPW">
							<span class="jt-form-invalid">비밀번호를&nbsp;동일하게&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.</span>
						</div>
						<input type="password" name="confirmPassword" class="jt-modify-content-input"/>
					</td>
				</tr>
			</tbody>
		</table>
	</form:form>
	</article>
	
	
	<%-- Twitter, Facebook 동기화 --%>
	<sec:authorize access="principal.groupName eq 'Customer'">
	<article class="jt-account-setting-article">
		<header class="jt-account-setting-article-header">
			<h2>소셜</h2>
		</header>
		<article class="jt-account-setting-article-social">
		<c:forEach var="providerId" items="${providerIds}">
			<c:set var="connections" value="${connectionMap[providerId]}" />
			<spring:message code="${providerId}.displayName" var="providerDisplayName" />
			<spring:message code="${providerId}.icon" var="iconUrl"/>
			<header class="jt-account-setting-article-social-header">
				<h3><img src="${cp }${iconUrl}" width="30" height="30" alt="${providerDisplayName }"/></h3>
			</header>
			<table class="jt-account-setting-article-table jt-account-setting-article-social-header-table">
				<tbody>
				<c:if test="${not empty connections}">
					<tr>
						<th>${providerDisplayName}으로 로그인 하기</th>
						<c:if test="${providerId eq 'twitter' }">
						<td>
							<form id="disconnect" action="<c:url value="/connect/twitter" />" method="post">
								<input type="hidden" name="_method" value="delete" />
								<button type="submit" class="jt-yes-btn" title="Disconnect"><span>Yes</span></button>	
							</form>
						</td>
						</c:if>
						<c:if test="${providerId eq 'facebook' }">
						<td>
							<form id="disconnect" action="<c:url value="/connect/facebook" />" method="post">
								<input type="hidden" name="_method" value="delete" />
								<button type="submit" class="jt-Yes-btn" title="Disconnect"><span class="jt-Yes-text">Yes</span><span class="jt-Yes-blank">&nbsp;</span></button>	
							</form>
						</td>
						</c:if>
					</tr>
					<tr>
						<th>내 담벼락에 Mirros 소식 남기기</th>
						<td>
							<sec:authentication var="feedBool" property="principal.facebookFeed"/>
							<c:set var="feedValue" value="${feedBool eq true ? 'Yes' : 'No' }"/>
							<form action="<c:url value="/login/modifyFacebookFeed.jt"/>"	method="POST">
								<button type="submit" class="jt-${feedValue }-btn" id="jt-modiy-facebookFeed" title="${feedValue }"><span class="jt-${feedValue }-text">${feedValue }</span><span class="jt-${feedValue }-blank">&nbsp;</span></button>
							</form>	
						</td>
					</tr>
				</c:if>
				<c:if test="${empty connections}">
					<c:if test="${providerId eq 'twitter' }">
					<tr>
						<th>Twitter로 로그인 하기</th>
						<td>
							<form action="<c:url value="/connect/twitter" />" method="POST">
								<button type="submit" class="jt-No-btn"><span class="jt-No-text">No</span><span class="jt-No-blank">&nbsp;</span></button>
							</form>
						</td>
					</tr>
					</c:if>
					<c:if test="${providerId eq 'facebook' }">
					<tr>
						<th>Facebook으로 로그인 하기</th>
						<td>
						<form action="<c:url value="/connect/facebook" />" method="POST">
							<input type="hidden" name="scope" value="publish_stream,offline_access,email,user_birthday,user_likes" />
							<button type="submit" class="jt-No-btn"><span class="jt-No-text">No</span><span class="jt-No-blank">&nbsp;</span></button>
						</form>
						</td>
					</tr>
					</c:if>
				</c:if>
				</tbody>
			</table>
			<footer class="jt-account-setting-article-social-footer">
				<c:if test="${socialDuplicate eq true}">
					${providerDisplayName }에서 이미 연결된 아이디 입니다.
				</c:if>
			</footer>
		</c:forEach>
		</article>
	</article>
	
	</sec:authorize>
	
	<footer class="jt-account-setting-section-footer">
		<ul>
			<li>
				<sec:authorize access="principal.groupName eq 'Customer'">
					<c:choose>
						<c:when test="${registerDate ne null }">
							<button type="button" class="jt-btn-gray jt-disactive-user-btn">계정삭제 취소</button>
						</c:when>
						<c:otherwise>
							<button type="button" class="jt-btn-gray jt-disactive-user-btn">계정삭제</button>
						</c:otherwise>
					</c:choose>
				</sec:authorize>
				&nbsp;
			</li>
			<li>
				<button type="button" class="jt-change-user-btn jt-btn-orange">저장</button>
			</li>
		</ul>
	</footer>
	
	<sec:authorize access="principal.groupName eq 'Customer'">
		<div class="jt-disactive-content" style="${disactiveError ? 'display : block;' : ''}">
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
			<c:choose>
				<c:when test="${registerDate ne null }">	
					<ul>
						<li>등록날짜 : ${registerDate }</li>
						<li>삭제날짜 : ${deleteDate }</li>
					</ul>
					<div>
					<form:form commandName="disactiveUser" action="${cp }/login/disactive.jt" htmlEscape="true" method="delete">
						<form:label path="password">비밀번호</form:label>
						<form:password path="password" cssClass="jt-disactive-input" cssErrorClass="jt-disactive-input-error"/>
						<input type="button" value="취소" class="jt-btn-orange jt-disactive-cancle-btn"/>
						<div class="jt-disactive-content-error">	
							<form:errors path="password" cssClass="commonError"></form:errors>
						</div>
					</form:form>
					</div>
				</c:when>
				<c:otherwise>
					<div>
					<form:form commandName="disactiveUser" action="${cp }/login/disactive.jt" htmlEscape="true">
						<form:label path="password">비밀번호</form:label>
						<form:password path="password" id="disactvice_password" cssClass="jt-disactive-input" cssErrorClass="jt-disactive-input-error"/>
						<input type="button" value="삭제" class="jt-btn-orange jt-disactive-btn"/>
						<div class="jt-disactive-content-error">	
							<form:errors path="password" cssClass="commonError"></form:errors>
						</div>
					</form:form>
					</div>
				</c:otherwise>
			</c:choose>
			</footer>
		</div>	
	</sec:authorize>
	
</section>
<%@ include file="../../layout/none_footer.jspf" %>