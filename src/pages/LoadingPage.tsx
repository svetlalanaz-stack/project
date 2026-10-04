import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBooking } from "@/context/BookingContext";

export default function LoadingPage() {
  const navigate = useNavigate();
  const { from, to, dateThere, dateBack } = useBooking();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const interval = 50;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate("/search"), 100);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="min-h-screen bg-[#2d2d2d] flex flex-col"
    >
      <div
        className="relative w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/train-background-search.png)`,
        }}
      >
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />

        <div className="relative z-10">
          <Header />
        </div>

        <div className="relative z-10 py-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-3 items-start justify-center">
              <div>
                <p className="text-gray-300 text-xs mb-2 font-medium tracking-wide">
                  Направление
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-44 relative">
                    <input
                      readOnly
                      value={from}
                      className="w-full bg-white text-gray-800 text-sm px-3 py-2.5 outline-none pr-8"
                    />
                    <svg
                      className="absolute right-2.5 top-3 w-3.5 h-3.5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <button className="hover:opacity-80 transition-opacity flex-shrink-0">
                    <img
                      src="images/search-change-button.png"
                      alt="Поменять направление"
                      className="w-4 h-4 object-contain"
                    />
                  </button>
                  <div className="w-44 relative">
                    <input
                      readOnly
                      value={to}
                      className="w-full bg-white text-gray-800 text-sm px-3 py-2.5 outline-none pr-8"
                    />
                    <svg
                      className="absolute right-2.5 top-3 w-3.5 h-3.5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-gray-300 text-xs mb-2 font-medium tracking-wide">
                  Дата
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      readOnly
                      value={dateThere}
                      className="bg-white text-gray-800 text-sm px-3 py-2.5 outline-none w-44"
                    />
                    <svg
                      className="absolute right-2.5 top-3 w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </div>
                  <div className="relative">
                    <input
                      readOnly
                      value={dateBack}
                      className="bg-white text-gray-800 text-sm px-3 py-2.5 outline-none w-44"
                    />
                    <svg
                      className="absolute right-2.5 top-3 w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button className="w-44 bg-[#f5a623] hover:bg-[#f5a623] hover:shadow-lg hover:shadow-[#f5a623]/50 active:bg-transparent active:text-[#f5a623] active:border active:border-[#f5a623] text-black font-bold text-sm py-2.5 rounded transition-all tracking-wide">
                    НАЙТИ БИЛЕТЫ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-[#f5a623]/20">
        <div
          className="h-full bg-[#f5a623] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <p
          className="text-gray-400 text-sm font-medium tracking-[0.3em] uppercase mb-16"
          style={{ animation: "pulse 1.5s ease-in-out infinite" }}
        >
          ИДЕТ ПОИСК
        </p>

        <div className="relative w-80 flex flex-col items-center">
          <div className="w-full h-px bg-[#f5a623]/40 relative mt-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 w-px h-2 bg-[#f5a623]/25"
                style={{
                  left: `${(i / 17) * 100}%`,
                  transform: "translateY(-50%)",
                }}
              />
            ))}
          </div>

          <div
            className="absolute bottom-2"
            style={{ animation: "trainRide 2.5s linear forwards" }}
          >
            <TrainSVG />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes trainRide {
          from { transform: translateX(-160px); }
          to   { transform: translateX(320px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes steamPuff {
          0%   { opacity: 0.8; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-16px) scale(1.5); }
        }
      `}</style>

      <Footer />
    </div>
  );
}

function TrainSVG() {
  return (
    <svg
      width="160"
      height="36"
      viewBox="0 0 160 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "scaleX(-1)" }}
    >
      <circle
        cx="12"
        cy="4"
        r="3"
        fill="#f5a623"
        opacity="0.6"
        style={{ animation: "steamPuff 0.8s ease-out infinite" }}
      />
      <circle
        cx="20"
        cy="2"
        r="2"
        fill="#f5a623"
        opacity="0.4"
        style={{ animation: "steamPuff 0.8s ease-out 0.2s infinite" }}
      />

      <rect x="2" y="12" width="44" height="14" rx="2" fill="#f5a623" />
      <rect x="4" y="8" width="18" height="10" rx="1.5" fill="#d4891a" />
      <rect
        x="7"
        y="10"
        width="8"
        height="5"
        rx="1"
        fill="#1e1e1e"
        opacity="0.7"
      />
      <rect x="10" y="5" width="5" height="7" rx="1" fill="#d4891a" />
      <rect x="44" y="18" width="4" height="5" rx="1" fill="#d4891a" />

      <rect x="52" y="14" width="36" height="12" rx="2" fill="#c47a00" />
      <rect
        x="55"
        y="16"
        width="10"
        height="7"
        rx="1"
        fill="#1e1e1e"
        opacity="0.5"
      />
      <rect
        x="70"
        y="16"
        width="10"
        height="7"
        rx="1"
        fill="#1e1e1e"
        opacity="0.5"
      />

      <rect x="92" y="14" width="36" height="12" rx="2" fill="#b06f00" />
      <rect
        x="95"
        y="16"
        width="10"
        height="7"
        rx="1"
        fill="#1e1e1e"
        opacity="0.5"
      />
      <rect
        x="110"
        y="16"
        width="10"
        height="7"
        rx="1"
        fill="#1e1e1e"
        opacity="0.5"
      />

      <rect x="132" y="14" width="26" height="12" rx="2" fill="#965f00" />
      <rect
        x="135"
        y="16"
        width="8"
        height="7"
        rx="1"
        fill="#1e1e1e"
        opacity="0.5"
      />

      <circle
        cx="12"
        cy="26"
        r="5"
        fill="#1e1e1e"
        stroke="#f5a623"
        strokeWidth="1.5"
        style={{
          transformOrigin: "12px 26px",
          animation: "wheelSpin 0.4s linear infinite",
        }}
      />
      <circle
        cx="28"
        cy="26"
        r="5"
        fill="#1e1e1e"
        stroke="#f5a623"
        strokeWidth="1.5"
        style={{
          transformOrigin: "28px 26px",
          animation: "wheelSpin 0.4s linear infinite",
        }}
      />
      <circle
        cx="42"
        cy="26"
        r="4"
        fill="#1e1e1e"
        stroke="#f5a623"
        strokeWidth="1.5"
        style={{
          transformOrigin: "42px 26px",
          animation: "wheelSpin 0.4s linear infinite",
        }}
      />

      <circle
        cx="62"
        cy="26"
        r="4"
        fill="#1e1e1e"
        stroke="#c47a00"
        strokeWidth="1.5"
        style={{
          transformOrigin: "62px 26px",
          animation: "wheelSpin 0.4s linear infinite",
        }}
      />
      <circle
        cx="78"
        cy="26"
        r="4"
        fill="#1e1e1e"
        stroke="#c47a00"
        strokeWidth="1.5"
        style={{
          transformOrigin: "78px 26px",
          animation: "wheelSpin 0.4s linear infinite",
        }}
      />

      <circle
        cx="102"
        cy="26"
        r="4"
        fill="#1e1e1e"
        stroke="#b06f00"
        strokeWidth="1.5"
        style={{
          transformOrigin: "102px 26px",
          animation: "wheelSpin 0.4s linear infinite",
        }}
      />
      <circle
        cx="118"
        cy="26"
        r="4"
        fill="#1e1e1e"
        stroke="#b06f00"
        strokeWidth="1.5"
        style={{
          transformOrigin: "118px 26px",
          animation: "wheelSpin 0.4s linear infinite",
        }}
      />

      <circle
        cx="142"
        cy="26"
        r="4"
        fill="#1e1e1e"
        stroke="#965f00"
        strokeWidth="1.5"
        style={{
          transformOrigin: "142px 26px",
          animation: "wheelSpin 0.4s linear infinite",
        }}
      />
      <circle
        cx="154"
        cy="26"
        r="4"
        fill="#1e1e1e"
        stroke="#965f00"
        strokeWidth="1.5"
        style={{
          transformOrigin: "154px 26px",
          animation: "wheelSpin 0.4s linear infinite",
        }}
      />

      <line x1="48" y1="21" x2="52" y2="21" stroke="#888" strokeWidth="2" />
      <line x1="88" y1="21" x2="92" y2="21" stroke="#888" strokeWidth="2" />
      <line x1="128" y1="21" x2="132" y2="21" stroke="#888" strokeWidth="2" />
    </svg>
  );
}
