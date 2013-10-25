<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${order == 1}">
[{
      "content": "<div class='slide_inner'><a class='photo_link' href='http://goo.gl/0xf20A' target='_blank'><img class='photo' src='${pageContext.request.contextPath}/resources/images/event/banner2.jpg'></a></div>"
},{
      "content": "<div class='slide_inner'><a class='photo_link' href='javascript:jtown.pg.eventBannerOpen(1)'><img class='photo' src='${pageContext.request.contextPath}/resources/images/event/drama002.jpg'></a></div>"
}]
</c:if>