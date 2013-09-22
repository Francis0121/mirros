<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home_header.jspf" %>
<style type="text/css">
.jt-pg-main{
	width: 90%; margin:0 auto; position: relative; height: 100%;
}
.jt-pg-large-product{
	margin: 5px;
	width:531px;
	height: 531px;
}
.jt-pg-small-product{
	margin: 5px;
	width:261px;
	height: 261px;
}
.jt-pg-product-line{
	background-color:#fff;
	height: 100%;
}
.jt-pg-product-line img{
	width: 100%;
	height: 100%; 
}
.jt-pg-product-name{
	font-size:13px;
	padding-top:10px;
	color: #fff;
	text-align:center;
	position: absolute;
	bottom:0px;
	width:100%;
	height: 40px;
	background-color: rgba(0,0,0,.5);
	line-height: 130%;
	display: none;
	transition :all 0.3s ease-in;
}
</style>

<div>
<div class="jt-pg-main js-masonry">
	<c:forEach items="${productGatherList }" var="list">
	<c:choose>
		<c:when test="${list.hot ==0}">
			<div class="jt-item jt-pg-small-product">
				<div class="jt-pg-product-line">
					<div>
						<c:if test="${empty list.contentType}">
							<img src="${cp}/resources/uploadImage/${list.saveName }" alt="${list.productName }" />
						</c:if>
						<c:if test="${!empty list.contentType}">
							<img src="${cp}/resources/uploadImage/${list.saveName }.${list.contentType}" alt="${list.productName }" />
						</c:if>
					</div>
					<div class="jt-pg-product-name">
						<div>${list.productName }</div>
						<div>${list.price }</div>
					</div>
				</div>
			</div>
		</c:when>
		<c:otherwise>
			<div class="jt-item jt-pg-large-product">
				<div class="jt-pg-product-line">
					<div>
						<c:if test="${empty list.contentType}">
							<img src="${cp}/resources/uploadImage/${list.saveName }" alt="${list.productName }" />
						</c:if>
						<c:if test="${!empty list.contentType}">
							<img src="${cp}/resources/uploadImage/${list.saveName }.${list.contentType}" alt="${list.productName }" />
						</c:if>
					</div>
					<div class="jt-pg-product-name">
						<div>${list.productName }</div>
						<div>${list.price }</div>
					</div>
				</div>	
			</div>
		</c:otherwise>
	</c:choose>
	</c:forEach>
</div>
<div id="infscr-loading" style="display:none;">
	<center>
		<img alt="Loading..." src="${cp}/resources/images/jt-loading-big.gif" />
	</center>
	Loading...
</div>

</div>
<%@ include file="../layout/home_footer.jspf" %>