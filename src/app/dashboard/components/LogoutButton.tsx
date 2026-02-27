"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold flex items-center gap-3 transition-colors"
        >
            <LogOut className="w-5 h-5" />
            Salir al Comparador
        </button>
    );
}
