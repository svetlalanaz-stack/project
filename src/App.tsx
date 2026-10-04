import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "@/context/BookingContext";
import HomePage from "@/pages/HomePage";
import LoadingPage from "@/pages/LoadingPage";
import SearchPage from "@/pages/SearchPage";
import SeatsPage from "@/pages/SeatsPage";
import PassengersPage from "@/pages/PassengersPage";
import PaymentPage from "@/pages/PaymentPage";
import ReviewPage from "@/pages/ReviewPage";
import SuccessPage from "@/pages/SuccessPage";

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/seats" element={<SeatsPage />} />
          <Route path="/passengers" element={<PassengersPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  );
}
