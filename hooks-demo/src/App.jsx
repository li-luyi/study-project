import { useEffect, useState,useCallback } from 'react';
import './App.css'

// eslint-disable-next-line react/prop-types
function Child({callback}) {
  useEffect(() => { 
    callback()
  }, [callback])
  return <div>子组件</div>
}

function App() {
  // eslint-disable-next-line no-unused-vars
  const [name,setName]=useState('')
  // eslint-disable-next-line no-unused-vars
  const [phone,setPhone]=useState('')
  // eslint-disable-next-line no-unused-vars
  const [kw, setKw] = useState('')
  
  const callback = useCallback(() => { 
    console.log('我是callback');
  },[])
  // const callback = () => {
  //   console.log('我是callback');
  // }

  // const data = {
  //   name,
  //   phone
  // }
  return (
    <div className='App'>
      <input type="text" placeholder='请输入姓名' onChange={ e=>setName(e.target.value)} />
      <input type="text" placeholder='请输入电话' onChange={ e=>setPhone(e.target.value)} />
      <input type="text" placeholder='请输入关键词' onChange={e => setKw(e.target.value)} />
      <Child callback={callback}></Child>
    </div>
  )
}

export default App
