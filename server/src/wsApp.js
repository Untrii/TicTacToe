import { Server } from 'socket.io'

const stateTypes = {
  LOBBY: 'lobby',
  REQUEST_SENT: 'requestSent',
  IN_GAME: 'inGame',
}

let users = new Map()
let games = new Map()

function generateRID() {
  const length = 8
  const result = []
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * characters.length))
    )
  }
  return result.join('')
}

function getPublicUserData(userData) {
  return {
    nickname: userData.nickname,
    rid: userData.rid,
  }
}

function getLobbyData() {
  return Array.from(users.values())
    .filter((entry) => entry.id && entry.nickname)
    .map((entry) => getPublicuserData(entry))
}

function isUserExists(rid) {
  for (const [key, value] of users) {
    if (key.rid == rid) return true
  }
  return false
}

function notifyAll() {
  let data = getLobbyData()
  Array.from(users.keys()).forEach((entry) => entry.emit('lobbyUpdate', data))
}

function notifyByRID(rid) {
  let data = getLobbyData()
  for (const [key, value] of users) {
    if (value.rid == rid) key.emit('lobbyUpdate', data)
  }
}

function getUserByRID(rid) {
  for (const [key, value] of users) {
    if (value.rid == rid) return value
  }
}

function createGame(firstUserId, secondUserId) {
  let gameId = generateRID()
  let cross = firstUserId
  let circle = secondUserId
  if (Math.random() < 0.5) {
    cross = secondUserId
    circle = firstUserId
  }
  let game = {
    cross,
    circle,
    state: 'EEEEEEEEE',
  }
  games.set(gameId, game)
  return gameId
}

function sendGameState(gameId) {
  let game = games.get(gameId)
  if (!game) return
  for (const [key, value] of users) {
    if (value.rid == game.cross || value.rid == game.circle) {
      key.emit('gameUpdated', game)
    }
  }
}

function enterLobby(userRID) {
  let user = getUserByRID(userRID)
  user.state = {
    type: stateTypes.LOBBY,
  }
  notifyByRID(userRID)
}

function leaveGame(userRID) {
  for (const [key, value] of games) {
    if (value.cross == userRID || value.circle == userRID) {
      games.delete(key)

      enterLobby(value.cross)
      enterLobby(value.circle)
    }
  }
}

function getGameIDByUserRID(userRID) {
  for (const [key, value] of games) {
    if (value.cross == userRID || value.circle == userRID) {
      return key
    }
  }
}

function isGameEnd(gameState) {
  return (
    (gameState[0] == gameState[1] && gameState[1] == gameState[2]) ||
    (gameState[3] == gameState[4] && gameState[4] == gameState[5]) ||
    (gameState[6] == gameState[7] && gameState[7] == gameState[8]) ||
    (gameState[0] == gameState[3] && gameState[3] == gameState[6]) ||
    (gameState[1] == gameState[4] && gameState[4] == gameState[7]) ||
    (gameState[2] == gameState[5] && gameState[5] == gameState[8]) ||
    (gameState[0] == gameState[4] && gameState[4] == gameState[8]) ||
    (gameState[2] == gameState[4] && gameState[4] == gameState[6]) ||
    !gameState.includes('E')
  )
}

function onConnection(socket) {
  let user = {
    id: undefined,
    nickname: undefined,
    rid: undefined,
    state: {
      type: stateTypes.LOBBY,
      value: undefined,
    },
  }

  users.set(socket, user)

  socket.on('disconnect', () => {
    users.delete(socket)
    leaveGame(user.rid)
  })

  socket.on('idUpdate', (data) => {
    user.id = data.toString()
    if (user.id && user.nickname) user.rid = generateRID()
    notifyAll()
  })

  socket.on('nicknameUpdate', (data) => {
    user.nickname = data.toString()
    if (user.id && user.nickname) user.rid = generateRID()
    notifyAll()
  })

  socket.on('requestSent', (targetRID) => {
    if (!isUserExists(targetRID)) {
      socket.emit('serverError', 'User does not exists')
      return
    }
    if (
      targetUser.state.type == stateTypes.REQUEST_SENT &&
      targetUser.state.value == user.rid
    ) {
      let gameId = createGame(targetRID, user.rid)
      targetUser.state = {
        type: stateTypes.IN_GAME,
        value: gameId,
      }
      user.state = {
        type: stateTypes.IN_GAME,
        value: gameId,
      }
      sendGameState(gameId)
    }
    let targetUser = getUserByRID(targetRID)
    user.state.type = stateTypes.REQUEST_SENT
    user.state.value = targetRID.toString()
    notifyByRID(targetRID)
  })

  socket.on('turnMade', (position) => {
    let gameId = getGameIDByUserRID(user.rid)
    if (!gameId) enterLobby(user.rid)
    let game = games.get(gameId)

    if (game.state[position] != 'E') {
      sendGameState()
      return
    }
    let crossCount = 0
    let circleCount = 0

    for (let i = 0; i < game.state.length; i++) {
      if (game.state[i] == 'X') crossCount++
      if (game.state[i] == 'O') circleCount++
    }

    if (user.rid == game.cross) {
      if (crossCount == circleCount) game.state[position] = 'X'
    } else {
      if (crossCount - 1 == circleCount) game.state[position] = 'O'
    }
    sendGameState(gameId)
    if (isGameEnd(game.state)) leaveGame(user.rid)
  })
}

function init(httpServer) {
  const io = new Server(httpServer)
  io.on('connection', onConnection)
}

export default { init }
