
define("components/baiduTrends",function(require,exports, module) {



	var baiduTrends = {

		 init:function () {
		 	console.log("baidu trend init");
		    (function(){
		        var hm = document.createElement("script");
		        hm.src = "https://hm.baidu.com/hm.js?0b7ad4bd12bfb5cbbb2bde3cb61b5560";
		        var s = document.getElementsByTagName("script")[0]; 
		        s.parentNode.insertBefore(hm,s);
		    })();

		}

	};

  module.exports = baiduTrends;

})