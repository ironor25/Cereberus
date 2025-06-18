import {Route,Routes} from 'react-router-dom'
import './App.css'
import Perps from './components/Perps'
import { useNavigate } from "react-router-dom";
import Swap from './components/Swap';
import GoogleAuth from './middlewares/FirebaseAuth';
import { useState } from 'react';



function App() {
  const [details, setdetails] = useState({
    name: null,
    email: null,
    photoURL: null,
    UID: null,
  });
  const navigate = useNavigate()
  return (
       <div className='h-screen w-screen bg-black'>
      <div className='flex  justify-between border-2 border-white'>
        <div className='flex text-white'>
          <img src='./aurex.png' className='h-18'/>
          <span className='pt-6'>Aurex</span>
        </div>
        <nav className='text-white p-6'>
          <a className='p-8 cursor-pointer' onClick={()=>{navigate("/")}}>Swap</a>
          <a className='p-8 cursor-pointer' onClick={()=>{navigate("/perpetuals")}}>Perpetuals</a>
          <a className='p-8 cursor-pointer' >Coins</a>
          <a className='p-8 cursor-pointer'>Portfolio</a>
        </nav>
        <div className='p-3'>
          <GoogleAuth details={details} setdetails={setdetails} />
        </div>
      </div>

    
     <Routes>
        <Route path='/' element={<Swap />} />
        <Route path='/perpetuals' element={<Perps uid={details.UID ?? ""} />} />
      </Routes>
      </div>
  )
}

export default App
