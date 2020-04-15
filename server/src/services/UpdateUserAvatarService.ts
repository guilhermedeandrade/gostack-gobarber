import { getRepository } from 'typeorm'
import path from 'path'
import fs from 'fs'

import { User } from '../models'
import { uploadConfig } from '../config'
import { AppError } from '../errors'

interface Request {
  user_id: string
  avatarFilename: string
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne(user_id)

    if (!user) {
      throw new AppError('Only authenticated users can update avatar', 401)
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }

    const updatedUser = { ...user, avatar: avatarFilename }

    await userRepository.save(updatedUser)

    return updatedUser
  }
}

export default UpdateUserAvatarService
