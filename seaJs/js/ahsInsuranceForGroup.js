define(function(require) {

    var $ = require("jquery"),
        $body = $(document.body),
        setDate = require("components/setDate"),
        selectCity = require("components/selectCity"),
        commonTools = require("tools/commonTools");

    //var FastClick = require("fastClick");

    var myLayer = require("myLayer");


// require.async

// 用来在模块内部异步加载一个或多个模块。

// define(function(require) {

//   // 异步加载一个模块，在加载完成时，执行回调
//   require.async('./b', function(b) {
//     b.doSomething();
//   });

//   // 异步加载多个模块，在加载完成时，执行回调
//   require.async(['./c', './d'], function(c, d) {
//     c.doSomething();
//     d.doSomething();
//   });

// });


    require.async('fastClick',function(FastClick){
        console.log('1');
        FastClick.attach(document.body);
        console.log('2');
    });

    //平安内部统计
    //var webTrends = require("webTrends");
    // console.log(webTrends);
    //webTrends.init();

    // 百度统计
    // var baiduTrends = require("baiduTrends");
    // baiduTrends.init();
    // console.log(baiduTrends);

    // var _hmt = _hmt||[];

    //console.log(myLayer);
    //myLayer.startLoading();

// 与 DOM ready 的关系

// 注意：seajs.use 与 DOM ready 事件没有任何关系。
// 如果某些操作要确保在 DOM ready 后执行，需要使用 jquery 等类库来保证，比如：
  
  $(document).ready(function() {
    //  xxxx.init();
  });


    //FastClick.attach(document.body);   

    // 初始化时间选择功能
    setDate.dateTime.init();
    //  选择目的地
    selectCity.init();

    var showMore = false;

    var actionList = {

      'applyInsurance' :function(){

            // _hmt.push(['_trackEvent','"+_productName+"','产品信息页面/购买按钮','"+_source+"']);

            $('#error').text('');

            if($('#selectCityDIV').val() == ''){
              $('#error').text('目的地不能为空!');
              return false;
            }

            $('#insuranceBeginTime').val($('#dateInput').val());
            $('#insuranceEndTime').val($('#drivingCardBirthday').val());
            $('input[name=taocan]').val($('#taocan').val());
            $('input[name=outgoingPurpose]').val($('#selectCityDIV').val());
            $('input[name=insuranceMonth]').remove();
            $('input[name=insuranceDay]').remove();
            $('.loadingDiv').show();

            var formobj = document.getElementById('bicycleInsurance');
            formobj.action="./applyInsurance.do";
            formobj.target="_self";
            formobj.method = "post";
            formobj.submit();
            window.sessionStorage.removeItem('saveDates');
            window.sessionStorage.removeItem('applicantShow');  //投保人数据
            saveStartandEndDate();

            // 统计代码
            // code here
        },
        'showMoreContent': function(){
            if(!showMore){
                $("#moreTable").show();
                showMore = true;
                $('#moreContent').html("收起");
            } else {
                $("#moreTable").hide();
                showMore = false;
                $('#moreContent').html("查看详情内容");
            }

        }
    }

    $body.on('click','[data-action]',function(){

      var actionName = $(this).data('action');
      
      var action = actionList[actionName];

      if($.isFunction(action)) action();

    });

    //拓展方法
    $.extend(actionList,{

    });

    $(".contaitent").show();

    $('#taocan').on('change',function(){
        var productCode = $(this).val(),
            plansId = $('input[name=plansId]').val(),
            account = $('input[name=account]').val(),
            userId = commonTools.getUrlParam('userId') || '',
            mediaSource = commonTools.getUrlParam('mediaSource') || '',
            orderNo = commonTools.getUrlParam('orderNo') || '',
            callBackUrl = commonTools.getUrlParam('callBackUrl') || '',
            salesManCode = commonTools.getUrlParam('salesManCode') || '',
            saleCode = commonTools.getUrlParam('saleCode') || '',
            applicantIdNo = commonTools.getUrlParam('applicantIdNo') || '',
            remark = commonTools.getUrlParam('remark') || '';

        window.location.href = "./queryProductDetails.do?account=" + account + "&plansId=" + plansId +
            "&productCode=" + productCode + "&userId=" + userId +
            "&mediaSource=" + mediaSource + "&orderNo=" + orderNo +
            "&salesManCode=" + salesManCode + "&saleCode=" + saleCode +
            "&applicantIdNo=" + applicantIdNo + "&callBackUrl=" + callBackUrl +
            "&remark=" + remark;      
    });



});