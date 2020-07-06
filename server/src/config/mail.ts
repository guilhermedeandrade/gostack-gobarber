interface IMailConfig {
  driver: 'ethereal' | 'ses'

  defaults: {
    from: {
      email: string
      name: string
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER ?? 'ethereal',

  defaults: {
    from: {
      email: 'hi@guilherme.codes',
      name: 'Guilherme de Andrade',
    },
  },
} as IMailConfig
