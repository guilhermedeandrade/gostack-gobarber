import { startOfHour, isBefore, getHours, format } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

import AppError from '@shared/errors/AppError'

interface IRequest {
  user_id: string
  provider_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    user_id,
    provider_id,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You cannot create an appointment on a past date')
    }

    if (user_id === provider_id) {
      throw new AppError('You cannot create an appointment with yourself')
    }

    const appointmentHour = getHours(appointmentDate)

    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError(
        'You cannot create an appointment outside of the working hours',
      )
    }

    const findAppointmentDateConflict = await this.appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentDateConflict) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = await this.appointmentsRepository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    })

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'at' HH:mm")

    await this.notificationsRepository.create({
      content: `New appointment was created for ${formattedDate}`,
      recipient_id: provider_id,
    })

    return appointment
  }
}

export default CreateAppointmentService
