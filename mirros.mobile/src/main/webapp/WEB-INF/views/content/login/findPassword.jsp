<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../layout/home-header.jspf" %>
<header class="mm-header">
	<div>
		<a href="${cp }">Mirros</a>
	</div>
</header>
<section id="mm-findpassword-page-section">
	
	<header>
		<h2>아이디/비밀번호 찾기</h2>
	</header>

	<article class="mm-findpassword-page">
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
			<form:form commandName="jtownUser" method="post" action="${cp }/login/findUserPassword.jt" htmlEscape="true">
				<form:input id="username_findPassword" path="username" cssClass="mm-findpassword-input" cssErrorClass="mm-findpassword-input-error" placeholder="Email Address"/>
				<input type="submit" value="보내기" class="mm-btn-orange mm-findpassword-submit-btn"/>
				<div class="mm-findpassword-user-error">
					<form:errors path="username" cssClass="commonError"></form:errors>
				</div>
			</form:form>				
		</section>
	</article>
	
	<article class="mm-findpassword-page">
		<header>
			<div>
				<h1>판매자</h1>
			</div>
	
			<ul>
				<li>Mirros와 제휴하신 고객분들만 사용 가능 합니다.</li>
				<li>Mirros에 제휴문의 할 때 사용하신 email 을 아래에 입력해 주시기 바랍니다.</li>
				<li>아이디와 임의로 생성된 비밀번호가 해당 email 에 제공됩니다.</li>
			</ul>
		</header>
		<section>
			<form:form commandName="sellerUser" method="post" action="${cp }/login/findSellerPassword.jt" htmlEscape="true">
				<form:input id="username_findSellerPassword" path="username" cssClass="mm-findpassword-input" cssErrorClass="mm-findpassword-input-error" placeholder="Email Address"/>
				<input type="submit" value="보내기" class="mm-btn-orange mm-findpassword-submit-btn"/>
				<div class="mm-findpassword-user-error">
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

<c:if test="${result eq 4 }">	
<script>
/* <![CDATA[ */  
    alert('임시 비밀번호를 전송 하였습니다.');

    document.onkeydown = checkKeycode;
	
    function checkKeycode(e) {
		var keycode = 0;
		if (window.event) 
			keycode = window.event.keyCode;
			else if (e) 
				keycode = e.which;
		
	    if (keycode == 116) {
	    	keycode= 2;
	        location.href='${rp}';
	        return false;
	    }else if(e.ctrlKey && (keycode==78 || keycode == 82)){
	    	location.href='${rp}';
	        return false;
	    }
	}
/* ]]> */	            
</script>
</c:if>
<%@ include file="../../layout/home-footer.jspf" %>