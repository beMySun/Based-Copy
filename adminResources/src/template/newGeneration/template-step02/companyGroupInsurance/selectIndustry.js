// 选择行业分类
$(function() {

    var industryData = [];

    $.ajax({
        type: "POST",
        contentType: "application/json;utf-8",
        url: '/icp/mobileSinglePlatform/queryGroupAhsIndustry.do',
        async: false,
        dataType: 'json',
        success: function(res) {
            industryData = res.industryList;
        },
        error: function(res) {}
    });

    var titleArr = ['请选择'];
    var selectList = [];
    window.selectIndustry = {
        createHTML: function() {

            if (!selectList.length) {
                selectList = selectIndustry.getData();
            }

            console.log(titleArr, 'a');
            var str = '<p class="hadSelected">' + titleArr.join('/') + '</p>';
            selectList.forEach(function(value, i) {
                str += ['<p class="selectList" onclick="window.selectIndustry.changeIndustryHTML(' + i + ')" datacode="' + value[0] + '" index="' + i + '">',
                    '<span>' + value[1] + '</span>',
                    '<i class="iconRight icon-right"></i>',
                    '</p>'
                ].join("");
            });

            $('#selectIndustry').html(str).show();
            $('.page').hide();
        },
        getData: function(level1, level2) {
            var list = [];
            if (!level1) {
                industryData.forEach(function(value, index) {
                    if (list.length) {
                        for (var i = 0, len = list.length; i < len; i++) {
                            if (list[i][0] == value.industry_code_level1) return;
                        }
                    };
                    var ele = [];
                    ele.push(value.industry_code_level1);
                    ele.push(value.industry_name_level1);
                    list.push(ele);
                })
            } else if (level1 && !level2) {
                industryData.forEach(function(value, index) {
                    var ele = [];
                    if (value.industry_name_level1 == level1) {
                        if (list.length) {
                            for (var i = 0, len = list.length; i < len; i++) {
                                if (list[i][1] == value.industry_name_level2) return;
                            }
                        };
                        ele.push(value.industry_code_level1);
                        ele.push(value.industry_name_level2);
                        list.push(ele);
                    }
                })
            } else if (level2) {
                industryData.forEach(function(value, index) {
                    var ele = [];
                    if (value.industry_name_level1 == level1 && value.industry_name_level2 == level2) {
                        if (list.length) {
                            for (var i = 0, len = list.length; i < len; i++) {
                                if (list[i][1] == value.industry_name_level3) return;
                            }
                        };
                        ele.push(value.industry_code_level1);
                        ele.push(value.industry_name_level3);
                        ele.push(value.industry_statement);
                        list.push(ele);
                    }
                })
            }

            return list;
        },
        changeIndustryHTML: function(i) {
            if (titleArr[0] == '请选择') {
                titleArr.shift()
            };
            console.log(titleArr, 'b')
            var target = $('.selectList').eq(i);
            if (titleArr.length == 2) {
                $('#industryCode').val(target.attr('datacode'));
                $('#industryText').val(selectList[target.attr('index')][1]);
                if (selectList[target.attr('index')][2]) {
                    $('#descriptionParent').show();
                    $('#description').text(selectList[target.attr('index')][2])
                } else {
                    $('#descriptionParent').hide();
                };
                titleArr = ['请选择'];
                selectList = [];
                window.history.back(-1);
                return;
            }
            titleArr.push(selectList[target.attr('index')][1]);
            selectList = this.getData(titleArr[0], titleArr[1]);

            console.log(titleArr, 'c')
            this.createHTML();
        }
    }

    $('#industry').click(function() {
        window.history.pushState({
            title: '#selectIndustry'
        }, '#selectIndustry', window.location.href + '#selectIndustry');
        selectIndustry.createHTML();
    });

    window.onpopstate = function(e) {
        $('.page').show();
        $('#selectIndustry').hide();
        titleArr = ['请选择'];
        selectList = [];
    }
});
