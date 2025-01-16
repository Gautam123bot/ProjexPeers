import React, { useState } from "react";
import "./EditProfile.css";
import { UpdateUser } from "../../service/Api";
import { Chips } from "../../components/Chips/Chips";
import { useNavigate } from "react-router-dom";
import Back_icon from "../../assets/icons/back.png";
import { AiOutlineEdit } from "react-icons/ai";
import { FaGithubSquare } from "react-icons/fa";
import { FaMedal } from "react-icons/fa";
import { AiFillLinkedin } from "react-icons/ai";
import { MdWork } from "react-icons/md";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { BsPersonFill } from "react-icons/bs";
import {MdInsertPhoto} from "react-icons/md"
export const EditProfile = () => {
  const user_info = JSON.parse(localStorage.getItem("user_info"));
  const navigate = useNavigate();
  const username = user_info._id;

  const [fullname, setFullname] = useState(user_info.fullname);
  const [profilePic, setProfilePic] = useState(
    user_info.profilePic ? user_info.profilePic : ""
  );
  const [coverPic, setCoverPic] = useState(
    user_info.coverPic ? user_info.coverPic : ""
  );
  const [github, setGithub] = useState(user_info.github);
  const [linkedIn, setLinkedin] = useState(user_info.linkedIn);
  const [institution, setInstitution] = useState(user_info.institution);
  const [collegeStream, setCollegeStream] = useState(user_info.collegeStream);
  const [collegeYear, setCollegeYear] = useState(user_info.collegeYear);
  const [about, setAbout] = useState(user_info.about);
  const [skills, setSkills] = useState(
    user_info.skills ? user_info.skills : []
  );
  const [achievements, setAchievements] = useState(
    user_info.achievements ? user_info.achievements : []
  );
  const [experiences, setExperiences] = useState(
    user_info.experiences ? user_info.experiences : []
  );
  const [projects, setProjects] = useState(
    user_info.projects ? user_info.projects : []
  );
  const [available, setAvailable] = useState(user_info.available);

  const handleAvailabilityToggle = () => {
    setAvailable(!available);
  };

  const obj = {
    fullname,
    profilePic,
    coverPic,
    github,
    linkedIn,
    institution,
    collegeStream,
    collegeYear,
    about,
    skills,
    achievements,
    experiences,
    projects,
    available
  };
  function addSkill(e) {
    if (e.key === "Enter") {
      if (skills.indexOf(e.target.value) === -1) {
        setSkills([...skills, e.target.value]);
        e.target.value = "";
      }
    }
  }
  function addAchievement(e) {
    if (e.key === "Enter") {
      if (achievements.indexOf(e.target.value) === -1) {
        setAchievements([...achievements, e.target.value]);
        e.target.value = "";
      }
    }
  }
  function addExperience(e) {
    if (e.key === "Enter") {
      if (experiences.indexOf(e.target.value) === -1) {
        setExperiences([...experiences, e.target.value]);
        e.target.value = "";
      }
    }
  }
  function addProject(e) {
    if (e.key === "Enter") {
      if (projects.indexOf(e.target.value) === -1) {
        setProjects([...projects, e.target.value]);
        e.target.value = "";
      }
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submission = await UpdateUser(username, obj);
      console.log(submission);
      
      if (submission.data.success === true) {
        alert("Profile Updated");
  
        const updatedUserInfo = { ...JSON.parse(localStorage.getItem("user_info")), ...obj };
        localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
  
        navigate("/profile");
      } else {
        alert("Error updating profile");
      }
    } catch (error) {
      console.error("Error during update:", error);
      alert("An error occurred");
    }
  };
  

  const deleteSkill = (idx) => {
    console.log("Deleted Skill");
    //delete index idx from skills
    const newSkills = skills.filter((skill) => skill !== idx);
    setSkills(newSkills);
  };

  const deleteAchievement = (idx) => {
    console.log("Deleted Achievement");
    //delete index idx from skills
    const newAchievements = achievements.filter(
      (achievement) => achievement !== idx
    );
    setAchievements(newAchievements);
  };

  const deleteExperience = (idx) => {
    console.log("Deleted Experience");
    //delete index idx from skills
    const newExperiences = experiences.filter(
      (experience) => experience !== idx
    );
    setAchievements(newExperiences);
  };

  const deleteProject = (idx) => {
    console.log("Deleted Project");
    const newProjects = projects.filter((project) => project !== idx);
    setProjects(newProjects);
  };

  return (
    <div className="edit-con">
      <div className="edit-con-header">
        <div className="ph">
          <h1 style={{ color: "#3364FF" }}>Profile Edit</h1>{" "}
          <AiOutlineEdit size={30} style={{ fill: "#3364FF" }} />
        </div>

        <div
          className="back-con"
          onClick={() => {
            navigate("/profile");
          }}
        >
          <img src={Back_icon} alt="Back" />
        </div>
      </div>

      <p>Add your details here!</p>
      <div className="edit-main-con">
        <div className="sec1">
          <div className="edit-fullname">
            <label>Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="edit-github">
            <div className="gh">
              <label>GitHub</label>
              <FaGithubSquare size={25} style={{ fill: "#3364FF" }} />
            </div>

            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>
          <div className="edit-linkedIn">
            <div className="gh">
              <label>LinkedIn</label>
              <AiFillLinkedin size={25} style={{ fill: "#3364FF" }} />
            </div>

            <input
              type="text"
              value={linkedIn}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>
          <div className="edit-profimage">
            <div className="gh">
              <label>Profile Image URL</label>
              <BsPersonFill size={25} style={{ fill: "#3364FF" }} />
            </div>

            <input
              type="text"
              value={profilePic}
              onChange={(e) => {
                setProfilePic(e.target.value);
              }}
            />
          </div>
       
        </div>
        <div className="edit-covimage">
            <div className="gh">
              <label>Cover Image URL</label>
              <MdInsertPhoto size={25} style={{ fill: "#3364FF" }} />
            </div>

            <input
              type="text"
              value={coverPic}
              onChange={(e) => {
                setCoverPic(e.target.value);
              }}
            />
          </div>
        <div className="sec2">
            
          <div className="edit-institution">
            <label>Instituition</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>
          <div className="edit-collegeStream">
            <label>College Stream</label>

            <input
              type="text"
              value={collegeStream}
              onChange={(e) => setCollegeStream(e.target.value)}
            />
          </div>
          <div className="edit-collegeYear">
            <label>College Year</label>
            <input
              type="text"
              value={collegeYear}
              onChange={(e) => setCollegeYear(e.target.value)}
            />
          </div>
        </div>

        <div className="edit-about">
          <label>About</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
        </div>
        <div className="availability-toggle">
        <label>Availability</label>
        <div className="toggle-button-container">
          <span>{available ? "Available" : "Not Available"}</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={available} 
              onChange={handleAvailabilityToggle} 
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
        <div className="edit-skills">
          <div className="roww">
            <label>Skills</label>
            <input
              type="text"
              onKeyDown={(e) => {
                addSkill(e);
              }}
            />
          </div>
          <div className="roww">
            {skills.map((skill, idx) => {
              return (
                <div onClick={() => deleteSkill(skill)}>
                  <Chips name={skill} key={idx} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="edit-achievements">
          <div className="as">
            <label>Achievements</label>
            <FaMedal size={25} style={{ fill: "#3364FF" }} />
          </div>

          <input
            type="text"
            onKeyDown={(e) => {
              addAchievement(e);
            }}
          />
          <ul>
            {achievements.map((achievement, idx) => {
              return (
                <li
                  className="lists"
                  key={idx}
                  onClick={() => deleteAchievement(achievement)}
                >
                  {achievement}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="edit-experience">
          <div className="ws">
            <label>Experience</label>
            <MdWork size={25} style={{ fill: "#3364FF" }} />
          </div>

          <input
            type="text"
            onKeyDown={(e) => {
              addExperience(e);
            }}
          />
          <ul>
            {experiences.map((experience, idx) => {
              return (
                <li
                  className="lists"
                  key={idx}
                  onClick={() => deleteExperience(experience)}
                >
                  {experience}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="edit-projects">
          <div className="ws">
            <label>Projects</label>
            <AiOutlineFundProjectionScreen
              size={25}
              style={{ fill: "#3364FF" }}
            />
          </div>

          <input
            type="text"
            onKeyDown={(e) => {
              addProject(e);
            }}
          />
          <ul>
            {projects.map((project, idx) => {
              return (
                <li
                  className="lists"
                  key={idx}
                  onClick={() => deleteProject(project)}
                >
                  {project}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div onClick={handleSubmit} className="edit-submit-btn">
        Save Changes
      </div>
    </div>
  );
};
