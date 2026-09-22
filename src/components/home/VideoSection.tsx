import { Maximize } from "lucide-react";
import { useRef } from "react";

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Conoce <span className="text-primary">T4</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre cómo nuestra tecnología y compromiso con la calidad nos han convertido en el socio preferido de
            instituciones de investigación en toda América Latina.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-elevated bg-muted group">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/videos/Evolucio_T4_LOGO.mp4"
              autoPlay
              muted
              playsInline
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
            />

            {/* Fullscreen button */}
            <button
              onClick={handleFullscreen}
              className="absolute bottom-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="Pantalla completa"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">15+</div>
            <div className="text-sm text-muted-foreground">Años de experiencia</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5000+</div>
            <div className="text-sm text-muted-foreground">Usuarios satisfechos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">250K+</div>
            <div className="text-sm text-muted-foreground">Oligos sintetizados</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">99%</div>
            <div className="text-sm text-muted-foreground">Tasa de pureza</div>
          </div>
        </div>
      </div>
    </section>
  );
}
