import { Router } from 'express'
import { omit } from 'remeda'

import { CreateUserService } from '../services'

const usersRouter = Router()

usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const createUser = new CreateUserService()

    const user = await createUser.execute({ name, email, password })

    const userWithoutPassword = omit(user, ['password'])

    return res.status(201).json(userWithoutPassword)
  } catch (err) {
    return res.status(400).json({ error: err.mesage })
  }
})

export default usersRouter
