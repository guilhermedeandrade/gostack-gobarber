import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import {
  Dashboard,
  Profile,
  CreateAppointment,
  AppointmentCreated,
} from '../pages'

const App = createStackNavigator()

const screenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#312e38' },
}

const AppRoutes: React.FC = () => (
  <App.Navigator screenOptions={screenOptions}>
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="CreateAppointment" component={CreateAppointment} />
    <App.Screen name="AppointmentCreated" component={AppointmentCreated} />

    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
)

export default AppRoutes
