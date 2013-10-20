<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${order == 1}">
[{
      "content": "<div class='slide_inner'><a class='photo_link' href='http://www.mizon.co.kr/join/mirros.asp?ref=mirros_memb' target='_blank'><img class='photo' src='resources/images/event/banner2.PNG'></a></div>"
},{
      "content": "<div class='slide_inner'><a class='photo_link' href='javascript:jtown.pg.eventBannerOpen(1)'><img class='photo' src='resources/images/event/banner2.PNG'></a></div>"
}]
</c:if>