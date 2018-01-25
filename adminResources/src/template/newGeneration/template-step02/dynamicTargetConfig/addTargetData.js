;(function() {
	'use strict';
	var addTarget = {
		renderTargetData: function() {
			var submit = window.tool.getSessionStorage('submit');
			// var submit = {};
			var url = '/icp/gatePostWay.do';
			var data = {
				serviceId: 'QUERY_DYNAMIC_TARGET_ELEMENT',
				requestBody: {
					productId: submit.productId || '1d82b99dd5bf4119add176b1b81fbad5',
					planIds: submit.planIds || '1812e1a152c14eaf95ae12e50b7bd80a,1812e1a152c14eaf95ae12e50b7bd801'
				}
			};
			$.ajax({
	            type: 'post',
	            url: url,
	            contentType: 'application/json; charset=UTF-8',
	            data: JSON.stringify(data),
	            success: function(data) {
	            	data = typeof(data) === 'string' ? JSON.parse(data) : data;
	            	console.log(data);
	            	if (data.resultCode === '00') {
	            		var elementShow = data.elementInfoList
	            		if (!elementShow.length) {
							return;
						}
						var eleObj = {};
						var targetArr = [];
						var len = elementShow.length;
						if (len !== 0) {
							for (var i=0; i<len; i++) {
								targetArr[+elementShow[i].elementPosition - 1] = elementShow[i];
							};
							eleObj.targetArr = targetArr;
							window.sessionStorage.setItem('eleObj', JSON.stringify(eleObj));
							addTarget.insetDom(targetArr);
						}
	            	} else {
	            		window.wAlert('系统繁忙，请稍后再试');
	            	}
	            },
	            error: function(err) {
	                console.log(err);
	                window.wAlert('网络出错，请稍后再试');
	            },
	            complete: function() {
                	$(".loading").hide();
                }
	            
	        })
			
		},
		insetDom: function(arr) {
			var len = arr.length;
			var ulStr = '<section><h2 class="section-title">标的信息</h2><ul class="section-body-ul target-ul" id="target" data-order="">';
			var liStr = '';
			for (var i=0; i<len; i++) {
				liStr += this.switchType(arr[i]);
			};
			ulStr += liStr + '</ul><section>';
			$('#insurantInfo').after(ulStr);
			this.getScript('iconMethod');
			$('#target').find('li').eq(len-1).addClass('no-border-bottom');
		},
		switchType: function(obj) {
			var type = obj.elementTypeName;
			var domStr = '';
			var iconStr = '';
			if (!!obj.elementIconContent) {
				iconStr = '<span class="icon"><i style="background-image:url('+ obj.elementIconContent +')"></i></span>';
			};
			switch (type) {
				case 'input' :
					domStr = '<li>'
	                    	+'<div class="form-group">'
	                        +'<p class="form-group-label">'
	                            + iconStr + ''
	                            + obj.elementName
	                        +'</p>'
	                        +'<label>'
	                            +'<input type="text" data-method="'+obj.methodName+'" data-name="'+ obj.elementName +'" class="form-control target-dom '+obj.elementKey+'" placeholder="必填">'
	                        +'</label>'
	                    +'</div>'
	                +'</li>';
                break;
                case 'select' :
	                domStr = '<li>'
	                    +'<div class="form-group form-group-select">'
	                        +'<p class="form-group-label">'
	                            + iconStr + ''
	                            + obj.elementName
	                        +'</p>'
	                        +'<label>'
	                            +'<select data-method="'+obj.methodName+'" class="form-control form-control-select target-dom '+obj.elementKey+'"  data-name="'+ obj.elementName +'" >'
	                                
	                            +'</select>'
	                        +'</label>'
	                    +'</div>'
	                +'</li>';
	                break;
	            default: 
	            	domStr = '<li>'
	                    	+'<div class="form-group">'
	                        +'<p class="form-group-label">'
	                            + iconStr + ''
	                            + obj.elementName
	                        +'</p>'
	                        +'<label>'
	                            +'<input data-method="'+obj.methodName+'" type="text" data-name="'+ obj.elementName +'" class="form-control target-dom '+obj.elementKey+'" placeholder="必填">'
	                        +'</label>'
	                    +'</div>'
	                +'</li>';
			};
			this.getScript(obj.methodName, obj.elementTypeName, obj.elementKey);
			return domStr;
		},
		getScript: function(url, typeName, key) {
      		if (!!url) {
	          	url = 'js/plugin/' + url + '.js';
	          	var body = document.getElementsByTagName('body')[0];
	          	var js = document.createElement('script');
	          	js.setAttribute('type', 'text/javascript');
	          	js.setAttribute('src', url);
	          	body.appendChild(js);
	        //   	var dom = $('.' + key);
	      		// window.tool.dynamicallyCallPlugin(url, dom);
	      	};

	      
    }    
     
	};
	addTarget.renderTargetData();
})();