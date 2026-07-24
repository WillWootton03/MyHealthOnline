import axios from "axios";
import { useEffect, useState } from "react";
import { useUser, type User } from '../context/UsersContext';
import DailyCalorieDisplay from "../components/DailyCalorieDisplay";

const API_BASE_URL = import.meta.env.VITE_API_BASE_ROUTE;

export default function Dashboard() {

  return (
    <div className="min-h-screen page-bg-light">
      <main className="max-w-5xl mx-auto px-5 py-7 space-y-6">
        <DailyCalorieDisplay />
      </main>
    </div>
  );
}