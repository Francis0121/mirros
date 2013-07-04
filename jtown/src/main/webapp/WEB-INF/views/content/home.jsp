<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%
String ua=request.getHeader("User-Agent").toLowerCase();
if(ua.matches("(?i).*((android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino).*")||ua.substring(0,4).matches("(?i)1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-")) {
  response.sendRedirect("http://m.mirros.net");
  return;
}
%>
<%@ include file="../layout/home_header.jspf" %>
<c:set var="cp" value="<%=request.getContextPath() %>"/>
<div id="jt-home-container">
	<c:forEach begin="1" end="2" varStatus="loop">
		<c:if test="${loop.count eq 1 }">
			<c:set var="jtownUsers" value="${one.jtownUsers }"/>
			<c:set var="images" value="${one.images }"/>
		</c:if>
		<c:if test="${loop.count eq 2 }">
			<c:set var="jtownUsers" value="${two.jtownUsers }"/>
			<c:set var="images" value="${two.images }"/>
		</c:if>
		<c:forEach items="${jtownUsers }" var="seller">
			<c:set value="${seller.pn }" var="spn"/>
			<c:if test="${spn ne 0 and spn ne null }">
			<c:set value="${images[spn] }" var="mainImages"/>
			<div class="jt-home-shop" id="jt-home-shop-<c:out value="${spn }"/>" data-spn="<c:out value="${spn }"/>">
				<header>
					<a href="http://<c:out value="${seller.shopUrl }"/>" target="_blank" onclick="jtown.home.goHome('<c:out value="${spn }"/>')"><c:out value="${seller.name }"/></a>
				</header>
				<div class="jt-home-shop-content">
					<ul class="jt-home-shop-content-image">
						<li>
							<c:choose>
								<c:when test="${fn:length(mainImages) eq 0 }">
									<img alt="blank" src="${cp }/resources/images/jt-introduce-home-blank.png" title="${jtownUser.name}"/>	
								</c:when>
								<c:otherwise>	
									<c:forEach items="${mainImages }" var="mainImage">
										<img alt="" src="${cp }/resources/uploadImage/${mainImage}" title="${jtownUser.name}"/>	
									</c:forEach>
								</c:otherwise>
							</c:choose>
							<div class="jt-home-shop-new-event">
								<c:set var="newBannerStyle" value="${seller.newBanner ? 'display: block;' : 'display:none;'}"></c:set>
								<c:set var="newProductStyle" value="${seller.newProduct > 0 ? 'display: block;' : 'display:none;'}"></c:set>
								
								<div id="new-product-<c:out value="${seller.pn }"/>" class="jt-home-shop-new-event-div" style="${newProductStyle}">
									<span class="jt-home-shop-product-new-image">New product</span>
								</div>
								
								<div id="new-<c:out value="${seller.pn }"/>"  class="jt-home-shop-new-event-div" style="${newBannerStyle}">
									<span class="jt-home-shop-event-new-image">New event</span>														
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="jt-home-notice">
					<span class="jt-home-shop-footer-firstQuotationMark"></span>
					<pre class="jt-home-shop-footer-text"><c:out value="${seller.notice }"/></pre>
					<span class="jt-home-shop-footer-lastQuotationMark"></span>
				</div>
				<ul class="jt-home-shop-content-fn">
					<li>
						<span class="jt-home-shop-view" title="최근 일주일간 방문수" >VIEW</span>&nbsp;<span id="view-<c:out value="${spn }"/>"><c:out value="${seller.viewCount eq null ? 0 : seller.viewCount}"/></span>	
					</li>
					<li>
						<span class="jt-home-shop-comment">COMMENT</span>&nbsp;<span id="comment-<c:out value="${spn }"/>"><c:out value="${seller.commentCount eq null ? 0 : seller.commentCount}"/></span>
					</li>
					<li>
						<c:set var="loveClick" value="${seller.customerPn ne null ? 'jt-home-shop-love-click' : '' }"/>
						<c:set var="loveTextClick" value="${seller.customerPn ne null ? 'jt-home-shop-love-text-click' : '' }"/>
						<div class="jt-heart-click-wrap">
							<div class="jt-heart-click-background" id="jt-heart-click-<c:out value="${spn }"/>">
								<img alt="heart-background" src="${cp}/resources/images/heart-background.png">
							</div>
							<div class="jt-heart-click">
								<a href="#none" 
									onclick="jtown.home.clickLove('<c:out value="${spn }"/>');" 
									id="love-image-<c:out value="${spn }"/>" 
									class="jt-home-shop-love ${loveClick }">♥</a>
							</div>
						</div>
						<div class="jt-home-shop-content-love-text-wrap">
							<span id="love-<c:out value="${spn }"/>" class="${loveTextClick}"><c:out value="${seller.loveCount eq null ? 0 : seller.loveCount}"/></span>
							<c:if test="${seller.loveHotCount ne null and seller.loveHotCount ne 0}">
							<span class="jt-home-shop-love-hot" title="최근 뜨는 미니샵">HOT</span>
							</c:if>
						</div>
					</li>
				</ul>
				<!--[if IE 7]>
				<div class="jt-home-shop-image-footer"></div>
				<![endif]-->
				<!--[if IE 8]>
				<div class="jt-home-shop-image-footer"></div>
				<![endif]-->
			</div>
			</c:if>	
		</c:forEach>
	</c:forEach>
</div>
<%@ include file="../layout/home_footer.jspf" %>