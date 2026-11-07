"use client";

import { useRef, useState } from "react";

export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) {
      player.pause();
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (player.error) player.load();
      await player.play();
    } catch {
      setError("Couldn’t play the track. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="taskbar-music" aria-label="Christmas music player">
      <button
        className="music-play"
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-label={playing ? "Pause Last Christmas" : "Play Last Christmas"}
        title={playing ? "Pause Last Christmas" : "Play Last Christmas"}
      >
        <span aria-hidden="true">{loading ? "…" : playing ? "Ⅱ" : "▶"}</span>
      </button>
      <span className="music-label">
        <strong>Last Christmas</strong>
        <span>Wham! · {playing ? "Playing" : "Paused"}</span>
      </span>
      {error && (
        <p className="music-error" role="alert">
          {error}
        </p>
      )}
      <audio
        ref={audio}
        src="/audio/last-christmas.mp3"
        autoPlay
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setLoading(false);
          setError("Couldn’t load the track. Please try again.");
        }}
      />
    </section>
  );
}
