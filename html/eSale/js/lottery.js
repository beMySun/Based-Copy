$(function() {
    'use strict';

    var lottery;
    var lotteryResult; //抽奖结果
    var policyNo = window.tool.getUrlParameters().policyNo; //保单号
    var lotteryMap = {
        A: {
            index: 1,
            msg: '一等奖：IPAD mini2一部'
        },
        B: {
            index: 0,
            msg: '二等奖：运动水杯一个'
        },
        C: {
            index: 3,
            msg: '三等奖：爱奇艺会员月卡一张'
        },
        D: {
            index: 2,
            msg: '四等奖：手机流量包一个'
        }
    };

    var app = {

        lottery: function() {
            lottery = new LotteryDial(document.getElementById('lottery'), {
                speed: 30,
                areaNumber: 8,
                deviation: 10
            });
            var index = -1;
            lottery
                .on('start', function() {
                    setTimeout(function() {
                        var ops = {
                            url: '/icp/activity/luckyDraw.do',
                            data: {
                                policyNo: policyNo
                            },
                            success: function(res) {
                                res && typeof res === 'string' && (res = JSON.parse(res));
                                lotteryResult = res;
                                var activityAwardType = res.activityAwardType; //几等奖

                                if (res && res.resultCode === '00' && activityAwardType && lotteryMap[activityAwardType]) {
                                    lottery.setResult(lotteryMap[activityAwardType].index);
                                } else {
                                    lottery.reset();
                                    window.tool.alertMsg('sorry', res.resultMsg || '系统出错，请稍后重试');
                                }
                            },
                            error: function() {
                                lottery.reset();
                                window.tool.alertMsg('sorry', '网络出错，请稍后重试');
                            },
                            complete: function() {
                                var timer = setInterval(function() {
                                    if ($('.alert').length > 0) {
                                        $('#point').removeClass('lottery-diabled');
                                        clearInterval(timer);
                                    }
                                }, 50);
                            }
                        };
                        window.tool.ajax(ops);
                    }, 2000);
                })
                .on('end', function() {
                    setTimeout(function() {
                        window.tool.alertMsg('congratulation', '恭喜您获得' + lotteryMap[lotteryResult.activityAwardType].msg);
                    }, 500);
                });
        },

        eventBinding: function() {
            $(document)
                .on('click', '.icon-btn-close', function() { //弹窗
                    $('.alert').remove();
                })
                .on('click', '#point', function() { //抽奖
                    if (!policyNo) {
                        window.tool.alertMsg('sorry', '保单号缺失');
                        return false;
                    }
                    if (!$(this).hasClass('lottery-diabled')) {
                        $(this).addClass('lottery-diabled');
                        lottery.draw();
                    }
                })
                .on('click', '.icon-get-prize', function() { //领奖
                    var activityAwardType = lotteryResult.activityAwardType;
                    var urlSearch = window.location.search;
                    if (activityAwardType === 'C') {
                        window.location.href = 'prizeDetail.html' + urlSearch + '&pageType=detail';
                    } else {
                        window.location.href = 'prizeDetail.html' + urlSearch + '&prizeType=' + lotteryResult.activityAwardType;
                    }
                });
        },

        init: function() {
            app.lottery();
            app.eventBinding();
        }
    };

    app && app.init();
});
