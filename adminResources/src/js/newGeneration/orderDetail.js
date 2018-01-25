(function(){
	var $err = $("#err"),
	    $input = $("#numInput"),
	    $name = $("#giveName"),
	    $mobile = $("#linkMobile"),
	    $email = $("#linkEmail");
	    var policyNo = window.sessionStorage.getItem('policyNo');
	    var urlParams = JSON.parse(window.sessionStorage.getItem('urlParameters'))||{};
	var OrderDetail = {
		init: function() {
			ErrWarn.creat();
			this.plus();
			this.minus();
			this.inputChange();
			this.goToGive();
			this.cancel();
			this.give();
			$(".icon-close").on('click',function(){
		    	window.location.href = './productList.html?agentNo='+urlParams.agentNo+'&ciph='+urlParams.ciph+'&flag='+urlParams.flag;
		    });
		    $(".go-back").on('click',function(){
		    	window.history.back(-1);
		    });
			var urlP = OrderDetail.getUrlParameters();
			//判断是否是寿险E行销
            if(urlParams.flag == 'EXX'){
                var agentNo = urlP.agentNo?urlP.agentNo:'';
                var ciph = urlP.ciph?urlP.ciph:'';
                var url = '/icp/validateExxUserInfo.do';
                $.ajax({
                    url: url,
                    type: 'post',
                    data: {
                        applySelfCardSourceNo: agentNo,
                        ciph:ciph
                    },
                    success: function(res) {
                    	var res = typeof res === 'object' ? res : JSON.parse(res);
                        if (res.code === '00') {
                            OrderDetail.getAjaxData(urlParams, urlP);
                        } else {
                            alert(res.msg);
                        }
                    },
                    error: function() {
                        alert('网络出错，请稍后再试');
                    }
                })
            }else{
                OrderDetail.getAjaxData(urlParams, urlP);
            }
		},
		getUrlParameters: function() {
            var urlParameters = {};
            decodeURIComponent(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                urlParameters[key] = value;
            });
            return urlParameters;
        },
		getAjaxData: function(urlParams, urlP) {//查询接口
			var url = '/icp/selfCardQueryRecord.do';
			$.ajax({
				url: url,
                type: 'post',
                data: {
                	applySelfCardSourceNo:urlParams.agentNo,
                    policyNo: policyNo
                },
                success: function(res) {
                	var res = typeof res === 'object' ? res : JSON.parse(res);
                    if (res.code === '00') {
                    	var trs = '';
                        $("#policyNo").text(res.policyNo);
                        $("#productName").text(res.planName);
                        $("#haveNum").text(res.cardNum);
                        $("#premium").text(res.amount);
                        if(res.validCardNum == '0'){
                        	$("#goToGive").css({'border':'1px solid #aaa','color':'#aaa'});
                        };
                        $("#okGiveNum").text(res.validCardNum);
                        for(var i=0;i<res.givePersonList.length;i++){
                        	trs += '<tr><td>'+res.givePersonList[i].name+'</td><td>'+res.givePersonList[i].giveNum+'</td></tr>'
                        };
                        $("#detail-tbody").html(trs);
                        OrderDetail.judgeActivityTimeStatus(urlP);
                        $(".loading").hide();
                    } else {
                        alert(res.msg);
                    };
                },
                error: function() {
                    alert('网络出错，请稍后再试');
                }
			});
		},
		minus: function() {
			var _that = this;
			$("#minus").on('click',function(){
				var num;
				if($input.val() == '1'){
					$input.val(1);
					ErrWarn.errShow('至少1份');
					return false;
				}else{
					num = parseInt($input.val())-1;
					$input.val(num);
				}
			})
		},
		plus: function() {
			var _that = this;
			$("#plus").on('click',function(){
				var okNum = parseInt($('#okGiveNum').text());
				var num = parseInt($input.val())+1;
				if(num > okNum){
					ErrWarn.errShow('最多'+okNum+'份');
					return false;
				}
				$input.val(num);
			})
		},
		inputChange: function() {
			var _that = this;
			// input propertychange
			$input.on("change",function() {
				var num = parseInt($input.val());
				var okNum = parseInt($('#okGiveNum').text());
				if (num == 0 || num<=0 || $input.val() == '') {
					$input.val('1');
					return false;
				} else if(num >= okNum){
					$input.val(okNum);
					return false;
				}
			});
		},
		checkData: function() {
			var _that = this;
			if($.trim($name.val()) == ''){
				ErrWarn.errShow('姓名不能为空');
				return false;
			};
			if($input.val() == '0' || parseInt($input.val())<0 || $input.val() == ''){
				$input.val('1');
				ErrWarn.errShow('赠送数量至少1份');
				return false;
			};
			if($mobile.val() == ''){
				ErrWarn.errShow('手机号码不能为空');
				return false;
			};
			if(!validate.checkMobile($mobile.val(),$err.find('p'))){
				ErrWarn.errShow('手机号码格式不正确');
				return false;
			};
			if($email.val() == ''){
				ErrWarn.errShow('邮箱不能为空');
				return false;
			}
			if(!validate.checkEmail($email.val(),$err.find('p'))){
				ErrWarn.errShow('邮箱格式不正确');
				return false;
			}
			return true;
		},
		goToGive: function() {
			var _that = this;
			$("#goToGive").on('click',function(){
				if($("#okGiveNum").text() == '0'){
					ErrWarn.errShow('已赠送完，请重新购买');
					return false;
				}else{
					$("#mask").show();
				}
			});
		},
		cancel: function() {
			$("#cancel").on('click',function(){
				$("#mask").hide();
			});
		},
		give: function() {
			var _that = this;
			$("#give").on('click',function(){
				if(!_that.checkData()){
					console.log('验证不通过');
				}else{
					$('#give').css({'border':'1px solid #aaa','color':'#aaa'});
					var data={
						"name":$.trim($("#giveName").val()),
						"sendCardNum":$.trim($("#numInput").val()),
						"sendPhone":$.trim($("#linkMobile").val()),
						"sendEmail":$.trim($("#linkEmail").val()),
						"policyNo":policyNo,
						"applySelfCardSourceNo":urlParams.agentNo
					};
					var url = "/icp/selfCardSend.do";
					$(".loading").show();
					$.ajax({
						url: url,
		                type: 'post',
		                data: data,
		                success: function(res) {
		                    if (res.code === '00') {
		                    	ErrWarn.errShow('发送成功');
		                    	window.location.href = window.location.href;
		                    } else {
		                        alert(res.msg);
		                        $("#give").css({'border':'1px solid #FF7614',"color":"#FF7614"});
		                    };
		                    $(".loading").hide();
		                },
		                error: function() {
		                    alert('网络出错，请稍后再试');
		                    $('.loading').hide();
		                    $('#give').css({'border':'1px solid #FF7614',"color":"#FF7614"});
		                }
					})
				}
			})
		},
		judgeActivityTimeStatus: function(urlP) {
			$.ajax({
				url: '/icp/activity/getPolicyLuckyDrawStatus.do',
                type: 'post',
                data: {
                    policyNo: policyNo
                },
                success: function(res) {
                	res = typeof res === 'object' ? res : JSON.parse(res);
                    if (res.resultCode === '00') {
                    	OrderDetail.judgeStatus(res.luckyDrawStatus, urlP);
                    } else {
                        console.log(res.resultMsg);
                    };
                },
                error: function(xhr) {
                    console.log(xhr);
                }
			});
		},
		judgeStatus: function(status,urlP) {
			switch (status) {
				case '1':
	                $('#activityBtn').text('参与抽奖');
	                $('#activityBtn').on('click',function() {
	                	window.location.href = '/icp/activity/eSale/lottery.html?policyNo=' + policyNo + '&agentNo=' + urlP.agentNo+ '&ciph=' + urlP.ciph + '&flag=EXX';
	                });
	                $('.active-span').show();
	                break;
	            case '2':
	                $('#activityBtn').text('查看礼品');
	                $('#activityBtn').on('click',function() {
	                	window.location.href = '/icp/activity/eSale/prizeDetail.html?policyNo=' + policyNo + '&pageType=detail';
	                });
	                $('.active-span').show();
	                break;
	            case '3':
	                $('.active-span').hide();
	                break;
	            default:
	            	$('.active-span').hide();
			};
		}
	};
	$(function(){
		OrderDetail.init();
	})
})();