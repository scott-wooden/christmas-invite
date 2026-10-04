import { handleRsvp } from "@/lib/rsvp";
import { saveRsvp } from "@/lib/supabase";

export const runtime = "nodejs";
export async function POST(request: Request) { return handleRsvp(request, saveRsvp); }
