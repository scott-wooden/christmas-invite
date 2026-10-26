import { event } from "@/config/event";
import { RsvpForm } from "@/components/rsvp-form";
import { DesktopShell } from "@/components/desktop-shell";

export const dynamic = "force-dynamic";

function WindowTitle({
  children,
  icon = "📄",
}: {
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <div className="window-title">
      <span aria-hidden="true">{icon}</span>
      <span>{children}</span>
      <span className="window-grip" aria-hidden="true">
        ▥
      </span>
    </div>
  );
}

export default function Home() {
  const acceptingRsvps = Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY,
  );
  return (
    <DesktopShell wallpaper={event.backgroundImage}>
      <main id="top" className="browser-window">
        <a className="skip-link" href="#rsvp">
          Skip to RSVP
        </a>
        <div className="browser-title">
          <span aria-hidden="true">🌐</span>
          <span>{event.title} — your festive corner of the internet</span>
          <span className="connected">
            <i /> ONLINE
          </span>
        </div>
        <nav className="browser-menu" aria-label="Invitation navigation">
          <a href="#top">Home</a>
          <a href="#details">Party details</a>
          <a href="#rsvp">RSVP</a>
          <span>Made with Christmas spirit ♥</span>
        </nav>
        <div className="address-bar">
          <span>Address</span>
          <div>
            <span aria-hidden="true">🎄</span> christmas://the-best-night-ever
          </div>
          <a href="#rsvp">
            Go <span aria-hidden="true">➜</span>
          </a>
        </div>
        <div className="page-content">
          <header className="party-banner">
            <div className="fairy-lights" aria-hidden="true">
              {Array.from({ length: 24 }, (_, i) => (
                <i key={i} style={{ "--bulb": i } as React.CSSProperties} />
              ))}
            </div>
            <p className="welcome-line">
              ★ WELCOME TO OUR LITTLE CORNER OF THE INTERNET ★
            </p>
            <div className="banner-heading">
              <span className="pixel-tree" aria-hidden="true">
                🎄
              </span>
              <h1>{event.title}</h1>
              <span className="pixel-tree second-tree" aria-hidden="true">
                🎄
              </span>
            </div>
            <p className="banner-tagline">
              All I want for Christmas is… a proper 90’s party.
            </p>
            <div className="ticker">
              <span>
                ✦ You’re invited! ✦ {event.venue}, {event.city} ✦ Dress code:{" "}
                {event.dressCode} ✦ Let’s party like it’s 1999! ✦
              </span>
            </div>
          </header>
          <div className="homepage-grid">
            <aside className="profile-column">
              <section className="profile-card" aria-labelledby="profile-title">
                <h2 id="profile-title">{event.title}</h2>
                <p className="profile-quote">
                  “Back when the lights were multicoloured
                  <br />
                  and the tinsel was non-negotiable.”
                </p>
                <div className="photo-frame">
                  <img
                    src={event.backgroundImage}
                    alt="A cosy Christmas living room with a tree full of ornaments, presents, and a glowing fireplace"
                    width={1200}
                    height={1200}
                  />
                  <span>the original Christmas aesthetic.</span>
                </div>
                <p className="online-status">
                  <i /> Feeling festive
                </p>
                <dl className="profile-facts">
                  <div>
                    <dt>Location:</dt>
                    <dd>{event.city}, UK</dd>
                  </div>
                  <div>
                    <dt>Here for:</dt>
                    <dd>Good times & mince pies</dd>
                  </div>
                  <div>
                    <dt>Dress code:</dt>
                    <dd>{event.dressCode}</dd>
                  </div>
                </dl>
                <a className="profile-link" href="#rsvp">
                  [ add yourself to the guest list ]
                </a>
              </section>
              <section
                className="mini-window"
                aria-labelledby="essentials-title"
              >
                <WindowTitle icon="💿">christmas_essentials.txt</WindowTitle>
                <div className="mini-content">
                  <h2 id="essentials-title">The festive starter pack</h2>
                  <div className="top-friends">
                    <div>
                      <span aria-hidden="true">📼</span>
                      <p>Home Alone</p>
                    </div>
                    <div>
                      <span aria-hidden="true">🧶</span>
                      <p>Bad jumpers</p>
                    </div>
                    <div>
                      <span aria-hidden="true">🍬</span>
                      <p>Quality Street</p>
                    </div>
                    <div>
                      <span aria-hidden="true">🎶</span>
                      <p>90’s classics</p>
                    </div>
                  </div>
                </div>
              </section>
              <div className="web-badges" aria-label="Festive badges">
                <span>
                  100%
                  <br />
                  <b>CHRISTMAS</b>
                </span>
                <span>
                  BEST VIEWED
                  <br />
                  <b>WITH FRIENDS</b>
                </span>
                <span>
                  ♥ MADE IN
                  <br />
                  <b>THE 90s</b>
                </span>
              </div>
              <p className="sidebar-note">
                No dial-up required.
                <br />
                Just bring your Christmas spirit.
              </p>
            </aside>
            <div className="main-column">
              <section className="about-box" aria-labelledby="about-title">
                <h2 id="about-title">About this party</h2>
                <div>
                  <h3>
                    You’ve got an invitation! <span aria-hidden="true">✉</span>
                  </h3>
                  {event.about.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <a className="retro-button invite-button" href="#rsvp">
                    Count me in! <span aria-hidden="true">➜</span>
                  </a>
                </div>
              </section>
              <section
                className="mini-window details-window"
                id="details"
                aria-labelledby="details-title"
              >
                <WindowTitle>party_details.txt — Notepad</WindowTitle>
                <div className="notepad-menu" aria-hidden="true">
                  The important stuff
                </div>
                <div className="notepad-content">
                  <h2 id="details-title">
                    SAVE THE DATE <span aria-hidden="true">*</span>
                  </h2>
                  <dl>
                    <div>
                      <dt>WHEN</dt>
                      <dd>
                        {event.date}
                        <small>{event.time}</small>
                      </dd>
                    </div>
                    <div>
                      <dt>WHERE</dt>
                      <dd>
                        {event.venue}
                        <small>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.address}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${event.address} — open in Google Maps (new tab)`}
                          >
                            {event.address}
                          </a>
                        </small>
                      </dd>
                    </div>
                    <div>
                      <dt>WEAR</dt>
                      <dd>
                        {event.dressCode}
                        <small>{event.note}</small>
                      </dd>
                    </div>
                  </dl>
                  <p className="notepad-foot">
                    * Good company. Questionable jumpers. Excellent memories.
                  </p>
                </div>
              </section>
              <section
                className="mini-window rsvp-window"
                id="rsvp"
                aria-label="RSVP"
              >
                <WindowTitle icon="✉️">RSVP — You’re on the list?</WindowTitle>
                <RsvpForm acceptingRsvps={acceptingRsvps} />
              </section>
            </div>
          </div>
          <footer className="page-footer">
            <p>★ Thanks for stopping by. See you under the mistletoe! ★</p>
            <a href="#top">Back to top ↑</a>
            <span className="footer-stamp">KEEP THE 90s ALIVE</span>
          </footer>
        </div>
        <div className="browser-status">
          <span>✓ Done</span>
          <span>♥ Christmas zone</span>
        </div>
      </main>
    </DesktopShell>
  );
}
