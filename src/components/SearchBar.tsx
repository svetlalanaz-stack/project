import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  initialFrom?: string;
  initialTo?: string;
  dark?: boolean;
}

export default function SearchBar({
  initialFrom = "",
  initialTo = "",
  dark = true,
}: Props) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const navigate = useNavigate();

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const inputCls = `w-full text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-[#f5a623] ${
    dark
      ? "bg-[#2d2d2d] text-white placeholder-gray-500"
      : "bg-white/10 text-white placeholder-gray-400"
  }`;

  return (
    <div
      className="py-5"
      style={{
        background: dark
          ? "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5))"
          : "transparent",
        backdropFilter: dark ? "blur(4px)" : undefined,
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[260px]">
              <label className="block text-gray-300 text-xs mb-1 font-medium tracking-wide">
                Направление
              </label>
              <div className="flex items-center gap-1">
                <div className="relative flex-1">
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Откуда"
                    className={`${inputCls} pr-7`}
                  />
                  <svg
                    className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <button
                  onClick={swap}
                  className="text-[#f5a623] hover:text-white transition-colors flex-shrink-0 px-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </button>
                <div className="relative flex-1">
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Куда"
                    className={`${inputCls} pr-7`}
                  />
                  <svg
                    className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-300 text-xs mb-1 font-medium tracking-wide">
                Дата
              </label>
              <div className="flex items-center gap-1">
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className={`${inputCls} pr-7`}
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className={`${inputCls} pr-7`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => navigate("/search")}
              className="bg-[#f5a623] hover:bg-[#d4891a] text-black font-bold text-sm px-6 py-2 tracking-wide transition-colors whitespace-nowrap"
            >
              НАЙТИ БИЛЕТЫ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
