import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Registration from './components/Registration'
import Statistics from './components/Statistics'
import MessagesList from './components/MessagesList'
import Registration2 from './components/Registration2'
import Image from './components/Image'
import Topics from './components/Topics'
import Blogers from './components/Blogers'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='container'>
      <div className="header">
      <div className="left-desktop-header">
      <Header />
      <Registration />
      </div>
      <div className="right-desktop-header">
      <Image />
      </div>
      </div>
      
      <Statistics />
      <MessagesList />
      <Registration2 />
      
    </div>
  )
}

export default App