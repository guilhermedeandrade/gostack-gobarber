import React, { useCallback, useRef } from 'react'
import { FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { useHistory, useLocation } from 'react-router-dom'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { useToast } from '../../hooks/toast'

import getValidationErrors from '../../utils/getValidationErrors'

import logoImg from '../../assets/logo.svg'

import { Container, Background, Content, AnimationContainer } from './styles'
import api from '../../services/api'

interface ResetPasswordFormData {
  password: string
  passwordConfirmation: string
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast()

  const history = useHistory()

  const location = useLocation()

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          password: Yup.string().required('Type your password'),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Incorrect password confirmation',
          ),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        const { password, passwordConfirmation } = data

        const token = location.search.replace('?token=', '')

        if (!token) {
          throw new Error()
        }

        await api.post('/password/reset', {
          password,
          // eslint-disable-next-line @typescript-eslint/camelcase
          password_confirmation: passwordConfirmation,
          token,
        })

        history.push('/')
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error)

          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Reset password error',
          description:
            'There was an error while trying to reset your password, please try again',
        })
      }
    },
    [addToast, history, location],
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Reset Password</h1>

            <Input
              name="password"
              type="password"
              placeholder="New password"
              icon={FiLock}
            />

            <Input
              name="passwordConfirmation"
              type="password"
              placeholder="Password confirmation"
              icon={FiLock}
            />

            <Button type="submit">Change password</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default ResetPassword
