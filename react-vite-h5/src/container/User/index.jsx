import React, { useState, useEffect } from 'react';
import { Cell,Button } from 'zarm';
import {useNavigate} from 'react-router-dom';

import { get } from '@/utils';

import s from './style.module.less';

const User = () => {
  const navigateTo=useNavigate()
  const [userInfo, setUserInfo] = useState({}) // 用户信息

  useEffect(() => { 
    getUserInfo()
  }, [])
  
  // 退出登录
  const logout = async() => {
    localStorage.removeItem('token')
    navigateTo('/login')
  }

  // 获取用户信息
  const getUserInfo = async() => {
    const {data} = await get('/user/get_userinfo')
    setUserInfo(data)
  }
  return <div className={s.user}>
    <div className={s.head}>
      <div className={s.info}>
        <span className={s.name}>昵称：{ userInfo.username || '-'}</span>
        <span>
          <img src="//s.yezgea02.com/1615973630132/geqian.png" style={{ width: 30, height: 30, verticalAlign: '-10px' }} />
          <b>{ userInfo.signature || '暂无个性签名'}</b>
        </span>
      </div>
      <img src={ userInfo.avatar} className={ s.avatar } style={{width:60,height:60,borderRadius:8,backgroundColor:'#fff'}} />
    </div>

    <div className={s.content}>
    <Cell
      hasArrow
      title="用户信息修改"
      onClick={() => navigateTo('/userinfo')}
      icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" />}
    />
    <Cell
      hasArrow
      title="重制密码"
      onClick={() => navigateTo('/account')}
      icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" />}
    />
    <Cell
      hasArrow
      title="关于我们"
      onClick={() => navigateTo('/about')}
      icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615975178434/lianxi.png" alt="" />}
    />
    </div>

    <Button className={s.logout} block theme="danger" onClick={logout}>退出登录</Button>
  </div>
}

export default User