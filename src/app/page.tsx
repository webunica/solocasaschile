import { redirect } from "next/navigation";

export const metadata = {
  title: "SolocasasChile | El Comparador de Casas Prefabricadas",
  description: "Encuentra tu casa ideal entre las mejores constructoras de Chile.",
};

export default async function HomePage() {
  redirect("/registro");
  return null;
}
