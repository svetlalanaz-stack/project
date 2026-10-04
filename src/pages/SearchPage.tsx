import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StepBar from "@/components/StepBar";
import { fetchLastRoutes, type RecentTicket } from "@/api/last";

import { useBooking, type Train } from "@/context/BookingContext";

const CITIES = [
  "АНГАРСК",
  "АРХАНГЕЛЬСК",
  "АСТРАХАНЬ",
  "БАРНАУЛ",
  "БЕЛГОРОД",
  "БЛАГОВЕЩЕНСК",
  "БРАТСК",
  "БРЯНСК",
  "ВЕЛИКИЙ НОВГОРОД",
];

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const TRAINS: Train[] = [
  {
    number: "116С",
    route: "Адлер → Москва\nСанкт-Петербург",
    depTime: "00:10",
    depDate: "9:42",
    arrTime: "09:52",
    depStation: "Москва\nКурский вокзал",
    arrStation: "Санкт-Петербург\nЛадожский вокзал",
    hasWifi: true,
    isExpress: false,
    classes: [
      { name: "Сидячий", count: 88, price: 1920 },
      { name: "Плацкарт", count: 52, price: 2530 },
      { name: "Купе", count: 24, price: 3820 },
      { name: "Люкс", count: 15, price: 4950 },
    ],
    returnDepTime: "00:10",
    returnArrTime: "09:52",
    returnDepStation: "Москва\nКурский вокзал",
    returnArrStation: "Санкт-Петербург\nЛадожский вокзал",
  },
  {
    number: "020У",
    route: "Москва →\nСанкт-Петербург\n«Мегаполис»",
    depTime: "00:20",
    depDate: "8:39",
    arrTime: "08:59",
    depStation: "Москва\nЛенинградский вокзал",
    arrStation: "Санкт-Петербург\nМосковский вокзал",
    hasWifi: true,
    isExpress: true,
    classes: [
      { name: "Купе", count: 90, price: 3950 },
      { name: "Люкс", count: 31, price: 4950 },
    ],
    returnDepTime: null,
    returnArrTime: null,
    returnDepStation: null,
    returnArrStation: null,
  },
  {
    number: "116С",
    route: "Нижний Новгород →\nМосква →\nСанкт-Петербург\n«Волга»",
    depTime: "00:41",
    depDate: "8:32",
    arrTime: "09:13",
    depStation: "Москва\nКурский вокзал",
    arrStation: "Санкт-Петербург\nЛадожский вокзал",
    hasWifi: false,
    isExpress: false,
    classes: [
      { name: "Плацкарт", count: 52, price: 2530 },
      { name: "Купе", count: 24, price: 3820 },
      { name: "Люкс", count: 15, price: 4950 },
    ],
    returnDepTime: "00:41",
    returnArrTime: "09:13",
    returnDepStation: "Москва\nЛенинградский вокзал",
    returnArrStation: "Санкт-Петербург\nЛадожский вокзал",
  },
  {
    number: "116Д",
    route: "Санкт-Петербург →\nМосква",
    depTime: "22:10",
    depDate: "9:42",
    arrTime: "06:30",
    depStation: "Санкт-Петербург\nМосковский вокзал",
    arrStation: "Москва\nЛенинградский вокзал",
    hasWifi: true,
    isExpress: false,
    classes: [
      { name: "Сидячий", count: 60, price: 1990 },
      { name: "Плацкарт", count: 48, price: 2690 },
      { name: "Купе", count: 30, price: 3990 },
      { name: "Люкс", count: 12, price: 5100 },
    ],
    returnDepTime: null,
    returnArrTime: null,
    returnDepStation: null,
    returnArrStation: null,
  },
];

const ALL_TRAINS = [...TRAINS, ...TRAINS, ...TRAINS];

const PER_PAGE = 3;

