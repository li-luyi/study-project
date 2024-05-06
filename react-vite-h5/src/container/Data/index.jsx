import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import cx from 'classnames';
import {Progress} from 'zarm';

import s from './style.module.less';
import {typeMap,get} from '@/utils';

import NormalIcon from '@/components/NormalIcon';
import PopupDate from '@/components/PopupDate';
import Empty from '@/components/Empty';
import CustomIcon from '@/components/CustomIcon';
import { data } from 'autoprefixer/lib/autoprefixer';

let proportionChar = null //用于存放echart初始化返回的实例

const Data = () => {
  const monthRef = useRef()
  const [date, setDate] = useState(dayjs().format('YYYY-MM'))
  const [totalType, setTotalType] = useState(1) // 收入支出类型
  const [totalExpense,setTotalExpense] = useState(0) //总支出
  const [totalIncome, setTotalIncome] = useState(0) //总收入
  const [currentData,setCurrentData] = useState([]) //根据当前收支类型存放数据
  const [expenseData,setExpenseData] = useState([]) //支出list
  const [incomeData, setIncomeData] = useState([]) //收入list
  const [showType, setShowType] = useState('list') //收支情况展示方式

  const selectMonth = (value) => {
    setDate(value)
  }

  useEffect(() => { 
    getData()
    return () => {
      proportionChar.dispose()//组件卸载时，销毁echarts实例
    }
  }, [date])
  useEffect(() => {
    if (showType === 'pie') {
      setPieChar(currentData)
    }
  },[currentData,showType])
  
  // 绘制饼图方法
  const setPieChar = (data) => {
    if (window.echarts) {
      // 初始化，返回实例
      proportionChar = echarts.init(document.getElementById('proportion'))
      proportionChar.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // 图例
        legend: {
            data: data.map(item => item.type_name)
        },
        series: [
          {
            name: '支出',
            type: 'pie',
            radius: '55%',
            data: data.map(item => {
              return {
                value: item.number,
                name: item.type_name
              }
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }

  // 获取统计数据
  const getData = async() => {
    const { data } = await get(`/bill/data?date=${date}`)
    setTotalExpense(data.total_expense)
    setTotalIncome(data.total_income)

    const expense_data = data.total_data.filter(item=>item.pay_type === 1).sort((a,b)=>b.number - a.number)
    const income_data = data.total_data.filter(item => item.pay_type === 2).sort((a, b) => b.number - a.number)
    
    setIncomeData(income_data)
    setExpenseData(expense_data)
    setCurrentData(totalType === 1 ? expense_data : income_data)
  }

  // 切换收支类型
  const changeType = value => {
    setTotalType(value)
    setCurrentData(value === 1 ? expenseData : incomeData)
  }
  return <div className={s.data}>
    <div className={s.total}>
      <div className={s.time} onClick={()=>monthRef.current && monthRef.current.show()}>
        <span>{ date }</span>
        <NormalIcon className={s.date} type="icon-date"/>
      </div>
      <div className={s.title}>共支出</div>
      <div className={s.expense}>￥{ totalExpense }</div>
      <div className={s.income}>共收入￥{ totalIncome }</div>
    </div>
    <div className={s.structure}>
      <div className={s.head}>
        <div className={s.showType}>
          <div className={s.title}>收支构成</div>
          <span onClick={()=>setShowType('list')}  className={cx({[s.active]: showType === 'list' })} >
            <NormalIcon type="icon-list"/>
          </span>
          <span  onClick={()=>setShowType('pie')} className={cx({[s.active]: showType === 'pie' })} >
            <NormalIcon type="icon-piechart_2"/>
          </span>
        </div>
        <div className={s.tab}>
          <span onClick={()=>changeType(1)} className={ cx({[s.expense]:true,[s.active]:totalType === 1}) }>支出</span>
          <span onClick={()=>changeType(2)} className={ cx({[s.income]:true,[s.active]:totalType === 2}) }>收入</span>
        </div>
      </div>
      <div className={s.content}>
        {showType === 'list' ? 
          (currentData.length > 0 ? currentData.map(item => <div key={item.type_id} className={s.item}>
            <div className={s.left}>
              <div className={s.type}>
                <span className={cx({ [s.expense]: totalType ===1, [s.income]: totalType ===2 })}>
                  <CustomIcon type={ typeMap[item.type_id].icon} />
                </span>
                <span className={s.name}>{ item.type_name}</span>
              </div>
              <div className={s.progress}>￥{ Number(item.number).toFixed(2) || 0}</div>
            </div>
            <div className={s.right}>
            <div className={s.percent}>
                <Progress
                  shape="line"
                  percent={Number((item.number / Number(totalType === 1 ? totalExpense : totalIncome)) * 100).toFixed(2)}
                  theme={ totalType === 1 ? 'primary' : 'warning'}
                />
              </div>
            </div>
          </div>) : <Empty/>) : 
          <div id="proportion"></div>
        }
        
      </div>
    </div>
    <PopupDate onSelect={selectMonth} mode="month" ref={ monthRef } />
  </div>
}

export default Data