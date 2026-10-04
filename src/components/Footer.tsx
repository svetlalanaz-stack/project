import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#1e1e1e] text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-white font-bold text-sm tracking-widest mb-6 uppercase">
            Свяжитесь с нами
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { icon: "phone", text: "8 (800) 000 00 00" },
              { icon: "email", text: "inbox@mail.ru" },
              { icon: "chat", text: "tu.train.tickets" },
              { icon: "pin", text: "г. Москва\nул. Московская 27-35\n555 555" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-gray-300 mt-0.5 w-4 flex-shrink-0">
                  {item.icon === "phone" && (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="w-4 h-4"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  )}
                  {item.icon === "email" && (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="w-4 h-4"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  )}
                  {item.icon === "chat" && (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {item.icon === "pin" && (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                <span className="whitespace-pre-line leading-snug">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-10">
            <h3 className="text-white font-bold text-sm tracking-widest mb-1 uppercase">
              Подписка
            </h3>
            <p className="text-gray-400 text-xs mb-4">Будьте в курсе событий</p>
            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="flex-1 bg-white/10 text-white placeholder-gray-500 text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-[#f5a623]"
              />
              <button className="border border-white text-white hover:bg-[#f5a623] hover:border-[#f5a623] hover:text-black active:bg-white active:border-white active:text-black text-xs font-bold px-5 py-2 tracking-widest transition-colors">
                ОТПРАВИТЬ
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm tracking-widest mb-4 uppercase">
              Подписывайтесь на нас
            </h3>
            <div className="flex gap-4">
              {[
                <svg
                  key="yt"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>,
                <svg
                  key="li"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>,
                <svg
                  key="gp"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.635 10.909v2.619h4.428c-.177 1.145-1.321 3.359-4.428 3.359-2.665 0-4.841-2.207-4.841-4.933s2.176-4.934 4.841-4.934c1.518 0 2.534.646 3.115 1.203l2.121-2.048C11.571 4.703 9.763 4 7.635 4 3.418 4 0 7.418 0 11.635S3.418 19.27 7.635 19.27c4.406 0 7.328-3.098 7.328-7.456 0-.501-.054-.883-.12-1.265H7.635v.36zM24 10.545h-2.182V8.364h-2.181v2.181H17.454v2.182h2.183v2.182h2.181v-2.182H24" />
                </svg>,
                <svg
                  key="fb"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>,
                <svg
                  key="tw"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>,
              ].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-400 hover:text-[#f5a623] transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-gray-500">
          <span className="text-white font-bold text-base">Лого</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-gray-400 hover:text-[#f5a623] transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 12l-4-4-4 4"
              />
            </svg>
          </button>
          <span>2026 WEB</span>
        </div>
      </div>
    </footer>
  );
}
