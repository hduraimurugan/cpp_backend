# Job Application Management API

This is a Node.js API built using Express.js that manages users, companies, jobs, and job applications. The project uses MongoDB for the database and includes routing for users, companies, jobs, and applications.

## Features

- **User Management:** API routes for creating and managing users.
- **Company Management:** API routes for managing companies.
- **Job Management:** API routes for creating and managing jobs posted by companies.
- **Application Management:** API routes for handling job applications by users.
- **CORS Support:** Allows requests from whitelisted frontend URLs.
- **Cookie Support:** Manages authentication and session data via cookies.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Cookie Parser
- CORS
- dotenv for environment variables
- Cloudinary for Saving files(Profile pic and Resume)

## Prerequisites

Ensure you have the following installed on your system:

- Node.js
- MongoDB

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

Install the required dependencies using `npm`:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add your environment variables:

```bash
PORT=3000
MONGO_URI=your_mongo_db_connection_string
```

### 4. Run the Application

Start the development server:

```bash
npm start
```

The server will run on the port specified in your `.env` file (default is `3000`).

### 5. API Routes

- **User Routes:** `/api/v1/user`
- **Company Routes:** `/api/v1/company`
- **Job Routes:** `/api/v1/job`
- **Application Routes:** `/api/v1/application`

### 6. CORS Configuration

The API allows requests from the following origins:

- `http://127.0.0.1:8080`
- `http://localhost:5173`
- `https://cpp-frontend.vercel.app`

The `CORS` policy can be modified in the code:

```javascript
const allowedOrigins = [
  "http://127.0.0.1:8080",
  "http://localhost:5173",
  "https://cpp-frontend.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
```

## Project Structure

```
├── routes
│   ├── user.route.js
│   ├── company.route.js
│   ├── job.route.js
│   └── application.route.js
├── utils
│   └── db.js
├── .env
├── server.js
├── package.json
└── README.md
```

## Database

This application uses MongoDB as its database. The connection is established in `db.js`:

```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
```

Ensure that you set up your MongoDB connection string in the `.env` file.

