var text = ''
var page = 1
var loading = false
var tt = false

var sourceArr = {
    '1': '图源一', //'1) 我爱斗图 https://www.52doutu.cn',
    '2': '图源二', //'2) 斗图啦 http://www.doutula.com',
    '3': '图源三', // '3) 搜狗图片 https://pic.sogou.com',
    '4': '图源四', // '4) 发表情 https://fabiaoqing.com',
    '5': '图源五', // '6) 爱斗图 http://www.adoutu.com',
    '6': '图源六', //'7) DIY斗图 https://www.diydoutu.com',
    '7': '图源七', // '8) 表情集室 http://emoji.adesk.com',
    '8': '图源八', //'9) 逗图网 https://dou.yuanmazg.com',
};

utools.onPluginEnter(({ code, type, payload }) => {
    if (utools.isDarkColors()) {
        $(document.body).addClass('dark-mode');
    } else {
        $(document.body).removeClass('dark-mode');
    }

    utools.setSubInput(({
        text
    }) => {
        this.text = text
        page = 1
        if (text[text.length - 1] == ' ') {
            text = text.replace(/(\s*$)/g, "");
            this.text = text;
            utools.setSubInputValue(text)
            enterText();
        }
    }, "想搜点啥（搜索结果点击即可复制到剪切板）");

    if (type == 'over') {
        text = payload;
        utools.setSubInputValue(text);
        enterText();
    } else {
        recommendPic()
    }

});

$(document).keydown(e => {
    switch (e.keyCode) {
        case 13:
            enterText();
            break;
        case 32:
            enterText();
            break;
    }
});

$(function () {
    clickSta = null
    showOriginBar()
    $(".float_img").on('mouseup', function (e) {
        window.cleanTempImageCahce()
        var imgSrc = tt.src
        //右键为3
        if (3 == e.which) {
            utools.shellOpenExternal(imgSrc)
        } else if (1 == e.which) {   //左键为1
            if (clickSta == null) {
                clickSta = setInterval(function () {
                    window.copyImg(imgSrc, false)
                    clearTimeout(clickSta)
                    clickSta = null
                }, 300)
            } else {
                clearTimeout(clickSta)
                clickSta = null
                window.copyImg(imgSrc, true)
            }
        }
    })
})


$(document).scroll(() => {
    var htmlHeight = $(document).height();
    //clientHeight是网页在浏览器中的可视高度，
    var clientHeight = $(window).height();
    //scrollTop滚动条到顶部的垂直高度
    var scrollTop = $(document).scrollTop();
    //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
    var he = scrollTop + clientHeight;
    if (he >= htmlHeight) {
        if (loading == true) {
            return
        }
        loading = true
        page = page + 1
        getPic(text, page)
    }
})


function getPic(word, page_num) {
    if (word == '') {
        return
    }
    $('body').css('background-image', 'none')
    num = getSource()
    eval("getPic_" + num + "(word,page_num)");
}

//图片来源01
function getPic_1(word, page_num) {
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://doutu.lccyy.com/doutu/items?keyword=" + word + "&pageNum=" + page_num;
    $.get(url, function (datainfo) {
        const data = JSON.parse(datainfo);
        if (data.totalSize > 0) {
            append_html = "";
            var i = 0;
            data.items.forEach(function (u) {
                if (page_num == 1 && i == 0) {  //第一个为无效图片去除

                } else {
                    append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + u.url + "' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
                }
                i++;
            })
            $(".content ul").append(append_html);
        }
        setTimeout(function () { getPicThen() }, 1000);
    }).fail(function () {
        getPicError()
    });
}

//图片来源02
function getPic_2(word, page_num) {
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://www.doutula.com/search?type=photo&more=1&keyword=" + word + "&page=" + page_num;
    $.get(url, function (data) {
        var urlArr = window.matchImgUrl(data);
        append_html = "";
        urlArr.forEach(function (u) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + u + "' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
        })
        $(".content ul").append(append_html);
        setTimeout(function () { getPicThen() }, 1000);
    }).fail(function () {
        getPicError()
    });
}

//图片来源03
function getPic_3_bak(word, page_num) {
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://pic.sogou.com/pics/json.jsp?query=" + word + "&st=5&start=" + (page_num - 1) * 16 + "&xml_len=16";
    $.getJSON(url, function (data) {
        $.each(data.items, function (i, item) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + item.picUrl + "' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
        });
        $(".content ul").append(append_html);
        setTimeout(function () { getPicThen() }, 1000);
    }).error(function () {
        getPicError()
    })
}

