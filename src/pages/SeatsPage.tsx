import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StepBar from "@/components/StepBar";
import {
  useBooking,
  type WagonType as CtxWagonType,
  type Train,
  type PassengerData,
} from "@/context/BookingContext";

const RECENT_TICKETS = [
  {
    from: "Санкт-Петербург",
    fromSub: "Курский вокзал",
    to: "Самара",
    toSub: "Московский вокзал",
    price: 2500,
  },
  {
    from: "Москва",
    fromSub: "Курский вокзал",
    to: "Казань",
    toSub: "Московский вокзал",
    price: 3500,
  },
  {
    from: "Казань",
    fromSub: "Курский вокзал",
    to: "Нижний новгород",
    toSub: "Московский вокзал",
    price: 3800,
  },
];

type WagonType = CtxWagonType;

const WAGON_TYPES: { key: WagonType; label: string }[] = [
  { key: "sidyach", label: "Сидячий" },
  { key: "platz", label: "Плацкарт" },
  { key: "kupe", label: "Купе" },
  { key: "lyuks", label: "Люкс" },
];

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

function SeatMap({
  type,
  selectedSeats,
  onToggle,
}: {
  type: WagonType;
  wagon: number;
  selectedSeats: number[];
  onToggle: (s: number) => void;
}) {
  const totalSeats =
    type === "kupe" ? 36 : type === "platz" ? 54 : type === "sidyach" ? 60 : 18;

  return (
    <div className="flex flex-wrap gap-1 py-3 px-2">
      {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => {
        const isSel = selectedSeats.includes(seat);
        const isOccupied = [2, 5, 8, 11, 14, 20, 25].includes(seat);
        return (
          <button
            key={seat}
            onClick={() => !isOccupied && onToggle(seat)}
            disabled={isOccupied}
            className={`w-6 h-6 text-[9px] font-medium border transition-colors
              ${isSel ? "bg-[#f5a623] border-[#f5a623] text-black" : ""}
              ${isOccupied ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed" : ""}
              ${!isSel && !isOccupied ? "bg-white border-gray-300 text-gray-600 hover:border-[#f5a623] hover:text-[#f5a623]" : ""}
            `}
          >
            {seat}
          </button>
        );
      })}
    </div>
  );
}

interface TripSectionProps {
  direction: "forward" | "return";
  arrow: string;
  train: Train | null;
  wagonType: WagonType;
  onWagonTypeChange: (t: WagonType) => void;
  selectedSeats: number[];
  onSeatsChange: (s: number[]) => void;

  adults: number;
  children: number;
  infantsNoSeat: number;
  onAddAdult: () => void;
  onRemoveAdult: () => void;
  onAddChild: () => void;
  onRemoveChild: () => void;
  onAddInfant: () => void;
  onRemoveInfant: () => void;
}

