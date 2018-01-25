$(function(){
    var urlParams = getUrlParameters();
    window.sessionStorage.setItem('urlParameters',JSON.stringify(urlParams));
    var urlString = 'flag='+urlParams.flag+'&agentNo='+urlParams.agentNo+'&ciph='+urlParams.ciph;
    $(".icon-close").on('click',function(){
        window.location.href = './productList.html?agentNo='+urlParams.agentNo+'&ciph='+urlParams.ciph+'&flag='+urlParams.flag;
    });
    $(".go-back").on('click',function(){
        window.history.back(-1);
    });
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
                    getDataFun();
                } else {
                    alert(res.msg);
                }
            },
            error: function() {
                alert('网络出错，请稍后再试');
            }
        })
    }else{
        getDataFun();
    }
    //获取URL中所有的参数，返回一个key-value对象
    function getUrlParameters() {
        var urlParameters = {};
        decodeURIComponent(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            urlParameters[key] = value;
        });
        return urlParameters;
    };
    function getDataFun(){
        $('.loading').hide();
        var counter = 0;
        // 每页展示4个
        var num = 4;
        var pageStart = 0,pageEnd = 0;
        
        // dropload
        $('.foot').dropload({
            scrollArea : window,
            loadDownFn : function(me){
                var data = {
                    "applySelfCardSourceNo":urlParams.agentNo,
                    "policyNo":''
                };
                $.ajax({
                    type: 'GET',
                    url: '/icp/selfCardQueryRecord.do',
                    dataType: 'json',
                    data:data,
                    success: function(data){
                        //var data = JSON.parse(data);
                        var data = typeof data === 'object' ? data : JSON.parse(data);
                        if(data.code == '00'){
                            var result = '',string='';
                            counter++;
                            pageEnd = num * counter;
                            pageStart = pageEnd - num;
                            for(var i = pageStart; i < pageEnd; i++){
                                if(i >= data.orderList.length){
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData();
                                    break;
                                };
                                if(data.orderList[i].validCardNum == '0'){
                                    string = '<p class="box-p-url">该保单已赠送完，可<a class="box-a" href="../productDetail.html?keyCode='+data.orderList[i].keyCode+'&'+urlString+'">重新购买</a></p>'
                                }else{
                                    string = '<p class="box-p"><button class="box-button" data-no="'+data.orderList[i].policyNo+'">去激活</button></p>';
                                };
                                result +=   '<div class="box">'
                                                +'<ul class="box-content">'
                                                   +'<li class="box-li">'
                                                        +'<span class="left">保单号:</span>'
                                                        +'<span class="right">'+data.orderList[i].policyNo+'</span>'
                                                    +'</li>'
                                                    +'<li class="border-top">'
                                                        +'<span class="left">产品名称:</span>'
                                                        +'<span class="right">'+data.orderList[i].planName+'</span>'
                                                    +'</li>'
                                                    +'<li>'
                                                        +'<span class="box-span-left">'
                                                            +'<span class="left">购买数量:</span>'
                                                            +'<span>'+data.orderList[i].cardNum+'</span>张'
                                                        +'</span>'
                                                        +'<span class="box-span-right">'
                                                            +'<span class="left">可赠送数量:</span>'
                                                            +'<span>'+data.orderList[i].validCardNum+'</span>张'
                                                        +'</span>'
                                                    +'</li>'
                                                    +'<li>'
                                                        +''+string+''
                                                    +'</li>'
                                                +'</ul>'
                                            +'</div>';
                                
                            }
                            $('.content1').append(result);
                            $(".dropload-load").html('无更多数据了');
                            me.resetload();
                        }else{
                            $(".dropload-load").html('请稍后再试');
                            alert(res.msg);
                        }
                        
                    },
                    error: function(xhr, type){
                        console.log(xhr);
                        $(".dropload-load").html('请稍后再试');
                        // 即使加载出错，也得重置
                       // me.resetload();
                    }
                });
            }
        });
    };
    $("body").on('click', '.box-button', function() {
        var policyNo = $(this).attr('data-no');
        window.sessionStorage.setItem('policyNo', policyNo);
        window.location.href = './orderDetail.html?agentNo='+urlParams.agentNo+'&ciph='+urlParams.ciph+'&flag='+urlParams.flag
    });
});