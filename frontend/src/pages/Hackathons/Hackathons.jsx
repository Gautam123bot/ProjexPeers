import React, { useState } from 'react'
import { useEffect } from 'react'
import Cards from '../../components/Cards/Cards'
import TeamFinder from '../../components/TeamFinder/TeamFinder'
import './Hackathons.css'
import hackathons from './hackathons_data'
import search_icon from '../../assets/icons/search.svg'

// Code contributed by Aditya Mondal

const Hackathons = () => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log(hackathons)
  }, []);

  return <div className='hackathon-con'>
    <h1>Hackathons</h1>
    <div className="hackathon-main">
      <TeamFinder />

      <div className="search-box">
        <img src={search_icon} alt="Search" />
        <input type="text" placeholder='Find Hackathons' className='search-inp' onChange={(e) => { setSearch(e.target.value) }} />
      </div>

      <div className="hackathons-list">
        {hackathons.filter(hackathon => hackathon.name.toLowerCase().includes(search.toLowerCase()))
          .map((hackathon, idx) => <Cards key={idx} props={hackathon} />)}
      </div>
    </div>
  </div>

}

export default Hackathons