import { Link } from "react-router-dom";

interface NavLink {
  label: string;
  id: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "О нас", id: "about" },
  { label: "Как это работает", id: "how-it-works" },
  { label: "Отзывы", id: "testimonials" },
  { label: "Контакты", id: "contacts" },
];

export default function Header() {
  const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 130;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="relative w-full">
      <div className="w-full flex items-center h-10 px-20">
        <div className="max-w-6xl mx-auto w-full">
          <Link
            to="/"
            className="text-white font-bold text-2xl tracking-wide drop-shadow-lg"
          >
            Лого
          </Link>
        </div>
      </div>

      <div className="w-full bg-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-20 flex items-center justify-start h-12">
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollToSection(l.id)}
                className="text-gray-300 hover:text-white text-sm transition-colors cursor-pointer bg-transparent border-none outline-none"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
