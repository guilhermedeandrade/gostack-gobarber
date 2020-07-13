import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { isToday, format, parseISO, isAfter } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { FiPower, FiClock } from 'react-icons/fi'
import DayPicker, { DayModifiers } from 'react-day-picker'
import { Link } from 'react-router-dom'
import 'react-day-picker/lib/style.css'

import { useAuth } from '../../hooks/auth'
import api from '../../services/api'

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles'

import logoImg from '../../assets/logo.svg'

interface MonthAvailabilityItem {
  day: number
  available: boolean
}

interface Appointment {
  id: string
  date: string
  formattedHour: string
  user: {
    name: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([])

  const [appointments, setAppointments] = useState<Appointment[]>([])

  const { signOut, user } = useAuth()

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day)
    }
  }, [])

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data)
      })
  }, [currentMonth, user.id])

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const appointments = response.data.map(appointment => ({
          ...appointment,
          formattedHour: format(parseISO(appointment.date), 'HH:mm'),
        }))

        setAppointments(appointments)
      })
  }, [selectedDate])

  const disabledDays = useMemo(
    () =>
      monthAvailability.reduce((acc, { available, day }) => {
        if (available) {
          return acc
        }

        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()

        const date = new Date(year, month, day)

        return [...acc, date]
      }, [] as Date[]),
    [currentMonth, monthAvailability],
  )

  const selectedDateAsText = useMemo(
    () => format(selectedDate, 'dd MMMM', { locale: enUS }),
    [selectedDate],
  )

  const selectedWeekday = useMemo(
    () => format(selectedDate, 'cccc', { locale: enUS }),
    [selectedDate],
  )

  const morningAppointments = useMemo(
    () =>
      appointments.filter(
        appointment => parseISO(appointment.date).getHours() < 12,
      ),
    [appointments],
  )

  const afternoonAppointments = useMemo(
    () =>
      appointments.filter(
        appointment => parseISO(appointment.date).getHours() >= 12,
      ),
    [appointments],
  )

  const nextAppointment = useMemo(
    () =>
      appointments.find(appointment =>
        isAfter(parseISO(appointment.date), new Date()),
      ),
    [appointments],
  )

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber logo" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Welcome,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Scheduled appointments</h1>
          <p>
            {isToday(selectedDate) && <span>Today</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekday}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Next appointment</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Morning</strong>

            {morningAppointments.length === 0 && (
              <p>There aren&apos;t appointments scheduled</p>
            )}

            {morningAppointments.map(({ id, formattedHour, user }) => (
              <Appointment key={`morning-appointment-${id}`}>
                <span>
                  <FiClock />
                  {formattedHour}
                </span>

                <div>
                  <img src={user.avatar_url} alt={user.name} />

                  <strong>{user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Afternoon</strong>

            {afternoonAppointments.length === 0 && (
              <p>There aren&apos;t appointments scheduled</p>
            )}

            {afternoonAppointments.map(({ id, formattedHour, user }) => (
              <Appointment key={`afternoon-appointment-${id}`}>
                <span>
                  <FiClock />
                  {formattedHour}
                </span>

                <div>
                  <img src={user.avatar_url} alt={user.name} />

                  <strong>{user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
            weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
          />
        </Calendar>
      </Content>
    </Container>
  )
}

export default Dashboard
