"use client";

import { useRef, useState } from "react";

function timestamp(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
}

export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
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
    <section className="music-player" aria-label="Christmas music player">
      <div className="window-title">
        <span aria-hidden="true">♫</span> Christmas Media Player
      </div>
      <div className="music-player-body">
        <div className="music-display">
          <span className="music-disc" aria-hidden="true">
            💿
          </span>
          <div>
            <strong>Last Christmas</strong>
            <span>Wham!</span>
          </div>
          <span className="music-time">{timestamp(elapsed)}</span>
        </div>
        <div className="music-controls">
          <button
            className="music-play"
            type="button"
            onClick={toggle}
            disabled={loading}
            aria-label={
              playing ? "Pause Last Christmas" : "Play Last Christmas"
            }
          >
            <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>{" "}
            {loading ? "Loading…" : playing ? "Pause" : "Play"}
          </button>
          <span className="music-status" role="status">
            {playing ? "Now playing" : elapsed > 0 ? "Paused" : "Ready to play"}
          </span>
          <span className="music-duration">
            {duration > 0 ? timestamp(duration) : "MP3"}
          </span>
        </div>
        {error && (
          <p className="music-error" role="alert">
            {error}
          </p>
        )}
      </div>
      <audio
        ref={audio}
        src="/audio/last-christmas.mp3"
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setElapsed(0);
        }}
        onTimeUpdate={() => setElapsed(audio.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audio.current?.duration ?? 0)}
        onError={() => {
          setPlaying(false);
          setLoading(false);
          setError("Couldn’t load the track. Please try again.");
        }}
      />
    </section>
  );
}
