 (function() {

     var tool = {

         ajax: function(options) {
             var ops = {
                 url: '',
                 type: 'GET',
                 data: {},
                 success: function() {},
                 error: function() {
                     $('.loading').hide();
                     if (window.wAlert) {
                         window.wAlert('网络异常，请稍后重试');
                         return false;
                     }
                     tool.toast('网络异常，请稍后重试');
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

         getSessionStorage: function(name) {
             return JSON.parse(window.sessionStorage.getItem(name));
         },

         setSessionStorage: function(name, value) {
             window.sessionStorage.setItem(name, JSON.stringify(value));
         },


         // 获取URL中的参数，若传入参数名parameter，则返回对应的参数值，否则返回key-value对象
         getUrlParameters: function(parameter) {
             var urlParameters = {};
             decodeURIComponent(window.location.search).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                 urlParameters[key] = value;
             });

             if (parameter && typeof parameter === 'string') {
                 return urlParameters[parameter];
             }
             return urlParameters;
         },

         getStyle: function(url, successCallback) {
             var options = {
                 url: url,
                 success: successCallback
             };
             tool.ajax(options);
         },

         setStyle: function(styleText) {
             var style = document.createElement('style');
             style.type = 'text/css';
             style.innerHTML = styleText;
             document.getElementsByTagName('head')[0].appendChild(style);
         },

         toast: function(text, timeRemove) {
             var time = timeRemove || 3000,
                 html = '<div class="toast">' + text + '</div>';

             if ($('.toast').length === 0) {
                 $('body').append(html);
                 setTimeout(function() {
                     $('.toast').remove();
                 }, time);
             }
         },

         getTemplate: function(productData, stepPage, index) {
             var dir = {
                 health: {
                     step01: 'template/health/template-step01/',
                     step02: 'template/health/template-step02/',
                     step03: 'template/health/template-step03/'
                 },
                 property: {
                     step01: 'template/property/template-step01/',
                     step02: 'template/property/template-step02/',
                     step03: 'template/property/template-step03/'
                 },
                 newGeneration: {
                     step01: 'template/newGeneration/template-step01/',
                     step02: 'template/newGeneration/template-step02/'
                 }
             };

             var templateType = productData.templateType;
             var icpProductInfo = productData.icpProductInfo || {};
             var template = icpProductInfo.pageTemplateId || productData.template;
             var stepPages = tool.getSessionStorage('stepPages');

             if (stepPages && stepPages[stepPage]) {
                 $('body').append(stepPages[stepPage]);
             } else {
                 var templateUrl = dir[templateType][stepPage] + template.split('|')[index - 1] + '/index.html';
                 var options = {
                     url: templateUrl,
                     success: function(data) {
                         var stepPages = JSON.parse(window.sessionStorage.getItem('stepPages')) || {};
                         stepPages[stepPage] = data;
                         $('body').append(data);
                         window.sessionStorage.setItem('stepPages', JSON.stringify(stepPages));
                     }
                 };
                 tool.ajax(options);
             }
         },

         getScript: function(url) {
             var body = document.getElementsByTagName('body')[0];
             var js = document.createElement('script');

             js.setAttribute('type', 'text/javascript');
             js.setAttribute('src', url);
             body.appendChild(js);
         },

         //获取未来日期字符串yyyy-mm-dd，getFutureDate([Date,]number,number,number)
         getFutureDate: function(startDate, afterYear, afterMonth, afterDay) {
             var futureDate, year, month, day;

             if (arguments.length === 3) {
                 afterDay = arguments[2];
                 afterMonth = arguments[1];
                 afterYear = arguments[0];
                 startDate = new Date();
             }

             if (arguments.length === 4 && Object.prototype.toString.call(startDate) !== "[object Date]") {
                 startDate = new Date();
             }

             //计算年
             futureDate = startDate.setFullYear(startDate.getFullYear() + afterYear);
             futureDate = new Date(futureDate);
             // 计算月
             futureDate = futureDate.setMonth(futureDate.getMonth() + afterMonth);
             futureDate = new Date(futureDate);
             // 计算日
             futureDate = futureDate.setDate(futureDate.getDate() + afterDay);
             futureDate = (new Date(futureDate));

             year = futureDate.getFullYear();

             month = futureDate.getMonth() + 1;
             month = month < 10 ? '0' + month : month;

             day = futureDate.getDate();
             day = day < 10 ? '0' + day : day;

             futureDate = [year, month, day].join('-');

             return futureDate
         },

         getCurrentDateTime: function() {
             var nowTime = new Date();
             var y = nowTime.getFullYear();
             var m = nowTime.getMonth() + 1;
             m = m < 10 ? '0' + m : m;
             var d = nowTime.getDate();
             d = d < 10 ? '0' + d : d;
             var h = nowTime.getHours();
             h = h < 10 ? '0' + h : h;
             var min = nowTime.getMinutes();
             min = min < 10 ? '0' + min : min;
             var s = nowTime.getSeconds();
             s = s < 10 ? '0' + s : s;
             return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
         },

         /*
          *动态调用插件函数
          *
          *@param {stirng} pluginName 插件名
          *@param {stirng | dom | $dom}  selector 动态元素，可以是：.className、#ID、DOM、jqDOM
          *@param {function=} callback 回调函数，可选。（此参数暂时用于日期插件，其他插件不受此回调影响）
          *
          */
         dynamicallyCallPlugin: function(pluginName, selector, callback) {
             if (arguments.length < 2) {
                 return;
             }

             Object.prototype.toString.call(pluginName) === '[object String]' && (pluginName = pluginName.trim());
             Object.prototype.toString.call(selector) === '[object String]' && (selector = selector.trim());
             var timer;
             var $target = $(selector);

             switch (pluginName) {

                 //房屋结构
                 case 'buildingStructure':
                     if (!$.buildingStructure) {
                         window.tool.getScript('js/plugin/buildingStructure.js');
                     }

                     timer = setInterval(function() {
                         if ($.buildingStructure) {
                             $target.html($.buildingStructure);
                             clearInterval(timer);
                         }
                     }, 0);
                     break;

                     //省市区选择
                 case 'cityPicker':
                     if (!$.fn.cityPicker) {
                         window.tool.getScript('js/plugin/cityPicker.js');
                     }

                     timer = setInterval(function() {
                         if ($.fn.cityPicker) {
                             $target.cityPicker();
                             clearInterval(timer);
                         }
                     }, 0);
                     break;

                     //日期选择
                 case 'datetimePicker':
                     if (!$.fn.datetimePicker) {
                         window.tool.getScript('js/plugin/datetimePicker.js');
                     }

                     timer = setInterval(function() {
                         if ($.fn.datetimePicker) {
                             $target.datetimePicker({
                                 title: '选择日期',
                                 yearSplit: '-',
                                 monthSplit: '-',
                                 datetimeSplit: ' ',
                                 times: function() {
                                     return [];
                                 },
                                 onChange: Object.prototype.toString.call(callback) === '[object Function]' && callback
                             });
                             clearInterval(timer);
                         }
                     }, 0);
                     break;
             }
         },
         // 立即投保统计
         buyBtnTJ: function() {
            var keyCode = window.tool.getSessionStorage('urlParameters').keyCode;
            SKAPP.onEvent(keyCode, '产品介绍页面', { 立即投保: '立即投保按钮' });
         },
         // 有效支付统计
         payBtnTJ: function() {
            var keyCode = window.tool.getSessionStorage('urlParameters').keyCode;
            SKAPP.onEvent(keyCode, '投保信息填写页面', { 有效支付: '支付按钮' });
         }

     };

     window.tool = tool;
 })(window);
