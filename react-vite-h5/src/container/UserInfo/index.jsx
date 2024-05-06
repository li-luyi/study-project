import React, { useState, useEffect } from 'react';
import { FilePicker, Button, Toast, Input } from 'zarm';
import {useNavigate} from 'react-router-dom';

import Header from '@/components/Header';
import {get,postFormData,imgUrlTrans,post} from '@/utils';

import s from './style.module.less';

const UserInfo = () => {
  const [user,setUser]=useState({}) //用户
  const [avatar, setAvatar] = useState('') //头像
  const [signature, setSignature] = useState('') // 个签
  
  const navigateTo = useNavigate()

  const handleSelect = async (file) => {
    if (file && file.file.size > 200*1024) {
      return Toast.show('上传头像不得超过 200 KB！')
    }
    let formData = new FormData()
    formData.append('file',file.file)
    const {data} = await postFormData('/upload', formData)
    setAvatar(imgUrlTrans(data))
  }

  useEffect(() => { 
    getUserInfo()
  }, [])
  
  // 获取用户信息
  const getUserInfo = async() => {
    const {data} = await get('/user/get_userinfo')
    setUser(data)
    setSignature(data.signature)
    setAvatar(imgUrlTrans(data.avatar))
  }

  // 保存
  const save = async () => {
    await post('/user/edit_userinfo', {
      signature,
      avatar
    })
    Toast.show('修改成功')
    navigateTo(-1)
  }

  return <div className={s.userInfo}>
    <Header title="用户信息" />
    <h1>个人资料</h1>
    <div className={s.item}>
      <div className={s.title}>头像</div>
      <div className={s.avatar}>
        <img src={avatar} alt="" className={s.avatarUrl} />
        <div className={s.desc}>
            <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
            <FilePicker className={s.filePicker} onChange={handleSelect} accept="image/*">
              <Button className={s.upload} theme='primary' size='xs'>点击上传</Button>
            </FilePicker>
          </div>
      </div>
    </div>
    <div className={s.item}>
        <div className={s.title}>个性签名</div>
        <div className={s.signature}>
          <Input
            clearable
            type="text"
            value={signature}
            placeholder="请输入个性签名"
            onChange={(value) => setSignature(value)}
          />
        </div>
      </div>
      <Button onClick={save} style={{ marginTop: 50 }} block theme='primary'>保存</Button>
  </div>
}

export default UserInfo