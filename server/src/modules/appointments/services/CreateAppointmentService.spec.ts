import 'reflect-metadata'

import CreateAppointmentService from './CreateAppointmentService'
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'
import FakeNotificationsRepoitory from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeNotificationsRepository: FakeNotificationsRepoitory
let createAppointment: CreateAppointmentService

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeNotificationsRepository = new FakeNotificationsRepoitory()

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    )

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime())
  })

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      user_id: '9183719837',
      provider_id: '264762354276',
      date: new Date(2020, 4, 10, 13),
    })

    expect(appointment).toHaveProperty('id')
  })

  it('should not be able to create two appointments with the same date', async () => {
    const appointmentDate = new Date(2020, 4, 10, 13)

    await createAppointment.execute({
      user_id: '9183719837',
      provider_id: '264762354276',
      date: appointmentDate,
    })

    await expect(
      createAppointment.execute({
        user_id: '9183719837',
        provider_id: '264762354276',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on a paste date', async () => {
    await expect(
      createAppointment.execute({
        user_id: '9183719837',
        provider_id: '264762354276',
        date: new Date(2020, 4, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment with same user as provider', async () => {
    await expect(
      createAppointment.execute({
        user_id: 'xpto',
        provider_id: 'xpto',
        date: new Date(2020, 4, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment before 8am or after 5pm', async () => {
    expect.assertions(2)

    await expect(
      createAppointment.execute({
        user_id: '9183719837',
        provider_id: '264762354276',
        date: new Date(2020, 4, 10, 7),
      }),
    ).rejects.toBeInstanceOf(AppError)

    await expect(
      createAppointment.execute({
        user_id: '9183719837',
        provider_id: '264762354276',
        date: new Date(2020, 4, 10, 18),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
