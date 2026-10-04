import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBooking } from "@/context/BookingContext";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const FEATURES = [
  { icon: "images/main-page-icon-1.png", label: "Удобный заказ\nна сайте" },
  {
    icon: "images/main-page-icon-2.png",
    label: "Нет необходимости\nехать в офис",
  },
  { icon: "images/main-page-icon-3.png", label: "Огромный выбор\nнаправлений" },
];

const TESTIMONIALS = [
  {
    name: "Екатерина Вальнова",
    avatar: "images/e-valnova-avatar.png",
    text: "Доброжелательные подсказки на всех этапах помогут правильно заполнить поля и без затруднений купить авиа или ж/д билет, даже если вы заказываете онлайн билет впервые.",
  },
  {
    name: "Евгений Стрыкало",
    avatar: "images/e-strykalo-avatar.png",
    text: "СМС-сопровождение до посадки. Сразу после оплаты ж/д билетов и за 3 часа до отправления мы пришлём вам СМС-напоминание о поездке.",
  },
];

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

function parseDayFromString(s: string): number | null {
  if (!s) return null;
  const parts = s.split(".");
  if (parts.length < 3) return null;
  const day = Number(parts[0]);
  return Number.isNaN(day) ? null : day;
}

function formatDate(day: number | null): string {
  if (!day) return "";
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), day);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getFullYear()}`;
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
  const isWeekend = (_w: number, dayIndex: number) =>
    dayIndex === 5 || dayIndex === 6;

  return (
    <div className="bg-white rounded p-3 select-none shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="text-gray-700 hover:text-[#f5a623] transition-colors px-1 text-lg"
        >
          ‹
        </button>
        <span className="text-gray-800 font-medium text-sm tracking-wide">
          {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {currentYear}
        </span>
        <button
          onClick={nextMonth}
          className="text-gray-700 hover:text-[#f5a623] transition-colors px-1 text-lg"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] text-gray-500 font-medium py-0.5"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.flat().map((day, i) => {
          const isSelected = day === selectedDay;
          const weekIndex = Math.floor(i / 7);
          const dayIndex = i % 7;
          const isWeekendDay = isWeekend(weekIndex, dayIndex);
          return (
            <button
              key={i}
              onClick={() => day && onSelect(day)}
              className={`text-center text-xs py-1.5 rounded transition-colors
                ${!day ? "invisible" : ""}
                ${isSelected ? "bg-[#f5a623] text-black font-bold" : ""}
                ${!isSelected && day ? (isWeekendDay ? "text-[#f5a623]" : "text-gray-700 hover:bg-gray-100") : ""}
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

