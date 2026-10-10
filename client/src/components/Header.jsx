import React from 'react';
import {useState} from 'react';
import {Link,NavLink} from 'react-router-dom';
import {Menu,Radio,X} from 'lucide-react';
import Brand from './Brand.jsx';
export default function Header(){const[open,setOpen]=useState(false);const close=()=>setOpen(false);return <><div className="announcement">✦ A peaceful digital home for Gurbani books and live radio <span>FREE TO EXPLORE</span></div><header className="navbar"><div className="nav-inner"><Brand/><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button><nav className={open?'nav-links open':'nav-links'}><NavLink to="/" end onClick={close}>Home</NavLink><NavLink to="/books" onClick={close}>Books</NavLink><NavLink to="/radio" onClick={close}>Live Radio</NavLink><NavLink to="/about" onClick={close}>About</NavLink><Link className="nav-cta" to="/radio" onClick={close}><Radio size={15}/> Listen now</Link></nav></div></header></>}
