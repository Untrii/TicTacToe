import { reactive } from 'vue'

function getDefaultStore() {
  return {
    id: '',
    rid: '',
    openedPage: 'login',
    isRequestSent: false,
    requestTarget: '',
    lobby: [],
    gameState: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    gameSide: 'cross',
    opponentId: '',
    isGameEndScreenShown: false,
    gameResult: 'T',
    nickname: '',
  }
}

if (!window.__store) window.__store = reactive(getDefaultStore())

export default window.__store

export function reset() {
  window.__store = reactive(getDefaultStore())
}
