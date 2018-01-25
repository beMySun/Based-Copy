$(function() {

    var iconSelected = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjExMTUzMEFDNEM5RDExRTY4RDdFOUZCOENENjkzOUM5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjExMTUzMEFENEM5RDExRTY4RDdFOUZCOENENjkzOUM5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTExNTMwQUE0QzlEMTFFNjhEN0U5RkI4Q0Q2OTM5QzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTExNTMwQUI0QzlEMTFFNjhEN0U5RkI4Q0Q2OTM5QzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4l6b1XAAAFZ0lEQVR42uxba2wVRRSeKw8fEBBDihrxBT4ISjAaL3+0vho0wRg1hh9atGKtT0KgGvUXvtBExXdMBSHRNgYTiFj1h21UkD+QEhGrIgElYjASjKEGlUas33G/Jjc3O7szszu729z7JV+2d3d7ds7ZOTPnnJktDQ0NqVrGMarGUTdA3QA1jtFJBbT3XB93yzjwArAMzgKng5PBE3hNcBj8EzwI7gZ3gFvBr3lNi+ebuvM1gAbHgU3gTWAjeJbF/zZW/L0X3AiuA3vAvwvXA6owEWwG7wFnpiDvTPJ28BuwA3wbPFS0MUDktIJ94KspKV8NkfkKuA28GxxVFAOIf/eCb9K/fWMae0IPn52fATAAtuCwGbwyhwFcnrkZbbgziZCSSyiMh5ZweA5cWpDZbIU0CzPCkHcDQHnxvTUc7IqETvAOGOGobxdYWUDlBbexbf7GALz9p3FoKXBg18I2pu8CEHwru9lIQDNcoTM1A0D583HYAk4YIQYYAOfACN8ldgEOeh0FVf4NcH3IeWlrB9ueeAy4C7y8YIr/CN4M3gc+BR4JuecyRqfuLgALTsKhHzy1YNNdO/grf58MbgenhNy7X6JFuMLvrj1gYYGU/41JUXOV8t0a5RXbvtCpB+DtH4vDV+B5BVB+E9gG7qw41wB+DF4c87+7pA6BXnDEtgdcURDlV7C2UKn8SeAHBsoLzqUu1i4wP2fFDzG6k3xjsOL8eI78ZQtZ861cAN1fSlUyh07NSfnvqXxf1fkxVH6epbx94Ay4wWHTHjArR+U/Zarbp8lD5jnInEqdjF2gnJPynVTwl5Brz3AWcEXZxgAX5aD8y5zi/gq5di/4SEL5s20McHbGyks0t1hzrYnGSYppYSd1VeGGDJV/jN07DNPpFmNSeE6DTQ8wTXw+Af9J0KilEcofD3al+DIm2BhgbIwwWaBoxbQyl0nJQYcGLWGQo8NL4KUp9rSxiStCxE/gtVB+FX9LRCarOdssZDwMvhhV0FBB7d87dAYY1JyXrKsM5TdWnf8WvIpdNg7LVFBR1uEcFSyApI1BGwMMaM5PjgiQBhi9PQrqKrPy1h+PaOQoBjsneqoSGRvggOb8aZKBIVSO8s1nwRsrUtZhdNHv4wbFRk+9/YCNAX6IECS9YAOMMDvinm4qspW/P4vLyxmoLPPo7ntsDPBljLD/CxEwwsyYhOYaTnMLVHjZqjLJ6eDU5wvbbQywxUCguMNHzLd1+IOBzs8xsh5Kecoz1klngB1MIeNwBqsySULnGTSST+yjTmYGYN7caxFjfwie7tg4mRnGeTZAb1gtIC4QWmv5FsUItgXUW8C5GcQ7a20DIcHnHMhMcSGjQtPYXd768gyU30Vd7AzAKuoqy4dJkXKDCoqWcXhAZbOjZKWuImySC7ylgsUFG8wB31fBhikdpI7fnoHy+6mDcjIAV1SecHiwLEvJ1rbxmuuLGVD5xpNRq0Km2aC4wSaHh18NvhcS3JyigkUO3/hCGWyYiDUAt5y0RSRIUbgOfLcqF5cFzUmelZe2tplslzGqB0DQTjbcBTeooKxVoku0ZvD27zfZG2BVEIHArgTTlsz3r6tgqX2KZ+WXm+4OEbjsElut3PcJ/av87lBfA+Wt9g26NEa68DuODfSpfKeLe1k3iAOLrNC8oIoDKa4usN0j6OQCVe7QwmRmYk6KywryEii+2lVAKelXYzCCbFiWImbW+4WlyrQIyvcnEZKGT/az8iNl7N0ZKL6HcUkTn63yNsDw6C5R1yXggyr4uCFtiMxFTLhka/7RNISO9uCTrzF8dv1kphJ71Qj7ZGYY0tBu0utHU0lRqn86W+OoG6BugBrHfwIMAFWrWfqPvXr1AAAAAElFTkSuQmCC';

    var common = {
        setData: function(name, obj) {
            if (typeof obj === 'object') {
                obj = JSON.stringify(obj);
            }
            sessionStorage.setItem(name, obj);
        },
        getData: function(name) {
            var data;
            var obj = sessionStorage.getItem(name);
            try {
                data = obj && JSON.parse(obj) || '';
            } catch (e) {
                //console.log(e);
                data = obj;
            }
            return data
        },
        removeData: function(name) {
            sessionStorage.removeItem(name);
        }
    };

    function setData(name, obj) {
        if (typeof obj === 'object') {
            obj = JSON.stringify(obj);
        }
        sessionStorage.setItem(name, obj);
    };

    function getData(name) {
        var data;
        var obj = sessionStorage.getItem(name);
        try {
            data = obj && JSON.parse(obj) || '';
        } catch (e) {
            //console.log(e);
            data = obj;
        }
        return data
    };

    function removeData(name) {
        sessionStorage.removeItem(name);
    };

    function mergeArr(a, b) {
        var result = [];
        for (var i = 0; i < a.length; i++) {
            result.push(a[i]);
            result.push(b[i]);
        }
        common.setData('chinese_english', result);

        return result;
    }

    $('#selectCityDIV').on('click', function() {
        $('html').addClass('selectCityActive');
        $("#city p img").removeClass("active-img");
        $(".search-box input").val('');
        $(".page").hide();
        $("#search").hide();
        $("#search-list").hide();
        $("#city").show();
        $("#wrapper").show();
        $('.loading').show();


        $('#err').hide();
        $('#mask').hide();
        $('.mask').hide();
        $('.info').hide();
        $('.footer').hide();
        $('.contaitent').hide();



        var $str = '';
        var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        for (var p = 0; p < arr.length; p++) {
            $str += '<div class = "com_list_table_title" name="' + arr[p] + '"><span>' + arr[p] + '</span>' +
                '<div id="' + arr[p] + '"></div></div>';
        }
        // 拼音标题
        $("#id_province").html($str);

        var url = '/icp/mobileSinglePlatform/queryCountryInfoList.do';
        $.ajax({
            type: 'POST',
            url: url,
            // type: 'GET',
            // url: '../mock/city.json',  
            dataType: 'json',
            contentType: "application/json",
            data: {},
            success: function(res) {
                queryProInfo(res);
            },
            complete: function() {
                $('.loading').hide();
            },
            error: function(XMLhttprequest) {
                console.log(XMLhttprequest);
            }
        });

        // 判断 obj 是否在列表中

        var forbidAraeCode = [107, 109, 119, 122, 123, 166, 167, 168, 171, 175, 177, 182, 196, 197, 204, 209, 211, 220, 224, 225, 227, 228, 231, 402];

        function isInAraay(obj, arr) {
            var i = arr.length;
            while (i--) {
                if (arr[i] == obj) {
                    return true;
                }
            }
            return false;
        };

        function queryProInfo(res) {

            var resultMap = res.resultMap;
            var countryInfoList = resultMap.countryInfoList;
            var length = countryInfoList.length;
            var str = '';
            var htmlStr = '';
            for (var j = 0; j < arr.length; j++) {
                var countryInitial = arr[j];
                for (var i = 0; i < length; i++) {
                    if (countryInitial == countryInfoList[i].countryInitial) {
                        if (isInAraay(countryInfoList[i].countryCode, forbidAraeCode)) {
                            str += '<p class="com_list_table pseudo_province disabled" code="' + countryInfoList[i].countryCode + '" data-id = "' + countryInfoList[i].countryId + '" data-spell = "' + countryInfoList[i].countrySpell + '"><span class="chinese" >' + countryInfoList[i].countryChineseName + '</span><span class="english">' + countryInfoList[i].countryEnglishName + '</span><img class="img"></p>';

                        } else {
                            str += '<p class="com_list_table pseudo_province" code="' + countryInfoList[i].countryCode + '" data-id = "' + countryInfoList[i].countryId + '" data-spell = "' + countryInfoList[i].countrySpell + '"><span class="chinese" >' + countryInfoList[i].countryChineseName + '</span><span class="english">' + countryInfoList[i].countryEnglishName + '</span><img class="img"></p>';

                        }
                        $("#" + arr[j]).html(str);

                    }
                }
                str = '';
                // 上次勾选的值
                $("#city p").each(function() {
                    // console.log(++testNum);
                    $('.active-img').attr("src", iconSelected);
                    var cityArr = getData('new_arr');
                    var $this = $(this);
                    var targetStr = $this.children().eq(0).text();
                    var img = $this.children("img");
                    if (targetStr == cityArr[0] || targetStr == cityArr[1] || targetStr == cityArr[2] || targetStr == cityArr[3] || targetStr == cityArr[4] || targetStr == cityArr[5] || targetStr == cityArr[6]) {
                        img.addClass("active-img");
                    }
                });

            }
            // 事件监听
            // $(".search_input").bind('keydown', function(event) {
            //     if (event.keyCode == 13 || event.keyCode == 8) {
            //         searchList();
            //     }
            // });
            $(".search_input").on('input', function() {
                searchList();
            });

            function searchList() {
                var Arr = [];
                var active = $(".active-img");
                active.each(function(e) {
                    var a = $(this).parent().find('span.chinese').text();
                    Arr.push(a);
                });
                uniQueue(Arr);
                var cityArr = getData('new_arr');
                // 转换大写
                var value = $('.search_input').val().toUpperCase();
                if (!value) {
                    $("#wrapper").show();
                    $("#search").hide();
                    $("#search-list").hide();
                } else {
                    var arr = res.resultMap.countryInfoList;
                    $("#wrapper").hide();
                    $("#search").show();
                    $("#search-list").show();
                    // 定义一个空数组，用于后面的存放结果
                    var $arr = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (value == arr[i].countryInitial || value == arr[i].countryEnglishName.substr(0, 1) || value == arr[i].countrySpell.substr(0, 1) || arr[i].countryChineseName.indexOf(value) > -1 || value == arr[i].countryChineseName) {
                            // 将匹配到的结果存放到数组
                            $arr.push('<span style="margin-left: 5%;">' + arr[i].countryChineseName + '</span>' + '<span style="margin-left:5%;color:#b1b1b1 ">' + arr[i].countryEnglishName + '</span>')
                        }
                    }
                    //结果是个数组，j
                    var str = "";
                    for (var j = 0; j < $arr.length; j++) {
                        str += '<p class="com_list_table pseudo_province ">' + $arr[j] + '<img class="img"</p>';
                        $("#search-list").html(str);
                    }
                    // 上次勾选的值
                    $("#search p").each(function() {
                        console.log(new Date());
                        active.attr("src", iconSelected);
                        var $this = $(this);
                        var targetStr = $this.children().eq(0).text();
                        var img = $this.children("img");
                        if (targetStr == cityArr[0] || targetStr == cityArr[1] || targetStr == cityArr[2] || targetStr == cityArr[3] || targetStr == cityArr[4] || targetStr == cityArr[5] || targetStr == cityArr[6]) {
                            img.addClass("active-img");
                        }
                    });
                    $('.active-img').attr("src", iconSelected);
                    $('.loading').hide();
                }
            }
            // 点击中英文搜索
            $(".search_icon").on('click', function() {
                searchList()
            });
            $('.loading').hide();
        }

        window.history.pushState({
            title: '#xzgj'
        }, '#xzgj', window.location.href + '#xzgj');

        window.onpopstate = function(e) {
            $('.page').show();
            $('#hideInsuranceClause').hide();
            $("#city").hide();
            $('html').removeClass('selectCityActive');

            $('#mask').show();
            $('.mask').show();
            $('.info').show();
            $('.footer').show();
            $('.contaitent').show();
            $('.loading').hide();

        };
    });


    // 点击选中的国家
    $('.list-city').on('click', 'p', function() {
        var active = $(".active-img");
        var $this = $(this);
        var img = $this.children("img");
        var text = img.siblings().eq(0).text();
        var length = $("#id_province .active-img").length;
        if (img.hasClass("active-img")) {
            img.removeClass("active-img");
            $("#city p").each(function() {
                var $this = $(this);
                var Img = $this.children("img");
                var targetStr = $this.children().eq(0).text();
                if (targetStr == text) {
                    Img.removeClass("active-img");
                }
            });
        } else if (length < 7) {
            img.addClass("active-img");
            $('.active-img').attr("src", iconSelected);
            $("#city p").each(function() {
                var $this = $(this);
                var Img = $this.children("img");
                var targetStr = $this.children().eq(0).text();
                if (targetStr == text) {
                    Img.addClass("active-img");
                }
            });
        }
        active.attr("src", iconSelected);
    });

    //  点击确定,取消
    $('.sure').on('click', 'li', function() {
        $('html').removeClass('selectCityActive');
        var index = $(this).index();

        if (index == 1) { //确定
            var arr = [];
            var en_arr = [];

            $('.active-img').each(function(e) {
                var a = $(this).parent().find('span.chinese').text();
                var en = $(this).parent().find('span.english').text();
                arr.push(a);
                en_arr.push(en);
            });

            uniQueue(arr);
            uniQueueEn(en_arr);

            var newArr = getData("new_arr"); // 去重之后的数据
            var new_en = common.getData('new_en');

            var mergedResult = mergeArr(newArr, new_en); // 中英


            console.log(mergedResult);


            if ((newArr.length == 1) && newArr[0] == "申根地区") {
                alert('按部分使（领）馆要求，保单的目的地必须包含落地国（办理签证的国家）和“申根国家”字样，我们建议您增加选择办理签证的国家，例如：“德国，申根国家”，您可以继续选择 进行修改，点击“确定”则按照内容提交。');
            }

            var select = $("#selectCityDIV"); // 把选择的国家填入页面

            // select.val(newArr);

            select.val(mergedResult);

            var new_result = newArr + ' ' + new_en;

            $("#selectCityDIV").data("destination", new_result);
            console.log($("#selectCityDIV").data('destination'));

            select.each(function() {
                var target = $(this);
                var targetStr = $(this).text();
                if (targetStr == 'null') {
                    target.text('');
                }
            });

            $('#mask').show();
            $('.mask').show();
            $('.info').show();
            $('.footer').show();
            $('.contaitent').show();
            $('.loading').hide();
            history.back(-1);


        } else { //取消
            $('#mask').show();
            $('.mask').show();
            $('.info').show();
            $('.footer').show();
            $('.contaitent').show();
            $('.loading').hide();
            history.back(-1);
        }
        $('.loading').hide();
    });


    // 去重
    function uniQueue(arr) {
        var new_arr = [];
        for (var i = 0, length = arr.length; i < length; i++) {
            var items = arr[i];
            if ($.inArray(items, new_arr) == -1) {
                new_arr.push(items);
            }
        }
        setData('new_arr', new_arr);
    }

    function uniQueueEn(arr) {
        var new_en = [];
        for (var i = 0, length = arr.length; i < length; i++) {
            var items = arr[i];

            if ($.inArray(items, new_en) == -1) {

                new_en.push(items);
            }
        }
        common.setData('new_en', new_en);
    }

    function mergeArr(a, b) {
        var result = [];
        for (var i = 0; i < a.length; i++) {
            result.push(a[i]);
            result.push(b[i]);
        }
        common.setData('chinese_english', result);

        return result;
    }

    // 点击国家返回上一级
    $('#img').on('click', function() {
        //onPopState();
        history.back(-1);
        $('.loading').hide();
    });

    // 点击是否
    $('.list-div').on('click', 'label', function() {
        var $this = $(this);
        var $index = $this.index();
        if ($this.hasClass("checkedItem") == true) {
            $this.addClass("pp").siblings().removeClass('pp');
        }
        $("#nav li").each(function() {
            var code = $(this).attr("code");
            if (code == "PK00002618") {
                if ($index == "0") {
                    $(this).hide();
                }
                if ($index == "2") {
                    $(this).show();
                }
            }
            var $nav = $('#nav');
            $nav.find('li').first().addClass('active').siblings().removeClass('active');
            moneyTot(0);
        });
        setData('index', $index);
    });


})
