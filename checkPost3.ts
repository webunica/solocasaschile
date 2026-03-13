import { sanityServerClient } from './src/lib/sanity.server';
async function run() {
    const posts = await sanityServerClient.fetch('*[_type == "blogPost"]{title, slug}');
    console.log("All posts:", posts);
}
run().catch(console.error);