//图片来源03
function getPic_3(word, page_num) {
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    var append_html = ""
    word = word + " 表情"
    var url = "https://image.sogou.com/napi/wap/pic?query=" + word + "&start=" + (page_num - 1) * 20 + "&reqFrom=wap_result";
    $.get(url, function (data) {
        $.each(data.data.items, function (i, item) {
            
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + item.picUrl + "' onerror=\"this.onerror='';src='assets/loading.jpg';\" /></li>";
        });
        $(".content ul").append(append_html);
        setTimeout(function () { getPicThen() }, 1000);
    }).error(function () {
        getPicError()
    })
}

//图片来源04
function getPic_4_bak(word, page_num) {
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://fabiaoqing.com/search/search/keyword/" + word + "/type/bq/page/" + page_num + ".html";
    $.get(url, {
        Referer:"https://fabiaoqing.com/"
    },function (data) {
        var urlArr = window.matchImgUrl(data);
        append_html = "";
        urlArr.forEach(function (u) {
            console.log(u)
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + u + "' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
        })
        // $.each(data.items, function(i,item){
        //      append_html  += "<li><img onmouseenter=\"bigImg(this)\" src='"+item.picUrl+"' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
        //   });
        $(".content ul").append(append_html);
        setTimeout(function () { getPicThen() }, 1000);
    }).fail(function () {
        getPicError()
    });
}

//图片来源04
function getPic_4(word, page_num) {
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://apim.doutub.com/api/bq/search?keyword=" + word + "&pageSize=20&curPage=" + page_num;
    $.getJSON(url, function (data) {
        console.log(data)
        $.each(data.data.rows, function (i, item) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='https://image.baidu.com/search/down?url=" + item.path + "' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
        });
        $(".content ul").append(append_html);
        setTimeout(function () { getPicThen() }, 1000);
    }).error(function () {
        getPicError()
    })
}

function bigImg(that) {
    tt = that
    w = $(that).width()
    h = $(that).height()
    x = $(that).position().top;
    y = $(that).position().left;
    // url = $(that).children('img').attr('src')
    url = $(that).attr('src')
    // console.log('onMouse:'+url)

    $('.float_img').css({
        'position': 'relative',
        'width': 1.2 * w + "px",
        'height': 1.2 * h + "px",
        'top': (x - 0.2 * w) + "px",
        'left': (y - 0.2 * h) + "px",
        'display': 'block',
        'z-index': '999',
        'background-image': 'url(' + url + ')',
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-color': '#ffffff',
    });
}


//图片来源05
function getPic_5(word, page_num) {
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "http://doutu.ucode.top/api/getpng?tokenId=F96C2856-02FA-4763-B82F-62D0E22AEE47&title=" + word + "&pageIndex=" + page_num;
    $.ajax({
        type: "GET",
        headers: {
            'Content-Type': "application/json; charset=utf-8"
        },
        url,
        success: function (datainfo) {
            const data = JSON.parse(datainfo);
            if (data.IsSuccess) {
                append_html = "";
                data.Data.forEach(function (u) {
                    append_html += "<li><img onmouseenter=\"bigImg(this)\" src='https://image.baidu.com/search/down?url=" + u.url + "' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
                })
                $(".content ul").append(append_html);
            }

            setTimeout(function () { getPicThen() }, 1000);
        },
        error: function (err) {
            getPicError()
        }
    });
}

//图片来源06
function getPic_6(word, page_num) {
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    page_num = (page_num);
    var append_html = ""
    var url = "https://www.diydoutu.com/tag/" + encodeURI(word) + "?page=" + page_num;
    $.get(url, function (data) {
        var urlArr = window.matchImgUrl_7(data);
        append_html = "";
        // console.log(urlArr)
        urlArr.forEach(function (u) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + u + "' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
        })
        $(".content ul").append(append_html);
        setTimeout(function () { getPicThen() }, 1000);
    }).fail(function () {
        getPicError()
    });
}

//图片来源07
function getPic_7(word, page_num) {
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    page_num = (page_num - 1) * 100;
    var append_html = ""
    var url = "http://so.picasso.adesk.com/emoji/v1/resource?from=select&limit=100&order=new&keyword=" + encodeURI(word) + "&skip=" + page_num;
    $.get(url, function (data) {
        append_html = "";
        data = data.res.data
        data.forEach(function (u) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + u.small_url + "' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
        })
        $(".content ul").append(append_html);
        setTimeout(function () { getPicThen() }, 1000);
    }).fail(function () {
        getPicError()
    });
}

//图片来源08
function getPic_8(word, page_num) {
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://dou.yuanmazg.com/so?keyword=" + word + "&page=" + page_num;
    $.get(url, function (data) {
        var urlArr = window.matchImgUrl(data);
        append_html = "";
        urlArr.forEach(function (u) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='https://dou.yuanmazg.com/" + u + "' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
        })
        $(".content ul").append(append_html);
        setTimeout(function () { getPicThen() }, 1000);
    }).fail(function () {
        getPicError()
    });
}

