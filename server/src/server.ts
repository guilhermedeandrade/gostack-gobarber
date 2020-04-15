import 'reflect-metadata'

import express from 'express'

import routes from './routes'
import { uploadConfig } from './config'
import './database'

const app = express()

app.use(express.json())
app.use('/files', express.static(uploadConfig.directory))
app.use(routes)

const PORT = process.env.PORT ?? 3333

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
