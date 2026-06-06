export type User = { id: string; username: string };
export type GameType = 'Pokémon' | 'Yu-Gi-Oh!' | 'Magic: The Gathering' | 'One Piece' | 'Sports' | 'Other';
export type Condition = 'Mint' | 'Near Mint' | 'Lightly Played' | 'Heavily Played' | 'Damaged';

export interface Card {
  id: string;
  ownerId: string;
  name: string;
  game: GameType | string;
  rarity: string;
  condition: Condition | string;
  imageUrl: string;
  createdAt: number;
}

export interface Listing {
  id: string;
  cardId: string;
  sellerId: string;
  price: number;
  status: 'Active' | 'Sold';
  createdAt: number;
}

export interface Offer {
  id: string;
  cardId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: number;
}
