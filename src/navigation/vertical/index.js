import { Icon } from '@iconify/react'

export default [
  {
    id: 'Calendar',
    title: 'Calendar',
    icon: <Icon icon="akar-icons:calendar" />,
    navLink: '/calendar'
  },
  {
    id: 'Providers',
    title: 'Providers',
    icon: <Icon icon="la:user-check" width="20" height="20" />,
    navLink: '/providers'
  },
  {
    id: 'Bookings',
    title: 'Bookings',
    icon: <Icon icon="fa-regular:calendar-check" width="20" height="20" />,
    navLink: '/bookings'
  },
  {
    id: 'Billing',
    title: 'Billing',
    icon: <Icon icon="tabler:file-dollar" width="20" height="20" />,
    navLink: '/billing'
  },
  {
    id: 'Locations',
    title: 'Locations',
    icon: <Icon icon="ep:location" width="20" height="20" />,
    navLink: '/locations'
  },
  {
    id: 'Ethera Access',
    title: 'Ethera Access',
    icon: <Icon icon="majesticons:unlock-open-line" width="20" height="20" />,
    navLink: '/ethera-access'
  },
  // {
  //   id: 'Community',
  //   title: 'Community',
  //   icon: <Icon icon="ep:location" width="20" height="20" />,
  //   navLink: '/community'
  // },
  {
    id: 'System',
    title: 'System',
    icon: <Icon icon="ci:settings" width="20" height="20" />,
    navLink: '/system'
  }
]
