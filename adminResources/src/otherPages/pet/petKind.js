; (function () {
	'use strict';
	var isUploading = false;
	var DOG_LIST = [{
		"petVarietyCode": "0100",
		"petVarietyName": "京巴"
	},
	{
		"petVarietyCode": "0101",
		"petVarietyName": "博美"
	},
	{
		"petVarietyCode": "0102",
		"petVarietyName": "吉娃娃"
	},
	{
		"petVarietyCode": "0103",
		"petVarietyName": "比格犬"
	},
	{
		"petVarietyCode": "0104",
		"petVarietyName": "沙皮"
	},
	{
		"petVarietyCode": "0105",
		"petVarietyName": "斑点"
	},
	{
		"petVarietyCode": "0106",
		"petVarietyName": "巴吉度"
	},
	{
		"petVarietyCode": "0107",
		"petVarietyName": "可卡"
	},
	{
		"petVarietyCode": "0108",
		"petVarietyName": "银狐"
	},
	{
		"petVarietyCode": "0115",
		"petVarietyName": "杜宾"
	},
	{
		"petVarietyCode": "0114",
		"petVarietyName": "哈士奇"
	},
	{
		"petVarietyCode": "0113",
		"petVarietyName": "小鹿犬"
	},
	{
		"petVarietyCode": "0112",
		"petVarietyName": "西施"
	},
	{
		"petVarietyCode": "0111",
		"petVarietyName": "西地高梗"
	},
	{
		"petVarietyCode": "0110",
		"petVarietyName": "腊肠犬"
	},
	{
		"petVarietyCode": "0109",
		"petVarietyName": "贵宾"
	},
	{
		"petVarietyCode": "0116",
		"petVarietyName": "苏格兰梗"
	},
	{
		"petVarietyCode": "0117",
		"petVarietyName": "西高地白梗"
	},
	{
		"petVarietyCode": "0118",
		"petVarietyName": "拉布拉多"
	},
	{
		"petVarietyCode": "0119",
		"petVarietyName": "柯基犬"
	},
	{
		"petVarietyCode": "0121",
		"petVarietyName": "蝴蝶犬"
	},
	{
		"petVarietyCode": "0123",
		"petVarietyName": "马尔济斯犬"
	},
	{
		"petVarietyCode": "0125",
		"petVarietyName": "喜乐蒂"
	},
	{
		"petVarietyCode": "0126",
		"petVarietyName": "松狮"
	},
	{
		"petVarietyCode": "0127",
		"petVarietyName": "金毛"
	},
	{
		"petVarietyCode": "0129",
		"petVarietyName": "约克夏"
	},
	{
		"petVarietyCode": "0130",
		"petVarietyName": "雪纳瑞"
	},
	{
		"petVarietyCode": "0131",
		"petVarietyName": "圣伯纳"
	},
	{
		"petVarietyCode": "0132",
		"petVarietyName": "比熊"
	},
	{
		"petVarietyCode": "0133",
		"petVarietyName": "边境牧羊犬"
	},
	{
		"petVarietyCode": "0135",
		"petVarietyName": "苏牧"
	},
	{
		"petVarietyCode": "0136",
		"petVarietyName": "泰迪"
	},
	{
		"petVarietyCode": "0137",
		"petVarietyName": "阿拉斯加"
	},
	{
		"petVarietyCode": "0138",
		"petVarietyName": "古牧"
	},
	{
		"petVarietyCode": "0139",
		"petVarietyName": "萨摩耶"
	},
	{
		"petVarietyCode": "0140",
		"petVarietyName": "茶杯犬"
	},
	{
		"petVarietyCode": "0141",
		"petVarietyName": "其他"
	},
	{
		"petVarietyCode": "0142",
		"petVarietyName": "法国贵宾犬"
	},
	{
		"petVarietyCode": "0143",
		"petVarietyName": "斯开岛梗"
	},
	{
		"petVarietyCode": "0144",
		"petVarietyName": "中华田园犬"
	},
	{
		"petVarietyCode": "0145",
		"petVarietyName": "卷毛比熊犬"
	},
	{
		"petVarietyCode": "0146",
		"petVarietyName": "中国冠毛犬"
	},
	{
		"petVarietyCode": "0147",
		"petVarietyName": "法国斗牛犬"
	},
	{
		"petVarietyCode": "0148",
		"petVarietyName": "北京犬"
	},
	{
		"petVarietyCode": "0149",
		"petVarietyName": "拉萨犬"
	},
	{
		"petVarietyCode": "0150",
		"petVarietyName": "圣伯纳犬"
	},
	{
		"petVarietyCode": "0151",
		"petVarietyName": "八哥犬"
	},
	{
		"petVarietyCode": "0152",
		"petVarietyName": "日本尖嘴犬"
	},
	{
		"petVarietyCode": "0153",
		"petVarietyName": "西施犬"
	},
	{
		"petVarietyCode": "0154",
		"petVarietyName": "约克夏梗"
	},
	{
		"petVarietyCode": "0155",
		"petVarietyName": "比利时格里芬犬"
	},
	{
		"petVarietyCode": "0156",
		"petVarietyName": "沙皮犬"
	},
	{
		"petVarietyCode": "0157",
		"petVarietyName": "丝毛梗"
	},
	{
		"petVarietyCode": "0158",
		"petVarietyName": "西藏獚犬"
	},
	{
		"petVarietyCode": "0159",
		"petVarietyName": "半点"
	},
	{
		"petVarietyCode": "0160",
		"petVarietyName": "迷你杜宾犬"
	},
	{
		"petVarietyCode": "0161",
		"petVarietyName": "美国确架犬"
	},
	{
		"petVarietyCode": "0162",
		"petVarietyName": "凯安梗"
	},
	{
		"petVarietyCode": "0163",
		"petVarietyName": "查理王列鹬犬"
	},
	{
		"petVarietyCode": "0164",
		"petVarietyName": "西部高地白梗"
	},
	{
		"petVarietyCode": "0165",
		"petVarietyName": "布鲁塞尔犬"
	},
	{
		"petVarietyCode": "0166",
		"petVarietyName": "西里汉梗"
	},
	{
		"petVarietyCode": "0167",
		"petVarietyName": "日本狆"
	}
	];

	// 保留其他数据
	var ANIMAL_LIST;

	var imgUrlList = [];

	var pet = {
		init: function () {
			this.bindEvents();
			this.render();
		},
		bindEvents: function () {

			$('.page').on('change', '.pet-type', function () {
				pet.limitAge();
			})
				.on('click', '#selectPetKind', function () {

					var animalType = $('.pet-type').val();
					var animalList;

					if (animalType == '01') {
						animalList = DOG_LIST;
					} else if (animalType = '02') {
						animalList = CAT_LIST;
					} else {
						animalList = DOG_LIST.concat(CAT_LIST);
					}

					ANIMAL_LIST = animalList;
					pet.renderAnimalList(ANIMAL_LIST);
					$('.search-input').val('');
					$('.page').hide();
					$('.suggest-Box').show();

				})
				.on('click', '#pay', function () {
					var result = pet.checkRules();
					if (!result) {
						return false;
					};
					pet.savePetKindData();

					if (isUploading) {
						window.wAlert('文件上传中...')
					} else {
						window.location.href = '../../applicant.html';
					}

				});

			$('.close-search').on('click', function () {
				$('.page').show();
				$('.suggest-Box').hide();
			})

			$('.suggest-sug').on('click', 'li', function () {
				var name = $(this).find('.suggest-text').text();
				var code = $(this).find('.suggest-text').data('petcode');
				$('#selectPetKind').val(name).data('petcode', code);
				$('.page').show();
				$('.suggest-Box').hide();

			});


			// 输入事件触发查找
			$('.search-input').on('input', function () {
				var keyWord = $(this).val();
				if ($(this).val()) {
					$('.clear-input').show();
				} else {
					$('.clear-input').hide();
				}
				var searchList = pet.searchByRegExp(keyWord, ANIMAL_LIST);
				pet.renderAnimalList(searchList);
			});

			$('.clear-input').on('click', function () {
				$('.search-input').val('');
				pet.renderAnimalList(ANIMAL_LIST);
				$(this).hide();
			});

			//拍摄or读取手机图片
			$('.file').on('change', function () {
				var that = this;
				var name = this.files[0].name;
				var	attr = name.substring(name.lastIndexOf('.') + 1);

				if (!/(gif|jpg|jpeg|png|GIF|JPG|PNG)/.test(attr)) {
					window.wAlert('请选择gif|jpg|jpeg|png格式文件')
					return;
				}

				lrz(that.files[0], {
					width: 800
				})
					.then(function (rst) {
						var img = new Image(),
							imgSpan = document.createElement('span'),
							iconRemove = document.createElement('span'),
							iconUploading = document.createElement('div');

						imgSpan.className = 'uploaded-img';
						iconRemove.className = 'icon-remove';
						iconUploading.className = 'uploading';
						imgSpan.appendChild(img);
						imgSpan.appendChild(iconRemove);
						imgSpan.appendChild(iconUploading);
						img.src = rst.base64;
						img.onload = function () {
							$(that).parents('.upload-btn').before(imgSpan);
							writeSessionStorage('imgDTO', getImg());
						};
					});
				isUploading = true;
				$('.uploading').show();

				$.ajax({
					url: "/icp/uploadFile.do",
					type: 'POST',
					cache: false,
					data: new FormData($('#uploadForm')[0]),
					processData: false,
					contentType: false
				}).done(function (res) {
					if (res.resultCode == '00') {
						isUploading = false;
						$('.uploading').hide();
						imgUrlList.push({
							imgUrl: res.fileUrl
						});
					}
				}).fail(function (res) {
					$('.uploading').hide();
					isUploading = false;
				}).always(function () {
					$('.uploading').hide();
					isUploading = false;
				})

			});

			//删除照片
			$('.img-container').on('click', '.icon-remove', function () {
				var $this = $(this),
					$wrapRow = $this.parents('.wrap-row');
				$this.parent().remove();
				var deletedIndex = $this.index();
				imgUrlList.splice(deletedIndex, 1);
				writeSessionStorage('imgDTO', getImg());
			});

			// 图片查看
			$('.page').on('click', '.uploaded-img img', function () {
				var URI = $(this).attr('src');
				$('.layer img').eq(0).attr('src', URI);
				$('.layer').addClass('active');
			})

			// 取消查看
			$('.layer').on('click', function () {
				$(this).removeClass('active');
			});


		},

		searchByRegExp: function (keyWord, list) {
			if (!(list instanceof Array)) {
				return;
			}
			var len = list.length;
			var arr = [];
			var reg = new RegExp(keyWord);
			for (var i = 0; i < len; i++) {
				//如果字符串中不包含目标字符会返回-1
				if (list[i].petVarietyName.match(reg)) {
					arr.push(list[i]);
				}
			}
			return arr;
		},
		renderAnimalList: function (data) {
			var str = '';
			$.each(data, function (index, item) {
				str += '<li><span class="suggest-text" data-petcode=' + item.petVarietyCode + '>' + item.petVarietyName + '</span> <i class="icon-leftup"></i></li>'
			});
			$('.suggest-sug').empty().append(str);
		},

		render: function () {
			var submit = JSON.parse(window.sessionStorage.getItem('submit'));
			var isShowUploader = submit.isShowUploader;

			if (isShowUploader) {
				$('#uploader-box').show();
				//返回时，恢复图片数据
				var imgSession = readSessionStorage('imgDTO');
				var petTarget = readSessionStorage('petTarget');
				if (petTarget) {
					imgUrlList = petTarget.imgUrlList;
				}

				if (imgSession) {
					for (var i in imgSession) {
						var html = '';
						for (var j = 0, arr = imgSession[i]; j < arr.length; j++) {
							html += '<span class="uploaded-img"><img src="' + arr[j] + '"><span class="icon-remove"></span></span>';
						}
						$('.img-container').eq(i).prepend(html);
					}
				}
			} else {
				$('#uploader-box').hide();
			}
			$('#packageAmount').text(submit.packageAmount);
			pet.limitAge();

		},

		limitAge: function () {
			var submit = JSON.parse(window.sessionStorage.getItem('submit'));
			var kindId = $('.pet-type').val();
			var packageName = submit.packageName;
			if (kindId === '01') {
				if (packageName.indexOf('+') > 0) {
					pet.changeAge(8);
				}
			} else if (kindId === '02') {
				if (packageName.indexOf('+') > 0) {
					pet.changeAge(10);
				}
			} else {
				pet.changeAge(13);
			};
		},
		changeAge: function (num) {
			var submit = JSON.parse(window.sessionStorage.getItem('submit'));
			var option = '<option value="00">0.5岁</option>';

			for (var i = 1; i <= num; i++) {
				var j = i < 10 ? '0' + i : i;
				option += '<option value="' + j + '">' + j + '岁</option>';
			};
			$('.pet-age').html(option);
			if (num > 11) {
				$('.pet-age option').eq($('.pet-age option').length - 1).remove();
				$('.pet-age').append('<option value="13">12岁以上</option>');
			}
		},
		checkRules: function () {

			var reg = /[^(无|否|空|没)]/;
			var nameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/; // 限制为汉字和字母
			var hairReg = /^[\u4e00-\u9fa5]+$/; // 限制为汉字
			var numberReg = /^(0|[1-9][0-9]*)$/


			if (!$('.pet-kind').val().trim()) {
				window.wAlert('请选择宠物品种');
				return false;
			}

			if (!reg.test($.trim($('.pet-certificate').val().trim()))) {
				window.wAlert('请正确填写宠物身份标识符');
				return false;
			};

			if (!$('.pet-kind').val().trim()) {
				window.wAlert('请选择宠物品种');
				return false;
			}

			if (!nameReg.test($('.pet-name').val().trim())) {
				window.wAlert('宠物姓名只能输入汉字或字母');
				return false;
			}

			if (!hairReg.test($('.pet-color').val().trim())) {
				window.wAlert('宠物毛色只能输入汉字');
				return false;
			}

			if (!numberReg.test($('.pet-height').val().trim())) {
				window.wAlert('宠物身高只能输入整数');
				return false;
			}

			if (!numberReg.test($('.pet-weight').val().trim())) {
				window.wAlert('宠物体重只能输入整数');
				return false;
			}
			return true;
		},
		savePetKindData: function () {

			var petTarget = {};
			petTarget.petType = $('.pet-type').val();
			petTarget.petBreed = $('#selectPetKind').data('petcode');
			petTarget.petAge = $('.pet-age').val();
			petTarget.petSex = $('.pet-sex').val();
			petTarget.identityNo = $.trim($('.pet-certificate').val());
			petTarget.petName = $.trim($('.pet-name').val());
			petTarget.petHairColour = $.trim($('.pet-color').val());
			petTarget.petWeight = $('.pet-weight').val();
			petTarget.petHeight = $('.pet-height').val();
			petTarget.imgUrlList = imgUrlList;
			window.sessionStorage.setItem('petTarget', JSON.stringify(petTarget));
		},
	};
	pet.init();
})();

//写sessionStorage
function writeSessionStorage(item, obj) {
	sessionStorage.setItem(item, JSON.stringify(obj));
}

//读sessionStorage
function readSessionStorage(item) {
	return JSON.parse(sessionStorage.getItem(item));
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
