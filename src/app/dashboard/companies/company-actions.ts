"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

export async function toggleCompanyStatusAction(id: string, currentStatus: boolean) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        return { error: "Sin token de escritura." };
    }
    try {
        await sanityWriteClient.patch(id).set({ is_active: !currentStatus }).commit();
        revalidatePath("/dashboard/companies");
        return { success: true, newStatus: !currentStatus };
    } catch (error: any) {
        return { error: error.message };
    }
}
