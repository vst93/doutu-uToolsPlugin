const electron = require('electron')
const { clipboard } = require('electron')
const app = electron.app
const path = require('path')
const http = require('http');
const https = require('https');
const fs = require('fs');
const os = require('os');

copyImg = imgUrl => {

    if (os.type() == 'Windows_NT') {
        // windows 系统以 html 写入clipboard
        clipboard.write({
            html: "<img src=\"" + imgUrl + "\">",
        })
        utools.hideMainWindow()
        return
    } else if (os.type() == 'Darwin') {
        // mac 系统下载网络图片到 temp 目录，然后以 NSFilenamesPboardType 的 Buffer 写入clipboard
        var the_dir = utools.getPath('temp') + '/utoolsDoutuPlugin/';
        var path = the_dir + 'temp.' + imgUrl.substring(imgUrl.lastIndexOf(".") + 1)
        //检查临时目录并创建
        fs.exists(the_dir, function (exists) {
            if (!exists) {
                fs.mkdir(the_dir, err => {
                })
            }
        });
        fetch(imgUrl)
            .then(respone => respone.blob())    // 将响应体转换成blob格式数据
            .then(blob => {
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    let base64Data = reader.result;
                    // 过滤data:URL
                    base64Data = base64Data.replace(/^data:image\/\w+;base64,/, '');
                    var dataBuffer = new Buffer(base64Data, 'base64');

                    fs.writeFile(path, dataBuffer, err => {

                        clipboard.writeBuffer(
                            'NSFilenamesPboardType',
                            Buffer.from(`
                  <?xml version="1.0" encoding="UTF-8"?>
                  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
                  <plist version="1.0">
                    <array>
                      <string>`+ path + `</string>
                    </array>
                  </plist>
                `)
                        )

                    });
                    utools.hideMainWindow()
                };

            })
            .catch(console.error);
    } else {
        utools.showNotification('当前系统暂不支持', clickFeatureCode = null, silent = false)
    }



}


//通过canvas2d 将图片转为base64
// function getBase64Image(img) {
//     let canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     let ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0, img.width, img.height);
//     let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
//     let dataURL = canvas.toDataURL("image/" + ext);
//     return dataURL;
// }

matchImgUrl = str => {
    var reg = /data-original="(.*?)"/gim;
    var res = []
    while (re = reg.exec(str)) {
        res.push(re[1])
    }
    return res;
}
