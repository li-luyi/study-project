import React, { useState, forwardRef, useRef,useEffect } from 'react';
import {Popup,Keyboard,Input,Toast} from 'zarm';
import dayjs from 'dayjs';
import cx from 'classnames';

import s from './style.module.less';
import {get,typeMap,post} from '@/utils';

import NormalIcon from '@/components/NormalIcon';
import PopupDate from '@/components/PopupDate';
import CustomIcon from '@/components/CustomIcon';

const PopupAddBill = forwardRef(({ detail = {} ,onReload}, ref) => { 
  const [show, setShow] = useState(false)//展示隐藏弹窗
  const [payType, setPayType] = useState(1) //账单类型 1：支出，2：收入
  const [date, setDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'))//日期
  const dateRef = useRef()
  const [amount, setAmount] = useState('')//账单金额
  const [type, setType] = useState({}) //当前的类型
  const [expense, setExpense] = useState([])//支出类型标签
  const [income, setIncome] = useState([])//收入类型标签
  const [showRemark, setShowRemark] = useState(false)//备注输入框展示控制
  const [remark, setRemark] = useState('')//备注

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
        setDetil()
      },
      hide: () => {
        resetForm()
      }
    }
  }

  // 设置详情数据
  const setDetil = () => { 
    if (detail && detail.id) {
      const { pay_type, type_id, type_name, date, amount, remark } = detail
      setAmount(amount)
      setPayType(pay_type)
      setDate(dayjs(date).format('YYYY-MM-DD'))
      setRemark(remark)
      setType({
        id: type_id,
        name:type_name
      })
    }
  }

  // 获取类型接口
  const getTypeList = async() => { 
    const { data } = await get('/type/list')
    const _expense = data.filter(item=>item.type == '1')
    const _income = data.filter(item=>item.type == '2')
    setExpense(_expense)
    setIncome(_income)
    if (!detail?.id) {
      setType(_expense[0]) //默认选中类型是支出的第一项
    }
  }
  
  useEffect(() => { 
    getTypeList()
  },[])

  // 选中日期
  const selectDate = (date) => {
    setDate(date)
  }

  // 打开日期弹窗
  const toggleDate = () => {
    dateRef.current && dateRef.current.show()
  }

  // 监听金额输入框
  const handleMoney = (value) => {
    value = String(value)
    // 删除键
    if (value == 'delete') {
      let _amount = amount.slice(0, amount.length - 1)
      setAmount(_amount)
      return
    }
    // 点击确认
    if (value == 'ok') {
      addOrEditBill()
      return
    }

    // 当输入的值为'.'且已经存在'.'，则不让继续字符串相加
    if (value == '.' && amount.includes('.')) return
    // 小数点后保留两位，当超过两位时，不让其字符串相加
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
    setAmount(amount+value)
  }

  // 添加订单
  const addOrEditBill = async() => {
    if (!amount) {
      return Toast.show('请输入账单金额')
    }
    const params = {
      amount,
      type_id: type.id,
      type_name: type.name,
      date,
      pay_type: payType,
      remark
    }
    const res = await (detail && detail.id) ?post('/bill/update', {id:detail.id,...params}) : post('/bill/add', params)
    Toast.show('操作成功')
    // 重置数据
    resetForm()
    if(onReload) onReload()
  }

  // 重置数据
  const resetForm = () => {
    setAmount('')
    setPayType(1)
    setType(expense[0])
    setDate(dayjs(new Date()).format('YYYY-MM-DD'))
    setShow(false)
    
  }

  // 选择类型
  const choseType = item => {
    setType(item)
  }

  return <Popup
    visible={show}
    direction='bottom'
    onMaskClick={resetForm}
    destroy={false}
    mountContainer={ ()=>document.body}
  >
    <div className={s.addWrap}>
      <header className={s.header}>
        <span className={ s.close } onClick={resetForm}><NormalIcon type="icon-close"/></span>
      </header>
      <div className={s.filter}>
        <div className={s.type}>
          <span onClick={ ()=>setPayType(1)} className={cx({[s.expense]:true,[s.active]:payType === 1}) }>支出</span>
          <span onClick={ ()=>setPayType(2)} className={cx({[s.income]:true,[s.active]:payType === 2}) }>收入</span>
        </div>
        <div className={s.time} onClick={toggleDate}>
          { dayjs(date).format('YYYY-MM') }<NormalIcon className={ s.arrow} type="icon-down"/>
        </div>
      </div>
      <div className={s.money}>
        <span className={s.sufix}>￥</span>
        <span className={cx(s.amount, s.animation)}>{ amount}</span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.typeBody}>
          {
            (payType === 1 ? expense : income).map(item => <div className={s.typeItem} onClick={() => choseType(item)} key={ item.id}>
              <span className={cx({ [s.iconfontWrap]: true, [s.expense]: payType === 1, [s.income]: payType === 2, [s.active]: item.id === type.id })}>
                <CustomIcon type={ typeMap[item.id].icon} />
              </span>
              <span>{ item.name}</span>
            </div>)
          }
        </div>
      </div>
      <div className={s.remark}>
        {showRemark ? <Input
          placeholder='请输入备注信息'
          autoHeight
          showLength
          maxLength={50}
          type='text'
          rows={3}
          value={remark}
          onChange={value => setRemark(value)}
          onBlur={()=>setShowRemark(false)}
        /> : <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>}
      </div>
      <Keyboard type="price" onKeyClick={value=>handleMoney(value)}/>
    </div>
    <PopupDate ref={dateRef} onSelect={ selectDate} />
  </Popup>
})

export default PopupAddBill
