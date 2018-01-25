/**
 * 配置项目
 *
 */
seajs.config({
	base:"./js/",
	paths: {
       	"seajs": "seajs/2.3.0/sea.js"
    },
	alias:{ 
		"jquery" : "libs/jquery/jquery-1.9.1.min.js",
		"fastClick":"libs/fastclick/fastclick.js",
		"dateUtil" : "components/dateUtil",
		"setDate" : "components/setDate",
		"selectCity":"components/selectCity.js",
		"myLayer" : "components/myLayer.js",
		"validator":"componentsvalidator.js",
		"stroage":"components/stroage",
		"pinYin":"tools/pinYin",
		"commonTools":"tools/commonTools",
		"mobiscrollCoreZh":"libs/mobiscroll/mobiscroll.core-2.5.2-zh.js",
		"mobiscrollCore":"libs/mobiscroll/mobiscroll.core-2.5.2.js",
		"mobiscrollCoredatetimeZh":"libs/mobiscroll/mobiscroll.datetime-2.5.1-zh.js",
		"mobiscrollCoredatetime":"libs/mobiscroll/mobiscroll.datetime-2.5.1.js",
		"layer": "http://cdn.bootcss.com/layer/2.4/layer.js",
		"webTrendCore":"plugins/sdc9_m.js",
		"webTrends":"components/webTrends.js",
		"baiduTrends":"components/baiduTrends.js"
		
	},
	preload: ['jquery','fastClick'],
	map: [
		[".js",".js?1.0"]
	],
	debug:true //值为 true 时，加载器不会删除动态插入的 script 标签。插件也可以根据 debug 配置，来决策 log 等信息的输出。
});