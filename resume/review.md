##
自我介绍

// ...

## 介绍你的项目：

# 描述项目－ 移动端H5项目， 主要是展示保险产品， 在保险商城里面展示， 引导用户投保。－...

	#展示亮点：

－ 前后端分离， 项目重构

关键词： 重构

代码优化相关， 使用某些设计模式－ 保单查询 使用状态模式－ 表单校验 使用策略模式－ 提示等通用组件 使用单例模式

－ 模块化开发

关键词： 模块化

requireJS, seaJs(https: //www.zhihu.com/question/20351507)

		RequireJS 和 SeaJS 都是模块化框架的代表， AMD 和 CMD， 是他们各自定义模块化的方式， 大同小异， 主要是代码风格和API不同。

		引申 出 amd, cmd 的优缺点

		amd - async module definition 异步模块定义，

		cmd - common module definition 通用模块定义


		1. 对于依赖的模块， AMD 是提前执行， CMD 是延迟执行。 
		
			不过 RequireJS 从 2.0 开始， 也改成可以延迟执行（ 根据写法不同， 处理方式不同）。
		
		2. AMD 推崇依赖前置(前置依赖)， CMD 推崇就近依赖。

		有一些细节差异， 具体看这个规范的定义就好， 就不多说了。

		AMD | 速度快 | 会浪费资源 | 预先加载所有的依赖， 直到使用的时候才执行.
		
		CMD | 只有真正需要才加载依赖 | 性能较差 | 直到使用的时候才定义依赖


		我觉得CMD是AMD的一种变体， 都是根据commonJS衍生出来的。

		Common Js 是服务端模块的规范， nodeJs 也采用了这个规范。

		根据规范， 一个单独的文件 就是一个模块。 每一个模块都有一个独立的作用域， 也就是说， 在该模块内部定义的变量， 无法被其他模块读取， 除非定义为global对象的属性。

		commonJs 规范加载模块是异步的， 也就是说， 只有加载完成， 才能执行后面的操作。

		amd 规范 加载模块是异步的， 允许指定回调函数。 
		
		nodeJs 主要用于服务器编程， 模块文件一般都已经存在本地硬盘， 所以加载起来比较快。 
		
		如果是浏览器环境， 要从服务端加载模块， 就必须采用非同步的方式， 所以浏览器端一般采用amd规范。

		模块模式通常结合单例模式来使用（ 确保只有一个实例， 并提供全局访问。）

		js 中的单例就是用 对象字面量创建的对象， 对象的属性值可以是数值或者函数， 并且属性值在该对象的生命周期钟不会发生变化。


		1. 使用命名空间；
		var myApp = {

			event: function () {
				// ...
			},

			dom: {
				// ...
			}

		}

		2. 使用闭包封装私有变量。


		var user = (function () {

			var _name = 'kk';
			var _age = '10';

			return {
				getUSerinfo: function () {
					return _name + ' - ' + _age;
				}
			}
		})();


		－ 封装了一些常用的组件 wAlert, wTips

		关键词： 组件


		-
		通用问题：


		--跨域相关

		CORS 是最标准的跨域解决方案。


		--http



		--前端安全

		-
		CSRF

		--前端性能优化

		--XMLHttpRequest

		参考 p225

		--http 状态码

		--catcheControl

		--css 动画原理 逐帧动画

		animation, keyFrames(关键帧)

		--this

		--事件委托

		--session 优化等
		--最熟悉的框架

		能阐述生命周期等。。
		--基础算法

		基础的排序算法和实现

		--三次握手 四次挥手

		--TCP && UDP


		-
		异步编程
		--promise


		－ 性能优化


		-
		其他问题



		－ 长期打算


		-
		库源码：

		_.extend 实现

		$.fn.extend 实现


		一般都是结构化的， 结构化的面试如： 一个页面从输入 URL 到页面加载完的过程中都发生了什么事情？ 你原来做过哪些让你印象深刻的项目？ 用 STAR 面试法来》》 不停追问细节《《。 结构化面试最主要是方便你 能比较。 完毕后会针对性的对 ta 熟悉领域深入询问， 技术点因人而异了。


		一般来说会问如下几方面的问题：

		做过最满意的项目是什么？ 项目背景 为什么要做这件事情？ 最终达到什么效果？ 你处于什么样的角色， 起到了什么方面的作用？ 在项目中遇到什么技术问题？ 具体是如何解决的？ 如果再做这个项目， 你会在哪些方面进行改善？



		一般来说会问如下几方面的问题：

		做过最满意的项目是什么？ 项目背景 为什么要做这件事情？ 最终达到什么效果？ 你处于什么样的角色， 起到了什么方面的作用？ 在项目中遇到什么技术问题？ 具体是如何解决的？ 如果再做这个项目， 你会在哪些方面进行改善？


		技术相关 - 1 面

		技术一面主要判断对基础知识的掌握 描述一个你遇到过的技术问题， 你是如何解决的？ 这个问题很常见， 有没有遇到过很不常见的问题？

		比如在网上根本搜不到解决方法的？ 是否有设计过通用的组件？ 请设计一个 Dialog（ 弹出层） / Suggestion（ 自动完成） / Slider（ 图片轮播）

		等组件你会提供什么接口？ 调用过程是怎样的？ 可能会遇到什么细节问题？ 更细节的问题推荐参考 darcyclarke / Front - end - Developer - Interview - Questions· GitHub


		技术相关 - 2 面

		技术二面主要判断技术深度及广度你最擅长的技术是什么？ 你觉得你在这个技术上的水平到什么程度了？ 你觉得最高级别应该是怎样的？ 浏览器及性能一个页面从输入 URL 到页面加载完的过程中都发生了什么事情？ 越详细越好（ 这个问既考察技术深度又考察技术广度， 其实要答好是相当难的， 注意越详细越好）

		谈一下你所知道的页面性能优化方法？ 这些优化方法背后的原理是什么？ 
		
		除了这些常规的， 你还了解什么最新的方法么？

		如何分析页面性能？ 其它除了前端以外还了解什么其它技术么？ 对计算机基础的了解情况， 比如常见数据结构、 编译原理等


		兴趣相关 最近在学什么？ 接下来半年你打算学习什么？ 做什么方面的事情最让你有成就感？ 需求设计？ 规划？ 具体开发？ 后续想做什么？

		3 年后你希望自己是什么水平？




		你只要能很好说清楚什么是AMD规范， 什么是CommonJs规范， 各自的优缺点是什么就很够了


		【 2017 - 07 - 21】 如何获取浏览器URL中查询字符串的参数？ 另： location对象各属性对应于url哪部分？ 另： assign()、 reload()、 replace() 方法的区别是什么？ http: //www.cnblogs.com/wymninja/p/5716317.html


		【2017 - 08 - 01】 html5 history新增的API有什么用？ ajax可以局部刷新， 但不能修改url， history新增的API可以实现不刷新， 动态修改url。 二者可以配合使用。 另外history新增的API可以实现路由。 http: //www.renfei.org/blog/html5-introduction-3-history-api.html


		##面试经历

		今日头条前端面试题及部分解答

		http: //www.jianshu.com/p/258a2f734a85

		http: //blog.csdn.net/wky_csdn/article/details/71546757



		阿里巴巴：


		你上一个项目都用到了那些方法优化js的性能？ 说一下你对angualr的见解， 说一下项目中你为什么会用angular？ angular的生命周期？ 你个人认为为什么那么多人迷恋angular？ 说一下angular和jQ的区别？ 说一下你对vue和vuex的使用方法？ 手写vue实现一个Vue的一个小效果， 假如...(具体的朋友没说全)？ 说一些什么是高并发， 这些如何处理？ 说一下什么是面向对象？ 手写代码实现 封装、 继承 说一下你对多态的看法 工作这么长时间了， 肯定懂后台吧， 什么是 线程？ ES6你了解哪些？ 你对ES6有什么看法 ?
		说一说关于 Promise 的使用（ 需要手写）



		jQuery $.fn.extend 的实现



		基于观察者模式的事件绑定机制

		用js实现千位分隔符;

		function format(num) {
			var reg = /\d{1,3}(?=(\d{3})+$)/g;
			return (num + '').replace(reg, '$&,');
		}



参考资料：

	https://github.com/markyun/My-blog/tree/master/Front-end-Developer-Questions/Questions-and-Answers



		HTML & CSS： 对Web标准的理解、 浏览器内核差异、 兼容性、 hack、 CSS基本功： 布局、 盒子模型、 选择器优先级、 HTML5、 CSS3、 Flexbox

		JavaScript： 数据类型、 运算、 对象、 Function、 继承、 闭包、 作用域、 原型链、 事件、 RegExp、 JSON、 Ajax、 DOM、 BOM、 内存泄漏、 跨域、 异步装载、 模板引擎、 前端MVC、 路由、 模块化、 Canvas、 ECMAScript 6、 Nodejs

		其他： 移动端、 响应式、 自动化构建、 HTTP、 离线存储、 WEB安全、 优化、 重构、 团队协作、 可维护、 易用性、 SEO、 UED、 架构、 职业生涯、 快速学习能力



		1、 DOM结构—— 两个节点之间可能存在哪些关系以及如何在节点之间任意移动。

		2、 DOM操作—— 如何添加、 移除、 移动、 复制、 创建和查找节点等。

		3、 事件—— 如何使用事件， 以及IE和标准DOM事件模型之间存在的差别。

		4、 XMLHttpRequest—— 这是什么、 怎样完整地执行一次GET请求、 怎样检测错误。

		5、 严格模式与混杂模式—— 如何触发这两种模式， 区分它们有何意义。

		6、 盒模型—— 外边距、 内边距和边框之间的关系， 及IE8以下版本的浏览器中的盒模型

		7、 块级元素与行内元素—— 怎么用CSS控制它们、 以及如何合理的使用它们

		8、 浮动元素—— 怎么使用它们、 它们有什么问题以及怎么解决这些问题。

		9、 HTML与XHTML—— 二者有什么区别， 你觉得应该使用哪一个并说出理由。

		10、 JSON—— 作用、 用途、 设计结构。



		// An internal function for creating assigner functions.

		var createAssigner = function (keysFunc, defaults) {

			return function (obj) {
				var length = arguments.length;

				if (defaults) obj = Object(obj);

				if (length < 2 || obj == null) return obj;

				for (var index = 1; index < length; index++) {
					var source = arguments[index],
						keys = keysFunc(source),
						l = keys.length;
					for (var i = 0; i < l; i++) {
						var key = keys[i];
						if (!defaults || obj[key] === void 0) obj[key] = source[key];
					}
				}
				return obj;
			};
		};

		// Extend a given object with all the properties in passed-in object(s).
		_.extend = createAssigner(_.allKeys);