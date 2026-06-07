// API client untuk komunikasi dengan backend
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiCall<T>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: any;
  },
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Users
export const userAPI = {
  login: (username: string) =>
    apiCall("/users/login", {
      method: "POST",
      body: { username },
    }),
  getById: (id: string) => apiCall(`/users/${id}`),
  getAll: () => apiCall("/users"),
};

// Cards
export const cardAPI = {
  create: (cardData: any) =>
    apiCall("/cards", {
      method: "POST",
      body: cardData,
    }),
  getById: (id: string) => apiCall(`/cards/${id}`),
  getByOwnerId: (ownerId: string) => apiCall(`/cards/owner/${ownerId}`),
  getAll: () => apiCall("/cards"),
};

// Listings
export const listingAPI = {
  create: (listingData: any) =>
    apiCall("/listings", {
      method: "POST",
      body: listingData,
    }),
  getById: (id: string) => apiCall(`/listings/${id}`),
  getAll: () => apiCall("/listings"),
  getBySellerId: (sellerId: string) => apiCall(`/listings/seller/${sellerId}`),
  updateStatus: (id: string, status: string) =>
    apiCall(`/listings/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),
};

// Offers
export const offerAPI = {
  create: (offerData: any) =>
    apiCall("/offers", {
      method: "POST",
      body: offerData,
    }),
  getById: (id: string) => apiCall(`/offers/${id}`),
  getByCardId: (cardId: string) => apiCall(`/offers/card/${cardId}`),
  getByBuyerId: (buyerId: string) => apiCall(`/offers/buyer/${buyerId}`),
  updateStatus: (id: string, status: string) =>
    apiCall(`/offers/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),
};
