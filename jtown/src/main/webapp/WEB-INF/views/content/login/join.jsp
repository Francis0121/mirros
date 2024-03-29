<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/none_header.jspf" %>
<c:set var="social" value="${jtownUser.social }" scope="request"/>
<section class="jt-join-user-wrap">
	<header class="jt-join-user-info">
		<h1>회원가입</h1>
	</header>
	<article class="jt-join-user-article">
	<form:form commandName="jtownUser" action="${cp }/login/joinSubmit.jt" htmlEscape="true" method="post">
	<table class="jt-join-user-table">
		<tbody>
			<tr>
				<th>
					<form:label path="name">이름</form:label>
				</th>
				<td>
					<div class="jt-join-user-vaild-wrap" id="nameLength">
						<span class="jt-form-invalid">이름은&nbsp;20글자&nbsp;이하&nbsp;한글,영문,숫자&nbsp;이어야&nbsp;합니다.</span>
					</div>
					<form:input path="name" data-form="join" cssClass="jt-join-user-input" maxlength="20" cssErrorClass="jt-join-user-input-error"/>
					<div class="jt-join-user-error">
						<form:errors path="name" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<form:label path="username" >이메일</form:label>
				</th>
				<td>
					<div class="jt-join-user-vaild-wrap" id="confirmEmail">
						<span class="jt-form-invalid">정확한&nbsp;이메일&nbsp;주소를&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.(ex&nbsp;abcde@abc.com)</span>
					</div>
					<form:input path="username" htmlEscape="true" data-type="create" cssClass="jt-join-user-input" maxlength="50" cssErrorClass="jt-join-user-input-error"/>
					<div class="jt-join-user-error">
						<form:errors path="username" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<form:label path="password" >비밀번호</form:label>
				</th>
				<td>
					<div class="jt-join-user-vaild-wrap" id="passwordLength">
						<span class="jt-form-invalid">비밀번호는&nbsp;8자&nbsp;이상&nbsp;16자&nbsp;이하&nbsp;이어야&nbsp;합니다.</span>
					</div>
					<form:password path="password" data-form="joinPw" cssClass="jt-join-user-input" maxlength="16" cssErrorClass="jt-join-user-input-error"/>
					<div class="jt-join-user-error">
						<form:errors path="password" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<label for="confirmPassword">비밀번호&nbsp;확인</label>
				</th>
				<td>
					<div class="jt-join-user-vaild-wrap" id="confirmPW">
						<span class="jt-form-invalid">비밀번호를&nbsp;동일하게&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.</span>
					</div>
					<input type="password" id="confirmPassword" name="confirmPassword" class="jt-join-user-input" maxlength="16"/>
				</td>
			</tr>
			<!-- 
			<tr>
				<th>
					<label for="sex">성별</label>
				</th>
				<td>
					<form:select path="sex" cssClass="jt-join-user-select" cssErrorClass="jt-join-user-select-error">
						<form:option value="">성별을 선택하세요</form:option>
						<form:option value="false">여자</form:option>
						<form:option value="true">남자</form:option>
					</form:select>
					<div class="jt-join-user-error">
						<form:errors path="sex" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<label for="confirmPassword">생년월일</label>
				</th>
				<td>
					<form:select path="year" cssClass="jt-join-user-select jt-join-user-select-year" cssErrorClass="jt-join-user-select-error jt-join-user-select-year">
						<form:option value="">연도</form:option>
						<c:forEach begin="0" end="100" varStatus="loop">
							<form:option value="${jtownUser.nowYear - loop.index }">${jtownUser.nowYear - loop.index }</form:option>	
						</c:forEach>
					</form:select>
					<form:select path="month" cssClass="jt-join-user-select jt-join-user-select-month" cssErrorClass="jt-join-user-select-error jt-join-user-select-month">
						<form:option value="">월</form:option>
						<c:forEach begin="1" end="12" varStatus="loop">
							<form:option value="${loop.index }">${loop.index }</form:option>
						</c:forEach>
					</form:select>
					<form:select path="day" cssClass="jt-join-user-select jt-join-user-select-day" cssErrorClass="jt-join-user-select-error jt-join-user-select-day">
						<form:option value="">일</form:option>
						<c:forEach begin="1" end="31" varStatus="loop">
							<form:option value="${loop.index }">${loop.index }</form:option>
						</c:forEach>
					</form:select>
					<div class="jt-join-user-error">
						<form:errors path="year" cssClass="jt-join-date-error"></form:errors>
						<form:errors path="month" cssClass="jt-join-date-error"></form:errors>
						<form:errors path="day" cssClass="jt-join-date-error"></form:errors>
					</div>
				</td>
			</tr>
			-->
		</tbody>
	</table>
	</form:form>
	</article>
	<footer class="jt-join-user-footer">
		<div>
		<button type="button" class="jt-join-submit jt-btn-orange" onclick="jtown.login.joinSubmit()">가입하기</button>
		</div>
		<ul>
			<li>‘가입하기’를&nbsp;누르면&nbsp;<a href="${cp }/individual">이용약관</a>&nbsp;및&nbsp;<a href="${cp }/agreement">개인정보취급방침</a>에&nbsp;동의한&nbsp;것으로&nbsp;간주합니다.</li>
			<li>판매자&nbsp;회원가입은&nbsp;고객센터로&nbsp;문의주시기&nbsp;바랍니다.</li>
		</ul>
	</footer>
</section>
<%@ include file="../../layout/none_footer.jspf" %>