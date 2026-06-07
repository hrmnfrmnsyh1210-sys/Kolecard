import express, { Request, Response } from "express";
import * as db from "../db/queries.js";

const router = express.Router();

// ===== USERS =====
router.post("/users/login", async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if (!username?.trim()) {
      res.status(400).json({ error: "Username required" });
      return;
    }

    let user = await db.getUserByUsername(username.trim());
    if (!user) {
      const id = crypto.randomUUID();
      user = await db.createUser(id, username.trim());
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ===== CARDS =====
router.post("/cards", async (req: Request, res: Response) => {
  try {
    const { ownerId, name, game, rarity, condition, imageUrl } = req.body;
    if (!ownerId || !name || !game || !condition) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const card = await db.createCard({
      ownerId,
      name,
      game,
      rarity,
      condition,
      imageUrl,
    });
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/cards/:id", async (req: Request, res: Response) => {
  try {
    const card = await db.getCardById(req.params.id);
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/cards/owner/:ownerId", async (req: Request, res: Response) => {
  try {
    const cards = await db.getCardsByOwnerId(req.params.ownerId);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/cards", async (req: Request, res: Response) => {
  try {
    const cards = await db.getAllCards();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ===== LISTINGS =====
router.post("/listings", async (req: Request, res: Response) => {
  try {
    const { cardId, sellerId, price } = req.body;
    if (!cardId || !sellerId || !price) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const listing = await db.createListing({
      cardId,
      sellerId,
      price,
      status: "Active",
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/listings/:id", async (req: Request, res: Response) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/listings", async (req: Request, res: Response) => {
  try {
    const listings = await db.getActiveListings();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get(
  "/listings/seller/:sellerId",
  async (req: Request, res: Response) => {
    try {
      const listings = await db.getListingsBySellerId(req.params.sellerId);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  },
);

router.patch("/listings/:id/status", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "Status required" });
      return;
    }

    await db.updateListingStatus(req.params.id, status);
    const listing = await db.getListingById(req.params.id);
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ===== OFFERS =====
router.post("/offers", async (req: Request, res: Response) => {
  try {
    const { cardId, buyerId, sellerId, price } = req.body;
    if (!cardId || !buyerId || !sellerId || !price) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const offer = await db.createOffer({
      cardId,
      buyerId,
      sellerId,
      price,
      status: "Pending",
    });
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/offers/:id", async (req: Request, res: Response) => {
  try {
    const offer = await db.getOfferById(req.params.id);
    if (!offer) {
      res.status(404).json({ error: "Offer not found" });
      return;
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/offers/card/:cardId", async (req: Request, res: Response) => {
  try {
    const offers = await db.getOffersByCardId(req.params.cardId);
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/offers/buyer/:buyerId", async (req: Request, res: Response) => {
  try {
    const offers = await db.getOffersByBuyerId(req.params.buyerId);
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.patch("/offers/:id/status", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "Status required" });
      return;
    }

    await db.updateOfferStatus(req.params.id, status);
    const offer = await db.getOfferById(req.params.id);
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

export default router;
