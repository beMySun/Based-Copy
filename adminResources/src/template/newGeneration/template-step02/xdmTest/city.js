;
(function($, undefined) {
    window.provinces = [{
        'provinceName': '北京市',
        'provinceCode': '110000'
    }, {
        'provinceName': '重庆市',
        'provinceCode': '500000'
    }, {
        'provinceName': '上海市',
        'provinceCode': '310000'
    }, {
        'provinceName': '天津市',
        'provinceCode': '120000'
    }, {
        'provinceName': '安徽省',
        'provinceCode': '340000'
    }, {
        'provinceName': '福建省',
        'provinceCode': '350000'
    }, {
        'provinceName': '甘肃省',
        'provinceCode': '620000'
    }, {
        'provinceName': '广东省',
        'provinceCode': '440000'
    }, {
        'provinceName': '广西壮族自治区',
        'provinceCode': '450000'
    }, {
        'provinceName': '贵州省',
        'provinceCode': '520000'
    }, {
        'provinceName': '海南省',
        'provinceCode': '460000'
    }, {
        'provinceName': '河北省',
        'provinceCode': '130000'
    }, {
        'provinceName': '河南省',
        'provinceCode': '410000'
    }, {
        'provinceName': '黑龙江省',
        'provinceCode': '230000'
    }, {
        'provinceName': '湖北省',
        'provinceCode': '420000'
    }, {
        'provinceName': '湖南省',
        'provinceCode': '430000'
    }, {
        'provinceName': '吉林省',
        'provinceCode': '220000'
    }, {
        'provinceName': '江苏省',
        'provinceCode': '320000'
    }, {
        'provinceName': '江西省',
        'provinceCode': '360000'
    }, {
        'provinceName': '辽宁省',
        'provinceCode': '210000'
    }, {
        'provinceName': '内蒙古自治区',
        'provinceCode': '150000'
    }, {
        'provinceName': '宁夏回族自治区',
        'provinceCode': '640000'
    }, {
        'provinceName': '青海省',
        'provinceCode': '630000'
    }, {
        'provinceName': '山东省',
        'provinceCode': '370000'
    }, {
        'provinceName': '山西省',
        'provinceCode': '140000'
    }, {
        'provinceName': '陕西省',
        'provinceCode': '610000'
    }, {
        'provinceName': '四川省',
        'provinceCode': '510000'
    }, {
        'provinceName': '西藏自治区',
        'provinceCode': '540000'
    }, {
        'provinceName': '新疆维吾尔自治区',
        'provinceCode': '650000'
    }, {
        'provinceName': '云南省',
        'provinceCode': '530000'
    }, {
        'provinceName': '浙江省',
        'provinceCode': '330000'
    }];

    var sortList = window.provinces;


    var City = function() {
        this.selected; //回调函数
        this.isInit = false;
        this.historyPage = [];
        this.init = function() {
            if (this.isInit)
                return;
            var root = createHtmlElement('select_city');
            $(root).css('height', '100%');
            // $(root).css('padding-top', '10%');
            $(root).css('border-top', '1px solid #ccc');
            root.appendChild(createSearchResult());
            root.appendChild(createProvinceView());
            root.appendChild(createCityView());
            root.appendChild(createAreaView());
            document.body.appendChild(root);
            this.loadProvince();
            this.bindSearch(); //搜索事件
            this.isInit = true; //初始化完成
        };

        //加载省份
        this.loadProvince = function() {
            var provinceId = $('#id_province');
            $(provinceId).children().remove();
            var provinceHeaderView = createProvinceHeaderView();
            $(provinceId).append(provinceHeaderView);
            //省市CELL
            for (var province in sortList) {
                //是否直辖市
                // var isSpecial = sortList[province].cityCode;
                // isSpecial = isSpecial ? true : false;
                // var code = '';
                // var name= '';
                // if (isSpecial) {
                //  code = sortList[province].cityCode;
                //  name = sortList[province].cityName;
                // } else {
                //  code = sortList[province].provinceCode;
                //  name = sortList[province].provinceName;
                // }
                var code = sortList[province].provinceCode;
                var name = sortList[province].provinceName;
                var provinceCellView = createProvinceCellView(code, name);
                $(provinceId).append(provinceCellView);
            }
            this.bindProvince(provinceId);
        };

        //绑定省份事件
        this.bindProvince = function(view) {
            var self = this;

            $('.pseudo_province', $(view)).click(function(e) {
                // console.log('绑定省份事件');
                var code = $(this).attr('code');
                var name = $(this).attr('name');

                $("input[name=provinceName]").val(name);
                $("input[name=provinceCode]").val(code);
                // var spenamecial = $(this).attr('special');
                // if (special === 'true') {
                //  self.loadAreaView(code,name);
                // } else {
                //  self.loadCityView(code,name);
                // }
                //$(".loadingDiv").show();

                self.loadCityView(code, name);
                window.history.pushState({
                    title: '#selectCity2'
                }, '#selectCity2', window.location.href + '#selectCity2');
                window.onpopstate = function(e) {
                    if ($('#id_city').css('display') === 'none') {
                        $('#select_city').hide();
                        $(".title").text("投保信息");
                        window.scrollTo(0, window.innerHeight);
                    } else {
                        $('#id_province').show();
                        $('#id_city').hide();
                    }


                }
            });
        };

        //绑定城市事件
        this.bindCity = function(view) {
            var self = this;
            $(".loading").hide();
            $(window).scrollTop(0);
            $('.pseudo_city', $(view)).click(function(e) {
                // console.log('绑定城市事件');
                var code = $(this).attr('code');
                var name = $(this).attr('name');
                $("input[name=cityName]").val(name);
                $("input[name=cityCode]").val(code);
                // self.loadAreaView(code, name); //test sunjianguo
                if (self.selected) {
                    self.selected();
                }

            });
        };

        //绑定县区事件
        this.bindArea = function(view) {
            var cityNameInput = $('#cityName');
            var areaId = $('#id_area');
            var self = this;
            $(".loading").hide();

            //  console.log('绑定县区事件');
            $('.pseudo_area', $(view)).on('click', function(e) {
                // console.log('pseudo_area click');
                e.preventDefault();
                self.isAjaxStopResponse = true;
                if (self.selected) {
                    var resultData = {};
                    resultData.areaCode = $(this).attr('code');
                    resultData.areaName = $(this).attr('name');
                    if ($(view).attr('id') === 'id_search') { //搜索出来的县没有上级城市名称，从后来取出
                        var code = $(this).attr('code');
                        self.getCityInfo(code.substring(0, 2) + '0000', 'getCountyList', function(data) {
                            var countyList = data.countyList || [];
                            var isGetData = 0;
                            for (var row in countyList) {
                                var superCode = countyList[row].countyCode;
                                if (superCode === code.substring(0, 4) + '00') {
                                    resultData.cityCode = superCode;
                                    resultData.cityName = countyList[row].countyName;
                                    self.selected(resultData);
                                    self.hide();
                                    isGetData = 1;
                                    break;
                                }
                            }
                            if (!isGetData) { //如果没有找到数据，处理石河子市的特殊问题
                                resultData.cityCode = resultData.cityName = '';
                                self.selected(resultData);
                                self.hide();
                            }
                        });
                    } else { //选省 市 区 直接带出数据
                        var city = $('#header_area', $(areaId));
                        resultData.cityCode = $(city).attr('code');
                        resultData.cityName = $(city).attr('name');
                        self.selected(resultData);
                        self.hide();
                    }
                }
                //$(".loadingDiv").show();
            });
        };

        //加载城市视图
        this.loadCityView = function(provinceCode, provinceName) {
            var self = this;
            var cityId = $('#id_city');

            // console.log('city view');

            // $(".loading").show();

            $(cityId).children().remove();
            var cityHeaderView = createCityHeaderView(provinceName);
            $(cityId).append(cityHeaderView);

            this.getCityInfo(provinceCode, 'getCityList', function(data) {

                var cityList = data.cityList || [];

                for (var row in cityList) {
                    var tmp = {
                        code: cityList[row].cityCode,
                        name: cityList[row].cityChineseName
                    };
                    var cityCellView = createCityCellView(tmp.code, tmp.name);
                    $(cityId).append(cityCellView);
                }
                self.bindCity(cityId);
                self.showCity();
            });

        };

        //加载区县视图
        this.loadAreaView = function(cityCode, cityName) {
            // console.log('加载区县视图');

            var self = this;
            // $(".loading").show();
            var areaId = $('#id_area');
            $(areaId).children().remove();
            var areaHeaderView = createAreaHeaderView(cityName);
            $(areaHeaderView).attr('id', 'header_area');
            $(areaHeaderView).attr('code', cityCode);
            $(areaHeaderView).attr('name', cityName);
            $(areaId).append(areaHeaderView);
            this.getCityInfo(cityCode.substr(0, 4), 'getCountyList', function(data) { //cityCode取前4位是为了适配后台接口
                var countyList = data.countyList || [];
                if (countyList.length === 0) { //市级下面没有 县 区
                    if (self.selected) {
                        var resultData = {};
                        resultData.areaCode = '';
                        resultData.areaName = '';
                        resultData.cityCode = cityCode;
                        resultData.cityName = cityName;
                        self.selected(resultData);
                        self.hide();
                    }
                    return;
                }
                for (var row in countyList) {
                    var tmp = {
                        code: countyList[row].countyCode,
                        name: countyList[row].countyName
                    };
                    var cityCellView = createAreaCellView(tmp.code, tmp.name);
                    $(areaId).append(cityCellView);
                }
                self.bindArea(areaId);
                self.showArea();
            });
            //$(".loadingDiv").hide();
        };

        //获取 城市、县区 信息
        this.getCityInfo = function(code, method, callBack) {
            var data = {
                provinceCode: code,
                cityCode: code,
                method: method
            };

            $.ajax({
                url: '/icp/mobile_single_insurance/queryProvincesAndCities.do', 
                datatype: 'json',
                type: 'post',
                // type: 'get',
                data: data,
                success: function(result) {
                    callBack(result ? JSON.parse(result) : []);
                    // result && typeof result === 'string' && JSON.parse(result);
                    // callBack(result);
                },
                error: function(XMLHttpRequest) {
                    console.error('调用接口出错,' + XMLHttpRequest);
                }
            });
        };

        //返回处理
        this.back = function() {
            if (this.historyPage.length > 1) {
                this.historyPage.pop();
                var currentView = this.historyPage[this.historyPage.length - 1];
                this.historyPage.pop();
                if (currentView === 'city') {
                    this.showCity();
                } else if (currentView === 'province') {
                    this.showProvince();
                } else if (currentView === 'search') {
                    this.showSearch();
                }
            } else {
                $('#select_city').hide();
                $('main.content').hide();
                this.historyPage = [];
                sessionStorage.setItem('CurrentView', 'insureOfferCustomer');
            }
            return true;
        };

        //回调函数设置
        this.selectedCity = function(sel) {
            this.selected = sel;
        };

        this.showSearch = function() {
            $('#id_search').show();
            $('#id_province').hide();
            $('#id_city').hide();
            $('#id_area').hide();
            $('#id_search_header').show();
            $('#select_city').show();
            $('main.content').hide();
            this.historyPage = ['search'];
        };

        this.showProvince = function() {
            $('#id_province').show();
            $('#id_search').hide();
            $('#id_city').hide();
            $('#id_area').hide();
            $('#id_search_header').show();
            $('#select_city').show();
            $('#citySearchField').val('');
            $('main.content').hide();
            this.historyPage = ['province'];
            sessionStorage.setItem('CurrentView', 'province');
        };

        this.showCity = function() {
            $('#id_province').hide();
            $('#id_search').hide();
            $('#id_city').show();
            $('#id_area').hide();
            $('#id_search_header').hide();
            $('#select_city').show();
            $('main.content').hide();
            this.historyPage.push('city');
        };

        this.showArea = function() {
            $('#id_province').hide();
            $('#id_search').hide();
            $('#id_city').hide();
            $('#id_area').show();
            $('#id_search_header').hide();
            $('#select_city').show();
            $('main.content').hide();
            this.historyPage.push('area');
        };

        //隐藏城市选择列表，显示选择结果
        this.hide = function() {
            $("#select_city").hide();
            $('main.content').show();
            this.historyPage = [];
        };

        //绑定搜索事件
        this.bindSearch = function() {
            var self = this;
            var input = $('#citySearchField');
            $(input).bind('input', function(e) {
                var keyword = $(this).val().toLowerCase();
                if (!keyword) {
                    self.showProvince();
                } else {
                    self.loadSearch(keyword);
                }
            });
        };

        //载入搜索结果
        this.loadSearch = function(keyword) {
            var self = this;
            var searchId = $('#id_search');
            this.search(keyword, function(data) {
                if (data.length === 0)
                    return;
                $(searchId).children().remove();
                var isAllTown = true; //只要有一个县级 那么就显示市级
                var cityList = []; //市级
                var townList = []; //县级
                for (var row in data) {
                    var code = data[row].cityCode;
                    //正常的code 省级CODE不会出现 最后两位足以判断是市还是县、区
                    if (code.length !== 6)
                        continue;
                    if (code.substring(4, 6) === '00') { //市级
                        cityList.push(data[row]);
                        isAllTown = false;
                    } else { //县、区
                        townList.push(data[row]);
                    }
                }

                if (isAllTown) {
                    for (var row in townList) {
                        var tmp = {
                            code: townList[row].cityCode,
                            name: townList[row].cityName
                        };
                        var cellView = createAreaCellView(tmp.code, tmp.name);
                        $(searchId).append(cellView);
                    }
                    self.bindArea(searchId);
                } else {
                    for (var row in cityList) {
                        var tmp = {
                            code: cityList[row].cityCode,
                            name: cityList[row].cityName
                        };
                        var cellView = self.createCityCellView(tmp.code, tmp.name);
                        $(searchId).append(cellView);
                    }
                    self.bindCity(searchId);
                }
                self.showSearch();
            });
        };

        //创建一个html元素
        function createHtmlElement(id) {
            var view = document.createElement('div');
            view.setAttribute('id', id);
            view.setAttribute('style', 'display: none; width: 100%; background-color: rgb(255, 255, 255);');
            return view;
        }

        //创建搜索头部视图
        function createSearchHeader() {
            var p = document.createElement('p');
            p.setAttribute('id', 'id_search_header');
            p.setAttribute('style', 'padding: 20px 25px; border-bottom: 1px solid #D0D0D0;');
            var input = document.createElement('input');
            input.setAttribute('id', 'citySearchField');
            input.setAttribute('class', 'com_textfield com_searchfield');
            input.setAttribute('type', 'text');
            input.setAttribute('placeholder', '');
            input.setAttribute('style', '478px');
            p.appendChild(input);
            return p;
        }

        //创建结果的每一行
        function createCellView(code, name, type) {
            var p = document.createElement('p');
            //pseudo_area 样式不存在用于添加事件
            p.setAttribute('class', 'com_list_table pseudo_' + type);
            p.setAttribute('code', code);
            p.setAttribute('name', name);
            // if ( type === 'province') {
            //  //直辖市
            //  p.setAttribute('special',isSpecial ? true : false);
            // }
            //显示名称 left
            var spanLeft = document.createElement('span');
            if (type === 'area') {
                spanLeft.setAttribute('class', 'com_list_table_lcell');
            } else {
                if (code == "110000") {
                    spanLeft.setAttribute('class', 'com_list_header_left');
                    // spanLeft.setAttribute('style', 'padding-top:10px;');
                } else {
                    spanLeft.setAttribute('class', 'com_list_header_left');
                }
            }
            spanLeft.innerHTML = name;
            // right
            var spanRight = document.createElement('span');
            if (type === 'area') {
                spanRight.setAttribute('class', 'com_list_table_rcell');
            } else {
                spanRight.setAttribute('class', 'com_list_header_right');
                if (code.substr(4, 2) != '00') { //处理石河子市的右箭头问题，石河子市下面没有地区,直接隐藏右箭头
                    spanRight.style.visibility = 'hidden';
                }
            }
            var spanRightImg = document.createElement('img');
            spanRightImg.setAttribute('class', 'com_list_header_right_img');
            if ($("input[name=insuranceEndTime]").val() != "") {
                spanRightImg.setAttribute('src', 'img/icon_right.png');
            } else {
                spanRightImg.setAttribute('src', 'img/icon_right.png');
            }


            //spanRight.innerHTML = '&nbsp;';
            //追加
            p.appendChild(spanLeft);
            spanRight.appendChild(spanRightImg);
            p.appendChild(spanRight);

            return p;
        }

        //创建公共头部
        function createHeaderView(name) {
            var p = document.createElement('p');
            p.setAttribute('style', 'height: 50px; line-height: 50px; text-align: center; border-bottom: 1px solid #D8D8D8;font-size:21px;');
            p.innerHTML = name;
            return p;
        }

        //创建搜索结果视图
        function createSearchResult() {
            return createHtmlElement('id_search');
        }

        /* -- 省   -- */
        //创建省份视图
        function createProvinceView() {
            return createHtmlElement('id_province');
        }

        //创建省份视图头部
        function createProvinceHeaderView() {
            return document.createElement('p');
        }

        //创建省份结果
        function createProvinceCellView(code, name) {
            return createCellView(code, name, 'province');
        }

        /* -- 市   -- */
        //创建市视图
        function createCityView() {
            return createHtmlElement('id_city');
        }

        //创建市头部
        function createCityHeaderView(name) {
            return createHeaderView(name);
        }

        //创建市结果
        function createCityCellView(code, name) {
            return createCellView(code, name, 'city');
        }

        /* -- 县区   -- */
        //创建县区视图
        function createAreaView() {
            return createHtmlElement('id_area');
        }

        //创建县区头部
        function createAreaHeaderView(name) {
            return createHeaderView(name);
        }

        //创建县区结果
        function createAreaCellView(code, name) {
            return createCellView(code, name, 'area');
        }

        //调用初始化函数
        this.init();
    }

    window.City = new City();
})(Zepto);
