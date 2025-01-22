ProjexPeers

ProjexPeers is a web application designed to connect users with potential team members for projects, hackathons, and collaborations. The platform streamlines the process of finding peers and building teams by offering features like user registration, login via email and Google, forgot password functionality, and efficient team management.

The application is fully responsive and deployed using Docker, ensuring portability and ease of setup on any system. Additionally, the frontend is accessible at ProjexPeers Frontend, making it simple for users to explore and use the platform.

Features

User Registration and Authentication:Users can easily register and log in using email credentials or authenticate securely via Google.

Forgot Password and Reset Password:Securely reset passwords through an OTP-based mechanism.

Team Member Search:Find and connect with peers based on their skills, interests, and project preferences.

Responsive Design:Optimized for all screen sizes and devices, ensuring a seamless user experience.

Docker Deployment:Easily deployable using Docker for a streamlined development and production setup.

Technologies Used

Frontend:

ReactJS

PrimeReact

CSS

Firebase (for Google Sign-In)

Backend:

Node.js

Express.js

MongoDB

Deployment:

Docker

Prerequisites

Docker:While Docker simplifies the deployment process, you can also run the application locally on your system.

Node.js:If running locally, ensure that Node.js and npm are installed.

MongoDB:Set up a MongoDB instance, either locally or using a cloud-based service like MongoDB Atlas.

Getting Started

To get started with ProjexPeers, follow these steps:

Clone the Repository:

git clone https://github.com/your-repository/projexpeers.git
cd projexpeers

Install Dependencies:Navigate to the frontend and backend directories and install the required dependencies:

cd frontend
npm install
cd ../backend
npm install

Run Locally:

Start the backend server:

npm start

Start the frontend server:

cd frontend
npm start

Docker Deployment:Build and run the Docker containers:

docker-compose up --build

Access the Application:Open https://projex-peers.vercel.app/ to use the application.

ProjexPeers simplifies the process of building teams and fosters collaboration among individuals with shared goals. Whether you're preparing for a hackathon or seeking project partners, ProjexPeers is the platform to make your vision a reality!

