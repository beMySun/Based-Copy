/**
 * 通用工具类
 */

define("tools/commonTools", [], function(require,exports, module) {

	var commonTools = {

		isWechat:function() {
			return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
		},

		/**
		 * 获取URL参数值
		 */
		getUrlParam:function(name) {
			var reg = new RegExp('(^|&)'+ name + '=([^&]*)(&|$)');
			 var r = window.location.search.substr(1).match(reg);
			 if (r != null)
				return unescape(r[2]);
			 return '';
		},
		/**
		 * 判断是否有引入指定的js或css文件
		 */
		isInclude:function(name) {
			var js= /js$/i.test(name);
		    var resource = document.getElementsByTagName(js ? 'script' : 'link');
		    var length = resource.length;
		    for (var index = 0; index < length; index++) {
		    	if (resource[index][js ? 'src' : 'href'].indexOf(name) != -1)
		    		return true;
		    }
		    return false;
		},
		/**
		 * 异步动态加载js，推荐使用jQuery的getScript方法
		 * @param  name 待加载的js文件，必要的情况需带路径
		 */
		getScript:function(name) {
			var head = document.getElementsByTagName('head').item(0);
		    var script = document.createElement('script');
		    script.type = 'text/javascript';
		    script.src = name;
		    head.appendChild(script);
		}

	};

  module.exports = commonTools;

});







