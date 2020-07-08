import React from 'react'
import {
  Route as ReactRouterDOMRoute,
  RouteProps as ReactRouterDOMRouteProps,
  Redirect,
} from 'react-router-dom'

import { useAuth } from '../hooks/auth'

interface RouteProps extends ReactRouterDOMRouteProps {
  isPrivate?: boolean
  component: React.ComponentType
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth()

  return (
    <ReactRouterDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === Boolean(user) ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        )
      }}
    />
  )
}

export default Route
