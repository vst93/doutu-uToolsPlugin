const electron = require('electron')
const { clipboard } = require('electron')
const app = electron.app
const path = require('path')
const http = require('http');
const https = require('https');
const fs = require('fs');
const os = require('os');
const nativeImage = require('electron').nativeImage

copyImg = (imgUrl, ctrlV) => {
    if (os.type() == 'Windows_NT') {
        // window 系统下载网络图片到 temp 目录，然后 以 html 写入clipboard
        var the_dir = utools.getPath('temp') + 'utoolsDoutuPlugin/';
        var path = the_dir + 'tempImage' + (new Date()).valueOf() + '.';
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
                    var dataBuffer = new Buffer.from(base64Data, 'base64');
                    path = path + imageType;

                    if (utools.copyImage(dataBuffer) == false) {
                        console.log('clipboard.write')
                        fs.writeFile(path, dataBuffer, err => {
                            //windows 系统以 html 写入clipboard
                            clipboard.write({
                                html: "<img src=\"" + path + "\" width=\"200\" alt=\"" + path + "\" >",
                            })
                        });

                    } else {
                        console.log('utools.copyImage')
                    }

                    utools.hideMainWindow()

                    if (ctrlV == true) {
                        utools.simulateKeyboardTap('v', utools.isMacOs() ? 'command' : 'ctrl')
                    }
                };

            })
            .catch(console.error);

    } else if (os.type() == 'Darwin') {
        // mac 系统下载网络图片到 temp 目录，然后以 NSFilenamesPboardType 的 Buffer 写入clipboard
        var the_dir = utools.getPath('temp') + 'utoolsDoutuPlugin/';
        // var path = the_dir + 'temp.' + imgUrl.substring(imgUrl.lastIndexOf(".") + 1)
        var path = the_dir + 'tempImage' + (new Date()).valueOf() + '.';
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
                    if (imageType != 'gif') {
                        utools.copyImage(base64Data)
                    } else {
                        // 过滤data:URL
                        base64Data = base64Data.replace(/^data:.+;base64,/, '');
                        var dataBuffer = new Buffer.from(base64Data, 'base64');
                        path = path + imageType;
                        console.log(path)
                        fs.writeFile(path, dataBuffer, err => {
                            // utools.copyImage(path)

                            //         clipboard.writeBuffer(
                            //             'NSFilenamesPboardType',
                            //             Buffer.from(`
                            //   <?xml version="1.0" encoding="UTF-8"?>
                            //   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
                            //   <plist version="1.0">
                            //     <array>
                            //       <string>`+ path + `</string>
                            //     </array>
                            //   </plist>
                            // `)
                            //         )

                            // fs.readFile(path, (err, data22) => {
                            //     if (err) {
                            //         console.log('xxx222')
                            //     } else {
                            //         let buffer22 = new Buffer.from(data22, "utf-8");

                            //         aa = clipboard.writeBuffer(
                            //             "public.utf8-plain-text",
                            //             buffer22
                            //         );
                            //         console.log(aa)

                            //         console.log('xxx')
                            //     }
                            // });


                            // clipboard.writeBuffer('NSFilenamesPboardType', Buffer.from(plist.build(path)));

                            utools.copyFile(path)

                        });
                    }

                    utools.hideMainWindow()
                    if (ctrlV == true) {
                        utools.simulateKeyboardTap('v', utools.isMacOs() ? 'command' : 'ctrl')
                    }
                };

            })
            .catch(console.error);
    } else if (os.type() == 'Linux') {
        var the_dir = utools.getPath('temp') + '/utoolsDoutuPlugin/';
        var path = the_dir + 'tempImage' + (new Date()).valueOf() + '.';
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
                    var dataBuffer = new Buffer.from(base64Data, 'base64');
                    path = path + imageType;

                    fs.writeFile(path, dataBuffer, err => {
                        utools.copyFile(path)
                    });

                    utools.hideMainWindow()
                    if (ctrlV == true) {
                        utools.simulateKeyboardTap('v', utools.isMacOs() ? 'command' : 'ctrl')
                    }
                };

            })
            .catch(console.error);



    } else {
        utools.showNotification('当前系统暂不支持', clickFeatureCode = null, silent = false)
    }

}


copyImg2 = (imgUrl, ctrlV) => {
    var the_dir = utools.getPath('temp') + '/utoolsDoutuPlugin/';
    var path = the_dir + 'tempImage' + (new Date()).valueOf() + '.';
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
                // var dataHeader = /^data:image\/(\w+);base64,/gim;
                // var imageType = 'gif';
                // while (re = dataHeader.exec(base64Data)) {
                //     imageType = re[1];
                //     console.log(imageType)
                //     break;
                // }

                // 过滤data:URL
                // base64Data = base64Data.replace(/^data:.+;base64,/, '');
                // var dataBuffer = new Buffer.from(base64Data, 'base64');
                // path = path + imageType;

                // fs.writeFile(path, dataBuffer, err => {
                //     utools.copyFile(path)
                // });
                console.log(base64Data)
                aaa = utools.copyImage(base64Data)
                console.log(aaa)

                utools.hideMainWindow()
                if (ctrlV == true) {
                    utools.simulateKeyboardTap('v', utools.isMacOs() ? 'command' : 'ctrl')
                }
            };

        })
        .catch(console.error);

}



/**
 * 清理缓存的图片
 */
cleanTempImageCahce = () => {
    if (os.type() == 'Linux') {
        var theDir = utools.getPath('temp') + '/utoolsDoutuPlugin/';
    } else {
        var theDir = utools.getPath('temp') + 'utoolsDoutuPlugin/';
    }

    fs.exists(theDir, function (exists) {
        if (exists) {
            let theFiles = [];
            let files = fs.readdirSync(theDir);
            files.forEach(function (item, index) {
                let fPath = path.join(theDir, item);
                let stat = fs.statSync(fPath);
                if (stat.isFile() === true) {
                    theFiles.push(fPath);
                }
            });
            if (theFiles.length >= 20) {
                for (fiel_v of theFiles) {
                    fs.unlink(fiel_v, function (error) {
                        if (error) {
                            console.log(error);
                            return false;
                        }
                    })
                }
            }
        }
    });

}


matchImgUrl = str => {
    var reg = /data-original="(.*?)"/gim;
    var res = []
    while (re = reg.exec(str)) {
        res.push(re[1])
    }
    return res;
}


matchImgUrl_6 = str => {
    // var reg = /<a\Wclass="col-sm-3".*<img\Wsrc="(.*)"\Wtitle=/gim;
    var reg = /img src="(.*)" title/gim;
    var res = []
    while (re = reg.exec(str)) {
        res.push(re[1])
    }
    return res;
}


matchImgUrl_7 = str => {
    // var reg = /<a\Wclass="col-sm-3".*<img\Wsrc="(.*)"\Wtitle=/gim;
    console.log(str)
    var reg = /data-src="(.*)" alt/gim;
    var res = []
    while (re = reg.exec(str)) {
        res.push(re[1])
    }
    return res;
}

