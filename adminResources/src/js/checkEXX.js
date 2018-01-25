$(function(){
	var checkTool = {
		getUrlParameters :function(){
			//获取URL中所有的参数，返回一个key-value对象
	        var urlParameters = {};
	        decodeURIComponent(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
	            urlParameters[key] = value;
	        });
	        return urlParameters;
		},
		init : function(){
			var urlP = checkTool.getUrlParameters();
			if(!urlP.flag){
				urlP = JSON.parse(window.sessionStorage.getItem('urlParameters'));
			}
			if(urlP.flag == 'EXX'){
				$(".icon-close").show();
				if(window.location.href.indexOf('orderPayResult.html')>0){
					$("#foot").show();
				};
			}else{
				$(".icon-close").hide();
				$(".title").removeClass('aacc');
				if(window.location.href.indexOf('orderPayResult.html')>0){
					$("#foot").hide();
				};
			}
		}
	};
	checkTool.init();
})