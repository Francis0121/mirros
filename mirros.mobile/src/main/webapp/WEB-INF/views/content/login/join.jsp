<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/home-header.jspf" %>
<header class="mm-header">
	<div>
		<a href="${cp }">Mirros</a>
	</div>
</header>
<section class="mm-join-user-wrap">
	<header class="mm-join-user-info">
		<h1>회원가입</h1>
	</header>
	<article class="mm-join-user-articel">
	<form:form commandName="jtownUser" action="${cp }/login/joinSubmit.jt" htmlEscape="true" method="post">
	<table class="mm-join-user-table">
		<tbody>
			<tr>
				<th>
					<form:label path="name">이름</form:label>
				</th>
			</tr>
			<tr>
				<td>
					<form:input path="name" data-form="join" cssClass="mm-join-user-input" maxlength="20" cssErrorClass="mm-join-user-input-error" placeholder="이름은 20글자 이하 한글,영문,숫자 이어야 합니다"/>
					<div class="mm-join-user-error">
						<form:errors path="name" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<form:label path="username" >이메일</form:label>
				</th>
			</tr>
			<tr>
				<td>
					<form:input path="username" htmlEscape="true" data-type="create" cssClass="mm-join-user-input" maxlength="50" cssErrorClass="mm-join-user-input-error" placeholder="ex) abcde@youremail.net"/>
					<div class="mm-join-user-error">
						<form:errors path="username" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<form:label path="password" >비밀번호</form:label>
				</th>
			</tr>
			<tr>	
				<td>
					<form:password path="password" data-form="joinPw" cssClass="mm-join-user-input" maxlength="16" cssErrorClass="mm-join-user-input-error" placeholder="비밀번호는 8자 이상 16자 이하 이어야 합니다."/>
					<div class="mm-join-user-error">
						<form:errors path="password" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<label for="confirmPassword">비밀번호&nbsp;확인</label>
				</th>
			</tr>
			<tr>	
				<td>
					<input type="password" id="confirmPassword" name="confirmPassword" class="mm-join-user-input" maxlength="16" placeholder="비밀번호와 동일하게 입력해 주시기 바랍니다."/>
				</td>
			</tr>
			<tr>
				<th>
					<label for="sex">성별</label>
				</th>
			</tr>
			<tr>	
				<td>
					<form:select path="sex" cssClass="mm-join-user-select" cssErrorClass="mm-join-user-select-error">
						<form:option value="">성별을 선택하세요</form:option>
						<form:option value="true">남자</form:option>
						<form:option value="false">여자</form:option>
					</form:select>
					<div class="mm-join-user-error">
						<form:errors path="sex" cssClass="commonError"></form:errors>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<label for="confirmPassword">생년월일</label>
				</th>
			</tr>
			<tr>	
				<td>
					<form:select path="year" cssClass="mm-join-user-select mm-join-user-select-year" cssErrorClass="mm-join-user-select-error mm-join-user-select-year">
						<form:option value="">연도</form:option>
						<c:forEach begin="0" end="100" varStatus="loop">
							<form:option value="${jtownUser.nowYear - loop.index }">${jtownUser.nowYear - loop.index }</form:option>	
						</c:forEach>
					</form:select>
					<form:select path="month" cssClass="mm-join-user-select mm-join-user-select-month" cssErrorClass="mm-join-user-select-error mm-join-user-select-month">
						<form:option value="">월</form:option>
						<c:forEach begin="1" end="12" varStatus="loop">
							<form:option value="${loop.index }">${loop.index }</form:option>
						</c:forEach>
					</form:select>
					<form:select path="day" cssClass="mm-join-user-select mm-join-user-select-day" cssErrorClass="mm-join-user-select-error mm-join-user-select-day">
						<form:option value="">일</form:option>
						<c:forEach begin="1" end="31" varStatus="loop">
							<form:option value="${loop.index }">${loop.index }</form:option>
						</c:forEach>
					</form:select>
					<div class="mm-join-user-error">
						<form:errors path="year" cssClass="mm-join-date-error"></form:errors>
						<form:errors path="month" cssClass="mm-join-date-error"></form:errors>
						<form:errors path="day" cssClass="mm-join-date-error"></form:errors>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
	</form:form>
	</article>
	<footer class="mm-join-user-footer">
		<div>
			<button type="button" class="mm-join-submit mm-btn-orange">가입하기</button>
		</div>
		<ul>
			<li>‘가입하기’를&nbsp;누르면&nbsp;<a href="${cp }/individual">이용약관</a>&nbsp;및&nbsp;<a href="${cp }/agreement">개인정보취급방침</a>에&nbsp;동의한&nbsp;것으로&nbsp;간주합니다.</li>
			<li>판매자&nbsp;회원가입은&nbsp;고객센터로&nbsp;문의주시기&nbsp;바랍니다.</li>
		</ul>
	</footer>
</section>
<%@ include file="../../layout/home-footer.jspf" %>