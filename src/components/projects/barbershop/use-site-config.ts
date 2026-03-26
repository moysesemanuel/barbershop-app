"use client";

import { useSyncExternalStore } from "react";
import {
  getClientSiteConfigSnapshot,
  getServerSiteConfigSnapshot,
  SITE_CONFIG_STORAGE_KEY,
  SITE_CONFIG_UPDATED_EVENT,
} from "@/components/shared/site-config";

function subscribeToSiteConfig(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (!event.key || event.key === SITE_CONFIG_STORAGE_KEY) {
      onStoreChange();
    }
  }

  function handleLocalUpdate() {
    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SITE_CONFIG_UPDATED_EVENT, handleLocalUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SITE_CONFIG_UPDATED_EVENT, handleLocalUpdate);
  };
}

export function useSiteConfig() {
  return useSyncExternalStore(
    subscribeToSiteConfig,
    getClientSiteConfigSnapshot,
    getServerSiteConfigSnapshot,
  );
}
