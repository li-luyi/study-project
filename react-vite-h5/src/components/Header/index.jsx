import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {NavBar} from 'zarm';

import s from './style.module.less';

import NormalIcon from '@/components/NormalIcon';

const Header = ({ title='' }) => {
  const navigateTo = useNavigate()

  return <div className={s.headerWrap}>
    <div className={s.block}>
      <NavBar
        className={s.header}
        left={<NormalIcon type="icon-arrow-left" style={{color:'#4b67e2',fontSize: "20px"}} onClick={() => navigateTo(-1)} />}
        title={ title}
      />
    </div>
  </div>
}

Header.propTypes = {
  title: PropTypes.string
}

export default Header