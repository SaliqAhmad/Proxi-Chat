import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignUp } from './pages/SignUp.tsx'
import { SignIn } from './pages/SignIn.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Chat } from './pages/Chat.tsx'
import { Groupchat } from './pages/Groupchat.tsx'
import { MyChats } from './pages/MyChats.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignUp />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/groupchat',
    element: <Groupchat />,
  },
  {
    path: '/mychats',
    element: <MyChats />,
  }
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);