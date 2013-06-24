<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="../../layout/help_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<section class="jt-question-section">
	<header class="jt-question-section-header">
		<h1>1:1 문의</h1>
<pre>
Mirros 이용 중에 불편하거나 보완되어야할 사항이 있나요?
아래에 문의사항을 적어 보내주시면 빠르고 정확하게 답변해드리겠습니다.
</pre>
	</header>
	
	<article class="jt-question-article">
		<header class="jt-question-article-header">
			<h2>사용자</h2>
		</header>
		<article>
			<form:form commandName="cQuestion" method="post" action="${cp }/help/cQuestion.jt">
				<form:hidden path="browser"/>
				<table class="jt-question-article-table">
					<tbody>
						<tr>
							<th><form:label path="name">이름</form:label></th>
							<td>
								<form:input path="name" maxlength="30" cssClass="jt-question-input" cssErrorClass="jt-question-input-error" placeholder="작성하시는 분의 이름을 입력해주세요."/>
								<div class="jt-question-error">
									<form:errors path="name"/>
								</div>
							</td>	
						</tr>
						<tr>
							<th><form:label path="email">Email</form:label></th>
							<td>
								<form:input path="email" maxlength="100"  cssClass="jt-question-input" cssErrorClass="jt-question-input-error" placeholder="연락 받을 이메일을 적어주세요."/>
								<div class="jt-question-error">
									<form:errors path="email"/>
								</div>
							</td>
						</tr>
						<tr>
							<th><form:label path="questionSection.pn">문의분류</form:label></th>
							<td>
								<form:select path="questionSection.pn" cssClass="jt-question-select" cssErrorClass="jt-question-select-error">
									<form:options items="${questionCategoryMap.Customer }" itemLabel="name" itemValue="pn"/>
								</form:select>
							</td>
						</tr>
						<tr>
							<th><form:label path="title">제목</form:label></th>
							<td>
								<form:input path="title" maxlength="100" cssClass="jt-question-input" cssErrorClass="jt-question-input-error" cssStyle="width: 550px;"/>
								<div class="jt-question-error">
									<form:errors path="title"/>
								</div>
							</td>
						</tr>
						<tr>
							<th><form:label path="content">내용</form:label></th>
							<td>
								<form:textarea path="content" maxlength="3000" cssClass="jt-question-textarea" cssErrorClass="jt-question-textarea-error"/>
								<div class="jt-question-error">
									<form:errors path="content"/>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</form:form>
		</article>
		<footer class="jt-question-article-footer">
			<ul>
				<li>'문의하기'버튼을 누르시면 <a href="#PRIVACY_INFO">개인정보 수집 및 이용</a>에 동의하는 것으로 간주합니다.</li>
				<li style="list-style: none; text-align: center; margin-top: 10px;"><button type="button" class="jt-btn-orange jt-cQuestion-btn">문의하기</button></li>
			</ul>
		</footer>
	</article>
	<article class="jt-question-article">
		<header class="jt-question-article-header">
			<h2>판매자</h2>
		</header>
		<article>
			<form:form commandName="sQuestion" method="post" action="${cp }/help/sQuestion.jt">
				<form:hidden path="browser"/>
				<table class="jt-question-article-table">
					<tbody>
						<tr>
							<th><form:label path="shopPn">ShopNo</form:label></th>
							<td>
								<form:input path="shopPn" maxlength="6" cssClass="jt-question-input" cssErrorClass="jt-question-input-error" placeholder="판매자 6자리 번호를 입력해주세요."/>
								<div class="jt-question-error">
									<form:errors path="shopPn"/>
								</div>
							</td>
						</tr>
						<tr>
							<th><form:label path="name">이름</form:label></th>
							<td>
								<form:input path="name" maxlength="30" cssClass="jt-question-input" cssErrorClass="jt-question-input-error" placeholder="작성하시는 분의 이름을 입력해주세요."/>
								<div class="jt-question-error">
									<form:errors path="name"/>
								</div>
							</td>
						</tr>
						<tr>
							<th><form:label path="email">Email</form:label></th>
							<td>
								<form:input path="email" maxlength="100" cssClass="jt-question-input" cssErrorClass="jt-question-input-error" placeholder="연락 받을 이메일을 적어주세요."/>
								<div class="jt-question-error">
									<form:errors path="email"/>
								</div>
							</td>
						</tr>
						<tr>
							<th><form:label path="questionSection.pn">문의분류</form:label></th>
							<td>
								<form:select path="questionSection.pn" cssClass="jt-question-select" cssErrorClass="jt-question-select-error">
									<form:options items="${questionCategoryMap.Seller }" itemLabel="name" itemValue="pn"/>
								</form:select>
							</td>
						</tr>
						<tr>
							<th><form:label path="title">제목</form:label></th>
							<td>
								<form:input path="title" maxlength="100" cssClass="jt-question-input" cssErrorClass="jt-question-input-error" cssStyle="width: 550px;"/>
								<div class="jt-question-error">
									<form:errors path="title"/>
								</div>
							</td>
						</tr>
						<tr>
							<th><form:label path="content">내용</form:label></th>
							<td>
								<form:textarea path="content" maxlength="3000" cssClass="jt-question-textarea" cssErrorClass="jt-question-textarea-error" placeholder="제휴문의는 Business 메뉴를 통해 해주시기 바랍니다."/>
								<div class="jt-question-error">
									<form:errors path="content"/>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</form:form>
		</article>
		<footer class="jt-question-article-footer">
			<ul>
				<li>'문의하기'버튼을 누르시면 <a href="#PRIVACY_INFO">개인정보 수집 및 이용</a>에 동의하는 것으로 간주합니다.</li>
				<li style="list-style: none; text-align: center; margin-top: 10px;"><button type="button" class="jt-btn-orange jt-sQuestion-btn">문의하기</button></li>
			</ul>
		</footer>
	</article>
	
	<footer class="jt-question-section-footer">
<pre>
<span style="font-weight: bold; font-family: NanumGothic, Dotum, Gulim;" id="PRIVACY_INFO">개인정보 수집 및 이용에 대한 안내</span>
(1) 수집하는 개인정보의 항목 및 수집방법
- 수집하는 개인정보의 항목 : 이름, E-mail
- 개인정보수집방법 : 문의 및 상담하려는 이용자가 자발적으로, 구체적으로 기입할 때만 개인정보를 수집합니다.
(2) 개인정보 수집 및 이용목적
- 피플게이트는 수집된 개인정보를 문의 및 상담 요청에 대하여 회신을 하거나 
   회신을 위한 서비스 이용기록 조회를 위하여 활용합니다.
(3) 개인정보의 보유 및 이용기간
- 수집된 이름, E-mail은 관련 법령에 달리 명시되어 있지 않는 한, 문의 처리 후 1년간 보관합니다.
</pre>
	</footer>
</section>
<%@ include file="../../layout/help_footer.jspf" %>