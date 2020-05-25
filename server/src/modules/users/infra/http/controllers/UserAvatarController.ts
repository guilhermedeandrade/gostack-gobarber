import { Request, Response } from 'express'
import { omit } from 'remeda'
import { container } from 'tsyringe'

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'

class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService)

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    })

    const userWithoutPassword = omit(user, ['password'])

    return response.json(userWithoutPassword)
  }
}

export default UserAvatarController
