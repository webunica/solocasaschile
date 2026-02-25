import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null, currency: string | null) {
  if (!price) return "Precio no informado";
  
  if (currency === "CLP") {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(price);
  }
  
  if (currency === "UF") {
    return new Intl.NumberFormat("es-CL", {
      style: "decimal",
      maximumFractionDigits: 2,
    }).format(price) + " UF";
  }
  
  return `${currency} ${price}`;
}
