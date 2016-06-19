$(function () {
    var a = getCookie("key");
    var e = '<div><dl style="height: 60px;background-color: #EEE;opacity:0.0;"><dt></dt></dl></div>';
    var fnav = '<div id="footnav" class="footnav clearfix"><ul>'
		+ '<li><a href="' + WapSiteUrl + '"><i class="home"></i><p>首页</p></a></li>'
		+ '<li><a href="' + WapSiteUrl + '/tmpl/product_first_categroy.html"><i class="categroy"></i><p>分类</p></a></li>'
		+ '<li><a href="' + WapSiteUrl + '/tmpl/search.html"><i class="search"></i><p>搜索</p></a></li>'
		+ '<li><a href="' + WapSiteUrl + '/tmpl/cart_list.html"><i class="cart"></i><p>购物车</p></a></li>';
    if (a) {
        fnav += '<li><a href="' + WapSiteUrl + '/tmpl/member/member.html"><i class="member"></i><p>我的商城</p></a></li></ul>';
    } else {
        fnav += '<li><a href="' + WapSiteUrl + '/tmpl/member/login.html"><i class="member"></i><p>账号登陆</p></a></li></ul>';
    }
    fnav +='</div>';
    $("#footer").html(e+fnav);
    $("#logoutbtn").click(function () {
        var a = getCookie("username");
        var e = getCookie("key");
        var i = "wap";
        $.ajax({
            type: "get",
            url: ApiUrl + "/index.php?act=logout",
            data: {
                username: a,
                key: e,
                client: i
            },
            success: function (a) {
                if (a) {
                    delCookie("username");
                    delCookie("key");
                    location.href = WapSiteUrl
                }
            }
        })
    })
});