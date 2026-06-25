import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

const BASE_API_URL = import.meta.env.VITE_BACKEND_BASE_ROUTE;

export type User = {
    user_id: string,
    name: string,
    email: string,
    password_hash: string,
    height: number,
    weight: number,
    age: number,
    gender: string,
    activity_level: number,
    tdee: number,
}