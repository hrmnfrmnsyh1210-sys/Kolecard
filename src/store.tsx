import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Card, Listing, Offer } from './types';

interface AppState {
  user: User | null;
  users: User[];
  login: (username: string) => void;
  logout: () => void;
  cards: Card[];
  addCard: (card: Omit<Card, 'id' | 'ownerId' | 'createdAt'>) => void;
  listings: Listing[];
  addListing: (cardId: string, price: number) => void;
  buyListing: (listingId: string) => void;
  offers: Offer[];
  makeOffer: (cardId: string, sellerId: string, price: number) => void;
  acceptOffer: (offerId: string) => void;
  rejectOffer: (offerId: string) => void;
}

const StoreContext = createContext<AppState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('cv_user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('cv_users');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [cards, setCards] = useState<Card[]>(() => {
    const stored = localStorage.getItem('cv_cards');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [listings, setListings] = useState<Listing[]>(() => {
    const stored = localStorage.getItem('cv_listings');
    return stored ? JSON.parse(stored) : [];
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const stored = localStorage.getItem('cv_offers');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => localStorage.setItem('cv_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('cv_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('cv_cards', JSON.stringify(cards)), [cards]);
  useEffect(() => localStorage.setItem('cv_listings', JSON.stringify(listings)), [listings]);
  useEffect(() => localStorage.setItem('cv_offers', JSON.stringify(offers)), [offers]);

  const login = (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;
    let existingUser = users.find(u => u.username.toLowerCase() === trimmed.toLowerCase());
    if (!existingUser) {
      existingUser = { id: crypto.randomUUID(), username: trimmed };
      setUsers([...users, existingUser]);
    }
    setUser(existingUser);
  };

  const logout = () => setUser(null);

  const addCard = (cardData: Omit<Card, 'id' | 'ownerId' | 'createdAt'>) => {
    if (!user) return;
    const newCard: Card = {
      ...cardData,
      id: crypto.randomUUID(),
      ownerId: user.id,
      createdAt: Date.now(),
    };
    setCards(prev => [...prev, newCard]);
  };

  const addListing = (cardId: string, price: number) => {
    if (!user) return;
    if (listings.some(l => l.cardId === cardId && l.status === 'Active')) return;
    
    const newListing: Listing = {
      id: crypto.randomUUID(),
      cardId,
      sellerId: user.id,
      price,
      status: 'Active',
      createdAt: Date.now()
    };
    setListings(prev => [...prev, newListing]);
  };

  const buyListing = (listingId: string) => {
    if (!user) return;
    
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: 'Sold' } : l));
    
    // Transfer card ownership
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      setCards(prev => prev.map(c => c.id === listing.cardId ? { ...c, ownerId: user.id } : c));
      // Auto reject pending offers for this card
      setOffers(prev => prev.map(o => o.cardId === listing.cardId && o.status === 'Pending' ? { ...o, status: 'Rejected' } : o));
    }
  };

  const makeOffer = (cardId: string, sellerId: string, price: number) => {
    if (!user) return;
    const newOffer: Offer = {
      id: crypto.randomUUID(),
      cardId,
      buyerId: user.id,
      sellerId,
      price,
      status: 'Pending',
      createdAt: Date.now()
    };
    setOffers(prev => [...prev, newOffer]);
  };

  const acceptOffer = (offerId: string) => {
    if (!user) return;
    const offer = offers.find(o => o.id === offerId);
    if (!offer || offer.sellerId !== user.id) return;

    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'Accepted' } : 
      // Reject other pending offers for same card
      (o.cardId === offer.cardId && o.status === 'Pending' ? { ...o, status: 'Rejected' } : o)
    ));
    // Remove if it was in listings
    setListings(prev => prev.map(l => l.cardId === offer.cardId && l.status === 'Active' ? { ...l, status: 'Sold' } : l));
    // Transfer ownership
    setCards(prev => prev.map(c => c.id === offer.cardId ? { ...c, ownerId: offer.buyerId } : c));
  };

  const rejectOffer = (offerId: string) => {
    if (!user) return;
    setOffers(prev => prev.map(o => o.id === offerId && o.sellerId === user.id ? { ...o, status: 'Rejected' } : o));
  };

  return (
    <StoreContext.Provider value={{ user, users, login, logout, cards, addCard, listings, addListing, buyListing, offers, makeOffer, acceptOffer, rejectOffer }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
