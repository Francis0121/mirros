<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/home_header.jspf" %>
<style type="text/css">
.jt-pg-main{
	width: 90%; margin:0 auto; position: relative; height: 100%;
}
.jt-pg-item{
	cursor: pointer;
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
.jt-pg-event-line{
/*
	background-image:-webkit-linear-gradient(135deg,#fafafa,#fbfbfb);
	background-image:-moz-linear-gradient(135deg,#fafafa,#fbfbfb);
	background-image:-ms-linear-gradient(135deg,#fafafa,#fbfbfb);
	background-image:-o-linear-gradient(135deg,#fafafa,#fbfbfb);
	background-image:linear-gradient(135deg,#fafafa,#fbfbfb);
	box-shadow: 2px 3px 4px 2px #ccc;
	*/
	border : 1px solid #eee;
	height: 100%;
	line-height: 150%;
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
.jt-pg-product-name div:FIRST-CHILD {
	font-weight: bold;
}
.jt-pg-event-line-event-name-wrap{
	padding-top: 5px;
	padding-left:20px;
	height: 190px;
}
.jt-pg-event-line-event-name{
	padding-top: 30px;
	float:left;
	color:#6e6e6e;
	width: 190px;
	font-size: 15px;
	padding-left: 5px;
	font-weight: bold;
}
.jt-pg-event-line-shop-name{
	color:#bbb;
	padding-left:25px;
	font-size: 15px;
	font-family: NanumGothic;
}
.jt-pg-event-line-end-date{
	color:#6e6e6e;
	padding-left:25px;
	font-family: NanumGothic;
	font-weight: bold;
	font-size: 16px;
}
</style>


<div>
<div class="jt-pg-main js-masonry">
	<c:forEach items="${productGatherList }" var="list">
	<c:choose>
		<c:when test="${list.hot ==0}">
			<div class="jt-pg-item jt-pg-small-product" data-url="${list.url }" data-product-pn="${list.productPn }" data-event-pn="${list.eventPn }">
				<c:if test="${list.productPn == 0 }">
					<div class="jt-pg-event-line">
						<div class="jt-pg-event-line-event-name-wrap">
							<span class="jt-home-expand-shop-event-new-image">NEW</span>
							<div class="jt-pg-event-line-event-name">${list.eventName }</div>
						</div>
						<div class="jt-pg-event-line-shop-name">
							${list.shopName }
						</div>
						<div class="jt-pg-event-line-end-date">
							D - ${list.endDate }일 남았습니다.
						</div>
					</div>
				</c:if> 
				<c:if test="${list.productPn != 0 }">
					<div class="jt-pg-product-line">
					<div>
						<c:if test="${empty list.contentType}">
							<img src="${cp}/resources/uploadImage/${list.saveName }" alt="${list.productName }" />
						</c:if>
						<c:if test="${!empty list.contentType}">
							<img src="${cp}/resources/uploadImage/${list.saveName }.${list.contentType}" alt="${list.productName }" />
						</c:if>
					</div>
					<div class="jt-pg-product-name" >
						<div>${list.productName }</div>
						<div>${list.price }</div>
					</div>
				</div>
				</c:if>
			</div>
		</c:when>
		<c:otherwise>
			<div class="jt-pg-item jt-pg-large-product" data-url="${list.url }" >
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