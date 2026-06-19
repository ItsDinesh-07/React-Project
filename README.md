<div align="center">
  <h1>🎯 AI Interview Preparation Suite</h1>
  <p><strong>Your Complete Interview Readiness Platform</strong></p>
</div>

---

## 📸 Dashboard Preview

![Dashboard Screenshot](https://raw.githubusercontent.com/ItsDinesh-07/React-Project/main/screenshots/dashboard.png)

---

## 🚀 Features

### Core Modules
- **📋 Dashboard** - AI-powered interview preparation hub with real-time progress tracking
- **📄 Resume Analyzer** - ATS score optimization and resume feedback
- **🎥 Mock Interviews** - Practice interviews with video analysis
- **📚 Study Plan** - Personalized learning paths and task management
- **💡 Technical Practice** - Coding challenges and algorithmic problems
- **🗣️ Communication Practice** - Speech and presentation skills training
- **🧮 Aptitude Practice** - Quantitative and logical reasoning exercises
- **💼 HR Practice** - Behavioral interview preparation
- **📊 Progress Tracking** - Performance metrics and analytics
- **📜 Interview History** - Review past practice sessions

### Dashboard Highlights
- **Performance Metrics** - Real-time score tracking and trend analysis
- **Role-Based Access** - Customized views for Students, Admins, Vendors, and Colleges
- **Study Checklist** - Daily task management and completion tracking
- **ATS Resume Analyzer** - Detailed feedback on formatting, keywords, and experience
- **Technical Coding Practice** - Customizable challenges based on career track

---

## 🛠️ Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React (Icons)
- **Charts & Analytics**: Recharts
- **Routing**: React Router
- **Backend**: Node.js/Express (server.ts)
- **Build Tool**: Vite

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

---

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ItsDinesh-07/React-Project.git
   cd React-Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your API keys and configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
React-Project/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components (Dashboard, Login, etc.)
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── MockInterview.tsx
│   │   ├── ResumeAnalyzer.tsx
│   │   └── ...
│   ├── types.ts            # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── screenshots/            # Project screenshots
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

---

## 👥 User Roles

The platform supports multiple user roles with different functionalities:

| Role | Features |
|------|----------|
| **Student/Candidate** | Access all practice modules, track progress, analyze resume |
| **Admin** | Manage users, view platform analytics, limited to operational tasks |
| **Main Admin (CEO)** | Full system access, financial ledger, revenue tracking, user management |
| **Vendor** | Create and publish custom course content |
| **Direct College** | Assign tasks to students, track academic performance |

---

## 💾 Data Storage

- **LocalStorage**: User authentication, progress data, study plans
- **Session-based**: Practice histories, resume reports, mock interview sessions

---

## 🎮 How to Use

### For Students:
1. **Sign Up** → Create your account
2. **Select Role** → Choose your target career path (Java Developer, Frontend Developer, etc.)
3. **Dashboard** → View your progress and daily tasks
4. **Practice** → Attempt technical, aptitude, communication, or HR questions
5. **Resume Analysis** → Upload and analyze your resume for ATS compatibility
6. **Mock Interviews** → Practice full mock interviews

### For Admins:
1. **Login** as Admin
2. **User Management** → View and manage platform users
3. **View Analytics** → Monitor student performance

### For Vendors:
1. **Curriculum Design** → Create custom course modules
2. **Publish Content** → Assign courses to platform users

### For Colleges:
1. **Task Assignment** → Create and assign academic tasks
2. **Student Tracking** → Monitor student progress and performance

---

## 📊 Dashboard Sections

- **Top Stats**: Resume Score, Mock Interviews, Average Score, Practice Streak
- **Performance Growth Metrics**: Area chart showing weekly score trends
- **Today's Study Plan**: Task checklist with completion tracking
- **ATS Resume Analyzer**: Resume scoring and detailed feedback
- **Technical Coding Practice**: Access to coding challenges

---

## 🔐 Authentication

- Login/Signup with email
- Role-based access control (RBAC)
- Session persistence via localStorage

---

## 🚀 Live Features

- ✅ Real-time progress tracking
- ✅ ATS-optimized resume analysis
- ✅ Multi-role dashboard
- ✅ Performance analytics
- ✅ Task management system
- ✅ Customizable learning paths

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

<div align="center">
  <p><strong>Made with ❤️ by the AI Interview Prep Team</strong></p>
</div>
