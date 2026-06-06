import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { GameType, Condition } from '../types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
};

export default function Collection() {
  const { user, cards, listings, addCard, addListing, offers, acceptOffer, rejectOffer, users } = useStore();
  
  const myCards = cards.filter(c => c.ownerId === user?.id);
  const myActiveListings = listings.filter(l => l.sellerId === user?.id && l.status === 'Active');
  const myIncomingOffers = offers.filter(o => o.sellerId === user?.id && o.status === 'Pending');

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    name: '',
    game: 'Pokémon' as GameType,
    rarity: '',
    condition: 'Near Mint' as Condition,
    imageUrl: ''
  });

  const [isListOpen, setIsListOpen] = useState(false);
  const [listingCardId, setListingCardId] = useState('');
  const [listingPrice, setListingPrice] = useState('');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCard.name && newCard.imageUrl) {
      addCard(newCard);
      setIsAddCardOpen(false);
      setNewCard({ name: '', game: 'Pokémon', rarity: '', condition: 'Near Mint', imageUrl: '' });
    }
  };

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(listingPrice, 10);
    if (listingCardId && !isNaN(price) && price > 0) {
      addListing(listingCardId, price);
      setIsListOpen(false);
      setListingCardId('');
      setListingPrice('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">Koleksiku</h1>
          <p className="text-violet-300/80 mt-1">Kelola portofolio kartu koleksimu dan mulai berjualan.</p>
        </div>
        
        <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-900/30 font-bold border-0">
              <Plus className="w-5 h-5" />
              Tambah Kartu
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-indigo-500/30 text-slate-50 sm:max-w-md shadow-2xl shadow-indigo-900/20">
            <DialogHeader>
              <DialogTitle className="text-xl">Tambah Kartu Baru</DialogTitle>
              <DialogDescription className="text-slate-400">
                Masukkan detail kartu untuk menambahkannya ke portofolio koleksimu.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCard} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Nama Kartu</Label>
                <Input 
                  id="name" 
                  value={newCard.name}
                  onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                  className="bg-slate-950/50 border-slate-700 focus:border-violet-500 text-slate-100" 
                  placeholder="Misal: Charizard VMAX"
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="game" className="text-slate-300">Permainan</Label>
                  <select 
                    id="game"
                    value={newCard.game}
                    onChange={(e) => setNewCard({...newCard, game: e.target.value as GameType})}
                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus:border-violet-500 text-slate-100"
                  >
                    <option value="Pokémon">Pokémon</option>
                    <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
                    <option value="Magic: The Gathering">Magic</option>
                    <option value="One Piece">One Piece</option>
                    <option value="Sports">Olahraga</option>
                    <option value="Other">Lainnya</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-slate-300">Kondisi</Label>
                  <select 
                    id="condition"
                    value={newCard.condition}
                    onChange={(e) => setNewCard({...newCard, condition: e.target.value as Condition})}
                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-1 text-sm shadow-sm transition-colors focus:border-violet-500 text-slate-100"
                  >
                    <option value="Mint">Mint (Sempurna)</option>
                    <option value="Near Mint">Near Mint (Hampir Sempurna)</option>
                    <option value="Lightly Played">Lightly Played</option>
                    <option value="Heavily Played">Heavily Played</option>
                    <option value="Damaged">Damaged (Rusak)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rarity" className="text-slate-300">Kelangkaan</Label>
                <Input 
                  id="rarity" 
                  value={newCard.rarity}
                  onChange={(e) => setNewCard({...newCard, rarity: e.target.value})}
                  className="bg-slate-950/50 border-slate-700 focus:border-violet-500 text-slate-100" 
                  placeholder="Misal: Secret Rare, Holo" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-slate-300">URL Gambar</Label>
                <Input 
                  id="imageUrl" 
                  type="url"
                  value={newCard.imageUrl}
                  onChange={(e) => setNewCard({...newCard, imageUrl: e.target.value})}
                  className="bg-slate-950/50 border-slate-700 focus:border-violet-500 text-slate-100" 
                  placeholder="https://example.com/image.png" 
                  required
                />
              </div>
              {newCard.imageUrl && (
                <div className="mt-2 text-center h-32 bg-slate-950 rounded-lg flex border border-slate-800 justify-center overflow-hidden p-2">
                  <img src={newCard.imageUrl} alt="Preview" className="object-contain max-h-full drop-shadow-lg" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
              )}
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 font-bold">Simpan Kartu</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {myIncomingOffers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Tawaran Masuk</h2>
          <div className="flex flex-col gap-4">
            {myIncomingOffers.map(offer => {
              const card = cards.find(c => c.id === offer.cardId);
              const buyer = users.find(u => u.id === offer.buyerId);
              if (!card) return null;
              return (
                <div key={offer.id} className="bg-slate-900/60 border border-fuchsia-500/30 rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(217,70,239,0.15)] backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-slate-950 rounded flex items-center justify-center p-1 border border-slate-800">
                      <img src={card.imageUrl} alt={card.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm">
                        <span className="font-bold text-fuchsia-400">{buyer?.username || 'Unknown'}</span> menawar kartu <span className="font-bold text-white">{card.name}</span>
                      </p>
                      <p className="text-2xl font-bold text-emerald-400 mt-1">{formatIDR(offer.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 bg-transparent" onClick={() => rejectOffer(offer.id)}>Tolak</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/30" onClick={() => acceptOffer(offer.id)}>Terima</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {myCards.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-violet-500/20 rounded-xl bg-violet-950/10 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-4 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <ImageIcon className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-300">Koleksi Anda masih kosong</h3>
          <p className="text-slate-500 mt-1 mb-6">Mulai tambahkan kartu pertama ke koleksi Anda atau beli dari Marketplace.</p>
          <Button variant="outline" className="border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-medium" onClick={() => setIsAddCardOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kartu Pertamamu
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myCards.map((card) => {
            const activeListing = myActiveListings.find(l => l.cardId === card.id);
            
            return (
              <Card key={card.id} className={`bg-slate-900/60 backdrop-blur overflow-hidden flex flex-col relative transition-all duration-300 ${activeListing ? 'border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'border-slate-800/60 hover:border-violet-500/30 hover:shadow-lg'}`}>
                {activeListing && (
                  <div className="absolute top-3 left-3 z-10 bg-indigo-500 text-white px-2.5 py-1 rounded-md text-xs font-bold border border-indigo-400 shadow-md">
                    Sedang Dijual
                  </div>
                )}
                <div className="aspect-[3/4] relative bg-slate-950/50 flex items-center justify-center p-4 group">
                  <img src={card.imageUrl} alt={card.name} className={`max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 ${activeListing ? 'opacity-90' : 'group-hover:scale-105'}`} />
                </div>
                
                <CardContent className="p-5 flex-1 bg-gradient-to-b from-slate-900/0 to-slate-900/80">
                  <div className="text-xs font-medium text-violet-400 mb-1.5">{card.game} • <span className="text-fuchsia-400">{card.rarity}</span></div>
                  <h3 className="font-bold text-slate-100 text-lg leading-tight mb-3 line-clamp-2">{card.name}</h3>
                  <div className="inline-flex items-center rounded-md bg-slate-800/80 border border-slate-700/50 px-2 py-1 text-xs font-medium text-slate-300">
                    Kondisi: <span className="text-slate-200 ml-1">{card.condition}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 flex justify-between items-center bg-slate-900 border-t border-slate-800/50">
                  {activeListing ? (
                    <div className="w-full text-center text-sm font-bold text-emerald-400 py-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                      Ditawarkan {formatIDR(activeListing.price)}
                    </div>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => {
                        setListingCardId(card.id);
                        setIsListOpen(true);
                      }}
                      className="w-full bg-slate-100 text-slate-900 hover:bg-white font-bold"
                    >
                      Jual Kartu
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Listing Form Dialog */}
      <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
        <DialogContent className="bg-slate-900 border-indigo-500/30 text-slate-50 sm:max-w-md shadow-2xl shadow-indigo-900/20">
          <DialogHeader>
            <DialogTitle className="text-xl">Buat Penawaran</DialogTitle>
            <DialogDescription className="text-slate-400">
              Tentukan harga jual untuk kartu koleksi Anda dan post di Marketplace.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddListing} className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="price" className="text-slate-300">Harga Penawaran (Rp)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium tracking-wider">Rp</span>
                <Input 
                  id="price" 
                  type="number"
                  min="1000"
                  step="1000"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  className="pl-10 bg-slate-950/50 border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-400 font-bold text-lg h-12" 
                  placeholder="50000" 
                  required 
                />
              </div>
            </div>
            {listingPrice && !isNaN(parseInt(listingPrice)) && (
               <p className="text-sm text-emerald-400/80 bg-emerald-500/10 p-3 rounded-md border border-emerald-500/20 text-center font-medium">
                Kartumu akan dijual seharga <span className="font-bold text-emerald-400">{formatIDR(parseInt(listingPrice))}</span>.
               </p>
            )}
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsListOpen(false)} className="text-slate-400 hover:text-white">Batal</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 font-bold shadow-lg shadow-emerald-900/40">Posting ke Marketplace</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
