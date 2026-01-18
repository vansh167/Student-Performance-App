import React from "react";
import {
  BookOpen,
  Pen,
  Heart,
  Users,
  Mail,
  Twitter,
  Github,
  Linkedin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import "../Styling/About.css";

export default function About() {
  return (
    <div className="aboutPage">
      {/* HERO */}
      <section className="aboutHero">
        <div className="heroBlur heroBlur1" />
        <div className="heroBlur heroBlur2" />

        <div className="heroInner">
          <div className="heroIcon">
            <BookOpen size={52} />
          </div>

          <h1 className="heroTitle">
            About <span>Student Performance</span>
          </h1>

          <p className="heroSubtitle">
            A modern dashboard-based system to predict performance, track students,
            and generate smart recommendations.
          </p>

          <div className="heroCTA">
            <button className="heroBtn primaryBtn">
              <Sparkles size={18} />
              Explore Features
              <ArrowRight size={18} />
            </button>

            <button className="heroBtn ghostBtn">
              <Users size={18} />
              Our Team
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="aboutContent">
        {/* Mission */}
        <section className="aboutCard fadeUp">
          <div className="cardHead">
            <div className="cardIcon red">
              <Heart size={18} />
            </div>
            <h2>Our Mission</h2>
          </div>

          <p>
            We believe student improvement is possible with the right tracking,
            data insights, and consistency. This system helps educators and
            learners measure performance & take action with smart recommendations.
          </p>
        </section>

        {/* Features */}
        <section className="aboutCard fadeUp delay1">
          <div className="cardHead">
            <div className="cardIcon blue">
              <Pen size={18} />
            </div>
            <h2>What This App Includes</h2>
          </div>

          <div className="featureGrid">
            {[
              { title: "Student Prediction", desc: "Predict score & category instantly." },
              { title: "Record Management", desc: "Save, Edit, Delete student records." },
              { title: "Recommendations", desc: "AI-like actionable suggestions." },
              { title: "Export CSV/PDF", desc: "Download student reports anytime." },
              { title: "Light/Dark Mode", desc: "Modern theme switch UI." },
              { title: "Profile Page", desc: "View complete student profile." },
            ].map((f, i) => (
              <div key={i} className="featureBox">
                <b>{f.title}</b>
                <span>{f.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="aboutCard fadeUp delay2">
          <h2 className="storyTitle">Our Story</h2>
          <div className="storyText">
            <p>
              This project started as a smart dashboard idea for predicting student
              outcomes based on attendance, sleep, study time, and past performance.
            </p>
            <p>
              Today, it is a complete modern application with analytics charts,
              recommendations, exporting reports, and profile views.
            </p>
          </div>
        </section>

        {/* Team Stats */}
        <section className="aboutCard fadeUp delay3">
          <div className="cardHead">
            <div className="cardIcon purple">
              <Users size={18} />
            </div>
            <h2>Team & Community</h2>
          </div>

          <div className="statsRow">
            <div className="statBox">
              <b>1</b>
              <span>Developer</span>
            </div>
            <div className="statBox">
              <b>10+</b>
              <span>Features Added</span>
            </div>
            <div className="statBox">
              <b>100%</b>
              <span>Modern UI</span>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="contactCard fadeUp delay4">
          <h2>Get in Touch</h2>
          <p>
            Want to contribute, report a bug, or request a new feature? Let’s connect!
          </p>

          <div className="socialRow">
            <a className="socialBtn" href="mailto:someone@gmail.com">
              <Mail size={18} /> Email
            </a>
            <a className="socialBtn" href="https://x.com/?lang=en" target="_blank" rel="noreferrer">
              <Twitter size={18} /> Twitter
            </a>
            <a className="socialBtn" href="https://github.com/" target="_blank" rel="noreferrer">
              <Github size={18} /> GitHub
            </a>
            <a className="socialBtn" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              <Linkedin size={18} /> LinkedIn
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
