"use client";
import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import { Bell, Home, BookOpen, HeartPulse, Settings } from 'lucide-react';

/* =========================================
   MOCK DATA (Replace with API calls later)
   ========================================= */

const MOCK_USER = {
  firstName: "Aisha",
  avatarUrl: "https://ui-avatars.com/api/?name=Aisha&background=e0e7ff&color=4f46e5&rounded=true&bold=true",
  hasUnreadNotice: true,
};

const MOCK_SCHEDULE = [
  { id: 1, time: "10:00 AM", title: "Math", actionText: "Join session", isActive: true },
  { id: 2, time: "11:30 AM", title: "Vocational Training", actionText: "View details", isActive: false },
  { id: 3, time: "2:00 PM", title: "Life Skills Workshop", actionText: "Join session", isActive: false }
];

const MOCK_ASSIGNMENTS = [
  { id: 1, title: "Science Project", due: "Due tomorrow", status: "urgent" },
  { id: 2, title: "English Essay", due: "Due in 3 days", status: "normal" }
];

const MOCK_MENTOR_NOTE = {
  id: 1,
  mentorName: "Ms. Dana",
  mentorRole: "Your Mentor",
  avatarUrl: "https://ui-avatars.com/api/?name=Dana+Elomo&background=fce7f3&color=db2777&rounded=true",
  dateLabel: "Today",
  message: "Hi Aisha! Your group presentation for the Science module was excellent yesterday. Keep up the great momentum, and let me know if you need any resources for your upcoming assignments."
};

const MOCK_INSPIRATION = {
  quote: "You are braver than you believe, stronger than you seem, and smarter than you think.",
  footerText: "Take a deep breath and drop your shoulders before you begin."
};

/* =========================================
   COMPONENT
   ========================================= */

export default function Dashboard() {
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good morning');
    } else if (currentHour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  return (
    <div className="dashboard-layout">
      
      {/* Sidebar */}
      {/* <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">BWF</div>
          <h2>BWF</h2>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active"><Home size={20}/> Home</button>
          <button className="nav-item"><BookOpen size={20}/> My Courses</button>
          <button className="nav-item"><HeartPulse size={20}/> Wellbeing/Help</button>
          <button className="nav-item"><Settings size={20}/> Settings</button>
        </nav>
      </aside> */}

      {/* Main Content Area */}
      <main className="main-content">
        
        <header className="top-header">
          {/* Dynamically rendering greeting and user name */}
          <h1>{greeting}, {MOCK_USER.firstName}</h1>
          <div className="header-actions">
            <button className="icon-btn">
              <div className="relative">
                <Bell size={20} />
                {/* Dynamically show notification dot based on boolean */}
                {MOCK_USER.hasUnreadNotice && (
                   <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-white"></span>
                )}
              </div>
            </button>
            <div className="profile-avatar">
              <img src={MOCK_USER.avatarUrl} alt="Profile" />
            </div>
          </div>
        </header>

        {/* Welcome & Mood Tracker */}
        <section className="welcome-banner">
          <div className="welcome-text">
            <h2>Welcome back!</h2>
            <p>Borderless World Foundation (BWF) created a safe space for you.</p>
          </div>
          <div className="mood-tracker">
            <button className="mood-btn">
              <span className="emoji">😊</span>
              <span className="label">Happy</span>
            </button>
            <button className="mood-btn">
              <span className="emoji">😐</span>
              <span className="label">Okay</span>
            </button>
            <button className="mood-btn help-btn">
              <span className="emoji">😨</span>
              <span className="label">Need Help</span>
            </button>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section className="dashboard-grid">
          
          <div className="card schedule-card">
            <h3>Today's Schedule</h3>
            <div className="schedule-list">
              {/* Mapping over MOCK_SCHEDULE */}
              {MOCK_SCHEDULE.map((item) => (
                <div key={item.id} className="schedule-item">
                  <div className="time">{item.time}</div>
                  <div className="details">
                    <h4>{item.title}</h4>
                    <button className="btn-primary">{item.actionText}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card assignments-card">
            <h3>Recent Assignments</h3>
            <div className="assignment-list">
              {/* Mapping over MOCK_ASSIGNMENTS */}
              {MOCK_ASSIGNMENTS.map((assignment) => (
                <div key={assignment.id} className="assignment-item">
                  <div className="assignment-header">
                    <span className={`status-dot dot-${assignment.status}`}></span>
                    <h4>{assignment.title}</h4>
                  </div>
                  <span className="due-date text-slate-400 text-xs">{assignment.due}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card resources-card">
            <h3>Quick Resources</h3>
            <div className="resource-buttons">
              <button className="resource-btn bg-library">Library</button>
              <button className="resource-btn bg-syllabus">Download Syllabus</button>
              <button className="resource-btn bg-mentor">Contact Mentor</button>
            </div>
          </div>

        </section>

        {/* BOTTOM SECTION: Connection & Community */}
        <section className="connection-section mt-8">
          
          {/* Card 1: Mentor Note (Dynamic Data) */}
          <div className="card mentor-note-card">
            <div className="card-header">
              <div className="mentor-info">
                <div className="mentor-avatar">
                  <img src={MOCK_MENTOR_NOTE.avatarUrl} alt={`Mentor ${MOCK_MENTOR_NOTE.mentorName}`} />
                </div>
                <div>
                  <h3 className="text-pink-900 m-0">Note from {MOCK_MENTOR_NOTE.mentorName}</h3>
                  <span className="text-xs text-pink-700">{MOCK_MENTOR_NOTE.mentorRole}</span>
                </div>
              </div>
              <span className="date-badge">{MOCK_MENTOR_NOTE.dateLabel}</span>
            </div>
            
            <div className="mentor-message">
              <p>"{MOCK_MENTOR_NOTE.message}"</p>
            </div>
            <div className="mentor-actions">
              <button className="btn-react">❤️</button>
              <button className="btn-reply">Say thanks</button>
            </div>
          </div>

          {/* Card 2: Daily Inspiration (Dynamic Data) */}
          <div className="card mindful-card">
            <div className="mindful-header">
              <span className="mindful-emoji">🌱</span>
              <h3>Daily Inspiration</h3>
            </div>
            
            <div className="mindful-body">
              <p>"{MOCK_INSPIRATION.quote}"</p>
            </div>
            
            <div className="mindful-footer">
              <span className="mindful-emoji">🌬️</span>
              <p>{MOCK_INSPIRATION.footerText}</p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}