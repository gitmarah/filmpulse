// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/*' element={<App />}/>
        </Routes>
      </Router>
    </Provider>,
)
