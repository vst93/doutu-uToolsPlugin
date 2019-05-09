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

function getPic(word,page_num){
    loading = true
    if(isNaN(page_num)){
        page_num = 1;
    }
    if(page_num<=1){
        $("#cc").html('');
    }
    var append_html = ""
    var url = "https://pic.sogou.com/pics/json.jsp?query="+word+"&st=5&start="+(page_num-1)*10+"&xml_len=10";
    $.getJSON(url, function(data){
        $.each(data.items, function(i,item){
            append_html  += "<i><img src='"+item.picUrl+"' /></i>";
          });
          $("#cc").append(append_html);
          setTimeout(function(){ loading = false}, 800);
    });
}

