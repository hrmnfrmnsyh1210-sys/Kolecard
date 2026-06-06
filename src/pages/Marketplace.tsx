import { useState } from 'react';
import { useStore } from '../store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Plus, Search, Tag } from 'lucide-react';
import { GameType, Listing, Card as CardType } from '../types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// A helper mapping component to format IDR
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
};

export default function Marketplace() {
  const { user, cards, listings, buyListing, users } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const activeListings = listings.filter(l => l.status === 'Active');
  
  // Combine Listing with Card details
  const displayItems = activeListings.map(listing => {
    const card = cards.find(c => c.id === listing.cardId);
    const seller = users.find(u => u.id === listing.sellerId);
    return { ...listing, card, seller };
  }).filter(item => item.card && item.card.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const handleBuy = () => {
    if (selectedListing) {
      buyListing(selectedListing.id);
      setIsBuyModalOpen(false);
      setSelectedListing(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">Marketplace</h1>
          <p className="text-violet-300/80 mt-1">Temukan dan beli kartu koleksi terbaik dari kolektor lain.</p>
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
          <h3 className="text-lg font-medium text-slate-300">Belum ada penawaran</h3>
          <p className="text-slate-500 mt-1 mb-6">Jadilah yang pertama untuk memposting kartu koleksimu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayItems.map((item) => (
            <Card key={item.id} className="bg-slate-900/60 backdrop-blur border-slate-800/60 overflow-hidden hover:border-violet-500/50 transition-all duration-300 flex flex-col group hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
              <div className="aspect-[3/4] relative bg-slate-950/50 flex items-center justify-center p-4">
                {item.card?.imageUrl ? (
                  <img src={item.card.imageUrl} alt={item.card.name} className="max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-slate-700 text-sm font-medium">No Image</div>
                )}
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                  {formatIDR(item.price)}
                </div>
              </div>
              
              <CardContent className="p-5 flex-1 bg-gradient-to-b from-slate-900/0 to-slate-900/80">
                <div className="text-xs font-medium text-violet-400 mb-1.5">{item.card?.game} • <span className="text-fuchsia-400">{item.card?.rarity}</span></div>
                <h3 className="font-bold text-slate-100 text-lg leading-tight mb-3 line-clamp-2">{item.card?.name}</h3>
                <div className="inline-flex items-center rounded-md bg-slate-800/80 border border-slate-700/50 px-2 py-1 text-xs font-medium text-slate-300">
                  Kondisi: <span className="text-slate-200 ml-1">{item.card?.condition}</span>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 flex items-center justify-between gap-3 border-t border-slate-800/50 bg-slate-900">
                <div className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                    {item.seller?.username.substring(0, 1).toUpperCase()}
                  </div>
                  <span className="text-slate-300">{item.seller?.username}</span>
                </div>
                
                <Button 
                  size="sm" 
                  onClick={() => {
                    setSelectedListing(item);
                    setIsBuyModalOpen(true);
                  }}
                  disabled={item.sellerId === user?.id} // Cannot buy own card
                  className={item.sellerId === user?.id ? "bg-slate-800 text-slate-500 font-medium" : "bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/20"}
                >
                  {item.sellerId === user?.id ? 'Milikmu' : 'Beli'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Buy Confirmation Dialog */}
      <Dialog open={isBuyModalOpen} onOpenChange={setIsBuyModalOpen}>
        <DialogContent className="bg-slate-900 border-indigo-500/30 text-slate-50 sm:max-w-md shadow-2xl shadow-indigo-900/20">
          <DialogHeader>
            <DialogTitle className="text-xl">Konfirmasi Pembelian</DialogTitle>
            <DialogDescription className="text-slate-400">
              Apakah Anda yakin ingin membeli item ini? Transaksi tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 border-y border-slate-800 my-2 flex items-center gap-4 bg-slate-950/30 rounded-lg p-3">
            <div className="w-16 h-24 flex shadow-lg shrink-0 rounded overflow-hidden p-1 bg-slate-950 border border-slate-800">
               <img src={selectedListing?.card?.imageUrl} alt="" className="max-w-full max-h-full object-contain m-auto" />
            </div>
            <div>
              <p className="font-bold text-lg text-white">{selectedListing?.card?.name}</p>
              <p className="text-sm text-violet-400 font-medium">{selectedListing?.card?.rarity}</p>
              <p className="text-xs text-slate-500 mt-1 mb-2">Penjual: {selectedListing?.seller?.username}</p>
              <div className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-sm font-bold">
                {selectedListing ? formatIDR(selectedListing.price) : ''}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" className="border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300" onClick={() => setIsBuyModalOpen(false)}>Batal</Button>
            <Button onClick={handleBuy} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 font-bold">Bayar Sekarang</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
