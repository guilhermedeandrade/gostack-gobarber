import { container } from 'tsyringe'
import mailConfig from '@config/mail'

import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider'
import IStorageProvider from './StorageProvider/models/IStorageProvider'

import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider'
import SESMailProvider from './MailProvider/implementations/SESMailProvider'
import IMailProvider from './MailProvider/models/IMailProvider'

import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider'

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
)

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
)

const MAIL_PROVIDERS = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
}

container.registerInstance<IMailProvider>(
  'MailProvider',
  MAIL_PROVIDERS[mailConfig.driver],
)
