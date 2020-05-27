import 'reflect-metadata'

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import 'express-async-errors'

import routes from './routes'
import AppError from '@shared/errors/AppError'
import uploadConfig from '@config/upload'

import '@shared/infra/typeorm'
import '@shared/container'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadFolder))
app.use(routes)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

const PORT = process.env.PORT ?? 3333

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`)
})
