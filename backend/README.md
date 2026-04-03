🗳️ Online Voting System V2A high-security, full-stack web application designed for digital elections. This system integrates Biometric Face Recognition and AI-driven Liveness Detection to ensure one-person-one-vote integrity and prevent identity fraud.🌟 Key Features🔐 Biometric AuthenticationUtilizes FaceAPI.js (built on TensorFlow.js) to perform real-time facial verification. It compares the live user's face against registered voter images stored in the database.🛡️ Anti-Spoofing (Liveness Detection)Advanced algorithmic checks to detect if a user is presenting a physical photo, a digital screen, or a video of another person, ensuring only live users can cast a vote.👥 Role-Based Access Control (RBAC)Dedicated portals and permissions for:Voters: Register, verify identity via camera, and cast votes securely.Candidates: Manage profiles and monitor nomination status.Admins: Manage election cycles, verify candidates, and oversee real-time results.📊 Real-Time AnalyticsAn interactive Admin Dashboard to monitor voter turnout and election statistics as they happen.🛠️ Tech StackLayerTechnologyFrontendHTML5, CSS3, JavaScript (ES6+)BackendNode.js, Express.jsDatabaseMongoDB (Mongoose ODM)AI / MLTensorFlow.js, FaceAPI.jsAuthenticationJWT (JSON Web Tokens) & Bcrypt Hashing📂 Project StructurePlaintextonline-voting-system/
├── backend/            # Express server, API routes, and DB models
│   ├── config/         # Database connection settings
│   ├── controllers/    # Business logic for Auth, Voting, and Admin
│   ├── models-face/    # Pre-trained AI weights for face recognition
│   ├── routes/         # API Endpoints
│   └── server.js       # Main entry point
├── frontend/           # Client-side UI
│   ├── services/       # Supplementary pages (ECI portal, tracking)
│   ├── faceUtils.js    # Client-side facial processing logic
│   └── script.js       # Main frontend logic
└── package.json        # Project dependencies
⚙️ Installation & Setup1. Clone the RepositoryBashgit clone https://github.com/sachin9258/online-voting-system.git
cd online-voting-system
2. Install DependenciesNavigate to the backend directory and install the necessary packages:Bashcd backend
npm install
3. Environment ConfigurationCreate a .env file in the backend folder and add your credentials:Code snippetPORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
4. Run the ApplicationStart the server:Bashnode server.js
The backend will run on http://localhost:5000. You can then open frontend/index.html in your browser.🛡️ Security Roadmap[x] Secure Password Hashing (Bcrypt)[x] Biometric Face Matching[x] JWT-Protected API Routes[ ] Blockchain integration for immutable vote storage (Planned)[ ] Multi-factor Authentication (MFA) via SMS/OTP📝 LicenseThis project is licensed under the MIT License.