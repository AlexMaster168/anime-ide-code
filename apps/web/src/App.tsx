import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { SearchPage } from './pages/Search';
import { FavoritesPage } from './pages/Favorites';
import { CompilerPage } from './pages/Compiler';
import { TitlePage } from './pages/Title';
import { PlayerPage } from './pages/Player';

export function App() {
  return (
    <Routes>
      <Route path="/player/:idOrAlias/:episode" element={<PlayerPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/compiler" element={<CompilerPage />} />
        <Route path="/title/:idOrAlias" element={<TitlePage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
