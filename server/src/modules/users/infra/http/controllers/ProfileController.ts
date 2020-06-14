import { Request, Response } from 'express'
import { container } from 'tsyringe'

import UpdateProfileService from '@modules/users/services/UpdateProfileService'
import { omit } from 'remeda'
import ShowProfileService from '@modules/users/services/ShowProfileService'

class UsersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id

    const showProfile = container.resolve(ShowProfileService)

    const profile = await showProfile.execute({ user_id })

    const profileWithoutPassword = omit(profile, ['password'])

    return response.json(profileWithoutPassword)
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id
    const { name, email, oldPassword, password } = request.body

    const updateProfile = container.resolve(UpdateProfileService)

    const profile = await updateProfile.execute({
      user_id,
      name,
      email,
      oldPassword,
      password,
    })

    const profileWithoutPassword = omit(profile, ['password'])

    return response.json(profileWithoutPassword)
  }
}

export default UsersController
