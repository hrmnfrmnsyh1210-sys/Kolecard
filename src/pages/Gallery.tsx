import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Search, Tag, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
};

export default function Gallery() {
  const { user, cards, users, listings, makeOffer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Combine all cards with their owner details
  const displayItems = cards.map(card => {
    const owner = users.find(u => u.id === card.ownerId);
    const activeListing = listings.find(l => l.cardId === card.id && l.status === 'Active');
    return { card, owner, activeListing };
  }).filter(item => item.card.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');

  const handleMakeOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(offerPrice, 10);
    if (selectedCard && !isNaN(price) && price > 0) {
      makeOffer(selectedCard.card.id, selectedCard.owner.id, price);
      setIsOfferModalOpen(false);
      setSelectedCard(null);
      setOfferPrice('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">Galeri Publik</h1>
          <p className="text-violet-300/80 mt-1">Jelajahi seluruh kartu dari komunitas kolektor dan ajukan penawaran.</p>
        </div>
        
        <div className="w-full md:w-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Cari kelangkaan, nama..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-900 border-slate-700 focus:border-violet-500 text-slate-100 w-full md:w-[300px]"
            />
          </div>
        </div>
      </div>

      {displayItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-violet-500/20 rounded-xl bg-violet-950/10 backdrop-blur-sm">
          <Tag className="w-12 h-12 text-violet-500/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300">Belum ada kartu di Galeri</h3>
          <p className="text-slate-500 mt-1 mb-6">Mulai tambahkan kartu ke koleksiku untuk membagikannya di Galeri.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayItems.map((item) => (
            <Card key={item.card.id} className="bg-slate-900/60 backdrop-blur border-slate-800/60 overflow-hidden hover:border-violet-500/50 transition-all duration-300 flex flex-col group hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] relative">
              {item.activeListing && (
                <div className="absolute top-3 left-3 z-10 bg-indigo-500 text-white px-2.5 py-1 rounded-md text-xs font-bold border border-indigo-400 shadow-md">
                  Sedang Dijual
                </div>
              )}
              <div className="aspect-[3/4] relative bg-slate-950/50 flex items-center justify-center p-4">
                {item.card.imageUrl ? (
                  <img src={item.card.imageUrl} alt={item.card.name} className={`max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 ${item.activeListing ? 'opacity-90' : 'group-hover:scale-105'}`} />
                ) : (
                  <div className="text-slate-700 text-sm font-medium">No Image</div>
                )}
              </div>
              
              <CardContent className="p-5 flex-1 bg-gradient-to-b from-slate-900/0 to-slate-900/80">
                <div className="text-xs font-medium text-violet-400 mb-1.5">{item.card.game} • <span className="text-fuchsia-400">{item.card.rarity}</span></div>
                <h3 className="font-bold text-slate-100 text-lg leading-tight mb-3 line-clamp-2">{item.card.name}</h3>
                <div className="inline-flex items-center rounded-md bg-slate-800/80 border border-slate-700/50 px-2 py-1 text-xs font-medium text-slate-300">
                  Kondisi: <span className="text-slate-200 ml-1">{item.card.condition}</span>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 flex items-center justify-between gap-3 border-t border-slate-800/50 bg-slate-900">
                <div className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                    {item.owner?.username?.substring(0, 1).toUpperCase() || '?'}
                  </div>
                  <span className="text-slate-300">{item.owner?.username || 'Unknown'}</span>
                </div>
                
                {item.owner?.id !== user?.id && !item.activeListing && (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setSelectedCard(item);
                      setIsOfferModalOpen(true);
                    }}
                    className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold shadow-md shadow-fuchsia-900/20"
                  >
                    Tawar
                  </Button>
                )}
                {item.activeListing && (
                  <div className="text-xs font-bold text-emerald-400 p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                    Di Marketplace
                  </div>
                )}
                {item.owner?.id === user?.id && !item.activeListing && (
                  <div className="text-xs font-medium text-slate-500 p-1.5 bg-slate-800/50 rounded-md">
                    Kartu Anda
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Offer Modal */}
      <Dialog open={isOfferModalOpen} onOpenChange={setIsOfferModalOpen}>
        <DialogContent className="bg-slate-900 border-indigo-500/30 text-slate-50 sm:max-w-md shadow-2xl shadow-indigo-900/20">
          <DialogHeader>
            <DialogTitle className="text-xl">Ajukan Penawaran</DialogTitle>
            <DialogDescription className="text-slate-400">
              Buat tawaran harga ke pemilik kartu. Pemilik bisa memilih untuk menerima atau menolak tawaranmu.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 border-y border-slate-800 my-2 flex items-center gap-4 bg-slate-950/30 rounded-lg p-3">
             <div className="w-16 h-24 flex shadow-lg shrink-0 rounded overflow-hidden p-1 bg-slate-950 border border-slate-800">
               <img src={selectedCard?.card?.imageUrl} alt="" className="max-w-full max-h-full object-contain m-auto" />
            </div>
            <div>
              <p className="font-bold text-lg text-white">{selectedCard?.card?.name}</p>
              <p className="text-sm text-violet-400 font-medium">{selectedCard?.card?.rarity}</p>
              <p className="text-xs text-slate-500 mt-1 mb-2">Pemilik: {selectedCard?.owner?.username}</p>
            </div>
          </div>
          <form onSubmit={handleMakeOffer} className="space-y-4 py-2">
            <div className="space-y-3">
              <Label htmlFor="offerPrice" className="text-slate-300">Harga Tawaran (Rp)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium tracking-wider">Rp</span>
                <Input 
                  id="offerPrice" 
                  type="number"
                  min="1000"
                  step="1000"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="pl-10 bg-slate-950/50 border-slate-700 focus:border-fuchsia-500 focus:ring-fuchsia-500/20 text-fuchsia-400 font-bold text-lg h-12" 
                  placeholder="25000" 
                  required 
                />
              </div>
            </div>
            {offerPrice && !isNaN(parseInt(offerPrice)) && (
               <p className="text-sm text-fuchsia-400/80 bg-fuchsia-500/10 p-3 rounded-md border border-fuchsia-500/20 text-center font-medium">
                Tawaran sebesar <span className="font-bold text-fuchsia-400">{formatIDR(parseInt(offerPrice))}</span> akan dikirim ke {selectedCard?.owner?.username}.
               </p>
            )}
            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300" onClick={() => setIsOfferModalOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-900/40 font-bold">Ajukan Tawaran</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
