import React from 'react'
import {motion} from 'framer-motion'
import './Cards.css'

const Cards = ({props}) => {
  return (
      <motion.div whileHover={{ scale: 1.05 }} className='card-con'>
          <h1 className='header'>{props.name}</h1>
          <p className='time'>Starts</p>
          <p className='time-txt'>{props.start}</p>
          <p className='time'>Ends</p>
          <p className='time-txt'>{props.end}</p>

          <p className='status'>{props.status}</p>
          <motion.div whileTap={{ scale: 0.9 }} onClick={() => window.open(props.link, "_blank")} className='participate-btn'>Participate</motion.div>
    </motion.div>
  )
}

export default Cards