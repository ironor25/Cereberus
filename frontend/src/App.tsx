import {Route,Routes} from 'react-router-dom'
import './App.css'
import Perps from './components/Perps'
import { useNavigate } from "react-router-dom";
import Swap from './components/Swap';
import GoogleAuth from './middlewares/FirebaseAuth';
import { useState } from 'react';
import Portfolio from './components/Portfolio';
import Coin from './components/Coin';




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
          <img src='./cerberus2.png' className='h-18 p-2'/>
          
        </div>
        <nav className='text-white p-6'>
          <a className='p-8 cursor-pointer text-white hover:text-lime-300 ' onClick={()=>{navigate("/")}}>Perpetuals</a>
          <a className='p-8 cursor-pointer text-white hover:text-lime-300  ' onClick={()=>{navigate("/swap")}}>Swap</a>
          <a className='p-8 cursor-pointer text-white hover:text-lime-300 ' onClick={()=>{navigate("/portfolio")}}>Portfolio</a>
          <a className='p-8 cursor-pointer text-white hover:text-lime-300 ' onClick={()=>{navigate("/coins")}}>Coins</a>
          
        </nav>
        <div className='p-3'>
          <GoogleAuth details={details} setdetails={setdetails} />
        </div>
      </div>

    
    <Routes>
       <Route path='/' element={<Perps />} />
       <Route path='/swap' element={<Swap />} />
       <Route path='/portfolio' element={<Portfolio />} />
       <Route path='/coins' element={<Coin />} />
     </Routes>
      </div>
  )
}

export default App
