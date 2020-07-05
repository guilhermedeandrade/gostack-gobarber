import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Dashboard } from '../pages';

const App = createStackNavigator();

const screenOptions = {
  /* headerShown: false, */
  cardStyle: { backgroundColor: '#312e38' },
};

const AuthRoutes: React.FC = () => (
  <App.Navigator screenOptions={screenOptions}>
    <App.Screen name="Dashboard" component={Dashboard} />
  </App.Navigator>
);

export default AuthRoutes;
