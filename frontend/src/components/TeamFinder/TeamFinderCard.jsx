import React, { useEffect } from 'react'
// import Skills from "./finder_skill"
import "./teamFinderCard.css"
import years from './finder_year';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Backdrop } from '../Backdrop/Backdrop'
import { PostFeed } from '../../service/Api';
import { Chips } from '../Chips/Chips';
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import Loader from '../Loader/Loader';

export const TeamFinderCard = ({ setModal }) => {
  const user = JSON.parse(localStorage.getItem("user_info"));
  const savedEmail = user?.email;
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loader, setLoader] = useState(false);

  const [details, setDetails] = useState({
    name: user.fullname || "",
    username: user.username || "",
    title: "",
    email: savedEmail || "",
    skills: [],
    year: "",
    date: new Date(),
    city: "",
    state: "",
    country: "",
    competitionType: "",
    membersRequired: 1,
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
    setLoader(true);
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
    } finally {
      setLoader(false);
      window.location.reload();
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

  return (
    <>
      {loader && <Loader />}
      <Backdrop onClick={() => setModal(false)}>
        <motion.div onClick={(e) => { e.stopPropagation() }}>
          <div className="bg-white text-black rounded-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
            <button
              className="absolute top-4 right-4 text-3xl font-bold text-[#3364FF] hover:text-red-500"
              onClick={() => setModal(false)}
            >
              &times;
            </button>
            <h1 className="text-center text-2xl font-semibold mb-5">Create Post to make your team strong</h1>
            <form action="">
              <div className="mb-4">
                <h4 className="text-lg">Title of the Developer<span style={{ color: "red" }}>*</span></h4>
                <input className="w-full p-2 mt-2 rounded-lg bg-gray-700 text-white placeholder-gray-400" name="title" placeholder='Enter your title' type="text" value={details.title} onChange={handleChange} />
              </div>
  
              <div className='flex gap-4 flex-wrap'>
                <div className="flex-1 mb-4">
                  <h4 className="text-lg">Your Email<span style={{ color: "red" }}>*</span></h4>
                  <input className="w-full p-2 mt-2 rounded-lg bg-gray-700 text-white placeholder-gray-400" name="email" placeholder="Enter your email" type="email" value={details.email} onChange={handleChange} />
                </div>
                <div className="flex-1 mb-5 flex flex-col">
                  <div>
                    <h4 className="text-lg">Skills Required<span style={{ color: "red" }}>*</span></h4>
                    <input className="w-full p-2 mt-2 rounded-lg bg-gray-700 text-white placeholder-gray-400" name="skill" placeholder="Enter the skill you are looking for" type="text" onKeyDown={(e) => { addSkill(e); }} />
                  </div>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {details.skills.map((item, idx) => (
                      <div onClick={() => deleteSkill(item)} key={idx}>
                        <Chips name={item} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
  
              <div className="mb-4 flex flex-wrap justify-between">
                <label className="text-lg mr-4 w-full sm:w-auto">Select Your Region<span style={{ color: "red" }}>*</span></label>
                <div className='pe-4 pr-4 w-full sm:w-auto'>
                  <Select
                    options={Country.getAllCountries()}
                    getOptionLabel={(country) => country.name}
                    getOptionValue={(country) => country.isoCode}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                  />
                </div>
                <div className='pe-4 pr-4 w-full sm:w-auto'>
                  <Select
                    options={selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []}
                    getOptionLabel={(state) => state.name}
                    getOptionValue={(state) => state.isoCode}
                    value={selectedState}
                    onChange={handleStateChange}
                  />
                </div>
                <div className='pe-4 pr-4 w-full sm:w-auto'>
                  <Select
                    options={selectedState ? City.getCitiesOfState(selectedCountry ? selectedCountry.isoCode : "", selectedState ? selectedState.isoCode : "") : []}
                    getOptionLabel={(city) => city.name}
                    getOptionValue={(city) => city.name}
                    value={selectedCity}
                    onChange={handleCityChange}
                  />
                </div>
              </div>
  
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 mb-4">
                  <h4 className="text-lg">Competition Type<span style={{ color: "red" }}>*</span></h4>
                  {details.competitionType !== "Other" ? (
                    <select
                      className="w-full p-2 mt-2 rounded-lg bg-gray-700 text-white"
                      name="competitionType"
                      value={details.competitionType}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select Competition Type
                      </option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Ideathon">Ideathon</option>
                      <option value="Startup">Startup</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <input
                      className="w-full p-2 mt-2 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                      name="competitionType"
                      placeholder="Please specify"
                      type="text"
                      value={details.competitionType}
                      onChange={handleChange}
                    />
                  )}
                </div>
  
                <div className="flex-1 mb-4">
                  <h4 className="text-lg">Members Required<span style={{ color: "red" }}>*</span></h4>
                  <input
                    className="w-full p-2 mt-2 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                    name="membersRequired"
                    placeholder='Enter the number of members required'
                    type="number"
                    value={details.membersRequired}
                    onChange={handleChange}
                  />
                </div>
  
                <div className="flex-1 mb-4">
                  <h4 className="text-lg">Last Date of Registration<span style={{ color: "red" }}>*</span></h4>
                  <input
                    className="w-full p-2 mt-2 rounded-lg bg-gray-700 text-white"
                    name="lastDateOfRegistration"
                    type="date"
                    value={details.lastDateOfRegistration.toISOString().split('T')[0]}
                    onChange={(e) => setDetails({ ...details, lastDateOfRegistration: new Date(e.target.value) })}
                  />
                </div>
              </div>
  
              <div className="mb-4">
                <h4 className="text-lg">Year of Education <span style={{ color: "gray" }}>(Optional)</span></h4>
                <div className="flex gap-2 flex-wrap">
                  {years.map((item, idx) => (
                    <div className='bg-[#c7c3c3] p-2 rounded-lg hover:bg-[#3364FF] hover:text-white cursor-pointer' id={selectedYear === item.name ? "year-selected" : ""} key={idx} onClick={() => { setDetails({ ...details, year: item.name }); setSelectedYear(item.name) }}>
                      <b>{item.name}</b>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Submit Button */}
              <div className='mt-6'>
                <button
                  type="button"
                  className="w-full p-3 rounded-lg bg-[#3364FF] text-white font-semibold hover:bg-[#254edb] transition-colors"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </Backdrop>
    </>
  );
  

}