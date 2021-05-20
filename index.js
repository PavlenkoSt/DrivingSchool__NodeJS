const http = require('http');
const fs = require('fs');

http.createServer((request, responce) => {
    if (request.url != '/favicon.ico') {
        if(request.url.startsWith('/public/')){
            const filePath = request.url.slice(1);

            fs.readFile(filePath, (err, data) => {
            if (err) {
                responce.statusCode = 404;
                responce.end('Page Not Found');
            }else{
                responce.statusCode = 200;
                const matchFile = filePath.match(/\.(js|css)$/);
                const matchImg =filePath.match(/\.(jpg|png)$/);
                if(matchFile){
                    responce.setHeader('Content-Type', `text/${matchFile[1]}`);
                }else if(matchImg){
                    responce.setHeader('Content-Type', `image/${matchImg[1]}`);
                }
                responce.write(data);
                responce.end();
            }
            return;
        });
        }else {
            getPage(request.url, responce);
        }
    }
}).listen(8888);

function getPage(pageName, responce, statusCode = 200) {
    if (pageName == '/') {
        pageName = 'index';
    }
    fs.readFile('pages/' + pageName + '.html', (err, content) => {
        if (!err) {
            fs.readFile('layouts/default.html', 'utf8', (err, layout)=>{
                if (err) throw err;

                layout = layout.toString().replace(/\{\{get content\}\}/g, content);

                const title = content.toString().match(/\{\{set title "(.*?)"\}\}/);
                if(title){
                    layout = layout.toString().replace(/\{\{get title\}\}/, title[1]);
                    layout = layout.toString().replace(/\{\{set title ".*?"\}\}/, '');
                }

                fs.readFile('elems/header.html', 'utf8', (err, header) => {
                    if (err) throw err;
    
                    layout = layout.toString().replace(/\{\{get header\}\}/g, header);

                    fs.readFile('elems/footer.html', 'utf8', (err, footer) => {
                        if (err) throw err;
        
                        layout = layout.toString().replace(/\{\{get footer\}\}/g, footer);
                        responce.setHeader('Content-Type', 'text/html');
                        responce.statusCode = statusCode;
                        responce.write(layout);
                        responce.end();
                        
                    });
                });
            });
        } else {
            if (statusCode != 404) {
                getPage('404', responce, 404);
            } else {
                throw err;
            }
        }
    });
}
