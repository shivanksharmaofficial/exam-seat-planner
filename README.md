🏫 College Exam Seat Planner
A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that efficiently allocates exam seats in classrooms using a greedy algorithm to minimize room usage while preferring lower-floor classrooms.

🎯 Features
✅ Classroom Management
Add Classrooms with room ID, capacity, floor number, and washroom proximity

View All Classrooms in a sorted table with floor-wise color coding

Real-time Validation for duplicate room IDs and capacity limits

✅ Intelligent Seat Allocation
Minimum Room Allocation using greedy algorithm

Lower Floor Preference prioritizes ground/first floor classrooms

Capacity Optimization maximizes room usage efficiency

Insufficient Capacity Detection with clear error messages

✅ User Experience
Responsive UI works on desktop and mobile

Instant Feedback with success/error notifications

Clean Dashboard with navigation between features

Data Persistence using MongoDB database

📋 Data Model
Field	Type	Description
roomId	String	Unique classroom identifier (e.g., R101, G201)
capacity	Number	Number of seats in classroom
floorNo	Number	Floor number (1=Ground, 2=First, etc.)
nearWashroom	Boolean	Proximity to washroom facility
🛠️ Tech Stack
Frontend
React.js - UI framework

Axios - HTTP client for API calls

CSS3 - Styling with modern flexbox/grid

React Router - Navigation between pages

Backend
Node.js - Runtime environment

Express.js - Web framework

Mongoose - MongoDB object modeling

CORS - Cross-origin resource sharing

Database
MongoDB - NoSQL database for data persistence

📁 Project Structure


ExamSeatPlanner/

├── backend/    # Express.js server

│   ├── models/

│   │   └── Classroom.js       # MongoDB schema

│   ├── server.js              # Main server file

│   └── package.json

├── frontend/                  # React.js application

│   ├── src/

│   │   ├── components/        # React components

│   │   │   ├── AddClassroom.js

│   │   │   ├── ClassroomList.js

│   │   │   └── AllocateExam.js

│   │   ├── App.js            # Main app component

│   │   └── index.js          # Entry point

│   └── package.json

├── .gitignore

└── README.md


