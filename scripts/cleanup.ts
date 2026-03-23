import { createClient } from "@sanity/client";

const client = createClient({
    projectId: 'y7lnmhm6',
    dataset: 'production',
    token: 'sk0ct6lYuk7rOavlZRL80GtlmhwwBGDCWLMQJLRzWdRVrejl79UojFkskzOqQo5jDBcbFfBPR6r0DgsCNqKLm4OfGXcT1lkmjvAHUiOLfR2t6VhNc3hHsM05O4Zbx3Mn4N8JBVLiwJ6oHk7LXyGGgsdqHrYOJ16F',
    useCdn: false,
    apiVersion: '2024-02-26',
});

async function cleanup() {
    try {
        console.log("Cleaning up companyUser and houseModel documents for y7lnmhm6...");
        const countCompanies = await client.fetch(`count(*[_type == "companyUser"])`);
        const countModels = await client.fetch(`count(*[_type == "houseModel"])`);
        console.log(`Found ${countCompanies} companies and ${countModels} models.`);
        
        if (countCompanies > 0) {
            await client.delete({ query: '*[_type == "companyUser"]' });
            console.log("Deleted all companyUser documents.");
        }
        
        if (countModels > 0) {
            await client.delete({ query: '*[_type == "houseModel"]' });
            console.log("Deleted all houseModel documents.");
        }

        await client.delete({ query: '*[_type == "propertyClick"]' });
        await client.delete({ query: '*[_type == "modelView"]' });
        console.log("Cleaned up analytics data.");
    } catch (e) {
        console.error("Failed on y7lnmhm6, trying c3n3g73v...");
        const client2 = createClient({
            projectId: 'c3n3g73v',
            dataset: 'production',
            token: 'sk0ct6lYuk7rOavlZRL80GtlmhwwBGDCWLMQJLRzWdRVrejl79UojFkskzOqQo5jDBcbFfBPR6r0DgsCNqKLm4OfGXcT1lkmjvAHUiOLfR2t6VhNc3hHsM05O4Zbx3Mn4N8JBVLiwJ6oHk7LXyGGgsdqHrYOJ16F',
            useCdn: false,
            apiVersion: '2024-02-26',
        });
        const countCompanies = await client2.fetch(`count(*[_type == "companyUser"])`);
        console.log(`Found ${countCompanies} companies on c3n3g73v.`);
        await client2.delete({ query: '*[_type == "companyUser"]' });
        await client2.delete({ query: '*[_type == "houseModel"]' });
        console.log("Deleted documents on c3n3g73v.");
    }
}

cleanup().catch(console.error);
