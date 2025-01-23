import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Feeds from "./pages/Feeds/Feeds";
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
import Dashboard from "./pages/Dashboard/Dashboard";
import { EditProfile } from "./pages/Profile/EditProfile";
import Home from "./pages/Home/Home";
import ProfilePage from "./pages/ShowProfile/ProfilePage";
import FindATeammate from "./pages/FindATeammate/FindATeammate";
import NotFound from "./pages/NotFound/NotFound";
import Invitations from "./pages/Invitations/Invitations";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Start as null to delay rendering
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false); // Indicate loading complete
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>; // Prevent redirection while checking token
    }
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/hackathons" element={<Hackathons />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/help" element={<Help />} />
        <Route path="/login" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              {/* <Sidebar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}> */}
                <Routes>
                  <Route path="/:username" element={<ProfilePage />} />
                  <Route path="/feeds" element={<Feeds />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/messages" element={<Chat />} />
                  <Route path="/findateammate" element={<FindATeammate />} />
                  <Route path="/invitations" element={<Invitations />} />
                  {/* <Route path="/team-finder" element={<TeamFinderCard />} /> */}
                  {/* <Route path="/feed" element={<FeedCard />} /> */}
                </Routes>
              {/* </Sidebar> */}
            </ProtectedRoute>
          }
        />
          <Route path="*" element={<Navigate to="/404" />} />
          <Route path="/404" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
