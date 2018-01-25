
/*
    define define(id?, deps?, factory)

    define 也可以接受两个以上参数。字符串 id 表示模块标识，数组 deps 是模块依赖。比如：

    define('hello', ['jquery'], function(require, exports, module) {

      // 模块代码

    });
    id 和 deps 参数可以省略。省略时，可以通过构建工具自动生成。
*/

/*
 
 config 中指定的路径为./js
 这里定义的模块id ,要在对应的路径
    
*/

define("components/myLayer",["layer"], function(require,exports, module) {

	var layer = require("layer");
    
     console.log(layer);

    var myLayer = {

    	dialog: function(msg){
		    layer.open({
			      title: "提示",
			      content: msg
			   }); 
    	},
        startLoading:function(){
             layer.load(1, {
              shade: [.3,'#000'] 
            });
        },
        stopLoading:function(){
            layer.close(1);
        }    

    }

    //return data;
    module.exports = myLayer;
});
