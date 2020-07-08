import { ValidationError } from 'yup'

interface Errors {
  [key: string]: string
}

export default function getValidationErrors(err: ValidationError): Errors {
  return err.inner.reduce(
    (acc, { path, message }) => ({
      ...acc,
      [path]: message,
    }),
    {} as Errors,
  )
}