function TripSection({
  direction,
  arrow,
  train,
  wagonType,
  onWagonTypeChange,
  selectedSeats,
  onSeatsChange,
  adults,
  children,
  infantsNoSeat,
  onAddAdult,
  onRemoveAdult,
  onAddChild,
  onRemoveChild,
  onAddInfant,
  onRemoveInfant,
}: TripSectionProps) {
  const toggleSeat = (s: number) => {
    onSeatsChange(
      selectedSeats.includes(s)
        ? selectedSeats.filter((x) => x !== s)
        : [...selectedSeats, s],
    );
  };

  const wagons =
    wagonType === "platz"
      ? [
          { num: 12, upper: 10, lower: 11, cost: [2020, 3030] },
          { num: 10, upper: 10, lower: 12, cost: [2020, 3030] },
        ]
      : [{ num: 7, upper: 3, lower: 8, cost: [2920, 3530] }];

  const WagonIcon = ({ t }: { t: WagonType }) => {
    if (t === "sidyach") {
      return (
        <svg
          className="w-8 h-8"
          viewBox="0 0 14 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 8.75326C0.141674 8.57335 0.25759 8.35002 0.437903 8.21975C1.03036 7.7979 1.79669 8.08947 1.97056 8.80288C2.12512 9.44806 2.25391 10.0994 2.38914 10.7508C2.62741 11.8737 2.85925 13.0027 3.10396 14.1256C3.42594 15.5834 4.41122 16.3527 5.9632 16.3589C7.07084 16.3651 8.17203 16.3527 9.27967 16.3651C9.93008 16.3713 10.2971 16.6566 10.4002 17.2025C10.5032 17.7919 10.0846 18.3378 9.46642 18.344C8.03036 18.3564 6.5943 18.3936 5.15823 18.3316C3.39374 18.2572 1.75161 16.8551 1.29439 15.0809C0.99816 13.9208 0.779209 12.7422 0.521619 11.5759C0.354186 10.8004 0.173873 10.0312 0 9.25575C0 9.08825 0 8.92075 0 8.75326Z"
            fill="currentColor"
          />
          <path
            d="M4.53991 0C5.04865 0.105461 5.51875 0.266754 5.92445 0.601748C6.76806 1.29655 7.02565 2.56829 6.49759 3.51123C5.92445 4.54103 4.72022 5.04972 3.61902 4.73334C2.52427 4.41696 1.86741 3.65392 1.7837 2.50625C1.7193 1.62534 2.20872 0.694802 3.2262 0.235737C3.45803 0.130275 3.71562 0.0806467 3.96677 0C4.15352 0 4.34671 0 4.53991 0Z"
            fill="currentColor"
          />
          <path
            d="M11.3469 15.875C11.1924 15.875 11.0829 15.875 10.9799 15.875C9.33128 15.875 7.68271 15.8812 6.02769 15.875C4.7655 15.8688 3.91546 15.1988 3.67075 14.0077C3.24572 11.9853 2.82714 9.96296 2.40212 7.94058C1.97065 5.8872 3.88326 4.89462 5.25492 5.32267C6.13073 5.59563 6.58151 6.22839 6.76182 7.05347C7.12245 8.70983 7.46375 10.3662 7.79862 12.0225C7.85658 12.3203 7.95317 12.432 8.28804 12.4258C9.62751 12.4134 10.967 12.4134 12.3064 12.4568C13.2144 12.4816 13.9164 13.1888 13.9808 14.0635C13.9937 14.2124 14.0001 14.3613 14.0001 14.5102C14.0001 16.8117 14.0001 19.1071 14.0001 21.4086C14.0001 21.6133 14.0001 21.8242 13.955 22.0227C13.8133 22.6493 13.2466 23.0401 12.5833 22.9967C11.9329 22.9533 11.4242 22.4756 11.3598 21.8428C11.3469 21.6939 11.3469 21.5451 11.3469 21.3962C11.3469 19.6778 11.3469 17.9532 11.3469 16.2348C11.3469 16.1293 11.3469 16.0177 11.3469 15.875Z"
            fill="currentColor"
          />
        </svg>
      );
    }
    if (t === "platz") {
      return (
        <svg
          className="w-8 h-8"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.4651 0H1.53491C0.690674 0 0 0.689941 0 1.53326V15.4667C0 16.3101 0.690674 17 1.53491 17H6H7H15.4651C16.3093 17 17 16.3101 17 15.4667V1.53326C17 0.689941 16.3093 0 15.4651 0ZM7 16.0417H11.9536C12.3757 16.0417 12.7212 15.6967 12.7212 15.2751H12.7021V13.8951C12.7021 13.4735 12.3567 13.1285 11.9346 13.1285H7V16.0417ZM6 13.1285H5.04639C4.62427 13.1285 4.27881 13.4735 4.27881 13.8951V15.2751C4.27881 15.6967 4.62427 16.0417 5.04639 16.0417H6V13.1285ZM2.24487 9.88953C1.9187 9.88953 1.65015 9.62122 1.65015 9.29535V4H4.56665V9.29535C4.56665 9.62122 4.29785 9.88953 3.97168 9.88953H2.24487ZM1.65015 2.06989V3H4.56665V2.06989C4.56665 1.74408 4.29785 1.47577 3.97168 1.47577H2.24487C1.9187 1.47577 1.65015 1.74408 1.65015 2.06989ZM12.2415 9.27618V4H15.1772V9.27618C15.1772 9.62122 14.8894 9.90869 14.5439 9.90869H12.8748C12.5293 9.90869 12.2415 9.62122 12.2415 9.27618ZM12.2415 3H15.1772V2.08905C15.1772 1.74408 14.8894 1.4566 14.5439 1.4566H12.8748C12.5293 1.4566 12.2415 1.74408 12.2415 2.08905V3Z"
            fill="currentColor"
          />
        </svg>
      );
    }
    if (t === "kupe") {
      return (
        <svg
          className="w-8 h-8"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.53491 0H15.4651C16.3093 0 17 0.695465 17 1.54544V15.4546C17 16.3045 16.3093 17 15.4651 17H1.53491C0.690674 17 0 16.3045 0 15.4546V1.54544C0 0.695465 0.690674 0 1.53491 0ZM13.1243 2.125C12.7021 2.125 12.3567 2.47272 12.3567 2.89774V4H15.2922V2.89774C15.2922 2.47272 14.947 2.125 14.5249 2.125H13.1243ZM15.2922 5H12.3567V10.0454C12.3567 10.4705 12.7021 10.8182 13.1243 10.8182H14.5249C14.947 10.8182 15.2922 10.4705 15.2922 10.0454V5ZM4.54736 4V2.97501C4.54736 2.51135 4.16357 2.125 3.70312 2.125H2.45605C1.99561 2.125 1.61182 2.51135 1.61182 2.97501V4H4.54736ZM1.61182 5H4.54736V9.98749C4.54736 10.4511 4.16357 10.8375 3.70312 10.8375H2.45605C1.99561 10.8375 1.61182 10.4511 1.61182 9.98749V5ZM15.2349 16.7296C16.0405 16.7296 16.7122 16.0727 16.7122 15.242V12.4796H0.287842V15.242C0.287842 16.0534 0.940186 16.7296 1.76514 16.7296H15.2349Z"
            fill="currentColor"
          />
        </svg>
      );
    }
    // lyuks
    return (
      <svg
        className="w-8 h-8"
        viewBox="0 0 22 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 0L13.5857 7.63103H22L15.2072 12.369L17.7928 20L11 15.304L4.20717 20L6.79283 12.369L0 7.63103H8.41434L11 0Z"
          fill="currentColor"
        />
      </svg>
    );
  };

  if (!train) {
    return (
      <div className="bg-white border border-gray-200 rounded mb-6 p-6 text-center text-sm text-gray-400">
        Поезд не выбран. Вернитесь на страницу поиска.
      </div>
    );
  }

  const isForward = direction === "forward";

  const depTime = train.depTime;
  const arrTime = train.arrTime;
  const depStation = train.depStation;
  const arrStation = train.arrStation;

  return (
    <div className="bg-white border border-gray-200 rounded mb-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 flex items-center justify-center ${isForward ? "bg-[#f5a623]" : "bg-gray-300"}`}
          >
            <span className="text-white text-sm font-bold">{arrow}</span>
          </div>
          <button className="border border-gray-300 text-gray-700 text-sm px-4 py-1.5 hover:border-gray-400 transition-colors">
            Выбрать другой поезд
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 px-6 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center text-[#f5a623]">
            <svg
              width="86"
              height="86"
              viewBox="0 0 86 86"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
            >
              <path
                d="M55.7879 63.7038C56.7164 65.6856 59.433 66.369 59.5361 69C48.4635 69 37.5284 69 26.4557 69C26.6277 66.4031 29.2755 65.6856 30.2727 63.7379C29.3786 63.5329 28.5534 63.3962 27.7625 63.157C23.8423 61.9611 21.057 58.3392 21.057 54.2047C20.9882 45.389 20.9882 36.6416 21.0226 27.8601C21.0226 23.794 22.9139 20.7187 26.7308 19.3861C29.8257 18.3269 33.1268 17.6777 36.3936 17.3701C42.7896 16.7893 49.22 16.7893 55.5472 18.1219C57.1634 18.4636 58.7452 19.0444 60.1895 19.762C63.2843 21.2996 64.9005 23.9306 64.9349 27.3134C65.0037 36.3683 65.0381 45.4232 64.9349 54.478C64.9005 58.6467 61.8057 62.2003 57.748 63.2254C57.129 63.4304 56.4757 63.5329 55.7879 63.7038ZM40.1762 28.1676C35.5683 28.1676 31.0636 28.1676 26.6277 28.1676C26.6277 32.7463 26.6277 37.1884 26.6277 41.6304C31.2012 41.6304 35.6371 41.6304 40.1762 41.6304C40.1762 37.12 40.1762 32.7122 40.1762 28.1676ZM59.433 28.1676C54.8251 28.1676 50.3204 28.1676 45.8844 28.1676C45.8844 32.7463 45.8844 37.1884 45.8844 41.6304C50.4579 41.6304 54.8939 41.6304 59.433 41.6304C59.433 37.12 59.433 32.7122 59.433 28.1676ZM34.743 54.068C34.7774 51.8128 32.8861 49.9335 30.6166 49.9335C28.4158 49.9335 26.5589 51.7103 26.4901 53.8972C26.4214 56.1523 28.2439 58.0658 30.5134 58.1342C32.8174 58.1683 34.7086 56.3232 34.743 54.068ZM59.5017 53.9997C59.5017 51.7445 57.5761 49.8993 55.3065 49.9335C53.1057 49.9677 51.2832 51.7787 51.2488 53.9655C51.2144 56.2207 53.0713 58.1 55.3409 58.1342C57.6448 58.1342 59.5017 56.2548 59.5017 53.9997Z"
                fill="currentColor"
              />
              <circle
                cx="43"
                cy="43"
                r="42"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-700">
              {train.number}
            </div>
            <div className="text-[10px] text-gray-400 whitespace-pre-line leading-tight">
              {train.route}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1">
          <div>
            <div className="text-lg font-bold">{depTime}</div>
            <div className="text-[10px] text-gray-400 whitespace-pre-line">
              {depStation}
            </div>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <div className="flex-1 h-px bg-gray-300" />
            <svg
              className={`w-4 h-4 text-[#f5a623] ${direction === "return" ? "rotate-180" : ""}`}
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
            <div className="text-lg font-bold">{arrTime}</div>
            <div className="text-[10px] text-gray-400 whitespace-pre-line text-right">
              {arrStation}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <svg
            className="w-3.5 h-3.5 text-[#f5a623]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            9 часов
            <br />
            42 минуты
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-sm font-bold text-gray-800 mb-3">
          Количество билетов
        </h3>
        <div className="flex gap-3 mb-2">
          <div className="flex-1 border border-gray-200 px-3 py-2 flex items-center justify-between">
            <span className="text-sm text-gray-700">Взрослых — {adults}</span>
            <div className="flex gap-1">
              <button
                onClick={onRemoveAdult}
                className="w-5 h-5 border border-gray-300 text-xs flex items-center justify-center hover:bg-gray-100"
              >
                −
              </button>
              <button
                onClick={onAddAdult}
                className="w-5 h-5 border border-gray-300 text-xs flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1 border border-gray-200 px-3 py-2 flex items-center justify-between">
            <span className="text-sm text-gray-700">Детских — {children}</span>
            <div className="flex gap-1">
              <button
                onClick={onRemoveChild}
                className="w-5 h-5 border border-gray-300 text-xs flex items-center justify-center hover:bg-gray-100"
              >
                −
              </button>
              <button
                onClick={onAddChild}
                className="w-5 h-5 border border-gray-300 text-xs flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1 border border-gray-200 px-3 py-2 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Детских «без места» — {infantsNoSeat}
            </span>
            <div className="flex gap-1">
              <button
                onClick={onRemoveInfant}
                className="w-5 h-5 border border-gray-300 text-xs flex items-center justify-center hover:bg-gray-100"
              >
                −
              </button>
              <button
                onClick={onAddInfant}
                className="w-5 h-5 border border-gray-300 text-xs flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mb-5">
          Можно добавить ещё 3 пассажиров
        </p>

        <h3 className="text-sm font-bold text-gray-800 mb-3">Тип вагона</h3>
        <div className="flex justify-between gap-4 mb-5">
          {WAGON_TYPES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onWagonTypeChange(key)}
              className={`flex flex-1 flex-col items-center gap-1 pb-2 transition-colors text-sm ${
                wagonType === key
                  ? "text-[#f5a623]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <WagonIcon t={key} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {wagons.map((w, wi) => (
          <div key={wi} className="mb-4">
            <div className="bg-[#f5a623] text-black text-xs font-bold px-3 py-1.5 flex items-center gap-2">
              <span>Вагоны</span>
              {wagons.map((ww) => (
                <span
                  key={ww.num}
                  className={`px-2 py-0.5 ${ww.num === w.num ? "bg-black text-white" : "bg-transparent"}`}
                >
                  {ww.num}
                </span>
              ))}
              <span className="ml-auto text-[10px] font-normal">
                Нумерация вагонов начинается с головы поезда
              </span>
            </div>
            <div className="border border-gray-200 border-t-0 p-4">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-[#f5a623] flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <div className="text-2xl font-black text-black">
                      {String(w.num).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] text-black/70 font-medium">
                      вагон
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-4 text-xs mb-3">
                    <div>
                      <p className="text-gray-400 mb-0.5">Места</p>
                      <p className="font-semibold">{w.upper + w.lower}</p>
                      <p className="text-gray-500">Верхние {w.upper}</p>
                      <p className="text-gray-500">Нижние {w.lower}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Стоимость</p>
                      <p className="text-gray-600">
                        {w.cost[0].toLocaleString()}{" "}
                        <span className="text-[#f5a623]">₽</span>
                      </p>
                      <p className="text-gray-600">
                        {w.cost[1].toLocaleString()}{" "}
                        <span className="text-[#f5a623]">₽</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Обслуживание</p>
                      <div className="flex gap-1 mt-1">
                        {["❄️", "📶", "🔌", "☕"].map((icon, i) => (
                          <span key={i} className="text-sm">
                            {icon}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mb-2">
                    13 человек выбирает места в этом поезде
                  </p>
                  <SeatMap
                    type={wagonType}
                    wagon={w.num}
                    selectedSeats={selectedSeats}
                    onToggle={toggleSeat}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {selectedSeats.length > 0 && (
          <div className="text-right text-sm font-bold text-gray-700">
            {(
              selectedSeats.length * (wagonType === "kupe" ? 3530 : 3030)
            ).toLocaleString()}{" "}
            ₽
          </div>
        )}
      </div>
    </div>
  );
}

function createPassenger(type: "Взрослый" | "Детский"): PassengerData {
  return {
    type,
    lastName: "",
    firstName: "",
    patronymic: "",
    gender: type === "Взрослый" ? "Ж" : "М",
    dob: "",
    limited: false,
    docType: type === "Взрослый" ? "Паспорт РФ" : "Свидетельство о рождении",
    docSeries: "",
    docNumber: "",
    expanded: true,
    status: "idle",
  };
}

export default function SeatsPage() {
  const navigate = useNavigate();
  const {
    from,
    to,
    dateThere,
    dateBack,
    selectedTrainForward,
    selectedTrainBack,
    wagonType,
    setWagonType,
    selectedSeatsForward,
    setSelectedSeatsForward,
    selectedSeatsBack,
    setSelectedSeatsBack,
    passengers,
    setPassengers,
    infantsNoSeat,
    setInfantsNoSeat,
  } = useBooking();

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

  const formatHour = (h: number) => `${h}:00`;

  const adults = passengers.filter((p) => p.type === "Взрослый").length;
  const children = passengers.filter((p) => p.type === "Детский").length;

  const addPassenger = (type: "Взрослый" | "Детский") => {
    setPassengers([...passengers, createPassenger(type)]);
  };

  const removePassenger = (type: "Взрослый" | "Детский") => {
    const lastIdx = [...passengers]
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.type === type)
      .map(({ i }) => i)
      .pop();
    if (lastIdx === undefined) return;
    setPassengers(passengers.filter((_, i) => i !== lastIdx));
  };

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

      <StepBar active={1} />

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">
        <aside className="w-60 flex-shrink-0 space-y-4">
          <div className="bg-[#1e1e1e] rounded p-4 text-white">
            <p className="text-xs text-gray-400 font-medium mb-1">
              Дата поездки
            </p>
            <div className="bg-white text-gray-900 text-sm px-3 py-1.5 flex items-center justify-between mb-3">
              <span>{dateThere}</span>
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
            </div>
            <p className="text-xs text-gray-400 font-medium mb-1">
              Дата возвращения
            </p>
            <div className="bg-white text-gray-900 text-sm px-3 py-1.5 flex items-center justify-between mb-4">
              <span>{dateBack}</span>
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
              {RECENT_TICKETS.map((t, i) => (
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
                  <div className="text-right text-[#f5a623] font-bold text-sm">
                    от {t.price.toLocaleString()} ₽
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 max-w-3xl">
          <h2 className="text-sm font-black tracking-[0.15em] text-gray-700 mb-4 uppercase">
            Выбор мест
          </h2>

          <TripSection
            direction="forward"
            arrow="→"
            train={selectedTrainForward}
            wagonType={wagonType}
            onWagonTypeChange={setWagonType}
            selectedSeats={selectedSeatsForward}
            onSeatsChange={setSelectedSeatsForward}
            adults={adults}
            children={children}
            infantsNoSeat={infantsNoSeat}
            onAddAdult={() => addPassenger("Взрослый")}
            onRemoveAdult={() => removePassenger("Взрослый")}
            onAddChild={() => addPassenger("Детский")}
            onRemoveChild={() => removePassenger("Детский")}
            onAddInfant={() => setInfantsNoSeat(infantsNoSeat + 1)}
            onRemoveInfant={() =>
              setInfantsNoSeat(Math.max(0, infantsNoSeat - 1))
            }
          />
          <TripSection
            direction="return"
            arrow="←"
            train={selectedTrainBack}
            wagonType={wagonType}
            onWagonTypeChange={setWagonType}
            selectedSeats={selectedSeatsBack}
            onSeatsChange={setSelectedSeatsBack}
            adults={adults}
            children={children}
            infantsNoSeat={infantsNoSeat}
            onAddAdult={() => addPassenger("Взрослый")}
            onRemoveAdult={() => removePassenger("Взрослый")}
            onAddChild={() => addPassenger("Детский")}
            onRemoveChild={() => removePassenger("Детский")}
            onAddInfant={() => setInfantsNoSeat(infantsNoSeat + 1)}
            onRemoveInfant={() =>
              setInfantsNoSeat(Math.max(0, infantsNoSeat - 1))
            }
          />

          <div className="flex justify-end">
            <button
              onClick={() => navigate("/passengers")}
              className="bg-[#f5a623] hover:bg-[#f5a623] hover:shadow-lg hover:shadow-[#f5a623]/50 active:bg-transparent active:text-[#f5a623] active:border active:border-[#f5a623] text-white font-bold text-sm px-10 py-3 tracking-widest rounded transition-all"
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
