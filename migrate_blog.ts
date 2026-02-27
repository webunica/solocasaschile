import { createClient } from '@sanity/client';
import { htmlToBlocks } from '@portabletext/block-tools';
import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'c3n3g73v',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: "sk0ct6lYuk7rOavlZRL80GtlmhwwBGDCWLMQJLRzWdRVrejl79UojFkskzOqQo5jDBcb3T8wDwevxn5Q16WS4p5PlXcT1lkmjvAHUiOLfR2t6VhNc3hHsM05O4Zbx3Mn4N8JBVLiwJ6oHk7LXyGGgsdqHrYOJ16FfBPR6r0DgsCNqKLm4OfG",
    apiVersion: '2024-02-26',
    useCdn: false,
});

const POST_DATA = {
    "ahorrar-calefaccion-paneles-sip": {
        title: "Cómo ahorrar un 40% en calefacción con paneles SIP",
        category: "Guía Viral",
        image: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>El ahorro energético no es solo una cuestión de ecología, sino de economía doméstica. En Chile, donde los inviernos pueden ser crudos, los <strong>paneles SIP</strong> se presentan como la solución definitiva.</p>
            <h2>¿Por qué el ahorro es tan significativo?</h2>
            <p>A diferencia de la construcción tradicional, el panel SIP crea un envolvente térmico continuo. Esto significa que no hay puentes térmicos por donde escape el calor.</p>
            <ul>
                <li><strong>Eficiencia del núcleo:</strong> El poliestireno de alta densidad actúa como una barrera impenetrable para el frío.</li>
                <li><strong>Hermeticidad:</strong> Las uniones selladas impiden filtraciones de aire.</li>
            </ul>
        `
    },
    "top-10-casas-modulares-chile-2026": {
        title: "Top 10 modelos de casas modulares en Chile 2026",
        category: "Tendencias",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Este 2026, la tendencia se inclina hacia la personalización y la sostenibilidad. Aquí te presentamos los modelos que están liderando las búsquedas en <strong>solocasaschile.com</strong>.</p>
            <h2>1. El Modelo Nórdico Minimalista</h2>
            <p>Líneas limpias y máximo aprovechamiento de luz natural.</p>
            <h2>2. La Cabaña Alpina Moderna</h2>
            <p>Ideal para el sur de Chile, combinando madera con tecnología SIP.</p>
        `
    },
    "modelos-casas-sip-tendencias": {
        title: "Modelos de Casas SIP: Tendencias de Diseño para 2026",
        category: "Diseño",
        image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Exploramos las innovaciones estéticas que están definiendo el futuro de la arquitectura con paneles SIP en este 2026.</p>
            <h2>Líneas Limpias y Eficiencia</h2>
            <p>La tendencia principal es el minimalismo funcional, donde cada metro cuadrado está optimizado térmicamente.</p>
        `
    },
    "prefabricadas-vs-tradicional": {
        title: "Casas Prefabricadas vs Construcción Tradicional en Chile: ¿Cuál es la mejor opción?",
        category: "Consejos",
        image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Elegir entre <strong>casas prefabricadas vs construcción tradicional en Chile</strong> no es solo una decisión de precio. En Chile, donde el clima, la logística y la mano de obra influyen fuerte, conviene comparar costo total, tiempos reales, durabilidad y flexibilidad del proyecto para determinar cuál es la mejor opción.</p>
            <h2>¿Qué se considera “Casa Prefabricada” en Chile?</h2>
            <p>Una <strong>casa prefabricada</strong> es una vivienda fabricada parcial o totalmente en un taller y luego transportada y montada en terreno. Puede ser panelizada (como las <a href="/blog/ventajas-casas-sip-chile" style="text-decoration: underline; color: #3200C1;">casas SIP</a>), modular o de estructura liviana.</p>
            <p><strong>La clave:</strong> Gran parte del trabajo se hace fuera de obra con procesos repetibles y controlados.</p>
            <h2>¿Qué es Construcción Tradicional?</h2>
            <p>La <strong>construcción tradicional</strong> se refiere a la obra hecha principalmente en terreno con sistemas como albañilería (ladrillo), hormigón armado o estructuras de madera ejecutadas in situ. Es más “artesanal” y depende directamente de las condiciones del lugar.</p>
            <h2>Casas Prefabricadas vs Tradicional: ¿Cuál conviene realmente?</h2>
            <h3>1) Comparación de Costos</h3>
            <p><strong>Costos prefabricadas:</strong> Precio inicial más “cerrado”. Eficiencia en fabricación pero ojo con lo que NO incluye (fundaciones, conexiones, permisos). Conoce más sobre <a href="/blog/financiamiento-casas-prefabricadas-chile" style="text-decoration: underline; color: #3200C1;">financiamiento para casas prefabricadas</a>.</p>
            <p><strong>Costos tradicional:</strong> Permite ajustar costos por etapas, pero es más sensible a imprevistos y alzas de materiales durante la construcción.</p>
            <h3>2) Tiempos de entrega y construcción</h3>
            <p><strong>Tiempos prefabricadas:</strong> Notablemente más rápidas. El montaje es eficiente y se reduce la exposición a climas adversos durante la obra. Ideal para proyectos con urgencia.</p>
            <p><strong>Tiempos tradicional:</strong> Más lenta por procesos húmedos, tiempos de secado y la necesaria coordinación de múltiples cuadrillas en terreno.</p>
            <h3>3) Durabilidad y mantenimiento</h3>
            <p>La <strong>durabilidad y vida útil</strong> depende de la calidad de ejecución más que del método constructivo. Una <strong>casa prefabricada</strong> con buenos sellos y mantención adecuada puede durar tanto como una <strong>construcción tradicional</strong> de hormigón. Ambas requieren cumplir con la normativa chilena.</p>
            <h2>Conclusión: ¿Cuándo elegir cada sistema constructivo?</h2>
            <ul>
                <li><strong>Elige una Casa Prefabricada si:</strong> Priorizas rapidez en la construcción, quieres un mayor control del presupuesto final y construyes en zonas de clima difícil (como el sur de Chile).</li>
                <li><strong>Elige Construcción Tradicional si:</strong> Quieres una personalización arquitectónica total desde cero o planeas ampliar la casa por etapas de forma compleja a largo plazo.</li>
            </ul>
        `
    },
    "ventajas-casas-sip-chile": {
        title: "Ventajas de las Casas SIP en Chile: Beneficios y Características",
        category: "Casas SIP",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Las <strong>casas SIP en Chile</strong> (Structural Insulated Panels o Paneles Estructurales Aislados) se han vuelto una alternativa cada vez más buscada por una razón simple: el país cuenta con climas muy exigentes y cambiantes, donde la eficiencia energética es fundamental.</p>
            <h2>Beneficios de las Casas SIP en el Clima Chileno</h2>
            <p>Desde lluvias intensas y frío extremo en el sur hasta el calor fuerte en la zona norte y central, la <strong>envolvente térmica</strong> de una vivienda hace toda la diferencia para tu calidad de vida.</p>
            <h3>1. Eficiencia Energética y Aislación Térmica Superior</h3>
            <p>El núcleo de poliuretano o poliestireno actúa como barrera de temperatura. Esto se traduce en más confort durante el año y un <a href="/blog/ahorrar-calefaccion-paneles-sip" style="text-decoration: underline; color: #3200C1;">ahorro de hasta un 40% en calefacción</a>. Las <strong>casas de paneles SIP</strong> mantienen el calor en invierno y el frescor en verano.</p>
            <h3>2. Rapidez de Construcción</h3>
            <p>La construcción en seco permite un ensamblaje mucho más veloz en comparación con construcciones de albañilería tradicional. Es ideal para zonas con ventanas de buen clima muy ajustadas, donde acortar los tiempos de obra es primordial.</p>
            <h3>3. Resistencia Estructural y Sismorresistencia</h3>
            <p>El panel SIP al unirse funciona de forma monolítica. En un país sísmico como Chile, su comportamiento estructural distribuye las cargas de manera óptima, aportando flexibilidad y resistencia superior.</p>
        `
    },
    "financiamiento-casas-prefabricadas-chile": {
        title: "Guía de Financiamiento para Casas Prefabricadas en Chile",
        category: "Guías de Compra",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Financiar una casa prefabricada en Chile puede ser distinto a comprar una propiedad terminada. Aquí te explicamos las opciones disponibles para hacer realidad tu proyecto.</p>
            <h2>Opciones de Crédito</h2>
            <ul>
                <li><strong>Crédito Hipotecario:</strong> Algunas instituciones permiten financiar la construcción si el terreno está a tu nombre.</li>
                <li><strong>Créditos de Fines Generales:</strong> Una opción flexible para montos menores o terminaciones.</li>
            </ul>
            <h2>Convenios con Constructoras</h2>
            <p>Muchas empresas de casas modulares tienen alianzas con bancos para facilitar el proceso de aprobación.</p>
        `
    },
    "eficiencia-energetica-vivienda-chile": {
        title: "Eficiencia Energética: Cómo certificar tu vivienda en Chile",
        category: "Eficiencia Energética",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>En Chile, la Calificación Energética de Viviendas (CEV) es una herramienta clave para entender el desempeño térmico de tu hogar.</p>
            <h2>¿Por qué certificar?</h2>
            <p>Una vivienda eficiente no solo ahorra dinero, sino que tiene un mayor valor de reventa y proporciona un ambiente más saludable.</p>
            <h2>Aspectos Evaluados</h2>
            <ul>
                <li>Calidad de la envolvente térmica.</li>
                <li>Sistemas de climatización y agua caliente.</li>
                <li>Uso de energías renovables.</li>
            </ul>
        `
    },
    "permisos-municipales-construccion-chile": {
        title: "Permisos Municipales: Qué necesitas para construir legalmente",
        category: "Consejos",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Construir sin permiso municipal puede traerte multas y problemas legales graves. Sigue estos pasos para regularizar tu obra en Chile.</p>
            <h2>Pasos Críticos</h2>
            <ol>
                <li><strong>Certificado de Informaciones Previas (CIP):</strong> Define qué puedes construir en tu terreno.</li>
                <li><strong>Permiso de Edificación:</strong> Aprobación de los planos por la Dirección de Obras Municipales (DOM).</li>
                <li><strong>Recepción Definitiva:</strong> El certificado que permite habitar la casa legalmente.</li>
            </ol>
        `
    }
};

