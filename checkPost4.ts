import { sanityClient } from './src/lib/sanity.client';
async function run() {
    const p = await sanityClient.fetch('*[_type == "blogPost"]{title, _id, "slug": slug.current}');
    console.log(JSON.stringify(p, null, 2));
}
run().catch(console.error);
