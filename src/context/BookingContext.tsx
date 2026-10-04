/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from "react";
//
export type WagonType = "sidyach" | "platz" | "kupe" | "lyuks";

export type PassengerData = {
  type: "Взрослый" | "Детский";
  lastName: string;
  firstName: string;
  patronymic: string;
  gender: "М" | "Ж";
  dob: string;
  limited: boolean;
  docType: string;
  docSeries: string;
  docNumber: string;
  expanded: boolean;
  status: "idle" | "error" | "ok";
};

export type TrainClass = { name: string; count: number; price: number };

export type Train = {
  number: string;
  route: string;
  depTime: string;
  depDate: string;
  arrTime: string;
  depStation: string;
  arrStation: string;
  hasWifi: boolean;
  isExpress: boolean;
  classes: TrainClass[];
  returnDepTime: string | null;
  returnArrTime: string | null;
  returnDepStation: string | null;
  returnArrStation: string | null;
};

export type PayMethod = "card" | "paypal" | "qiwi" | "cash";

type BookingState = {
  from: string;
  to: string;
  dateThere: string;
  dateBack: string;

  selectedTrainForward: Train | null;
  selectedTrainBack: Train | null;

  wagonType: WagonType;
  selectedSeatsForward: number[];
  selectedSeatsBack: number[];

  passengers: PassengerData[];
  infantsNoSeat: number;

  buyerLastName: string;
  buyerFirstName: string;
  buyerPatronymic: string;
  buyerPhone: string;
  buyerEmail: string;

  payMethod: PayMethod;

  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  setDateThere: (v: string) => void;
  setDateBack: (v: string) => void;
  setSelectedTrainForward: (t: Train | null) => void;
  setSelectedTrainBack: (t: Train | null) => void;
  setWagonType: (t: WagonType) => void;
  setSelectedSeatsForward: (s: number[]) => void;
  setSelectedSeatsBack: (s: number[]) => void;
  setPassengers: (p: PassengerData[]) => void;
  setInfantsNoSeat: (n: number) => void;
  setBuyerLastName: (v: string) => void;
  setBuyerFirstName: (v: string) => void;
  setBuyerPatronymic: (v: string) => void;
  setBuyerPhone: (v: string) => void;
  setBuyerEmail: (v: string) => void;
  setPayMethod: (m: PayMethod) => void;

  // Итоги
  totalPrice: number;
  orderNumber: string;
};

const BookingContext = createContext<BookingState | null>(null);

const INITIAL_PASSENGERS: PassengerData[] = [
  {
    type: "Взрослый",
    lastName: "",
    firstName: "",
    patronymic: "",
    gender: "Ж",
    dob: "",
    limited: false,
    docType: "Паспорт РФ",
    docSeries: "",
    docNumber: "",
    expanded: true,
    status: "idle",
  },
  {
    type: "Детский",
    lastName: "",
    firstName: "",
    patronymic: "",
    gender: "М",
    dob: "",
    limited: false,
    docType: "Свидетельство о рождении",
    docSeries: "",
    docNumber: "",
    expanded: true,
    status: "idle",
  },
];

export function BookingProvider({ children }: { children: ReactNode }) {
  const [from, setFrom] = useState("Москва");
  const [to, setTo] = useState("Санкт-Петербург");
  const [dateThere, setDateThere] = useState("30.08.2026");
  const [dateBack, setDateBack] = useState("09.09.2026");

  const [selectedTrainForward, setSelectedTrainForward] =
    useState<Train | null>(null);
  const [selectedTrainBack, setSelectedTrainBack] = useState<Train | null>(
    null,
  );

  const [wagonType, setWagonType] = useState<WagonType>("platz");
  const [selectedSeatsForward, setSelectedSeatsForward] = useState<number[]>(
    [],
  );
  const [selectedSeatsBack, setSelectedSeatsBack] = useState<number[]>([]);

  const [passengers, setPassengers] =
    useState<PassengerData[]>(INITIAL_PASSENGERS);
  const [infantsNoSeat, setInfantsNoSeat] = useState(0);

  const [buyerLastName, setBuyerLastName] = useState("Мартынюк");
  const [buyerFirstName, setBuyerFirstName] = useState("Ирина");
  const [buyerPatronymic, setBuyerPatronymic] = useState("Эдуардовна");
  const [buyerPhone, setBuyerPhone] = useState("+7 953 322 18 18");
  const [buyerEmail, setBuyerEmail] = useState("inbox@gmail.ru");

  const [payMethod, setPayMethod] = useState<PayMethod>("cash");

  const totalPrice = (() => {
    const seatCount = selectedSeatsForward.length + selectedSeatsBack.length;
    const perSeat =
      wagonType === "kupe" ? 3530 : wagonType === "lyuks" ? 4950 : 3030;
    const seatsSum = seatCount * perSeat;

    return seatsSum > 0 ? seatsSum : 7760;
  })();

  const orderNumber = "285АА";

  return (
    <BookingContext.Provider
      value={{
        from,
        to,
        dateThere,
        dateBack,
        selectedTrainForward,
        selectedTrainBack,
        wagonType,
        selectedSeatsForward,
        selectedSeatsBack,
        passengers,
        infantsNoSeat,
        buyerLastName,
        buyerFirstName,
        buyerPatronymic,
        buyerPhone,
        buyerEmail,
        payMethod,
        setFrom,
        setTo,
        setDateThere,
        setDateBack,
        setSelectedTrainForward,
        setSelectedTrainBack,
        setWagonType,
        setSelectedSeatsForward,
        setSelectedSeatsBack,
        setPassengers,
        setInfantsNoSeat,
        setBuyerLastName,
        setBuyerFirstName,
        setBuyerPatronymic,
        setBuyerPhone,
        setBuyerEmail,
        setPayMethod,
        totalPrice,
        orderNumber,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
