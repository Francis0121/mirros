<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../layout/none_header.jspf" %>
<div class="jt-statistic-container">
	<div id="folderBar">
		<div id="folderTabName">
			<span id="digonalFolderImage">통계보기</span>
		</div>
	</div>
	<div class="jt-seller-content jt-statistic-content">
		<div class="jt-statistic-title">
			<span>10월 통계</span>
		</div>
		<div id="jt-statistic-graph" class="plot" style="width:930px;height:300px;"></div>
		<!-- 
		<c:forEach items="${percentStatisticList }" var="list">
			sellerPn :${list.sellerPn }<br/>
			todayCount :${list.todayCount }<br/>
			countDate : ${list.countDate }
		</c:forEach>
		 --> 
		<div class="jt-statistic-tip-wrap">
			 <span class="jt-statistic-tip"><b>Tip :</b> 매력적인 상품과 이벤트를 정기적으로 업데이트 해보세요! 보다 높은 유입효과를 볼 수 있습니다.<br/></span>
			<span class="jt-statistic-tip-go"><b>내 쇼핑몰 업데이트하러 가기</b></span>
		</div>
	</div>
	
</div>

<%@ include file="../layout/home_footer.jspf" %>
<script language="javascript" type="text/javascript"><!--
 
s1 = [['2013-10-01',1],['2013-10-02',114],['2013-10-23',2],['2013-10-24',56],['2013-10-25',0],['2013-10-26',0],['2013-10-27',0]];
s2 = [['2013-10-01',51],['2013-10-02',14],['2013-10-03',12],['2013-10-04',6],['2013-10-05',2],['2013-10-06',0],['2013-10-08',0]];
//TODO array list 2
   plot1 = $.jqplot('jt-statistic-graph',[s1,s2],{
	    legend: {
	        show: true,
	        location: 'ne',
	        xoffset: 15
	    },
	   series: [{label: '쇼핑몰의 상품 클릭수'},{label:'상위 20%의 평균 상품 클릭수'}],
       axes: {
           xaxis: {
               renderer: $.jqplot.DateAxisRenderer,
               tickOptions: {
            	   formatString: '%d'
               },
               numberTicks: 7 //TODO arrayLenth
           },
           yaxis: {
               tickOptions: {
                   formatString: '%d'
               }
           }
       },
       highlighter: {
           sizeAdjust: 10,
           tooltipLocation: 'n',
           useAxesFormatters: true,
           formatString: '2013-10-%s, %d회' //TODO date yy and mm
       },
       cursor: {
           show: true
       }
   });
--></script>