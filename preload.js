const electron = require('electron')
const { clipboard } = require('electron')
const app = electron.app
const path = require('path')
const http = require('http');
const https = require('https');
const fs = require('fs');

copyImg = imgUrl => {
    let image = new Image();
    image.src = imgUrl;
    image.onload = function () {
        //图片加载完成后转换成base64字符串
        let base64 = getBase64Image(image);
        let img = electron.nativeImage.createFromDataURL(base64);
        clipboard.writeImage(img)
        utools.hideMainWindow()
    };
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
    var res =  []
　　 while(re = reg.exec(str)){
        res.push(re[1])
　　}   
    return res;
}