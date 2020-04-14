import { find } from 'remeda'
import { isEqual } from 'date-fns'
import { EntityRepository, Repository } from 'typeorm'

import { Appointment } from '../models'

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  private appointments: Appointment[]

  public async findByDate(date: Date): Promise<Appointment | null> {
    const findAppointment = await this.findOne({ where: { date } })

    return findAppointment ?? null
  }
}

export default AppointmentsRepository
