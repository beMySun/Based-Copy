$(function() {
	var Result = {
		init: function() {
			var urlP = Result.getUrlParameters();
			var remark = urlP.remark.split("|");
			var urlParams = {};
			var time = (new Date()).getFullYear()+'/'+((new Date()).getMonth()+1)+ '/'+ (new Date()).getDate();
			var nowTime = (new Date(time)).getTime();
			if(remark.length >= 5) {
				urlParams.agentNo = remark[0]||'';
				urlParams.flag = remark[1]||'';
				urlParams.ciph = remark[2]||'';
				urlParams.keyCode = remark[3]||'';
			    $(".icon-close").on('click',function(){
			    	window.location.href = './productList.html?agentNo='+urlParams.agentNo+'&ciph='+urlParams.ciph+'&flag='+urlParams.flag;
			    });
			    $("#refresh-a").on('click',function() {
			    	window.location.href = './orderDetail.html?agentNo='+urlParams.agentNo+'&ciph='+urlParams.ciph+'&flag='+urlParams.flag;
			    });
			    if (remark[4]) {
				    window.tool.getStyle(
		                remark[4],
		                function (themeStyle) {
		                    window.tool.setStyle(themeStyle);
		                    if ($("header").css("background-color") != 'rgb(255, 255, 255)') {
								$("#goBackImg").hide();
								$("#goBack").show();
							};
		                }
		            );
	            };
            };
		    var productDetailUrl = window.sessionStorage.getItem('productDetailUrl')||'../productDetail.html?agentNo='+urlParams.agentNo+'&ciph='+urlParams.ciph+'&flag='+urlParams.flag+'&keyCode='+urlParams.keyCode;
		    $(".go-back").on('click',function(){
		    	window.location.href = productDetailUrl;
		    });
		    $(".refresh-btn").on('click',function(){
		    	window.location.href = window.location.href;
		    });
			if(urlParams.flag == 'EXX'){
		        var agentNo = urlParams.agentNo?urlParams.agentNo:'',
		        ciph = urlParams.ciph?urlParams.ciph:'';
		        Result.isActivityTime(nowTime, remark);
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
		                if (res.code === '00') { //成功
		                    Result.getData(urlP,urlParams);
		                } else {
		                    alert(res.msg);
		                }
		            },
		            error: function() {
		                alert('网络出错，请稍后再试');
		            }
		        })
		    }else{
		        Result.getData(urlP,urlParams);
		    }
		},
        //获取URL中所有的参数，返回一个key-value对象
        getUrlParameters: function() {
            var urlParameters = {};
            decodeURIComponent(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                urlParameters[key] = value;
            });
            return urlParameters;
        },
        getData: function(urlP, urlParams) {
        	var url='/icp/queryAcceptPolicyDetail.do',
        	businessOrder = urlP.businessOrder;
        	$.ajax({
        		url: url,
	            type: 'post',
	            dataType:'json',
	            data: {
	                businessOrder: businessOrder||''
	            },
	            success: function(res) {
	            	var res = typeof res === 'object' ? res : JSON.parse(res);
	                if (res.code === '00') { //成功
	                    if(res.policyNo){
	                    	$("#policyNo").text(res.policyNo);
	                    	$("#planName").text(res.planName);
	                    	$("#insuranceBeginTime").text(res.beginTime);
	                    	$("#insuranceEndTime").text(res.endTime);
	                    	$("#amount").text(res.amount);
	                    	window.sessionStorage.setItem('policyNo',res.policyNo);
	                    	var urls = {
	                    		"agentNo":urlParams.agentNo,
	                    		"flag":urlParams.flag,
			                	"ciph":urlParams.ciph
	                    	};
	                  window.sessionStorage.setItem('urlParameters',JSON.stringify(urls));
	                    	Result.sucOrErr('0',urlParams);
	                    }else{
	                    	Result.sucOrErr('1',urlParams);
	                    }
	                } else {
	                    alert(res.msg);
	                    Result.sucOrErr('1',urlParams);
	                }
	                $('.loading').hide();
	            },
	            error: function() {
	                alert('网络出错，请稍后再试');
	                Result.sucOrErr('1');
	                $('.loading').hide();
	            }
        	})
        },
        isActivityTime: function(now, arr) {
        	if (arr[5] != '0' && arr[6] != '0') {
        		var startTime = Result.getDateTime(arr[5]);
        		var endTime = Result.getDateTime(arr[6]);
        		if (startTime <= now && now <= endTime) {
        			$(".remark-span").html('感谢参与“轻E购”五月专享活动<br/>快前往“轻E购”——“我的订单”参与抽奖');
        		};
        	};
        },
        sucOrErr: function(id, urlParams) {
        	if(id == '1'){
        		$("#successDiv").hide();
	        	$("#reslist").hide();
	        	$("#foot").hide();
	        	$("#errDiv").show();
	        	$("#refresh").show();
        	}else{
        		if(urlParams.flag == 'EXX'){
        			$("#foot").show();
        			$(".icon-close").show();
        		}else{
        			$("#foot").hide();
        			$(".icon-close").hide();
        			$(".title").removeClass('aacc');
        		};
        		$("#successDiv").show();
	        	$("#reslist").show();
	        	$("#errDiv").hide();
	        	$("#refresh").hide();
        	};
        	
        },
        getDateTime: function(date) {
        	var date = date.indexOf('+') > 0?date.slice(0,10) : date;
        	return (new Date(date.replace(/-/g,'/'))).getTime();
        }
	};
	Result.init();
})