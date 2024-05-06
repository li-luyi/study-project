import React from 'react';
import NormalIcon from '@/components/NormalIcon';
import PropTypes from 'prop-types';

import s from './style.module.less';

const Empty = ({ content = '暂无数据'}) => { 
  return <div className={ s.empty }>
    <NormalIcon type="icon-empty" className={ s.icon } />
    <p>{ content }</p>
  </div>
}

Empty.propTypes = {
  content:PropTypes.string
}

export default Empty