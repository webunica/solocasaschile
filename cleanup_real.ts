import { createClient } from "next-sanity";

const client = createClient({
    projectId: 'c3n3g73v',
    dataset: 'production',
    token: 'sk0ct6lYuk7rOavlZRL80GtlmhwwBGDCWLMQJLRzWdRVrejl79UojFkskzOqQo5jDBcbFfBPR6r0DgsCNqKLm4OfGXcT1lkmjvAHUiOLfR2t6VhNc3hHsM05O4Zbx3Mn4N8JBVLiwJ6oHk7LXyGGgsdqHrYOJ16F',
    useCdn: false,
    apiVersion: '2024-02-26',
});

async function cleanup() {
    console.log("Cleaning up for REAL on c3n3g73v...");
    
    const countCompanies = await client.fetch(`count(*[_type == "companyUser"])`);
    const countModels = await client.fetch(`count(*[_type == "houseModel"])`);
    
    console.log(`Initial: Found ${countCompanies} companies and ${countModels} models.`);
    
    // Delete models first
    if (countModels > 0) {
        await client.delete({ query: '*[_type == "houseModel"]' });
        console.log("Deleted all houseModel documents.");
    }
    
    if (countCompanies > 0) {
        await client.delete({ query: '*[_type == "companyUser"]' });
        console.log("Deleted all companyUser documents.");
    }

    // Analytics
    await client.delete({ query: '*[_type == "propertyClick"]' });
    await client.delete({ query: '*[_type == "modelView"]' });
    console.log("Cleaned up analytics data.");
}

cleanup().catch(e => {
    console.error("Cleanup failed:", e);
});
