import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Sparkles, ShoppingBag, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, users, cards, listings, offers } = useStore();

  const profileUser = users.find((u) => u.id === userId);
  const userCards = cards.filter((c) => c.ownerId === userId);
  const userListings = listings.filter(
    (l) => l.sellerId === userId && l.status === "Active",
  );
  const userCompletedSales = listings.filter(
    (l) => l.sellerId === userId && l.status === "Sold",
  );
  const userOffers = offers.filter(
    (o) => o.sellerId === userId && o.status === "Accepted",
  );

  if (!profileUser) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-400">
            Profil tidak ditemukan
          </h1>
          <p className="text-slate-500 mt-2">User yang Anda cari tidak ada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>

      {/* Profile Card */}
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <Card className="relative bg-slate-900/60 border-indigo-500/30 backdrop-blur">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-900/40">
                <span className="text-3xl font-bold text-white">
                  {profileUser.username.substring(0, 1).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold text-slate-50 tracking-tight">
                  {profileUser.username}
                </h1>
                <p className="text-violet-300/80 mt-1 mb-4">
                  {currentUser?.id === profileUser.id
                    ? "Profil Anda"
                    : "Kolektor Lokal"}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <p className="text-2xl font-bold text-violet-400">
                      {userCards.length}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Kartu</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <p className="text-2xl font-bold text-fuchsia-400">
                      {userListings.length}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Listing Aktif</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <p className="text-2xl font-bold text-emerald-400">
                      {userCompletedSales.length}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Terjual</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <div className="grid gap-8">
        {/* Active Listings */}
        {userListings.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-fuchsia-400" />
              <h2 className="text-2xl font-bold text-slate-50">
                Listing Aktif
              </h2>
              <span className="text-sm text-slate-400">
                ({userListings.length})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userListings.map((listing) => {
                const card = cards.find((c) => c.id === listing.cardId);
                if (!card) return null;
                return (
                  <Card
                    key={listing.id}
                    className="bg-slate-900/60 border-indigo-500/30 hover:border-indigo-500/50 transition overflow-hidden group"
                  >
                    <div className="relative h-48 bg-slate-950 flex items-center justify-center p-3 overflow-hidden">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                      />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <p className="text-xs font-medium text-violet-400 mb-1">
                          {card.game}
                        </p>
                        <h3 className="font-bold text-slate-100 line-clamp-2">
                          {card.name}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                        <div>
                          <p className="text-xs text-slate-400">Harga</p>
                          <p className="text-lg font-bold text-emerald-400">
                            Rp {listing.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold"
                        >
                          Tawar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Cards */}
        {userCards.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h2 className="text-2xl font-bold text-slate-50">Semua Kartu</h2>
              <span className="text-sm text-slate-400">
                ({userCards.length})
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userCards.map((card) => (
                <Card
                  key={card.id}
                  className="bg-slate-900/60 border-indigo-500/30 hover:border-indigo-500/50 transition overflow-hidden group"
                >
                  <div className="relative h-40 bg-slate-950 flex items-center justify-center p-2 overflow-hidden">
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <div>
                      <p className="text-xs font-medium text-violet-400">
                        {card.game}
                      </p>
                      <h3 className="font-bold text-slate-100 text-sm line-clamp-2">
                        {card.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{card.condition}</span>
                      <span className="text-fuchsia-300">{card.rarity}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        {currentUser?.id === profileUser.id && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-2xl font-bold text-slate-50">Statistik</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-900/60 border-violet-500/30">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">
                    Total Kartu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-violet-400">
                    {userCards.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Kartu dalam koleksi Anda
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/60 border-fuchsia-500/30">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">
                    Listing Aktif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-fuchsia-400">
                    {userListings.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Kartu yang sedang dijual
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/60 border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">
                    Terjual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-emerald-400">
                    {userCompletedSales.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Kartu yang sudah terjual
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/60 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">
                    Penawaran Diterima
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-cyan-400">
                    {userOffers.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Penawaran yang diterima
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {userCards.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-lg border border-slate-800">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-400">
              Belum ada kartu
            </h3>
            <p className="text-slate-500 mt-2">
              {currentUser?.id === profileUser.id
                ? "Mulai tambahkan kartu ke koleksi Anda"
                : "Pengguna ini belum menambahkan kartu"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
