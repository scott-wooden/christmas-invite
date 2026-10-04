import { event } from "@/config/event";
import { RsvpForm } from "@/components/rsvp-form";

export const dynamic = "force-dynamic";

export default function Home() {
  const acceptingRsvps = Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY,
  );
  return (
    <main id="top">
      <a className="skip-link" href="#rsvp">
        Skip to RSVP
      </a>
      <section
        className="hero"
        style={{ backgroundImage: `url("${event.backgroundImage}")` }}
        aria-labelledby="party-title"
      >
        <nav className="nav wrap" aria-label="Main navigation">
          <a className="wordmark" href="#top">
            <span aria-hidden="true">✳</span> THE CHRISTMAS EDIT
          </a>
          <a className="nav-link" href="#rsvp">
            Count me in <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <div className="hero-content wrap">
          <p className="eyebrow">
            <span className="little-line" />
            {event.eyebrow}
          </p>
          <h1 id="party-title">{event.title}</h1>
          <p className="hero-description">{event.description}</p>
          <a className="button hero-button" href="#rsvp">
            Let’s make it merry <span aria-hidden="true">↗</span>
          </a>
          <p className="hero-location">
            <span aria-hidden="true">✦</span>
            {event.venue.toUpperCase()} · {event.city.toUpperCase()}
          </p>
        </div>
        <div className="retro-stamp" aria-hidden="true">
          <span>BE KIND</span>
          <strong>REWIND</strong>
          <span>CHRISTMAS, REMIXED</span>
        </div>
        <div className="hero-bottom wrap">
          <span>A NIGHT FOR THE MEMORY BANK</span>
          <a href="#details">
            The good stuff <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <section
        className="details wrap"
        id="details"
        aria-labelledby="details-title"
      >
        <div className="section-intro">
          <p className="eyebrow">SAVE THE EVENING</p>
          <h2 id="details-title">Oh, what a night.</h2>
          <p>A festive get-together with a throwback twist.</p>
        </div>
        <div className="detail-grid">
          <article>
            <span className="detail-number">01 / WHEN</span>
            <h3>{event.date}</h3>
            <p>{event.time}</p>
          </article>
          <article>
            <span className="detail-number">02 / WHERE</span>
            <h3>{event.venue}</h3>
            <p>{event.address}</p>
          </article>
          <article>
            <span className="detail-number">03 / THE LOOK</span>
            <h3>{event.dressCode}</h3>
            <p>{event.note}</p>
          </article>
        </div>
      </section>
      <section
        className="rsvp-section wrap"
        id="rsvp"
        aria-labelledby="rsvp-title"
      >
        <div className="rsvp-intro">
          <p className="eyebrow">YOU MAKE THE PARTY</p>
          <h2 id="rsvp-title">
            Same crew.
            <br />
            <em>New memories.</em>
          </h2>
          <p>
            Coming along? Bringing someone? Staying the night? Let us know
            below.
          </p>
          <div className="rsvp-note">
            <span aria-hidden="true">✳</span>
            <p>
              {event.rsvpDeadline}.<br />
              We’d love to have you there.
            </p>
          </div>
          <span className="handwritten" aria-hidden="true">
            See you under the mistletoe! ↗
          </span>
        </div>
        <RsvpForm acceptingRsvps={acceptingRsvps} />
      </section>
      <footer className="footer wrap">
        <a className="wordmark" href="#top">
          <span aria-hidden="true">✳</span> {event.title.toUpperCase()}
        </a>
        <p>A little nostalgia. A lot of good company.</p>
        <a href="#top">Back to the top ↑</a>
      </footer>
    </main>
  );
}
