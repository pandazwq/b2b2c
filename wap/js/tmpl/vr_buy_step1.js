var key = getCookie("key");
var goods_id = getQueryString("goods_id");
var quantity = getQueryString("quantity");
var data = {};
data.key = key;
data.goods_id = goods_id;
data.quantity = quantity;
Number.prototype.toFixed = function(e) {
    var t = this + "";
    if (!e) e = 0;
    if (t.indexOf(".") == -1) t += ".";
    t += new Array(e + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (e + 1) + "})?)\\d*$").test(t)) {
        var t = "0" + RegExp.$2,
        a = RegExp.$1,
        r = RegExp.$3.length,
        o = true;
        if (r == e + 2) {
            r = t.match(/\d/g);
            if (parseInt(r[r.length - 1]) > 4) {
                for (var n = r.length - 2; n >= 0; n--) {
                    r[n] = parseInt(r[n]) + 1;
                    if (r[n] == 10) {
                        r[n] = 0;
                        o = n != 1
                    } else break
                }
            }
            t = r.join("").replace(new RegExp("(\\d+)(\\d{" + e + "})\\d$"), "$1.$2")
        }
        if (o) t = t.substr(1);
        return (a + t).replace(/\.$/, "")
    }
    return this + ""
};
var p2f = function(e) {
    return (parseFloat(e) || 0).toFixed(2)
};
$(function() {
    $.ajax({
        type: "post",
        url: ApiUrl + "/index.php?act=member_vr_buy&op=buy_step2",
        dataType: "json",
        data: data,
        success: function(e) {
            var t = e.datas;
            if (typeof t.error != "undefined") {
                location.href = WapSiteUrl;
                return
            }
            t.WapSiteUrl = WapSiteUrl;
            var a = template.render("goods_list", t);
            $("#deposit").html(a);
            $("#buyerPhone").val(t.member_info.member_mobile);
            $("#totalPrice").html(t.goods_info.goods_total)
        }
    });
    $("#ToBuyStep2").click(function() {
        var e = {};
        e.key = key;
        e.goods_id = goods_id;
        e.quantity = quantity;
        var t = $("#buyerPhone").val();
        if (!/^\d{7,11}$/.test(t)) {
            $.sDialog({
                skin: "red",
                content: "请正确输入接收手机号码！",
                okBtn: false,
                cancelBtn: false
            });
            return false
        }
        e.buyer_phone = t;
        e.buyer_msg = $("#storeMessage").val();
        $.ajax({
            type: "post",
            url: ApiUrl + "/index.php?act=member_vr_buy&op=buy_step3",
            data: e,
            dataType: "json",
            success: function(e) {
                checkLogin(e.login);
                if (e.datas.error) {
                    $.sDialog({
                        skin: "red",
                        content: e.datas.error,
                        okBtn: false,
                        cancelBtn: false
                    });
                    return false
                }
                if (e.datas.order_id) {
                    toPay(e.datas.order_sn, "member_vr_buy", "pay")
                }
                return false
            }
        })
    })
});