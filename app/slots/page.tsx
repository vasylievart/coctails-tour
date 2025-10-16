import { createClient } from "../utils/supabse/server";

export default async function Instruments() {
  const supabase = await createClient();
  const { data: slots } = await supabase.from("slots").select();
  return <pre>{JSON.stringify(slots, null, 2)}</pre>
}