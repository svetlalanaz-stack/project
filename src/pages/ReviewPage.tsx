import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StepBar from "@/components/StepBar";
import TripSidebar from "@/components/TripSidebar";
import {
  useBooking,
  type PassengerData,
  type TrainClass,
} from "@/context/BookingContext";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function passengerName(p: PassengerData): string {
  return [p.lastName, p.firstName, p.patronymic].filter(Boolean).join(" ");
}

function genderText(p: PassengerData): string {
  return p.gender === "Ж" ? "Пол женский" : "Пол мужской";
}

function dobText(p: PassengerData): string {
  return p.dob ? `Дата рождения ${p.dob}` : "Дата рождения не указана";
}

function docText(p: PassengerData): string {
  if (p.docType === "Паспорт РФ") {
    return `Паспорт РФ ${p.docSeries} ${p.docNumber}`.trim();
  }
  return `${p.docType} ${p.docNumber}`.trim();
}

/** Человекочитаемый способ оплаты */
function payMethodText(m: string): string {
  switch (m) {
    case "card":
      return "Банковской картой";
    case "paypal":
      return "PayPal";
    case "qiwi":
      return "Visa QIWI Wallet";
    case "cash":
      return "Наличными";
    default:
      return "Не выбрано";
  }
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const {
    from,
    to,
    dateThere,
    dateBack,
    selectedTrainForward,
    passengers,
    payMethod,
    totalPrice,
  } = useBooking();

  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="min-h-screen bg-gray-100"
    >
      <div
        className="relative w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(public/images/train-background-search.png)`,
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

      <StepBar active={4} />

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">
        <TripSidebar />

        <main className="flex-1 min-w-0 max-w-3xl">
          <Section title="Поезд">
            <div className="border border-gray-100 rounded">
              <div className="flex">
                <div className="w-28 bg-gray-200 border-r border-gray-100 flex flex-col items-center justify-center p-4 flex-shrink-0">
                  <div className="mb-2">
                    <svg
                      className="w-10 h-10"
                      viewBox="0 0 86 86"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M55.7879 63.7038C56.7164 65.6856 59.433 66.369 59.5361 69C48.4635 69 37.5284 69 26.4557 69C26.6277 66.4031 29.2755 65.6856 30.2727 63.7379C29.3786 63.5329 28.5534 63.3962 27.7625 63.157C23.8423 61.9611 21.057 58.3392 21.057 54.2047C20.9882 45.389 20.9882 36.6416 21.0226 27.8601C21.0226 23.794 22.9139 20.7187 26.7308 19.3861C29.8257 18.3269 33.1268 17.6777 36.3936 17.3701C42.7896 16.7893 49.22 16.7893 55.5472 18.1219C57.1634 18.4636 58.7452 19.0444 60.1895 19.762C63.2843 21.2996 64.9005 23.9306 64.9349 27.3134C65.0037 36.3683 65.0381 45.4232 64.9349 54.478C64.9005 58.6467 61.8057 62.2003 57.748 63.2254C57.129 63.4304 56.4757 63.5329 55.7879 63.7038ZM40.1762 28.1676C35.5683 28.1676 31.0636 28.1676 26.6277 28.1676C26.6277 32.7463 26.6277 37.1884 26.6277 41.6304C31.2012 41.6304 35.6371 41.6304 40.1762 41.6304C40.1762 37.12 40.1762 32.7122 40.1762 28.1676ZM59.433 28.1676C54.8251 28.1676 50.3204 28.1676 45.8844 28.1676C45.8844 32.7463 45.8844 37.1884 45.8844 41.6304C50.4579 41.6304 54.8939 41.6304 59.433 41.6304C59.433 37.12 59.433 32.7122 59.433 28.1676ZM34.743 54.068C34.7774 51.8128 32.8861 49.9335 30.6166 49.9335C28.4158 49.9335 26.5589 51.7103 26.4901 53.8972C26.4214 56.1523 28.2439 58.0658 30.5134 58.1342C32.8174 58.1683 34.7086 56.3232 34.743 54.068ZM59.5017 53.9997C59.5017 51.7445 57.5761 49.8993 55.3065 49.9335C53.1057 49.9677 51.2832 51.7787 51.2488 53.9655C51.2144 56.2207 53.0713 58.1 55.3409 58.1342C57.6448 58.1342 59.5017 56.2548 59.5017 53.9997Z"
                        fill="white"
                      />
                      <circle
                        cx="43"
                        cy="43"
                        r="42"
                        stroke="white"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div className="text-sm font-bold text-gray-700">
                    {selectedTrainForward?.number ?? "—"}
                  </div>
                  <div className="text-[9px] text-gray-400 text-center mt-1 whitespace-pre-line leading-tight">
                    {selectedTrainForward?.route ?? ""}
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-base font-bold">
                        {selectedTrainForward?.depTime ?? "—"}
                      </div>
                      <div className="text-[10px] text-gray-400 whitespace-pre-line">
                        {selectedTrainForward?.depStation ?? ""}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-1 text-[10px] text-gray-400">
                      <div className="flex-1 h-px bg-gray-300" />
                      <svg
                        className="w-3.5 h-3.5 text-[#f5a623]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <div>
                      <div className="text-base font-bold">
                        {selectedTrainForward?.arrTime ?? "—"}
                      </div>
                      <div className="text-[10px] text-gray-400 whitespace-pre-line text-right">
                        {selectedTrainForward?.arrStation ?? ""}
                      </div>
                    </div>
                  </div>

                  {selectedTrainForward?.returnDepTime && (
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-base font-bold">
                          {selectedTrainForward.returnDepTime}
                        </div>
                        <div className="text-[10px] text-gray-400 whitespace-pre-line">
                          {selectedTrainForward.returnDepStation}
                        </div>
                      </div>
                      <div className="flex-1 flex items-center gap-1">
                        <div className="flex-1 h-px bg-gray-300" />
                        <svg
                          className="w-3.5 h-3.5 text-gray-400 rotate-180"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="flex-1 h-px bg-gray-300" />
                      </div>
                      <div>
                        <div className="text-base font-bold">
                          {selectedTrainForward.returnArrTime}
                        </div>
                        <div className="text-[10px] text-gray-400 whitespace-pre-line text-right">
                          {selectedTrainForward.returnArrStation}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-44 border-l border-gray-100 p-4 flex flex-col justify-between flex-shrink-0">
                  <div className="space-y-1">
                    {(selectedTrainForward?.classes ?? []).map(
                      (cls: TrainClass) => (
                        <div
                          key={cls.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-500">{cls.name}</span>
                          <span className="text-gray-400 text-[10px]">
                            <span className="text-[#f5a623] mr-1">
                              {cls.count}
                            </span>
                            от {cls.price.toLocaleString()}{" "}
                            <span className="text-[#f5a623]">₽</span>
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="flex justify-center gap-2 my-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-3 h-3 text-gray-300">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="10" cy="10" r="8" />
                        </svg>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/seats")}
                    className="w-full border border-gray-300 text-gray-700 text-xs py-1.5 hover:bg-gray-50 transition-colors"
                  >
                    Изменить
                  </button>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Пассажиры">
            <div className="space-y-4">
              {passengers.map((p, i) => (
                <div
                  key={i}
                  className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="w-10 h-10 rounded-full bg-[#f5a623]/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-[#f5a623]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-800 mb-0.5">
                      {passengerName(p) || `Пассажир ${i + 1}`}
                    </div>
                    <div className="text-[10px] text-gray-400 leading-relaxed">
                      {genderText(p)}
                      <br />
                      {dobText(p)}
                      <br />
                      {docText(p)}
                    </div>
                    {i === passengers.length - 1 && (
                      <div className="mt-2 text-sm font-semibold text-gray-700">
                        Всего{" "}
                        <span className="text-[#f5a623]">
                          {totalPrice.toLocaleString()} ₽
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    {p.type}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate("/passengers")}
                className="border border-gray-300 text-gray-700 text-xs px-6 py-1.5 hover:bg-gray-50 transition-colors"
              >
                Изменить
              </button>
            </div>
          </Section>

          <div className="bg-white border border-gray-200 rounded p-6 mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Способ оплаты
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {payMethodText(payMethod)}
              </span>
              <button
                onClick={() => navigate("/payment")}
                className="border border-gray-300 text-gray-700 text-xs px-6 py-1.5 hover:bg-gray-50 transition-colors"
              >
                Изменить
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => navigate("/success")}
              className="bg-[#f5a623] hover:bg-[#f5a623] hover:shadow-lg hover:shadow-[#f5a623]/50 active:bg-transparent active:text-[#f5a623] active:border active:border-[#f5a623] text-white font-bold text-sm px-10 py-3 tracking-widest rounded transition-all"
            >
              ПОДТВЕРДИТЬ
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
