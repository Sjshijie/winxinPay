//随机字符串生成
var datassss;
//alert(userId + "+" + openid);
function randomchars(){
    var x="0123456789qwertyuiopasdfghjklzxcvbnm";
    var temp="";
    for(var i=0;i < 13;i++){
        temp+=x.charAt(Math.ceil(Math.random()*1000000000)%x.length);
    }
    return temp;
}
var nonstr = randomchars();
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); 
    if (result != null) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
}
var page=getQueryString("page");
console.log(page);
$(".icon01").click(function(){
    if(page!=null&&page!=undefined){
        window.location.href=page+"?isshow=1";
    }else{
        window.history.go(-1);
    }
})
var ViewModel = {}, Model = {};
var urltest="https://www.ppfang.top/ppf/";
var urlppf="https://www.ppfang.top/ppf/";
//localStorage.setItem("userId","d552de80202b4499bdfcc878bab79adb");
var uid=localStorage.getItem("userId");
var endate="";
init();
function init() {
    $.ajax({
        type: "get",
        url: urltest+"wallet/selMoneyByUserId.do",
        data: { userId:uid},
        async: true,
        complete: function (XMLHttpRequest, textStatus){
            // console.log(XMLHttpRequest);
            if (textStatus = "success") {
                Model = JSON.parse(XMLHttpRequest.responseText);
                ViewModel = new ViewModelMapping(Model);

                ko.applyBindings(ViewModel, $(".contentBody")[0]);

            }else{
                console.log("再是没有数据");
            }
        }
    });
}
function ViewModelMapping(data){
    console.log(data);
    var self=this;
    if(data.msg!=0){
        self.slvCoin=ko.observable(data.data.slvCoin);
        self.gdCoin=ko.observable(data.data.gdCoin);
    }else{
        self.slvCoin=ko.observable(0);
        self.gdCoin=ko.observable(0);
    }
}

$(".module4").on("click","li",function(){
    $(this).addClass("color-border").siblings().removeClass("color-border");

})
$(".module6").click(function(){
    var rechargeMoney=$(".color-border p b").html();
    console.log(rechargeMoney);
    /*鎻愪氦鍏呭€间俊鎭�*/
    $.ajax({
        type:"post",
        url:urlppf+"deposit/insDeposit.do",
        data:{
            userId:uid,
            depositMoney:parseInt(rechargeMoney)
        },
        success:function(data){
            console.log(data);
            switch(data.msg){
                case 1:
                    //alert("鎻愪氦鎴愬姛" + nonstr);
                    var tradNo=data.tradeNo;
                    var pdata={
                        spbill_create_ip:"",
                        body:"寰俊鍏呭€�",
                        out_trade_no:tradNo,
                        openid:localStorage.getItem("openid"),
                        payType:2,
                        nonce_str: nonstr
                    };
                    //alert(JSON.stringify(pdata));
                    $.ajax({
                        url:urlppf+"wxpay/payPublic.do",
                        data:pdata,
                        success:function(res){
                            console.log(res);
                            if(res.code=="200"){
                                //alert(JSON.stringify(res));
                                datassss=res.data;
                                //alert(datassss.nonceStr);

                                function onBridgeReady(){
                                    WeixinJSBridge.invoke(
                                        'getBrandWCPayRequest', {
                                            "appId": datassss.appId,
                                            "timeStamp": datassss.timeStamp,   //鏃堕棿鎴筹紝鑷�1970骞翠互鏉ョ殑绉掓暟
                                            "nonceStr": datassss.nonceStr, //闅忔満涓�
                                            "package": datassss.package,
                                            "signType": datassss.signType,         //寰俊绛惧悕鏂瑰紡
                                            "paySign": datassss.sign  //寰俊绛惧悕
                                        },
                                        function(res){
                                            console.log(res);
                                            switch(res.errMsg){
                                                case "get_brand_wcpay_request:ok":
                                                    alert("鏀粯鎴愬姛");
                                                    window.location.replace("agencyPublish.html?status=11");
                                                    break;
                                                case "get_brand_wcpay_request:cancel":
                                                    alert("鍙栨秷鏀粯");
                                                    break;
                                                case "get_brand_wcpay_request:fail":
                                                    alert("鏀粯澶辫触");
                                                    break;
                                                default:
                                                    // alert("缂哄皯鍙傛暟");
                                            } // 浣跨敤浠ヤ笂鏂瑰紡鍒ゆ柇鍓嶇杩斿洖,寰俊鍥㈤槦閮戦噸鎻愮ず锛歳es.err_msg灏嗗湪鐢ㄦ埛鏀粯鎴愬姛鍚庤繑鍥�    ok锛屼絾骞朵笉淇濊瘉瀹冪粷瀵瑰彲闈犮€�
                                        }
                                    );
                                }
                                if (typeof WeixinJSBridge == "undefined"){
                                    if( document.addEventListener ){
                                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                    }else if (document.attachEvent){
                                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                    }
                                }else{
                                    onBridgeReady();
                                }

                            }else{
                                console.log("澶辫触");
                            }
                        }

                    })
                    break;
                case 0:
                    alert("鎻愪氦淇℃伅澶辫触");
                    break;
                case -1:
                    alert("鐢ㄦ埛id涓虹┖");
                    break;
                default:
                    alert("鍏呭€奸噾棰濅负绌�");
            }
        }

    })
})