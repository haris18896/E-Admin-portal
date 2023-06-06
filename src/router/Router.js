// ** Router imports
import { useRoutes, Navigate } from 'react-router-dom'

// ** GetRoutes
import { getRoutes } from './routes'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

// ** utils
import { getUserData, getHomeRouteForLoggedInUser } from '../utility/Utils'

const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)

  const getHomeRoute = () => {
    const user = getUserData()
    if (user?.is_staff) {
      return getHomeRouteForLoggedInUser(user?.is_staff)
    } else {
      return '/login'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    ...allRoutes
  ])

  return routes
}

export default Router
