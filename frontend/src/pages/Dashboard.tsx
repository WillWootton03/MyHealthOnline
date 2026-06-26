import axios from "axios";
import { useEffect, useState } from "react";
import { useUser, type User } from '../context/UsersContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_ROUTE;

export default function Dashboard() {
  const { user, fetchUser } = useUser();

  return (
    <div className="min-h-screen page-bg-light" style={{ fontFamily: "'Raleway', seriff"}}>

      {/* Calories Section */}
      <section ></section>
    </div>
  );
}