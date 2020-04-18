import { Router } from 'express'
import { omit } from 'remeda'
import multer from 'multer'

import { CreateUserService, UpdateUserAvatarService } from '../services'
import { ensureAuthenticated } from '../middlewares'
import { uploadConfig } from '../config'

const usersRouter = Router()
const upload = multer(uploadConfig)

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body

  const createUser = new CreateUserService()

  const user = await createUser.execute({ name, email, password })

  const userWithoutPassword = omit(user, ['password'])

  return res.status(201).json(userWithoutPassword)
})

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const updateUserAvatar = new UpdateUserAvatarService()

    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    })

    const userWithoutPassword = omit(user, ['password'])

    return res.json(userWithoutPassword)
  },
)

export default usersRouter
