import React from 'react';
import {Link} from 'react-router-dom';
import Brand from './Brand.jsx';
import {ShieldCheck} from 'lucide-react';
export default function Footer(){return <footer className="footer"><div className="wrap footer-main"><Brand/><p>A thoughtful digital space for Gurbani-related physical books and peaceful listening.</p><div className="footer-links"><Link to="/">Home</Link><Link to="/books">Books</Link><Link to="/radio">Live Radio</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} NanakLove. Built with care.</span><span><ShieldCheck size={13}/> Free access · Peaceful by design</span></div></footer>}
