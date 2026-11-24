import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Toaster } from "./components/ui/toast";
import { PurseProvider } from "./lib/usePurse";
import Home from "./pages/Home";
import PursePage from "./pages/Purse";
import Create from "./pages/Create";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <PurseProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="purse" element={<PursePage />} />
            <Route path="create" element={<Create />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
      <Toaster />
    </PurseProvider>
  );
}
