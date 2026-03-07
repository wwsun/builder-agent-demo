/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Chat from '@/pages/Chat';
import { BuilderProvider } from '@/context/BuilderContext';

export default function App() {
  return (
    <BuilderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </BuilderProvider>
  );
}
