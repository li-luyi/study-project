import React, { useState,useCallback} from 'react';
import s from './style.module.less';
import cx from 'classnames';

import { Cell, Input, Button, Checkbox,Toast } from 'zarm';
import CustomIcon from '@/components/CustomIcon';
// 随机验证码插件
import Captcha from 'react-captcha-code';
import { post } from '@/utils';

import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigateTo = useNavigate()

  const [username,setUsername] = useState('') //账号
  const [password,setPassword] = useState('') //密码
  const [verify, setVerify] = useState('') //验证码
  const [captcha, setCaptcha] = useState('') //验证码变化后储存值
  const [agree,setAgree] = useState(false) //同意条款

  const [type,setType] = useState('login') //切换登录注册类型
  
  const handleChange = useCallback((captcha) => {
    setCaptcha(captcha)
  }, [])
  
  const onSubmit = async() => {
    if (!username) {
      return Toast.show('请输入账号')
    }
    if (!password) {
      return Toast.show('请输入密码')
    }
    try {
      if (type === 'login') {
        const { data } = await post('/user/login', { username, password })
        Toast.show('登录成功')
        // 储蓄返回的token
        localStorage.setItem('token', data.token)
        // 登录成功跳转到首页
        window.location.href='/'
      } else {
        if (!verify) {
          return Toast.show('请输入验证码')
        }
        if (verify !== captcha) {
          return Toast.show('验证码错误')
        }
        if (!agree) {
          return Toast.show('请勾选同意条款')
        }
        const { data } = await post('/user/register', { username, password })
        Toast.show('注册成功')
        // 跳到登录页面
        setType('login')
      }
    } catch (error) {
      Toast.show('系统错误')
    }
  }

  return <div className={s.auth}>
    <div className={s.head} />
    <div className={s.tab}>
      <span className={cx({[s.avtive]:type === 'login'}) } onClick={()=>setType('login')}>登录</span>
      <span className={cx({[s.avtive]:type === 'register'}) } onClick={()=>setType('register')}>注册</span>
    </div>
    <div className={s.form}>
      <Cell icon={<CustomIcon type="zhanghao" />}>
        <Input clearable type="text" placeholder='请输入账号' onChange={value=>setUsername(value)}/>
      </Cell>
      <Cell icon={<CustomIcon type="mima" />}>
        <Input clearable type="password" placeholder='请输入密码' onChange={value=>setPassword(value)}/>
      </Cell>
      {
        type === 'register' ? <Cell icon={<CustomIcon type="mima" />}>
        <Input clearable type="text" placeholder='请输入验证码' onChange={value=>setVerify(value)}/>
        <Captcha charNum={4} onChange={handleChange}/>
      </Cell> : null
      }
    </div>
    <div className={s.operation}>
      {
        type === 'register' ? <div className={s.agree}>
        <Checkbox id="agreement"  onChange={e => setAgree(e.target.checked)}/>
          <label className="text-light" htmlFor="agreement">阅读并同意<a>《掘掘手札条款》</a></label>
      </div> : null
      }
      <Button block theme='primary' onClick={onSubmit}>{ type === 'login' ? '登录' : '注册'}</Button>
    </div>
  </div>
}

export default Login