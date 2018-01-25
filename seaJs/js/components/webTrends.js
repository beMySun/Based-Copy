
define("components/webTrends", ["webTrendCore"], function(require,exports, module) {


	var  webTrendCore = require("webTrendCore");

	console.log(webTrendCore);

	var webTrends = {
		 init:function (obj) {
		 	var self = this;
			self.dcsGetId();
			self.dcsCollect();
		},

		 dcsGetId:function(){
			if (typeof(_tag) != "undefined") {
		     _tag.dcsid="dcs5w0txb10000wocrvqy1nqm_6n1p";
		     _tag.dcsGetId();
		    }
		},

		dcsCollect:function(){
			 if (typeof(_tag) != "undefined") {
		        _tag.DCSext.platform="weimendian";
		        if(document.readyState!="complete"){
		        document.onreadystatechange = function(){
		            if(document.readyState=="complete") _tag.dcsCollect()
		            }
		        }
		        else _tag.dcsCollect()
		    }
		}

	};

  module.exports = webTrends;

})