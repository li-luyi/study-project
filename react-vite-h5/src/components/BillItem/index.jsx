import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Cell } from 'zarm';
import { useNavigate } from 'react-router-dom';
import CustomIcon from '../CustomIcon';
import {typeMap} from '@/utils';

import s from './style.module.less';

const BillItem = ({ bill }) => {
  const [expense, setExpense] = useState(0)//支出
  const [income, setIncome] = useState(0)//收入

  useEffect(() => {
    const amountTotals = bill.bills.reduce((pre, cur) => {
      if (cur.pay_type === 1) {
        pre[0]+=Number(cur.amount)
      }
      if (cur.pay_type === 2) {
        pre[1]+=Number(cur.amount)
      }
      return pre
    }, [0, 0])
    setExpense(amountTotals[0])
    setIncome(amountTotals[1])
  },[])
  
  const navigateTo = useNavigate()

  const goToDetail = (item) => { 
    navigateTo(`/detail?id=${item.id}`)
  }
  
  return <div className={s.item}>
    <div className={s.headerDate}>
      <div className={s.date}>{bill.date}</div>
      <div className={s.money}>
      <span>
          <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt='支' />
            <span>¥{ expense.toFixed(2) }</span>
        </span>
        <span>
          <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
          <span>¥{ income.toFixed(2) }</span>
        </span>
      </div>
    </div>
    {
      bill && bill.bills.map(item => <Cell className={s.bill} key={item.id}
        onClick={() => goToDetail(item)}
        title={
          <>
            <CustomIcon type={item.type_id ? typeMap[item.type_id].icon : 1} className={s.itemIcon}></CustomIcon>
            <span>{item.type_name}</span>
          </>
        }
        description={<span style={{ color: item.pay_type === 2 ? 'red' : '#39be77' }}>{`${item.pay_type === 1 ? '-' : '+'}${item.amount}`}</span>}
        help={<div>{dayjs(item.dete).format('HH:mm')}{item.remark ? <><span>|</span>{ item.remark}</> : ''}</div> }
      ></Cell>)
    }
  </div>
}

BillItem.propTypes = {
  bill:PropTypes.object
}

export default BillItem