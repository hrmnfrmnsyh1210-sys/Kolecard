import { getConnection } from "./connection.js";
import { User, Card, Listing, Offer } from "../types.js";

// ===== USERS =====
export async function getUserById(id: string): Promise<User | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username FROM users WHERE id = ?",
      [id],
    );
    return (rows as any[])[0] || null;
  } finally {
    connection.release();
  }
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username FROM users WHERE username = ?",
      [username],
    );
    return (rows as any[])[0] || null;
  } finally {
    connection.release();
  }
}

export async function createUser(id: string, username: string): Promise<User> {
  const connection = await getConnection();
  try {
    await connection.execute("INSERT INTO users (id, username) VALUES (?, ?)", [
      id,
      username,
    ]);
    return { id, username };
  } finally {
    connection.release();
  }
}

export async function getAllUsers(): Promise<User[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username FROM users ORDER BY created_at DESC",
    );
    return rows as User[];
  } finally {
    connection.release();
  }
}

// ===== CARDS =====
export async function getCardById(id: string): Promise<Card | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, owner_id as ownerId, name, game, rarity, condition, image_url as imageUrl, created_at as createdAt FROM cards WHERE id = ?",
      [id],
    );
    return (rows as any[])[0] || null;
  } finally {
    connection.release();
  }
}

export async function getCardsByOwnerId(ownerId: string): Promise<Card[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, owner_id as ownerId, name, game, rarity, condition, image_url as imageUrl, created_at as createdAt FROM cards WHERE owner_id = ? ORDER BY created_at DESC",
      [ownerId],
    );
    return rows as Card[];
  } finally {
    connection.release();
  }
}

export async function createCard(
  card: Omit<Card, "id" | "createdAt">,
): Promise<Card> {
  const connection = await getConnection();
  try {
    const id = crypto.randomUUID();
    await connection.execute(
      "INSERT INTO cards (id, owner_id, name, game, rarity, condition, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        card.ownerId,
        card.name,
        card.game,
        card.rarity,
        card.condition,
        card.imageUrl,
      ],
    );
    return { ...card, id, createdAt: Date.now() };
  } finally {
    connection.release();
  }
}

export async function getAllCards(): Promise<Card[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, owner_id as ownerId, name, game, rarity, condition, image_url as imageUrl, UNIX_TIMESTAMP(created_at) * 1000 as createdAt FROM cards ORDER BY created_at DESC",
    );
    return rows as Card[];
  } finally {
    connection.release();
  }
}

// ===== LISTINGS =====
export async function getListingById(id: string): Promise<Listing | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, card_id as cardId, seller_id as sellerId, price, status, UNIX_TIMESTAMP(created_at) * 1000 as createdAt FROM listings WHERE id = ?",
      [id],
    );
    return (rows as any[])[0] || null;
  } finally {
    connection.release();
  }
}

export async function getActiveListings(): Promise<Listing[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT id, card_id as cardId, seller_id as sellerId, price, status, UNIX_TIMESTAMP(created_at) * 1000 as createdAt FROM listings WHERE status = "Active" ORDER BY created_at DESC',
    );
    return rows as Listing[];
  } finally {
    connection.release();
  }
}

export async function getListingsBySellerId(
  sellerId: string,
): Promise<Listing[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, card_id as cardId, seller_id as sellerId, price, status, UNIX_TIMESTAMP(created_at) * 1000 as createdAt FROM listings WHERE seller_id = ? ORDER BY created_at DESC",
      [sellerId],
    );
    return rows as Listing[];
  } finally {
    connection.release();
  }
}

export async function createListing(
  listing: Omit<Listing, "id" | "createdAt">,
): Promise<Listing> {
  const connection = await getConnection();
  try {
    const id = crypto.randomUUID();
    await connection.execute(
      "INSERT INTO listings (id, card_id, seller_id, price, status) VALUES (?, ?, ?, ?, ?)",
      [id, listing.cardId, listing.sellerId, listing.price, listing.status],
    );
    return { ...listing, id, createdAt: Date.now() };
  } finally {
    connection.release();
  }
}

export async function updateListingStatus(
  id: string,
  status: string,
): Promise<void> {
  const connection = await getConnection();
  try {
    await connection.execute("UPDATE listings SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  } finally {
    connection.release();
  }
}

// ===== OFFERS =====
export async function getOfferById(id: string): Promise<Offer | null> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, card_id as cardId, buyer_id as buyerId, seller_id as sellerId, price, status, UNIX_TIMESTAMP(created_at) * 1000 as createdAt FROM offers WHERE id = ?",
      [id],
    );
    return (rows as any[])[0] || null;
  } finally {
    connection.release();
  }
}

export async function getOffersByCardId(cardId: string): Promise<Offer[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, card_id as cardId, buyer_id as buyerId, seller_id as sellerId, price, status, UNIX_TIMESTAMP(created_at) * 1000 as createdAt FROM offers WHERE card_id = ? ORDER BY created_at DESC",
      [cardId],
    );
    return rows as Offer[];
  } finally {
    connection.release();
  }
}

export async function getOffersByBuyerId(buyerId: string): Promise<Offer[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, card_id as cardId, buyer_id as buyerId, seller_id as sellerId, price, status, UNIX_TIMESTAMP(created_at) * 1000 as createdAt FROM offers WHERE buyer_id = ? ORDER BY created_at DESC",
      [buyerId],
    );
    return rows as Offer[];
  } finally {
    connection.release();
  }
}

export async function createOffer(
  offer: Omit<Offer, "id" | "createdAt">,
): Promise<Offer> {
  const connection = await getConnection();
  try {
    const id = crypto.randomUUID();
    await connection.execute(
      "INSERT INTO offers (id, card_id, buyer_id, seller_id, price, status) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id,
        offer.cardId,
        offer.buyerId,
        offer.sellerId,
        offer.price,
        offer.status,
      ],
    );
    return { ...offer, id, createdAt: Date.now() };
  } finally {
    connection.release();
  }
}

export async function updateOfferStatus(
  id: string,
  status: string,
): Promise<void> {
  const connection = await getConnection();
  try {
    await connection.execute("UPDATE offers SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  } finally {
    connection.release();
  }
}
