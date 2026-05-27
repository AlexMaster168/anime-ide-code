import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { SearchPage } from './pages/Search';
import { SchedulePage } from './pages/Schedule';
import { FavoritesPage } from './pages/Favorites';
import { CompilerPage } from './pages/Compiler';
import { TitlePage } from './pages/Title';
import { GenrePage } from './pages/Genre';
import { PlayerPage } from './pages/Player';

export function App() {
  return (
    <Routes>
      <Route path="/player/:idOrAlias/:episode" element={<PlayerPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/compiler" element={<CompilerPage />} />
        <Route path="/title/:idOrAlias" element={<TitlePage />} />
        <Route path="/genre/:id" element={<GenrePage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
