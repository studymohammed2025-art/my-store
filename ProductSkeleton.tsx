export default function ProductSkeleton() {
  return (
    <div aria-hidden>
      <div className="skeleton aspect-[3/4] rounded-xl2" />
      <div className="skeleton mt-3 h-3.5 w-4/5 rounded" />
      <div className="skeleton mt-2 h-3.5 w-1/3 rounded" />
    </div>
  );
}
