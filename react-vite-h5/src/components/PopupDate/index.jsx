import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Popup, DatePicker } from 'zarm';
import dayjs from 'dayjs';

import s from './style.module.less';

const PopupDate = forwardRef(({ onSelect, mode = 'date' }, ref) => { 
  const [show, setShow] = useState(false)//展示隐藏弹窗
  const [now,setNow] = useState(new Date()) // 当前选中的日期

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      hide: () => {
        setShow(false)
      }
    }
  }

  const choseMonth = (item) => {
    setNow(item)
    setShow(false)
    if (mode === 'month') {
      onSelect(dayjs(item).format('YYYY-MM'))
    }else if (mode === 'date') {
      onSelect(dayjs(item).format('YYYY-MM-DD'))
    }
  }

  return <Popup
    visible={show}
    direction='bottom'
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={ ()=>document.body}
  >
    <div>
      <DatePicker
        visible={show}
        value={now}
        mode={mode}
        onOk={choseMonth}
        onCancel={ ()=>setShow(false)}
      />
    </div>

  </Popup>
})

PopupDate.propTypes = {
  mode: PropTypes.string, // 日期模式
  onSelect: PropTypes.func //选择后的回调
}

export default PopupDate
