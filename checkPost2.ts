import { sanityServerClient } from './src/lib/sanity.server';
async function run() {
    console.log("Using sanityServerClient projectId:", sanityServerClient.config().projectId);
    const post = await sanityServerClient.fetch('*[_type == "blogPost" && slug.current == "construir-casa-prefabricada-chile"][0]');
    console.log("Post:", post);
}
run().catch(console.error);
