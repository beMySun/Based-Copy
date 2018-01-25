
1. 块级元素和行内元素有什么区别，举例常用的块级和行内元素，行内元素有padding／margin吗？
	
	块级元素:

	每个块级元素默认占一行高度，一行内添加一个块级元素后无法一般无法添加其他元素（float浮动后除外）。
	两个块级元素连续编辑时，会在页面自动换行显示。块级元素一般可嵌套块级元素或行内元素；

	块级元素一般作为容器出现，用来组织结构，但并不全是如此。
	有些块级元素，如<form>只能包含块级元素。其他的块级元素则可以包含 行级元素如<P>.也有一些则既可以包含块级，也可以包含行级元素。

	行内元素:

	也叫内联元素、内嵌元素等；行内元素一般都是基于语义级(semantic)的基本元素，只能容纳文本或其他内联元素，常见内联元素 “a”。

	设置宽度width 无效。

	设置高度height 无效，可以通过line-height来设置。

	设置margin 只有左右margin有效，上下无效。

	设置padding 只有左右padding有效，上下则无效。注意元素范围是增大了，但是对元素周围的内容是没影响的。



	display:block
		block元素会独占一行，多个block元素会各自新起一行。默认情况下，block元素宽度自动填满其父元素宽度。
		block元素可以设置width,height属性。块级元素即使设置了宽度,仍然是独占一行。
		block元素可以设置margin和padding属性。

	display:inline
		inline元素不会独占一行，多个相邻的行内元素会排列在同一行里，直到一行排列不下，才会新换一行，其宽度随元素的内容而变化。
		inline元素设置width,height属性无效。
		inline元素的margin和padding属性，水平方向的padding-left, padding-right, margin-left, margin-right都产生边距效果；但竖直方向的padding-top, padding-bottom, margin-top, margin-bottom不会产生边距效果。

	display:inline-block
		简单来说就是将对象呈现为inline对象，但是对象的内容作为block对象呈现。之后的内联对象会被排列在同一行内。比如我们可以给一个link（a元素）inline-block属性值，使其既具有block的宽度高度特性又具有inline的同行特性。


	常见的块级元素有 DIV, FORM, TABLE, P, PRE, H1~H6, DL, OL, UL 等。
	常见的内联元素有 SPAN, A, STRONG, EM, LABEL, INPUT, SELECT, TEXTAREA, IMG, BR 等。




	eg1:

	<!-- 窗口大小500*500，img大小1000*800-->
	  <p>
	    <a><img></a>
	  <p>


	a元素下有一个匿名文本，这个文本外有一个匿名行级盒子，它有的默认vertical-align是baseline的，而且往往因为上文line-height的影响，使它有个line-height，从而使其有了高度。

	因为baseline对齐的原因，这个匿名盒子就会下沉，往下撑开一些距离，所以把a撑高了。

	解决办法一是消除掉匿名盒子的高度，也就是给a设置line-height:0或font-size:0;
	解决办法二是给两者vertical-align:top，让其top对齐，而不是baseline对齐。
	解决办法三是给img以display:block，让它和匿名行级盒子不在一个布局上下文中，也就不存在行级盒的对齐问题。

	其他解决办法也有，但这些都是从根本上解决问题



	首先问a，p宽高 
		a:  1000 * 22;
		p: 	500 * 805
	然后给img加了绝对定位，a，p的宽高 
		a: 0 * 0;
		p: 0 * 0
	然后给p加relative，img加margin-top：30%，margin-left：30%， 
	变成top：30%，left：30% 


	img 脱离文档流之后的包含块 是body , 设置padding: 30% ; 注意参考值是 body 的宽度： 500 ＊ 30% ＝ 150；  ＝ padding : 150px;


2. call,apply,bind的区别，并举例使用的场景


	首先讲讲三者的共同点 
		改变this指向 
		实现继承关系

		apply与call的用法是一致的，只是传参形式上call我们是这样的xxx.call(obj, arg1, arg2,...)

		apply的参数必须要以数组的形式传递xxx.apply(obj, ['arg1', 'arg2', ...])

		bind是以call的形式传参的，但是bind与call、apply最大的区别就是：

		bind绑定this指向并传参后仍然为一个函数，并没有去调用，而call与apply是直接调用函数。

	
	在正常的项目开发中，我们时常会使用各类开源的组件与框架，那么无法避免的会存在一些个性化的需求是原本的组件与框架事先没做到的，这时我们就可以去在使用组件提供的方法时利用bind、call、apply传递我们需要的参数并且在对应事件中做数据结构的处理；

	场景1：某些开源组件提供的函数内会有依赖注入的情况，我们直接将处理好的数据结构抛入依赖注入的函数中，组件便会帮我们完成dom结构的建立，


	先上有  依赖注入 的demo来方便大家理解bind在这个场景中的使用

	function add (arr) {
	  let count = 0;
	  arr.forEach( (val) => count += val );
	  return count;
	}

	function even (num) {
	  let result = num % 2 === 0 ? true:false;
	  return result === true ? '偶数':'奇数';
	}

	function countIsLimit (arr, countFn ,limitNum) {
	  let count = countFn(arr);
	  // 这里你当然可以不用arguments，而选择直接在参数上多写一个参数名，这里我这样用只是为了告诉大家这种场景而已，新增参数名当然更直观。
	  let isEven = arguments[3](count); 
	  let result = count <= limitNum ? '小于或等于限定值': '大于或等于限定值';
	  return count + result + limitNum + '并且是' + isEven;
	}
	let testArr = [1, 2, 3, 4];

	let bindResult = countIsLimit.bind(null, testArr, add, 10, even)
	bindResult(); // 10小于或等于限定值10并且是偶数


	场景2：用别人已经封装好的事件与函数.
	只是需要我们传入新值去判断，实际上这种情况与场景一类似，只是这时我们扮演的是熟悉业务逻辑的人，而不是新增依赖函数的人，这种场景就简单太多了; 


	Math.min.apply(null,[1,2,3])

	上面讲bind、call、apply的运用所用的demo就是例子~


