import React, { useEffect, useState } from "react";
import "./Profile.css";
import avatar_pic from "../../assets/images/avatar2.png";
import github from "../../assets/icons/github.svg";
import linkedin from "../../assets/icons/linkedin.svg";
import skills from "./test_skills";
import { Chips } from "../../components/Chips/Chips";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Backdrop } from "../../components/Backdrop/Backdrop";
import { motion } from "framer-motion";
import 'font-awesome/css/font-awesome.min.css';

const Profile = () => {
  const username = JSON.parse(localStorage.getItem("user_info")).username;
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [profileModal, setProfileModal] = useState(false);
  const [coverModal, setCoverModal] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [loader, setLoader] = useState(false);

  const handleProfileChange = (e) => {
    if (e.target.files[0]) {
      setProfileImg(e.target.files[0]);
    }
  };

  const storage = getStorage();

  const handleProfileUpload = () => {
    const storageRef = ref(storage, `profileImages/${profileImg.name}`);
    setLoader(true);
    uploadBytes(storageRef, profileImg).then((snapshot) => {
      if (snapshot) {
        console.log(snapshot);
        setLoader(false);
        alert("Profile Picture Changed Successfully!");
        getDownloadURL(ref(storage, `profileImages/${profileImg.name}`)).then(
          (url) => {
            Axios.patch(`http://localhost:3001/user/updateUser/${user._id}`, {
              profilePic: url,
            })
              .then((res) => {
                console.log(res);
                window.location.reload(true);
              })
              .catch((e) => {
                console.log(`Could not save image Url. ${e}`);
              });
          }
        );
      }
    });
  };

  const handleCoverChange = (e) => {
    if (e.target.files[0]) {
      setCoverImg(e.target.files[0]);
    }
  };

  const handleCoverUpload = () => {
    const storageRef = ref(storage, `coverImages/${coverImg.name}`);
    setLoader(true);
    uploadBytes(storageRef, coverImg).then((snapshot) => {
      if (snapshot) {
        console.log(snapshot);
        setLoader(false);
        alert("Cover Picture Changed Successfully!");
        getDownloadURL(ref(storage, `coverImages/${coverImg.name}`)).then(
          (url) => {
            Axios.patch(`http://localhost:3001/user/updateUser/${user._id}`, {
              coverPic: url,
            })
              .then((res) => {
                console.log(res);
                window.location.reload(true);
              })
              .catch((e) => {
                console.log(`Could not save image Url. ${e}`);
              });
          }
        );
      }
    });
  };

  useEffect(() => {
    console.log(username);
    const setUserDetails = async () => {
      const res = await Axios.post("http://localhost:3001/user/getUser", {
        username: username,
      });
      console.log("get user res in profile is: ", res.data);
      setUser(res.data);
      localStorage.setItem("user_info", JSON.stringify(res.data));
    };
    setUserDetails();
  }, [username]);

  return (
    <div className="profile-con">
      <div className="edit-conn">
        <h1>My Profile</h1>
        <div
          className="edit-btn"
          onClick={() => {
            navigate("/profile/edit");
          }}
        >
          Edit Profile
        </div>
      </div>

      <div className="profile-con-sub">


        <div className="profile-header">
          <div className="profile-wall">
            <img className="coverpic" src={user.coverPic} alt="" />
            <span onClick={() => setCoverModal(true)}>
              <i
                id="editCoverPic"
                style={{ fontSize: "2rem", position: "absolute", right: "0rem" }}
                class="fa fa-pencil-square-o"
                aria-hidden="true"
              ></i>
            </span>
          </div>
          <div className="profile-wall-sub">
            <div className="left">
              <img
                src={user.profilePic ? user.profilePic : avatar_pic}
                alt="avatar"
                className="avatar"
              />
              <span onClick={() => setProfileModal(true)}>
                <i
                  id="editProfilePic"
                  style={{
                    fontSize: "1.5rem",
                    position: "relative",
                    right: "1rem",
                    bottom: "-0.25rem",
                  }}
                  className="fa fa-pencil-square-o"
                  aria-hidden="true"
                ></i>
              </span>
              <div className="txt">
                <p className="name">
                  {user.fullname ? user.fullname : "Anom Chakravorty"}
                </p>
                <p className="position">Developer</p>
                <p className="institution">
                  {user.institution ? user.institution : "UEM Kolkata"},{" "}
                  {user.collegeYear ? user.collegeYear : "2"}nd Year
                </p>
              </div>
            </div>
            <div className="socials-icons">
              {user.github ? (
                <img
                  src={github}
                  alt="GitHub"
                  onClick={() => window.open(user.github, "_blank")}
                  className="cursor-pointer"
                />
              ) : (
                <img src={github} alt="GitHub" className="cursor-pointer" />
              )}
              {user.linkedIn ? (
                <img
                  src={linkedin}
                  alt="LinkedIn"
                  onClick={() => window.open(user.linkedIn, "_blank")}
                  className="cursor-pointer"
                />
              ) : (
                <img src={linkedin} alt="LinkedIn" className="cursor-pointer" />
              )}
            </div>
          </div>
        </div>

        <div className="skills-con">
          <h2 style={{ color: "#848482" }}>Skills</h2>
          {user.skills ? (
            <div className="skill-sub">
              {user.skills.map((skill, idx) => {
                return <Chips name={skill} key={idx} />;
              })}
            </div>
          ) : (
            "You haven't added any skills yet"
          )}
        </div>

        <div className="about-con">
          <h2 style={{ color: "#848482" }}>About</h2>
          {user.about ? (
            <div className="sub-card">
              <p>{user.about}</p>
            </div>
          ) : (
            "You haven't added any about me yet"
          )}
        </div>

        <div className="achievements-con">
          <h2 style={{ color: "#848482" }}>Achievements</h2>
          {user.achievements ? (
            <div className="sub-card">
              <ul>
                {user.achievements.map((achievement, idx) => {
                  return <li key={idx}>{achievement}</li>;
                })}
              </ul>
            </div>
          ) : (
            "You haven't added any achievements yet"
          )}
        </div>

        <div className="experience-con">
          <h2 style={{ color: "#848482" }}>Experience</h2>
          {user.experiences ? (
            <div className="sub-card">
              <ul>
                {user.experiences.map((experience, idx) => {
                  return <li key={idx}>{experience}</li>;
                })}
              </ul>
            </div>
          ) : (
            "You haven't added any experience yet!"
          )}
        </div>

        <div className="projects-con">
          <h2>Projects</h2>
          {user.projects ? (
            <div className="skill-sub">
              {user.projects.map((project, idx) => {
                return (
                  <div className="proj-card" key={idx}>
                    <p>{project}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            "You haven't added any projects yet"
          )}
        </div>
      </div>

      {profileModal ? (
          <Backdrop onClick={() => setProfileModal(false)}>
            <motion.div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div>
                <div className="card-body" style={{ paddingBottom: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="file" onChange={handleProfileChange}></input>
                    {loader ? <div class="loader"></div> : null}
                  </div>
                  <div className="sbd">
                    <div
                      type="submit"
                      id="sb"
                      style={{ marginTop: "2rem", zIndex: "2" }}
                      onClick={handleProfileUpload}
                    >
                      Submit
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Backdrop>
      ) : null}

      {coverModal ? (
        <>
          <Backdrop onClick={() => setCoverModal(false)}>
            <motion.div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div>
                <div className="card-body" style={{ paddingBottom: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="file" onChange={handleCoverChange}></input>
                    {loader ? <div class="loader"></div> : null}
                  </div>
                  <div className="sbd">
                    <div
                      type="submit"
                      id="sb"
                      style={{ marginTop: "2rem" }}
                      onClick={handleCoverUpload}
                    >
                      Submit
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Backdrop>
        </>
      ) : null}


    </div>
  );
};

export default Profile;
