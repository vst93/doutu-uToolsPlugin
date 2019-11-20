var text = ''
var page = 1
var loading = false
var tt = false

var sourceArr = {
    '1': '我爱斗图 https://www.52doutu.cn',
    '2': '斗图啦 https://www.doutula.com',
    '3': '搜狗图片 https://pic.sogou.com',
    '4': '发表情 https://fabiaoqing.com',
    '5': '逗比拯救世界 http://www.dbbqb.com',
    '6': 'B7表情 https://b7.cn',
};

utools.onPluginEnter(({ code, type, payload }) => {
    utools.setExpendHeight(0);
    utools.setSubInput(({
        text
    }) => {
        this.text = text
        this.page = 1
        if (text[text.length - 1] == ' ') {
            text = text.replace(/(\s*$)/g,"");
            this.text = text;
            utools.setSubInputValue(text)
            enterText();
        }
    }, "想搜点啥（搜索结果点击即可复制到剪切板）");
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
    num = getSource()
    eval("getPic_" + num + "(word,page_num)");
    // (getPic+num)(word,page_num);
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
    var url = "https://www.52doutu.cn/api/?types=search&action=searchpic&limit=20&wd=" + word + "&offset=" + page_num;
    $.get(url, function (data) {
        append_html = "";
        data.rows.forEach(function (u) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + u.url + "' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
        })
        $(".content ul").append(append_html);
        setTimeout(function () { loading = false }, 1000);
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
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + u + "' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
        })
        $(".content ul").append(append_html);
        setTimeout(function () { loading = false }, 1000);
    });
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
    var url = "https://pic.sogou.com/pics/json.jsp?query=" + word + "&st=5&start=" + (page_num - 1) * 16 + "&xml_len=16";
    $.getJSON(url, function (data) {
        $.each(data.items, function (i, item) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + item.picUrl + "' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
        });
        $(".content ul").append(append_html);
        setTimeout(function () { loading = false }, 1000);
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
    var url = "https://fabiaoqing.com/search/search/keyword/" + word + "/type/bq/page/" + page_num + ".html";
    $.get(url, function (data) {
        var urlArr = window.matchImgUrl(data);
        append_html = "";
        urlArr.forEach(function (u) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='" + u + "' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
        })
        // $.each(data.items, function(i,item){
        //      append_html  += "<li><img onmouseenter=\"bigImg(this)\" src='"+item.picUrl+"' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
        //   });
        $(".content ul").append(append_html);
        setTimeout(function () { loading = false }, 1000);
    });
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
    page_num = (page_num - 1) * 100;
    var append_html = ""
    var url = "http://www.dbbqb.com/api/search/json?over=false&w=" + word + "&start=" + page_num;
    $.get(url, function (data) {
        append_html = "";
        data.forEach(function (u) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='http://image.bee-ji.com/" + u.path + "' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
        })
        $(".content ul").append(append_html);
        setTimeout(function () { loading = false }, 1000);
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
    var append_html = ""
    var url = "https://m.b7.cn/e/sch/index.php?keyboard=" + word + "&page=" + page_num;
    $.get(url, function (data) {
        var urlArr = window.matchImgUrl_6(data);
        append_html = "";
        urlArr.forEach(function (u) {
            append_html += "<li><img onmouseenter=\"bigImg(this)\" src='https://m.b7.cn" + u + "' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
        })
        $(".content ul").append(append_html);
        setTimeout(function () { loading = false }, 1000);
    });
}

function hiddenBigImg() {
    $('.float_img').css({
        'display': 'none',
    });
}

function buttonClick() {
    window.cleanTempImageCahce()
    window.copyImg(tt.src);
}

function getSource() {
    data = utools.db.get("doutuSourceNo");
    if (!data) {
        utools.db.put({
            _id: "doutuSourceNo",
            data: "1"
        });
        return "1";
    } else {
        return data.data;
    }
}

// function changeSource() {
//     data = utools.db.get("doutuSourceNo");
//     if (!data) {
//         utools.db.put({
//             _id: "doutuSourceNo",
//             data: "2"
//         });
//         utools.showNotification("已切换至图源 02", clickFeatureCode = null, silent = false)
//     } else {
//         num = parseInt(data.data) + 1
//         if (num > 4) {
//             num = 1
//         }
//         utools.db.put({
//             _id: "doutuSourceNo",
//             data: num,
//             _rev: data._rev
//         });
//         utools.showNotification("已切换至图源 0" + num + "（" + sourceArr[num] + "）", clickFeatureCode = null, silent = false)
//     }
// }

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
    utools.showNotification("已切换至图源 0" + num + "（" + sourceArr[num] + "）", clickFeatureCode = null, silent = false)
    $('.changeSourcePage ul li').css({ "border": "none", "background": "#eaeaea" })
    $('.changeSourcePage ul li').removeClass("selected");
    $(that).addClass("selected");
}

function enterText() {
    utools.setExpendHeight(500);
    $(".changeSourcePage").hide()
    $(".content").show();
    $(".click-changeSourcePage").show();
    $(".content ul").html('');
    getPic(text, 1)
}

function backContent(){
    $(".click-content").hide();
    $(".changeSourcePage").hide()
    $(".click-changeSourcePage").show();
}