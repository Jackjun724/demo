var http = require('http');
var fs = require('fs')
var url = require('url');

const ws = require('nodejs-websocket');
const PORT = 8123

const connectList = []

//创建server,每次只要有用户连接，回调执行就会给用户创建一个connect对象
const wsServer = ws.createServer(connect => {
    connectList.push(connect)
    console.log('用户连接成功');
    //用户传来数据，触发text事件
    connect.on('text', data => {
        console.log(`接受到用户的数据:${data}`);
        //接受到数据后给用户响应数据
        connect.sendText(data);
    });

    //连接关闭触发close事件
    connect.on('close', () => {
        console.log('连接断开');
        connectList.pop(connect)
    });

    //注册error事件,用户端口后就会触发该异常
    connect.on('error', () => {
        console.log('用户连接异常');
    });
});

wsServer.listen(PORT, () => {
    console.log('监听8123');
});

var server = http.createServer(function (req, resp) {
    console.log(req.url)
    let realUrl = url.parse(decodeURI(req.url), true);
    if (realUrl.pathname === '/callback') {
        console.log(realUrl.query.body)
    
        connectList.forEach(e => {
            e.sendText(realUrl.query.body)
        })
        resp.end();
    } else {
        resp.write(fs.readFileSync('./pages/index.html'));
        resp.end();
    }
})

server.listen(8122, '0.0.0.0')