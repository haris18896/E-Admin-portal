/* eslint-disable no-unused-vars */
import React, { Suspense } from 'react'
// ** Router Import
import Router from './router/Router'

const App = () => {

  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