async function migrate() {
    console.log("Iniciando migración de Blog a Sanity...");

    // Necesitamos compilar los schemas del bloque (default Block types) para el convertidor HTML -> PortableText
    // Usamos BlockTools con JSDOM para parsear el HTML rudo en PortableTextBlocks de Sanity
    const { window } = new JSDOM('');

    const blockContentType = {
        type: 'array',
        name: 'body',
        of: [{ type: 'block' }]  // Basico sufficiente para nuestro caso
    };

    const blockType = blockContentType.of[0];

    let count = 0;
    for (const [slug, data] of Object.entries(POST_DATA)) {
        console.log(`Parseando: ${slug}`);

        let portableTextBody = [];
        try {
            portableTextBody = htmlToBlocks(data.content, blockContentType.of[0], {
                parseHtml: html => new window.DOMParser().parseFromString(html, 'text/html')
            });
        } catch (e) {
            console.error("Error parseando HTML a Blocks:", e)
        }

        const doc = {
            _type: 'blogPost',
            _id: `post-${slug.replace(/[^a-zA-Z0-9-]/g, "")}`,
            title: data.title,
            slug: {
                _type: 'slug',
                current: slug
            },
            body: portableTextBody,
            publishedAt: new Date().toISOString(),
            excerpt: "Guía completa y consejos de " + data.title,
            category: data.category
            // No subiremos la imagen como asset real por simplicidad, aunque el schema sí la permite vacía o como un asset reference
        };

        try {
            await client.createOrReplace(doc);
            console.log(`✅ Subido: ${doc.title}`);
            count++;
        } catch (error) {
            console.error(`❌ Error subiendo ${doc.title}:`, error.message);
        }
    }

    console.log(`\nMigración completa. ${count} posts de blog subidos a Sanity.`);
}

migrate();
