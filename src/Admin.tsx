import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from './lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { 
  LayoutGrid, 
  MapPin, 
  Users, 
  Settings,
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Upload,
  User,
  Lock,
  Database,
  MessageSquare,
  Download,
  BarChart3,
  GripVertical,
  Calendar,
  CalendarDays,
  CalendarRange
} from 'lucide-react';


export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('aplikasi');
  
  // States
  const [applications, setApplications] = useState<any[]>([]);
  const [usulanSekolah, setUsulanSekolah] = useState<any[]>([]);
  const [timProfiles, setTimProfiles] = useState<any[]>([]);
  const [kritikSaran, setKritikSaran] = useState<any[]>([]);
  const [statistik, setStatistik] = useState({ today: 0, month: 0, year: 0, total: 0 });

  const [adminProfile, setAdminProfile] = useState({ 
    username: 'minda', 
    password: 'minda', 
    photoUrl: 'https://picsum.photos/seed/admin/100/100' 
  });

  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editingTimId, setEditingTimId] = useState<string | null>(null);
  const [editingSekolahId, setEditingSekolahId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    const unsubApps = onSnapshot(collection(db, "portal_aplikasi"), snap => setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubSekolah = onSnapshot(collection(db, "portal_usulan_sekolah"), snap => setUsulanSekolah(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubTim = onSnapshot(collection(db, "portal_profil_tim"), snap => {
      const tims = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      tims.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      setTimProfiles(tims);
    });
    const unsubKritik = onSnapshot(collection(db, "portal_kritik_saran"), snap => setKritikSaran(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubStats = onSnapshot(doc(db, "portal_statistik", "main"), snap => {
      if(snap.exists()) setStatistik(snap.data() as any);
    });
    const unsubAdmin = onSnapshot(doc(db, "portal_admin_profile", "main"), snap => {
      if(snap.exists()) setAdminProfile(snap.data() as any);
    });
    return () => { unsubApps(); unsubSekolah(); unsubTim(); unsubKritik(); unsubStats(); unsubAdmin(); };
  }, []);

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault(); 
  const handleDrop = async (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId === null || draggedId === id) return;
    
    const newItems = [...timProfiles];
    const draggedIndex = newItems.findIndex((t:any) => t.id === draggedId);
    const targetIndex = newItems.findIndex((t:any) => t.id === id);
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // Remove from old and place in new
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    
    setTimProfiles(newItems);
    setDraggedId(null);

    // Update 'order' for logically shifted elements
    try {
      await Promise.all(
        newItems.map((item: any, index: number) => updateDoc(doc(db, "portal_profil_tim", item.id), { order: index }))
      );
    } catch(err) {
      console.error(err);
    }
  };

  // removed local storage sync

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === adminProfile.username && password === adminProfile.password) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Username atau password salah.');
    }
  };

  const tabs = [
    { id: 'aplikasi', name: 'Aplikasi Layanan', icon: LayoutGrid },
    { id: 'sekolah', name: 'Data Website Sekolah', icon: MapPin },
    { id: 'profil', name: 'Profil Tim', icon: Users },
    { id: 'kritik', name: 'Kritik & Saran', icon: MessageSquare },
    { id: 'pengaturan', name: 'Pengaturan', icon: Settings },
  ];

  const handleBackupKritik = () => {
    const dataStr = JSON.stringify(kritikSaran, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_Kritik_Saran_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /* Aplikasi Handlers */
  const handleAddApp = async () => {
    try {
      const newApp = { title: "Baru", description: "", icon: "LayoutGrid", logoUrl: "", stats: "", link: "#", status: "Active" };
      const docRef = await addDoc(collection(db, "portal_aplikasi"), newApp);
      setEditingAppId(docRef.id);
    } catch (e: any) { alert("Gagal tambah aplikasi: " + e.message); }
  };

  /* Sekolah Handlers */
  const handleAddSekolah = async () => {
    try {
      const newSekolah = { namaSekolah: "SDN Baru", kecamatan: "Tanjung", url: "https://", verified: true };
      const docRef = await addDoc(collection(db, "portal_usulan_sekolah"), newSekolah);
      setEditingSekolahId(docRef.id);
    } catch (e: any) { alert("Gagal tambah sekolah: " + e.message); }
  };

  const toggleSekolahVerifikasi = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "portal_usulan_sekolah", id), { verified: !currentStatus });
  };
  const deleteSekolah = async (id: string) => {
    if(confirm('Hapus usulan sekolah?')) await deleteDoc(doc(db, "portal_usulan_sekolah", id));
  };

  /* Profil Tim Handlers */
  const handleAddTim = async () => {
    try {
      const newOrder = timProfiles.length > 0 ? Math.max(...timProfiles.map((t: any) => t.order || 0)) + 1 : 0;
      const newTim = { Nama: "Nama Baru", Jabatan: "Jabatan", FotoURL: "https://picsum.photos/seed/new/200/200", order: newOrder };
      const docRef = await addDoc(collection(db, "portal_profil_tim"), newTim);
      setEditingTimId(docRef.id);
    } catch (e: any) { alert("Gagal tambah tim: " + e.message); }
  };
  const deleteTim = async (id: string) => {
    if(confirm('Hapus profil tim?')) await deleteDoc(doc(db, "portal_profil_tim", id));
  };

  /* Pengaturan Handlers */
  const handleAdminPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert("Maksimal ukuran foto adalah 1 MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAdminProfile({ ...adminProfile, photoUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen bg-bg-dark text-white items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-10 rounded-[32px] w-full max-w-md z-10 border border-white/10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 border border-primary/30">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <p className="text-sm text-white/40 mt-1">Portal Layanan Terpadu PSD</p>
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 block">Username</label>
              <input type="text" value={username} onChange={e=>setUsername(e.target.value)} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 block">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
            <button type="submit" className="w-full bg-primary text-black font-bold py-3 mt-4 rounded-xl hover:bg-primary/90 transition-colors">
              Masuk
            </button>
          </form>
          <button onClick={() => window.location.hash = ''} className="w-full mt-6 text-sm text-white/40 hover:text-white transition-colors flex items-center justify-center gap-2">
            <LogOut size={14}/> Kembali ke Publik
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-dark text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 glass border-r border-white/5 flex flex-col p-6 z-10 shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/50">
            <LayoutGrid className="text-primary w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Admin<br/><span className="text-primary">Portal PSD</span></h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4 px-3">Menu Utama</div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => {setIsLoggedIn(false); window.location.hash = '';}}
          className="flex items-center justify-center gap-2 mt-auto text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 py-3 rounded-xl transition-colors font-semibold"
        >
          <LogOut size={16} />
          Keluar ke Publik
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-black/20 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <header className="px-10 py-8 border-b border-white/5 glass-dark z-10 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold capitalize">{tabs.find(t => t.id === activeTab)?.name}</h2>
            <p className="text-sm text-white/40 mt-1">Kelola data informasi portal publik tersertifikasi lokal.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden bg-white/10">
               <img src={adminProfile.photoUrl} alt="Admin Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="text-sm font-bold">{adminProfile.username}</div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto p-10 z-10">
          {activeTab === 'aplikasi' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Hari Ini", value: statistik.today, icon: Calendar },
                  { label: "Bulan Ini", value: statistik.month, icon: CalendarDays },
                  { label: "Tahun Ini", value: statistik.year, icon: CalendarRange },
                  { label: "Total", value: statistik.total, icon: BarChart3 }
                ].map((stat, idx) => (
                  <div key={idx} className="glass p-4 rounded-2xl flex flex-col justify-center items-center text-center border border-white/10">
                    <stat.icon className="w-5 h-5 text-primary mb-2 opacity-80" />
                    <div className="text-2xl font-black text-primary">{stat.value.toLocaleString('id-ID')}</div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-xl">Daftar Aplikasi</h3>
                <button onClick={handleAddApp} className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform"><Plus size={16} /> Tambah Aplikasi</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {applications.map((app: any) => (
                  <div key={app.id} className="glass border border-white/10 p-6 rounded-2xl group hover:border-primary/30 transition-all">
                    {editingAppId === app.id ? (
                      <div className="flex flex-col gap-3">
                        <input type="text" value={app.title} onChange={(e) => setApplications(apps => apps.map(a => a.id === app.id ? {...a, title: e.target.value} : a))} className="bg-black/50 border border-white/20 rounded-md px-3 py-2 text-sm focus:border-primary" placeholder="Judul Aplikasi" />
                        <textarea value={app.description} onChange={(e) => setApplications(apps => apps.map(a => a.id === app.id ? {...a, description: e.target.value} : a))} className="bg-black/50 border border-white/20 rounded-md px-3 py-2 text-sm h-20 resize-none focus:border-primary" placeholder="Deskripsi" />
                        <div className="flex gap-2">
                          <input type="text" value={app.icon} onChange={(e) => setApplications(apps => apps.map(a => a.id === app.id ? {...a, icon: e.target.value} : a))} className="bg-black/50 border border-white/20 rounded-md px-3 py-2 text-xs flex-1" placeholder="Ikon (Lucide)" />
                          <input type="text" value={app.status} onChange={(e) => setApplications(apps => apps.map(a => a.id === app.id ? {...a, status: e.target.value} : a))} className="bg-black/50 border border-white/20 rounded-md px-3 py-2 text-xs flex-1" placeholder="Status" />
                        </div>
                        <input type="text" value={app.logoUrl} onChange={(e) => setApplications(apps => apps.map(a => a.id === app.id ? {...a, logoUrl: e.target.value} : a))} className="bg-black/50 border border-white/20 rounded-md px-3 py-2 text-xs" placeholder="Logo URL (opsional)" />
                        <input type="text" value={app.link} onChange={(e) => setApplications(apps => apps.map(a => a.id === app.id ? {...a, link: e.target.value} : a))} className="bg-black/50 border border-white/20 rounded-md px-3 py-2 text-xs" placeholder="Link URL" />
                        <div className="flex items-center justify-end gap-2 mt-2">
                           <button onClick={async () => {
                              const found = applications.find(a => a.id === editingAppId);
                              if(found) {
                                const { id, ...saveData } = found;
                                await updateDoc(doc(db, "portal_aplikasi", id), saveData);
                              }
                              setEditingAppId(null);
                           }} className="p-2 bg-primary text-black font-bold rounded-md hover:opacity-80 px-4">Simpan</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-lg text-primary">{app.title}</h4>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10 text-white/50">{app.status}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingAppId(app.id)} className="p-2 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"><Edit2 size={14} /></button>
                            <button onClick={() => {if(confirm('Hapus aplikasi ini?')) setApplications(applications.filter(a => a.id !== app.id))}} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                        <p className="text-sm text-white/60 mb-4 line-clamp-2">{app.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'sekolah' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-xl">Usulan Website Sekolah</h3>
                  <p className="text-white/40 text-sm">Data masuk dari form portal utama</p>
                </div>
                <button onClick={handleAddSekolah} className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform"><Plus size={16} /> Tambah Data</button>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-black/50">
                    <tr>
                      <th className="p-4 text-xs font-bold uppercase text-white/40">Nama Sekolah</th>
                      <th className="p-4 text-xs font-bold uppercase text-white/40">Kecamatan</th>
                      <th className="p-4 text-xs font-bold uppercase text-white/40">URL</th>
                      <th className="p-4 text-xs font-bold uppercase text-white/40 text-center">Status</th>
                      <th className="p-4 text-xs font-bold uppercase text-white/40 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usulanSekolah.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-white/30 text-sm">Belum ada usulan masuk</td></tr>
                    ) : usulanSekolah.map((s: any) => (
                      <tr key={s.id} className="border-t border-white/5 hover:bg-white/5">
                        {editingSekolahId === s.id ? (
                          <>
                            <td className="p-4"><input type="text" value={s.namaSekolah} onChange={e=>setUsulanSekolah(all=>all.map(x=>x.id===s.id?{...x, namaSekolah: e.target.value}:x))} className="bg-black/50 border border-white/20 rounded-md px-2 py-1 text-sm w-full" /></td>
                            <td className="p-4"><input type="text" value={s.kecamatan} onChange={e=>setUsulanSekolah(all=>all.map(x=>x.id===s.id?{...x, kecamatan: e.target.value}:x))} className="bg-black/50 border border-white/20 rounded-md px-2 py-1 text-sm w-full" /></td>
                            <td className="p-4"><input type="text" value={s.url} onChange={e=>setUsulanSekolah(all=>all.map(x=>x.id===s.id?{...x, url: e.target.value}:x))} className="bg-black/50 border border-white/20 rounded-md px-2 py-1 text-sm w-full" /></td>
                            <td className="p-4 text-center">
                              <button onClick={() => toggleSekolahVerifikasi(s.id, s.verified)} className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20">
                                {s.verified ? 'Layak Tampil' : 'Menunggu'}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <button onClick={async () => {
                                const found = usulanSekolah.find(x => x.id === editingSekolahId);
                                if(found) {
                                  const { id, ...data } = found;
                                  await updateDoc(doc(db, "portal_usulan_sekolah", id), data);
                                }
                                setEditingSekolahId(null);
                              }} className="px-3 py-1 bg-primary text-black font-bold rounded-md text-sm cursor-pointer hover:bg-primary/80">Simpan</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-4 font-bold">{s.namaSekolah}</td>
                            <td className="p-4 text-sm text-white/60">{s.kecamatan}</td>
                            <td className="p-4 text-sm text-blue-400"><a href={s.url} target="_blank" rel="noreferrer" className="hover:underline">{s.url}</a></td>
                            <td className="p-4 text-center">
                               {s.verified ? <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500/20 text-green-400"><CheckCircle2 size={12}/> Layak Tampil</span> : <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400"><XCircle size={12}/> Menunggu</span>}
                            </td>
                            <td className="p-4 flex gap-2 justify-center">
                              <button onClick={() => setEditingSekolahId(s.id)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80" title="Edit Data"><Edit2 size={16} /></button>
                              <button onClick={() => toggleSekolahVerifikasi(s.id, s.verified)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80" title="Verifikasi Tampil">
                                 {s.verified ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button onClick={() => deleteSekolah(s.id)} className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-white/80"><Trash2 size={16}/></button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'profil' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-xl">Data Profil Tim</h3>
                <button onClick={handleAddTim} className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform"><Plus size={16} /> Tambah Anggota</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {timProfiles.map((tim: any) => (
                  <div 
                    key={tim.id} 
                    draggable={true}
                    onDragStart={() => handleDragStart(tim.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, tim.id)}
                    className="glass p-6 rounded-2xl group flex flex-col items-center relative cursor-move border border-transparent hover:border-primary/50 transition-colors"
                  >
                    <div className="absolute top-4 right-4 text-white/20 group-hover:text-primary transition-colors">
                      <GripVertical size={20} />
                    </div>
                    {editingTimId === tim.id ? (
                      <div className="w-full space-y-3 z-10">
                         <input type="text" value={tim.Nama} onChange={e=>setTimProfiles(tims => tims.map(t=>t.id===tim.id?{...t, Nama: e.target.value}:t))} className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-2 text-sm text-center" placeholder="Nama" />
                         <input type="text" value={tim.Jabatan} onChange={e=>setTimProfiles(tims => tims.map(t=>t.id===tim.id?{...t, Jabatan: e.target.value}:t))} className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-2 text-sm text-center" placeholder="Jabatan" />
                         <input type="text" value={tim.FotoURL} onChange={e=>setTimProfiles(tims => tims.map(t=>t.id===tim.id?{...t, FotoURL: e.target.value}:t))} className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-2 text-sm text-center" placeholder="URL Foto" />
                         <button onClick={async () => {
                           const found = timProfiles.find(t => t.id === editingTimId);
                           if(found) {
                             const { id, ...data } = found;
                             await updateDoc(doc(db, "portal_profil_tim", id), data);
                           }
                           setEditingTimId(null);
                         }} className="w-full py-2 bg-primary text-black font-bold rounded-md">Simpan</button>
                      </div>
                    ) : (
                      <>
                        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-primary/50">
                          <img src={tim.FotoURL} alt={tim.Nama} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-lg text-center">{tim.Nama}</h4>
                        <p className="text-primary text-sm uppercase tracking-widest font-semibold">{tim.Jabatan}</p>
                        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditingTimId(tim.id)} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm flex gap-2 items-center"><Edit2 size={12}/> Edit</button>
                            <button onClick={() => deleteTim(tim.id)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-sm flex gap-2 items-center"><Trash2 size={12}/> Hapus</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'kritik' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-xl">Kritik & Saran</h3>
                  <p className="text-white/40 text-sm">Pesan masuk dari pengunjung portal</p>
                </div>
                <button onClick={handleBackupKritik} className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform"><Download size={16} /> Backup (*.json)</button>
              </div>
              <div className="grid gap-4">
                {kritikSaran.length === 0 ? (
                  <div className="text-center p-10 bg-white/5 border border-white/10 rounded-2xl text-white/40">Belum ada kritik & saran yang masuk.</div>
                ) : kritikSaran.map((k: any) => (
                  <div key={k.id} className="glass p-6 rounded-2xl border border-white/10 transition-all hover:bg-white/[0.02]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-primary">{k.nama}</h4>
                        <a href={`mailto:${k.email}`} className="text-sm text-blue-400 hover:underline">{k.email}</a>
                      </div>
                      <span className="text-[10px] font-black tracking-widest uppercase text-white/40 bg-black/50 px-3 py-1 rounded-lg border border-white/5">{k.tanggal}</span>
                    </div>
                    <p className="text-sm leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">{k.pesan}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'pengaturan' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <h3 className="font-bold text-xl mb-8">Pengaturan Profil Admin</h3>
              <div className="glass p-8 rounded-3xl space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-black/50 border border-white/20 group">
                    <img src={adminProfile.photoUrl} alt="Profil" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload size={20} className="mb-1" />
                      <span className="text-[10px] font-bold">Ubah</span>
                      <input type="file" accept="image/*" onChange={handleAdminPhotoUpload} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Foto Profil</h4>
                    <p className="text-sm text-white/40">Format JPG/PNG maks 1MB.</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 block">Username Admin</label>
                     <input type="text" value={adminProfile.username} onChange={e=>setAdminProfile({...adminProfile, username: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50" />
                   </div>
                   <div>
                     <label className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 block">Password Baru (Abaikan jika tidak ingin diganti)</label>
                     <input type="password" value={adminProfile.password} onChange={e=>setAdminProfile({...adminProfile, password: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50" />
                   </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button onClick={async () => {
                     try {
                       await setDoc(doc(db, "portal_admin_profile", "main"), adminProfile);
                       alert('Profil dan password berhasil diperbarui serta tersimpan di Firebase!');
                     } catch (e: any) {
                       alert("Gagal simpan pengaturan: " + e.message);
                     }
                  }} className="bg-primary text-black font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <CheckCircle2 size={18} /> Simpan Pengaturan
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
