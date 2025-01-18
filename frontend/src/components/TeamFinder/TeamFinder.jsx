import React from 'react'
import { motion } from 'framer-motion'
import joinATeam from '../../assets/images/join_a_team.png'
import findATeammate from '../../assets/images/find_a_teammate.png'
import './TeamFinder.css'
import { Link } from 'react-router-dom'

const TeamFinder = ({ setModal }) => {
  return (
    <div className="finder-con">
      <div className="finder-box">

      <Link to="/findateammate">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
          <img src={findATeammate} alt="Find a teammate" className='w-[80px]' />
          <p><span className='find'>Find</span><br /> A teammate</p>
          {/* Your content inside the finder-box */}
        </motion.div>
      </Link>
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} className="finder-box" onClick={() => setModal(true)}>
        <img src={joinATeam} alt="Join a team" />
        <p>create post to get team members</p>
      </motion.div>
    </div>
  )
}

export default TeamFinder