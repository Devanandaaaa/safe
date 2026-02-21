**PROJECT DESCRIPTION**

SAFE360+ – Women’s Safety & Maternal Risk Tracker
Project Type: Web Application (Frontend-only, React-based)
Target Users: Women, mothers, solo travelers, students


**Problem Statement**

Women face multiple, overlapping risks in daily life:
Public safety risks while commuting or traveling alone.
Maternal health risks, especially postpartum complications and mental health challenges.
Domestic safety risks from coercive behavior, abuse, or unsafe environments.
Existing solutions are often fragmented — separate apps for safety alerts, maternal health, or domestic violence reporting. Users must juggle multiple platforms, which reduces effectiveness and timeliness of response.

**TECH STACK**

Frontend
Next.js 13+ – React framework for server-side rendering, routing, and API routes.
React 18 – Core library used with Next.js.
Tailwind CSS – Utility-first CSS framework for styling components.
Lucide-react – Icon library used in UI.
Chart.js + react-chartjs-2 – For data visualization (bar charts, line charts).

Backend / API
Next.js API Routes – Backend logic is handled via API routes inside the Next.js app.
Node.js runtime – Provided by Next.js server.

Database / Storage
Firebase Firestore – Real-time NoSQL database for storing entries like financial or empowerment data.
Firebase Auth – Authentication system for users.
State Management

React Context (useAuth) – For user authentication state.
useState / useEffect / useCallback – React hooks for local state and side effects.

**FEAUTURES LIST**
1. User Authentication & Security
2. Safety & Emergency Features
3. Empowerment Resources
4. Analytics & Dashboard
5. Frontend Features
6. Backend Features
   

**INSTALLATION COMMANDS**
1. Clone the repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo
2. Backend Setup
cd backend
npm install
3.Create .env file in backend/ with:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4.Run Backend:
npm start
5.Backend will run at: http://localhost:5000

**RUN COMMANDS**
1.Frontend Setup
cd ../frontend
npm install
a.Create .env.local file in frontend/ with:
NEXT_PUBLIC_API_URL=http://localhost:5000
b.Run Frontend:
npm run dev
c.Run Backend
cd backend
npm start
d.Backend runs at: http://localhost:5000

2️. Run Frontend
cd frontend
npm run dev
a.Frontend runs at: http://localhost:3000

3.Production Deployment Commands (Optional)
1.Backend (Render / any server)
cd backend
npm install
npm start

2.Frontend (Vercel)
cd frontend
vercel --prod
Vite / npm – For local development and package management (though Next.js handles bundling).
TypeScript – For type safety and better code maintainability.

**SCREENSHOTS**
![WhatsApp Image 2026-02-21 at 09 30 03](https://github.com/user-attachments/assets/4c6bc4d0-313f-4086-9732-5975a0f10acd)
![WhatsApp Image 2026-02-21 at 09 30 03 (2)](https://github.com/user-attachments/assets/d23f696c-ecb5-4c95-a836-23de5c99c120)
![WhatsApp Image 2026-02-21 at 09 30 04](https://github.com/user-attachments/assets/6ec5bb1b-9c39-48ff-9aee-ca23efa72dc8)
![WhatsApp Image 2026-02-21 at 09 30 04 (1)](https://github.com/user-attachments/assets/31c351a8-5188-4fda-b6d8-c1566172c941)
![WhatsApp Image 2026-02-21 at 09 30 04 (2)](https://github.com/user-attachments/assets/9d2f07c0-01d2-4295-996a-5966c5882f00)
![WhatsApp Image 2026-02-21 at 09 30 04 (3)](https://github.com/user-attachments/assets/e5544243-1556-4728-afbf-2d549ac21014)

**VIDEO**

Google Drive Link:https://drive.google.com/file/d/1s3oclj7ttfyssWXmS_huTIcJH2gvxk9z/view

**SYSTEM ARCITECHTURE**

Our web application follows a three-tier architecture comprising Frontend, Backend, and Database, designed for modularity, scalability, and maintainability.
1. Frontend (Client-Side)
Built with HTML, CSS, and JavaScript, optionally using Next.js or React.
Responsible for:
Rendering the user interface
Capturing user interactions
Sending requests to the backend via API calls
Runs on the user’s web browser.

3. Backend (Server-Side)
Built with Node.js and Express.js.
Responsibilities:
Handles HTTP requests from the frontend
Implements business logic
Manages authentication and authorization
Processes and validates data before interacting with the database
Serves API endpoints (REST or GraphQL)

4. Database
Stores persistent data such as user credentials, application data, and logs.
Examples: MongoDB, MySQL, or PostgreSQL.
Provides CRUD operations to the backend for data management.

5. Optional External Services
Third-party APIs for additional functionality (e.g., Google Maps, email services)
Cloud storage services (e.g., AWS S3) for storing images or files.
Base URL (Local): http://localhost:3000/api
Base URL (Production): https://your-frontend.vercel.app/api
1️. Authentication Routes
POST /api/auth/register – Register a new user
Body: { name, email, password }
Response: { success: true, userId, token }
POST /api/auth/login – Login user
Body: { email, password }
Response: { success: true, userId, token }
POST /api/auth/logout – Logout user
Body: { token }
Response: { success: true }

2️. Safety & Emergency Routes
POST /api/safety/report – Submit a safety report
Body: { type, location, description, media? }
Response: { success: true, reportId }
GET /api/safety/reports – Get all reports for logged-in user
Headers: Authorization: Bearer <token>
Response: [ { reportId, type, location, status, createdAt } ]
POST /api/safety/sos – Trigger an SOS alert
Body: { latitude, longitude, message }
Response: { success: true, alertId }

3️.Empowerment / Resources Routes
GET /api/resources/list – Fetch all resources
Response: [ { id, title, category, content, link? } ]
GET /api/resources/:id – Fetch a specific resource
Response: { id, title, category, content, link }

4️.Analytics & Dashboard Routes
GET /api/dashboard/stats – Get dashboard statistics
Headers: Authorization: Bearer <token>
Response: { totalReports, incidentsByType, safetyScore }
GET /api/dashboard/charts – Get chart data for visualization
Headers: Authorization: Bearer <token>
Response: { chartData: { labels: [], datasets: [] } }

**TEAM MEMBERS**
ALBY GRACE ABY
DEVANANDA D

**LICENSE INFO**
This project was created by **Alby Grace Aby** and **Devananda D** for hackathon purposes.  
We welcome contributions!!!  
If anyone wants to collaborate or improve the project,feel free to fork the repository,submit pull requests,or suggest enhancements.  
All rights are reserved by the creators; this project is **open-source for collaboration only**.