export default function HomePage() {
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
  } = useBooking();

  const [openCalendar, setOpenCalendar] = useState<"there" | "back" | null>(
    null,
  );
  const [activeDot, setActiveDot] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setOpenCalendar(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dayThere = parseDayFromString(dateThere);
  const dayBack = parseDayFromString(dateBack);

  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="min-h-screen bg-white text-gray-900"
    >
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/train-background.png)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-[#c47a00]/50 pointer-events-none" />

        <div className="relative z-10">
          <Header />
        </div>

        <section className="relative z-10 min-h-[400px] flex items-end">
          <div className="max-w-6xl mx-auto px-6 w-full flex flex-col md:flex-row items-end gap-10 pt-16 pb-0">
            <div className="flex-1 text-white mb-26 ml-26">
              <p className="text-2xl md:text-3xl font-light mb-1">
                Вся жизнь —
              </p>
              <p className="text-4xl md:text-5xl font-black leading-tight">
                путешествие!
              </p>
            </div>

            <div
              ref={formRef}
              className="w-full md:w-[420px] bg-[#1e1e1e]/80 rounded-t-lg p-6 pt-8 pb-8 shadow-2xl relative"
            >
              <p className="text-gray-300 text-sm font-medium mb-3 tracking-wide">
                Направление
              </p>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Откуда"
                    className="w-full bg-white text-gray-900 placeholder-gray-400 text-sm rounded px-3 py-2.5 pr-8 outline-none focus:ring-1 focus:ring-[#f5a623]"
                  />
                  <svg
                    className="absolute right-2.5 top-3 w-3.5 h-3.5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
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
                <div className="flex-1 relative">
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Куда"
                    className="w-full bg-white text-gray-900 placeholder-gray-400 text-sm rounded px-3 py-2.5 pr-8 outline-none focus:ring-1 focus:ring-[#f5a623]"
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
              <p className="text-gray-300 text-sm font-medium mb-3 tracking-wide">
                Дата
              </p>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <input
                    readOnly
                    onClick={() =>
                      setOpenCalendar(openCalendar === "there" ? null : "there")
                    }
                    value={dateThere}
                    placeholder="ДД/ММ/ГГ"
                    className="w-full bg-white text-gray-900 placeholder-gray-400 text-sm rounded px-3 py-2.5 pr-8 outline-none cursor-pointer focus:ring-1 focus:ring-[#f5a623]"
                  />
                  <svg
                    className="absolute right-2.5 top-3 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {openCalendar === "there" && (
                    <div className="absolute top-full left-0 mt-2 z-50 w-[300px]">
                      <CalendarWidget
                        selectedDay={dayThere}
                        onSelect={(d) => {
                          setDateThere(formatDate(d));
                          setOpenCalendar(null);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 relative">
                  <input
                    readOnly
                    onClick={() =>
                      setOpenCalendar(openCalendar === "back" ? null : "back")
                    }
                    value={dateBack}
                    placeholder="ДД/ММ/ГГ"
                    className="w-full bg-white text-gray-900 placeholder-gray-400 text-sm rounded px-3 py-2.5 pr-8 outline-none cursor-pointer focus:ring-1 focus:ring-[#f5a623]"
                  />
                  <svg
                    className="absolute right-2.5 top-3 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {openCalendar === "back" && (
                    <div className="absolute top-full right-0 mt-2 z-50 w-[300px]">
                      <CalendarWidget
                        selectedDay={dayBack}
                        onSelect={(d) => {
                          setDateBack(formatDate(d));
                          setOpenCalendar(null);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/loading")}
                  className="w-1/2 bg-[#f5a623] hover:bg-[#f5a623] hover:shadow-lg hover:shadow-[#f5a623]/50 active:bg-transparent active:text-[#f5a623] active:border active:border-[#f5a623] text-black font-bold text-sm px-3 py-2.5 rounded transition-all whitespace-nowrap tracking-wide"
                >
                  НАЙТИ БИЛЕТЫ
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        id="about"
        className="py-20 bg-white border-t-4 border-[#f5a623]"
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-lg font-black tracking-[0.2em] text-gray-700 mb-6 uppercase">
            О НАС
          </h2>
          <div className="border-l-7 border-[#f5a623] pl-5 space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              Мы рады видеть вас! Мы работаем для Вас с 2003 года. 23 года мы
              наблюдаем, как с каждым днём всё больше людей заказывают жд билеты
              через интернет.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Сегодня можно заказать железнодорожные билеты онлайн всего в 2
              клика, но стоит ли это делать? Мы расскажем о преимуществах заказа
              через интернет.
            </p>
            <p className="text-gray-900 text-sm font-bold leading-relaxed">
              Покупать жд билеты дешево можно за 90 суток до отправления поезда.
              <br />
              Благодаря динамическому ценообразованию цена на билеты в это время
              самая низкая.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/railway-background.png)`,
          }}
        />
        <div className="absolute inset-0 bg-[#c47a00]/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-14">
            <h2 className="text-white font-black text-xl tracking-[0.2em] uppercase ml-8">
              КАК ЭТО РАБОТАЕТ
            </h2>
            <button className="border border-white/70 text-white text-sm px-6 py-2 hover:bg-[#f5a623] hover:border-[#f5a623] hover:text-black active:bg-white active:border-white active:text-black transition-colors tracking-wide mr-8">
              Узнать больше
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-5"
              >
                <img
                  src={f.icon}
                  alt={f.label}
                  className="w-30 h-30 object-contain"
                />
                <p className="text-white text-sm font-medium leading-snug whitespace-pre-line">
                  {f.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-lg font-black tracking-[0.2em] text-gray-900 mb-12 uppercase">
            ОТЗЫВЫ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="flex gap-5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                />
                <div className="max-w-xs">
                  <p className="font-bold text-gray-900 text-sm mb-2">
                    {t.name}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed italic">
                    <span className="text-gray-800 text-xl leading-none mr-0.5">
                      "
                    </span>
                    {t.text}
                    <span className="text-gray-800 text-xl leading-none ml-0.5">
                      "
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-10">
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                onClick={() => setActiveDot(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeDot ? "bg-gray-400" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="contacts">
        <Footer />
      </section>
    </div>
  );
}
