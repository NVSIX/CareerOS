const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.resolve(process.argv[2] || path.join(__dirname, 'dist', 'careeros-angular', 'browser'))
const port = Number(process.argv[3] || 4207)
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error(`Missing index.html in ${root}`)
  process.exit(1)
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  let filePath = path.join(root, urlPath === '/' ? 'index.html' : urlPath)
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, 'index.html')
  }
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', mime[path.extname(filePath)] || 'application/octet-stream')
  fs.createReadStream(filePath).pipe(res)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`CareerOS Angular static server on http://127.0.0.1:${port}`)
  console.log(`Serving ${root}`)
})
