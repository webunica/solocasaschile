import { sanityClient } from './src/lib/sanity.client';
async function run() {
    const post = await sanityClient.fetch('*[_type == "blogPost" && slug.current == "construir-casa-prefabricada-chile"][0]');
    console.log("Post:", post);
}
run().catch(console.error);
