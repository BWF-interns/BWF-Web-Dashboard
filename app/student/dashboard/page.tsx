// app/student/dashboard/page.tsx
import Dashboard from "./Dashboard";
import type { Metadata } from "next";

import { INSPIRATIONAL_QUOTES } from "../constants/quotes";

const mockData = {
  uiStrings: {
    welcomeTitle: "Welcome back!",
    welcomeSub: "Borderless World Foundation (BWF) created a safe space for you.",
    scheduleTitle: "Today's Schedule",
    assignmentsTitle: "Recent Assignments",
    resourcesTitle: "Quick Resources",
    mentorNoteTitle: "Note from ",
    dailyInspirationTitle: "Daily Inspiration",
    loading: "Loading...",
    allCaughtUp: "All caught up!",
    joinSession: "Join session",
    viewDetails: "View details",
    thanked: "Thanked!",
    sayThanks: "Say thanks",
    resourceLibrary: "📚 Library",
    resourceSyllabus: "📄 Download Syllabus",
    resourceContact: "💬 Contact Mentor"
  }
};

// TODO: Replace fetch with GET /api/student/dashboard/:auth_id

export default function Dashboard() {
  const router = useRouter();
  const { unreadCount } = useNotices();
  const { avatarId, customAvatarUrl, name, authId } = useProfile();
  const av = getAvatar(avatarId);
  const hasUnread = unreadCount > 0;

  /* ── State ── */
  const [schedule, setSchedule] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [mentorNote, setMentorNote] = useState<any>(null);
  const [todayMood, setTodayMood] = useState<string | null>(null);
  
  // NEW: Dynamic Resources State
  const [resources, setResources] = useState<{
    library?: string;
    syllabus?: string;
    contactMentor?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState("Welcome");
  const [reacted, setReacted] = useState(false);
  
  // Stable quote for the day
  const quoteIndex = new Date().getDate() % INSPIRATIONAL_QUOTES.length;

  const firstName = name.split(" ")[0];

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const fetchDashboard = async () => {
      try {
        const res = await api.get(`/student/dashboard/${authId}`);

        setSchedule(res.data.schedule || []);
        
        // 30-day Guardrail for Assignments
        const allAssignments = res.data.assignments || [];
        console.log("All assignments:", allAssignments);

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const filteredAssignments = allAssignments.filter((a: any) => {
          const dueDate = new Date(a.dueDate);
          return dueDate <= thirtyDaysFromNow;
        });
        
        console.log("Filtered assignments:", filteredAssignments);
        setAssignments(filteredAssignments);
        
        // Load Mentor Note & "Thanks" state
        const note = res.data.mentorNote || null;
        setMentorNote(note);
        if (note?.thanked) setReacted(true);
        
        setTodayMood(res.data.todayMood || null);

        // Map dynamic resources from backend if they exist
        if (res.data.resources) {
          setResources({
            library: res.data.resources.library,
            syllabus: res.data.resources.syllabus,
            contactMentor: res.data.resources.contactMentor
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authId) fetchDashboard();
  }, [authId]);

  const handleMoodClick = async (mood: string) => {
    try {
      await api.post(`/student/dashboard/${authId}/mood`, { mood });
      setTodayMood(mood);
    } catch (error) {
      console.error("Failed to log mood", error);
    }
  };

  const handleThanksClick = async () => {
    if (!mentorNote?._id || reacted) return;
    try {
      setReacted(true);
      await api.post(`/student/dashboard/${authId}/mentor-note/${mentorNote._id}/thanks`);
    } catch (error) {
      console.error("Failed to thank mentor", error);
      setReacted(false);
    }
  };

  const openLink = (url: string) => window.open(url, "_blank");

  return (
    <main className="main-content">
      {/* HEADER */}
      <header className="top-header">
        <h1>{greeting}, {firstName} 👋</h1>
        <div className="header-actions">
          <button className={`dash-bell-btn${hasUnread ? " dash-bell-btn--alert" : ""}`} onClick={() => router.push("/student/noticeboard")}>
            <Bell size={19} />
            {hasUnread && <span className="dash-bell-badge">{unreadCount}</span>}
          </button>
          <button className="dash-avatar-btn" style={{ background: av.bg }} onClick={() => router.push("/student/profile")}>
            {customAvatarUrl ? (
              <Image src={customAvatarUrl} alt="Profile photo" width={42} height={42} className="dash-avatar-img" />
            ) : (
              <span>{av.emoji}</span>
            )}
          </button>
        </div>
      </header>

      {/* WELCOME / MOOD */}
      <section className="welcome-banner">
        <div className="welcome-text">
          <h2>{mockData.uiStrings.welcomeTitle}</h2>
          <p>{mockData.uiStrings.welcomeSub}</p>
        </div>
        <div className="mood-tracker">
          <button className="mood-btn" onClick={() => handleMoodClick("happy")}>
            <span className="emoji">😊</span><span className="label">{todayMood === "happy" ? "Logged!" : "Happy"}</span>
          </button>
          <button className="mood-btn" onClick={() => handleMoodClick("okay")}>
            <span className="emoji">😐</span><span className="label">{todayMood === "okay" ? "Logged!" : "Okay"}</span>
          </button>
          <button className="mood-btn help-btn" onClick={() => handleMoodClick("need_help")}>
            <span className="emoji">😨</span><span className="label">{todayMood === "need_help" ? "Logged!" : "Need Help"}</span>
          </button>
        </div>
      </section>

      {/* GRID */}
      <section className="dashboard-grid">
        <div className="card schedule-card">
          <h3>{mockData.uiStrings.scheduleTitle}</h3>
          <div className="schedule-list">
            {isLoading ? <p>{mockData.uiStrings.loading}</p> : schedule.map(s => (
              <div key={s._id} className="schedule-item">
                <div className="time">{s.startTime}</div>
                <div className="details">
                  <h4>{s.title}</h4>
                  <button className="btn-primary" onClick={() => s.joinLink && openLink(s.joinLink)}>
                    {s.joinLink ? mockData.uiStrings.joinSession : mockData.uiStrings.viewDetails}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ASSIGNMENTS */}
        <div className="card assignments-card">
          <h3>{mockData.uiStrings.assignmentsTitle}</h3>
          <div className="assignment-list">
             {assignments.length > 0 ? assignments.map(a => (
              <div key={a._id} className="assignment-item">
                <div className="assignment-header">
                  <span className={`status-dot dot-${a.priority || 'medium'}`} />
                  <h4>{a.title}</h4>
                </div>
                <span className="due-date">Due: {a.dueDate}</span>
              </div>
            )) : <p className="text-sm text-gray-400 mt-2">{mockData.uiStrings.allCaughtUp}</p>}
          </div>
        </div>

        {/* DYNAMIC RESOURCES */}
        <div className="card resources-card">
          <h3>{mockData.uiStrings.resourcesTitle}</h3>
          <div className="resource-buttons">
            <button className="resource-btn bg-library" disabled={!resources.library || resources.library === "#"} onClick={() => resources.library && resources.library !== "#" && openLink(resources.library)}>{mockData.uiStrings.resourceLibrary}</button>
            <button className="resource-btn bg-syllabus" disabled={!resources.syllabus || resources.syllabus === "#"} onClick={() => resources.syllabus && resources.syllabus !== "#" && openLink(resources.syllabus)}>{mockData.uiStrings.resourceSyllabus}</button>
            <button className="resource-btn bg-mentor" disabled={!resources.contactMentor || resources.contactMentor === "#"} onClick={() => resources.contactMentor && resources.contactMentor !== "#" && openLink(resources.contactMentor)}>{mockData.uiStrings.resourceContact}</button>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION */}
      <section className="connection-section mt-8">
        {mentorNote && (
          <div className="card mentor-note-card">
            <div className="card-header">
              <div className="mentor-info">
                <div className="mentor-avatar">
                  <img src={mentorNote.avatarUrl} alt="Mentor" />
                </div>
                <div>
                  <h3>{mockData.uiStrings.mentorNoteTitle}{mentorNote.mentorName}</h3>
                  <span className="mentor-role-label">{mentorNote.role}</span>
                </div>
              </div>
            </div>
            <div className="mentor-message">
              <p>"{mentorNote.message}"</p>
            </div>
            <div className="mentor-actions">
              <button className={`btn-react${reacted ? " btn-react--active" : ""}`} onClick={handleThanksClick} disabled={reacted}>
                {reacted ? "❤️" : "🤍"}
              </button>
              <button className="btn-reply" onClick={handleThanksClick}>{reacted ? mockData.uiStrings.thanked : mockData.uiStrings.sayThanks}</button>
            </div>
          </div>
        )}

        <div className="card mindful-card">
          <div className="mindful-header"><h3>{mockData.uiStrings.dailyInspirationTitle}</h3></div>
          <div className="mindful-body"><p>"{INSPIRATIONAL_QUOTES[quoteIndex].quote}"</p></div>
          <div className="mindful-footer"><p>{INSPIRATIONAL_QUOTES[quoteIndex].footer}</p></div>
        </div>
      </section>
    </main>
  );
}
