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

const store = reactive(getDefaultStore())

export default store

export function reset() {
  const newStore = getDefaultStore()
  for (const key in newStore) {
    store[key] = newStore[key]
  }
}
