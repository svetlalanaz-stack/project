import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StepBar from "@/components/StepBar";
import { useBooking, type PassengerData } from "@/context/BookingContext";

const DOC_TYPES = [
  "Паспорт РФ",
  "Заграничный паспорт",
  "Свидетельство о рождении",
  "Военный билет",
];

function PassengerForm({
  index,
  data,
  onChange,
  onRemove,
}: {
  index: number;
  data: PassengerData;
  onChange: (d: Partial<PassengerData>) => void;
  onRemove: () => void;
}) {
  const inputCls =
    "w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] transition-colors";

  const validate = () => {
    if (!data.docNumber) {
      onChange({ status: "error" });
      return;
    }
    if (
      data.docType === "Свидетельство о рождении" &&
      !data.docNumber.match(/^[IVX]+-[А-Я]{2}-\d+$/i)
    ) {
      onChange({ status: "error" });
      return;
    }
    onChange({ status: "ok" });
  };

  return (
    <div
      className={`border rounded mb-4 overflow-hidden ${data.status === "ok" ? "border-green-300" : "border-gray-200"}`}
    >
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange({ expanded: !data.expanded })}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
              data.expanded
                ? "border-[#f5a623] text-[#f5a623]"
                : "border-gray-300 text-gray-400"
            }`}
          >
            {data.expanded ? "−" : "+"}
          </button>
          <span className="text-sm font-semibold text-gray-800">
            Пассажир {index + 1}
          </span>
        </div>
        {index > 0 && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {data.expanded && (
        <div className="p-5 bg-white space-y-4">
          <div className="relative w-40">
            <select
              value={data.type}
              onChange={(e) =>
                onChange({ type: e.target.value as PassengerData["type"] })
              }
              className={`${inputCls} appearance-none pr-8 bg-white`}
            >
              <option>Взрослый</option>
              <option>Детский</option>
            </select>
            <svg
              className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">
                Фамилия
              </label>
              <input
                value={data.lastName}
                onChange={(e) => onChange({ lastName: e.target.value })}
                className={inputCls}
                placeholder="Фамилия"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">
                Имя
              </label>
              <input
                value={data.firstName}
                onChange={(e) => onChange({ firstName: e.target.value })}
                className={inputCls}
                placeholder="Имя"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">
                Отчество
              </label>
              <input
                value={data.patronymic}
                onChange={(e) => onChange({ patronymic: e.target.value })}
                className={inputCls}
                placeholder="Отчество"
              />
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">
                Пол
              </label>
              <div className="flex">
                {(["М", "Ж"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => onChange({ gender: g })}
                    className={`w-10 h-9 text-sm font-bold border transition-colors
                      ${data.gender === g ? "bg-[#f5a623] border-[#f5a623] text-black" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}
                      ${g === "М" ? "rounded-l" : "rounded-r -ml-px"}
                    `}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 block mb-1">
                Дата рождения
              </label>
              <input
                value={data.dob}
                onChange={(e) => onChange({ dob: e.target.value })}
                placeholder="ДД/ММ/ГГ"
                className={inputCls}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.limited}
              onChange={(e) => onChange({ limited: e.target.checked })}
              className="accent-[#f5a623] w-4 h-4"
            />
            <span className="text-sm text-gray-600">
              ограниченная подвижность
            </span>
          </label>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">
                Тип документа
              </label>
              <div className="relative">
                <select
                  value={data.docType}
                  onChange={(e) => onChange({ docType: e.target.value })}
                  className={`${inputCls} appearance-none pr-8 bg-white`}
                >
                  {DOC_TYPES.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {data.docType === "Паспорт РФ" && (
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">
                  Серия
                </label>
                <input
                  value={data.docSeries}
                  onChange={(e) => onChange({ docSeries: e.target.value })}
                  className={inputCls}
                  placeholder=""
                />
              </div>
            )}
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">
                Номер
              </label>
              <input
                value={data.docNumber}
                onChange={(e) => {
                  onChange({ docNumber: e.target.value, status: "idle" });
                }}
                onBlur={validate}
                className={`${inputCls} ${data.status === "error" ? "border-red-400 bg-red-50" : ""} ${data.status === "ok" ? "border-green-400" : ""}`}
                placeholder={
                  data.docType === "Свидетельство о рождении"
                    ? "12 символов"
                    : ""
                }
              />
            </div>
          </div>

          {data.status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded px-4 py-3 text-xs text-red-600 flex items-start gap-2">
              <svg
                className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Номер свидетельства о рождении указан некорректно
                <br />
                <strong>Пример: VIII-ЬП-123456</strong>
              </span>
            </div>
          )}
          {data.status === "ok" && (
            <div className="bg-green-50 border border-green-300 rounded px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-green-700">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Готово
              </div>
              <button className="border border-gray-300 text-gray-700 text-xs px-4 py-1.5 hover:bg-gray-50">
                Следующий пассажир
              </button>
            </div>
          )}

          {data.status === "idle" && (
            <div className="flex justify-end">
              <button
                onClick={validate}
                className="border border-gray-300 text-gray-700 text-xs px-4 py-1.5 hover:bg-gray-50"
              >
                Следующий пассажир
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PassengersPage() {
  const navigate = useNavigate();
  const {
    from,
    to,
    dateThere,
    dateBack,
    selectedTrain,
    passengers,
    setPassengers,
    totalPrice,
  } = useBooking();

  const update = (i: number, patch: Partial<PassengerData>) => {
    setPassengers(
      passengers.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    );
  };

  const remove = (i: number) => {
    setPassengers(passengers.filter((_, idx) => idx !== i));
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      {
        type: "Взрослый",
        lastName: "",
        firstName: "",
        patronymic: "",
        gender: "М",
        dob: "",
        limited: false,
        docType: "Паспорт РФ",
        docSeries: "",
        docNumber: "",
        expanded: true,
        status: "idle",
      },
    ]);
  };

  const allValid = passengers.every((p) => p.status === "ok");

  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="min-h-screen bg-gray-100 text-gray-900"
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
                    placeholder="Откуда"
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
                    placeholder="Куда"
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

      <StepBar active={2} />

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">
        <aside className="w-60 flex-shrink-0">
          <div className="bg-[#1e1e1e] rounded p-4 text-white text-xs">
            <h3 className="font-black tracking-widest text-[10px] uppercase mb-4">
              Детали поездки
            </h3>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#f5a623] text-black text-[10px] font-bold px-1.5 py-0.5">
                  →
                </span>
                <span className="font-semibold">Туда</span>
                <span className="text-gray-400 ml-auto">{dateThere}</span>
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
              <div className="space-y-0.5 text-gray-300">
                <div className="flex justify-between">
                  <span>№ Поезда</span>
                  <span className="text-white font-semibold">
                    {selectedTrain?.number ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Название</span>
                  <span className="text-white text-right whitespace-pre-line">
                    {selectedTrain?.route ?? "—"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 my-3">
                <div>
                  <div className="text-base font-bold">
                    {selectedTrain?.depTime ?? "—"}
                  </div>
                  <div className="text-[10px] text-gray-500">{dateThere}</div>
                  <div className="text-[10px] text-gray-400 whitespace-pre-line">
                    {selectedTrain?.depStation ?? ""}
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 h-px bg-gray-600" />
                  <svg
                    className="w-3 h-3 text-[#f5a623]"
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
                  <div className="text-base font-bold">
                    {selectedTrain?.arrTime ?? "—"}
                  </div>
                  <div className="text-[10px] text-gray-500">{dateThere}</div>
                  <div className="text-[10px] text-gray-400 whitespace-pre-line">
                    {selectedTrain?.arrStation ?? ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-gray-500 text-white text-[10px] font-bold px-1.5 py-0.5">
                  ←
                </span>
                <span className="font-semibold">Обратно</span>
                <span className="text-gray-400 ml-auto">{dateBack}</span>
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
              <div className="space-y-0.5 text-gray-300">
                <div className="flex justify-between">
                  <span>№ Поезда</span>
                  <span className="text-white font-semibold">
                    {selectedTrain?.number ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Название</span>
                  <span className="text-white text-right whitespace-pre-line">
                    {selectedTrain?.route ?? "—"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 my-3">
                <div>
                  <div className="text-base font-bold">
                    {selectedTrain?.returnDepTime ??
                      selectedTrain?.depTime ??
                      "—"}
                  </div>
                  <div className="text-[10px] text-gray-500">{dateBack}</div>
                  <div className="text-[10px] text-gray-400 whitespace-pre-line">
                    {selectedTrain?.returnDepStation ??
                      selectedTrain?.depStation ??
                      ""}
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 h-px bg-gray-600" />
                  <svg
                    className="w-3 h-3 text-gray-400 rotate-180"
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
                  <div className="text-base font-bold">
                    {selectedTrain?.returnArrTime ??
                      selectedTrain?.arrTime ??
                      "—"}
                  </div>
                  <div className="text-[10px] text-gray-500">{dateBack}</div>
                  <div className="text-[10px] text-gray-400 whitespace-pre-line">
                    {selectedTrain?.returnArrStation ??
                      selectedTrain?.arrStation ??
                      ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-3.5 h-3.5 text-[#f5a623]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="font-semibold">Пассажиры</span>
              </div>
              <div className="flex justify-between text-gray-300 mb-0.5">
                <span>
                  {passengers.filter((p) => p.type === "Взрослый").length}{" "}
                  Взрослых
                </span>
                <span className="text-white">—</span>
              </div>
              <div className="flex justify-between text-gray-300 mb-3">
                <span>
                  {passengers.filter((p) => p.type === "Детский").length} Детей
                </span>
                <span className="text-white">—</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-3">
                <span className="font-semibold text-sm">ИТОГ</span>
                <span className="text-[#f5a623] text-xl font-black">
                  {totalPrice.toLocaleString()} ₽
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 max-w-3xl">
          {passengers.map((p, i) => (
            <PassengerForm
              key={i}
              index={i}
              data={p}
              onChange={(patch) => update(i, patch)}
              onRemove={() => remove(i)}
            />
          ))}

          {passengers.length < 3 && (
            <div className="border border-gray-200 rounded mb-4 bg-white">
              <div className="flex items-center px-5 py-3">
                <button
                  onClick={addPassenger}
                  className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-400 mr-3"
                >
                  +
                </button>
                <span className="text-sm font-semibold text-gray-500">
                  Пассажир {passengers.length + 1}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={addPassenger}
            className="w-full border border-gray-200 bg-white rounded py-3 px-5 flex items-center justify-between text-sm text-gray-600 hover:bg-gray-50 transition-colors mb-6"
          >
            <span>Добавить пассажира</span>
            <span className="text-[#f5a623] text-lg font-light">+</span>
          </button>

          <div className="flex justify-end">
            <button
              onClick={() => allValid && navigate("/payment")}
              className={`font-bold text-sm px-10 py-3 tracking-widest rounded transition-all ${
                allValid
                  ? "bg-[#f5a623] hover:bg-[#f5a623] hover:shadow-lg hover:shadow-[#f5a623]/50 active:bg-transparent active:text-[#f5a623] active:border active:border-[#f5a623] text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              ДАЛЕЕ
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
