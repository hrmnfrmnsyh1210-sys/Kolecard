import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const { login } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <Card className="w-full max-w-md border-violet-500/20 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-violet-900/20 relative z-10 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"></div>
        <CardHeader className="text-center space-y-3 pt-8">
          <div className="mx-auto bg-gradient-to-br from-violet-500 to-fuchsia-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] transform rotate-3">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">CardVault</CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Masuk atau buat akun untuk mulai koleksi dan transaksi jual beli kartu aman.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2 text-left">
              <label htmlFor="username" className="text-sm font-medium text-slate-300">
                Nama Pengguna
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Misal: kolektor123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-950/50 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 text-slate-50 placeholder:text-slate-600 h-11"
                required
              />
            </div>
            <Button type="submit" className="w-full font-bold h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-900/30 text-white transition-all">
              Masuk / Daftar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-slate-500 pb-8">
          Profil akan disimpan secara lokal di browser ini.
        </CardFooter>
      </Card>
    </div>
  );
}
