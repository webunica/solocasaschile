import { ReactNode } from "react";
import Link from "next/link";
import { Hash } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-2 text-2xl font-black text-[#3200C1]">
                    <div className="w-10 h-10 rounded-xl bg-[#37FFDB] flex items-center justify-center shadow-md">
                        <Hash className="w-6 h-6 text-[#3200C1]" />
                    </div>
                    solocasaschile.com
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Acceso a Empresas
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    O{' '}
                    <span className="font-medium text-[#3200C1] hover:text-[#37FFDB] transition-colors cursor-pointer">
                        solicita dar de alta a tu constructora
                    </span>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
