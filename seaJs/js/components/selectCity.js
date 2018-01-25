/**
 * 通用工具类
 */

define("components/selectCity",function(require,exports, module) {

    var newLayer = require("myLayer");

    var selectCity = {

	    	init:function(){
	           
		        function  setData (name, obj) {
		            if (typeof obj === 'object') {
		                obj = JSON.stringify(obj);
		            }
		            sessionStorage.setItem(name, obj);
		        };

		        function getData (name) {
		            var data;
		            var obj = sessionStorage.getItem(name);
		            try {
		                data = obj && JSON.parse(obj) || '';
		            } catch (e) {
		                data = obj;
		            }
		            return data
		        };

		         function  removeData(name) {
		            sessionStorage.removeItem(name);
				};




	
		    $('#selectCityDIV').on('click', function () {

			    var url = window.location.href;
			    if (url.indexOf("imNo") > -1) {
			        url = delQueStr(url, 'imNo');
			        url = delQueStr(url, 'appid');
			        window.history.pushState({}, 0, url);
			    }


		        $("#city p img").removeClass("active-img");
		        $(".search-box input").val('');
		        $(".contaitent").hide();
		        $("#search").hide();
		        $("#search-list").hide();
		        $("#city").show();
		        $("#wrapper").show();
		        $('#loadingDiv').show();
		        var $str = '';
		        var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		        for (var p = 0; p < arr.length; p++) {
		            $str += '<div class = "com_list_table_title" name="' + arr[p] + '"><span>' + arr[p] + '</span>' +
		                '<div id="' + arr[p] + '"></div></div>';
		        }
		        // 拼音标题
		        $("#id_province").html($str);

		        //window.common.ajax('/icp/mobileSinglePlatform/queryCountryInfoList.do', {}, queryProInfo);

		        var cities = JSON.parse(window.sessionStorage.getItem('cityList'))

		        if (cities) {
		        	console.log('1');
		        	queryProInfo(cities);
		        } else {
		        	console.log('2');
			        $.ajax({
		                type: 'get',
		                //url: '/icp/mobileSinglePlatform/queryCountryInfoList.do',
		                url:'../js/debug/citylist.json',
		                dataType: 'json',
		                contentType: "application/json",
		                data: {},
		                success: function(res){
		                	console.log(res);
		                	window.sessionStorage.setItem('cityList',JSON.stringify(res));
		                	queryProInfo(res);
		                },
		                complete: function () {
		                    $('#loadingDiv').hide();
		                },
		                error: function (XMLhttprequest) {
		                    console.log(XMLhttprequest);
		                }
		            });
		        }

		       
		       
		        function isInAraay(obj,arr) {
		            var i = arr.length;
		            while (i--) {
		                if (arr[i] == obj) {
		                    return true;
		                }
		            }
		            return false;
		        };

		        function queryProInfo(res) {
		        	var forbidAraeCode = [107,109,119,122,123,166,167,168,171,175,177,182,196,197,204,209,211,220,224,225,227,228,231,402];
		            var resultMap = res.resultMap;
		            var countryInfoList = resultMap.countryInfoList;
		            var length = countryInfoList.length;
		            var str = '';
		            var htmlStr = '';
			            for (var j = 0; j < arr.length; j++) {
			                var countryInitial = arr[j];
			                for (var i = 0; i < length; i++) {
			                    if (countryInitial == countryInfoList[i].countryInitial) {
			                       if(isInAraay(countryInfoList[i].countryCode,forbidAraeCode)) {
			                            str += '<p class="com_list_table pseudo_province disabled" code="'
			                            + countryInfoList[i].countryCode + '" data-id = "' + countryInfoList[i].countryId + '" data-spell = "'
			                            + countryInfoList[i].countrySpell + '"><span class="chinese" >' + countryInfoList[i].countryChineseName
			                            + '</span><span>' + countryInfoList[i].countryEnglishName + '</span><img class="img"></p>';

			                       } else {
			                            str += '<p class="com_list_table pseudo_province" code="'
			                            + countryInfoList[i].countryCode + '" data-id = "' + countryInfoList[i].countryId + '" data-spell = "'
			                            + countryInfoList[i].countrySpell + '"><span class="chinese" >' + countryInfoList[i].countryChineseName
			                            + '</span><span>' + countryInfoList[i].countryEnglishName + '</span><img class="img"></p>';

			                       }
			                        $("#" + arr[j]).html(str);

			                    }
			                }
			                str = '';
		                // 上次勾选的值
		                $("#city p").each(function () {
		                    $('.active-img').attr("src", "images/icon_gou3.png");

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
		            $(".search_input").bind('keydown', function (event) {
		                if (event.keyCode == 13 || event.keyCode == 8) {
		                    searchList();
		                }
		            });

		            function searchList() {
		                var Arr = [];
		                var active = $(".active-img");
		                active.each(function (e) {
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
		                        str += '<p class="com_list_table pseudo_province">' + $arr[j] + '<img class="img"</p>';
		                        $("#search-list").html(str);
		                    }
		                    // 上次勾选的值
		                    $("#search p").each(function () {
		                        active.attr("src", "images/icon_gou3.png");
		                        var $this = $(this);
		                        var targetStr = $this.children().eq(0).text();
		                        var img = $this.children("img");
		                        if (targetStr == cityArr[0] || targetStr == cityArr[1] || targetStr == cityArr[2] || targetStr == cityArr[3] || targetStr == cityArr[4] || targetStr == cityArr[5] || targetStr == cityArr[6]) {
		                            img.addClass("active-img");
		                        }
		                    });
		                    $('.active-img').attr("src", "images/icon_gou3.png");
		                    $('#loadingDiv').hide();
		                }
		            }
		            // 点击中英文搜索
		            $(".search_icon").on('click', function () {
		                searchList()
		            });
		            $('#loadingDiv').hide();
		        }

		        window.history.pushState({title: '#xzgj'}, '#xzgj', window.location.href + '#xzgj');
		        window.onpopstate = function (e) {
		            $(".contaitent").show();
		            $('#hideInsuranceClause').hide();
		            $("#city").hide();
		        };
		    });


		    // 点击选中的国家
		    $('.list-city').on('click', 'p', function () {
		        var active = $(".active-img");
		        var $this = $(this);
		        var img = $this.children("img");
		        var text = img.siblings().eq(0).text();
		        var length = $("#id_province .active-img").length;
		        if (img.hasClass("active-img")) {
		            img.removeClass("active-img");
		            $("#city p").each(function () {
		                var $this = $(this);
		                var Img = $this.children("img");
		                var targetStr = $this.children().eq(0).text();
		                if (targetStr == text) {
		                    Img.removeClass("active-img");
		                }
		            });
		        } else if (length < 7) {
		            img.addClass("active-img");
		            $('.active-img').attr("src", "images/icon_gou3.png");
		            $("#city p").each(function () {
		                var $this = $(this);
		                var Img = $this.children("img");
		                var targetStr = $this.children().eq(0).text();
		                if (targetStr == text) {
		                    Img.addClass("active-img");
		                }
		            });
		        }
		        active.attr("src", "images/icon_gou3.png");
		    });
	    //  点击确定,取消
		    $('.sure').on('click', 'li', function () {

		        var index = $(this).index();

		        if (index == 1) { //确定
		        	console.log('确定')
		            var arr = [];
		            $('.active-img').each(function (e) {
		                var a = $(this).parent().find('span.chinese').text();
		                arr.push(a);
		            });
		            uniQueue(arr);
		            var newArr = getData("new_arr"); // 去重之后的数据

		            if ( (newArr.length == 1) && newArr[0] == "申根地区" ) {
		                newLayer.dialog('按部分使（领）馆要求，保单的目的地必须包含落地国（办理签证的国家）和“申根国家”字样，我们建议您增加选择办理签证的国家，例如：“德国，申根国家”，您可以继续选择 进行修改，点击“确定”则按照内容提交。');
		            } 

		            var select = $("#selectCityDIV"); // 把选择的国家填入页面
		            select.val(newArr);
		            select.each(function () {
		                var target = $(this);
		                var targetStr = $(this).text();
		                if (targetStr == 'null') {
		                    target.text('');
		                }
		            });

		             history.back(-1);
		             $('.contaitent').show();

		        } else { //取消

		           history.back(-1);
		            $('#loadingDiv').hide();
		            $('.contaitent').show();
		        }
		        $('#loadingDiv').hide();
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

		    // 点击国家返回上一级
		    $('#img').on('click', function () {
		        //onPopState();
		        history.back(-1);
		        $('#loadingDiv').hide();
		    });

		    // 点击是否
		    $('.list-div').on('click', 'label', function () {
		        var $this = $(this);
		        var $index = $this.index();
		        if ($this.hasClass("checkedItem") == true) {
		            $this.addClass("pp").siblings().removeClass('pp');
		        }
		        $("#nav li").each(function () {
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
	    }
    };

  module.exports = selectCity;

});







