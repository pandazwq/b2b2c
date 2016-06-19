var goods_id = getQueryString("goods_id");
var map_list = [];
var map_index_id = "";
var store_id;
$(function() {
	var e = getCookie("key");
	var t = function(e, t) {
		e = parseFloat(e) || 0;
		if (e < 1) {
			return ""
		}
		var o = new Date;
		o.setTime(e * 1e3);
		var a = "" + o.getFullYear() + "-" + (1 + o.getMonth()) + "-" + o.getDate();
		if (t) {
			a += " " + o.getHours() + ":" + o.getMinutes() + ":" + o.getSeconds()
		}
		return a
	};
	var o = function(e, t) {
		e = parseInt(e) || 0;
		t = parseInt(t) || 0;
		var o = 0;
		if (e > 0) {
			o = e
		}
		if (t > 0 && o > 0 && t < o) {
			o = t
		}
		return o
	};
	template.helper("isEmpty", function(e) {
		for (var t in e) {
			return false
		}
		return true
	});

	function a() {
		var e = $("#mySwipe")[0];
		window.mySwipe = Swipe(e, {
			continuous: false,
			stopPropagation: true,
			callback: function(e, t) {
				$(".goods-detail-turn").find("li").eq(e).addClass("cur").siblings().removeClass("cur")
			}
		})
	}
	r(goods_id);

	function i(e, t) {
		$(e).addClass("current").siblings().removeClass("current");
		var o = $(".spec").find("a.current");
		var a = [];
		$.each(o, function(e, t) {
			a.push(parseInt($(t).attr("specs_value_id")) || 0)
		});
		var i = a.sort(function(e, t) {
			return e - t
		}).join("|");
		goods_id = t.spec_list[i];
		r(goods_id)
	}

	function s(e, t) {
		var o = e.length;
		while (o--) {
			if (e[o] === t) {
				return true
			}
		}
		return false
	}
	$.sValid.init({
		rules: {
			buynum: "digits"
		},
		messages: {
			buynum: "请输入正确的数字"
		},
		callback: function(e, t, o) {
			if (e.length > 0) {
				var a = "";
				$.map(t, function(e, t) {
					a += "<p>" + e + "</p>"
				});
				$.sDialog({
					skin: "red",
					content: a,
					okBtn: false,
					cancelBtn: false
				})
			}
		}
	});

	function n() {
		$.sValid()
	}

	function r(r) {
		$.ajax({
			url: ApiUrl + "/index.php?act=goods&op=goods_detail",
			type: "get",
			data: {
				goods_id: r,
				key: e
			},
			dataType: "json",
			success: function(e) {
				template.helper('$getLocalTime', function (nS) {
                    var d = new Date(parseInt(nS) * 1000);
                    var s = '';
                    s += d.getFullYear() + '年';
                    s += (d.getMonth() + 1) + '月';
                    s += d.getDate() + '日 ';
                    return s;
				});
				var l = e.datas;
				//alert(l.goods_image);
				if (!l.error) {
					if (l.goods_image) {
						var d = l.goods_image.split(",");
						l.goods_image = d
					} else {
						l.goods_image = []
					} if (l.goods_info.spec_name) {
						var c = $.map(l.goods_info.spec_name, function(e, t) {
							var o = {};
							o["goods_spec_id"] = t;
							o["goods_spec_name"] = e;
							if (l.goods_info.spec_value) {
								$.map(l.goods_info.spec_value, function(e, a) {
									if (t == a) {
										o["goods_spec_value"] = $.map(e, function(e, t) {
											var o = {};
											o["specs_value_id"] = t;
											o["specs_value_name"] = e;
											return o
										})
									}
								});
								return o
							} else {
								l.goods_info.spec_value = []
							}
						});
						l.goods_map_spec = c
					} else {
						l.goods_map_spec = []
					} if (l.goods_info.is_virtual == "1") {
						l.goods_info.virtual_indate_str = t(l.goods_info.virtual_indate, true);
						l.goods_info.buyLimitation = o(l.goods_info.virtual_limit, l.goods_info.upper_limit)
					}
					if (l.goods_info.is_presell == "1") {
						l.goods_info.presell_deliverdate_str = t(l.goods_info.presell_deliverdate)
					}
					var _ = template.render("product_detail", l);
					$("#product_detail_html").html(_);
					if (l.goods_info.is_virtual == "0") {
						$(".goods-detail-o2o").remove()
					}
					
					var _ = template.render("product_detail_sepc", l);
					$("#product_detail_spec_html").html(_);
					var _ = template.render("voucher_script", l);
					$("#voucher_html").html(_);
					var _ = template.render('htmlTitle', l);
					$("head").append(_);
					if (l.goods_info.is_virtual == "1") {
						store_id = l.store_info.store_id;
						virtual()
					}
					if (getCookie("cart_count")) {
						if (getCookie("cart_count") > 0) {
							$("#cart_count,#cart_count1").html("<sup>" + getCookie("cart_count") + "</sup>")
						}
					}
					a();
					$(".pddcp-arrow").click(function() {
						$(this).parents(".pddcp-one-wp").toggleClass("current")
					});
					var p = {};
					p["spec_list"] = l.spec_list;
					$(".spec a").click(function() {
						var e = this;
						i(e, p)
					});
					$(".minus").click(function() {
						var e = $(".buy-num").val();
						if (e > 1) {
							$(".buy-num").val(parseInt(e - 1))
						}
					});
					$(".add").click(function() {
						var e = parseInt($(".buy-num").val());
						if (e < l.goods_info.goods_storage) {
							$(".buy-num").val(parseInt(e + 1))
						}
					});
					if (l.goods_info.is_fcode == "1") {
						$(".minus").hide();
						$(".add").hide();
						$(".buy-num").attr("readOnly", true)
					}
					$(".pd-collect").click(function() {
						if ($(this).hasClass("favorate")) {
							if (dropFavoriteGoods(r)) $(this).removeClass("favorate")
						} else {
							if (favoriteGoods(r)) $(this).addClass("favorate")
						}
					});
					$("#add-cart").click(function() {
						var e = getCookie("key");
						
						var t = parseInt($(".buy-num").val());
						
						if (!e) {
							var o = decodeURIComponent(getCookie("goods_cart"));
							if (o == null) {
								o = ""
							}
							if (r < 1) {
								show_tip();
								return false
							}
							var a = 0;
							if (!o) {
								o = r + "," + t;
								a = 1
							} else {
								var i = o.split("|");
								for (var n = 0; n < i.length; n++) {
									var l = i[n].split(",");
									if (s(l, r)) {
										show_tip();
										return false
									}
								}
								o += "|" + r + "," + t;
								a = i.length + 1
							}
							//alert(a);
							addCookie("goods_cart", o);
							addCookie("cart_count", a);
							show_tip();
							getCartCount();
							$("#cart_count,#cart_count1").html("<sup>" + a + "</sup>");
							return false
						} else {
							$.ajax({
								url: ApiUrl + "/index.php?act=member_cart&op=cart_add",
								data: {
									key: e,
									goods_id: r,
									quantity: t
								},
								type: "post",
								success: function(e) {
									var t = $.parseJSON(e);
									if (checkLogin(t.login)) {
										if (!t.datas.error) {
											show_tip();
											delCookie("cart_count");
											addCookie("cart_count", t.datas.num);
											getCartCount();
											$("#cart_count,#cart_count1").html("<sup>" + getCookie("cart_count") + "</sup>")
										} else {
											$.sDialog({
												skin: "red",
												content: t.datas.error,
												okBtn: false,
												cancelBtn: false
											})
										}
									}
								}
							})
						}
					});
					if (l.goods_info.is_virtual == "1") {
						$("#buy-now").click(function() {
							var e = getCookie("key");
							if (!e) {
								window.location.href = WapSiteUrl + "/tmpl/member/login.html";
								return false
							}
							var t = parseInt($(".buy-num").val()) || 0;
							if (t < 1) {
								$.sDialog({
									skin: "red",
									content: "参数错误！",
									okBtn: false,
									cancelBtn: false
								});
								return
							}
							if (t > l.goods_info.goods_storage) {
								$.sDialog({
									skin: "red",
									content: "库存不足！",
									okBtn: false,
									cancelBtn: false
								});
								return
							}
							if (l.goods_info.buyLimitation > 0 && t > l.goods_info.buyLimitation) {
								$.sDialog({
									skin: "red",
									content: "超过限购数量！",
									okBtn: false,
									cancelBtn: false
								});
								return
							}
							var o = {};
							o.key = e;
							o.cart_id = r;
							o.quantity = t;
							$.ajax({
								type: "post",
								url: ApiUrl + "/index.php?act=member_vr_buy&op=buy_step1",
								data: o,
								dataType: "json",
								success: function(e) {
									if (e.datas.error) {
										$.sDialog({
											skin: "red",
											content: e.datas.error,
											okBtn: false,
											cancelBtn: false
										})
									} else {
										location.href = WapSiteUrl + "/tmpl/order/vr_buy_step1.html?goods_id=" + r + "&quantity=" + t
									}
								}
							})
						})
					} else {
						$("#buy-now").click(function() {
							var e = getCookie("key");
							if (!e) {
								window.location.href = WapSiteUrl + "/tmpl/member/login.html"
							} else {
								var t = parseInt($(".buy-num").val()) || 0;
								if (t < 1) {
									$.sDialog({
										skin: "red",
										content: "参数错误！",
										okBtn: false,
										cancelBtn: false
									});
									return
								}
								if (t > l.goods_info.goods_storage) {
									$.sDialog({
										skin: "red",
										content: "库存不足！",
										okBtn: false,
										cancelBtn: false
									});
									return
								}
								var o = {};
								o.key = e;
								o.cart_id = r + "|" + t;
								$.ajax({
									type: "post",
									url: ApiUrl + "/index.php?act=member_buy&op=buy_step1",
									data: o,
									dataType: "json",
									success: function(e) {
										if (e.datas.error) {
											$.sDialog({
												skin: "red",
												content: e.datas.error,
												okBtn: false,
												cancelBtn: false
											})
										} else {
											location.href = WapSiteUrl + "/tmpl/order/buy_step1.html?goods_id=" + r + "&buynum=" + t
										}
									}
								})
							}
						})
					}
				} else {
					$.sDialog({
						content: l.error + "！<br>请返回上一页继续操作…",
						okBtn: false,
						cancelBtnText: "返回",
						cancelFn: function() {
							history.back()
						}
					})
				}
				$("#buynum").blur(n);
				$.animationUp({
					valve: ".animation-up,#goods_spec_selected",
					wrapper: "#product_detail_spec_html",
					scroll: "#product_roll",
					start: function() {
						$(".goods-detail-foot").addClass("hide").removeClass("block")
					},
					close: function() {
						$(".goods-detail-foot").removeClass("hide").addClass("block")
					}
				});
				$.animationUp({
					valve: "#getVoucher",
					wrapper: "#voucher_html",
					scroll: "#voucher_roll"
				});
				$("#voucher_html").on("click", ".btn", function() {
					getFreeVoucher($(this).attr("data-tid"))
				});
				$(".kefu").click(function() {
					window.location.href = WapSiteUrl + "/tmpl/member/chat_info.html?goods_id=" + r + "&t_id=" + e.datas.store_info.member_id
				})

				//html_title = e.goods_info.goods_name;	
			}
		})
	}
	$.scrollTransparent();
	$("#product_detail_html").on("click", "#get_area_selected", function() {
		$.areaSelected({
			success: function(e) {
				$("#get_area_selected_name").html(e.area_info);
				var t = e.area_id_2 == 0 ? e.area_id_1 : e.area_id_2;
				$.getJSON(ApiUrl + "/index.php?act=goods&op=calc", {
					goods_id: goods_id,
					area_id: t
				}, function(e) {
					$("#get_area_selected_whether").html(e.datas.if_store_cn);
					$("#get_area_selected_content").html(e.datas.content);
					if (!e.datas.if_store) {
						$(".buy-handle").addClass("no-buy")
					} else {
						$(".buy-handle").removeClass("no-buy")
					}
				})
			}
		})
	});
	$("body").on("click", "#goodsBody,#goodsBody1", function() {
		window.location.href = WapSiteUrl + "/tmpl/product_info.html?goods_id=" + goods_id
	});
	$("body").on("click", "#goodsEvaluation,#goodsEvaluation1", function() {
		window.location.href = WapSiteUrl + "/tmpl/product_eval_list.html?goods_id=" + goods_id
	});
});

function show_tip() {
	var e = $(".goods-pic > img").clone().css({
		"z-index": "999",
		height: "3rem",
		width: "3rem"
	});
	e.fly({
		start: {
			left: $(".goods-pic > img").offset().left,
			top: $(".goods-pic > img").offset().top - $(window).scrollTop()
		},
		end: {
			left: $("#cart_count1").offset().left + 40,
			top: $("#cart_count1").offset().top - $(window).scrollTop(),
			width: 0,
			height: 0
		},
		onEnd: function() {
			e.remove()
		}
	})
}

