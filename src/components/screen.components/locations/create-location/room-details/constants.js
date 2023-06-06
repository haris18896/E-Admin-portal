import * as Yup from 'yup'

export const usersList = [
  {
    name: 'Jennifer Kim'
  },
  {
    name: 'Jenny Smith'
  },
  {
    name: 'Jenson Doe'
  },
  {
    name: 'Haris'
  },
  {
    name: 'Musa'
  },
  {
    name: 'Ali'
  },
  {
    name: 'Fahad'
  },
  {
    name: 'Mujahid'
  },
  {
    name: 'Aizaz'
  },
  {
    name: 'Hassan'
  }
]

export const roomDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Room Name should be at least one character long')
    .max(15, "Room Name shouldn't exceed more than 15 characters")
    .required('Room Name is required'),
  tiers_excluded: Yup.boolean(),
  comment: Yup.string()
    .min(3, 'Comment should be at least one character long')
    .max(100, "Comment shouldn't exceed more than 100 characters"),
  operating_hours: Yup.array().of(
    Yup.object().shape({
      day: Yup.string(),
      check: Yup.boolean(),
      startTime: Yup.date(),
      endTime: Yup.date()
    })
  ),
  closed_dates: Yup.array().of(
    Yup.object().shape({
      date: Yup.date()
    })
  ),
  room_authorization: Yup.array().of(
    Yup.object().shape({
      permission: Yup.string(),
      user: Yup.string(),
      room: Yup.string()
    })
  ),

  room_prices: Yup.array().of(
    Yup.object().shape({
      tier: Yup.string(),
      cost: Yup.string().required(),
      room: Yup.string()
    })
  )
})

export const roomsList = [
  {
    name: 'Room A',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '35.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '30.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '25.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '20.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '15.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Isaac Kim',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Fahad Ali',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Muhammad Munir',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Room B',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Room C',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '23.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '43.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '112.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '32.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '65.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Isaac Kim',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Fahad Ali',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Muhammad Munir',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Art Room',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Music Room',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Gym',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Library',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Computer Lab',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Science Lab',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Cafeteria',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Classroom',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Office',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Hall',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Auditorium',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  },
  {
    name: 'Other',
    excludeTier: false,
    tier: [
      {
        tier: 'Tier 1',
        from: '1',
        to: '10',
        cost: '15.00'
      },
      {
        tier: 'Tier 2',
        from: '11',
        to: '20',
        cost: '23.00'
      },
      {
        tier: 'Tier 3',
        from: '21',
        to: '30',
        cost: '55.00'
      },
      {
        tier: 'Tier 4',
        from: '31',

        to: '40',
        cost: '89.00'
      },
      {
        tier: 'Tier 5',
        from: '41',
        to: '50',
        cost: '32.00'
      }
    ],
    authorization: [
      {
        authorizedUsers: 'Haris Ahmad',
        restrictedUsers: 'John Doe'
      },
      {
        authorizedUsers: 'Musa Khan',
        restrictedUsers: ''
      },
      {
        authorizedUsers: 'Ogze torer',
        restrictedUsers: ''
      }
    ]
  }
]
