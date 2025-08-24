"use client";

import { useEffect } from "react";
import { authStore } from "@/lib/stores/authStore";

export function AuthInitializer() {
  useEffect(() => {
    // Load auth state from cookies when app starts
    authStore.getState().loadFromCookies();
  }, []);

  return null; // This component doesn't render anything
}
