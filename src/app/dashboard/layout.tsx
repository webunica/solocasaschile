import { ReactNode } from "react";
import Link from "next/link";
import { Search, Home, Plus, Settings, LogOut, Package, Building2, Mail } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "./components/LogoutButton";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const companyName = session.user.name || "Mi Empresa";
    const isAdmin = (session.user as any).role === "admin";

    return (
        <div className="flex h-screen bg-slate-50 text-slate-800">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex shrink-0">
                <div className="p-6 border-b border-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#3200C1] flex items-center justify-center shadow-sm">
                        <Home className="w-4 h-4 text-[#37FFDB]" />
                    </div>
                    <div>
                        <span className="font-bold text-[#3200C1] block leading-tight">{companyName}</span>
                        <span className="text-xs text-slate-400 font-medium">
                            {isAdmin ? "Portal de Administración" : "Panel de Empresa"}
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <Link href="/dashboard" className="px-4 py-3 bg-[#37FFDB]/10 text-[#3200C1] rounded-xl font-bold flex items-center gap-3">
                        <Package className="w-5 h-5" />
                        Mis Modelos
                    </Link>
                    <Link href="/dashboard/add" className="px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#3200C1] rounded-xl font-bold flex items-center gap-3 transition-colors">
                        <Plus className="w-5 h-5" />
                        Añadir Nuevo
                    </Link>
                    <Link href="/dashboard/leads" className="px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#3200C1] rounded-xl font-bold flex items-center gap-3 transition-colors">
                        <Mail className="w-5 h-5" />
                        Mensajes
                    </Link>
                    <Link href="/dashboard/settings" className="px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#3200C1] rounded-xl font-bold flex items-center gap-3 transition-colors">
                        <Settings className="w-5 h-5" />
                        Ajustes
                    </Link>
                    {isAdmin && (
                        <Link href="/dashboard/companies" className="px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#3200C1] rounded-xl font-bold flex items-center gap-3 transition-colors">
                            <Building2 className="w-5 h-5" />
                            Empresas B2B
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col relative w-full">
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
                    <h2 className="text-xl font-black text-slate-800 hidden sm:block">Gestión de Propiedades</h2>
                    <h2 className="text-xl font-black text-slate-800 sm:hidden">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar modelo..."
                                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#3200C1] w-48 lg:w-64"
                            />
                        </div>
                    </div>
                </header>

                <div className="p-8 pb-32">
                    {children}
                </div>
            </main>
        </div>
    );
}
