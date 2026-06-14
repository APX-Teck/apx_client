"use client";
import React from "react";

import dynamic from "next/dynamic";
import { NotificationsHeader } from "./_components/NotificationsHeader";

// Lazy load the client component to prevent hydration issues
const NotificationsCenter = dynamic(
  () => import("./_components/NotificationsCenter").then(mod => mod.NotificationsCenter),
  { ssr: false }
);

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <NotificationsHeader />
      <NotificationsCenter />
    </div>
  );
}
