import React from "react";
import "./Articles.css";
import { articles_list } from "./articles_data";

const Articles = () => {
  return (
    <div className="art-body">
      <h1>Top Articles</h1>
    
    {articles_list.map((item)=>{
      return(
        <div className="articles" key={item.id}>
        {/* <div className="art-img"> */}
        <img
          className="art-img"
          src={item.img_url}
          alt=""
        />
        {/* </div> */}
        <div className="art-content">
          <div className="art-para">
            <h2>{item.heading}</h2>
            <p>
             {item.sub_head}
            </p>
          
            <a href={item.arti_link} target="_blank">  <button className="art-btn">Read More</button></a>
          </div>
          
        </div>
      </div>
      )
    })}
    </div>
  );
};

export default Articles;
