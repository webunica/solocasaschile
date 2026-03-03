import Link from "next/link";
import { Hash, ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Términos y Condiciones | SolocasasChile.com",
    description: "Léelos términos y condiciones de uso de SolocasasChile.com. Regula el acceso, navegación y uso de la plataforma de comparación de casas prefabricadas en Chile.",
};

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#37FFDB] flex items-center justify-center shadow-sm">
                                <Hash className="w-5 h-5 text-[#3200C1]" />
                            </div>
                            <Link href="/" className="text-xl font-bold text-[#3200C1]">
                                solocasaschile.com
                            </Link>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-bold text-[#3200C1] hover:text-[#37FFDB] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <div className="bg-[#3200C1] text-white py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <p className="text-[#37FFDB] text-sm font-black uppercase tracking-widest mb-3">Legal</p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Términos y Condiciones
                    </h1>
                    <p className="text-white/70 text-lg">
                        Última actualización: <strong className="text-white">2 de marzo de 2026</strong>
                    </p>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="prose prose-slate max-w-none">

                    <p className="text-slate-600 text-lg leading-relaxed mb-10">
                        Bienvenido a <strong>SolocasasChile.com</strong>.<br />
                        Los presentes Términos y Condiciones regulan el acceso, navegación y uso del sitio web <a href="https://www.solocasaschile.com" className="text-[#3200C1] font-bold hover:text-[#37FFDB] transition-colors">www.solocasaschile.com</a>, así como de todos sus contenidos, herramientas, formularios, directorios, comparadores, perfiles empresariales, publicaciones premium, catálogos, servicios promocionales y funcionalidades relacionadas.
                    </p>
                    <p className="text-slate-600 text-lg leading-relaxed mb-10">
                        Al acceder, navegar o utilizar el sitio, el usuario declara haber leído, entendido y aceptado íntegramente estos Términos y Condiciones. Si no está de acuerdo con ellos, deberá abstenerse de utilizar el sitio.
                    </p>

                    <Section number="1" title="Naturaleza de la plataforma">
                        <p>SolocasasChile.com es una plataforma digital de carácter informativo, comercial y publicitario, orientada a la exhibición, comparación, difusión y promoción de soluciones habitacionales, incluyendo, entre otras, casas prefabricadas, casas SIP, casas modulares, panelizadas, estructuras habitacionales, constructoras, fabricantes, distribuidores y servicios relacionados.</p>
                        <p className="mt-4">La plataforma tiene como objetivos principales:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
                            <li>mostrar publicaciones de empresas del rubro;</li>
                            <li>facilitar el contacto entre usuarios interesados y empresas anunciantes;</li>
                            <li>generar y derivar oportunidades comerciales o leads;</li>
                            <li>ofrecer espacios de visibilidad pagada, publicaciones premium y catálogos empresariales;</li>
                            <li>permitir, en ciertos casos, la administración o edición parcial de contenidos por parte de empresas autorizadas.</li>
                        </ul>
                        <p className="mt-4">SolocasasChile no actúa, por regla general, como vendedor directo, fabricante, constructor, inmobiliaria, mandataria, corredora, representante legal ni garante de las empresas publicadas, salvo que ello se indique expresamente en un documento separado o en una sección específica del sitio.</p>
                    </Section>

                    <Section number="2" title="Contacto">
                        <p>Para efectos de contacto general, consultas, solicitudes comerciales, temas de contenido o aspectos relacionados con estos términos, se encuentra disponible el siguiente correo:</p>
                        <p className="mt-4"><strong>Correo electrónico:</strong> <a href="mailto:solicitud@solocasaschile.com" className="text-[#3200C1] font-bold hover:underline">solicitud@solocasaschile.com</a></p>
                    </Section>

                    <Section number="3" title="Aceptación y capacidad">
                        <p>El uso del sitio implica aceptación plena de estos términos.</p>
                        <p className="mt-4">El usuario declara que:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
                            <li>tiene capacidad legal suficiente para aceptar estas condiciones;</li>
                            <li>utilizará el sitio de forma lícita y responsable;</li>
                            <li>toda información entregada en formularios será veraz, actualizada y suficiente.</li>
                        </ul>
                        <p className="mt-4">Si una persona utiliza el sitio en representación de una empresa, declara contar con facultades suficientes para obligarla en relación con las acciones que realice dentro del sitio.</p>
                    </Section>

                    <Section number="4" title="Usuarios del sitio">
                        <p>Para efectos de estos términos, se entenderá que pueden existir, entre otros, los siguientes tipos de usuarios:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
                            <li><strong>usuarios visitantes:</strong> personas que navegan o consultan contenidos del sitio;</li>
                            <li><strong>usuarios interesados o leads:</strong> personas que solicitan información, cotizaciones o contacto;</li>
                            <li><strong>empresas anunciantes:</strong> constructoras, fabricantes, distribuidores o prestadores que contratan visibilidad;</li>
                            <li><strong>usuarios autorizados de edición:</strong> personas habilitadas por SolocasasChile para cargar, actualizar o modificar contenidos específicos.</li>
                        </ul>
                        <p className="mt-4">Cada categoría podrá estar sujeta a reglas adicionales, incluso si no están publicadas de forma separada.</p>
                    </Section>

                    <Section number="5" title="Uso permitido del sitio">
                        <p>El usuario se obliga a utilizar el sitio de buena fe, conforme a la ley, al orden público y a estos términos.</p>
                        <p className="mt-4">Queda expresamente prohibido:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
                            <li>utilizar el sitio con fines ilícitos, engañosos o fraudulentos;</li>
                            <li>suplantar identidad o proporcionar antecedentes falsos;</li>
                            <li>afectar la seguridad, estabilidad o funcionamiento del sitio;</li>
                            <li>copiar, descargar, indexar, extraer o reutilizar masivamente contenidos, fichas o bases de datos sin autorización expresa;</li>
                            <li>usar robots, scrapers, spiders, scripts automatizados o herramientas de extracción sistemática;</li>
                            <li>intervenir espacios no autorizados del sitio;</li>
                            <li>alterar publicaciones ajenas;</li>
                            <li>enviar spam, mensajes masivos, publicidad no autorizada o solicitudes abusivas;</li>
                            <li>cargar contenido falso, ofensivo, ilegal, difamatorio, engañoso o que infrinja derechos de terceros;</li>
                            <li>usar la marca SolocasasChile o su contenido con fines comerciales no autorizados.</li>
                        </ul>
                        <p className="mt-4">SolocasasChile podrá suspender, bloquear, restringir o eliminar accesos y contenidos cuando detecte incumplimientos, sin necesidad de aviso previo.</p>
                    </Section>

                    <Section number="6" title="Formularios y captación de leads">
                        <p>El sitio puede incluir formularios de contacto, solicitud de información, cotización, comparación, interés por modelos, solicitud de catálogos y requerimientos comerciales.</p>
                        <p className="mt-4">Al completar y enviar un formulario, el usuario acepta expresamente que:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600">
                            <li>sus datos serán procesados para atender su consulta;</li>
                            <li>su solicitud podrá ser derivada a una o más empresas que contratan servicios dentro de la plataforma;</li>
                            <li>SolocasasChile podrá actuar como canal de contacto y derivación comercial;</li>
                            <li>el envío del formulario no garantiza contratación, disponibilidad, precio, stock, respuesta inmediata ni cierre de negocio;</li>
                            <li>una misma consulta podrá ser evaluada, clasificada, redireccionada o compartida con empresas relacionadas al interés manifestado por el usuario.</li>
                        </ul>
                        <p className="mt-4">El usuario acepta que la derivación de leads forma parte esencial del modelo de negocio de SolocasasChile.</p>
                    </Section>

                    <Section number="7" title="Derivación de leads a empresas anunciantes">
                        <p>SolocasasChile podrá derivar los antecedentes del usuario a empresas constructoras, fabricantes, distribuidores u otros anunciantes que mantengan publicaciones activas o contratos comerciales vigentes con la plataforma.</p>
                        <p className="mt-4">La derivación podrá incluir, según el caso: nombre, teléfono, correo electrónico, comuna o región, tipo de vivienda buscada, presupuesto estimado, mensaje ingresado, y otros antecedentes voluntariamente proporcionados.</p>
                        <p className="mt-4">El usuario entiende y acepta que, una vez derivado el lead, la empresa receptora será responsable del tratamiento posterior de dichos antecedentes dentro del marco de su propia gestión comercial.</p>
                    </Section>

                    <Section number="8" title="Servicios para empresas anunciantes">
                        <p>SolocasasChile podrá ofrecer servicios pagados a empresas del rubro, incluyendo, entre otros: publicación estándar de productos o modelos, publicaciones premium, espacios destacados, perfiles empresariales, publicación del catálogo completo, inclusión prioritaria en comparadores o resultados, servicios promocionales, acceso restringido para edición o administración de contenido, y campañas de visibilidad adicional.</p>
                        <p className="mt-4">La contratación de cualquiera de estos servicios no otorga a la empresa propiedad sobre el sitio, ni control sobre su estructura general, diseño, categorización, ranking, posicionamiento interno ni criterios editoriales.</p>
                        <p className="mt-4">SolocasasChile se reserva el derecho de definir el formato, ubicación, jerarquía visual, duración, diseño y modalidad de presentación de cada publicación.</p>
                    </Section>

                    <Section number="9" title="Acceso de edición para empresas o terceros">
                        <p>En ciertos casos, SolocasasChile podrá conceder accesos limitados para que empresas anunciantes o terceros autorizados actualicen contenidos específicos.</p>
                        <p className="mt-4">Dichos accesos son personales, restringidos y revocables; no transfieren propiedad ni control sobre la plataforma; se limitan al ámbito expresamente autorizado; y podrán ser suspendidos o eliminados en cualquier momento.</p>
                        <p className="mt-4">La empresa o usuario autorizado será plenamente responsable por toda acción realizada con sus credenciales o accesos. SolocasasChile no será responsable por pérdidas, errores, daños o conflictos originados en el mal uso de accesos otorgados a terceros.</p>
                    </Section>

                    <Section number="10" title="Responsabilidad por contenido publicado por empresas">
                        <p>Toda empresa anunciante, constructora, fabricante o tercero que publique, cargue, edite o actualice contenido en el sitio declara y garantiza que tiene derecho a utilizar los materiales que publique, que la información es veraz, y que no infringe derechos de propiedad intelectual ni normas aplicables.</p>
                        <p className="mt-4">La empresa será la única responsable frente a SolocasasChile, usuarios y terceros por cualquier reclamo derivado del contenido que publique, y se obliga a mantener indemne a SolocasasChile frente a cualquier reclamo relacionado.</p>
                    </Section>

                    <Section number="11" title="Facultad editorial, moderación y retiro de contenidos">
                        <p>SolocasasChile podrá, en cualquier momento y a su sola discreción, revisar, corregir, ajustar, ocultar, rechazar, suspender, retirar o eliminar contenidos, perfiles o publicaciones, especialmente cuando existan errores evidentes, contenido engañoso, información incompleta, riesgos legales, infracción de estos términos, falta de pago o mal uso de accesos.</p>
                        <p className="mt-4">La moderación de contenidos por parte de SolocasasChile no implica asumir responsabilidad sobre el fondo del material publicado por terceros.</p>
                    </Section>

                    <Section number="12" title="Publicaciones, precios y carácter referencial">
                        <p>Toda información publicada en el sitio respecto de modelos, viviendas, superficies, materiales, promociones, tiempos, costos, descuentos, montos "desde", especificaciones, plazos o beneficios tendrá <strong>carácter referencial</strong>, salvo que se indique expresamente lo contrario.</p>
                        <p className="mt-4">Los precios finales y condiciones efectivas deberán ser confirmados directamente con la empresa anunciante correspondiente.</p>
                    </Section>

                    <Section number="13" title="Relación entre usuarios y empresas">
                        <p>Toda relación comercial que se produzca entre un usuario y una empresa publicada será de exclusiva responsabilidad de dichas partes. SolocasasChile no será responsable por incumplimientos contractuales de terceros, atrasos, diferencias de precio, fallas de producto o servicio, defectos constructivos, garantías, permisos, instalación, pérdidas económicas ni reclamos posteriores a la derivación del lead.</p>
                    </Section>

                    <Section number="14" title="Sin garantía de resultados comerciales">
                        <p>SolocasasChile no garantiza a empresas anunciantes cantidad mínima de visitas, cantidad mínima de leads, ventas, conversiones, posicionamiento específico, retorno comercial, exclusividad territorial, ni resultados de negocio determinados.</p>
                        <p className="mt-4">Toda contratación de espacios publicitarios, publicaciones premium o catálogos se entiende como un servicio de visibilidad digital, no como una garantía de ventas o resultados concretos.</p>
                    </Section>

                    <Section number="15" title="Pagos, vigencia y suspensión de servicios comerciales">
                        <p>Los servicios contratados por empresas podrán estar sujetos a tarifas, plazos, renovaciones, vencimientos, suspensiones o eliminaciones por mora o incumplimiento.</p>
                        <p className="mt-4">Los pagos efectuados por servicios publicitarios, publicaciones o visibilidad digital no serán reembolsables una vez iniciado el servicio, salvo acuerdo expreso en contrario.</p>
                    </Section>

                    <Section number="16" title="Propiedad intelectual">
                        <p>Todos los elementos propios de SolocasasChile, incluyendo diseño, estructura, textos propios, comparadores, funcionalidades, programación, organización del contenido, gráficos, identidad visual, nombre comercial y demás componentes distintivos del sitio, son de propiedad de su titular o de sus respectivos licenciantes.</p>
                        <p className="mt-4">Queda prohibida su reproducción, copia, distribución, transformación, extracción o explotación sin autorización previa y escrita.</p>
                    </Section>

                    <Section number="17" title="Datos personales">
                        <p>El usuario autoriza a SolocasasChile a recopilar y tratar los datos que entregue voluntariamente por medio del sitio, con finalidades como responder consultas, gestionar solicitudes, derivar leads, contactar usuarios, ofrecer información comercial, mejorar la operación del sitio, realizar seguimiento comercial y elaborar métricas internas.</p>
                        <p className="mt-4">Cuando el usuario solicite información sobre una empresa o publicación determinada, acepta que sus datos podrán ser compartidos con dicha empresa o con empresas relacionadas al requerimiento.</p>
                    </Section>

                    <Section number="18" title="Cookies y herramientas de seguimiento">
                        <p>El sitio podrá utilizar cookies, píxeles, analítica, etiquetas de seguimiento y tecnologías similares para mejorar la navegación, recordar preferencias, medir tráfico, optimizar campañas y evaluar comportamiento de usuarios.</p>
                        <p className="mt-4">El uso continuado del sitio podrá entenderse como aceptación de estas herramientas, sin perjuicio de la configuración que cada usuario realice en su navegador.</p>
                    </Section>

                    <Section number="19" title="Sitios externos y enlaces de terceros">
                        <p>SolocasasChile puede incluir enlaces a sitios web de empresas, catálogos externos, formularios externos, WhatsApp, redes sociales y plataformas de terceros. SolocasasChile no controla ni garantiza el contenido, seguridad, funcionamiento o políticas de dichos sitios, por lo que no responde por daños derivados del acceso o uso de plataformas externas.</p>
                    </Section>

                    <Section number="20" title="Exclusión de garantías">
                        <p>El sitio se ofrece <strong>"tal cual" y "según disponibilidad"</strong>. SolocasasChile no garantiza que funcionará sin interrupciones, estará libre de errores, el contenido estará siempre actualizado, ni que el sistema será compatible con todos los dispositivos. El usuario utiliza el sitio bajo su propio riesgo.</p>
                    </Section>

                    <Section number="21" title="Limitación de responsabilidad">
                        <p>En la máxima medida permitida por la normativa aplicable, SolocasasChile no será responsable por daños directos, indirectos, incidentales, emergentes, reputacionales o patrimoniales derivados del uso del sitio, errores en publicaciones, contenido de terceros, fallas de sistema, pérdida de datos o decisiones de contratación basadas en información del sitio.</p>
                        <p className="mt-4">Si por resolución competente llegare a establecerse responsabilidad de SolocasasChile, dicha responsabilidad quedará limitada, como máximo, al monto efectivamente pagado por esa empresa por el servicio específico directamente vinculado al reclamo.</p>
                    </Section>

                    <Section number="22" title="Indemnidad">
                        <p>Las empresas anunciantes, usuarios con acceso de edición y terceros que publiquen o administren contenido se obligan a defender, indemnizar y mantener indemne a SolocasasChile frente a cualquier demanda, acción, multa, perjuicio, sanción, gasto u honorario derivado de contenido publicado por ellos, uso indebido del sitio, infracción de estos términos o conflictos comerciales con usuarios finales.</p>
                    </Section>

                    <Section number="23" title="Suspensión o terminación">
                        <p>SolocasasChile podrá suspender, limitar o terminar el acceso al sitio, a servicios específicos o a publicaciones concretas, en cualquier momento, sin necesidad de aviso previo, especialmente si detecta incumplimiento de estos términos, riesgo legal, mal uso del sistema, no pago, conflictos reiterados, información falsa o afectación reputacional del sitio.</p>
                    </Section>

                    <Section number="24" title="Modificaciones">
                        <p>SolocasasChile podrá modificar, actualizar o reemplazar estos Términos y Condiciones en cualquier momento. La versión vigente será la publicada en el sitio. El uso continuado de la plataforma después de una modificación implicará aceptación de la nueva versión.</p>
                    </Section>

                    <Section number="25" title="Nulidad parcial">
                        <p>Si una disposición de estos términos fuese declarada inválida, ilegal o inaplicable, las demás disposiciones mantendrán plena vigencia.</p>
                    </Section>

                    <Section number="26" title="Legislación aplicable y competencia">
                        <p>Estos Términos y Condiciones se regirán por las leyes de la República de Chile. Cualquier controversia relativa al sitio, sus contenidos o servicios será sometida a los tribunales competentes de Chile, sin perjuicio de los derechos que la normativa aplicable reconozca a los usuarios cuando corresponda.</p>
                    </Section>

                    <Section number="27" title="Contacto oficial">
                        <p><strong>Correo de contacto:</strong> <a href="mailto:solicitud@solocasaschile.com" className="text-[#3200C1] font-bold hover:underline">solicitud@solocasaschile.com</a></p>
                    </Section>

                </div>

                {/* Back button */}
                <div className="mt-16 pt-8 border-t border-slate-100">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-[#3200C1] text-white px-6 py-3 rounded-xl font-bold hover:-translate-y-0.5 transition-all shadow-lg shadow-[#3200C1]/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                </div>
            </main>
        </div>
    );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <h2 className="flex items-center gap-3 text-2xl font-black text-[#3200C1] mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#37FFDB] text-[#3200C1] text-sm font-black shrink-0">
                    {number}
                </span>
                {title}
            </h2>
            <div className="text-slate-600 leading-relaxed pl-11">
                {children}
            </div>
        </section>
    );
}
