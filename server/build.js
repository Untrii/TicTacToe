import cp from 'child_process'
import fse from 'fs-extra'

const { spawn } = cp
const { copySync } = fse

const cmd = spawn('cmd', ['/c', 'cd .. && cd client && npm run build'])

cmd.stdout.pipe(process.stdout)
cmd.on('close', () => {
  copySync('../client/dist', 'public')
  console.log('OK. Built.')
})
