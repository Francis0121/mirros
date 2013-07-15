<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/help_header.jspf" %>
<section class="jt-partnership-section">
	
	<header class="jt-partnership-header">
		<h1>제휴문의</h1>	
<pre>
미러스에서 당신의 쇼핑몰을 보다 쉽게 마케팅 해보세요!
미러스는 위치에 따른 광고비용이 아니며, 사용자들의 평가에 따라 보다 많은 고객을 확보할 수 있습니다.
고객의 쇼핑만큼 여러분의 인터넷 비즈니스도 즐거워야 합니다.    
</pre>	
	</header>
	
	<article class="jt-partnership-article">
		<form:form commandName="partnership" htmlEscape="true" method="post" action="${cp }/help/partnership.jt">
			<table class="jt-partnership-article-table">
				<tbody>
					<tr>
						<th>
							<form:label path="categoryPn">아이템</form:label>
						</th>
						<td>
							<form:select path="categoryPn" htmlEscape="true" cssClass="jt-partnership-select" cssErrorClass="jt-partnership-input-error">
								<form:option value="">아이템&nbsp;분야를&nbsp;선택해주세요</form:option>
								<form:options items="${interest }" itemLabel="name" itemValue="categoryPn"/>
							</form:select>
							<div class="jt-partnership-error">
								<form:errors path="categoryPn"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>
							<form:label path="name">제안자명</form:label>
						</th>
						<td>
							<div class="jt-partnership-wrap" id="nameLength">
								<span class="jt-form-invalid">이름은&nbsp;한글만&nbsp;가능합니다.</span>
							</div>
							<form:input path="name" data-form="partnership" htmlEscape="true" maxlength="10" cssClass="jt-partnership-input" cssErrorClass="jt-partnership-input-error"/>
							<div class="jt-partnership-error">
								<form:errors path="name"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>
							<form:label path="shopName">회사명</form:label>
						</th>
						<td>
							<div class="jt-partnership-wrap" id="shopNameCheck">
								<span class="jt-form-invalid">한글,&nbsp;영문,&nbsp;숫자만&nbsp;가능합니다.</span>
							</div>
							<form:input path="shopName" htmlEscape="true" maxlength="30" cssClass="jt-partnership-input" cssErrorClass="jt-partnership-input-error" />
							<div class="jt-partnership-error">
								<form:errors path="shopName"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>
							<form:label path="shopUrl">홈페이지주소</form:label>
						</th>
						<td>
							<div class="jt-partnership-wrap" id="shopUrlCheck">
								<span class="jt-form-invalid">ex) http://www.homepage.com</span>
							</div>
							<form:input path="shopUrl" htmlEscape="true" maxlength="100" cssClass="jt-partnership-input" cssErrorClass="jt-partnership-input-error" placeholder="ex) http://www.homepage.com"/>
							<div class="jt-partnership-error">
								<form:errors path="shopUrl"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>연락처</th>
						<td>
							<div class="jt-partnership-wrap" id="confirmPhoneNumber">
								<span class="jt-form-invalid">연락처는&nbsp;숫자만&nbsp;입력&nbsp;가능합니다.</span>
							</div>
							<form:input path="phoneNumberSt" htmlEscape="true" maxlength="4" cssClass="jt-partnership-input jt-partnership-select-phone" cssErrorClass="jt-partnership-input-error jt-partnership-select-phone"/>&nbsp;-&nbsp;<form:input path="phoneNumberNd" htmlEscape="true" maxlength="4" cssClass="jt-partnership-input jt-partnership-select-phone" cssErrorClass="jt-partnership-input-error jt-partnership-select-phone"/>&nbsp;-&nbsp;<form:input path="phoneNumberRd" htmlEscape="true" maxlength="4" cssClass="jt-partnership-input jt-partnership-select-phone" cssErrorClass="jt-partnership-input-error jt-partnership-select-phone"/>
							<div class="jt-partnership-error">
								<form:errors path="phoneNumber"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>
							<form:label path="email">이메일</form:label>
						</th>
						<td>
							<div class="jt-partnership-wrap" id="confirmEmail">
								<span class="jt-form-invalid">정확한&nbsp;이메일&nbsp;주소를&nbsp;입력해&nbsp;주시기&nbsp;바랍니다.</span>
							</div>
							<form:input path="email" htmlEscape="true" maxlength="50" cssClass="jt-partnership-input" cssErrorClass="jt-partnership-input-error" placeholder="ex) abc@myemail.com"/>
							<div class="jt-partnership-error">
								<form:errors path="email"/>
							</div>
						</td>
					</tr>
					<tr>
						<th>
							<label for="partnership_content">제안내용</label>
						</th>
						<td>
							<form:textarea path="content" id="partnership_content" htmlEscape="true" maxlength="3000" cssClass="jt-partnership-textarea" cssErrorClass="jt-partnership-textarea-error" placeholder="쇼핑몰 입점을 희망하시거나, 기타 제안내용을 작성하여주세요."/>
							<div class="jt-partnership-error">
								<form:errors path="content"/>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<footer class="jt-partnership-article-footer">
				<ul>
					<li>입력하신&nbsp;정보는&nbsp;상담처리를&nbsp;위한&nbsp;목적으로만&nbsp;사용되며,&nbsp;관련&nbsp;담당자&nbsp;외에는&nbsp;함부로&nbsp;열람할&nbsp;수&nbsp;없습니다.</li>
					<li>‘문의하기’를&nbsp;누르면&nbsp;<a href="#PRIVACY_INFO">개인정보보호를&nbsp;위한&nbsp;동의</a>에&nbsp;동의한&nbsp;것으로&nbsp;간주합니다.</li>
					<li>추가&nbsp;제휴&nbsp;문의사항은&nbsp;<a href="mailto:help@mirros.net">help@mirros.net</a>이나&nbsp;070-7079-2234로&nbsp;연락&nbsp;주시기&nbsp;바랍니다.</li>
					<li style="list-style: none; text-align: center; margin-top: 10px;"><input type="submit" value="문의하기" class="jt-partnership-submit jt-btn-orange"/></li>
				</ul>
			</footer>
		</form:form>
	</article>
	
	<footer class="jt-partnership-footer">		
<pre>
<span style="font-weight: bold; font-family: NanumGothic, Dotum, Gulim;" id="PRIVACY_INFO">미러스는 제휴 제안 사항의 등록 시, 아래와 같이 제안자의 개인정보(기업인 경우 담당자의 정보)를 수집하고 있습니다.</span>
1. 수집 항목 : [필수] 아이템분야, 제안자명, 전화번호, 메일주, 제휴제안내용
2. 수집 및 이용 목적 : 제휴 제안에 따른 연락처 정보 확인
3. 보유 및 이용 기간 : 제휴 제안 사항에 대한 검토 완료 후 3개월 간 보관하며 이후 해당 정보를 지체 없이 파기합니다.
그 밖의 사항은 별도로 고지하는 개인정보처리방침을 참고해 주시기 바랍니다.
</pre>

	</footer>

</section>
<%@ include file="../../layout/help_footer.jspf" %>