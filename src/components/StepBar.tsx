const STEPS = ["Билеты", "Пассажиры", "Оплата", "Проверка"];

export default function StepBar({ active }: { active: number }) {
  return (
    <div className="bg-[#2d2d2d] flex">
      {STEPS.map((step, i) => {
        const isActive = i + 1 === active;
        const isDone = i + 1 < active;
        const isHighlighted = isActive || isDone;

        return (
          <div
            key={step}
            className={`flex items-center gap-2 px-20 py-3 text-sm font-medium relative
              ${isHighlighted ? "bg-[#f5a623] text-white" : "text-white"}
              ${i > 0 ? "-ml-3" : ""}
            `}
            style={{
              clipPath:
                i < STEPS.length - 1
                  ? "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)"
                  : undefined,
              zIndex: STEPS.length - i,
            }}
          >
            <span
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0
                ${isHighlighted ? "border-white text-white" : "border-white text-white"}
              `}
            >
              {i + 1}
            </span>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
