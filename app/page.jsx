'use client';
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export default function Page() {
  const scrollRef = useRef(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    };
    fetchReports();

    let startX = 0;
    const handleTouchStart = (e) => startX = e.touches[0].clientX;
    const handleTouchEnd = (e) => {
      const deltaX = startX - e.changedTouches[0].clientX;
      const scrollAmount = window.innerWidth;
      if (deltaX > 50) scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      else if (deltaX < -50) scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    };

    const container = scrollRef.current;
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const scroll = (direction) => {
    const amount = window.innerWidth;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => scroll('left')} style={arrowStyle('left',180)} aria-label="Scroll Left"><span style={{ lineHeight: 1 }}>➪</span></button>
      <button onClick={() => scroll('right')} style={arrowStyle('right',0)} aria-label="Scroll Right"><span style={{ lineHeight: 1 }}>➪</span></button>

      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'scroll',
          height: '100vh',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch', 
        }}
      >
        {/* Section 1: Welcome */}
        <section style={sectionStyle("#eee")}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src="/thumbnail.jpg"
              alt="Parallax"
              layout="fill"
              objectFit="cover"
              priority
              style={{ filter: 'brightness(0.7)' }} // darken image for text contrast
            />
          </div>
          <div style={welcomeTextStyle}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome to My Power BI Showcase!</h1>
            <p style={pStyle}>Discover interactive dashboards that turn data into clear, actionable insights. Explore real examples of how Power BI can help make smarter business decisions.</p>
            <p style={pStyle}>👉 Browse the dashboards, interact with the visuals, and get inspired by the possibilities.</p>
          </div>
        </section>

        {/* Dynamic Power BI Sections */}
        {reports.map((report, index) => (
          <section key={report.id} style={sectionStyle(index % 2 === 0 ? "#f2f2f2" : "#ddd")}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem', textAlign: 'center' }}>{report.title}</h2>
            <iframe
              src={report.url}
              style={iframeStyle}
              loading="lazy"
              title={report.title}
            />
          </section>
        ))}
      </div>
    </div>
  );
}

// Styling helpers
const sectionStyle = (bg) => ({
  minWidth: '100vw',
  height: '100vh',
  scrollSnapAlign: 'start',
  position: 'relative',
  backgroundColor: bg,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  // padding: '1rem 1.5rem',
  boxSizing: 'border-box',
});

const arrowStyle = (position, degree) => ({
  position: 'fixed',
  top: '50%',
  [position]: '20px',
  zIndex: 10,
  fontSize: '2.5rem',
  background: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '45px',
  height: '45px',
  cursor: 'pointer',
  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  transform: `translateY(-50%) rotate(${degree}deg)`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  userSelect: 'none',
});


const pStyle = {
  maxWidth: '90vw',
  color: '#333',
  fontSize: '1.1rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
  lineHeight: 1.4,
};

const welcomeTextStyle = {
  position: 'absolute',
  top: '10%',
  left: '8%',
  right: '5%',
  color: '#003366',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '600px',
  padding: '1rem',
  backgroundColor: 'rgba(255,255,255,0.85)',
  borderRadius: '8px',
  boxShadow: '0 0 15px rgba(0,0,0,0.2)',
};

const iframeStyle = {
  width: '90vw', 
  maxWidth: '1100px',
  height: '90vh',
  border: 'none',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};
