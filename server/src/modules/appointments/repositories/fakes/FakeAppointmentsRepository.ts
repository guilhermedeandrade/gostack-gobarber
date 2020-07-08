import { uuid } from 'uuidv4'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthProviderDTO'
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayProviderDTO'

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    )

    return findAppointment
  }

  public async create({
    user_id,
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()

    Object.assign(appointment, { id: uuid(), user_id, provider_id, date })

    this.appointments.push(appointment)

    return appointment
  }

  public async findAllInMonthFromProvider({
    provider_id,
    year,
    month,
  }: IFindAllInMonthProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    )

    return appointments
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    year,
    month,
  }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    )

    return appointments
  }
}

export default AppointmentsRepository
