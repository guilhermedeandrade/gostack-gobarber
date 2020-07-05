import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { SignIn, SignUp } from '../pages'

const Auth = createStackNavigator()

const screenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#312e38' },
}

const AuthRoutes: React.FC = () => (
  <Auth.Navigator screenOptions={screenOptions}>
    <Auth.Screen name="SignIn" component={SignIn} />
    <Auth.Screen name="SignUp" component={SignUp} />
  </Auth.Navigator>
)

export default AuthRoutes
