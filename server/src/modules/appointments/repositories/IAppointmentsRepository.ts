import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthProviderDTO from '../dtos/IFindAllInMonthProviderDTO'
import IFindAllInDayProviderDTO from '../dtos/IFindAllInDayProviderDTO'

interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>
  findAllInMonthFromProvider(
    data: IFindAllInMonthProviderDTO,
  ): Promise<Appointment[]>
  findAllInDayFromProvider(
    data: IFindAllInDayProviderDTO,
  ): Promise<Appointment[]>
}

export default IAppointmentsRepository
