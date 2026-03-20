import { PlayCircle } from "lucide-react";

export default function VideoPlayer({ url }: { url: string }) {
    if (!url) return null;

    // Convert standard YouTube watch URLs to embed
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
        embedUrl = url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
    } else if (url.includes('youtu.be/')) {
        embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
    }

    // Clean up extra parameters if any
    if (embedUrl.includes('&')) {
        embedUrl = embedUrl.split('&')[0];
    }

    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 space-y-4">
            <h3 className="font-black text-[#3200C1] text-xl mb-4 flex items-center gap-2">
                <PlayCircle className="w-6 h-6 text-[#37FFDB]" />
                Video Recorrido del Modelo
            </h3>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
                <iframe
                    src={embedUrl}
                    title="Video Recorrido"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                />
            </div>
        </div>
    );
}
