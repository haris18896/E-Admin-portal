/* eslint-disable no-unused-vars */
// ** React Imports
import { Fragment, lazy } from 'react'
import { Navigate } from 'react-router-dom'
// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'
import LayoutWrapper from '@src/@core/layouts/components/layout-wrapper'

// ** Route Components
import PublicRoute from '@components/routes/PublicRoute'
import PrivateRoute from '@components/routes/PrivateRoute'

// ** Utils
import { isObjEmpty } from '@utils'

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/calendar'

const Login = lazy(() => import('../../views/Login'))
const Register = lazy(() => import('../../views/Register'))
const ForgotPassword = lazy(() => import('../../views/ForgotPassword'))
const Error = lazy(() => import('../../views/Error'))
// pages
const Calendar = lazy(() => import('@src/views/calendar'))
const Providers = lazy(() => import('@src/views/providers'))
const AddProvider = lazy(() => import('@src/views/providers/add-provider'))
const EditProvider = lazy(() => import('@src/views/providers/edit-provider'))
const Bookings = lazy(() => import('@src/views/bookings'))
const Billing = lazy(() => import('@src/views/billing'))
const BillingInvoice = lazy(() =>
  import(
    '../../components/screen.components/billing/billling-invoice-table/BillingInvoiceTable'
  )
)

const Locations = lazy(() => import('@src/views/locations'))
const EtheraAccess = lazy(() => import('@src/views/ethera-access'))
const Community = lazy(() => import('@src/views/community'))
const System = lazy(() => import('@src/views/system'))
const CreateLocation = lazy(() =>
  import('@src/views/locations/create-location')
)

// ** Merge Routes
const Routes = [
  {
    path: '/',
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/login',
    element: <Login />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },

  {
    path: '/register',
    element: <Register />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },

  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },

  {
    path: '/*',
    element: <Error />,
    meta: {
      layout: 'blank',
      publicRoute: true
    }
  },

  {
    path: '/calendar',
    element: <Calendar />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/providers',
    element: <Providers />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/bookings',
    element: <Bookings />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/billing',
    element: <Billing />,
    meta: {
      publicRoute: false
    }
  },
  {
    path: '/billing/invoice/:id',
    element: <BillingInvoice />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/locations',
    element: <Locations />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/ethera-access',
    element: <EtheraAccess />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/community',
    element: <Community />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/system',
    element: <System />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/locations/create-location',
    element: <CreateLocation />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/locations/create-location/:id',
    element: <CreateLocation />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/providers/add-provider',
    element: <AddProvider />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/providers/edit-provider/:id',
    element: <EditProvider />,
    meta: {
      publicRoute: false
    }
  }
]

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        let RouteTag = PrivateRoute
        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === 'blank' ? (isBlank = true) : (isBlank = false)
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = (layout) => {
  const defaultLayout = layout || 'vertical'
  const layouts = ['vertical', 'horizontal', 'blank']

  const AllRoutes = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)
    AllRoutes.push({
      path: '/',
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
