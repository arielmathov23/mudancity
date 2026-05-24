export const GridRuler = () => (
  <div className="pointer-events-none mb-3">
    <div className="flex h-2 items-end justify-between border-b border-line">
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="bg-line"
          style={{ width: 1, height: i % 5 === 0 ? 8 : 4, opacity: 0.35 }}
        />
      ))}
    </div>
  </div>
);

export const HatchPattern = () => (
  <div
    className="h-16 w-full opacity-25"
    style={{
      backgroundImage:
        'repeating-linear-gradient(45deg, #c9bfb0 0, #c9bfb0 1px, transparent 0, transparent 50%)',
      backgroundSize: '8px 8px',
    }}
  />
);

export const SectionNumber = ({ number }: { number: string }) => (
  <span className="text-xs font-mono text-teal-700">{number}</span>
);

export const SectionDivider = ({ title }: { title: string }) => (
  <div className="border-y border-line py-2">
    <p className="text-[10px] font-mono uppercase tracking-widest text-warm-muted">{title}</p>
  </div>
);
