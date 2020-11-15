import { promises, readFileSync, existsSync, writeFileSync } from 'fs'
const { writeFile } = promises

const dbPath = '../data/users.json'

export default class DatabaseProvider {
  data = []
  path
  constructor(path, defaultData) {
    this.path = path
    if (!existsSync(path)) writeFileSync(path, JSON.stringify(defaultData))
    data = JSON.parse(readFileSync(path))
  }

  async syncWithFile() {
    writeFile(path, JSON.stringify(this.data))
  }
}
