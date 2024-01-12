import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../stores/store";
import { Navigate } from "react-router-dom";

export default function Main() {
  const currentUser = useSelector((state: RootState) => state.user);

  if (currentUser === null) {
    return <Navigate to="/auth" />;
  }

  return <p>ДАДЕЛАЙ</p>;
}
