import { useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Seo } from "@/components/seo/Seo";

const DEFAULTS = {
  helix: { radius: 1, height: 8, turns: 3, pointsPerTurn: 30, phaseOffset: 3.14 },
  basePairs: {
    count: 24, width: 0.1, connectorSize: 1,
    highlightIndex: 12, highlightColor: "#00ff00", highlightIntensity: 1.5,
    colors: { adenine: "#4a4082", thymine: "#854452", guanine: "#799458", cytosine: "#978c30" },
  },
  backbone: { tubeRadius: 0.075, roughness: 0.95, color1: "#384747", color2: "#384747" },
  animation: { rotationSpeed: 0.005, floatAmplitude: 0.1, floatSpeed: 0.5 },
  particles: { count: 1250, size: 0.02, color: "#021b31", spread: 5 },
  scene: { background: "#FAF5F2", fogDensity: 0.05, positionX: -2.8, cameraZ: 8 },
};

function hexToThreeHex(hex: string) {
  return parseInt(hex.replace("#", ""), 16);
}

export default function DNAConfig() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [config, setConfig] = useState(structuredClone(DEFAULTS));

  const sendConfig = useCallback((newConfig: typeof config) => {
    const msg = {
      type: "DNA_CONFIG_UPDATE",
      config: {
        helix: { ...newConfig.helix },
        basePairs: {
          count: newConfig.basePairs.count,
          width: newConfig.basePairs.width,
          connectorSize: newConfig.basePairs.connectorSize,
          highlightIndex: newConfig.basePairs.highlightIndex,
          highlightColor: hexToThreeHex(newConfig.basePairs.highlightColor),
          highlightIntensity: newConfig.basePairs.highlightIntensity,
          colors: {
            adenine: hexToThreeHex(newConfig.basePairs.colors.adenine),
            thymine: hexToThreeHex(newConfig.basePairs.colors.thymine),
            guanine: hexToThreeHex(newConfig.basePairs.colors.guanine),
            cytosine: hexToThreeHex(newConfig.basePairs.colors.cytosine),
          },
        },
        backbone: {
          tubeRadius: newConfig.backbone.tubeRadius,
          roughness: newConfig.backbone.roughness,
          color1: hexToThreeHex(newConfig.backbone.color1),
          color2: hexToThreeHex(newConfig.backbone.color2),
        },
        animation: { ...newConfig.animation },
        particles: {
          count: newConfig.particles.count,
          size: newConfig.particles.size,
          color: hexToThreeHex(newConfig.particles.color),
          spread: newConfig.particles.spread,
        },
        scene: {
          background: hexToThreeHex(newConfig.scene.background),
          fogDensity: newConfig.scene.fogDensity,
          positionX: newConfig.scene.positionX,
          cameraZ: newConfig.scene.cameraZ,
        },
      },
    };
    iframeRef.current?.contentWindow?.postMessage(msg, "*");
  }, []);

  const update = <S extends keyof typeof config>(
    section: S,
    key: string,
    value: number | string,
  ) => {
    setConfig((prev) => {
      const next = structuredClone(prev);
      const sec = next[section] as Record<string, unknown>;
      if (key.includes(".")) {
        const [k1, k2] = key.split(".");
        (sec[k1] as Record<string, unknown>)[k2] = value;
      } else {
        sec[key] = value;
      }
      sendConfig(next);
      return next;
    });
  };

  const reset = () => {
    const d = structuredClone(DEFAULTS);
    setConfig(d);
    sendConfig(d);
    toast.success("Valores restaurados");
  };

  const exportConfig = () => {
    const out = {
      helix: config.helix,
      basePairs: {
        count: config.basePairs.count,
        width: config.basePairs.width,
        connectorSize: config.basePairs.connectorSize,
        highlightIndex: config.basePairs.highlightIndex,
        highlightColor: `0x${config.basePairs.highlightColor.replace("#", "")}`,
        highlightIntensity: config.basePairs.highlightIntensity,
        colors: {
          adenine: `0x${config.basePairs.colors.adenine.replace("#", "")}`,
          thymine: `0x${config.basePairs.colors.thymine.replace("#", "")}`,
          guanine: `0x${config.basePairs.colors.guanine.replace("#", "")}`,
          cytosine: `0x${config.basePairs.colors.cytosine.replace("#", "")}`,
        },
      },
      backbone: {
        tubeRadius: config.backbone.tubeRadius,
        roughness: config.backbone.roughness,
        color1: `0x${config.backbone.color1.replace("#", "")}`,
        color2: `0x${config.backbone.color2.replace("#", "")}`,
      },
      animation: config.animation,
      particles: {
        ...config.particles,
        color: `0x${config.particles.color.replace("#", "")}`,
      },
    };
    navigator.clipboard.writeText(JSON.stringify(out, null, 2));
    toast.success("Configuración copiada al portapapeles");
  };

  const SliderRow = ({
    label, value, min, max, step, section, field,
  }: {
    label: string; value: number; min: number; max: number; step: number;
    section: keyof typeof config; field: string;
  }) => (
    <div className="grid grid-cols-[1fr_80px] gap-3 items-center">
      <div>
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([v]) => update(section, field, v)}
          className="mt-1"
        />
      </div>
      <Input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => update(section, field, parseFloat(e.target.value) || 0)}
        className="h-8 text-xs"
      />
    </div>
  );

  const ColorRow = ({
    label, value, section, field,
  }: {
    label: string; value: string; section: keyof typeof config; field: string;
  }) => (
    <div className="flex items-center gap-3">
      <Label className="text-xs text-muted-foreground w-20">{label}</Label>
      <input
        type="color"
        value={value}
        onChange={(e) => update(section, field, e.target.value)}
        className="w-10 h-8 rounded border cursor-pointer"
      />
      <span className="text-xs font-mono text-muted-foreground">{value}</span>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-80px)] gap-0">
      <Seo title="Admin · DNA Config | T4" description="Configuración de DNA 3D." noindex />
      {/* Control Panel */}
      <div className="w-[380px] shrink-0 overflow-y-auto border-r bg-background p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-foreground">🧬 DNA Config</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={reset}>
              <RotateCcw className="h-3 w-3 mr-1" /> Reset
            </Button>
            <Button size="sm" variant="default" onClick={exportConfig}>
              <Copy className="h-3 w-3 mr-1" /> Export
            </Button>
          </div>
        </div>

        <Accordion type="multiple" defaultValue={["helix", "basePairs", "backbone", "animation", "particles", "scene"]}>
          {/* HELIX */}
          <AccordionItem value="helix">
            <AccordionTrigger className="text-sm font-semibold">🧬 Hélice</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <SliderRow label="Radio" value={config.helix.radius} min={0.2} max={3} step={0.05} section="helix" field="radius" />
              <SliderRow label="Altura" value={config.helix.height} min={2} max={20} step={0.5} section="helix" field="height" />
              <SliderRow label="Vueltas" value={config.helix.turns} min={1} max={10} step={0.5} section="helix" field="turns" />
              <SliderRow label="Puntos/vuelta" value={config.helix.pointsPerTurn} min={8} max={60} step={1} section="helix" field="pointsPerTurn" />
              <SliderRow label="Desfase (rad)" value={config.helix.phaseOffset} min={0} max={6.28} step={0.01} section="helix" field="phaseOffset" />
            </AccordionContent>
          </AccordionItem>

          {/* BASE PAIRS */}
          <AccordionItem value="basePairs">
            <AccordionTrigger className="text-sm font-semibold">🔗 Pares de bases</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <SliderRow label="Cantidad" value={config.basePairs.count} min={4} max={60} step={1} section="basePairs" field="count" />
              <SliderRow label="Grosor" value={config.basePairs.width} min={0.01} max={0.3} step={0.005} section="basePairs" field="width" />
              <SliderRow label="Tamaño conector" value={config.basePairs.connectorSize} min={0.5} max={5} step={0.1} section="basePairs" field="connectorSize" />
              <SliderRow label="Índice resaltado" value={config.basePairs.highlightIndex} min={-1} max={config.basePairs.count - 1} step={1} section="basePairs" field="highlightIndex" />
              <ColorRow label="Color glow" value={config.basePairs.highlightColor} section="basePairs" field="highlightColor" />
              <SliderRow label="Intensidad glow" value={config.basePairs.highlightIntensity} min={0} max={5} step={0.1} section="basePairs" field="highlightIntensity" />
              <ColorRow label="Adenina (A)" value={config.basePairs.colors.adenine} section="basePairs" field="colors.adenine" />
              <ColorRow label="Timina (T)" value={config.basePairs.colors.thymine} section="basePairs" field="colors.thymine" />
              <ColorRow label="Guanina (G)" value={config.basePairs.colors.guanine} section="basePairs" field="colors.guanine" />
              <ColorRow label="Citosina (C)" value={config.basePairs.colors.cytosine} section="basePairs" field="colors.cytosine" />
            </AccordionContent>
          </AccordionItem>

          {/* BACKBONE */}
          <AccordionItem value="backbone">
            <AccordionTrigger className="text-sm font-semibold">🧵 Backbone</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <SliderRow label="Grosor tubo" value={config.backbone.tubeRadius} min={0.01} max={0.2} step={0.005} section="backbone" field="tubeRadius" />
              <SliderRow label="Rugosidad" value={config.backbone.roughness} min={0} max={1} step={0.05} section="backbone" field="roughness" />
              <ColorRow label="Cadena 1" value={config.backbone.color1} section="backbone" field="color1" />
              <ColorRow label="Cadena 2" value={config.backbone.color2} section="backbone" field="color2" />
            </AccordionContent>
          </AccordionItem>

          {/* ANIMATION */}
          <AccordionItem value="animation">
            <AccordionTrigger className="text-sm font-semibold">🎬 Animación</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <SliderRow label="Vel. rotación" value={config.animation.rotationSpeed} min={0} max={0.05} step={0.0005} section="animation" field="rotationSpeed" />
              <SliderRow label="Amp. flotación" value={config.animation.floatAmplitude} min={0} max={1} step={0.01} section="animation" field="floatAmplitude" />
              <SliderRow label="Vel. flotación" value={config.animation.floatSpeed} min={0} max={3} step={0.05} section="animation" field="floatSpeed" />
            </AccordionContent>
          </AccordionItem>

          {/* PARTICLES */}
          <AccordionItem value="particles">
            <AccordionTrigger className="text-sm font-semibold">✨ Partículas</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <SliderRow label="Cantidad" value={config.particles.count} min={0} max={2000} step={50} section="particles" field="count" />
              <SliderRow label="Tamaño" value={config.particles.size} min={0.005} max={0.1} step={0.005} section="particles" field="size" />
              <SliderRow label="Dispersión" value={config.particles.spread} min={1} max={20} step={0.5} section="particles" field="spread" />
              <ColorRow label="Color" value={config.particles.color} section="particles" field="color" />
            </AccordionContent>
          </AccordionItem>

          {/* SCENE */}
          <AccordionItem value="scene">
            <AccordionTrigger className="text-sm font-semibold">🎨 Escena</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <ColorRow label="Fondo" value={config.scene.background} section="scene" field="background" />
              <SliderRow label="Densidad niebla" value={config.scene.fogDensity} min={0} max={0.2} step={0.005} section="scene" field="fogDensity" />
              <SliderRow label="Posición X" value={config.scene.positionX} min={-10} max={10} step={0.1} section="scene" field="positionX" />
              <SliderRow label="Cámara Z" value={config.scene.cameraZ} min={3} max={20} step={0.5} section="scene" field="cameraZ" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* DNA Preview */}
      <div className="flex-1 relative bg-muted">
        <iframe
          ref={iframeRef}
          src="/dna-demo.html"
          className="absolute inset-0 w-full h-full border-0"
          title="DNA Preview"
        />
      </div>
    </div>
  );
}
