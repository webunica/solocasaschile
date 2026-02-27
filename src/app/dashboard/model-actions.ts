"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

export async function toggleModelStatusAction(id: string, currentStatus: boolean) {
    await sanityWriteClient
        .patch(id)
        .set({ is_active: !currentStatus })
        .commit();

    revalidatePath("/dashboard");
    revalidatePath("/");
}
