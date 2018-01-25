$(function(){
	var $err = $("#err"),
	$input = $("#inputNum");
	var screenHeight = window.screen.availHeight;
	var productData = JSON.parse(window.sessionStorage.getItem('productData')),
	maxInsuranceDay = productData.planInfoList[0].localProMap.maxInsuranceDay||0,
	maxInsuranceMonth = productData.planInfoList[0].localProMap.maxInsuranceMonth||0,
	maxUnderWriteDay = productData.planInfoList[0].localProMap.maxUnderWriteDay||0,
	maxUnderWriteMonth = productData.planInfoList[0].localProMap.maxUnderWriteMonth||0,
	leastBeginTime = productData.planInfoList[0].localProMap.leastBeginTime||'',
	packageList = productData.planInfoList[0].packageList,
	submit = {},
	amount= 0,
	maxInsurance;
	window.sessionStorage.setItem('productDetailUrl',window.location.href);
	var windowHeight = $(window).height();
	var ProductDetail = {

		//责任信息结构
		liabilityStruc: function(data) {
			var coverage = '';
			var iconImg = '';
			if (parseInt(data.insuranceCoverage) < 10000) {
				coverage += '<span class="money-icon">' + data.insuranceCoverage + '</span>';
			} else {
				coverage += '<span class="money-icon">' + data.insuranceCoverage / 10000 + '万</span>';
			};
			if (!data.liabilityDesc) {
				iconImg = '';
			} else {
				iconImg = '<img src="img/btn_arrow_black_right@2x.png" alt="" class="icon-img">';
			};
			return '<li class="tc-detail-li">'
				+ '<p class="left">' + (data.liabilityName || '') + '</p>'
				+ '<p class="right">'
					+ '' + coverage + ''
					+ '' + iconImg + ''
				+ '</p>'
			+ '</li>'
			+ '<li  class="tc-text" style="display:none;">'
				+ '<p>' + (data.liabilityDesc || '暂无描述') + '</p>'
			+ '</li>';
		},

		init: function(){
			ErrWarn.creat();
			this.scrollTop();
			this.maskClick();
			this.renderProductData();
			this.pay();
			this.clickFun();
			this.initDateTime();
			if (maxInsuranceDay) {
				maxInsurance = maxInsuranceDay+'天';
			} else if (maxInsuranceMonth){
				maxInsurance = maxInsuranceMonth+'个月';
			}
			$("#maxInsurance").text(maxInsurance);
		},
		getOffsetTop:function(dom){
			return document.getElementById(dom).getBoundingClientRect().top;
		},
		getToday: function() {
			var date = new Date();
			var today = date.getFullYear()+'-'+((date.getMonth()+1) >=10 ?(date.getMonth()+1):'0'+(date.getMonth()+1))+'-'+(date.getDate() >= 10?date.getDate():'0'+date.getDate());
			return today;
		},
		getDomTop:function(){
			var dom = ['product','insurance','claim','quesion'];
			var domTopArr = [];
			for(var i=0;i<dom.length;i++){
				domTopArr.push(ProductDetail.getOffsetTop(dom[i]));
			};
			return domTopArr;
		},
		getFutureDate: function(startDate, afterYear, afterMonth, afterDay) {
            var futureDate, year, month, day;

            if (arguments.length === 3) {
                afterDay = arguments[2];
                afterMonth = arguments[1];
                afterYear = arguments[0];
                startDate = new Date(startDate);
            }

            if (arguments.length === 4 && Object.prototype.toString.call(startDate) !== "[object Date]") {
                startDate = new Date(startDate);
            }

            //计算年
            futureDate = startDate.setFullYear(startDate.getFullYear() + parseInt(afterYear));
            futureDate = new Date(futureDate);
            // 计算月
            futureDate = futureDate.setMonth(futureDate.getMonth() + parseInt(afterMonth));
            futureDate = new Date(futureDate);
            // 计算日
            futureDate = futureDate.setDate(futureDate.getDate() + parseInt(afterDay));
            futureDate = (new Date(futureDate));

            year = futureDate.getFullYear();

            month = futureDate.getMonth() + 1;
            month = month < 10 ? '0' + month : month;

            day = futureDate.getDate();
            day = day < 10 ? '0' + day : day;

            futureDate = [year, month, day].join('-');

            return futureDate
        },
		renderProductData: function(){
			var length = packageList.length;
			var localProMap = productData.planInfoList[0].localProMap;
			if (length > 1) {
				var tchtml = '' ,tcBtn = '';
				var width = 100/length+'%';
				if(length === 3){
					width = "33.3%";
				};
				for(var i=0;i<length;i++){
					tchtml += '<li class="three" style="width:'+width+'"><a class="tc-a" data-i='+i+' data-packageCode='+packageList[i].packageCode+'>'+packageList[i].packageName+'</a></li>';
					tcBtn += '<button data-i='+i+' class="info-btn" data-packageCode='+packageList[i].packageCode + '>'+packageList[i].packageName+'</button>';
				};
				$("#tcUl").html(tchtml);
				$("#choosePlan").html(tcBtn);
			} else {
				$("#tcUl").hide();
				$("#plans").hide();
			};
			$('header .title').text(localProMap.productName);
			$("#bgImg").attr('src','/icp/downloadFile.do?fileName='+(localProMap.productImageTopUrl.split('='))[1]+'=0');
			$("#showDes").text(localProMap.planDesc);
			$("#productDes img").attr('src','/icp/downloadFile.do?fileName='+(localProMap.productImageIntroduceUrl.split('='))[1]+'=0');
			$("#tcUl").html(tchtml);
			ProductDetail.dutyList(0);
			$("#more").attr('data-code',localProMap.planCode);
			$("#insurance img").attr('src','/icp/downloadFile.do?fileName='+(localProMap.productImageNoticeUrl.split('='))[1]+'=0');
			$("#claim img").attr('src','/icp/downloadFile.do?fileName='+(localProMap.productImageClaimUrl.split('='))[1]+'=0');
			$("#quesion img").attr('src','/icp/downloadFile.do?fileName='+(localProMap.productImageIproblemUrl.split('='))[1]+'=0');
			$("#choosePlan").html(tcBtn);
			submit.productCode = productData.PRODUCTCODE;
			submit.planCode = localProMap.planCode;
			submit.planName = localProMap.planName;
			$('#tcUl').find('li .tc-a').eq(0).addClass('active');
			$('#choosePlan').find('button').eq(0).addClass('btn-active');
			submit.packageCode = packageList[0].packageCode;


			// if ($("header").css("background-color") != 'rgb(255, 255, 255)') {
			// 	$("#goBackImg").hide();
			// 	$("#goBack").show();
			// 	$("#tkBackImg").hide();
			// 	$("#tkBack").show();
			// 	$(".title").css('color','#fff');
			// };
			
            if ($('header').css('background-color') === 'rgb(255, 255, 255)') {
                $('.icon-arrow-back').css('border-color', '#000');
                $(".title").css('color', '#000');
                $('#title').css('color', '#000');
            } else {
                $('.icon-arrow-back').css('border-color', '#fff');
                $('#title').css('color', '#fff');
                $(".title").css('color', '#fff');
            }

			$(".loading").hide();
		},

		//渲染责任信息
		dutyList: function(i){
			var liabilityList = packageList[i].liabilityList;
			amount = packageList[i].packageAmount;
			ProductDetail.getAmount(amount,$("#inputNum").val());
			
			//兼容共享保额
			var resultObj = {};
            for (var i = 0; i < liabilityList.length; i++) {
                if (!liabilityList[i].insuranceTypeMergeFlag) {
                    resultObj[i + 'notShare'] = {
                        liabilityName: liabilityList[i].liabilityName || '',
                        liabilityDesc: liabilityList[i].liabilityDesc || '',
                        insuranceCoverage: liabilityList[i].insuranceCoverage || ''
                    };
                } else if (resultObj['share' + (liabilityList[i].insuranceTypeMergeFlag)]) {
                    resultObj['share' + (liabilityList[i].insuranceTypeMergeFlag)].liabilityName += '、' + (liabilityList[i].liabilityName || '');
                    resultObj['share' + (liabilityList[i].insuranceTypeMergeFlag)].liabilityDesc += liabilityList[i].liabilityDesc ? ('、' + liabilityList[i].liabilityDesc) : '';
                } else {
                    resultObj['share' + liabilityList[i].insuranceTypeMergeFlag] = {
                        liabilityName: liabilityList[i].liabilityName || '',
                        liabilityDesc: liabilityList[i].liabilityDesc || '',
                        insuranceCoverage: liabilityList[i].insuranceCoverage || ''
                    };
                }
            }
            var liabilityStr = '';
            if (!$.isEmptyObject(resultObj)) {
                for (var key in resultObj) {
                    liabilityStr += ProductDetail.liabilityStruc(resultObj[key]);
                }
            }
		    
			$("#tcDetailText").html(liabilityStr);
		},

		initDateTime: function(){
			var _that = this;
			var today = leastBeginTime || _that.getNextDate(_that.getToday(),'1');
			$("#J-datePicker").val(today);
			$("#startSpanTime").text(today);
			var endTime = _that.getFutureDate(new Date(today.replace(/-/g,"/")).getTime(),0,maxInsuranceMonth,maxInsuranceDay);
			endTime = _that.getNextDate(endTime,'2');
			$("#endSpanTime").text(endTime);
			$("#J-datePicker").datetimePicker(
				{
					title:"选择日期",
					min:today,
					max:'2100-01-01',
					yearSplit:"-",
					monthSplit:"-",
					datetimeSplit:" ",
					times:function(){return[]},
					onChange:function(i,h,j){
						setTimeout(function(){
							var chooseD = $("#J-datePicker").val();
							$("#startSpanTime").text(chooseD);
							var endDate = ProductDetail.getFutureDate(new Date(_that.getToday().replace(/-/g,"/")).getTime(),0,maxUnderWriteMonth,maxUnderWriteDay);
							var ch = new Date(chooseD.replace(/-/g,'/'));
							if(!ProductDetail.getDateComplateResult(endDate, chooseD)){
								ErrWarn.errShow('投保起期截止在'+ endDate);
								$("#startSpanTime").text(endDate);
								ch = new Date(endDate.replace(/-/g,'/'));
							}
							var endDate = _that.getFutureDate(ch.getTime(),0,maxInsuranceMonth,maxInsuranceDay);//2017-02-02
							endDate = _that.getNextDate(endDate,'2');
							$("#endSpanTime").text(endDate);
						},1000);
					}
				}
			)
		},
		getDateComplateResult: function(endDate, chooseDate){
			var chooseTime = (new Date(chooseDate.replace(/-/g,'/'))).getTime();
			var endDateTime = (new Date(endDate.replace(/-/g,'/'))).getTime();
			return chooseTime > endDateTime?false:true;
		},
		getNextDate: function(date,id){
			if (id == '1') {
				var nextDate = new Date(new Date(date.replace(/-/g,'/')).getTime()+1*24*60*60*1000);
			} else {
				var nextDate = new Date(new Date(date.replace(/-/g,'/')).getTime()-1*24*60*60*1000);
			};
			var month = nextDate.getMonth()+1 < 10?'0'+(nextDate.getMonth()+1):nextDate.getMonth()+1;
			var date = nextDate.getDate() < 10?'0'+nextDate.getDate():nextDate.getDate();
			var returnDate = nextDate.getFullYear()+'-'+month+'-'+date;
			return returnDate;
		},
		scrollTop: function(){
			window.onscroll = function() {
			    var domTopArr = ProductDetail.getDomTop();
				ProductDetail.srcollTab(domTopArr[0],domTopArr[1],domTopArr[2],domTopArr[3]);
			};
		},
		srcollTab: function(productTop,insuranceTop,claimTop,quesionTop){
			if (productTop <= 42) {
				$("#tab").addClass('tab');
			    $("#tab").show();
			} else {
				$("#tab").hide();
			    $("#tab").removeClass('tab');
			};
			if (screenHeight <= insuranceTop+90) {
				$('.a').removeClass('a-active');
				$("#js").addClass('a-active');
			    $("#jsFixed").addClass('a-active');
			};
			if (insuranceTop+140 <= screenHeight) {
				$('.a').removeClass('a-active');
				$("#tx").addClass('a-active');
				$("#txFixed").addClass('a-active');
			};
			if (claimTop+140 <= screenHeight) {
				$('.a').removeClass('a-active');
				$("#lzFixed").addClass('a-active');
			};
			if (quesionTop+140 <= screenHeight) {
				$('.a').removeClass('a-active');
				$("#cjFixed").addClass('a-active');
			}
		},
		pay: function(){
			var _that = this;
			$("#pay").on('click',function(){
				if($("#mask").css('display') == 'none'){
					$(".info").css("bottom","-500px");
					$("#mask").show();
					_that.animateFun('1');
				}else{
					if($("#J-datePicker").val() == ''){
						ErrWarn.errShow('请选择保险起期');
						return false;
					};
					if(!$("#inputNum").val()){
						ErrWarn.errShow('请填入投保份数');
						return false;
					};
					$("#pay").css('background','#dcdcdc').text('正在投保...');
					submit.insuranceBeginTime = $.trim($("#startSpanTime").text());
					submit.insuranceEndTime = $.trim($("#endSpanTime").text());
					submit.cardNum = $.trim($("#inputNum").val());
					submit.amount = $("#amount").text().slice(0,$("#amount").text().length-1);
					window.sessionStorage.setItem('submit',JSON.stringify(submit));
					window.sessionStorage.removeItem('applicantInfo');
					//埋点统计
                    window.tool.buyBtnTJ && window.tool.buyBtnTJ();
					
					window.location.href = 'applicant.html';
				}
			})
		},
		animateFun: function(num){
			var bottom = parseInt($(".info").css('bottom')),time=null;
			if(num == '1'){
				time = setInterval(function(){
					bottom+=50;
					$(".info").css('bottom',bottom+'px');
					if(bottom == '50'){
						 clearInterval(time);
					};
				},10);
			}else{
				time = setInterval(function(){
					bottom-=50;
					$(".info").css('bottom',bottom+'px');
					if(bottom == '-500'){
						var amount = $("#amount").text().slice(0,$("#amount").text().length-1)/parseInt($("#inputNum").val());
						$("#amount").text(amount+'元');
						$("#inputNum").val("1");
						$("#mask").hide();
						clearInterval(time);
					};
				},10);
			};
			$(".info").show();
		},
		changeActive: function(code){
			$('.tc-a').removeClass('active').css('background','#fff');
			$('.info-right button').removeClass('btn-active').css('background','#fff');
			$('.tc-a').eq(code).addClass('active');
			$('.info-right button').eq(code).addClass('btn-active');
		},
		getAmount: function(amount,num){
			var per = amount*num;
			$("#amount").text(per+'元');
		},
		clickFun: function(){
			var _that = this;
			// $("body").on('click','.a',function(){
			// 	$('.a').removeClass('a-active');
			// 	var $this = $(this);
			// 	$this.addClass('a-active');
			// });
			 $('.a').click(function() {
				if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
					var $target = $(this.hash);
					$target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
					if ($target.length) {
						var targetOffset = $target.offset().top;
						if (this.hash == '#product') {
							$('body').scrollTop(0);
						} else {
							$('body').scrollTop(targetOffset-140);
						}
						return false;
					}
				}
			});
			//ErrWarn.errShow
			$("#plus").on('click',function(){
				var num = parseInt($input.val())+1;
				if(num > 1000){
					ErrWarn.errShow('最多1000份');
					return false;
				}
				$input.val(num);
				ProductDetail.getAmount(amount,num)
			});
			$("#minus").on('click',function(){
				var num;
				if($input.val() == '1'){
					$input.val(1);
					ErrWarn.errShow('至少1份');
					return false;
				}else{
					num = parseInt($input.val())-1;
					$input.val(num);
					ProductDetail.getAmount(amount,num);
				}
			});
			$("body").on('click','.info-right button',function(){
				$('.info-right button').removeClass('btn-active');
				var $this = $(this);
				var i = $this.attr('data-i');
				$this.addClass('btn-active');
				submit.packageCode = $this.attr('data-packageCode');
				ProductDetail.dutyList(i);
				ProductDetail.changeActive(i)
			});
			$("body").on('click','.tc-a',function(){
				$('.tc-a').removeClass('active');
				var $this = $(this);
				var i = $this.attr('data-i');
				$this.addClass('active');
				ProductDetail.dutyList(i);
				ProductDetail.changeActive(i);
			})
			$("body").on('click','.right',function(){
				var $this = $(this),
				li = $this.parent().next();
				if (li.css('display') === 'none') {
					li.show();
					$this.find('img').css('transform','rotate(90deg)');
				} else {
					li.hide();
					$this.find('img').css('transform','rotate(0deg)');
				}
			});
			$input.on("change",function() {
				var num = parseInt($input.val());
				if (num == 0 || num <= 0 || $input.val() == '') {
					$input.val('1');
				} else if (num >= 1000){
					$input.val('1000');
				};
				ProductDetail.getAmount(amount,$("#inputNum").val());
			});
			$("#more").on('click',function(){
				$("#body").scrollTop(0);
				var code = $("#more").attr('data-code')
				_that.announcement(1,code);
			});
		},
		maskClick: function(){
			var _that = this;
			$('body').on('click','.mask',function(){
				_that.animateFun('2');
			});
			$('body').on('click','#cancel',function(){
				_that.animateFun('2');
			});
		},
		announcement: function (id,code) {
	      var g, d, h, i, j, f, k, planCode, protocal;
	      $("#hideContent").html('');
	      switch (id) {
	        case 1:
	          g = "保险条款";
	          d = "";
	          h = "#sytk";
	          j = document.createElement("iframe");
	          planCode = code;
	          protocal = window.location.href.indexOf('https') === 0 ? 'https' : 'http';
	          k = protocal + '://' + window.location.host + '/icp_core_dmz/web/' + planCode + '.html';
	          j.setAttribute("id", "miuisProvision");
	          //document.body.appendChild(j);
	          $("#hideContent").append(j);
	          $("#miuisProvision").attr("src", k);
	          break;
	      }
	      $("#title").html(g);
	      $(".contaitent").hide();
	      $(".footer").hide();
	      $("#hideInsuranceClause").show();
	      window.history.pushState({title: h}, h, window.location.href + h);
	      window.onpopstate = function (e) {
	        $("#miuisProvision").remove();
	        $("#hideInsuranceClause").hide();
	        $(".contaitent").show();
	        $(".footer").show();
	        $('#tab').hide();
	      };
	    }
	};
	ProductDetail.init();
})