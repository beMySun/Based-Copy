;(function(){
	var app = {
		init: function() {
			this.checkActivityRule();
			this.closeRuleArea();
			this.ruleShowCenter();
			var urlParameters = app.getUrlParameters();
			this.getActivityTimeAndKeyCode(urlParameters);
			$('.go-back').on('click', function() {
				window.location.href = window.location.href.indexOf('test')>0?'https://jinling-dmzstg1.pa18.com:1009/SMTResourceNew/esalesPro/life/modules/easyShop/index.html':'https://jinling.pa18.com/SMTResourceNew/esalesPro/life/modules/easyShop/index.html';
			});
		},
		checkActivityRule: function() {
			$('body').on('click', '.rule-img', function() {
				$('#mask').show();
			});
		},
		nonProductKeyCodeJson: function(urlParameters) {
			var as = $('.buy-product a');
			var len = as.length;
			for (var i=0; i<len; i++) {
				$(as[i]).attr('href',$(as[i]).attr('href') + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || ''));
			};
		},
        getUrlParameters: function() {
             var urlParameters = {};
             decodeURIComponent(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                 urlParameters[key] = value;
             });
             return urlParameters;
         },
		getActivityTimeAndKeyCode: function(urlParameters) {
			$.ajax({
				url: '/icp_core_dmz/web/activityTime.json',
                type: 'get',
                data: '',
                success: function(res) {
                	var res = typeof res === 'object' ? res : JSON.parse(res);
                    if (res.code === '00') {
                    	var startTime = app.getYearAndMonthAndDay($.trim(res.activityTime.startTime));
                    	var endTime = app.getYearAndMonthAndDay($.trim(res.activityTime.endTime))
                        $('#have').text(startTime.notHaveYear + '-' + endTime.notHaveYear);
                        $('#noHave').text(startTime.notHaveYear + '-' + endTime.notHaveYear);
                        $('#ruleActivityTime').text(startTime.haveYear + '-' + endTime.haveYear);
                        app.isGiftAward();
                        app.linkProductUrl(res.productKeyCode, urlParameters);
                    } else {
                        alert(res.msg);
                    };
                },
                error: function() {
                    alert('网络出错，请稍后再试');
                }
			})
		},
		linkProductUrl: function(productKeyCode, urlParameters) {
			if (!productKeyCode) {
				console.log('配置的keyCode不存在');
				app.nonProductKeyCodeJson(urlParameters);
			} else {
				$('.jcb').attr('href','/icp/adminResources/src/productDetail.html?keyCode=' +productKeyCode.jcb + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || ''));
				$('.crbz').attr('href','/icp/adminResources/src/productDetail.html?keyCode=' +productKeyCode.crbz + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || '') );
				$('.znbz').attr('href','/icp/adminResources/src/productDetail.html?keyCode=' +productKeyCode.znbz + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || '') );
				$('.gzk').attr('href','/icp/adminResources/src/productDetail.html?keyCode=' +productKeyCode.gzk + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || '') );
				$('.aqtx').attr('href','/icp/adminResources/src/productDetail.html?keyCode=' +productKeyCode.aqtx + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || '') );
				$('.scwpbz').attr('href','/icp/adminResources/src/productDetail.html?keyCode=' +productKeyCode.scwpbz + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || '') );
				$('.cwzr').attr('href','/icp/adminResources/src/productDetail.html?keyCode=' +productKeyCode.cwzr + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || '') );
				$('.jzz').attr('href','/icp/adminResources/src/productDetail.html?keyCode=' +productKeyCode.jzz + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || '') );
				$('.sews').attr('href','/icp/adminResources/src/productDetail.html?keyCode=' +productKeyCode.sews + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || '') );
				$('.gaxyh').attr('href','/icp/adminResources/src/productDetail.html?keyCode=' +productKeyCode.gaxyh + '&flag=EXX&agentNo=' + (urlParameters.agentNo || '') + '&ciph=' + (urlParameters.ciph || '') );
			}
		},
		getYearAndMonthAndDay: function(date) {
			var time = new Date(date.replace(/-/g,'/'));
			var obj = {};
			obj.notHaveYear = (time.getMonth()+1) + '月' + time.getDate() + '日';
			obj.haveYear = time.getFullYear() + '年' + (time.getMonth()+1) + '月' + time.getDate() + '日';
			return obj;
		},
		isGiftAward: function() {
			var url = '/icp/activity/getTotalActivityAward.do';
			$.ajax({
				url: url,
                type: 'post',
                data: '',
                success: function(res) {
                	var res = typeof res === 'object' ? res : JSON.parse(res);
                    if (res.resultCode === '00') {
                        if(!res.total.total) {
                        	$('.activity-time').hide();
                        	$('.prize-area').css('height', '96%');
                        	$('.activity-time-end').show();
                        };
                    } else {
                        alert(res.resultMsg);
                    };
                   	$('.loading').hide();
                },
                error: function() {
                    alert('网络出错，请稍后再试');
                }
			});
		},
		closeRuleArea: function() {
			$('body').on('click', '.hide-rule', function() {
				$('#mask').hide();
			});
		},
		ruleShowCenter: function() {
			var left = (parseInt($('body').css('width'))-294)/2+'px';
			$('.rule-show-area').css('left',left);
		}
	};
	app.init();
})();