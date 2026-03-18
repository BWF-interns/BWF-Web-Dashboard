"use client";
import React, { useState } from 'react';
import '../styles/globals.css';
import '../styles/dashboard.css'; 
import '../styles/tasks.css';
import { Bell, Home, ClipboardCheck, HeartPulse, Settings, FileText, ChevronLeft, MoreVertical, Plus, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function DailyTasks() {
  const [activeTab, setActiveTab] = useState('classwork'); // 'stream' or 'classwork'
  
  return (
    <div className="dashboard-layout">
      {/* SIDEBAR - Keep for navigation consistency */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">BWF</div>
          <h2>BWF</h2>
        </div>
        <nav className="sidebar-nav">
          <Link href="/student/dashboard" className="nav-item"><Home size={20}/> Home</Link>
          <button className="nav-item active"><ClipboardCheck size={20}/> Daily Tasks</button>
          <button className="nav-item"><HeartPulse size={20}/> Wellbeing/Help</button>
          <button className="nav-item"><Settings size={20}/> Settings</button>
        </nav>
      </aside>

      <main className="classroom-main">
        {/* PERSISTENT CLASSROOM HEADER */}
        <header className="classroom-header">
          <div className="header-top">
            <div className="class-title-group">
              <Link href="/student/dashboard" className="back-btn"><ChevronLeft size={20} /></Link>
              <h1>English Language Arts</h1>
            </div>
            <div className="header-actions">
              <button className="icon-btn"><Bell size={20} /></button>
              <div className="profile-avatar">
                <img src="https://ui-avatars.com/api/?name=Aisha&background=e0e7ff&color=4f46e5&rounded=true" alt="Profile" />
              </div>
            </div>
          </div>

          <div className="classroom-tabs">
            <button 
              className={`tab-btn ${activeTab === 'stream' ? 'active' : ''}`}
              onClick={() => setActiveTab('stream')}
            >
              Stream
            </button>
            <button 
              className={`tab-btn ${activeTab === 'classwork' ? 'active' : ''}`}
              onClick={() => setActiveTab('classwork')}
            >
              Classwork
            </button>
          </div>
        </header>

        <div className="classroom-scroll-area">
          {activeTab === 'stream' ? (
            /* STREAM VIEW: The Social/Announcement Feed */
            <div className="centered-content stream-view">
              <div className="class-banner-minimal">
                <h2>English Grade 10</h2>
                <p>Section B • Ms. Dana</p>
              </div>

              <div className="announcement-input card">
                <div className="avatar-sm">A</div>
                <button className="placeholder-text">Announce something to your class</button>
              </div>

              <div className="stream-item card">
                <div className="stream-header">
                  <div className="avatar-sm instructor">D</div>
                  <div className="stream-meta">
                    <span className="name">Ms. Dana</span>
                    <span className="date">16 Mar</span>
                  </div>
                  <button className="more-btn"><MoreVertical size={16} /></button>
                </div>
                <div className="stream-body">
                  <p>Students are requested to carefully read the English Essay prompt. The deadline is tomorrow at 5:00 PM.</p>
                </div>
                <div className="stream-footer">
                  <button className="comment-btn"><MessageSquare size={16} /> Add class comment</button>
                </div>
              </div>
            </div>
          ) : (
            /* CLASSWORK VIEW: Organized Learning Modules */
            <div className="centered-content classwork-view">
              <div className="topic-section">
                <h2 className="topic-title">Unit 2: Narrative Writing</h2>
                <div className="classwork-item card">
                  <div className="item-icon-bg"><FileText size={20} /></div>
                  <div className="item-info">
                    <span className="item-title">English: Essay Draft</span>
                    <span className="item-date">Posted yesterday</span>
                  </div>
                  <div className="item-due">Due Tomorrow</div>
                </div>

                <div className="classwork-item card completed">
                  <div className="item-icon-bg"><FileText size={20} /></div>
                  <div className="item-info">
                    <span className="item-title">Unit 2: Vocabulary Quiz</span>
                    <span className="item-date">Completed Monday</span>
                  </div>
                  <div className="item-status">Turned in</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}