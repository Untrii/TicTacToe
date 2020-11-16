import express from 'express'
import http from 'http'

const app = express()

function forward(req, res) {
  const forwardUrl = 'localhost'
  let connector = http.request(
    {
      host: forwardUrl,
      port: 8080,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (resp) => {
      resp.pipe(res)
    }
  )

  req.pipe(connector)
}

app.get(/^((?!socket-io).)*$/s, forward)

export default app
