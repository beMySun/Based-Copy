<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1,minimum-scale=1">
        <meta name="Android" content="Martin_Cui">
        <meta name="format-detection" content="telephone=no">
        <title>产品页面</title>
        <link href="css/miuiall.css" type="text/css" rel="stylesheet">
        <link href="css/miuitraffic.css" type="text/css" rel="stylesheet">
        <link href="css/plugins/mobiscroll/css/mobiscroll.core-2.5.2.css" rel="stylesheet" type="text/css" />
        <link href="css/common.css" type="text/css" rel="stylesheet">
        <link href="http://cdn.bootcss.com/layer/2.4/skin/layer.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="loadingDiv"><img src="images/ajax-loader.gif"></div>
        <div class="contaitent">
            <header>
                <div class="left contaitentback">
                    <a onclick="goBack()">
                        <img src="images/icon_back.png">
                    </a>
                </div>
                <div class="right contaientAdvisory">
                    <a href="tel:95511">咨询</a>
                </div>
                <c:choose>
                    <c:when test="${not empty PLANS_NAME}">
                        <div class="right contaitenttitle"><c:out value="${PLANS_NAME}"/></div>
                    </c:when>
                    <c:otherwise>
                    <div class="right contaitenttitle"><c:out value="${PRODUCT_NAME}"/>
                    </div>
                    </c:otherwise>
                </c:choose>
            </header>
            <main class="content">
                <section class="contenttop">
                    <div class="contenttopicon">
                        <div class="contentchoiceicon">
                            <span class="left contentchoiceicontu">
                                <div class="icon01"></div>
                            </span>
                            <span class="left hide contentchoiceiconbiao">
                                <div class="icon_bar"></div>
                            </span>
                            <span class="left hide contentchoiceicontu">
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
                    <div class="contenttoptext">
                        <span class="left contenttoptext01 color01">产品信息</span>
                        <span class="left contenttoptext02">投保人信息</span>
                        <span class="left contenttoptext03">被保险人信息</span>
                        <span class="left contenttoptext04">付款</span>
                    </div>
                </section>
                <!--#=主体内容-->
                <section class="contentner">
                    <!--#=保险时间选择-->
                    <div class="contentnertimeer">
                        <c:if test="${not empty plansId}">
                            <p>
                                <label class="left">选择方案</label>
                                <span class="selectdiv left">
                                    <select id="taocan" style="padding:2px 0 2px 0px;" class="selectDisabled" onchange="changeAmount($(this).val())">
                                        <optgroup label="请选择"></optgroup>
                                        <c:if test="${not empty productList}">
                                            <c:forEach items="${productList}" var="amountInfo" varStatus="sta">
                                            <!-- 提交时，设置保额为显示值的值 -->
                                                <option value='<c:out value="${amountInfo.PRODUCT_CODE}"/>' >
                                                    <c:out value="${amountInfo.PRODUCT_NAME}"/>
                                                </option>
                                            </c:forEach>
                                        </c:if>
                                    </select>
                                </span>
                                <span class="right tc"><img src="images/icon_right.png"></span>
                            </p>
                        </c:if>


                        <p>
                            <label class="left">保险起期</label>
                            <input type="text" id="dateInput" class="left" onchange="chooseStartDate(this.value)" style="opacity:1;" />
                            <span class="right tc"><img src="images/icon_right.png" /></span>
                            <label class="right" style="width: 25%;color: #0079FB;height: 30px;line-height: 30px;margin-top:8px;">00时</label>
                        </p>


                        <p>
                            <label class="left">保险止期</label>
                            <input type="text" id="drivingCardBirthday" onchange="chooseEndDate()" class="left" style="opacity:1;" />
                            <span class="right tc"><img src="images/icon_right.png"></span>
                            <label class="right" style="width: 25%;color: #0079FB;height: 30px;line-height: 30px;margin-top:8px;">24时</label>
                        </p>




                    </div>

                




                    <!--#=保险内容-->
                    <div class="contentner_content">
                        <table class="fsize02">
                            <tr>
                                <th width="60%" align="left">保障范围</th>
                                <th width="40%" align="right">保险金额</th>
                            </tr>
                            <c:if test="${not empty productDetail}">
                                <c:forEach items="${productDetail.resultList}" var="product">
                                    <tr>
                                        <td width="60%" align="left"><c:out value="${product.dutyChineseName}"/></td>
                                        <td width="40%" align="right"><c:out value="${product.dutyAmount}"/>元</td>
                                    </tr>
                                </c:forEach>
                            </c:if>
                            <c:if test="${not empty productDetail.specialPromise}">
                                <tr>
                                    <td colspan="2">
                                    </td>
                                </tr>
                                <tr>
                                    <th width="60%" align="left">特别约定</th>
                                    <th width="40%" align="right">&nbsp;</th>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div id="specialInsurance" class="specialInsurance">
                                            <div id="specialInsurancener">
                                                <c:out value="${productDetail.specialPromise}"/>
                                            </div>
                                        </div>
                                        <div id="readmore" class="specialInsurance" style="margin-top:3%;">
                                        </div>
                                    </td>
                                </tr>
                            </c:if>
                            <c:choose>
                                <c:when test="${not empty discountAmount}">
                                    <tr>
                                        <td colspan="2">
                                            <!--#=保费-->
                                            <div class="left fsize03 fwight" style="margin-top:20px;">标准保费&nbsp;
                                                <del datetime="20150428">
                                                    <font id="fontColor">
                                                        <span id="standardAmount">
                                                            <c:out value="${AMOUNT}"/>
                                                        </span>元/人
                                                    </font>
                                                </del>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <!--#=保费优惠价-->
                                            <div class="left fsize03 fwight" style="margin-top: 5px;color: #F00;padding: 5px 0px">优惠价&nbsp;<span
                                                id="amount"><c:out value="${discountAmount}"/></span>元/人</div>
                                            </td>
                                    </tr>
                                </c:when>

                                <c:otherwise>
                                    <tr>
                                        <td colspan="2">
                                            <!--#=保费-->
                                            <div class="left fsize04" style="margin-top:20px;">标准保费&nbsp;<font id="fontColor"><span id="amount">
                                                <c:out value="${AMOUNT}"/></span>元/人</font></div>
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
                    <div class="contentner_submitBut">
                        <input type="button" value="购买" class="submitBut" id="toubaoButton"/>
                    </div>
                </section>
            </main>
            <footer class="clearfix footer">
                    <div class="copyright">©中国平安财产保险股份有限公司</div>
            </footer>
        </div>
        <form name="bicycleInsurance" id="bicycleInsurance" action="" method="post">
            <input type="hidden" name="account" value="${account }"/>
            <input type="hidden" name="plansId" value="${plansId }"/>
            <input type="hidden" name="productCode" value="${productCode }"/>
            <input type="hidden" name="productName" value="${PRODUCT_NAME }"/>
            <input type="hidden" name="insuranceCategory" value="${SYSTEM_ID }"/>
            <input type="hidden" name="pageView" value="${PAGE_TEMPLATE_ID }"/>
            <input type="hidden" name="insuranceMonth" value="${productDetail.insuranceMonth }"/>
            <input type="hidden" name="insuranceDay" value="${productDetail.insuranceDay }"/>
            <input type="hidden" name="underwriteMonth" value="${MAX_UNDERWRITE_MONTH }"/>
            <input type="hidden" name="underwriteDay" value="${MAX_UNDERWRITE_DAY }"/>
            <input type="hidden" name="leastBeginDate" value="${productDetail.leastBeginDate }"/>
            <input type="hidden" name="insuranceWasCurrday" value="${productDetail.insuranceWasCurrday }"/>
            <input type="hidden" name="insuranceBeginExplanation" value="${productDetail.insuranceBeginExplanation }"/>
            <input type="hidden" name="oldDigestTexts" value="${oldDigestTexts}"/>
            <input type="hidden" name="amount" value="${AMOUNT }"/><!-- 标准保费 -->
            <input type="hidden" name="discountAmount" value="${discountAmount }"/><!-- 优惠金额 -->
            <input type="hidden" name="insuranceBeginTime" id="insuranceBeginTime" value=""/>
            <input type="hidden" name="insuranceEndTime" id="insuranceEndTime" value=""/>
            <input type="hidden" name="secondMediaSource"/>
            <input type="hidden" name="mediaSource"/>
            <input type="hidden" name="orderNo"/>
            <input type="hidden" name="salesManCode"/>
            <input type="hidden" name="saleCode"/>
            <input type="hidden" name="applicantIdNo"/>
            <input type="hidden" name="remark"/>
            <input type="hidden" name="taocan" value=""/>
        </form>
    </body>
    <script src="js/libs/seajs/2.3.0/sea.js" id="seajsnode" ></script>
    <script src="js/config-seajs.js" ></script>

    <script type="text/javascript">
            seajs.use('ahsInsuranceForGroup');
    </script>
</html>