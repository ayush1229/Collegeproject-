import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Outpasses from './outpasses.jsx'
import App from './App.jsx'



const router = createBrowserRouter([
  // App routes
  { path: '/',          element: <Outpasses />       },
 
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
