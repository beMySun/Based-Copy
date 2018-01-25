投保接口：https://test-iicp-dmzstg.pingan.com.cn/icp/mobile_single_insurance/giftInsuranceApply.do
 
入参：
{
  "partnerCode【必填，由云平台给出】": "合作伙伴代码 String",
  "typeCode【必填】": "类别码（个意01、个财02、团意03、团财04） String",
  "productId【必填】": "云产品ID String",
  "planId【必填】": "产险产品ID String",
  "packageId【必填】": "套餐ID String",
  "timestamp【必填】": "发送请求的时间，格式为：yyyy-MM-dd HH:mm:ss String",
  "orderNo【必填,长度不要超过32】": "交易号(合作伙伴订单号，用于幂等性控制) String",
  "productInfo【产品信息-必填】": {
    "applyNum【必填，默认是1】": "投保份数 int",
    "totalActualPremium【必填】": "实交保费 Double",
    "insuranceBeginDate【必填】": "保险起期  String yyyy-MM-dd 24h:mm:ss",
    "insuranceEndDate【必填】": "保险止期  String yyyy-MM-dd 24h:mm:ss"
  },
  "applicantInfo【投保人信息-必填】": {
    "name【必填】": "名称 String",
    "mobileTelephone【必填】": "手机号码 String",
    "certificateNo【必填】": "证件号码 String",
    "certificateType【必填】": "证件类型 01:身份证，02：护照，03：军人证，04：港澳通行证，05：驾驶证，06：港澳回乡证或台胞证，07：临时身份证，99：其他 String",
    "birthday【非身份证时必填】": "出生年月  String",
    "sexCode【非身份证时必填】": "性别F,M String",
    "address【选填】": "地址 String",
    "postcode【选填】": "邮政编码 String",
    "email【选填】": "电子邮箱 String"
  },
  "insurantInfoList【必填-个意，被保人相关字段】": [
    {
      "name【必填】": "名称 String",
      "certificateNo【必填】": "证件号码 String",
      "certificateType【必填】": "证件类型 01:身份证，02：护照，03：军人证，04：港澳通行证，05：驾驶证，06：港澳回乡证或台胞证，07：临时身份证，99：其他 String",
      "birthday【非身份证时必填】": "出生日期 String",
      "sexCode【非身份证时必填】": "性别 女：F,男：M String",
      "address【选填】": "地址 String",
      "relationshipWithApplicant【选填】": "被保人与投保人关系：1:本人 2:配偶3 :父子 4:父女  A:母子 B:母女  I:子女 9:其他 String"
    }
  ],
  "extendInfo【选填-扩展信息】": {
    "invokeMobilePhone【选填】": "发送电子发票短信的手机号码 String",
    "invokeEmail【选填】": "发送电子发票邮件的邮箱 String"
  }
}
 
出参：

{
  "resultCode【必填】": "状态码（00代表成功，其它失败）",
  "errorDesc【非必填】": "错误描述信息",
  "policyInfo【保单信息-必填】": {
    "policyNo【非必填】": "保单号（非见费和预缴模式返回）",
    "applyPolicyNo【必填】": "投保单号",
    "validateCode【非必填】": "保单验证码（非见费和预缴模式返回）",
    "invoiceUrl【非必填】": "电子发票地址",
    "totalPremium【必填】": "保费"
  }
}


