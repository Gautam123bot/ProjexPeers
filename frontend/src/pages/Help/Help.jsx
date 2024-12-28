import React, { useState } from "react";
import "./help.css";
import helpsvg from "./help-svg.svg";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineMinusCircle } from "react-icons/ai";


function Help() {
  const [fclk, setFclk] = useState(false);
  const [sclk, setSclk] = useState(false);
  const [tclk, setTclk] = useState(false);
  const [frclk, setFrclk] = useState(false);
  return (
    <div className="help-bod">
      <div className="help-first">
        <div className="help-write">
          <h1>Help Section</h1>
          <p>
          Contact us or read our FAQ section to know about the app and its usage
          </p>
        </div>
        <div className="img-bod">
          <img src={helpsvg} alt="" />
        </div>
      </div>
      <div className="help-second">
        <h1>FAQs</h1>

        <div className="help-box">
          <div className="f-l-h">
            <h2>What is Devcon and how does it work?</h2>
            {fclk === true ? (
              <AiOutlineMinusCircle
                size={30}
                style={{ fill: "#3E5DFF", cursor: "pointer" }}
                onClick={() => setFclk(!fclk)}
              />
            ) : (
              <AiOutlinePlusCircle
                size={30}
                style={{ fill: "#3E5DFF", cursor: "pointer" }}
                onClick={() => setFclk(!fclk)}
              />
            )}
          </div>
          {fclk && (
            <div className="a-c-b">
              {" "}
              Devcon is an app to help you find partners for your hackathons or
              projects.{" "}
            </div>
          )}
        </div>
        <div className="help-box">
          <div className="f-l-h">
            <h2> Do I need to pay for the hackathons?</h2>
            {sclk === true ? (
              <AiOutlineMinusCircle
                size={30}
                style={{ fill: "#3E5DFF", cursor: "pointer" }}
                onClick={() => setSclk(!sclk)}
              />
            ) : (
              <AiOutlinePlusCircle
                size={30}
                style={{ fill: "#3E5DFF", cursor: "pointer" }}
                onClick={() => setSclk(!sclk)}
              />
            )}
          </div>
          {sclk && (
            <div className="a-c-b">
              All the hackathons are free and users have to register via
              Devfolio platform.
            </div>
          )}
        </div>
        <div className="help-box">
          <div className="f-l-h">
            <h2> How to connect with teammates?</h2>
            {tclk === true ? (
              <AiOutlineMinusCircle
                size={30}
                style={{ fill: "#3E5DFF", cursor: "pointer" }}
                onClick={() => setTclk(!tclk)}
              />
            ) : (
              <AiOutlinePlusCircle
                size={30}
                style={{ fill: "#3E5DFF", cursor: "pointer" }}
                onClick={() => setTclk(!tclk)}
              />
            )}
          </div>
          {tclk && (
            <div className="a-c-b">
              Click on the connect button which is available on every posts in
              the newsfeed. Once clicked, a notification will send to the other
              person and where a chat session will open.
            </div>
          )}
        </div>
        <div className="help-box">
          <div className="f-l-h">
            <h2> Is this app free to use?</h2>
            {frclk === true ? (
              <AiOutlineMinusCircle
                size={30}
                style={{ fill: "#3E5DFF", cursor: "pointer" }}
                onClick={() => setFrclk(!frclk)}
              />
            ) : (
              <AiOutlinePlusCircle
                size={30}
                style={{ fill: "#3E5DFF", cursor: "pointer" }}
                onClick={() => setFrclk(!frclk)}
              />
            )}
          </div>
          {frclk && (
            <div className="a-c-b">
              {" "}
              This app is completely free to use as of now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Help;
