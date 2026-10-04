import { useBooking, type Train } from "@/context/BookingContext";

export default function TripSidebar() {
  const {
    dateThere,
    dateBack,
    selectedTrainForward,
    selectedTrainBack,
    passengers,
    totalPrice,
  } = useBooking();

  const adultsCount = passengers.filter((p) => p.type === "Взрослый").length;
  const childrenCount = passengers.filter((p) => p.type === "Детский").length;

  const adultsPrice = adultsCount > 0 ? Math.round(totalPrice * (2 / 3)) : 0;
  const childrenPrice = childrenCount > 0 ? totalPrice - adultsPrice : 0;

  return (
    <aside className="w-60 flex-shrink-0">
      <div className="bg-[#1e1e1e] rounded p-4 text-white text-xs">
        <h3 className="font-black tracking-widest text-[10px] uppercase mb-4">
          Детали поездки
        </h3>

        <TripBlock
          direction="forward"
          train={selectedTrainForward}
          date={dateThere}
        />

        <div className="border-t border-white/10 pt-4 mt-2">
          <TripBlock
            direction="return"
            train={selectedTrainBack}
            date={dateBack}
          />
        </div>

        <div className="border-t border-white/10 pt-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-3.5 h-3.5 text-[#f5a623]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-semibold text-sm">Пассажиры</span>
            <svg
              className="w-3 h-3 text-gray-400 ml-auto"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>

          {adultsCount > 0 && (
            <div className="flex justify-between text-gray-300 mb-0.5">
              <span>
                {adultsCount} {adultsCount === 1 ? "Взрослый" : "Взрослых"}
              </span>
              <span className="text-white">
                {adultsPrice.toLocaleString()} ₽
              </span>
            </div>
          )}

          {childrenCount > 0 && (
            <div className="flex justify-between text-gray-300 mb-3">
              <span>
                {childrenCount} {childrenCount === 1 ? "Ребёнок" : "Детей"}
              </span>
              <span className="text-white">
                {childrenPrice.toLocaleString()} ₽
              </span>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-white/10 pt-3">
            <span className="font-semibold text-sm">ИТОГ</span>
            <span className="text-[#f5a623] text-xl font-black">
              {totalPrice.toLocaleString()} ₽
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TripBlock({
  direction,
  train,
  date,
}: {
  direction: "forward" | "return";
  train: Train | null;
  date: string;
}) {
  const isForward = direction === "forward";

  if (!train) {
    return (
      <div className="text-gray-400 text-xs">
        {isForward ? "Туда" : "Обратно"}: поезд не выбран
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 ${
            isForward ? "bg-[#f5a623] text-black" : "bg-gray-500 text-white"
          }`}
        >
          {isForward ? "→" : "←"}
        </span>
        <span className="font-semibold text-sm">
          {isForward ? "Туда" : "Обратно"}
        </span>
        <span className="text-gray-400 ml-auto">{date}</span>
        <svg
          className="w-3 h-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>
      <div className="space-y-0.5 text-gray-300 mb-2">
        <div className="flex justify-between">
          <span>№ Поезда</span>
          <span className="text-white font-semibold">{train.number}</span>
        </div>
        <div className="flex justify-between">
          <span>Название</span>
          <span className="text-white text-right whitespace-pre-line">
            {train.route}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 my-2">
        <div>
          <div className="text-sm font-bold">{train.depTime}</div>
          <div className="text-[10px] text-gray-500">{date}</div>
          <div className="text-[10px] text-gray-400 whitespace-pre-line">
            {train.depStation}
          </div>
        </div>
        <div className="flex-1 flex items-center gap-1">
          <div className="flex-1 h-px bg-gray-600" />
          <svg
            className={`w-3 h-3 text-[#f5a623] ${isForward ? "" : "rotate-180"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1 h-px bg-gray-600" />
        </div>
        <div>
          <div className="text-sm font-bold">{train.arrTime}</div>
          <div className="text-[10px] text-gray-500">{date}</div>
          <div className="text-[10px] text-gray-400 whitespace-pre-line text-right">
            {train.arrStation}
          </div>
        </div>
      </div>
    </div>
  );
}
