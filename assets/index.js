var text=''
var page=1
var loading = false
var tt=false
var the_img
var sourceNum
utools.onPluginEnter(({ code, type, payload }) => {
    if(code == 'changeSource'){
        changeSource();
    }else{
        utools.setExpendHeight(0);
        utools.setSubInput(({
            text
        }) => {
            this.text = text
            this.page = 1 
        }, "想搜点啥（搜索结果点击即可复制到剪切板）");
    }

    
    
});



$(document).keydown(e => {
    switch (e.keyCode) {
        case 13:
            utools.setExpendHeight(500);
            $(".content ul").html('');
            getPic(text,1)
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
        if(loading == true){
            return 
        }
        loading = true
        page = page+1
        getPic(text,page)
    }
})


function getPic(word,page_num){
    num = getSource()
    eval("getPic"+num+"(word,page_num)");
    // (getPic+num)(word,page_num);
}
//图片来源03
function getPic03(word,page_num){
    loading = true
    if(isNaN(page_num)){
        page_num = 1;
    }
    if(page_num<=1){
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://pic.sogou.com/pics/json.jsp?query="+word+"&st=5&start="+(page_num-1)*16+"&xml_len=16";
    $.getJSON(url, function(data){
        $.each(data.items, function(i,item){
            append_html  += "<li><img onmouseenter=\"bigImg(this)\" src='"+item.picUrl+"' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
          });
          $(".content ul").append(append_html);
          setTimeout(function(){ loading = false}, 1000);
    });
}



//图片来源02
function getPic02(word,page_num){
    loading = true
    if(isNaN(page_num)){
        page_num = 1;
    }
    if(page_num<=1){
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://www.doutula.com/search?type=photo&more=1&keyword="+word+"&page="+page_num;
    $.get(url, function(data){
        var urlArr = window.matchImgUrl(data);
        append_html = "";
        urlArr.forEach(function(u){  
            append_html  += "<li><img onmouseenter=\"bigImg(this)\" src='"+u+"' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";            
        })
        // $.each(data.items, function(i,item){
        //      append_html  += "<li><img onmouseenter=\"bigImg(this)\" src='"+item.picUrl+"' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
        //   });
        $(".content ul").append(append_html);
        setTimeout(function(){ loading = false}, 1000);
    });
}

//图片来源01
function getPic01(word,page_num){
    loading = true
    if(isNaN(page_num)){
        page_num = 1;
    }
    if(page_num<=1){
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://www.52doutu.cn/api/?types=search&action=searchpic&limit=20&wd="+word+"&offset="+page_num;
    $.get(url, function(data){
        append_html = "";
        data.rows.forEach(function(u){  
            append_html  += "<li><img onmouseenter=\"bigImg(this)\" src='"+u.url+"' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";            
        })
        $(".content ul").append(append_html);
        setTimeout(function(){ loading = false}, 1000);
    });
}

//图片来源04
function getPic04(word,page_num){
    loading = true
    if(isNaN(page_num)){
        page_num = 1;
    }
    if(page_num<=1){
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://fabiaoqing.com/search/search/keyword/"+word+"/type/bq/page/"+page_num+".html";
    $.get(url, function(data){
        var urlArr = window.matchImgUrl(data);
        append_html = "";
        urlArr.forEach(function(u){  
            append_html  += "<li><img onmouseenter=\"bigImg(this)\" src='"+u+"' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";            
        })
        // $.each(data.items, function(i,item){
        //      append_html  += "<li><img onmouseenter=\"bigImg(this)\" src='"+item.picUrl+"' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
        //   });
        $(".content ul").append(append_html);
        setTimeout(function(){ loading = false}, 1000);
    });
}

function bigImg(that){
    tt = that
    w = $(that).width()
    h = $(that).height()
    x = $(that).position().top;
    y = $(that).position().left;
    // url = $(that).children('img').attr('src')
    url = $(that).attr('src')
    // console.log('onMouse:'+url)

    $('.float_img').css({
        'position':'relative',
        'width':1.2*w+"px",
        'height':1.2*h+"px",
        'top':(x-0.2*w)+"px",
        'left':(y-0.2*h)+"px",
        'display':'block',
        'z-index':'999',
        'background-image':'url('+url+')',
        'background-size':'100% 100%',
        'background-repeat':'no-repeat',
        'background-position':'center',
        'background-color':'#ffffff',
    });
}

function hiddenBigImg(){
    $('.float_img').css({
        'display':'none',
    });
}

function buttonClick() 
{
    // window.copyImg(tt.getElementsByTagName("img").item(0).src);
    window.copyImg(tt.src);
}

function getSource(){
    data = utools.db.get("doutuSourceNum");
    if(!data){
        utools.db.put({
            _id: "doutuSourceNum",
            data: "01"
          });
        return "01";
    }else{
        return "0"+data.data;
    }
}

function changeSource(){
    data = utools.db.get("doutuSourceNum");
    if(!data){
        utools.db.put({
            _id: "doutuSourceNum",
            data: "02"
          });
          utools.showNotification("已切换至图源 02", clickFeatureCode = null, silent = false)
    }else{
        num = parseInt(data.data)+1
        if(num>4){
            num = 1
        }
        utools.db.put({
            _id: "doutuSourceNum",
            data: ""+num,
            _rev: data._rev
          });
          utools.showNotification("已切换至图源 0"+num, clickFeatureCode = null, silent = false)
    }
}