import express from 'express'
import fs from 'fs'
import * as WebSocket from 'ws'
import http from 'http'
import StoreService from './StoreService'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const storageService = new StoreService()

let webSocketContexts = {}

wss.on('connection', (ws) => {
  let user = undefined
  ws.on('message', (message) => {
    if (message.startsWith('auth:')) {
      let authData = message.replace('auth:', '').split(',')
      let login = authData[0]
      let secretKey = authData[1]
      webSocketContexts[storageService.getUserId(secretKey)] = {
        send: (data) => {
          ws.send(data)
        },
      }
      storageService.register(login, secretKey)
      user = storageService.userByKey(message.replace('login:', ''))
      ws.send('info:loggedIn')
    }
    if (message.startsWith('closeGame:')) {
      let data = message.replace('closeGame:', '')
      let disconnectedUsers = storageService.closeGame()
    }
  })
})

app.use(express.static('../public'))

server.listen(3000)
