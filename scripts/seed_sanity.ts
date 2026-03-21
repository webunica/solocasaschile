import * as XLSX from 'xlsx';
import { createClient } from "@sanity/client";
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'y7lnmhm6',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
    token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_TOKEN,
    useCdn: false,
    apiVersion: '2024-02-26',
});

// Helper for slugs
const makeSlug = (text: string) => slugify(text, { lower: true, strict: true });

async function seedData() {
    console.log("Iniciando importación de Mock Data a Sanity...");
    const workbook = XLSX.readFile('c:/Users/studioo/Desktop/000000000_COMPARADOR_INMO - copia/dataset_constructoras_prefabricadas_chile_ficticio.xlsx');
    
    // 1. CARGAR EMPRESAS
    const empSheet = workbook.Sheets['Empresas'];
    const empresas: any[] = XLSX.utils.sheet_to_json(empSheet);
    
    console.log(`\nProcesando ${empresas.length} empresas...`);
    
    const companyMap = new Map();

    for (const emp of empresas) {
        if (!emp.razon_social_ficticia && !emp.nombre_empresa) continue;
        
        const companyName = emp.razon_social_ficticia || emp.nombre_empresa;
        companyMap.set(emp.empresa_id, companyName); // Save mapping for models

        const doc = {
            _type: 'companyUser',
            company_name: String(companyName),
            slug: { _type: 'slug', current: makeSlug(String(companyName)) },
            is_active: true,
            is_verified: Math.random() > 0.5,
            description: `Empresa ficticia fundada en ${emp.anio_fundacion || 2020}. Especialistas en construcción de casas en ${emp.region || 'Chile'}.`,
            email: emp.email_comercial || `contacto@${makeSlug(String(companyName))}.cl`,
            role: 'company',
            plan: 'elite', // All mock companies are Elite for demo purposes
            contact_phone: String(emp.telefono_1 || '+56900000000'),
            whatsapp_number: String(emp.telefono_1 || '56900000000'),
            address: emp.direccion_matriz || '',
            city: emp.ciudad || '',
            region: emp.region || '',
            coverage_areas: emp.region ? [makeSlug(String(emp.region)).replace(/-/g, '_')] : ['todo_chile'],
            years_experience: new Date().getFullYear() - (emp.anio_fundacion || 2020),
            projects_completed_count: emp.proyectos_cargados || Math.floor(Math.random() * 50),
        };

        try {
            await client.create(doc);
            console.log(`Creada empresa: ${companyName}`);
        } catch (e: any) {
            console.error(`Error al crear ${companyName}:`, e.message);
        }
    }

    // 2. CARGAR MODELOS
    const modSheet = workbook.Sheets['Modelos_Casa'];
    const modelos: any[] = XLSX.utils.sheet_to_json(modSheet);

    console.log(`\nProcesando ${modelos.length} modelos de casas...`);

    for (const mod of modelos) {
        const modelName = mod.referencia_toponimica || mod.nombre_modelo;
        if (!modelName) continue;

        // Recuperar nombre de empresa
        const companyName = companyMap.get(mod.empresa_id) || "Empresa Desconocida";
        
        // Random price between 10,000,000 and 60,000,000
        const randomPrice = Math.floor(Math.random() * 50) * 1000000 + 10000000;

        const baseSlug = `${makeSlug(mod.nombre_modelo)}-${mod.superficie_m2}m2-${makeSlug(companyName)}`;
        
        const doc = {
            _type: 'houseModel',
            company_name: companyName,
            model_name: mod.nombre_modelo,
            slug: { _type: 'slug', current: baseSlug },
            model_url: 'https://ejemplo.com',
            category: 'Prefabricada',
            structure_material: mod.sistema_constructivo || 'Madera',
            surface_m2: Number(mod.superficie_m2) || 50,
            bedrooms: Number(mod.dormitorios) || 2,
            bathrooms: Number(mod.banos) || 1,
            floors: Number(mod.pisos) || 1,
            price_from: randomPrice,
            currency: 'CLP',
            is_active: true,
            is_featured: Math.random() > 0.7,
            description: mod.especificaciones_tecnicas_resumen || 'Modelo de prueba para el comparador.',
        };

        try {
            await client.create(doc);
            console.log(`Creado modelo: ${mod.nombre_modelo} (${companyName})`);
        } catch (e: any) {
            console.error(`Error al crear modelo ${mod.nombre_modelo}:`, e.message);
        }
    }

    console.log("\n¡Proceso de semillado completado!");
}

seedData();
