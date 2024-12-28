import React from 'react'
import { motion } from 'framer-motion'
import joinATeam from '../../assets/images/join_a_team.svg'
import findATeammate from '../../assets/images/find_a_teammate.svg'
import './TeamFinder.css'

const TeamFinder = ({ setModal }) => {
  return (
    <div className="finder-con">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} className="finder-box" onClick={()=>setModal(true)}>
          <img src={findATeammate} alt="Find a teammate" />
          <p><span className='find'>Find</span><br /> A teammate</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} className="finder-box">
          <img src={joinATeam} alt="Join a team" />
          <p><span className='find'>Join</span><br /> A team</p>
        </motion.div>
      </div>
  )
}

export default TeamFinder