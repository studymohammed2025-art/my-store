import { Star } from "lucide-react";

export default function Stars({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-line"} />
      ))}
    </span>
  );
}
