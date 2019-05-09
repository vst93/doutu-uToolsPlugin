var text=''
var page=1
var loading = false
utools.onPluginEnter(({ code, type, payload }) => {
    utools.setExpendHeight(0);
    utools.setSubInput(({
        text
    }) => {
        this.text = text
        this.page = 1 
    }, "想搜点啥");
});


$(document).keydown(e => {
    switch (e.keyCode) {
        case 13:
            utools.setExpendHeight(500);
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

// $(".content ul li img").onmouseenter=function(that){
//     w = that.width
//     h = that.height
//     x = that.position().top;
//     y = that.position().left;
//     $('.float_img').css("width",1.2*w+"px");
//     $('.float_img').css("height",1.2*h+"px");
//     $('.float_img').css("top",x+"px");
//     $('.float_img').css("left",y+"px");
//     $('.float_img').css("displa","block");
// };

function getPic(word,page_num){
    loading = true
    if(isNaN(page_num)){
        page_num = 1;
    }
    if(page_num<=1){
        $(".content ul").html('');
    }
    var append_html = ""
    var url = "https://pic.sogou.com/pics/json.jsp?query="+word+"&st=5&start="+(page_num-1)*10+"&xml_len=10";
    $.getJSON(url, function(data){
        $.each(data.items, function(i,item){
            append_html  += "<li><img onmouseenter=\"bigImg()\" src='"+item.picUrl+"' onerror=\"this.onerror='';src='assets/loading.gif'\" /></li>";
          });
          $(".content ul").append(append_html);
          setTimeout(function(){ loading = false}, 1000);
    });
}

function bigImg(){
    w = $(this).width
    h = $(this).height
    x = $(this).position().top;
    y = $(this).position().left;
    $('.float_img').css("width",1.2*w+"px");
    $('.float_img').css("height",1.2*h+"px");
    $('.float_img').css("top",x+"px");
    $('.float_img').css("left",y+"px");
    $('.float_img').css("display","block");
}
