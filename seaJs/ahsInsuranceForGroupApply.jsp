<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1,minimum-scale=1">
        <meta name="Android" content="Martin_Cui">
        <title>添加投保人信息</title>
        <link href="css/miuiall.css" type="text/css" rel="stylesheet">
        <link href="css/miuitraffic.css" type="text/css" rel="stylesheet">
        <link href="css/common.css" type="text/css" rel="stylesheet">
    </head>
    <body>
        <div class="loadingDiv"><img src="images/ajax-loader.gif"></div>
        <div class="contaitent">
            <header>
                <div class="left contaitentback">
                    <a onclick="javascript:history.back(-1);">
                        <img src="images/icon_back.png">
                    </a>
                </div>
                <div class="right contaientAdvisory">
                    <a href="tel:95511">咨询</a>
                </div>
                <div class="right contaitenttitle">
                    <c:out value="${productName}"/>
                </div>
            </header>
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
                            <span class="left hide contentchoiceiconbiao">
                                <div class="icon_bar"></div>
                            </span>
                            <span class="left hide contentchoiceicontu">
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
                        <span class="left contenttoptext03">被保险人信息</span>
                        <span class="left contenttoptext04">付款</span>
                    </div>
                </section>
                <!--#=主体内容-->
                <section class="contentner">
                    <div class="contentner_title">投保人信息</div>
                    <div class="contentnertimeer_2">
                        <p>
                            <label class="left">
                                <span class="left tl" style="width:14px">客</span>
                                <span class="left tl" style="width:14px">户</span>
                                <span class="left tl" style="width:14px">名</span>
                                <span class="left tl" style="width:14px">称</span>
                            </label>
                            <input type="text" id="groupName" class="left" placeholder="请您填写企业、机关、事业单位或社会团体的正式名称" />
                            <span class="right tc"><img src="images/icon_right.png" /></span>
                        </p>
                        <p>
                            <label class="left">
                                <span class="left tl" style="width:14px">行</span>
                                <span class="left tl" style="width:14px">业</span>
                                <span class="left tl" style="width:14px">分</span>
                                <span class="left tl" style="width:14px">类</span>
                            </label>
                            <span  id="industry" class="left" >请选择行业分类</span>
                            <input type="hidden" id="industryCode" class="left"  />
                            <span class="right tc"><img src="images/icon_right.png"></span>
                        </p>
                        <p style="height: auto;min-height:45px;position: relative;display: none;" id="descriptionParent">
                            <label class="left" style="height: 100%;position: absolute;">   
                                <span class="left tl" style="width:14px">行</span>
                                <span class="left tl" style="width:14px">业</span>
                                <span class="left tl" style="width:14px">说</span>
                                <span class="left tl" style="width:14px">明</span>
                                
                            </label>
                           <span  style="color: #0079FB;font-size: 14px;width: 60%;height: auto;display: flex;position: relative;left: 35%;min-height: 35px;padding: 5px 0 5px 0">
                               <span id="description" style="width: 100%;height: auto;margin: auto;"></span>
                           </span>
                        </p>
                        <p>
                            <label class="left">
                                <span class="left tl" style="width:14px">证</span>
                                <span class="left tl" style="width:14px">件</span>
                                <span class="left tl" style="width:14px">类</span>
                                <span class="left tl" style="width:14px">型</span>
                            </label>
                            <span class="selectdiv left">                               
                                <select id="groupCertificateType" style="padding:2px 0 2px 0px;">
                                    <option value="01">组织机构代码证</option>
                                    <option value="02">税务登记证</option>
                                    <option value="03">其他证件</option>
                                </select>
                            </span>
                            <span class="right tc"><img src="images/icon_right.png"></span>
                        </p>
                        <p>
                            <label class="left">
                                <span class="left tl" style="width:14px">证</span>
                                <span class="left tl" style="width:14px">件</span>
                                <span class="left tl" style="width:14px">号</span>
                                <span class="left tl" style="width:14px">码</span>
                            </label>
                            <input type="text" id="groupCertificateNo" class="left"  placeholder="请输入证件号码" />
                            <span class="right tc"><img src="images/icon_right.png"></span>
                        </p>
                    </div>
                    <div class="contentner_title">联系人信息</div>
                    <div class="contentnertimeer_2">
                        <p>
                            <label class="left">
                                <span class="left tl" style="width:14px">联</span>
                                <span class="left tl" style="width:14px">系</span>
                                <span class="left tl" style="width:14px">人</span>
                                <span class="left tl" style="width:14px">姓</span>
                                <span class="left tl" style="width:14px">名</span>
                            </label>
                            <input type="text" id="linkManName" class="left" placeholder="请输入联系人姓名" />
                            <span class="right tc"><img src="images/icon_right.png" /></span>
                        </p>

                        <p style="display:none">
                            <label class="left">
                                <span class="left tl" style="width:14px">证</span>
                                <span class="left tl" style="width:14px">件</span>
                                <span class="left tl" style="width:14px">类</span>
                                <span class="left tl" style="width:14px">型</span>
                            </label>
                            <span class="selectdiv left">
                                <select id="applicantCertType" style="padding:2px 0 2px 0px;">
                                    <option value="01"<c:if test="${applicantCertType=='01'}">selected="selected"</c:if>>身份证</option>
                                    <option value="02"<c:if test="${applicantCertType=='02'}">selected="selected"</c:if>>护照</option>
                                    <option value="03"<c:if test="${applicantCertType=='03'}">selected="selected"</c:if>>军官证</option>
                                    <option value="05"<c:if test="${applicantCertType=='05'}">selected="selected"</c:if>>驾驶证</option>
                                    <option value="06"<c:if test="${applicantCertType=='06'}">selected="selected"</c:if>>港澳回乡证或台胞证</option>
                                    <option value="99"<c:if test="${applicantCertType=='99'}">selected="selected"</c:if>>其他</option>
                                </select>
                            </span>
                            <span class="right tc"><img src="images/icon_right.png"></span>
                        </p>

                        <p style="display:none">
                            <label class="left" >
                                <span class="left tl" style="width:14px">证</span>
                                <span class="left tl" style="width:14px">件</span>
                                <span class="left tl" style="width:14px">号</span>
                                <span class="left tl" style="width:14px">码</span>
                            </label>
                            <input type="tel" id="for-paperNo1" class="left" maxlength="18" value="" placeholder="证件号码中X用*号代替"
                            onchange="fucosDate(this)" />
                            <input type="text" id="for-paperNo_other1" maxlength="18" class="left" value="" placeholder="请输入证件号码" disabled
                            ="disabled" style="display:none;" />
                            <span class="right tc"><img src="images/icon_right.png"></span>
                        </p>

                        <p id="birthdaybox" style="display:none">
                            <label class="left">
                                <span class="left tl" style="width:14px">出</span>
                                <span class="left tc" style="width:14px">生</span>
                                <span class="left tc" style="width:14px">日</span>
                                <span class="left tl" style="width:14px">期</span>
                            </label>
                            <input type="tel" id="insuredBirthdayNew" style="opacity:1;" class="left" />
                            <span class="right tc"><img src="images/icon_right.png"></span>
                        </p>
                        <p id="sexbox" style="display:none">
                            <label class="left">
                                <span class="left tl" style="width:14px">性</span>
                                <span class="left tl" style="width:14px">&nbsp;</span>
                                <span class="left tl" style="width:14px">&nbsp;</span>
                                <span class="left tl" style="width:14px">别</span>
                            </label>
                            <span class="left datadiv">
                                <input type="radio" value="M" name="applicantSexOther" onclick="assignmentToInput($(this).val())"
                                checked="checked" style="width:25%;height:20px;line-height:20px;margin-top: 12px;float: left;" />
                                <span style="float: left;">男</span>
                                <input type="radio" value="F" name="applicantSexOther" onclick="assignmentToInput($(this).val())"
                                style="width:25%;height:20px;line-height:20px;margin-top: 12px;float: left;" />
                                <span style="float: left;">女</span>
                            </span>
                        </p>
                        <p>
                            <label class="left">
                                <span class="left tl" style="width:14px">手</span>
                                <span class="left tc" style="width:28px">机</span>
                                <span class="left tl" style="width:14px">号</span>
                            </label>
                            <input type="tel" id="linkManMobileTelephone" class="left" maxlength="11" placeholder="请输入联系人手机号" />
                            <span class="right tc"><img src="images/icon_right.png"></span>
                        </p>
                    </div>
                    <div class="contentner_content_2">
                        <table style="width: 100%;margin: 0;">
                            <tr>
                                <td colspan="2">
                                    <label class="left" style="width: 30%;height: 45px;line-height: 45px;font-size: 14px;color: #5f5f5f;margin-left:
                                    5%;"><input id="needEmailCheckbox" type="checkbox" style="width: 16px;height: 16px;margin-top: 14px;margin-left:
                                    40px;outline: 0;" onclick="needEmail(this.checked)"></label>
                                    <span class="left" style="width: 50%;height: 45px;line-height: 45px;font-size: 14px;">发送电子保单</span>
                                </td>
                            </tr>
                            <tr id="needEmail" style="display:none;">
                                <td colspan="2" style="background-color: #fff;border-top: 1px solid #dfdfdf;border-bottom: 1px solid #dfdfdf">
                                    <label class="left" style="width: 30%;height: 45px;line-height: 45px;font-size: 14px;color: #5f5f5f;margin-left:
                                    5%;">
                                    <span class="left tl" style="width:14px">邮</span>
                                    <span class="left tl" style="width:14px">&nbsp;</span>
                                    <span class="left tl" style="width:14px">&nbsp;</span>
                                    <span class="left tl" style="width:14px">箱</span>
                                </label>
                                <input type="email" id="applicantEmail" class="left" placeholder="请输入联系人邮箱" style="width: 50%;height:
                                30px;line-height: 30px;margin-top: 8px;color: #0079FB;background: none;border: 0;font-size: 14px;outline:
                                0;padding-left:3px">
                                <span class="right tc" style="width: 15%;height: 45px;"><img src="images/icon_right.png"
                                    style="width: 13px;margin-top: 16px;"></span>
                                </td>
                            </tr>
                        </table>
                        <!--#=保险主要内容-->
                        <table>
                            <tr>
                                <td colspan="2">
                                    <div id="error" name="error" class="contentner_contenterror fsize02 color03" align="center"></div>
                                </td>
                            </tr>
                        </table>
                        <!--#=购买-->
                        <div class="contentner_submitBut">
                            <input type="button" value="下一步" class="submitBut" id="nextstep"/>
                        </div>
                    </div>
                </section>
            </main>
            <footer class="clearfix footer">
                <div class="copyright">©中国平安财产保险股份有限公司</div>
            </footer>
        </div>
        <div id="selectIndustry" style="display: none;"></div>
        <form name="savepolicyholder" id="savepolicyholder" action="" method="post">
            <input type="hidden" name="account" value="${account }"/>
            <input type="hidden" name="plansId" value="${plansId }"/>
            <input type="hidden" name="productCode" value="${productCode }"/>
            <input type="hidden" name="productName" value="${productName }"/>
            <input type="hidden" name="insuranceBeginTime" value="${insuranceBeginTime }"/>
            <input type="hidden" name="insuranceEndTime" value="${insuranceEndTime }"/>
            <input type="hidden" name="oldDigestTexts" value="${oldDigestTexts }"/>
            <input type="hidden" name="startDate" value="${startDate }"/>
            <input type="hidden" name="endDate" value="${endDate }"/>
            <input type="hidden" name="insuranceMonth" value="${insuranceMonth }"/>
            <input type="hidden" name="insuranceDay" value="${insuranceDay }"/>
            <input type="hidden" name="topAcceptInsurAge" value="${sessionScope.insuranceProductssSessionKey.applicantMaxAge }"/>
            <input type="hidden" name="leastAcceptInsurAge" value="${sessionScope.insuranceProductssSessionKey.applicantMiniAge }"/>
            <input type="hidden" name="insuredLimitedSex" value="${sessionScope.insuranceProductssSessionKey.applicantLimitedSex }"/>
            <input type="hidden" name="insuranceCategory" value="${insuranceCategory }"/>
            <input type="hidden" name="pageView" value="${pageView }"/>
            <input type="hidden" name="amount" value="${amount }"/><!-- 标准保费 -->
            <input type="hidden" name="discountAmount" value="${discountAmount }"/><!-- 优惠金额 -->
            <input type="hidden" name="linkManName" value=""/>
            <input type="hidden" name="applicantCertType" value=""/>
            <input type="hidden" name="applicantCertNo" value=""/>
            <input type="hidden" name="applicantBirthday" value=""/>
            <input type="hidden" name="applicantSex" value="M"/>
            <input type="hidden" name="linkManMobileTelephone" value=""/>
            <input type="hidden" name="applicantEmail" value=""/>
            <!-- 团意产品 -->
            <input type="hidden" name="groupName" value=""/>
            <input type="hidden" name="industryCode" value=""/>
            <input type="hidden" name="groupCertificateType" value=""/>
            <input type="hidden" name="groupCertificateNo" value=""/>
            <input type="hidden" name="secondMediaSource" value="${secondMediaSource }"/>
            <input type="hidden" name="mediaSource" value="${mediaSource }"/>
            <input type="hidden" name="orderNo" value="${orderNo }"/>
            <input type="hidden" name="salesManCode" value="${salesManCode }"/>
            <input type="hidden" name="saleCode" value="${saleCode }"/>
            <input type="hidden" name="applicantIdNo" value="${applicantIdNo }"/>
            <input type="hidden" name="remark" value="${remark }"/>
        </form>
    </body>
    <script src="js/libs/seajs/2.3.0/sea.js" id="seajsnode" ></script>
    <script src="js/config-seajs.js" ></script>

    <script type="text/javascript">
            seajs.use('ahsInsuranceForGroupApply');
    </script>

</html>