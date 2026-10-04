import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StepBar from "@/components/StepBar";
import TripSidebar from "@/components/TripSidebar";
import { useBooking } from "@/context/BookingContext";

export default function PaymentPage() {
  const navigate = useNavigate();
  const {
    from,
    to,
    dateThere,
    dateBack,
    payMethod,
    setPayMethod,
    buyerLastName,
    buyerFirstName,
    buyerPatronymic,
    buyerPhone,
    buyerEmail,
    setBuyerLastName,
    setBuyerFirstName,
    setBuyerPatronymic,
    setBuyerPhone,
    setBuyerEmail,
  } = useBooking();

  const inputCls =
    "w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] transition-colors rounded-sm bg-white";

  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="min-h-screen bg-gray-100"
    >
      <div
        className="relative w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/train-background-search.png)`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        <div className="relative z-10">
          <Header />
        </div>

        <div className="relative z-10 py-5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-3 items-start justify-center">
              <div>
                <p className="text-gray-300 text-xs mb-1 font-medium tracking-wide">
                  Направление
                </p>
                <div className="flex items-center gap-1">
                  <input
                    readOnly
                    value={from}
                    className="w-44 bg-white text-gray-800 text-sm px-3 py-2 outline-none placeholder-gray-400"
                  />
                  <button className="hover:opacity-80 transition-opacity flex-shrink-0">
                    <img
                      src="images/search-change-button.png"
                      alt="Поменять направление"
                      className="w-4 h-4 object-contain"
                    />
                  </button>
                  <input
                    readOnly
                    value={to}
                    className="w-44 bg-white text-gray-800 text-sm px-3 py-2 outline-none placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <p className="text-gray-300 text-xs mb-1 font-medium tracking-wide">
                  Дата
                </p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={dateThere}
                    className="bg-white text-gray-800 text-sm px-3 py-2 outline-none w-44 placeholder-gray-400"
                    placeholder="Дата туда"
                  />
                  <input
                    readOnly
                    value={dateBack}
                    className="bg-white text-gray-800 text-sm px-3 py-2 outline-none w-44 placeholder-gray-400"
                    placeholder="Дата обратно"
                  />
                </div>

                <div className="flex justify-end mt-3">
                  <button className="w-44 bg-[#f5a623] hover:bg-[#f5a623] hover:shadow-lg hover:shadow-[#f5a623]/50 active:bg-transparent active:text-[#f5a623] active:border active:border-[#f5a623] text-black font-bold text-sm py-2 rounded transition-all tracking-wide">
                    НАЙТИ БИЛЕТЫ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StepBar active={3} />

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">
        <TripSidebar />

        <main className="flex-1 min-w-0 space-y-4 max-w-3xl">
          <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              Персональные данные
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">
                  Фамилия
                </label>
                <input
                  value={buyerLastName}
                  onChange={(e) => setBuyerLastName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">
                  Имя
                </label>
                <input
                  value={buyerFirstName}
                  onChange={(e) => setBuyerFirstName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">
                  Отчество
                </label>
                <input
                  value={buyerPatronymic}
                  onChange={(e) => setBuyerPatronymic(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[10px] text-gray-400 block mb-1">
                Контактный телефон
              </label>
              <input
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className={`${inputCls} max-w-xs`}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">
                E-mail
              </label>
              <input
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className={`${inputCls} max-w-xs`}
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              Способ оплаты
            </h2>

            <div
              className={`border rounded p-4 mb-3 cursor-pointer transition-colors ${payMethod !== "cash" ? "border-[#f5a623] bg-amber-50/30" : "border-gray-200"}`}
              onClick={() => setPayMethod("card")}
            >
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <div
                  className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors ${payMethod !== "cash" ? "border-[#f5a623] bg-[#f5a623]" : "border-gray-300"}`}
                >
                  {payMethod !== "cash" && (
                    <svg
                      className="w-2.5 h-2.5 text-black"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600">Онлайн</span>
              </label>

              <div className="flex gap-8 pl-7">
                {(
                  [
                    { key: "card", label: "Банковской\nкартой" },
                    { key: "paypal", label: "PayPal" },
                    { key: "qiwi", label: "Visa QIWI Wallet" },
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPayMethod(key);
                      setOnlineMethod(key);
                    }}
                    className={`text-sm font-semibold whitespace-pre-line text-left transition-colors ${payMethod === key ? "text-[#f5a623]" : "text-gray-700 hover:text-[#f5a623]"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`border rounded p-4 cursor-pointer transition-colors ${payMethod === "cash" ? "border-[#f5a623] bg-amber-50/30" : "border-gray-200"}`}
              onClick={() => setPayMethod("cash")}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors ${payMethod === "cash" ? "border-[#f5a623] bg-[#f5a623]" : "border-gray-300"}`}
                >
                  {payMethod === "cash" && (
                    <svg
                      className="w-2.5 h-2.5 text-black"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm font-semibold ${payMethod === "cash" ? "text-[#f5a623]" : "text-gray-700"}`}
                >
                  Наличными
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => navigate("/review")}
              className="bg-[#f5a623] hover:bg-[#f5a623] hover:shadow-lg hover:shadow-[#f5a623]/50 active:bg-transparent active:text-[#f5a623] active:border active:border-[#f5a623] text-white font-bold text-sm py-3 px-10 tracking-widest rounded transition-all"
            >
              КУПИТЬ БИЛЕТЫ
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
