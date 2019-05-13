const electron = require('electron')
const { clipboard } = require('electron')
const app = electron.app
const path = require('path')
const http = require('http');
const https = require('https');
const fs = require('fs');

copyImg = (imgUrl) => {

    // $.ajax(imgUrl, {
    //     xhrFields: {
    //         responseType: 'blob'    // 指定响应数据类型为blob格式
    //     }
    // }) 
    // .then(blob => {
    //     let reader = new FileReader(); 
    //     reader.onloadend = function(){
    //         let dataUrl = reader.result;
    //         console.log("rr:"+dataUrl); // 输出DataURL数据
    //         let img = electron.nativeImage.createFromDataURL(dataUrl);
    //         clipboard.writeImage(img)
    //         utools.hideMainWindow()
    //     };
    //     let DataURL = reader.readAsDataURL(blob);  // 将blob数据转换成DataURL数据
    //     console.log("dd:"+DataURL); 


    // })
    // .catch(console.error);
    console.log(clipboard.availableFormats());
    clipboard.writeHTML('<p><img src="http://newsget-cache.stor.sinaapp.com/a708e39e34c71cada7250feb85082ab2.png"/></p>')


   
    // fs.readFile('/Users/vst/Documents/Code/utools/doutu/assets/loading.gif',function(err,data){
    //     var bitmap = new Buffer(data).toString('base64')
    //     var bit = Buffer.from(bitmap,'base64');
    //     let img = electron.nativeImage.createFromDataURL(bit);
    //     console.log("img:"+img);
    //     clipboard.writeImage(img);
    //     utools.hideMainWindow()
    //   });


    // fetch(imgUrl)
    //     .then(respone => respone.blob())    // 将响应体转换成blob格式数据
    //     .then(blob => {
    //         let reader = new FileReader();
    //         reader.readAsDataURL(blob);  // 将blob数据转换成DataURL数据
    //         reader.onloadend = function () {
    //             let dataUrl = reader.result;
    //             console.log("rr:"+dataUrl); // 输出DataURL数据
    //             let img = electron.nativeImage.createFromDataURL(dataUrl);
    //             console.log("img:"+img);
    //             // img = img.toDataURL();
    //             // console.log("imgTU:"+img);
    //             clipboard.writeImage(img);
    //             clipboard.writeBuffer('img', dataUrl)
    //             // clipboard.write({
    //             //     html: "<img src=\""+imgUrl+"\">",
    //             // });
    //             utools.hideMainWindow()
    //         };
           
    //     })
    //     .catch(console.error);

        
    // let image = new Image();
    // image.src = imgUrl;
    // image.onload = function () {
    //     //图片加载完成后转换成base64字符串
    //     let base64 = getBase64Image(image);
    //     let img = electron.nativeImage.createFromDataURL(base64);
    //     clipboard.writeImage(img)
    //     utools.hideMainWindow()
    // };
}

//通过canvas2d 将图片转为base64
function getBase64Image(img) {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    let dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
}

matchImgUrl = str => {
    var reg = /data-original="(.*?)"/gim;
    var res = []
    while (re = reg.exec(str)) {
        res.push(re[1])
    }
    return res;
}