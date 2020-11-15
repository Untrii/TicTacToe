import DatabaseProvider from './DatabaseProvider'
import crypto from 'crypto'

const salt = '9247327563688226'

export default class StoreService {
  usersDatabase
  gamesDatabase

  constructor() {
    this.usersDatabase = new DatabaseProvider('../data/users.json')
    this.gamesDatabase = new DatabaseProvider('../data/games.json')
  }

  closeGame(secretKey) {
    let userId = this.getUserId(secretKey)
    let games = this.gamesDatabase.data
    games = games.filter((game) => game.members.includes(userId))
    let disconnectedUsers = new Set()
    for (const game of games) {
      for (const member of game.members) {
        disconnectedUsers.add(member)
        let user = this.userById(member)
        user.state = 'lobby'
      }
    }
    this.usersDatabase.syncWithFile()
    return Array.from(disconnectedUsers)
  }

  getLobby() {
    let users = this.usersDatabase.data
    return users
      .filter((user) => user.state == 'lobby')
      .map((user) => {
        return {
          login: user.login,
          id: this.getUserId(user.secretKey),
        }
      })
    return users
  }

  sendInvite(invitorSecretKey, targetId) {}

  getUserId(secretKey) {
    return crypto.createHash('sha256').update(secretKey).digest('hex')
  }

  getUserSecretKey() {}

  createUserObject(login, secretKey) {
    return {
      login,
      secretKey,
      state: 'lobby',
    }
  }

  async register(login, secretKey) {
    let users = this.usersDatabase.data
    users.push(this.createUserObject(login, secretKey))
  }

  userByKey(key) {
    let users = this.usersDatabase.data
    users.find((user) => user.secretKey == key)
    return users[0]
  }

  userById(id) {
    let users = this.usersDatabase.data
    users.find((user) => this.getUserId(user.secretKey) == id)
    return users[0]
  }
}
