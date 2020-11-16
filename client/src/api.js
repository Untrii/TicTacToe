import { io } from 'socket.io-client'
import store, { reset } from './store'
import * as actions from './actions'

const stateTypes = {
  LOBBY: 'lobby',
  REQUEST_SENT: 'requestSent',
  IN_GAME: 'inGame',
}

function getWinner() {
  let field = store.gameState
  let mark = store.gameSide == 'circle' ? 'O' : 'X'
  for (let i = 0; i < 3; i++) {
    if (
      field[i] != 'E' &&
      field[i] == field[i + 3] &&
      field[i + 3] == field[i + 6]
    )
      return field[i]
    if (
      field[i * 3] != 'E' &&
      field[i * 3] == field[i * 3 + 1] &&
      field[i * 3 + 1] == field[i * 3 + 2]
    )
      return field[i * 3]
  }
  if (
    (field[0] != 'E' && field[0] == field[4] && field[4] == field[8]) ||
    (field[2] != 'E' && field[2] == field[4] && field[4] == field[6])
  )
    return field[4]
  if (!field.includes('E')) return 'T'
}

function init(store) {
  const socket = io()
  window.__socket = socket
  socket.on('disconnected', () => {
    reset()
  })
  socket.on('authRequest', () => {
    actions.updateID()
    actions.updateNickname()
  })
  socket.on('ridGiven', (rid) => {
    console.log('got ridGiven packet')
    console.log(rid)
    store.rid = rid
  })
  socket.on('lobbyUpdate', (lobby) => {
    console.log('got lobbyUpdate packet')
    console.log(lobby)
    store.lobby = lobby
  })
  socket.on('gameUpdate', (game) => {
    console.log('got gameUpdate packet')
    console.log(game)
    store.gameState = game.state

    if (store.rid == game.cross) store.gameSide = 'cross'
    else store.gameSide = 'circle'

    let winner = getWinner()
    if (winner) {
      store.gameResult = winner
      store.isGameEndScreenShown = true
    }
  })
  socket.on('stateUpdate', (state) => {
    console.log('got stateUpdate packet')
    console.log(state)
    if (state.type == stateTypes.LOBBY) {
      store.openedPage = 'lobby'
      store.isRequestSent = false
      store.requestTarget = ''
    }
    if (state.type == stateTypes.IN_GAME) {
      store.openedPage = 'game'
      store.isRequestSent = false
      store.requestTarget = ''
    }
    if (state.type == stateTypes.REQUEST_SENT) {
      store.openedPage = 'lobby'
      store.isRequestSent = true
      store.requestTarget = state.value
    } else store.isRequestSent = false
  })
}

if (!window.__socket) init(store)
const socket = window.__socket

export function updateID(newID) {
  socket.emit('idUpdate', newID)
}

export function updateNickname(newNick) {
  socket.emit('nicknameUpdate', newNick)
}

export function sendRequest(targetRID) {
  socket.emit('requestSend', targetRID)
}

export function makeTurn(position) {
  socket.emit('turnMade', position)
}
