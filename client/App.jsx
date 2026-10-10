import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, AudioLines, BookOpen, CheckCircle2, ChevronRight,
  Headphones, Menu, Pause, Play, Radio, Search, ShieldCheck, Sparkles,
  Volume2, X, BookMarked, Clock3
} from 'lucide-react';
import './App.css';

const stations = [
  {
    id: 'harmandir',
    name: 'Sri Harmandir Sahib',
    subtitle: 'Golden Temple · Live Gurbani',
    url: 'https://live.sgpc.net:8442/;nocache=889869',
  },
  {
    id: 'dodra',
    name: 'Brahm Bunga Dodra',
    subtitle: 'Dodra Radio',
    url: 'https://usa15.fastcast4u.com/proxy/radiobreaker?mp=/1',
  },
  {
    id: 'nanaklove',
    name: 'NanakLove Radio',
    subtitle: 'Radio stream',
    url: 'https://usa3.fastcast4u.com/proxy/radiododra2?mp=/1',
  },
];

const featuredBooks = [
  { title: 'Gurbani Literature', category: 'GURBANI', description: 'Explore books that support learning and reflection.', symbol: 'ੴ' },
  { title: 'Sikh History & Heritage', category: 'SIKH HISTORY', description: 'Discover stories, history and heritage of the Sikh Panth.', symbol: '☬' },
  { title: 'Gurmat & Spiritual Learning', category: 'GURMAT', description: 'Browse resources for a deeper understanding of Gurmat.', symbol: 'ਸਤਿ' },
];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="NanakLove homepage">
      <span className="brand-mark">☬</span>
      <span className="brand-copy">
        <strong>NanakLove</strong>
        <small>GURBANI · BOOKS · RADIO</small>
      </span>
    </a>
  );
}

