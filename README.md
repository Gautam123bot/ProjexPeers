# ProjexPeers  

ProjexPeers is a web application that connects users with potential team members for projects, hackathons, and collaborations. The platform enables users to register, find peers, and build teams efficiently. It also provides features like login via email and Google, forgot password functionality, and team management.  

The app is deployed using **Docker**, making it portable and easy to set up on any system.  

---

## Features  

- **User Registration and Authentication**:  
  Users can register, log in using email credentials, or authenticate via Google.  

- **Forgot Password and Reset Password**:  
  Securely reset passwords using an OTP-based mechanism.  

- **Team Member Search**:  
  Find and connect with peers based on their skills and interests.  

- **Responsive Design**:  
  Optimized for all screen sizes and devices.  

- **Docker Deployment**:  
  Easily deployable with Docker for a streamlined development and production setup.  

---

## Technologies Used  

- **Frontend**:  
  - ReactJS  
  - PrimeReact  
  - CSS  
  - Firebase (for Google Sign-In)  

- **Backend**:  
  - Node.js  
  - Express.js  
  - MongoDB  

- **Deployment**:  
  - Docker  

---

## **Installation**:

Running Locally
If you prefer running the application locally without Docker:

Clone the Repository:

bash
Copy code
git clone https://github.com/your-username/projexpeers.git  
cd projexpeers  
Set up the Environment Variables:

Create a .env file in the backend directory and add the following:

env
Copy code
MONGO_URI=mongodb://<your-mongo-db-url>:27017/projexpeers  
JWT_SECRET=your_jwt_secret_key  
PORT=3001  
Install Dependencies:

For the Backend:

bash
Copy code
cd backend  
npm install  
For the Frontend:

bash
Copy code
cd frontend  
npm install  
Start the Application:

Backend:

bash
Copy code
cd backend  
npm start  
Frontend:

bash
Copy code
cd frontend  
npm start  
Access the Application:

Open your browser and navigate to http://localhost:3000.

### Prerequisites  

1. **Docker**: Ensure Docker is installed on your system.  
2. **Node.js**: If running locally, Node.js and npm should be installed.  
3. **MongoDB**: A MongoDB instance (local or cloud-based).  
