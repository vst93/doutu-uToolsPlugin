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
            html: "<img src=\"" + imgUrl + "\" data-original=\"" + imgUrl + "\" data-backup=\"" + imgUrl + "\" >",
        })
        utools.hideMainWindow()
        return
    } else if (os.type() == 'Darwin') {
        // mac 系统下载网络图片到 temp 目录，然后以 NSFilenamesPboardType 的 Buffer 写入clipboard
        var the_dir = utools.getPath('temp') + 'utoolsDoutuPlugin/';
        // var path = the_dir + 'temp.' + imgUrl.substring(imgUrl.lastIndexOf(".") + 1)
        var path = the_dir + 'temp.'
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
                    var dataHeader = /^data:image\/(\w+);base64,/gim;
                    var imageType = 'gif';
                    while (re = dataHeader.exec(base64Data)) {
                        imageType = re[1];
                        break;
                    }
                    // 过滤data:URL
                    base64Data = base64Data.replace(/^data:.+;base64,/, '');
                    // base64Data = base64Data.replace(/^data:text\/plain;base64,/, 'data:image/gif;base64,');
                    
                    var dataBuffer = new Buffer.from(base64Data, 'base64');
                    path = path + imageType;
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



matchImgUrl = str => {
    var reg = /data-original="(.*?)"/gim;
    var res = []
    while (re = reg.exec(str)) {
        res.push(re[1])
    }
    return res;
}


