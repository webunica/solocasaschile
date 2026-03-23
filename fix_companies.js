import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'c3n3g73v',
  dataset: 'production',
  token: 'sk0ct6lYuk7rOavlZRL80GtlmhwwBGDCWLMQJLRzWdRVrejl79UojFkskzOqQo5jDBcb3T8wDwevxn5Q16WS4p5PlXcT1lkmjvAHUiOLfR2t6VhNc3hHsM05O4Zbx3Mn4N8JBVLiwJ6oHk7LXyGGgsdqHrYOJ16FfBPR6r0DgsCNqKLm4OfG',
  useCdn: false,
  apiVersion: '2023-01-01',
});

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

async function fix() {
  try {
    const companies = await client.fetch(`*[_type == "companyUser" && !defined(slug)]{_id, company_name}`);
    console.log(`Found ${companies.length} companies without slug.`);

    for (const company of companies) {
      if (!company.company_name) {
          console.warn(`Company ${company._id} has no name. Skipping.`);
          continue;
      }
      const slug = slugify(company.company_name);
      console.log(`Updating ${company.company_name} -> slug: ${slug}`);
      
      await client
        .patch(company._id)
        .set({ 
          slug: { _type: 'slug', current: slug },
          is_active: true
        })
        .commit();
    }
    
    console.log("Migration finished.");
  } catch (e) {
    console.error(e);
  }
}

fix();
