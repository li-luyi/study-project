import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'zarm';
import cx from 'classnames';
import { get } from '@/utils';
import NormalIcon from '@/components/NormalIcon';

import s from './style.module.less';

// forwardRef用于拿到父组件传入的ref属性，这样就可以在父组件通过ref控制子组件
const PopupType = forwardRef(({ onSelect},ref) => { 
  const [show, setShow] = useState(false) //显示隐藏组件
  const [active, setActive] = useState('all')//当前选中类型
  const [expense, setExpense] = useState([])//支出类型标签
  const [income, setIncome] = useState([])//收入类型标签
  
  // 获取类型接口
  const getTypeList = async() => { 
    const { data } = await get('/type/list')
    setExpense(data.filter(item=>item.type == '1'))
    setIncome(data.filter(item=>item.type == '2'))
  }

  useEffect(() => { 
    getTypeList()
  },[])
  
  if (ref) {
    ref.current = {
      show: () => { 
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  }

  // 选择类型
  const choseType = (item) => {
    setActive(item.id)
    setShow(false)
    onSelect(item)
  }

  return <Popup
    visible={show}
    direction='bottom'
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={ ()=> document.body}
  >
    <div className={s.PopupType}>
      <div className={s.header}>
        请选择类型
        <NormalIcon type="icon-close" className={s.cross} onClick={() => setShow(false)} />
      </div>
      <div className={s.content}>
        <div onClick={() => choseType({ id: 'all' })} className={cx({ [s.all]: true, [s.active]: active === 'all' })}>全部类型</div>
        <div className={ s.title }>支出</div>
        <div className={s.expenseWrap}>
          {
            expense.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({[s.active]:active === item.id})}>{ item.name}</p>)
          }
        </div>
        <div className={ s.title }>收入</div>
        <div className={s.incomeWrap}>
          {
            income.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({[s.active]:active === item.id})}>{ item.name}</p>)
          }
        </div>
      </div>
    </div>
  </Popup>
})

PopupType.propTypes = {
  onSelect:PropTypes.func
}

export default PopupType