新一代:
{
  "template": "realCommon|realCommon",
  "templateType": "newGeneration",
  "color": "/icp_core_dmz/web/ptsCommon.css",
  "partnerCode": "QHBX",
  "productInfo": {
    "planList": [
      {
        "typeCode": "01",
        "standardPremium": null,
        "activityStartTime": null,
        "packageList": [
          {
            "insuredMaxAge": "80",


            "insuredMiniAge": "0",
            "minInsuredNumber": "1",
            "maxInsuredNumber": "3",
            "packageCode": "PK00004306",
            "liabilityList": [
              {
                "liabilityDesc": "意外伤害医疗",
                "insuranceCoverage": "20000",
                "insuranceDeductibles": "",
                "insuranceTypeMergeFlag": "",
                "liabilitydeductiblesTypeDesc": null,
                "deductiblesType": "",
                "liabilityName": "意外住院津贴",
                "liabilityCode": "CVJD006",
                "liabilityId": "27c10d3f00414c01bace00258b18d493",
                "insuranceTypeCode": "PL03J0092"
              },
              {
                "liabilityDesc": "意外伤害身故、残疾",
                "insuranceCoverage": "100000",
                "insuranceDeductibles": "",
                "insuranceTypeMergeFlag": "",
                "liabilitydeductiblesTypeDesc": null,
                "deductiblesType": "",
                "liabilityName": "意外伤害身故、残疾",
                "liabilityCode": "CVYA012",
                "liabilityId": "122d416409a54af9ad3e2472278137e3",
                "insuranceTypeCode": "PL03Y006"
              }
            ],
            "packageId": "e901c629ddd24944b3a50d4100608372",
            "packageAmount": "100",
            "packageName": "经济型"
          },
          {
            "insuredMaxAge": "80",
            "insuredMiniAge": "0",
            "minInsuredNumber": "1",
            "maxInsuredNumber": "3",
            "packageCode": "PK000043067",
            "liabilityList": [
              {
                "liabilityDesc": "意外伤害身故、残疾",
                "insuranceCoverage": "200000",
                "insuranceDeductibles": "",
                "insuranceTypeMergeFlag": "",
                "liabilitydeductiblesTypeDesc": null,
                "deductiblesType": "",
                "liabilityName": "意外伤害身故、残疾",
                "liabilityCode": "CVYA012",
                "liabilityId": "122d416409a54af9ad3e2472278137e3",
                "insuranceTypeCode": "PL03Y006"
              },
              {
                "liabilityDesc": "意外伤害医疗",
                "insuranceCoverage": "40000",
                "insuranceDeductibles": "",
                "insuranceTypeMergeFlag": "",
                "liabilitydeductiblesTypeDesc": null,
                "deductiblesType": "",
                "liabilityName": "意外伤害医疗",
                "liabilityCode": "CVYB001",
                "liabilityId": "36ffc903af2c4dc7a94fe0f022abf6b5",
                "insuranceTypeCode": "PL03Y006"
              }
            ],
            "packageId": "255243ce916e45918080730e5ad68878",
            "packageAmount": "180",
            "packageName": "实惠型"
          },
          {
            "insuredMaxAge": "80",
            "insuredMiniAge": "0",
            "minInsuredNumber": "1",
            "maxInsuredNumber": "3",
            "packageCode": "PK00004308",
            "liabilityList": [
              {
                "liabilityDesc": "意外伤害身故、残疾",
                "insuranceCoverage": "500000",
                "insuranceDeductibles": "",
                "insuranceTypeMergeFlag": "",
                "liabilitydeductiblesTypeDesc": null,
                "deductiblesType": "",
                "liabilityName": "意外伤害身故、残疾",
                "liabilityCode": "CVYA012",
                "liabilityId": "122d416409a54af9ad3e2472278137e3",
                "insuranceTypeCode": "PL03Y006"
              },
              {
                "liabilityDesc": "意外伤害医疗",
                "insuranceCoverage": "10000",
                "insuranceDeductibles": "",
                "insuranceTypeMergeFlag": "",
                "liabilitydeductiblesTypeDesc": null,
                "deductiblesType": "",
                "liabilityName": "意外伤害医疗",
                "liabilityCode": "CVYB001",
                "liabilityId": "36ffc903af2c4dc7a94fe0f022abf6b5",
                "insuranceTypeCode": "PL03Y006"
              }
            ],
            "packageId": "55b66eb3e1b54f78ae1c7838ff94e271",
            "packageAmount": "400",
            "packageName": "豪华型"
          }
        ],
        "planSource": "N",
        "planName": "平安驾驶人意外伤害保险",
        "planId": "56a00185c53144008fa5468f29ccef7a",
        "planDesc": "平安驾驶人意外伤害保险",
        "agentFee": null,
        "projectBonus": null,
        "industryFee": null,
        "brokerFee": null,
        "pageTemplateId": "realCommon|realCommon",
        "payType": "1,2,3",
        "printTemplateId": null,
        "smsCode": null,
        "maxInsuranceDay": "3",
        "maxInsuranceMonth": "",
        "maxUnderWriteDay": "2",
        "maxUnderWriteMonth": "",
        "insuredMaxAge": null,
        "insuredMiniAge": null,
        "insuredLimitedSex": "0",
        "applicantMaxAge": "60",
        "applicantMiniAge": "18",
        "applicantLimitedSex": "0",
        "applicantStatement": "平安驾驶人意外伤害保险",
        "originalPrice": null,
        "premiumDiscount": "",
        "cssId": "1029",
        "activityEndTime": null,
        "productImageTop": null,
        "productImageMiddle": null,
        "isDynamicAmount": "0",
        "isContainPackage": "1",
        "cardTypeCode": null,
        "paySystem": "0",
        "planType": "1",
        "maxApplyPolicyDay": "1",
        "maxApplyPolicyHour": "",
        "minInsuranceNumber": "4",
        "maxInsuranceNumber": "5",
        "minInsuredNumber": "",
        "maxInsuredNumber": "",
        "lawPolicy": "1|2",
        "discount": null,
        "premium": null,
        "planCode": "MP03000298",
        "template": "realCommon|realCommon",
        "templateType": "newGeneration",
        "color": "/icp_core_dmz/web/ptsCommon.css",
        "amount": null,
        "leastBeginTime": "2017-07-08"
      }
    ],
    "productImageNoticeUrl": "http://icp-core-stg1.paic.com.cn/icp-admin/downloadFile.do?fileName=80472624895665341888.png&channelType=1",
    "productImageIproblemUrl": "http://icp-core-stg1.paic.com.cn/icp-admin/downloadFile.do?fileName=80472624948098148008.png&channelType=1",
    "applicantStatementUrl": null,
    "productImageMiddleUrl": null,
    "productImageTopUrl": "http://icp-core-stg1.paic.com.cn/icp-admin/downloadFile.do?fileName=80472451930895818704.png&channelType=1",
    "productImageClaimUrl": "http://icp-core-stg1.paic.com.cn/icp-admin/downloadFile.do?fileName=80472624921117928566.png&channelType=1",
    "productImageIntroduceUrl": "http://icp-core-stg1.paic.com.cn/icp-admin/downloadFile.do?fileName=80472624846357686270.png&channelType=1",
    "productId": "68b989cb82454642bf8799cbae03ed34",
    "productName": "前海驾驶人意外伤害保险"
  },
  "code": "00",
  "msg": "OK"
}