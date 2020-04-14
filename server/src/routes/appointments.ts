import { Router } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import { AppointmentsRepository } from '../repositories'
import { CreateAppointmentService } from '../services'
import { ensureAuthenticated } from '../middlewares'

const appointmentsRouter = Router()

appointmentsRouter.use(ensureAuthenticated)

appointmentsRouter.get('/', async (_req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const appointments = await appointmentsRepository.find()

  return res.json(appointments)
})

appointmentsRouter.post('/', async (req, res) => {
  try {
    const { provider_id, date } = req.body

    const parsedDate = parseISO(date)

    const createAppointment = new CreateAppointmentService()

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
    })

    return res.json(appointment)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

export default appointmentsRouter
