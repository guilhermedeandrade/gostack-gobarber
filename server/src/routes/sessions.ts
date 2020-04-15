import { Router } from 'express'
import { omit } from 'remeda'

import { CreateSessionService } from '../services'

const sessionsRouter = Router()

sessionsRouter.post('/', async (req, res) => {
  try {
    const { email, password } = req.body

    const createSession = new CreateSessionService()

    const { user, token } = await createSession.execute({ email, password })

    const userWithoutPassword = omit(user, ['password'])

    return res.json({ user: userWithoutPassword, token })
  } catch (err) {
    return res.status(err.statusCode).json({ error: err.message })
  }
})

export default sessionsRouter
