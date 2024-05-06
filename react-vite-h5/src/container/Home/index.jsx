import React, { useEffect, useState,useRef} from 'react';
import { Pull } from 'zarm';
import dayjs from 'dayjs';

import s from './style.module.less';

import BillItem from '@/components/BillItem';
import PopupType from '@/components/PopupType';
import NormalIcon from '@/components/NormalIcon';
import Empty from '@/components/Empty';
import PopupDate from '@/components/PopupDate';
import CustomIcon from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill';

import {get,REFRESH_STATE,LOAD_STATE} from '@/utils';

const Home = () => {
  const dateRef = useRef()//日期ref
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM')) // 当前筛选时间
  const [page,setPage] = useState(1) //分页
  const [list, setList] = useState([]) //列表
  const [totalPage, setTotalPage] = useState(0)//分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal) //下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal)//上拉加载状态
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const typeRef = useRef()//账单类型ref
  const [currentSelect, setCurrentSelect] = useState({ id: 'all' }) //当前筛选选中的类型
  const addRef = useRef() //新增账单ref
  
  // 初始化
  useEffect(() => { 
    getBillList()
  },[page,currentSelect,currentTime])

  // 获取账单列表
  const getBillList = async () => {
    const { data } = await get(`/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${currentSelect.id}`)

    // 下拉刷新，重置数据
    if (page === 1) {
      setList(data.list)
    } else {
      setList(list.concat(data.list))
    }
    setTotalPage(data.totalPage)
    setTotalExpense(data.totalExpense)
    setTotalIncome(data.totalIncome)
    // 上滑加载状态
    setLoading(LOAD_STATE.success)
    setRefreshing(REFRESH_STATE.success)
  }

  // 下拉刷新数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading)
    if (page!==1) {
      setPage(1)
    } else {
      getBillList()
    }
  }

  // 上拉加载数据
  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setPage(page+1)
    }
  }

  // 筛选类型
  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading)
    setPage(1)
    setCurrentSelect(item)
  }

  // 打开类型弹窗
  const toggle = () => {
    typeRef.current && typeRef.current.show()
  }

  // 筛选日期
  const selectDate = (date) => {
    setRefreshing(REFRESH_STATE.loading)
    setPage(1)
    setCurrentTime(date)
  }

  // 打开日期弹窗
  const toggleDate = () => {
    dateRef.current && dateRef.current.show()
  }

  // 打开添加账单弹窗
  const addToggle = () => {
    addRef.current && addRef.current.show()
  }

  return <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>总支出:<b>￥{ totalExpense }</b></span>
        <span className={s.income}>总收入:<b>￥{ totalIncome }</b></span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.left} onClick={toggle}>
          <span className={s.title}>{ currentSelect.name || '全部类型'}<NormalIcon className={ s.arrow} type="icon-down"/></span>
        </div>
        <div className={s.right} onClick={toggleDate}>
          <span className={s.time}>{ currentTime }<NormalIcon className={ s.arrow} type="icon-down"/></span>
        </div>
      </div>
    </div>
    <div className={s.contentWrap}>
      {
        list.length ? <Pull
          animationDuration={200}
          refresh={{
            state: refreshing,
            handler: refreshData
          }}
          load={{
            state: loading,
            distance: 200,
            handler: loadData
          }}
        >
          {
            list.map((item, index) => <BillItem bill={item} key={ index } />)
          }
        </Pull> : <Empty />
      }
    </div>
    <PopupType ref={typeRef} onSelect={ select }></PopupType>
    <PopupDate ref={dateRef} mode={'month'} onSelect={selectDate}></PopupDate>
    <div className={s.add} onClick={addToggle}><CustomIcon type="tianjia" /></div>
    <PopupAddBill ref={addRef} onReload={ refreshData }></PopupAddBill>
  </div>
}

export default Home