import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, LogOut, Plus, Radio, RefreshCw, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { api } from '../api.js';
import './admin.css';

const emptyBook = { title: '', author: '', category: 'gurbani', language: 'Punjabi', pages: '', description: '', cover_url: '', featured: false };
const emptyStation = { name: '', subtitle: '', location: '', stream_url: '', enabled: true, sort_order: 1 };

export default function Admin() {
  const [key, setKey] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [stations, setStations] = useState([]);
  const [bookForm, setBookForm] = useState(emptyBook);
  const [stationForm, setStationForm] = useState(emptyStation);
  const [editingBook, setEditingBook] = useState(null);
  const [editingStation, setEditingStation] = useState(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!key) return;
    setBusy(true); setNotice('');
    try {
      const [b, r] = await Promise.all([api.getBooks(), api.getAllRadio(key)]);
      setBooks(b.data || []); setStations(r.data || []); setUnlocked(true);
    } catch (e) { setUnlocked(false); setNotice(e.message || 'Could not load admin data. Check your API key and Supabase setup.'); }
    finally { setBusy(false); }
  }
  useEffect(() => { if (unlocked) refresh(); /* refresh is user-triggered after unlocking */ }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function submitBook(e) {
    e.preventDefault(); setBusy(true); setNotice('');
    const payload = { ...bookForm, pages: bookForm.pages ? Number(bookForm.pages) : null };
    try {
      if (editingBook) await api.updateBook(editingBook, payload, key); else await api.createBook(payload, key);
      setBookForm(emptyBook); setEditingBook(null); await refresh(); setNotice('Book saved successfully.');
    } catch (err) { setNotice(err.message || 'Could not save book.'); }
    finally { setBusy(false); }
  }
  async function removeBook(id) {
    if (!window.confirm('Delete this book permanently?')) return;
    setBusy(true); setNotice('');
    try { await api.deleteBook(id, key); await refresh(); setNotice('Book deleted.'); }
    catch (e) { setNotice(e.message); } finally { setBusy(false); }
  }
  async function submitStation(e) {
    e.preventDefault(); setBusy(true); setNotice('');
    const payload = { ...stationForm, sort_order: Number(stationForm.sort_order || 0) };
    try {
      if (editingStation) await api.updateStation(editingStation, payload, key); else await api.createStation(payload, key);
      setStationForm(emptyStation); setEditingStation(null); await refresh(); setNotice('Radio station saved successfully.');
    } catch (err) { setNotice(err.message || 'Could not save station.'); }
    finally { setBusy(false); }
  }
  async function removeStation(id) {
    if (!window.confirm('Delete this radio station permanently?')) return;
    setBusy(true); setNotice('');
    try { await api.deleteStation(id, key); await refresh(); setNotice('Radio station deleted.'); }
    catch (e) { setNotice(e.message); } finally { setBusy(false); }
  }

  if (!unlocked) return <main className="admin-page"><div className="admin-login"><Link to="/" className="admin-back"><ArrowLeft size={16}/> Back to NanakLove</Link><div className="admin-symbol">ੴ</div><p className="admin-eyebrow">NANAKLOVE CONTROL ROOM</p><h1>Admin access</h1><p className="admin-muted">Enter the server-side ADMIN_API_KEY configured in <code>server/.env</code>. This is a basic private admin gate; do not publish the key.</p><form onSubmit={e=>{e.preventDefault();refresh()}}><label>Admin API key<input type="password" value={key} onChange={e=>setKey(e.target.value)} required autoComplete="current-password" placeholder="Enter your admin key"/></label><button className="admin-primary" disabled={busy}>{busy?'Checking…':'Unlock dashboard'}</button></form>{notice&&<p className="admin-notice error">{notice}</p>}</div></main>;

  return <main className="admin-page"><div className="admin-shell"><header className="admin-top"><div><Link to="/" className="admin-back"><ArrowLeft size={16}/> View website</Link><p className="admin-eyebrow">NANAKLOVE · ADMIN</p><h1>Manage your collection</h1><p className="admin-muted">Books are physical items. Radio stations are live streams.</p></div><div className="admin-actions"><button className="admin-secondary" onClick={refresh} disabled={busy}><RefreshCw size={15}/> Refresh</button><button className="admin-secondary" onClick={()=>{setUnlocked(false);setKey('');setNotice('')}}><LogOut size={15}/> Lock</button></div></header>
  {notice&&<p className={`admin-notice ${notice.toLowerCase().includes('could not')||notice.toLowerCase().includes('invalid')||notice.toLowerCase().includes('configure')?'error':'success'}`}>{notice}</p>}
  <div className="admin-stats"><div><BookOpen/><span>Books</span><strong>{books.length}</strong></div><div><Radio/><span>Radio stations</span><strong>{stations.length}</strong></div><div><ShieldCheck/><span>Access</span><strong>Key verified</strong></div></div>
  <div className="admin-tabs"><button className={tab==='books'?'active':''} onClick={()=>setTab('books')}><BookOpen size={16}/> Books</button><button className={tab==='radio'?'active':''} onClick={()=>setTab('radio')}><Radio size={16}/> Radio stations</button></div>
  {tab==='books' ? <div className="admin-content"><section className="admin-panel"><h2>{editingBook?'Edit book':'Add a book'}</h2><form className="admin-form" onSubmit={submitBook}><label>Book title *<input required minLength="2" maxLength="180" value={bookForm.title} onChange={e=>setBookForm({...bookForm,title:e.target.value})}/></label><label>Author<input value={bookForm.author} onChange={e=>setBookForm({...bookForm,author:e.target.value})}/></label><label>Category<select value={bookForm.category} onChange={e=>setBookForm({...bookForm,category:e.target.value})}><option value="gurbani">Gurbani</option><option value="history">Sikh history</option><option value="gurmat">Gurmat</option><option value="biography">Biography</option><option value="other">Other</option></select></label><label>Language<input value={bookForm.language} onChange={e=>setBookForm({...bookForm,language:e.target.value})}/></label><label>Pages<input type="number" min="1" value={bookForm.pages} onChange={e=>setBookForm({...bookForm,pages:e.target.value})}/></label><label>Cover image URL<input type="url" value={bookForm.cover_url} onChange={e=>setBookForm({...bookForm,cover_url:e.target.value})} placeholder="https://…"/></label><label className="wide">Description<textarea rows="3" value={bookForm.description} onChange={e=>setBookForm({...bookForm,description:e.target.value})}/></label><label className="admin-check"><input type="checkbox" checked={bookForm.featured} onChange={e=>setBookForm({...bookForm,featured:e.target.checked})}/> Featured book</label><div className="admin-form-actions wide"><button className="admin-primary" disabled={busy}><Save size={15}/> {editingBook?'Update book':'Save book'}</button>{editingBook&&<button type="button" className="admin-secondary" onClick={()=>{setEditingBook(null);setBookForm(emptyBook)}}>Cancel edit</button>}</div></form></section><section className="admin-panel"><h2>Books in catalogue <span>{books.length}</span></h2>{books.length===0?<p className="admin-muted">No saved books yet. Add your real book details above.</p>:<div className="admin-list">{books.map(b=><article key={b.id} className="admin-list-row"><div><strong>{b.title}</strong><small>{b.author||'Author not listed'} · {b.category}</small></div><div className="admin-row-actions"><button title="Edit" onClick={()=>{setEditingBook(b.id);setBookForm({...emptyBook,...b,pages:b.pages||'',cover_url:b.cover_url||'',description:b.description||'',author:b.author||'',language:b.language||''});window.scrollTo({top:0,behavior:'smooth'})}}>Edit</button><button className="danger" title="Delete" onClick={()=>removeBook(b.id)}><Trash2 size={15}/></button></div></article>)}</div>}</section></div>
  : <div className="admin-content"><section className="admin-panel"><h2>{editingStation?'Edit station':'Add a station'}</h2><form className="admin-form" onSubmit={submitStation}><label>Station name *<input required value={stationForm.name} onChange={e=>setStationForm({...stationForm,name:e.target.value})}/></label><label>Subtitle<input value={stationForm.subtitle} onChange={e=>setStationForm({...stationForm,subtitle:e.target.value})}/></label><label>Location<input value={stationForm.location} onChange={e=>setStationForm({...stationForm,location:e.target.value})}/></label><label>Sort order<input type="number" value={stationForm.sort_order} onChange={e=>setStationForm({...stationForm,sort_order:e.target.value})}/></label><label className="wide">Stream URL *<input required type="url" value={stationForm.stream_url} onChange={e=>setStationForm({...stationForm,stream_url:e.target.value})} placeholder="https://…"/></label><label className="admin-check"><input type="checkbox" checked={stationForm.enabled} onChange={e=>setStationForm({...stationForm,enabled:e.target.checked})}/> Enabled on public radio page</label><div className="admin-form-actions wide"><button className="admin-primary" disabled={busy}><Save size={15}/> {editingStation?'Update station':'Save station'}</button>{editingStation&&<button type="button" className="admin-secondary" onClick={()=>{setEditingStation(null);setStationForm(emptyStation)}}>Cancel edit</button>}</div></form></section><section className="admin-panel"><h2>Radio stations <span>{stations.length}</span></h2>{stations.length===0?<p className="admin-muted">No stations loaded. Check your admin key and database setup.</p>:<div className="admin-list">{stations.map(st=><article key={st.id} className="admin-list-row"><div><strong>{st.name}</strong><small>{st.subtitle||st.location||'Live stream'} · {st.enabled?'Enabled':'Disabled'}</small></div><div className="admin-row-actions"><button onClick={()=>{setEditingStation(st.id);setStationForm({...emptyStation,...st});window.scrollTo({top:0,behavior:'smooth'})}}>Edit</button><button className="danger" title="Delete" onClick={()=>removeStation(st.id)}><Trash2 size={15}/></button></div></article>)}</div>}</section></div>}
  <footer className="admin-footer">Keep the admin key private. Before public launch, replace this basic API-key gate with proper authenticated admin accounts.</footer></div></main>;
}
