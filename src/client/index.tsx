import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createSagaMiddleware from 'redux-saga'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import { App } from './containers/App'
// import rootSaga from '@/sagas'
// import rootReducer from '@/slices'
import history from './utils/history'

// import '@/styles/index.scss'

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
  reducer: ()=>{},
  middleware: [sagaMiddleware, ...getDefaultMiddleware({ thunk: false })],
  devTools: process.env.NODE_ENV !== 'production',
})

// sagaMiddleware.run(rootSaga)
const navigator = function () {
  return history; 
}

const container = document.getElementById('root')
if(container === null) throw new Error('root element not found') 
else {
  const root = ReactDOM.createRoot(container);

  root.render(
    <Provider store = {store}>
      <Router location = "/" navigator= {navigator}> 
        <App />
      </Router>
    </Provider>
  )
}
