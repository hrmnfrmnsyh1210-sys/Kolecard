import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  WalletCards,
  Layers,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Layout() {
  const { user, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Marketplace", path: "/", icon: WalletCards },
    { name: "Galeri", path: "/gallery", icon: Layers },
    { name: "Koleksiku", path: "/collection", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-slate-950 text-slate-50 flex flex-col font-sans selection:bg-fuchsia-500/30">
      <header className="sticky top-0 z-50 border-b border-indigo-500/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline-block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              CardVault
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900/50 p-1 rounded-full border border-slate-800/50">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`gap-2 rounded-full transition-all ${isActive ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/20 hover:from-violet-500 hover:to-fuchsia-500" : "text-slate-400 hover:text-slate-50 hover:bg-slate-800"}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium">
                      {item.name}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border-2 border-violet-500/30 hover:border-violet-500/60 p-0 transition-colors"
                  >
                    <Avatar className="h-full w-full">
                      <AvatarFallback className="bg-slate-900 text-violet-300 font-bold">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-slate-900 border-indigo-500/20 text-slate-100 shadow-xl shadow-indigo-900/20"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none text-slate-200">
                        {user.username}
                      </p>
                      <p className="text-xs leading-none text-violet-400">
                        Kolektor Lokal
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className="text-slate-300 focus:text-slate-100 focus:bg-slate-800/50 cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Lihat Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-400 focus:text-red-300 focus:bg-red-950/50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
