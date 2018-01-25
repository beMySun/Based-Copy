
define("main/newLayer",["jquery","layer"], function(require,exports, module) {

	var layer = require("layer");
    
    var a = require('main/a');
    a.loga("from newLayer");

	var data = " newLayer data";

    var data2 = {

    	dialog: function(msg){
    		//console.log("log a");
    		    layer.open({
				      title: false,
				      content: msg
				   }); 
    	},
        startLoading:function(){
             layer.load(1, {
              shade: [0.3,'#00'] 
            });
        },
        stopLoading:function(){
            layer.close();
        }        

    }

    //return data;
    module.exports = data2;
});