3. 画出一个正方形，并且自适应，列出的方法越多越好


4. 父级元素下面无固定宽高的块元素，实现水平垂直居中	

	https://www.cnblogs.com/ChenChunChang/p/6681744.html


5. 打印输出

	setTimeout(function() {
	  console.log(1)
	}, 0);

	new Promise(function executor(resolve) {
	  console.log(2);
	  for( var i=0 ; i<10000 ; i++ ) {
	    i == 9999 && resolve();
	  }
	  console.log(3);
	}).then(function() {
	  console.log(4);
	});

	console.log(5);


	2，3，5，4，1

6. 
	写出节流函数,并说明在什么场景下使用

		// debounce函数用来包裹我们的事件
		function debounce(fn, delay) {
		  // 持久化一个定时器 timer
		  let timer = null;
		  // 闭包函数可以访问 timer
		  return function() {
		    // 通过 'this' 和 'arguments'
		    // 获得函数的作用域和参数
		    let context = this;
		    let args = arguments;
		    // 如果事件被触发，清除 timer 并重新开始计时
		    clearTimeout(timer);
		    timer = setTimeout(function() {
		      fn.apply(context, args);
		    }, delay);
		  }
		}

		// 当用户滚动时函数会被调用
		function foo() {
		  console.log('You are scrolling!');
		}
		 
		// 在事件触发的两秒后，我们包裹在debounce中的函数才会被触发

		let elem = document.getElementById('container');

		elem.addEventListener('scroll', debounce(foo, 2000));


7. 实现一个bind


	1. 裸函数：

		function bind(fn, obj) {
			return function(){
				fn.apply(obj, arguments);
			}
		}

	
	2. 文档实现：

	 Function.prototype.bind = function(obj) { 

	    if (typeof this !== 'function') {
	      throw {
	      	name: 'TypeError',
	      	message: 'function bind is not exist'
	      }
	    }


	
	var slice = Array.prototype.slice;
	var curried = slice.call(arguments, 1); // 取出bind函数的参数

	 var fn = this,

	 var  fEmpty = function(){};
		
	 var  fBind = function(){

			// 显示的强制绑定 称为硬绑定。 	p95 
			// 会判断硬绑定函数是否被new调用， 是的话就用新创建的this替换硬绑定的this;
			return fn.apply( 
				(
					this instanceOf fEmpty && Obj ? this: Obj
				),
				curried.concat(slice.call(arguments)));

		}
		// 使用硬绑定 可以把this强制绑定到指定的对象（除了使用new的时候），防止函数调用默认绑定规则。 
		// 问题在于会大大降低函数的灵活性。 使用硬绑定之后，就无法使用隐式绑定或者显式绑定来修改this.
		
		 // 维护原型关系

		fEmpty.prototype = this.prototype;
		fBind.prototype = new fEmpty();
		

		===========================================
		或者： 软绑定

		var fBind = function(){

			return fn.apply(
				(!this || this === (window || global)) ? 
					obj : this, 
				args.concat(slice.call(arguments)));
			)
		} 

		fBind.prototype =  Object.create(method.prototype);

		====================


	return fBind;

}
	
	es6 的箭头函数 是根据当前的词法作用域来决定this， 具体来说， 箭头函数会继承外层函数调用的this 绑定。 这个 self = this 机制是一样的。


	var first_object = { 
		num: 42 
	}; 


	function multiply(mult) { 
		return this.num * mult; 
	} 

	var first_multiply = multiply.bind(first_object); 
	first_multiply(5); // 210


	bind 可以对参数进行珂里化。



8. 	new 操作：

	构造一个新对象
	执行[[Prototype]] 连接
	将新对象绑定到函数调用的this
	如果函数没有返回其它对象，那么new表达式中的函数调用会自动返回这个新对象


	var obj  = {}

	obj._proto_ = Base.prototype;

	Base.call(obj);

	

