<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1,minimum-scale=1">
		<meta name="Android" content="Martin_Cui">
		<title>添加被保人信息</title>
		<link href="css/common.css" type="text/css" rel="stylesheet">
        <link href="css/miuiall.css" type="text/css" rel="stylesheet">
        <link href="css/miuitraffic.css" type="text/css" rel="stylesheet">
        <link href="css/plugins/mobiscroll/css/mobiscroll.core-2.5.2.css" rel="stylesheet" type="text/css" />
        <link href="css/trafficBeInsured.css" type="text/css" rel="stylesheet">  
	</head>
	<body>
		<!--#=没加载页面时-->
		<div class="loadingDiv"><img src="images/ajax-loader.gif"></div>
		<!--#=主要内容-->
		<div class="contaitent" id="mainInfo">
			<!--#=头部-->
			<header>
				<div class="left contaitentback"><a onclick="javascript:history.back(-1);"><img src="images/icon_back.png"></a></div>
				<div class="right contaientAdvisory"><a href="tel:95511">咨询</a></div>
				<div class="right contaitenttitle"><c:out value="${productName}"/></div>
			</header>
			<!--#=主要部分-->
			<main class="content">
				<!--#=主体引导-->
				<section class="contenttop">
					<!--#=主体图标引导-->
					<div class="contenttopicon">
						<div class="contentchoiceicon">
							<span class="left contentchoiceicontu">
								<div class="icon01"></div>
							</span>
							<span class="left contentchoiceiconbiao">
								<div class="icon_bar"></div>
							</span>
							<span class="left contentchoiceicontu">
								<div class="icon02"></div>
							</span>
							<span class="left contentchoiceiconbiao">
								<div class="icon_bar"></div>
							</span>
							<span class="left contentchoiceicontu">
								<div class="icon03"></div>
							</span>
							<span class="left hide contentchoiceiconbiao">
								<div class="icon_bar"></div>
							</span>
							<span class="left hide contentchoiceicontu">
								<div class="icon04"></div>
							</span>
						</div>
					</div>
					<!--#=主体文字引导-->
					<div class="contenttoptext">
						<span class="left contenttoptext01 color01">产品信息</span>
						<span class="left contenttoptext02 color01">投保人信息</span>
						<span class="left contenttoptext03 color01">被保险人信息</span>
						<span class="left contenttoptext04">付款</span>
					</div>
				</section>
				<!--#=主体内容-->
				<section class="contentner">
					 <div class="contentner_title">
					 	<span class="left">被投保人信息（不得少于三人）</span>
					 	<div class="right contentner_addperson" style="width: 26%;"><a onclick="addPerson()"><span id="addPerson">+被保险人</span></a></div>
					 </div>
					 <div class="contentnertimeer_2" id="beInsuredList">
					 	
					 </div>
					 <!--#=保险内容-->
					 <div class="contentner_content_2">
					 	<!--#=保险主要内容-->
					 	<table>
					 		<tr>
						 		<td colspan="2">
						 			<input id="isagreeinsuredbox" type="checkbox" class="contentner_checkebox left"  onchange="agree_02(this)" style="margin-top: 4px;">
						 			<label for="isagreeinsuredbox" class="left fsize01" style="padding-left: 10px;">我已阅读并同意<a href="javascript:;" id="shiyongTiaokuan">《适用条款》</a>及<a href="javascript:;" id="toubaorenState">《投保人声明》</a></label>
						 		</td>
						 	</tr>
						 	<tr>
						 		<td colspan="2">
						 		</td>
						 	</tr>
						 	<c:choose>
						 		<c:when test="${not empty discountAmount}">
								 	<tr>
								 		<td colspan="2">
								 			<div class="left fsize03 fwight">应付保费&nbsp;<del datetime="20150428"><font id="fontColor"><span id="standardAmount">0</span>元</font></del></div>
								 		</td>
								 	</tr>
								 	<tr>
								 		<td colspan="2" style="height:40px;">
								 			<div class="left fsize03 fwight" style="margin-top:5px; color:#F00;line-height:26px; padding:2px 0px">优惠价&nbsp;<span id="allAmount"><c:out value="${discountAmount }"/></span>元</div><!-- 优惠价 -->
								 		</td>
								 	</tr>
						 		</c:when>
						 		<c:otherwise>
						 			<tr>
								 		<td colspan="2">
								 			<div class="left fsize03 fwight">应付保费&nbsp;<font id="fontColor"><span id="allAmount">0</span>元</font></div>
								 		</td>
								 	</tr>
						 		</c:otherwise>
						 	</c:choose>
						 	<tr>
						 		<td colspan="2">
						 			<div id="error" name="error" class="contentner_contenterror fsize02 color03" align="center"></div>
						 		</td>
						 	</tr>
					 	</table>
					 	<!--#=购买-->
					 	<div class="contentner_submitBut">
					 		<input type="button" value="支付" class="submitBut_disabled" id="gotopay" disabled="disabled"/>
					 	</div>
					 </div>
				</section>
			</main>
		 	<footer class="clearfix footer">
	        	<div class="copyright">©中国平安财产保险股份有限公司</div>
	        </footer>			
		</div>
		<form name="savebeinsured" id="savebeinsured" action="" method="post">
		<!-- 团意产品 -->
			<input type="hidden" name="groupName" value="${groupName}"/>
			<input type="hidden" name="industryCode" value="${industryCode}"/>
			<input type="hidden" name="groupCertificateType" value="${groupCertificateType}"/>
			<input type="hidden" name="groupCertificateNo" value="${groupCertificateNo}"/>
			<input type="hidden" name="linkManName" value="${linkManName}"/>
			<input type="hidden" name="linkManMobileTelephone" value="${linkManMobileTelephone}"/>
			<input type="hidden" name="account" value="${account}"/>
			<input type="hidden" name="plansId" value="${plansId }"/>
			<input type="hidden" name="productCode" value="${productCode}"/>
			<input type="hidden" name="productName" value="${productName}"/>
			<input type="hidden" name="insuranceBeginTime" value="${insuranceBeginTime}"/>
			<input type="hidden" name="insuranceEndTime" value="${insuranceEndTime}"/>
			<input type="hidden" name="oldDigestTexts" value="${oldDigestTexts}"/>
			<input type="hidden" name="startDate" value="${startDate}"/>
			<input type="hidden" name="endDate" value="${endDate}"/>
			<input type="hidden" name="applicantCertType" value="${applicantCertType}"/>
			<input type="hidden" name="applicantCertNo" value="${applicantCertNo}"/>
			<input type="hidden" name="applicantName" value="${applicantName}"/>
			<input type="hidden" name="telephone" value="${telephone}"/>
			<input type="hidden" name="applicantEmail" value="${applicantEmail}"/>
			<input type="hidden" name="insuranceMonth" value="${insuranceMonth}"/>
			<input type="hidden" name="insuranceDay" value="${insuranceDay}"/>
			<input type="hidden" name="topAcceptInsurAge" value="${sessionScope.insuranceProductssSessionKey.insuredMaxAge }"/>
			<input type="hidden" name="leastAcceptInsurAge" value="${sessionScope.insuranceProductssSessionKey.insuredMiniAge }"/>
			<input type="hidden" name="applicantLimitedSex" value="${sessionScope.insuranceProductssSessionKey.insuredLimitedSex }"/>
	        <input type="hidden" name="applicantBirthday" value="${applicantBirthday }"/>
	        <input type="hidden" name="applicantSex" value="${applicantSex }"/>
	        <input type="hidden" name="amount" value="${amount }"/><!-- 标准保费 -->
	        <input type="hidden" name="discountAmount" value="${discountAmount }"/><!-- 优惠金额 -->
			<input type="hidden" value="${sessionScope.insuranceProductssSessionKey.insuranceClause }" id="cuiStatement" />
			<input type="hidden" name="secondMediaSource" value="${secondMediaSource }"/>
			<input type="hidden" name="mediaSource" value="${mediaSource }"/>
			<input type="hidden" name="orderNo" value="${orderNo }"/>
			<input type="hidden" name="salesManCode" value="${salesManCode }"/>
			<input type="hidden" name="saleCode" value="${saleCode }"/>
			<input type="hidden" name="applicantIdNo" value="${applicantIdNo }"/>
			<input type="hidden" name="remark" value="${remark }"/>
			<input type="hidden" name="recommendCode" />
			<input type="hidden" name="currentUserRecommendCode" />
		</form> 
		<!-- 适用条款 -->
		<div class="contaitent" style="display: none; z-index: 99999999999; position: absolute;" id="sytkInfo">
			<header style="position: fixed;">
				<div class="left contaitentback">
					<a onclick="javascript:history.back(-1);"><img src="images/icon_back.png"></a>
				</div>
				<div class="right contaitenttitle" id="contaitentTitle"></div>
			</header>
			<div style="width:100%;line-height:20px;margin-bottom:10px;margin-top:50px;word-wrap: break-word;font-size:14px;font-weight:normal;overflow: auto; height: 90%;" id="cui_tbsm_container"></div>
		</div>
	</body>

    <script src="js/libs/seajs/2.3.0/sea.js" id="seajsnode" ></script>
    <script src="js/config-seajs.js" ></script>
    <script type="text/javascript">
            seajs.use('ahsInsuranceForGroupInsurant');
    </script>
</html>