import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp')

export default {
  directory: path.resolve(__dirname, '..', '..', 'tmp'),
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (_req, file, cb) => {
      const fileHash = crypto.randomBytes(10).toString('HEX')
      const fileName = `${fileHash}-${file.originalname}`

      return cb(null, fileName)
    },
  }),
}
