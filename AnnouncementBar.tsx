"use client";
import { useT } from "@/store/useStore";

export default function AnnouncementBar() {
  const { t } = useT();
  const items = [t("ann1"), t("ann2"), t("ann3"), t("ann4")];
  // نكرر المحتوى مرتين ليكون التكرار سلساً (الحركة تنتقل 50%)
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden bg-fg py-2 text-xs font-medium text-bg" role="region" aria-label="announcements">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {row.map((txt, i) => (
              <span key={i} className="mx-8 whitespace-nowrap">{txt}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
