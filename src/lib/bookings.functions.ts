import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Base minutes per service (same order as the menu).
const SERVICE_MINUTES = [30, 30, 45, 60, 30, 30, 60];

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = (d: number) => (d * Math.PI) / 180;
  const dLat = r(b.lat - a.lat);
  const dLng = r(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

function gapMinutes(firstService: number, a?: { lat: number; lng: number } | null, b?: { lat: number; lng: number } | null) {
  const base = SERVICE_MINUTES[firstService] ?? 30;
  const travel = a && b ? Math.ceil(km(a, b) / 3) * 10 : 0;
  return Math.min(60, Math.max(30, base + travel));
}

async function geocode(address: string) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ma&q=${encodeURIComponent(address + ", Rabat")}`,
      { headers: { "User-Agent": "jokerbarber.ma booking" } },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!rows[0]) return null;
    return { lat: Number(rows[0].lat), lng: Number(rows[0].lon) };
  } catch {
    return null;
  }
}

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        serviceIndex: z.number().int().min(0).max(SERVICE_MINUTES.length - 1),
        startsAt: z.string().datetime(),
        address: z.string().trim().max(300).optional(),
        lat: z.number().min(-90).max(90).optional(),
        lng: z.number().min(-180).max(180).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const start = new Date(data.startsAt);
    if (start.getTime() < Date.now() - 5 * 60_000) return { ok: false as const, reason: "past" as const };

    let point = data.lat != null && data.lng != null ? { lat: data.lat, lng: data.lng } : null;
    if (!point && data.address) point = await geocode(data.address);

    const from = new Date(start.getTime() - 2 * 3600_000).toISOString();
    const to = new Date(start.getTime() + 2 * 3600_000).toISOString();
    const { data: rows, error } = await supabaseAdmin
      .from("bookings")
      .select("service_index, starts_at, lat, lng")
      .gte("starts_at", from)
      .lte("starts_at", to);
    if (error) throw new Error(error.message);

    for (const row of rows ?? []) {
      const other = new Date(row.starts_at);
      const otherPoint = row.lat != null && row.lng != null ? { lat: row.lat, lng: row.lng } : null;
      const newFirst = start <= other;
      const gap = gapMinutes(newFirst ? data.serviceIndex : row.service_index, point, otherPoint);
      const diff = Math.abs(other.getTime() - start.getTime()) / 60_000;
      if (diff < gap) {
        const next = new Date(other.getTime() + gapMinutes(row.service_index, otherPoint, point) * 60_000);
        return { ok: false as const, reason: "taken" as const, nextFree: next.toISOString() };
      }
    }

    const duration = SERVICE_MINUTES[data.serviceIndex] ?? 30;
    const { error: insertError } = await supabaseAdmin.from("bookings").insert({
      service_index: data.serviceIndex,
      starts_at: start.toISOString(),
      duration_min: duration,
      lat: point?.lat ?? null,
      lng: point?.lng ?? null,
    });
    if (insertError) throw new Error(insertError.message);
    return { ok: true as const, point };
  });
