import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Hackathons from "./pages/Hackathons/Hackathons";
import Articles from "./pages/Articles/Articles";
import Chat from "./pages/Chat/Chat";
import Sidebar from "./components/Sidebar/Sidebar";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import { useState, useEffect } from "react";
import Profile from "./pages/Profile/Profile";
import Help from "./pages/Help/Help";
import { TeamFinderCard } from "./components/TeamFinder/TeamFinderCard";
import { FeedCard } from "./components/FeedCard/FeedCard";
import { EditProfile } from "./pages/Profile/EditProfile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    console.log("username is: ", user);
    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  return (
    <Router>
      {isLoggedIn ? (
        <Sidebar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <Routes>
            <Route path="/:username" element={<Dashboard />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Chat />} />
            <Route path="/help" element={<Help />} />
            <Route path="/team-finder" element={<TeamFinderCard />} />
            <Route path="/feed" element={<FeedCard />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route
              path="*"
              element={<Navigate to={`/${username}`} replace />}
            />
            {/* <Route path="*" element={<div>404 Page not found :(</div>} /> */}
          </Routes>
        </Sidebar>
      ) : (
        <Routes>
          <Route path="/login" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
