import React from 'react';
import { Cell, Input, Toast, Button } from 'zarm';
import { createForm } from 'rc-form';
import {useNavigate} from 'react-router-dom';

import Header from '@/components/Header';
import {post} from '@/utils';

import s from './style.module.less';

const Account = (props) => {
  const { getFieldProps, getFieldError } = props.form
  const navigateTo = useNavigate()
  
  // 提交
  const submit = () => { 
    props.form.validateFields(async (error, value) => {
      if (!error) {
        if (value.newPass != value.againPass) {
          return Toast.show('新密码输入不一致')
        }
        await post('/user/modify_pass', {
          old_pass: value.oldPass,
          new_pass: value.newPass,
          again_pass:value.againPass
        })
        Toast.show('修改成功')
        navigateTo(-1)
      } else {
        Toast.show('请完善密码')
      }
    })
  }

  return <>
    <Header title="重置密码"/>
    <div className={s.account}>
      <div className={s.form}>
        <Cell title="原密码">
          <Input placeholder='请输入原密码' clearable type='password'
            {...getFieldProps('oldPass', { rules: [{required:true}] })}
          />
        </Cell>
        <Cell title="新密码">
          <Input placeholder='请输入新密码' clearable type='password'
            {...getFieldProps('newPass', { rules: [{required:true}] })}
          />
        </Cell>
        <Cell title="确认密码">
          <Input placeholder='请输入确认密码' clearable type='password'
            {...getFieldProps('againPass', { rules: [{required:true}] })}
          />
        </Cell>
      </div>
      <Button onClick={submit} className={s.btn} block theme='primary'>提交</Button>
    </div>
  </>
}

export default createForm()(Account);