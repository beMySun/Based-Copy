 (function() {
     'use strict';

     var tool = {
         alertMsg: function(className, text) {
             className = className || '';
             text = text || '';

             var html = '<div class="alert ' + className + '"><div class="alert-body"><div class="alert-wrap"><button class="icon-close icon-btn-close">关闭</button><h2 class="alert-title"></h2><p class="alert-desc">' + text + '</p><a class="icon-btn ' + (className === 'congratulation' ? 'icon-get-prize' : 'icon-btn-close') + '" href="javascript:void(0);"></a></div></div></div>';
             $('body').append(html);
         },

         ajax: function(options) {
             var ops = {
                 url: '',
                 type: 'GET',
                 data: {},
                 dateType: 'json',
                 success: function() {},
                 error: function() {
                     window.tool.alertMsg('sorry', '网络出错，请稍后重试');
                 },
                 complete: function() {}
             };

             $.extend(ops, options);
             $.ajax({
                 url: ops.url,
                 type: ops.type,
                 data: ops.data,
                 success: ops.success,
                 error: ops.error,
                 complete: ops.complete
             });
         },

         //获取URL中所有的参数，返回一个key-value对象
         getUrlParameters: function() {
             var urlParameters = {};
             decodeURIComponent(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                 urlParameters[key] = value;
             });
             return urlParameters;
         },

         getPrizeHtml: function(prizeType, prizeInfo) {
             var tipAB = '请留下您的联系方式以便工作人员寄送奖品';
             var tipD = '请填写获奖资料以便工作人员完成流量充值';
             var formAB = '<input class="form-control" type="text" name="contact" placeholder="请输入您的姓名"> </div> <div class="form-group"> <label>手机号</label> <input class="form-control" type="tel" name="phone" maxlength="11" placeholder="请输入11位手机号"> </div> <div class="form-group"> <label>寄送地址</label> <input class="form-control" type="text" name="address" placeholder="请输入您的地址"> </div> <a class="icon-submit" href="javascript:void(0);"><img src="img/icon_btn_submit.png"></a></div>';
             var formD = '<input class="form-control" type="tel" maxlength="11" name="phone" placeholder="请输入11位手机号"></div> <div class="form-group form-group-select"><label>运营商</label><select class="form-control" name="phoneType"> <option value="中国移动">中国移动</option><option value="中国电信">中国电信</option><option value="中国联通">中国联通</option></select></div><a class="icon-submit" href="javascript:void(0);"><img src="img/icon_btn_submit.png"></a> </div> ';

             if (typeof prizeInfo === 'object') {
                 tipAB = '工作人员将按照您留下的地址寄送奖品';
                 tipD = '工作人员将按照您留下的手机号完成流量充值';
                 formAB = '<p>' + (prizeInfo.userName || '') + '</p></div> <div class="form-group"> <label>手机号</label><p>' + (prizeInfo.telephoneNumber || '') + '</p></div> <div class="form-group"> <label>寄送地址</label><p>' + (prizeInfo.address || '') + '</p></div> </div>';
                 formD = '<p>' + (prizeInfo.telephoneNumber || '') + '</p></div><div class="form-group form-group-select"><label>运营商</label><p>' + (prizeInfo.telephoneNumberType || '') + '</p></div></div> ';
             }

             switch (prizeType) {
                 case 'A':
                     return '<div class="page"><section class="section-first"><a class="btn-back" href="javascript:window.history.back();">返回</a><div class="banner banner-prize bounceIn"><img src="img/icon_banner_ipad.png"></div><div class="prize"><img src="img/icon_ipadMini2.png"><p>' + tipAB + '</p> </div></section><section class="section-second"><div class="form-container"><div class="form-group"><label>联系人</label>' + formAB + '<div class="rule"><h2><img src="img/icon_prize_desc.png"></h2><p>1、获得一、二等奖的用户，请填写您的联系方式及奖品寄送地址，工作人员会在5个工作日内和您取得联系，确认获奖信息;</p> <p>2、活动咨询电话：18521672373.</p></div></section><footer><img class="logo" src="img/icon_logo.png"></footer></div>';
                 case 'B':
                     return '<div class="page"><section class="section-first"><a class="btn-back" href="javascript:window.history.back();">返回</a><div class="banner banner-prize bounceIn"><img src="img/icon_banner_cup.png"></div><div class="prize"><img src="img/icon_shuihu.png"><p>' + tipAB + '</p> </div></section><section class="section-second"><div class="form-container"><div class="form-group"><label>联系人</label>' + formAB + '<div class="rule"><h2><img src="img/icon_prize_desc.png"></h2><p>1、获得一、二等奖的用户，请填写您的联系方式及奖品寄送地址，工作人员会在5个工作日内和您取得联系，确认获奖信息;</p> <p>2、活动咨询电话：18521672373.</p></div></section><footer><img class="logo" src="img/icon_logo.png"></footer></div>';
                 case 'C':
                     return '<div class="page"><section class="section-first"><a class="btn-back" href="javascript:window.history.back();">返回</a><div class="banner banner-prize bounceIn"><img src="img/icon_banner_aqy.png"></div><div class="prize"><img src="img/icon_aiqiyi.png"></div></section><section class="section-second"><div class="form-container"><p class="form-desc">激活码：<br>' + (prizeInfo && prizeInfo.cardInfo && prizeInfo.cardInfo.cardPwd || '') + '</p><a class="icon-to-active" href="http://m.iqiyi.com/vip/jihuoma.html?fc=afa1fca7d481accf"><img src="img/icon_btn_active.png"></a> </div><div class="rule"><h2><img src="img/icon_prize_desc.png"></h2><p>1、获得账号密码信息后，在爱奇艺官方网站激活即可，会员卡有效期一个月，激活有效期为2017年5月11日—2017年12月31日;</p> <p>2、活动咨询电话：18521672373.</p> </div> </section> <footer> <img class="logo" src="img/icon_logo.png"> </footer> </div>';
                 case 'D':
                     return '<div class="page"><section class="section-first"><a class="btn-back" href="javascript:window.history.back();">返回</a><div class="banner banner-prize bounceIn"><img src="img/icon_banner_phone.png"></div><div class="prize"> <img src="img/icon_liuliang.png"><p>' + tipD + '</p></div></section><section class="section-second"><div class="form-container"><div class="form-group"><label>手机号</label>' + formD + '<div class="rule"><h2><img src="img/icon_prize_desc.png"></h2><p>1、奖品为手机流量包一个，其中中国移动、中国电信用户将获得30M流量包，中国联通用户将获得50M；</p> <p>2、工作人员将在2个工作日内完成流量充值；</p> <p>3、活动咨询电话：18521672373.</p> </div> </section> <footer> <img class="logo" src="img/icon_logo.png"> </footer> </div>';
                 default:
                     return '';
             }
         }
     };

     window.tool = tool;
 })(window);
