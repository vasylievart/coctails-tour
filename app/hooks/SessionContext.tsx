"use client"

import { createContext, useEffect, useState, useContext } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";

// 1️⃣ Create context
const SessionContext = createContext<{
  session: Session | null;
  loading: boolean;
}>({ session: null, loading: true });

// 2️⃣ Provider component
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Fetch current session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup listener
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SessionContext.Provider value={{ session, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

// 3️⃣ Custom hook
export function useSession() {
  return useContext(SessionContext);
}
