import { sanityClient } from "@/lib/sanity.client";
import { notFound } from "next/navigation";
import EditModelForm from "./EditModelForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Obtener los datos actuales del modelo para rellenar
    const query = `*[_type == "houseModel" && _id == $id][0] {
        ...,
        "images": images[].asset->{ url }
    }`;
    const model = await sanityClient.fetch(query, { id });

    if (!model) {
        notFound();
    }

    return <EditModelForm model={model} />;
}
