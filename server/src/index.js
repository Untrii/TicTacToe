import httpApp from './httpApp.js'
import wsApp from './wsApp.js'
import config from './config.js'
import http from 'http'

const server = http.createServer(httpApp)
wsApp.init(server)
server.listen(config.SERVER_PORT)

console.log('OK. Started')
