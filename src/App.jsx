import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Registration from './components/Registration'
import Statistics from './components/Statistics'
import MessagesList from './components/MessagesList'
import Registration2 from './components/Registration2'
import RegModal from './components/RegModal'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='container'>
      <Header />
      <Registration />
      <Statistics />
      <MessagesList />
      <Registration2 />
      
    </div>
  )
}

export default App