function getMonthDays(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();
  const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const weeks = [];
  let week = [];

  for (let i = 0; i < startOffset; i++) week.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  while (week.length < 7 && week.length > 0) week.push(null);
  if (week.length > 0) weeks.push(week);
  return weeks;
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-9 h-1 rounded-full transition-colors flex items-center ${on ? "bg-[#f5a623]" : "bg-gray-500"} ${on ? "justify-end" : "justify-start"}`}
    >
      <span className="w-3 h-3 bg-white rounded-full shadow transition-all" />
    </button>
  );
}

function RangeSlider({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const thumbCls =
    "absolute top-0 w-full h-4 appearance-none bg-transparent pointer-events-none " +
    "[&::-webkit-slider-thumb]:pointer-events-auto " +
    "[&::-webkit-slider-thumb]:appearance-none " +
    "[&::-webkit-slider-thumb]:w-4 " +
    "[&::-webkit-slider-thumb]:h-4 " +
    "[&::-webkit-slider-thumb]:rounded-full " +
    "[&::-webkit-slider-thumb]:bg-white " +
    "[&::-webkit-slider-thumb]:cursor-pointer " +
    "[&::-webkit-slider-thumb]:border-none " +
    "[&::-moz-range-thumb]:pointer-events-auto " +
    "[&::-moz-range-thumb]:w-4 " +
    "[&::-moz-range-thumb]:h-4 " +
    "[&::-moz-range-thumb]:rounded-full " +
    "[&::-moz-range-thumb]:bg-white " +
    "[&::-moz-range-thumb]:border-none " +
    "[&::-moz-range-thumb]:cursor-pointer";

  return (
    <div className="relative h-5 flex items-center">
      <div className="absolute left-0 right-0 h-1.5 rounded-full bg-gray-600" />
      <div
        className="absolute h-1.5 rounded-full bg-[#f5a623]"
        style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange([Math.min(v, hi - step), hi]);
        }}
        className={thumbCls}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange([lo, Math.max(v, lo + step)]);
        }}
        className={thumbCls}
      />
    </div>
  );
}

function CalendarWidget({
  selectedDay,
  onSelect,
}: {
  selectedDay: number | null;
  onSelect: (d: number) => void;
}) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());

  const monthName = new Date(currentYear, currentMonth).toLocaleString("ru", {
    month: "long",
  });
  const days = getMonthDays(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  return (
    <div className="bg-white rounded p-3 select-none shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevMonth}
          className="text-gray-700 hover:text-[#f5a623] px-1 text-lg transition-colors"
        >
          ‹
        </button>
        <span className="text-gray-800 text-sm font-medium">
          {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {currentYear}
        </span>
        <button
          onClick={nextMonth}
          className="text-gray-700 hover:text-[#f5a623] px-1 text-lg transition-colors"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] text-gray-500 py-0.5">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.flat().map((day, i) => {
          const isSel = day === selectedDay;
          const isToday =
            day === new Date().getDate() &&
            currentMonth === new Date().getMonth() &&
            currentYear === new Date().getFullYear();
          return (
            <button
              key={i}
              onClick={() => day && onSelect(day)}
              className={`text-center text-xs py-1 rounded transition-colors
                ${!day ? "invisible" : ""}
                ${isSel ? "bg-[#f5a623] text-black font-bold" : ""}
                ${isToday && !isSel ? "border border-[#f5a623] text-[#f5a623]" : ""}
                ${!isSel && !isToday && day ? "text-gray-700 hover:bg-gray-100" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TrainAmenities() {
  return (
    <div className="flex justify-end gap-1.5">
      <svg
        className="w-3.5 h-3.5 text-gray-300"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        viewBox="0 0 24 24"
      >
        <path d="M2.5 8.5a15 15 0 0119 0" />
        <path d="M5.5 12a10.5 10.5 0 0113 0" />
        <path d="M8.5 15.5a6 6 0 017 0" />
        <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      <svg
        className="w-3.5 h-3.5 text-gray-300"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
      <svg
        className="w-3.5 h-3.5 text-gray-300"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M2 4a1 1 0 011-1h11a1 1 0 011 1v1h1.5a2.5 2.5 0 010 5H15v1a3 3 0 01-3 3H6a3 3 0 01-3-3V4zm13 4h1.5a.5.5 0 000-1H15v1z"
          clipRule="evenodd"
        />
        <path d="M4 16a1 1 0 100 2h9a1 1 0 100-2H4z" />
      </svg>
    </div>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const {
    from,
    to,
    dateThere,
    dateBack,
    setFrom,
    setTo,
    setDateThere,
    setDateBack,
    setSelectedTrainForward,
    setSelectedTrainBack,
  } = useBooking();

  const [showDropdownFrom, setShowDropdownFrom] = useState(false);
  const [showDropdownTo, setShowDropdownTo] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState<"there" | "back" | null>(
    null,
  );
  const [openHeroCalendar, setOpenHeroCalendar] = useState<
    "there" | "back" | null
  >(null);
  const [filters, setFilters] = useState({
    kupe: true,
    platz: false,
    sidyach: false,
    lyuks: false,
    wifi: true,
    express: false,
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([1920, 7000]);

  const [openDirection, setOpenDirection] = useState<{
    there: boolean;
    back: boolean;
  }>({ there: false, back: false });
  const [thereDepRange, setThereDepRange] = useState<[number, number]>([0, 24]);
  const [thereArrRange, setThereArrRange] = useState<[number, number]>([0, 24]);
  const [backDepRange, setBackDepRange] = useState<[number, number]>([0, 24]);
  const [backArrRange, setBackArrRange] = useState<[number, number]>([0, 24]);

  const [page, setPage] = useState(1);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [recentError, setRecentError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("времени");

  const heroFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        heroFormRef.current &&
        !heroFormRef.current.contains(e.target as Node)
      ) {
        setOpenHeroCalendar(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchLastRoutes()
      .then(setRecentTickets)
      .catch((err) =>
        setRecentError(err instanceof Error ? err.message : "Ошибка"),
      );
  }, []);

  const parseDayFromString = (s: string): number | null => {
    if (!s) return null;
    const parts = s.split(".");
    if (parts.length < 3) return null;
    const day = Number(parts[0]);
    return Number.isNaN(day) ? null : day;
  };

  const formatDate = (day: number | null) => {
    if (!day) return "";
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${dd}.${mm}.${date.getFullYear()}`;
  };

  const dayThere = parseDayFromString(dateThere);
  const dayBack = parseDayFromString(dateBack);

  const handleSelectTrain = (train: Train) => {
    setSelectedTrainForward(train);

    const PAIRS: Record<string, string> = {
      "116С": "116Д",
      "116Д": "116С",
      "020У": "020У",
    };
    const backNumber = PAIRS[train.number] ?? train.number;
    const back = TRAINS.find((t) => t.number === backNumber) ?? train;

    setSelectedTrainBack(back);
    navigate("/seats");
  };

  const hourOf = (t: string | null): number | null => {
    if (!t) return null;
    return Number(t.split(":")[0]);
  };
  const formatHour = (h: number) => `${h}:00`;

  const CLASS_FILTER_MAP: Record<string, string> = {
    kupe: "Купе",
    platz: "Плацкарт",
    sidyach: "Сидячий",
    lyuks: "Люкс",
  };

  const selectedClassNames = Object.entries(CLASS_FILTER_MAP)
    .filter(([key]) => filters[key as keyof typeof filters])
    .map(([, name]) => name);

  const isThereFilterActive =
    thereDepRange[0] > 0 ||
    thereDepRange[1] < 24 ||
    thereArrRange[0] > 0 ||
    thereArrRange[1] < 24;
  const isBackFilterActive =
    backDepRange[0] > 0 ||
    backDepRange[1] < 24 ||
    backArrRange[0] > 0 ||
    backArrRange[1] < 24;

  const filteredTrains = ALL_TRAINS.filter((train) => {
    if (selectedClassNames.length > 0) {
      const hasClass = train.classes.some((c) =>
        selectedClassNames.includes(c.name),
      );
      if (!hasClass) return false;
    }
    if (filters.wifi && !train.hasWifi) return false;
    if (filters.express && !train.isExpress) return false;

    const minTrainPrice = Math.min(...train.classes.map((c) => c.price));
    if (minTrainPrice < priceRange[0] || minTrainPrice > priceRange[1])
      return false;

    if (isThereFilterActive) {
      const depH = hourOf(train.depTime);
      const arrH = hourOf(train.arrTime);
      if (depH === null || arrH === null) return false;
      if (depH < thereDepRange[0] || depH > thereDepRange[1]) return false;
      if (arrH < thereArrRange[0] || arrH > thereArrRange[1]) return false;
    }

    if (isBackFilterActive) {
      const depH = hourOf(train.returnDepTime);
      const arrH = hourOf(train.returnArrTime);
      if (depH === null || arrH === null) return false;
      if (depH < backDepRange[0] || depH > backDepRange[1]) return false;
      if (arrH < backArrRange[0] || arrH > backArrRange[1]) return false;
    }

    return true;
  });

  const timeToMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const getMinPrice = (train: Train) =>
    Math.min(...train.classes.map((c) => c.price));
  const getDuration = (train: Train) => {
    const dep = timeToMin(train.depTime);
    let arr = timeToMin(train.arrTime);
    if (arr < dep) arr += 24 * 60;
    return arr - dep;
  };

  const sortedTrains = [...filteredTrains].sort((a, b) => {
    if (sortBy === "времени")
      return timeToMin(a.depTime) - timeToMin(b.depTime);
    if (sortBy === "стоимости") return getMinPrice(a) - getMinPrice(b);
    if (sortBy === "длительности") return getDuration(a) - getDuration(b);
    return 0;
  });

  const totalPages = Math.ceil(sortedTrains.length / PER_PAGE) || 1;
  const effectivePage = Math.min(page, totalPages);
  const pagedTrains = sortedTrains.slice(
    (effectivePage - 1) * PER_PAGE,
    effectivePage * PER_PAGE,
  );

  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="min-h-screen bg-gray-100 text-gray-900"
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
          <div ref={heroFormRef} className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-3 items-start justify-center">
              <div>
                <p className="text-gray-300 text-xs mb-1 font-medium tracking-wide">
                  Направление
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-44 relative">
                    <input
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      onFocus={() => setShowDropdownFrom(true)}
                      onBlur={() =>
                        setTimeout(() => setShowDropdownFrom(false), 150)
                      }
                      className="w-full bg-white text-gray-800 text-sm px-3 py-2 outline-none"
                      placeholder="Откуда"
                    />
                    {showDropdownFrom && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-30 max-h-48 overflow-y-auto">
                        <div className="px-3 py-1.5 bg-gray-100 text-xs font-medium text-gray-500">
                          {from.toUpperCase()}
                        </div>
                        {CITIES.map((c) => (
                          <button
                            key={c}
                            onMouseDown={() => {
                              setFrom(c.charAt(0) + c.slice(1).toLowerCase());
                              setShowDropdownFrom(false);
                            }}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 text-gray-700"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setFrom(to);
                      setTo(from);
                    }}
                    className="hover:opacity-80 transition-opacity flex-shrink-0"
                  >
                    <img
                      src="images/search-change-button.png"
                      alt="Поменять направление"
                      className="w-4 h-4 object-contain"
                    />
                  </button>

                  <div className="w-44 relative">
                    <input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      onFocus={() => setShowDropdownTo(true)}
                      onBlur={() =>
                        setTimeout(() => setShowDropdownTo(false), 150)
                      }
                      className="w-full bg-white text-gray-800 text-sm px-3 py-2 outline-none"
                      placeholder="Куда"
                    />
                    {showDropdownTo && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-30 max-h-48 overflow-y-auto">
                        <div className="px-3 py-1.5 bg-gray-100 text-xs font-medium text-gray-500">
                          {to.toUpperCase()}
                        </div>
                        {CITIES.map((c) => (
                          <button
                            key={c}
                            onMouseDown={() => {
                              setTo(c.charAt(0) + c.slice(1).toLowerCase());
                              setShowDropdownTo(false);
                            }}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 text-gray-700"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-300 text-xs mb-1 font-medium tracking-wide">
                  Дата
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      className="bg-white text-gray-800 text-sm px-3 py-2 outline-none w-44 cursor-pointer"
                      placeholder="Дата туда"
                      onClick={() =>
                        setOpenHeroCalendar(
                          openHeroCalendar === "there" ? null : "there",
                        )
                      }
                      readOnly
                      value={dateThere}
                    />
                    <svg
                      className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>

                    {openHeroCalendar === "there" && (
                      <div className="absolute top-full left-0 mt-2 z-50 w-[300px]">
                        <CalendarWidget
                          selectedDay={dayThere}
                          onSelect={(d) => {
                            setDateThere(formatDate(d));
                            setOpenHeroCalendar(null);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      className="bg-white text-gray-800 text-sm px-3 py-2 outline-none w-44 cursor-pointer"
                      placeholder="Дата обратно"
                      onClick={() =>
                        setOpenHeroCalendar(
                          openHeroCalendar === "back" ? null : "back",
                        )
                      }
                      readOnly
                      value={dateBack}
                    />
                    <svg
                      className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>

                    {openHeroCalendar === "back" && (
                      <div className="absolute top-full right-0 mt-2 z-50 w-[300px]">
                        <CalendarWidget
                          selectedDay={dayBack}
                          onSelect={(d) => {
                            setDateBack(formatDate(d));
                            setOpenHeroCalendar(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => navigate("/search")}
                    className="w-44 bg-[#f5a623] hover:bg-[#f5a623] hover:shadow-lg hover:shadow-[#f5a623]/50 active:bg-transparent active:text-[#f5a623] active:border active:border-[#f5a623] text-black font-bold text-sm py-2 rounded transition-all tracking-wide"
                  >
                    НАЙТИ БИЛЕТЫ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StepBar active={1} />

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">
        <aside className="w-60 flex-shrink-0 space-y-4">
          <div className="bg-[#1e1e1e] rounded p-4 text-white">
            <p className="text-xs text-gray-400 font-medium mb-1">
              Дата поездки
            </p>
            <div className="relative mb-3">
              <button
                onClick={() =>
                  setCalendarOpen(calendarOpen === "there" ? null : "there")
                }
                className="w-full text-left bg-white text-gray-900 text-sm px-3 py-1.5 flex items-center justify-between"
              >
                <span>{dateThere || "30.08.2026"}</span>
                <svg
                  className="w-3.5 h-3.5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </button>
              {calendarOpen === "there" && (
                <div className="mt-2">
                  <CalendarWidget
                    selectedDay={dayThere}
                    onSelect={(d) => {
                      setDateThere(formatDate(d));
                      setCalendarOpen(null);
                    }}
                  />
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 font-medium mb-1">
              Дата возвращения
            </p>
            <div className="relative mb-4">
              <button
                onClick={() =>
                  setCalendarOpen(calendarOpen === "back" ? null : "back")
                }
                className="w-full text-left bg-white text-gray-900 text-sm px-3 py-1.5 flex items-center justify-between"
              >
                <span>{dateBack || "09.09.2026"}</span>
                <svg
                  className="w-3.5 h-3.5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </button>
              {calendarOpen === "back" && (
                <div className="mt-2">
                  <CalendarWidget
                    selectedDay={dayBack}
                    onSelect={(d) => {
                      setDateBack(formatDate(d));
                      setCalendarOpen(null);
                    }}
                  />
                </div>
              )}
            </div>

            {[
              {
                key: "kupe",
                label: "Купе",
                icon: (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.53491 0H15.4651C16.3093 0 17 0.695465 17 1.54544V15.4546C17 16.3045 16.3093 17 15.4651 17H1.53491C0.690674 17 0 16.3045 0 15.4546V1.54544C0 0.695465 0.690674 0 1.53491 0ZM13.1243 2.125C12.7021 2.125 12.3567 2.47272 12.3567 2.89774V4H15.2922V2.89774C15.2922 2.47272 14.947 2.125 14.5249 2.125H13.1243ZM15.2922 5H12.3567V10.0454C12.3567 10.4705 12.7021 10.8182 13.1243 10.8182H14.5249C14.947 10.8182 15.2922 10.4705 15.2922 10.0454V5ZM4.54736 4V2.97501C4.54736 2.51135 4.16357 2.125 3.70312 2.125H2.45605C1.99561 2.125 1.61182 2.51135 1.61182 2.97501V4H4.54736ZM1.61182 5H4.54736V9.98749C4.54736 10.4511 4.16357 10.8375 3.70312 10.8375H2.45605C1.99561 10.8375 1.61182 10.4511 1.61182 9.98749V5ZM15.2349 16.7296C16.0405 16.7296 16.7122 16.0727 16.7122 15.242V12.4796H0.287842V15.242C0.287842 16.0534 0.940186 16.7296 1.76514 16.7296H15.2349Z"
                      fill="#E5E5E5"
                    />
                  </svg>
                ),
              },
              {
                key: "platz",
                label: "Плацкарт",
                icon: (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.4651 0H1.53491C0.690674 0 0 0.689941 0 1.53326V15.4667C0 16.3101 0.690674 17 1.53491 17H6H7H15.4651C16.3093 17 17 16.3101 17 15.4667V1.53326C17 0.689941 16.3093 0 15.4651 0ZM7 16.0417H11.9536C12.3757 16.0417 12.7212 15.6967 12.7212 15.2751H12.7021V13.8951C12.7021 13.4735 12.3567 13.1285 11.9346 13.1285H7V16.0417ZM6 13.1285H5.04639C4.62427 13.1285 4.27881 13.4735 4.27881 13.8951V15.2751C4.27881 15.6967 4.62427 16.0417 5.04639 16.0417H6V13.1285ZM2.24487 9.88953C1.9187 9.88953 1.65015 9.62122 1.65015 9.29535V4H4.56665V9.29535C4.56665 9.62122 4.29785 9.88953 3.97168 9.88953H2.24487ZM1.65015 2.06989V3H4.56665V2.06989C4.56665 1.74408 4.29785 1.47577 3.97168 1.47577H2.24487C1.9187 1.47577 1.65015 1.74408 1.65015 2.06989ZM12.2415 9.27618V4H15.1772V9.27618C15.1772 9.62122 14.8894 9.90869 14.5439 9.90869H12.8748C12.5293 9.90869 12.2415 9.62122 12.2415 9.27618ZM12.2415 3H15.1772V2.08905C15.1772 1.74408 14.8894 1.4566 14.5439 1.4566H12.8748C12.5293 1.4566 12.2415 1.74408 12.2415 2.08905V3Z"
                      fill="#E5E5E5"
                    />
                  </svg>
                ),
              },
              {
                key: "sidyach",
                label: "Сидячий",
                icon: (
                  <svg
                    width="14"
                    height="23"
                    viewBox="0 0 14 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 8.75326C0.141674 8.57335 0.25759 8.35002 0.437903 8.21975C1.03036 7.7979 1.79669 8.08947 1.97056 8.80288C2.12512 9.44806 2.25391 10.0994 2.38914 10.7508C2.62741 11.8737 2.85925 13.0027 3.10396 14.1256C3.42594 15.5834 4.41122 16.3527 5.9632 16.3589C7.07084 16.3651 8.17203 16.3527 9.27967 16.3651C9.93008 16.3713 10.2971 16.6566 10.4002 17.2025C10.5032 17.7919 10.0846 18.3378 9.46642 18.344C8.03036 18.3564 6.5943 18.3936 5.15823 18.3316C3.39374 18.2572 1.75161 16.8551 1.29439 15.0809C0.99816 13.9208 0.779209 12.7422 0.521619 11.5759C0.354186 10.8004 0.173873 10.0312 0 9.25575C0 9.08825 0 8.92075 0 8.75326Z"
                      fill="#E5E5E5"
                    />
                    <path
                      d="M4.53991 0C5.04865 0.105461 5.51875 0.266754 5.92445 0.601748C6.76806 1.29655 7.02565 2.56829 6.49759 3.51123C5.92445 4.54103 4.72022 5.04972 3.61902 4.73334C2.52427 4.41696 1.86741 3.65392 1.7837 2.50625C1.7193 1.62534 2.20872 0.694802 3.2262 0.235737C3.45803 0.130275 3.71562 0.0806467 3.96677 0C4.15352 0 4.34671 0 4.53991 0Z"
                      fill="#E5E5E5"
                    />
                    <path
                      d="M11.3469 15.875C11.1924 15.875 11.0829 15.875 10.9799 15.875C9.33128 15.875 7.68271 15.8812 6.02769 15.875C4.7655 15.8688 3.91546 15.1988 3.67075 14.0077C3.24572 11.9853 2.82714 9.96296 2.40212 7.94058C1.97065 5.8872 3.88326 4.89462 5.25492 5.32267C6.13073 5.59563 6.58151 6.22839 6.76182 7.05347C7.12245 8.70983 7.46375 10.3662 7.79862 12.0225C7.85658 12.3203 7.95317 12.432 8.28804 12.4258C9.62751 12.4134 10.967 12.4134 12.3064 12.4568C13.2144 12.4816 13.9164 13.1888 13.9808 14.0635C13.9937 14.2124 14.0001 14.3613 14.0001 14.5102C14.0001 16.8117 14.0001 19.1071 14.0001 21.4086C14.0001 21.6133 14.0001 21.8242 13.955 22.0227C13.8133 22.6493 13.2466 23.0401 12.5833 22.9967C11.9329 22.9533 11.4242 22.4756 11.3598 21.8428C11.3469 21.6939 11.3469 21.5451 11.3469 21.3962C11.3469 19.6778 11.3469 17.9532 11.3469 16.2348C11.3469 16.1293 11.3469 16.0177 11.3469 15.875Z"
                      fill="#E5E5E5"
                    />
                  </svg>
                ),
              },
              {
                key: "lyuks",
                label: "Люкс",
                icon: (
                  <svg
                    width="22"
                    height="20"
                    viewBox="0 0 22 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 0L13.5857 7.63103H22L15.2072 12.369L17.7928 20L11 15.304L4.20717 20L6.79283 12.369L0 7.63103H8.41434L11 0Z"
                      fill="#E5E5E5"
                    />
                  </svg>
                ),
              },
              {
                key: "wifi",
                label: "Wi-Fi",
                icon: (
                  <svg
                    width="24"
                    height="19"
                    viewBox="0 0 24 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 5.05721C23.7201 5.32164 23.4402 5.58607 23.1683 5.85852C22.8964 6.13096 22.6405 6.41944 22.3525 6.73195C19.4335 3.90332 16.0027 2.41289 11.988 2.41289C7.98934 2.41289 4.57448 3.90332 1.73542 6.65182C1.16761 6.0909 0.623792 5.54601 0 4.92099C0.863712 4.24789 1.70343 3.48664 2.63912 2.86162C9.3009 -1.56161 17.89 -0.792353 23.6961 4.72066C23.7921 4.8088 23.896 4.88893 24 4.96906C24 5.00112 24 5.02516 24 5.05721Z"
                      fill="#E5E5E5"
                    />
                    <path
                      d="M11.6041 19C11.5001 18.9519 11.3961 18.8958 11.2842 18.8477C10.4365 18.4872 9.96461 17.5977 10.1406 16.6922C10.3165 15.7948 11.1082 15.1457 12.0279 15.1457C12.9396 15.1537 13.7314 15.8108 13.8993 16.7082C14.0672 17.6057 13.5794 18.4952 12.7237 18.8477C12.6117 18.8958 12.5078 18.9439 12.3958 18.992C12.1319 19 11.868 19 11.6041 19Z"
                      fill="#E5E5E5"
                    />
                    <path
                      d="M5.11028 10.0413C4.54247 9.4804 3.99865 8.94352 3.45483 8.39863C7.58946 3.9113 15.6108 3.31833 20.5371 8.35055C19.9853 8.89545 19.4255 9.44034 18.8577 10.0013C16.9863 8.20632 14.6911 7.19667 11.988 7.20468C9.29289 7.2127 7.00565 8.21433 5.11028 10.0413Z"
                      fill="#E5E5E5"
                    />
                    <path
                      d="M17.2023 11.7722C16.6344 12.3331 16.0906 12.878 15.5468 13.4148C13.4115 11.3955 10.3325 11.6119 8.48516 13.4068C7.94134 12.8619 7.39752 12.3251 6.8457 11.7802C9.03697 9.20797 14.0673 8.55891 17.2023 11.7722Z"
                      fill="#E5E5E5"
                    />
                  </svg>
                ),
              },
              {
                key: "express",
                label: "Экспресс",
                icon: (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.28462 17.3529C6.15402 17.357 6.07239 17.304 6.00097 17.2328C5.4908 16.7339 4.97655 16.2391 4.47047 15.7382C3.89908 15.1721 3.33586 14.5959 2.76039 14.0339C2.63183 13.9076 2.59918 13.7753 2.65019 13.6266C2.76243 13.2907 2.87467 12.9506 3.01547 12.6248C3.92153 10.5173 5.18062 8.63385 6.6948 6.91733C8.10082 5.32298 9.69662 3.9465 11.4924 2.80826C12.1291 2.40509 12.7944 2.05079 13.4453 1.67206C13.5127 1.63337 13.5412 1.66799 13.5821 1.70668C14.2187 2.34197 14.8575 2.97727 15.4942 3.6146C16.4267 4.54515 17.3593 5.47773 18.294 6.40624C18.3531 6.46529 18.3572 6.50398 18.3205 6.57728C17.5246 8.13498 16.5594 9.57865 15.4207 10.9063C14.7003 11.7452 13.9188 12.525 13.0964 13.2642C11.2108 14.9583 9.09666 16.2961 6.72949 17.2226C6.60705 17.2714 6.48053 17.3101 6.35401 17.3509C6.3234 17.3529 6.29074 17.3509 6.28462 17.3529ZM7.63146 11.1221C7.56412 11.8633 8.25183 12.3764 8.85587 12.3723C9.53541 12.3662 10.1027 11.8063 10.1007 11.1241C10.0986 10.552 9.7007 9.88001 8.75791 9.89426C8.14775 9.90444 7.63146 10.4583 7.63146 11.1221ZM12.3944 8.81507C13.1127 8.89041 13.6474 8.16552 13.6412 7.59742C13.6372 7.0171 13.129 6.34719 12.3597 6.3533C11.7455 6.35737 11.1292 6.91733 11.1557 7.6076C11.1822 8.3162 11.674 8.81507 12.3944 8.81507Z"
                      fill="#E5E5E5"
                    />
                    <path
                      d="M18.7653 5.61827C17.2981 4.17256 15.8288 2.72686 14.3452 1.26486C14.6289 1.15287 14.8942 1.04291 15.1635 0.941104C16.1492 0.564406 17.1613 0.29359 18.2 0.13273C18.6184 0.0675711 19.0428 0.0248108 19.4673 0.00241249C19.8836 -0.0199858 20.0019 0.110331 19.9999 0.52979C19.9958 1.24246 19.8713 1.93885 19.7183 2.63319C19.4918 3.6574 19.1734 4.65515 18.7571 5.61827C18.751 5.63049 18.7449 5.64271 18.7388 5.65289C18.7469 5.64067 18.7571 5.62845 18.7653 5.61827Z"
                      fill="#E5E5E5"
                    />
                    <path
                      d="M6.97031 5.98275C6.92949 6.03162 6.89276 6.08253 6.84787 6.12732C5.62551 7.39995 4.58885 8.80901 3.70728 10.3341C3.3971 10.8717 3.11957 11.4255 2.83183 11.9753C2.78694 12.0608 2.74408 12.0812 2.65021 12.0547C1.8666 11.8307 1.08298 11.6149 0.299363 11.393C0.050401 11.3217 -0.0618358 11.0835 0.0340756 10.8391C0.0646856 10.7617 0.10754 10.6864 0.152434 10.6151C1.18705 9.00245 2.54002 7.72778 4.24602 6.8461C5.06432 6.42257 5.92753 6.12325 6.83766 5.96035C6.87644 5.95425 6.91521 5.95425 6.95398 5.95221C6.9601 5.96239 6.96419 5.97257 6.97031 5.98275Z"
                      fill="#E5E5E5"
                    />
                    <path
                      d="M7.90088 17.188C9.01917 16.6505 10.0946 16.0457 11.117 15.3453C12.1373 14.6468 13.0883 13.8609 13.9984 13.024C14.0106 13.0321 14.0249 13.0403 14.0372 13.0484C14.029 13.1156 14.0229 13.1828 14.0106 13.25C13.7066 14.8484 12.9944 16.2514 11.9741 17.5057C11.2292 18.422 10.3538 19.1937 9.34975 19.8188C9.27017 19.8697 9.1865 19.9165 9.09875 19.9512C8.92121 20.0204 8.7498 19.9613 8.67225 19.7883C8.59471 19.6152 8.5294 19.436 8.47635 19.2548C8.28248 18.5808 8.09474 17.9048 7.90496 17.2308C7.90292 17.2226 7.90292 17.2125 7.90088 17.188Z"
                      fill="#E5E5E5"
                    />
                    <path
                      d="M5.23356 17.7011C5.09683 17.805 4.96419 17.9231 4.81522 18.0147C4.23159 18.3771 3.60919 18.6683 2.97046 18.9167C2.04808 19.2771 1.11753 19.6131 0.189026 19.9593C0.146172 19.9756 0.0992369 19.9837 0.0339355 20C0.10944 19.7821 0.174742 19.5846 0.246165 19.3891C0.672665 18.2163 1.10325 17.0434 1.65627 15.9215C1.83381 15.5631 2.01747 15.2068 2.28887 14.9054C2.31336 14.8789 2.33989 14.8525 2.35826 14.8321C3.31125 15.785 4.2622 16.7319 5.23356 17.7011Z"
                      fill="#E5E5E5"
                    />
                  </svg>
                ),
              },
            ].map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2 text-gray-300">
                  {f.icon && (
                    <span className="flex-shrink-0 w-5 flex justify-center items-center">
                      {f.icon}
                    </span>
                  )}
                  <span className="text-xs">{f.label}</span>
                </div>
                <Toggle
                  on={filters[f.key as keyof typeof filters]}
                  onChange={() =>
                    setFilters((p) => ({
                      ...p,
                      [f.key]: !p[f.key as keyof typeof filters],
                    }))
                  }
                />
              </div>
            ))}

            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2">Стоимость</p>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>от</span>
                <span>до</span>
              </div>
              <RangeSlider
                min={1920}
                max={7000}
                step={100}
                value={priceRange}
                onChange={setPriceRange}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{priceRange[0].toLocaleString()}</span>
                <span className="text-[#f5a623] font-semibold">
                  {priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>

            {[
              { key: "there" as const, label: "Туда", arrow: "→" },
              { key: "back" as const, label: "Обратно", arrow: "←" },
            ].map(({ key, label, arrow }) => {
              const isOpen = openDirection[key];
              const depRange = key === "there" ? thereDepRange : backDepRange;
              const arrRange = key === "there" ? thereArrRange : backArrRange;
              const setDepRange =
                key === "there" ? setThereDepRange : setBackDepRange;
              const setArrRange =
                key === "there" ? setThereArrRange : setBackArrRange;
              return (
                <div key={key} className="mt-3 border-t border-white/10 pt-3">
                  <button
                    onClick={() =>
                      setOpenDirection((p) => ({ ...p, [key]: !p[key] }))
                    }
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="bg-[#f5a623] text-black text-xs font-bold px-2 py-0.5 rounded">
                        {arrow}
                      </span>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-gray-400 text-lg leading-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-3 space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-2">
                          Время отбытия
                        </p>
                        <RangeSlider
                          min={0}
                          max={24}
                          step={1}
                          value={depRange}
                          onChange={setDepRange}
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{formatHour(depRange[0])}</span>
                          <span className="text-[#f5a623] font-semibold">
                            {formatHour(depRange[1])}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-2">
                          Время прибытия
                        </p>
                        <RangeSlider
                          min={0}
                          max={24}
                          step={1}
                          value={arrRange}
                          onChange={setArrRange}
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{formatHour(arrRange[0])}</span>
                          <span className="text-[#f5a623] font-semibold">
                            {formatHour(arrRange[1])}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div>
            <h3 className="text-xs font-black tracking-[0.15em] text-gray-700 mb-3 uppercase">
              Последние билеты
            </h3>
            <div className="space-y-2">
              {recentError && (
                <div className="bg-white rounded p-3 border border-red-200 text-xs text-red-500">
                  {recentError}
                </div>
              )}
              {recentTickets.map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded p-3 border border-gray-200"
                >
                  <div className="flex justify-between text-xs font-semibold text-gray-800 mb-0.5">
                    <span>{t.from}</span>
                    <span>{t.to}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-2">
                    <span>{t.fromSub}</span>
                    <span>{t.toSub}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-300 mb-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    </svg>
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-right text-[#f5a623] font-bold text-sm">
                    от {t.price.toLocaleString()} ₽
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 max-w-3xl">
          <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
            <span>
              найдено{" "}
              <strong className="text-gray-800">{filteredTrains.length}</strong>
            </span>
            <div className="flex items-center gap-3">
              <span>сортировать по:</span>
              <div className="relative inline-flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent border-none outline-none text-xs text-gray-600 pr-4 cursor-pointer"
                >
                  <option value="времени">времени</option>
                  <option value="стоимости">стоимости</option>
                  <option value="длительности">длительности</option>
                </select>
                <svg
                  className="w-3 h-3 text-gray-400 pointer-events-none absolute right-0"
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
              <span className="ml-2">показывать по:</span>
              {[5, 10, 20].map((n) => (
                <button key={n} className="hover:text-[#f5a623]">
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {pagedTrains.length === 0 && (
              <div className="bg-white rounded border border-gray-200 p-8 text-center text-sm text-gray-500">
                По выбранным фильтрам поездов не найдено
              </div>
            )}

            {pagedTrains.map((train, ti) => (
              <div
                key={`${effectivePage}-${ti}`}
                className="bg-white rounded border border-gray-200 overflow-hidden"
              >
                <div className="flex">
                  <div className="w-32 bg-gray-200 border-r border-gray-100 flex flex-col items-center justify-center p-4 flex-shrink-0">
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
                      {train.number}
                    </div>
                    <div className="text-[10px] text-gray-400 text-center mt-1 whitespace-pre-line leading-tight">
                      {train.route}
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {train.depTime}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {train.depDate}
                        </div>
                      </div>
                      <div className="flex-1 flex items-center gap-1">
                        <div className="flex-1 h-px bg-gray-300" />
                        <svg
                          className="w-4 h-4 text-[#f5a623]"
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
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {train.arrTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-3">
                      <span className="whitespace-pre-line leading-tight">
                        {train.depStation}
                      </span>
                      <span className="whitespace-pre-line leading-tight text-right">
                        {train.arrStation}
                      </span>
                    </div>

                    {train.returnDepTime && (
                      <>
                        <div className="flex items-center gap-3 mb-1">
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {train.returnDepTime}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              9:42
                            </div>
                          </div>
                          <div className="flex-1 flex items-center gap-1">
                            <div className="flex-1 h-px bg-gray-300" />
                            <svg
                              className="w-4 h-4 text-gray-400 rotate-180"
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
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {train.returnArrTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span className="whitespace-pre-line leading-tight">
                            {train.returnDepStation}
                          </span>
                          <span className="whitespace-pre-line leading-tight text-right">
                            {train.returnArrStation}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="w-44 border-l border-gray-100 p-4 flex flex-col justify-between flex-shrink-0">
                    <div className="space-y-1">
                      {train.classes.map((cls) => (
                        <div
                          key={cls.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="text-gray-500">{cls.name}</div>
                          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                            <span>{cls.count}</span>
                            <span className="text-gray-700 font-semibold">
                              от {cls.price.toLocaleString()}
                            </span>
                            <span className="text-[#f5a623]">₽</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 space-y-2">
                      <TrainAmenities />
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleSelectTrain(train)}
                          className="w-4/5 bg-[#f5a623] text-white hover:shadow-lg hover:shadow-[#f5a623]/50 active:bg-transparent active:text-[#f5a623] active:border active:border-[#f5a623] text-xs font-bold py-1.5 rounded transition-all text-center"
                        >
                          Выбрать места
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-1 mt-8 translate-x-64">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={effectivePage === 1}
              className={`w-8 h-8 border flex items-center justify-center transition-colors
                ${effectivePage === 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-gray-500 hover:border-[#f5a623] hover:text-[#f5a623]"}`}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 border flex items-center justify-center text-sm font-medium transition-colors
                  ${effectivePage === p ? "bg-[#f5a623] border-[#f5a623] text-black" : "border-gray-300 text-gray-600 hover:border-[#f5a623] hover:text-[#f5a623]"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={effectivePage === totalPages}
              className={`w-8 h-8 border flex items-center justify-center transition-colors
                ${effectivePage === totalPages ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-gray-500 hover:border-[#f5a623] hover:text-[#f5a623]"}`}
            >
              ›
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
