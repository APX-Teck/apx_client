"use client";

import React from "react";
import PortfolioForm from "../_components/PortfolioForm";

export default function CreatePortfolioPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PortfolioForm mode="create" />
    </div>
  );
}
