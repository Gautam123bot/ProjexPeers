import React, { useEffect } from 'react'
import "./teamFinderCard.css";
// import Skills from "./finder_skill"
import years from './finder_year';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Backdrop } from '../Backdrop/Backdrop'
import { PostFeed } from '../../service/Api';
import { Chips } from '../Chips/Chips';

export const TeamFinderCard = ({ setModal }) => {
  const user = JSON.parse(localStorage.getItem("user_info"));
  const [selectedYear, setSelectedYear] = useState("");

  const [details, setDetails] = useState({
    name: user.fullname,
    username: user.username,
    title: "",
    email: "",
    skills: [],
    year: "",
    date: new Date()
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submission = await PostFeed(details);
    console.log(submission);

    if (submission.data.success === true) {
      setModal(false);
    } else {
      alert("Error");
    }
  }

  // const addSkills = (item) => {
  //   setDetails({ ...details, skills: [...details.skills, item] });
  // }
  function addSkill(e) {
    if (e.key === "Enter") {
      if (details.skills.indexOf(e.target.value) === -1) {
        setDetails({ ...details, skills: [...details.skills, e.target.value] });
        e.target.value = "";
      }
    }
  }

  const deleteSkill = (idx) => {
    console.log("Deleted Skill");
    //delete index idx from skills
    const newSkills = details.skills.filter((skill) => skill !== idx);
    setDetails({ ...details, skills: newSkills });
  };

  useEffect(() => {
    console.log(details);
  }, [details]);


  return (
    <Backdrop onClick={() => setModal(false)}>
      <motion.div onClick={(e) => { e.stopPropagation() }}>
        <div>
          <div className='card-body'>
            <h1>Find a teammate</h1>
            <form action="">
              {/* <div className="cn">
                <h4>Name<span style={{ color: "red" }}>*</span></h4>
                <input name="name" placeholder='Enter your name' type="text" value={details.name} onChange={handleChange} />
              </div> */}
              <div className="ct">
                <h4>Title<span style={{ color: "red" }}>*</span></h4>
                <input name="title" placeholder='Enter your title' type="text" value={details.title} onChange={handleChange} />
              </div>
              <div className="ce">
                <h4>Email<span style={{ color: "red" }}>*</span></h4>
                <input name="email" placeholder='Enter your email' type="email" value={details.email} onChange={handleChange} />
              </div>
              <div className="cs">
                <div className="cs-sub">
                  <h4>Skills<span style={{ color: "red" }}>*</span></h4>
                  <input name="skill" placeholder='Enter the skill you are looking for' type="text" onKeyDown={(e) => { addSkill(e); }} />
                </div>

                <div className="skill-bod">
                  {details.skills.map((item, idx) => {
                    return (
                      <div onClick={() => deleteSkill(item)} key={idx}>
                        <Chips name={item} />
                      </div>
                    )
                  })}
                </div>

              </div>
              <div className="cs">
                <h4>Year of Education <span style={{ color: "gray" }}>(Optional)</span></h4>
                <div className="skill-bod">
                  {years.map((item, idx) => {
                    return (
                      <div className='skill-box' id={selectedYear === item.name ? "year-selected" : ""} key={idx} onClick={() => { setDetails({ ...details, year: item.name }); setSelectedYear(item.name) }}>
                        <b>{item.name}</b>
                      </div>
                    )
                  })}
                </div>

              </div>


            </form>
            <div className='sbd'>
              <div type="submit" id='sb' onClick={handleSubmit}>Submit</div>
            </div>

          </div>
        </div>
      </motion.div>
    </Backdrop>

  )
}