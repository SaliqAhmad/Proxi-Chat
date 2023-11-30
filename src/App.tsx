import { Route, Routes } from 'react-router-dom'
import './App.css'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
import { Chat } from './pages/Chat'
import { Groupchat } from './pages/Groupchat'
import { MyChats } from './pages/MyChats'

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/groupchat' element={<Groupchat />} />
        <Route path='/mychats' element={<MyChats />} />
      </Routes>
    </div>
  )
}

export default App
