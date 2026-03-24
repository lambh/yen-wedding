"use client";

import { useEffect, useState } from "react";
import WeddingInvitationScene from "@/components/wedding/WeddingInvitationScene";

export default function WeddingInvitationClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <WeddingInvitationScene />;
}
