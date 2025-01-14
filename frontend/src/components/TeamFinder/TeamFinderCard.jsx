import React, { useEffect } from 'react'
import "./teamFinderCard.css";
// import Skills from "./finder_skill"
import years from './finder_year';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Backdrop } from '../Backdrop/Backdrop'
import { PostFeed } from '../../service/Api';
import { Chips } from '../Chips/Chips';
import { Country, State, City } from "country-state-city";
import Select from "react-select";

export const TeamFinderCard = ({ setModal }) => {
  const user = JSON.parse(localStorage.getItem("user_info"));
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [details, setDetails] = useState({
    name: user.fullname || "",
    username: user.username || "",
    title: "",
    email: "",
    skills: [],
    year: "",
    date: new Date(),
    city: "",
    state: "",
    country: "",
    competitionType: "",
    membersRequired: 0,
    lastDateOfRegistration: new Date(),
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value })
  }

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedCity(null);
    setDetails({ ...details, country: selectedOption ? selectedOption.name : "" });
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedCity(null);
    setDetails({ ...details, state: selectedOption ? selectedOption.name : "" });
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setDetails({ ...details, city: selectedOption ? selectedOption.name : "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submission = await PostFeed({
        ...details,
        country: details.country,
        state: details.state,
        city: details.city
      });

      console.log(submission);

      if (submission.data.success === true) {
        setModal(false);
      } else {
        alert("Error");
      }
    } catch (error) {
      console.error(error);
    }
  };


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

  // useEffect(() => {
  //   console.log(details);
  // }, [details]);

  useEffect(() => {
    console.log("Country:", details.country);
    console.log("State:", details.state);
    console.log("City:", details.city);
  }, [details]);  // This will run every time the details state changes.



  return (
    <Backdrop onClick={() => setModal(false)}>
      <motion.div onClick={(e) => { e.stopPropagation() }}>
        <div className="w-[800px] h-[90%] bg-[#EFF5FF] flex flex-col p-10 items-start justify-center font-product border-2 border-[#3364FF] rounded-[20px]">
          <h1 className="mb-5 self-center">Find a teammate</h1>
          <form action="">
            <div className="flex items-center justify-start gap-6 mb-5">
              <h4>Title of the Developer<span style={{ color: "red" }}>*</span></h4>
              <input className='px-3 py-2' name="title" placeholder='Enter your title' type="text" value={details.title} onChange={handleChange} />
            </div>
            <div className="flex items-center justify-start gap-4 mb-5">
              <h4>Your Email<span style={{ color: "red" }}>*</span></h4>
              <input className="px-3 py-2" name="email" placeholder="Enter your email" type="email" value={details.email} onChange={handleChange} />
            </div>
            <div className="mb-5 flex flex-col">
              <div className="flex items-center justify-start gap-4 mb-5">
                <h4>Skills Required<span style={{ color: "red" }}>*</span></h4>
                <input className="px-3 py-2" name="skill" placeholder="Enter the skill you are looking for" type="text" onKeyDown={(e) => { addSkill(e); }} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {details.skills.map((item, idx) => (
                  <div onClick={() => deleteSkill(item)} key={idx}>
                    <Chips name={item} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5 flex flex-col md:flex-row gap-4 w-full">
              {/* Country Dropdown */}
              <Select
                options={Country.getAllCountries()}
                getOptionLabel={(country) => country.name}
                getOptionValue={(country) => country.isoCode}
                value={selectedCountry}
                onChange={handleCountryChange}
              />
              <Select
                options={
                  selectedCountry
                    ? State.getStatesOfCountry(selectedCountry.isoCode)
                    : []
                }
                getOptionLabel={(state) => state.name}
                getOptionValue={(state) => state.isoCode}
                value={selectedState}
                onChange={handleStateChange}
              />
              <Select
                options={
                  selectedState
                    ? City.getCitiesOfState(
                      selectedCountry ? selectedCountry.isoCode : "",
                      selectedState ? selectedState.isoCode : ""
                    )
                    : []
                }
                getOptionLabel={(city) => city.name}
                getOptionValue={(city) => city.name}
                value={selectedCity}
                onChange={handleCityChange}
              />
            </div>

            {/* Other Form Fields */}
            <div className="cs">
              <h4>Competition Type<span style={{ color: "red" }}>*</span></h4>
              <input
                className='px-3 py-2'
                name="competitionType"
                placeholder='Enter the competition type'
                type="text"
                value={details.competitionType}
                onChange={handleChange}
              />
            </div>

            <div className="cs">
              <h4>Members Required<span style={{ color: "red" }}>*</span></h4>
              <input
                className='px-3 py-2'
                name="membersRequired"
                placeholder='Enter the number of members required'
                type="number"
                value={details.membersRequired}
                onChange={handleChange}
              />
            </div>

            <div className="cs">
              <h4>Last Date of Registration<span style={{ color: "red" }}>*</span></h4>
              <input
                className='px-3 py-2'
                name="lastDateOfRegistration"
                type="date"
                value={details.lastDateOfRegistration.toISOString().split('T')[0]}
                onChange={(e) => setDetails({ ...details, lastDateOfRegistration: new Date(e.target.value) })}
              />
            </div>

            {/* Year of Education */}
            <div className="cs">
              <h4>Year of Education <span style={{ color: "gray" }}>(Optional)</span></h4>
              <div className="flex gap-2 flex-wrap">
                {years.map((item, idx) => (
                  <div className='bg-[#c7c3c3] p-2 rounded-lg hover:bg-[#3364FF] hover:text-white cursor-default' id={selectedYear === item.name ? "year-selected" : ""} key={idx} onClick={() => { setDetails({ ...details, year: item.name }); setSelectedYear(item.name) }}>
                    <b>{item.name}</b>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex items-center justify-center self-center'>
              <div type="submit" className='w-[80px] h-[40px] bg-[#3364FF] text-white font-bold shadow-[2px_2px_1px_2px_#cecece] flex justify-center items-center rounded-[10px] hover:cursor-pointer' onClick={handleSubmit}>Submit</div>
            </div>

          </form>
        </div>

      </motion.div>
    </Backdrop>

  )
}