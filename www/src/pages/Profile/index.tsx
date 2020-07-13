import React, { useCallback, useRef, ChangeEvent } from 'react'
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { useHistory, Link } from 'react-router-dom'

import Input from '../../components/Input'
import Button from '../../components/Button'

import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

import { Container, Content, AvatarInput } from './styles'
import { useToast } from '../../hooks/toast'
import { useAuth } from '../../hooks/auth'

interface ProfileFormData {
  name: string
  email: string
  oldPassword: string
  password: string
  passwordConfirmation: string
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { user, updateUser } = useAuth()

  const { addToast } = useToast()

  const history = useHistory()

  const handleSubmit = useCallback(
    async (data: ProfileFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .required('E-mail is required')
            .email('Type a valid e-mail address'),
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: value => !!value.length,
            then: Yup.string().required('Password is required'),
            otherwise: Yup.string(),
          }),
          passwordConfirmation: Yup.string()
            .when('oldPassword', {
              is: value => !!value.length,
              then: Yup.string().required('Password is required'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), null],
              'Incorrect password confirmation',
            ),
        })

        await schema.validate(data, { abortEarly: false })

        const {
          name,
          email,
          oldPassword,
          password,
          passwordConfirmation,
        } = data

        const formData = oldPassword
          ? {
              name,
              email,
              oldPassword,
              password,
              // eslint-disable-next-line @typescript-eslint/camelcase
              password_confirmation: passwordConfirmation,
            }
          : { name, email }

        const response = await api.put('/profile', formData)

        updateUser(response.data)

        history.push('/dashboard')

        addToast({
          type: 'success',
          title: 'Profile updated!',
          description: 'Your profile changes were successfully applied',
        })
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error)

          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Update profile error',
          description: 'There was an error while trying to update your profile',
        })
      }
    },
    [history, addToast, updateUser],
  )

  const handleAvatarChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const data = new FormData()

        data.append('avatar', event.target.files[0])

        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data)

          addToast({
            type: 'success',
            title: 'Avatar updated',
          })
        })
      }
    },
    [addToast, updateUser],
  )

  return (
    <Container>
      <header>
        <div>
          <Link to="dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{ name: user.name, email: user.email }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />

            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>My profile</h1>

          <Input name="name" type="text" placeholder="Name" icon={FiUser} />

          <Input name="email" type="email" placeholder="E-mail" icon={FiMail} />

          <Input
            name="oldPassword"
            type="password"
            placeholder="Current password"
            containerStyle={{ marginTop: 24 }}
            icon={FiLock}
          />

          <Input
            name="password"
            type="password"
            placeholder="New password"
            icon={FiLock}
          />

          <Input
            name="passwordConfirmation"
            type="password"
            placeholder="Confirm password"
            icon={FiLock}
          />

          <Button type="submit">Confirm changes</Button>
        </Form>
      </Content>
    </Container>
  )
}

export default Profile
