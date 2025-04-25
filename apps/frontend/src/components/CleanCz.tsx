"use client";

import { useEffect } from "react";

export default function CleanCz() {
  useEffect(() => {
    // Remove cz-shortcut-listen attributes added by browser extensions
    document.documentElement.removeAttribute("cz-shortcut-listen");
    document.body.removeAttribute("cz-shortcut-listen");
  }, []);

  return null;
}
