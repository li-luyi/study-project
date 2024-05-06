import React, { useState, useEffect,useRef } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import qs from 'query-string';
import cx from 'classnames';
import { get, typeMap,post } from '@/utils';
import dayjs from 'dayjs';
import {Modal,Toast} from 'zarm';

import Header from '@/components/Header';
import CustomIcon from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill';

import s from './style.module.less';

const Detail = () => {
  const navigateTo = useNavigate()
  const location = useLocation()
  const { id } = qs.parse(location.search)

  const [detail, setDetail] = useState({}) // 详情内容

  useEffect(() => {
    getDetail()
  },[])

  // 获取详情接口
  const getDetail = async () => {
    const { data } = await get(`/bill/detail?id=${id}`)
    setDetail(data)
  }

  // 删除
  const handleDelete = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单？',
      onOk: async ()=>{ 
        await post('/bill/delete', { id })
        Toast.show('删除成功')
        navigateTo(-1)
      }
    })
  }
  
  // 编辑
  const handleEdit = () => {
    editRef.current && editRef.current.show()
  }
  const editRef = useRef()

  return <div className={s.detail}>
    <Header title="账单详情" />
    <div className={s.card}>
      <div className={s.type}>
        <span className={cx({ [s.expense]: detail.pay_type === 1, [s.income]: detail.pay_type === 2 })}>
          <CustomIcon type={ typeMap[detail.type_id]?.icon} />
        </span>
        <span>{ detail.type_name || ''}</span>
      </div>
      {
        detail.pay_type === 1 ? 
          <div className={cx(s.amount, s.expense)}>-{ detail.amount}</div>
          : <div className={cx(s.amount, s.income)}>+{ detail.amount}</div>
      }
      <div className={s.info}>
        <div className={s.time}>
          <span>记录时间</span>
          <span>{ dayjs(detail.dete).format('YYYY-MM-DD HH:mm') }</span>
        </div>
        <div className={s.remark}>
          <span>备注</span>
          <span>{ detail.remark || '-'}</span>
        </div>
      </div>
      <div className={s.operation}>
        <span onClick={ handleDelete}><CustomIcon type="shanchu" />删除</span>
        <span onClick={ handleEdit} ><CustomIcon type="tianjia"/>编辑</span>
      </div>
    </div>
    <PopupAddBill ref={editRef} detail={detail} onReload={ getDetail} />
</div>
}

export default Detail