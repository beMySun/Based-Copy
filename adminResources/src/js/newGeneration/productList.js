$(function() {
	var urlParams,urlString;
	var ProductList = {
		init:function(){
			$("#searchInput").val('');
			urlParams = ProductList.getUrlParameters();
    		urlString = 'flag='+urlParams.flag+'&agentNo='+urlParams.agentNo+'&ciph='+urlParams.ciph;
		    $(".icon-close").on('click',function(){
		    	window.location.href = window.location.href.indexOf('test')>0?'https://jinling-dmzstg1.pa18.com:1009/SMTResourceNew/esalesPro/life/modules/easyShop/index.html':'https://jinling.pa18.com/SMTResourceNew/esalesPro/life/modules/easyShop/index.html';
		    });
		    $(".go-back").on('click',function(){
		    	window.history.back(-1);
		    });
			this.focus();
			this.search();
			this.hot();
			this.detele();
			var productName = '';
			if(urlParams.flag == 'EXX'){
		        var agentNo = urlParams.agentNo?urlParams.agentNo:'',
		        ciph = urlParams.ciph?urlParams.ciph:'';
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
		                    ProductList.getData(urlString,productName);
		                } else {
		                    alert(res.msg);
		                }
		            },
		            error: function() {
		                alert('网络出错，请刷新页面');
		            }
		        })
		    }else{
		        ProductList.getData(urlString,productName);
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
		focus:function(){
			$("#searchInput").focus(function(){
				$("#productList").hide();
				$(".foot").hide();
				$("#search-box").show();
			});
		},
		getData:function(urlString,productName){
			$(".loading").hide();
			var counter = 0;
		    // 每页展示4个
		    var num = 6;
		    var pageStart = 0,pageEnd = 0;

		    // dropload
		    $('.foot').dropload({
		        scrollArea : window,
		        loadDownFn : function(me){
		        	var data = {
		        		"acountId":"",
		        		"productName":encodeURI(encodeURI(productName))
		        	};
		            $.ajax({
		                type: 'GET',
		                url: '/icp/mobile_single_insurance/newQueryProductList.do',
		                dataType: 'json',
		                data:data,
		                contentType:'text/html;charset=UTF-8',
		                success: function(res){
		                    var res = (typeof res === 'object' ? res : JSON.parse(res)).res;
		                    if(!res.code){
		                    	$(".dropload-load").html('请稍后再试');
		                    }else{
			                    if(res.code == '00'){
			                   	 	$("#search-box").hide();
									$("#productList").show();
									$(".foot").show();
				                    var result = '',string='';
				                    counter++;
				                    pageEnd = num * counter;
				                    pageStart = pageEnd - num;

				                    for(var i = pageStart; i < pageEnd;i++){
				                    	if(i>= res.planList.length){
				                            // 锁定
				                            me.lock();
				                            // 无数据
				                            me.noData();
				                            
				                            break;
				                        };
				                        string = '';
										result +='<li class="product-li">'
												+'<div class="left">'
													+''+string+''
													+'<p class="picture"><a href="../productDetail.html?keyCode='+res.planList[i].keyCode+'&'+urlString+'"><img src="/icp/downloadFile.do?fileName='+(res.planList[i].imgUrl.split('='))[1]+'=0"></a></p>'
													+'<div class="des">'
														+'<div class="des-box">'
															+'<p class="name">'+res.planList[i].productName+'</p>'
															+'<p class="amout">'+res.planList[i].leastAmount+'元起</p>'
															+'<p class="sale">'+res.planList[i].sellNum+'人付款</p>'
														+'</div>'
													+'</div>'
												+'</div>'
											+'</li>'
				                        
				                    };
			                        $('.product-ul').append(result);
			                        $(".dropload-load").html('无更多数据了');
			                        // 每次数据加载完，必须重置
			                        me.resetload();
			                    }else{
			                    	$(".dropload-load").html('请稍后再试');
			                    	alert(res.msg);
			                    };
		                    }
		                },
		                error: function(xhr, type){
		                    console.log(xhr);
		                    $(".dropload-load").html('网络繁忙，请稍后再试');
		                    // 即使加载出错，也得重置
		                    //me.resetload();
		                }
		            });
		        }
		    });
		},
		hot:function(){
			$(".product-button").on('click',function(){
				$this = $(this);
				$("#searchInput").val($this.text());
			});
		},
		search:function(){
			$(".search-button").on('click',function(){
				var productName = $("#searchInput").val();
				$(".product-ul").html("");
				$(".dropload-down").remove();
				ProductList.getData(urlString,productName);
			})
		},
		detele:function(){
			$("#detele").on('click',function(){
				$("#searchInput").val('');
			})
		}
	};
	ProductList.init();

})