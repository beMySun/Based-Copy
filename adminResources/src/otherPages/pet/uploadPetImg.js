var app = {
    init: function () {

        //司机端or乘客端
        window.location.search.slice(1).split('=')[1] == 1 ? $('.sender').remove() : '';

        //返回时，恢复数据
        var imgSession = readSessionStorage('imgDTO');
        if (imgSession) {
            for (var i in imgSession) {
                var html = '';
                for (var j = 0, arr = imgSession[i]; j < arr.length; j++) {
                    html += '<span class="uploaded-img"><img src="' + arr[j] + '"><span class="icon-remove"></span></span>';
                }
                $('.img-container').eq(i).prepend(html);

            }
            //恢复右上角tip
            var wrapRow = $('.wrap-row');
            for (var k = 0; k < wrapRow.length; k++) {
                countImgNumber(wrapRow[k]);
            }
        }

        //拍摄or读取手机图片
        $('.input-btn').on('change', function () {
            var that = this;
            lrz(that.files[0], {
                width: 800
            })
                .then(function (rst) {
                    var img = new Image(),
                        imgSpan = document.createElement('span'),
                        iconRemove = document.createElement('span');

                    imgSpan.className = 'uploaded-img';
                    iconRemove.className = 'icon-remove';
                    imgSpan.appendChild(img);
                    imgSpan.appendChild(iconRemove);
                    img.src = rst.base64;
                    img.onload = function () {
                        $(that).parents('.upload-btn').before(imgSpan);
                        //计算上传多少张图片
                        var $wrapRow = $(that).parents('.wrap-row');
                        countImgNumber($wrapRow);
                        writeSessionStorage('imgDTO', getImg());
                    };

                });
        });

        $('.page').on('click', '.uploaded-img img', function () {
            var URI = $(this).attr('src');
            $('.layer img').eq(0).attr('src', URI);
            $('.layer').addClass('active');
        })

        $('.layer').on('click', function () {
            $(this).removeClass('active');
        });

        //删除照片
        $('.img-container').on('click', '.icon-remove', function () {
            var $this = $(this),
                $wrapRow = $this.parents('.wrap-row');
            $this.parent().remove();
            countImgNumber($wrapRow);
            writeSessionStorage('imgDTO', getImg());
        });

        //提交
        $('#J-btn-submit').on('click', function () {
            var count = $('.required').find('.count');
            for (var i = 0; i < count.length; i++) {
                if ($(count[i]).text().trim() == 0) {
                    var msg = $(count[i]).parents('.head').find('h3').text().trim().slice(0, -1);
                    showDiffMsg('请上传' + msg, 'text');
                    return false;
                }
            }

            var sendData = {
                imgDTO: JSON.stringify(getImg())  //图片base64流
            }

            showDiffLoading('提交中...', true, 'showLoading');//显示loading

            debugger

            // $.ajax({
            //     url: '/icp/58suyu/claim/reportClaim.do',
            //     type: 'post',
            //     dataType: 'json',
            //     contentType: "application/x-www-form-urlencoded",
            //     data: sendData,
            //     success: function (data) {
            //         showDiffLoading('', false);//隐藏loading
            //         if (data.resultCode == '00') {//报案成功                		
            //             var session = readSessionStorage('reportDTO');
            //             var secondSendData = {};
            //             secondSendData.callbackUrl = session.callbackUrl;
            //             secondSendData.policyNo = session.policyNo;
            //             secondSendData.reportNo = data.resultMsg;
            //             //返回报案号给58
            //             $.ajax({
            //                 url: '/icp/58suyu/claim/callback.do',
            //                 type: 'POST',
            //                 dataType: 'JSON',
            //                 contentType: "application/x-www-form-urlencoded",
            //                 data: secondSendData
            //             });
            //             //报案成功后跳转页面
            //             showDiffMsg('报案成功', function () { }); //跳转页面不能写在这里的回调，因为低版本Android不调用toast方法
            //             setTimeout(function () {
            //                 window.location.href = session.returnUrl || 'https://m.daojia.com/sz/';
            //             }, 2000);
            //         } else {
            //             showDiffMsg(data.resultMsg || '系统异常', 'cancel');
            //         }
            //     },
            //     error: function (error) {
            //         showDiffLoading('', false);//隐藏loading
            //         showDiffMsg('网络出错', 'cancel');

            //     }
            // });
        });//end 提交

        //已上传多少张图片
        function countImgNumber(containerSelector) {
            var $wrapRow = $(containerSelector),
                upload = $wrapRow.find('.uploaded-img').length;

            if (upload === 0) {
                $wrapRow.find('.tip').css('display', 'none');
            } else {
                $wrapRow.find('.tip').css('display', 'block');
            }
            $wrapRow.find('.count').text(upload);
        }

        //获取所有上传的图片
        function getImg() {
            var imgContainer = $('.img-container');
            var imgObj = {};

            for (var i = 0; i < imgContainer.length; i++) {
                var imgs = $(imgContainer[i]).find('img');
                var tempArr = [];
                for (var j = 0; j < imgs.length; j++) {
                    tempArr.push(imgs[j].src);
                }
                imgObj[i] = tempArr;
            }
            return imgObj;
        }

        //写sessionStorage
        function writeSessionStorage(item, obj) {
            sessionStorage.setItem(item, JSON.stringify(obj));
        }

        //读sessionStorage
        function readSessionStorage(item) {
            return JSON.parse(sessionStorage.getItem(item));
        }

        //提示信息showMsg,低于Android4.4就用之
        function showMsg(text, timeRemove) {
            var time = timeRemove || 2000,
                html = '<div class="ui-mask"></div><div class="ui-msg">' + text + '</div>';

            $('body').append(html);
            setTimeout(function () {
                $('.ui-mask').remove();
                $('.ui-msg').remove();
            }, time);
        }

        //检测不同移动设备，切换提示信息
        function showDiffMsg(text, cancel) {//cancel用于toast
            var userAgent = window.navigator.userAgent,
                isAndroid = userAgent.indexOf('Android') == -1 ? false : true,
                androidVersion = isAndroid ? userAgent.substr(userAgent.indexOf('Android') + 8, 3) - 0 : 99,
                toastType = cancel || 'text';

            if (isAndroid && androidVersion < 4.4) {
                showMsg(text);
            } else {
                $.toast(text, toastType);
            }
            return false;
        }


        //Loading  要手动删除loading则把showOrHide设为false
        function loading(text, showOrHide) {
            var msg = text || '正在加载...',
                html = '<div class="ui-mask"></div><div class="ui-msg">' + msg + '</div>';

            if (showOrHide) {
                $('body').append(html);
            } else {
                $('.ui-mask').remove();
                $('.ui-msg').remove();
            }
        }

        //检测不同移动设备，显示or隐藏loading
        function showDiffLoading(text, flag, toastType) {
            var userAgent = window.navigator.userAgent,
                isAndroid = userAgent.indexOf('Android') == -1 ? false : true,
                androidVersion = isAndroid ? userAgent.substr(userAgent.indexOf('Android') + 8, 3) - 0 : 99;

            if (isAndroid && androidVersion < 4.4) {
                loading(text, flag);
            } else {
                if (toastType == 'showLoading') {
                    $.showLoading(text);
                } else {
                    $.hideLoading();
                }
            }
        }
    }
}

$(function () {
    window.app && window.app.init();
});

/**
 *
 * 　　　┏┓　　　┏┓
 * 　　┏┛┻━━━┛┻┓
 * 　　┃　　　　　　  ┃
 * 　　┃　　　━　　　┃
 * 　　┃　┳┛　┗┳　┃
 * 　　┃　　　　　　　┃
 * 　　┃　　　┻　　　┃
 * 　　┃　　　　　　　┃
 * 　　┗━┓　　　┏━┛   Code is far away from bug with the animal protecting
 * 　　　　┃　　　┃                  神兽保佑,代码无bug
 * 　　　　┃　　　┃
 * 　　　　┃　　　┗━━━┓
 * 　　　　┃　　　　　 ┣┓
 * 　　　　┃　　　　 ┏┛
 * 　　　　┗┓┓┏━┳┓┏┛
 * 　　　　　┃┫┫　┃┫┫
 * 　　　　　┗┻┛　┗┻┛
 *
 */