//推荐列表
function recommendPic() {
    page_num = 1
    // console.log("recommendPic:" + page_num)
    loading = true
    if (isNaN(page_num)) {
        page_num = 1;
    }
    if (page_num <= 1) {
        $(".content ul").html('');
    }
    page_num = (page_num - 1) * 100;
    var append_html = ""
    var url = "http://emoji.adesk.com/v1/resource?limit=100&skip=" + page_num;
    $.get(url, function (data) {
        data = JSON.parse(data)
        append_html = "";
        data = data.res.data
        data.forEach(function (u) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + u.small_url + "' onerror=\"this.onerror='';src='assets/loading.jpg'\" /></li>";
        })
        $(".content ul").append(append_html);
        setTimeout(function () { getPicThen() }, 1000);
    });
}


function hiddenBigImg() {
    $('.float_img').css({
        'display': 'none',
    });
}

//获取当前源id
function getSource() {
    data = utools.db.get("doutuSourceNo");
    if (!data) {
        utools.db.put({
            _id: "doutuSourceNo",
            data: "2"
        });
        return "2";
    } else {
        return data.data;
    }
}

function showChangeSourcePage() {
    hiddenBigImg();
    $(".click-changeSourcePage").hide();
    $(".click-content").show();
    var lis = '';
    data = utools.db.get("doutuSourceNo");
    num = parseInt(data.data)
    for (const val in sourceArr) {
        if (num == val) {
            lis = lis + "<li class='selected' onclick=\"setSource(" + val + ",this)\">" + sourceArr[val] + "</li>";
        } else {
            lis = lis + "<li onclick=\"setSource(" + val + ",this)\">" + sourceArr[val] + "</li>";
        }
    }
    $(".changeSourcePage ul").html(lis);
    // $(".content").hide();
    utools.setExpendHeight(500);
    $(".changeSourcePage").show()
    $(".changeSourcePage ul li").mouseover(function () {
        $(this).siblings().css({ "background": "#eaeaea" })
        $(this).siblings().css({ "border": "none" })
        $(this).css({ "border": " 1px solid rgb(134, 132, 132)" })
    });
}


function toTop() {
    $(document).scrollTop(0)
}


function setSource(num, that) {
    num = parseInt(num)
    if (num > Object.keys(sourceArr).length) {
        num = 1
    } else if (num <= 0) {
        num = 1
    }


    data = utools.db.get("doutuSourceNo");
    if (!data) {
        utools.db.put({
            _id: "doutuSourceNo",
            data: num
        });
    } else {
        utools.db.put({
            _id: "doutuSourceNo",
            data: num,
            _rev: data._rev
        });
    }
    utools.showNotification("已切换至图源 0" + num + "【" + sourceArr[num] + "】", clickFeatureCode = null, silent = false)
    $('.changeSourcePage ul li').css({ "border": "none", "background": "#eaeaea" })
    $('.changeSourcePage ul li').removeClass("selected");
    $(that).addClass("selected");
}

function setSourceQuick(num) {
    num = parseInt(num)
    if (num > Object.keys(sourceArr).length) {
        num = 1
    } else if (num <= 0) {
        num = 1
    }


    data = utools.db.get("doutuSourceNo");
    if (!data) {
        utools.db.put({
            _id: "doutuSourceNo",
            data: num
        });
    } else {
        utools.db.put({
            _id: "doutuSourceNo",
            data: num,
            _rev: data._rev
        });
    }
    // utools.showNotification("已切换至图源 0" + num + "【" + sourceArr[num] + "】", clickFeatureCode = null, silent = false)
    showOriginBar();
    enterText();
}

function enterText() {
    if (text == '') {
        return
    }
    // utools.setExpendHeight(500);
    $(".changeSourcePage").hide()
    $(".content").show();
    $(".click-changeSourcePage").show();
    $(".content ul").html('');
    getPic(text, 1)
}

function backContent() {
    $(".click-content").hide();
    $(".changeSourcePage").hide()
    $(".click-changeSourcePage").show();
}

function getPicThen() {
    loading = false;
    if ($(".content ul").html() === "") {
        $('body').css('background', 'url(assets/empty.png) no-repeat center')
    }
}

function getPicError() {
    utools.showNotification("当前图源访问异常【" + sourceArr[getSource()] + "】，请切换图源或检查网络状态", clickFeatureCode = null, silent = false)
}

function showOriginBar() {
    $('.origin-bar span').removeClass("origin-bar-span-selected");
    theId = getSource();
    $(".origin-bar").children("span").eq(theId - 1).addClass("origin-bar-span-selected");
}