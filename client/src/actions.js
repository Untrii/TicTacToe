import store from './store'
import * as api from './api'
import * as base64 from './base64'

function getIdFromCookies() {
  let cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    let cookieParts = cookie.split('=')
    if (cookieParts[0] == 'id') return cookieParts[1]
  }
}

function generateID() {
  let id = getIdFromCookies()
  if (id) return id

  let arr = new Uint8Array(32)
  window.crypto.getRandomValues(arr)
  let b64encoded = base64
    .bytesToBase64(arr)
    .split('=')
    .join('')
  document.cookie = 'id=' + b64encoded
  return b64encoded
}

export function updateID() {
  let id = generateID()
  api.updateID(id)
  store.id = id
}

export function updateNickname() {
  if (store.nickname.length > 0) api.updateNickname(store.nickname)
}

export function setNickname(nickname) {
  store.nickname = nickname
  api.updateNickname(nickname)
}

export function sendRequest(rid) {
  store.isRequestSent = true
  store.requestTarget = rid
  api.sendRequest(rid)
}

function isCorrectTurn(position) {
  if (store.gameState[position] != 'E') return false
  let circleCount = 0
  let crossCount = 0
  for (const field of store.gameState) {
    if (field == 'X') crossCount++
    else if (field == 'O') circleCount++
  }

  if (store.gameSide == 'cross') {
    return circleCount == crossCount
  }
  if (store.gameSide == 'circle') {
    return circleCount == crossCount - 1
  }
}

export function makeTurn(index) {
  if (isCorrectTurn(index)) {
    store.gameState[index] = store.gameSide == 'circle' ? 'O' : 'X'
    api.makeTurn(index)
  }
}
