import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'
import AppError from '@shared/errors/AppError'

describe('CreateAppointmentService', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()

    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    )

    const appointment = await createAppointment.execute({
      provider_id: '264762354276',
      date: new Date(),
    })

    expect(appointment).toHaveProperty('id')
  })

  it('should not be able to create two appointments with the same date', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()

    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    )

    const appointmentDate = new Date(2020, 5, 25, 15)

    await createAppointment.execute({
      provider_id: '264762354276',
      date: appointmentDate,
    })

    expect(
      createAppointment.execute({
        provider_id: '264762354276',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
