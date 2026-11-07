"use client";

import { useRef, useState, type ReactNode } from "react";
import { MusicPlayer } from "./music-player";

export function DesktopShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const [paused, setPaused] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const taskButton = useRef<HTMLButtonElement>(null);
  const minimiseButton = useRef<HTMLButtonElement>(null);
  const savedScroll = useRef(0);

  function minimise() {
    savedScroll.current = window.scrollY;
    setMinimised(true);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      taskButton.current?.focus();
    });
  }

  function restore() {
    setMinimised(false);
    requestAnimationFrame(() => {
      minimiseButton.current?.focus({ preventScroll: true });
      window.scrollTo({ top: savedScroll.current, behavior: "instant" });
    });
  }

  return (
    <div className="desktop" data-paused={paused} data-minimised={minimised}>
      <div className="gif-wallpaper" aria-hidden="true" />
      {!minimised && (
        <>
          <div className="desktop-sparkles" aria-hidden="true" />
          <div className="desktop-shortcuts" aria-label="Party shortcuts">
            <a href="#top">
              <span aria-hidden="true">🖥️</span>My Christmas
            </a>
            <a href="#details">
              <span aria-hidden="true">📁</span>Party details
            </a>
            <a href="#rsvp">
              <span aria-hidden="true">✉️</span>RSVP
            </a>
          </div>
        </>
      )}
      <main id="top" className="browser-window" hidden={minimised}>
        <div className="browser-title">
          <span aria-hidden="true">🌐</span>
          <span>{title} — your festive corner of the internet</span>
          <button
            ref={minimiseButton}
            className="minimise-button"
            type="button"
            onClick={minimise}
            aria-label="Minimise invitation to see the desktop"
            title="Minimise invitation"
          >
            <span aria-hidden="true">−</span>
          </button>
        </div>
        {children}
      </main>
      <nav className="taskbar" aria-label="Desktop navigation">
        <button
          className="start-button"
          type="button"
          onClick={() => {
            savedScroll.current = 0;
            restore();
          }}
        >
          <span aria-hidden="true">🎄</span> start
        </button>
        <button
          ref={taskButton}
          className="task-tab"
          type="button"
          onClick={restore}
          aria-expanded={!minimised}
          aria-controls="top"
        >
          ✳ {title}
        </button>
        <button
          className="motion-toggle"
          type="button"
          aria-pressed={paused}
          aria-label={paused ? "Resume sparkles" : "Pause sparkles"}
          onClick={() => setPaused(!paused)}
        >
          <span className="motion-label">
            {paused ? "▶ Resume sparkles" : "Ⅱ Pause sparkles"}
          </span>
          <span className="motion-icon" aria-hidden="true">
            ✦
          </span>
        </button>
        <MusicPlayer />
      </nav>
    </div>
  );
}
