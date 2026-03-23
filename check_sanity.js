const { createClient } = require('next-sanity');

const client = createClient({
  projectId: 'c3n3g73v',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
});

async function check() {
  try {
    const models = await client.fetch(`*[_type == "houseModel"]{company_name}[0..20]`);
    const companies = await client.fetch(`*[_type == "companyUser"]{company_name, slug}[0..20]`);
    
    console.log("=== MODELS COMPANIES ===");
    console.log(JSON.stringify(models, null, 2));
    console.log("=== REGISTERED COMPANIES ===");
    console.log(JSON.stringify(companies, null, 2));
  } catch (e) {
    console.error(e);
  }
}

check();
