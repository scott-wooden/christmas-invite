"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

export function DesktopShell({
  children,
  wallpaper,
}: {
  children: ReactNode;
  wallpaper: string;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <div
      className="desktop"
      data-paused={paused}
      style={{ "--wallpaper": `url("${wallpaper}")` } as CSSProperties}
    >
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
      {children}
      <nav className="taskbar" aria-label="Desktop navigation">
        <a className="start-button" href="#top">
          <span aria-hidden="true">🎄</span> start
        </a>
        <a className="task-tab" href="#top">
          ✳ A 90’s Christmas
        </a>
        <button
          className="motion-toggle"
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? "▶ Resume sparkles" : "Ⅱ Pause sparkles"}
        </button>
        <span className="tray">♥ GOOD TIMES</span>
      </nav>
    </div>
  );
}
