import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
// Add page imports here
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import MasterAdmin from './pages/MasterAdmin';

const AuthenticatedApp = () => {
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/sucesso" element={<Success />} />
      <Route path="/master" element={<MasterAdmin />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AuthenticatedApp />
      <Toaster />
    </Router>
  )
}

export default App
