import React, { useState,useEffect} from 'react';
// 引入路由
import { Routes, Route, useLocation } from 'react-router-dom';
import routes from '@/router';

// 引入ui库
import { ConfigProvider } from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
// import 'zarm/dist/zarm.css'

// 引入NavBar
import NavBar from '@/components/NavBar';

function App() {
  const location = useLocation()
  const { pathname } = location // 获取当前路径
  const needNav = ['/', '/data','/user'] //配置需要navbar的路径
  
  const [showNav, setShowNav] = useState(false) // 是否展示 Nav
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname]) // [] 内的参数若是变化，便会执行上述回调函数=
  return (
      <ConfigProvider primaryColor={'#007fff'} locale={zhCN}>
        <>
          <Routes>
            {routes.map(route => <Route exact key={route.path} path={route.path} element={<route.component />} />)}
          </Routes>
          <NavBar showNav={ showNav } />
        </>
      </ConfigProvider>
  )
}

export default App
