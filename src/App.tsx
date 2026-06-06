import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import Marketplace from './pages/Marketplace';
import Collection from './pages/Collection';
import Gallery from './pages/Gallery';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user } = useStore();
  return user ? <>{children}</> : <AuthPage />;
}

export default function App() {
  return (
    <StoreProvider>
      <div className="dark min-h-screen bg-zinc-950 text-zinc-50 font-sans">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Marketplace />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="collection" element={<Collection />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </StoreProvider>
  );
}