function RadioPlayer() {
  const audioRef = useRef(null);
  const [selected, setSelected] = useState(stations[0]);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  async function chooseStation(station) {
    const audio = audioRef.current;
    const shouldResume = Boolean(audio && !audio.paused);
    if (audio) {
      audio.pause();
      audio.src = station.url;
      audio.load();
    }
    setSelected(station);
    setPlaying(false);
    setError('');
    if (shouldResume && audio) {
      try {
        await audio.play();
      } catch {
        setError('This station could not start. Try pressing Play again.');
      }
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      setError('');
      await audio.play();
    } catch {
      setPlaying(false);
      setError('Could not start this stream. The station may be offline or may not support browser playback.');
    }
  }

  return (
    <div className="radio-player">
      <audio
        ref={audioRef}
        src={selected.url}
        preload="none"
        onPlaying={() => { setPlaying(true); setError(''); }}
        onPause={() => setPlaying(false)}
        onError={() => { setPlaying(false); setError('Stream could not load. Check the stream URL or try another station.'); }}
      />
      <div className="player-topline">
        <span className="live-dot" />
        <span>{playing ? 'LIVE · PLAYING NOW' : 'GURBANI RADIO'}</span>
        <span className="player-free">FREE LISTENING</span>
      </div>
      <div className="player-current">
        <div className="player-art"><AudioLines size={30} /></div>
        <div className="player-current-copy">
          <small>SELECTED STATION</small>
          <h3>{selected.name}</h3>
          <p>{selected.subtitle}</p>
        </div>
        <button className="play-button" onClick={togglePlayback} aria-label={playing ? 'Pause radio' : 'Play radio'}>
          {playing ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
        </button>
      </div>
      <div className="player-progress"><span className={playing ? 'progress-moving' : ''} /></div>
      <div className="player-bottom">
        <span><Headphones size={14} /> Listen in your browser</span>
        <label className="volume-slider" aria-label="Volume">
          <Volume2 size={15} />
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
        </label>
      </div>
      {error && <p className="player-error" role="alert">{error}</p>}
      <div className="station-picker">
        <span className="station-picker-label">CHOOSE A STATION</span>
        {stations.map((station, index) => (
          <button
            key={station.id}
            className={`station-option ${selected.id === station.id ? 'is-selected' : ''}`}
            onClick={() => chooseStation(station)}
          >
            <span className="station-number">0{index + 1}</span>
            <span className="station-option-copy"><strong>{station.name}</strong><small>{station.subtitle}</small></span>
            {selected.id === station.id ? <AudioLines size={17} /> : <ChevronRight size={16} />}
          </button>
        ))}
      </div>
      <p className="stream-note">Stream availability depends on the broadcaster and your internet connection.</p>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  function submitSearch(event) {
    event.preventDefault();
    document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' });
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <div className="announcement"><Sparkles size={13} /> A peaceful digital home for Gurbani literature and live radio <span>·</span> Free to explore</div>
      <header className="navbar">
        <div className="nav-inner">
          <Brand />
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <a className="active" href="#home" onClick={closeMenu}>Home</a>
            <a href="#library" onClick={closeMenu}>Books</a>
            <a href="#radio" onClick={closeMenu}>Live Radio</a>
            <a href="#about" onClick={closeMenu}>Our Purpose</a>
            <a className="nav-cta" href="#radio" onClick={closeMenu}><Radio size={15} /> Listen now</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-image" />
          <div className="hero-shade" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow"><span /> YOUR DIGITAL GURBANI SPACE</div>
              <h1>Read with devotion.<br /><em>Listen with peace.</em></h1>
              <p className="hero-description">Discover Gurbani-related books and listen to live devotional radio in one calm, welcoming place.</p>
              <form className="hero-search" onSubmit={submitSearch}>
                <Search size={18} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Explore Gurbani books…" aria-label="Search books" />
                <button type="submit" aria-label="Search books"><ArrowRight size={18} /></button>
              </form>
              <div className="hero-actions">
                <a className="button button-gold" href="#library"><BookOpen size={17} /> Explore the library</a>
                <a className="button button-glass" href="#radio"><Headphones size={17} /> Listen to radio</a>
              </div>
              <div className="hero-trust"><ShieldCheck size={15} /> Free access <span /> Made for learning and reflection</div>
            </div>
            <div className="hero-side-note"><span className="side-line" /> GURBANI · SIMRAN · SANGAT</div>
            <div className="hero-scroll"><span /> SCROLL TO EXPLORE</div>
          </div>
        </section>

        <section className="quick-benefits wrap" aria-label="NanakLove features">
          <div className="benefit"><span className="benefit-icon"><BookOpen size={21} /></span><div><strong>Gurbani library</strong><small>Explore a growing collection</small></div></div>
          <div className="benefit"><span className="benefit-icon"><Radio size={21} /></span><div><strong>Live radio</strong><small>Listen to selected stations</small></div></div>
          <div className="benefit"><span className="benefit-icon"><ShieldCheck size={21} /></span><div><strong>Free to explore</strong><small>Open access to the catalogue</small></div></div>
        </section>

        <section className="section wrap library-section" id="library">
          <div className="section-heading">
            <div><div className="eyebrow">DISCOVER THE COLLECTION</div><h2>A library for the <em>journey within.</em></h2><p>Browse Gurbani literature, Sikh history and spiritual learning resources.</p></div>
            <span className="section-index">01 <i /> LIBRARY</span>
          </div>
          <div className="collection-grid">
            {featuredBooks.map((book, i) => (
              <article className={`collection-card collection-${i + 1}`} key={book.title}>
                <div className="collection-art"><span>{book.symbol}</span><div className="art-ring" /><small>NANAKLOVE LIBRARY</small></div>
                <div className="collection-info"><span className="collection-category">{book.category}</span><h3>{book.title}</h3><p>{book.description}</p><a href="#about">Explore collection <ArrowRight size={15} /></a></div>
              </article>
            ))}
          </div>
          <div className="library-note"><BookMarked size={18} /><p><strong>Your 150 physical books, brought online.</strong><br />We’ll build the catalogue from your real book titles and cover photos. Full online reading can be added when authorized digital content is available.</p></div>
        </section>

        <section className="radio-feature" id="radio">
          <div className="radio-backdrop" />
          <div className="wrap radio-feature-inner">
            <div className="radio-intro">
              <div className="eyebrow"><span /> LISTEN · REFLECT · RECONNECT</div>
              <h2>Let Gurbani<br /><em>accompany your day.</em></h2>
              <p>Choose a station and listen directly from your browser. Your peaceful listening space is always just a click away.</p>
              <div className="radio-points"><span><CheckCircle2 size={16} /> Three station options</span><span><CheckCircle2 size={16} /> Browser audio controls</span><span><CheckCircle2 size={16} /> Free listening</span></div>
            </div>
            <RadioPlayer />
          </div>
        </section>

        <section className="purpose-section wrap" id="about">
          <div className="purpose-symbol">ੴ</div>
          <div className="purpose-copy"><div className="eyebrow">THE NANAKLOVE PURPOSE</div><h2>A little more space<br />for <em>what matters.</em></h2><p>NanakLove is being created as a thoughtful digital home for Gurbani-related books and live devotional radio — designed to feel calm, clear and welcoming on every device.</p><a href="#home" className="text-link">Back to the beginning <ArrowRight size={16} /></a></div>
          <div className="purpose-quote"><span>“</span><p>Make space for learning.<br />Make space for listening.<br />Make space for peace.</p><small>THE NANAKLOVE VISION</small></div>
        </section>

        <section className="closing-cta"><div className="wrap closing-inner"><div><div className="eyebrow">YOUR JOURNEY STARTS HERE</div><h2>Read a little. Listen a little.<br /><em>Carry peace with you.</em></h2></div><div className="closing-actions"><a href="#library" className="button button-gold"><BookOpen size={17} /> Explore books</a><a href="#radio" className="button button-glass"><Radio size={17} /> Listen live</a></div></div></section>
      </main>

      <footer className="footer">
        <div className="wrap footer-main"><Brand /><p>A digital space for Gurbani literature and peaceful listening.</p><div className="footer-links"><a href="#home">Home</a><a href="#library">Books</a><a href="#radio">Live Radio</a><a href="#about">About</a></div></div>
        <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} NanakLove. Built with care.</span><span><ShieldCheck size={13} /> Free access · Peaceful by design</span></div>
      </footer>
    </div>
  );
}
