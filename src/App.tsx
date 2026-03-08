/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Chat from '@/pages/Chat';
import { BuilderProvider } from '@/context/BuilderContext';

export default function App() {
  return (
    <BuilderProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </HashRouter>
    </BuilderProvider>
  );
}
