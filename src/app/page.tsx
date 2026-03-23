import { redirect } from "next/navigation";
import ComingSoonPage from "./coming-soon/page";

export const metadata = {
  title: "SolocasasChile | El Comparador de Casas Prefabricadas",
  description: "Encuentra tu casa ideal entre las mejores constructoras de Chile. Lanzamiento Próximamente.",
};

export default async function HomePage({ searchParams }: { searchParams: { dev?: string } }) {
  if (searchParams.dev === "true") {
      redirect("/empresas-construccion");
  }
  
  return <ComingSoonPage searchParams={searchParams} />;
}
