var ErrWarn = {
	creat:function(){
		var style = 'position: fixed;top: 40%;width: 230px;height: 4rem;background: rgb(250, 250, 250);text-align: center;'
		    +'line-height: 4rem;'
		    +'z-index: 8888;'
		    +'opacity: .9;'
		    +'color: #666;'
		    +'border-radius:3px;'
		    +'border: 1px solid rgb(204, 204, 204);'
		    +'font-size: 1.3rem;',
		div = '<div id="err" class="err" style="display:none;'+style+'"><p class="errMsg" id="errMsg">姓名不能为空</p></div>';
		$("body").append(div);
	},
	warnCenter:function(){
		var width = (parseInt($("body").css('width'))-230)/2+'px';
		$("#err").css('left',width);
	},
	errShow:function(text){
		$("#err").find('p').text(text);
		this.warnCenter();
		$("#err").show();
		this.setTimeOut();
	},
	setTimeOut:function(time){
		setTimeout(function(){$("#err").hide();},3000);
	}
};