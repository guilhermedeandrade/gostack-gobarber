import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import { Appointment } from '../models'
import { AppointmentsRepository } from '../repositories'
import { AppError } from '../errors'

interface Request {
  provider_id: string
  date: Date
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)

    const appointmentDate = startOfHour(date)

    const findAppointmentDateConflict = await appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentDateConflict) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    })

    await appointmentsRepository.save(appointment)

    return appointment
  }
}

export default CreateAppointmentService
