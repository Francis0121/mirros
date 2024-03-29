Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

$.reduceText = function(length, text ){
	text ==null ? text ='' : text;   
	return text.length > length ? text.substring(0,length-1)+'..' : text;  
};

function post(URL, PARAMS) {
	var temp=document.createElement("form");
	temp.action=URL;
	temp.method="POST";
	temp.style.display="none";
	for(var x in PARAMS) {
		var opt=document.createElement("textarea");
		opt.name=x;
		opt.value=PARAMS[x];
		temp.appendChild(opt);
	}
	document.body.appendChild(temp);
	temp.submit();
	return temp;
}

$.formatNumber = function(cr){
	var str = new Array();
	cr = String(cr);
	for(var i=1;i<=cr.length;i++){
		if(i%3){str[cr.length-i]=cr.charAt(cr.length-i);}
		else{str[cr.length-i]=','+cr.charAt(cr.length-i);}
	}
	return str.join('').replace(/^,/,'');
};

$.toast = function(msg){
	$("<div class='jt-toast-wrap'>"+msg+"</div>")
	.css({ display: "block", 
		opacity: 0.90, 
		position: "fixed",
		padding: "7px",
		"text-align": "center",
		width: "270px",
		left: ($(window).width() - 284)/2,
		top: $(window).height()/1.6 })
	.fadeIn( 400 ).appendTo( $.mobile.pageContainer ).delay(1300)
	.fadeOut( 600, function(){
		$(this).remove();
	});
};
$.likeToast = function(msg){
	$("<div class='jt-toast-wrap jt-like-toast-wrap'>"+msg+"</div>")
	.css({ display: "block", 
		position: "fixed",
		padding: '15px 10px',
		"text-align": "center",
		width: "110px",
		left: ($(window).width() - 134)/2,
		top: $(window).height()/2.6 })
	.appendTo( $.mobile.pageContainer ).delay(1500)
	.fadeOut( 600, function(){
		$(this).remove();
	});
};
$.isIOS = function(){
    return (
        (navigator.platform.indexOf("iPhone") != -1) ||
        (navigator.platform.indexOf("iPod") != -1)
    );
};

$.isMobile = function(){
	var filter = "win16|win32|win64|mac";
	 if( navigator.platform  ){
		 if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
			 return true;
		}
	 }
	 return false;
};
