// /opt/t4Mexico/src/pages/Calculadora.tsx
import React, { useState, useEffect } from 'react';
import './Calculadora.css';

const Calculadora: React.FC = () => {
  const [amount, setAmount] = useState(25);
  const [amountUnit, setAmountUnit] = useState('nmol');
  const [targetConc, setTargetConc] = useState(100);
  const [targetUnit, setTargetUnit] = useState('uM');
  const [medium, setMedium] = useState('buffer');
  const [resValue, setResValue] = useState('250');
  const [resValueNum, setResValueNum] = useState(250); // 👈 NUEVO: valor numérico sin formato
  const [resInstruction, setResInstruction] = useState('');
  const [resWarn, setResWarn] = useState('');
  const [c1, setC1] = useState(100);
  const [c1Unit, setC1Unit] = useState('uM');
  const [c2, setC2] = useState(10);
  const [c2Unit, setC2Unit] = useState('uM');
  const [v2, setV2] = useState(100);
  const [v2Unit, setV2Unit] = useState('uL');
  const [stockValue, setStockValue] = useState('10');
  const [dilInstruction, setDilInstruction] = useState('');
  const [dilWarn, setDilWarn] = useState('');
  const [activeTab, setActiveTab] = useState('guide');

  const cFactor: { [key: string]: number } = { nM: 1, uM: 1000, mM: 1000000 };
  const aFactor: { [key: string]: number } = { pmol: 1, nmol: 1000 };
  const vFactor: { [key: string]: number } = { uL: 1, mL: 1000 };

  const fmt = (n: number) => {
    return Number.isFinite(n) 
      ? new Intl.NumberFormat('es-MX', { maximumFractionDigits: 3 }).format(n) 
      : '—';
  };

  const unitText = (u: string) => {
    const map: { [key: string]: string } = { uM: 'µM', nM: 'nM', mM: 'mM', uL: 'µL', mL: 'mL' };
    return map[u] || u;
  };

  const calcRes = () => {
    const amountVal = amount * aFactor[amountUnit];
    const concVal = targetConc * cFactor[targetUnit] / 1000;
    const v = amountVal / concVal;
    const valid = amountVal > 0 && concVal > 0 && Number.isFinite(v);

const numericValue = valid ? v : 0;
  setResValueNum(numericValue);
  setResValue(valid ? fmt(v) : '—');

    const med = medium === 'buffer' ? 'Buffer TE' : 'agua libre de nucleasas';
    setResInstruction(
      valid
        ? `Añade <strong>${fmt(v)} µL de ${med}</strong> para obtener una solución stock de <strong>${fmt(targetConc)} ${unitText(targetUnit)}</strong>.`
        : 'Completa valores mayores que cero para calcular el volumen.'
    );

    let warnMsg = '';
    if (valid && v < 1) {
      warnMsg = 'El volumen calculado es menor a 1 µL. Considera preparar una concentración stock menor o usar una estrategia de dilución que pueda pipetearse con precisión.';
    } else if (valid && v > 2000) {
      warnMsg = 'El volumen supera la capacidad habitual de un tubo de 2 mL. Divide el producto o elige una concentración mayor.';
    } else if (valid && medium === 'agua') {
      warnMsg = 'El agua libre de nucleasas puede ser adecuada para uso inmediato o cuando el EDTA interfiere. Para almacenamiento prolongado, verifica la recomendación específica de tu oligo.';
    }
    setResWarn(warnMsg);
  };

  const calcDil = () => {
    const c1Val = c1 * cFactor[c1Unit];
    const c2Val = c2 * cFactor[c2Unit];
    const v2Val = v2 * vFactor[v2Unit];
    const v1 = (c2Val * v2Val) / c1Val;
    const dil = v2Val - v1;
    const valid = c1Val > 0 && c2Val > 0 && v2Val > 0 && Number.isFinite(v1) && c2Val <= c1Val;



    setStockValue(valid ? fmt(v1) : '—');
    setDilInstruction(
      valid
        ? `Combina <strong>${fmt(v1)} µL del stock</strong> con <strong>${fmt(dil)} µL de diluyente</strong> para obtener <strong>${fmt(v2)} µL a ${fmt(c2)} ${unitText(c2Unit)}</strong>.`
        : 'La concentración final debe ser menor o igual que la concentración inicial.'
    );

    let warnMsg = '';
    if (c1Val > 0 && c2Val > c1Val) {
      warnMsg = 'Una dilución no puede producir una concentración mayor que el stock. Usa un stock más concentrado o cambia la concentración final.';
    } else if (valid && v1 < 1) {
      warnMsg = 'Debes pipetear menos de 1 µL del stock. Prepara primero una dilución intermedia para mejorar la precisión.';
    } else if (valid && dil < 1 && dil > 0) {
      warnMsg = 'El volumen de diluyente es menor a 1 µL; revisa si tu pipeta puede dispensarlo con precisión.';
    }
    setDilWarn(warnMsg);
  };

  useEffect(() => { calcRes(); }, [amount, amountUnit, targetConc, targetUnit, medium]);
  useEffect(() => { calcDil(); }, [c1, c1Unit, c2, c2Unit, v2, v2Unit]);








// Estados para el estimador de reacciones ----------------------------------------------------------------
const [reactionConc, setReactionConc] = useState(10);
const [reactionConcUnit, setReactionConcUnit] = useState('uM');
const [reactionVolume, setReactionVolume] = useState(25);
const [reactionVolumeUnit, setReactionVolumeUnit] = useState('uL');
const [reactionOligoAmount, setReactionOligoAmount] = useState(50);
const [reactionOligoUnit, setReactionOligoUnit] = useState('nmol');
const [reactionCount, setReactionCount] = useState(0);

const calcReactions = () => {
  // Convertir cantidad de oligo a pmol
  const oligoFactor: { [key: string]: number } = { pmol: 1, nmol: 1000 };
  const oligoPmol = reactionOligoAmount * oligoFactor[reactionOligoUnit];
  
  // Convertir concentración a pmol/µL
  const concFactor: { [key: string]: number } = { nM: 0.001, uM: 1, mM: 1000 };
  const concPmolPerUl = reactionConc * concFactor[reactionConcUnit];
  
  // Convertir volumen a µL
  const volFactor: { [key: string]: number } = { uL: 1, mL: 1000 };
  const volUl = reactionVolume * volFactor[reactionVolumeUnit];
  
  // Calcular pmol necesarios por reacción
  const pmolPerReaction = concPmolPerUl * volUl;
  
  // Calcular número de reacciones
  if (pmolPerReaction > 0 && oligoPmol > 0) {
    const count = oligoPmol / pmolPerReaction;
    setReactionCount(Math.floor(count)); // Redondear hacia abajo para ser conservador
  } else {
    setReactionCount(0);
  }
};




useEffect(() => { calcReactions(); }, [reactionConc, reactionConcUnit, reactionVolume, reactionVolumeUnit, reactionOligoAmount, reactionOligoUnit]);



// Estados para el estimador de reacciones----------------------------------------------------------------




  

  return (
    <main className="calculadora-app">
      <header>
        <div>
          <a href="https://t4mexico.com/" target="_blank" rel="noopener noreferrer">
            
          </a>
          <div className="eyebrow">Calculadora T4 · Herramienta de laboratorio</div>
          <h1>Calculadora de resuspensión y dilución para <span>oligos y sondas.</span></h1>
          <p className="lead">Calcula cuánto buffer o agua añadir a un oligo seco y prepara diluciones sin perderte entre unidades.</p>
        </div>
      </header>

      <nav className="tabs" aria-label="Tipo de cálculo">
        <button 
          className={`tab ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          Instructivo
        </button>
        <button 
          className={`tab ${activeTab === 'resuspension' ? 'active' : ''}`}
          onClick={() => setActiveTab('resuspension')}
        >
          Resuspensión
        </button>
        <button 
          className={`tab ${activeTab === 'dilution' ? 'active' : ''}`}
          onClick={() => setActiveTab('dilution')}
        >
          Dilución
        </button>
        <button 
          className={`tab ${activeTab === 'reactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('reactions')}
        >
          Estimador de reacciones
        </button>
      </nav>

      <section className={`panel ${activeTab === 'resuspension' ? 'active' : ''}`}>
        <div className="card">
          <h2>Resuspender un oligo seco</h2>
          <p className="sub">Ingresa la cantidad indicada en la etiqueta y la concentración stock que deseas.</p>
          <div className="grid">
            <div>
              <label htmlFor="amount">Cantidad de oligo</label>
              <div className="field">
                <input 
                  id="amount" 
                  type="number" 
                  min="0" 
                  step="any" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  inputMode="decimal" 
                />
                <select 
                  value={amountUnit}
                  onChange={(e) => setAmountUnit(e.target.value)}
                  aria-label="Unidad de cantidad"
                >
                  <option value="nmol ">nmol </option>
                  <option value="pmol ">pmol </option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="targetConc">Concentración deseada</label>
              <div className="field">
                <input 
                  id="targetConc" 
                  type="number" 
                  min="0" 
                  step="any" 
                  value={targetConc}
                  onChange={(e) => setTargetConc(Number(e.target.value))}
                  inputMode="decimal" 
                />
                <select 
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  aria-label="Unidad de concentración"
                >
                  <option value="uM">µM</option>
                  <option value="nM">nM</option>
                  <option value="mM">mM</option>
                </select>
              </div>
            </div>
            <div className="full">
              <label>Medio de resuspensión</label>
              <div className="choice">
                <button 
                  className={`medium ${medium === 'buffer' ? 'selected' : ''}`}
                  onClick={() => setMedium('buffer')}
                >
                  Buffer TE
                </button>
                <button 
                  className={`medium ${medium === 'agua' ? 'selected' : ''}`}
                  onClick={() => setMedium('agua')}
                >
                  Agua libre de nucleasas
                </button>
              </div>
            </div>
          </div>
          {resWarn && <div className="warning show" role="status">{resWarn}</div>}
        </div>
<aside className="card result" aria-live="polite">
  <h2>Volumen a añadir</h2>
  <p className="sub">Resultado calculado a partir de la cantidad total del tubo.</p>

  {(() => {
    const amountVal = amount * aFactor[amountUnit];
    const concVal = targetConc * cFactor[targetUnit] / 1000;
    const v = amountVal / concVal;
    const valid = amountVal > 0 && concVal > 0 && Number.isFinite(v);
    const numericValue = resValue !== '—' 
      ? parseFloat(resValue.replace(/,/g, '')) 
      : 0;
    const isWarning = numericValue >= 2000;

    const heightPercent = numericValue > 0 
      ? Math.min((numericValue / 2000) * 100, 100)
      : 0;

      

    return (
      <div className="result-display">
        <div className="tube-container">
<div className="tube-v2">
  {/* === MARCAS DE MEDICIÓN A LA DERECHA === */}
  <div className="tube-mark-2000">
    <span className="mark-line mark-line-full"></span>
    <span className="mark-label">2000</span>
  </div>
  <div className="tube-mark-1500">
    <span className="mark-line mark-line-full"></span>
    <span className="mark-label">1500</span>
  </div>
  <div className="tube-mark-1000">
    <span className="mark-line mark-line-full"></span>
    <span className="mark-label">1000</span>
  </div>
  <div className="tube-mark-500">
    <span className="mark-line mark-line-full"></span>
    <span className="mark-label">500</span>
  </div>
  <div className="tube-mark-0">
    <span className="mark-line mark-line-full"></span>
    <span className="mark-label">0</span>
  </div>

  {/* === TUBO === */}
  <div className="tube-body">
    <div 
      className="tube-liquid-v2"
      style={{
        height: `${Math.min((numericValue / 2000) * 100, 100)}%`,
        background: isWarning 
          ? 'linear-gradient(180deg, #ff4444 0%, #cc0000 100%)'
          : 'linear-gradient(180deg, #d2dc63 0%, #799458 100%)',
        boxShadow: isWarning 
          ? 'inset 0 0 30px rgba(255, 0, 0, 0.3), 0 0 15px rgba(255, 0, 0, 0.15)' 
          : 'inset 0 6px 15px rgba(255, 255, 255, 0.1)',
        animation: isWarning 
          ? 'pulse-warning 1.5s ease-in-out infinite' 
          : 'none',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* === EFECTO DE DESBORDE (solo cuando está en warning) === */}
      {isWarning && numericValue >= 2000 && (
        <>
          <div className="boil-effect"></div>
          <div className="overflow-effect">
            <div className="overflow-layer"></div>
            <div className="overflow-wave"></div>
            <div className="overflow-wave"></div>
            <div className="fizz-bubble"></div>
            <div className="fizz-bubble"></div>
            <div className="fizz-bubble"></div>
            <div className="fizz-bubble"></div>
            <div className="fizz-bubble"></div>
            <div className="fizz-bubble"></div>
            <div className="fizz-bubble"></div>
            <div className="fizz-bubble"></div>
          </div>
        </>
      )}

      {/* === EFECTO DE DERRAME (solo cuando está en warning y excede 2000) === */}
      {isWarning && numericValue > 2000 && (
        <div className="spill-container">
          <div className="spill-liquid"></div>
          <div className="drop"></div>
          <div className="drop"></div>
          <div className="drop"></div>
          <div className="drop"></div>
          <div className="drop"></div>
          <div className="drip"></div>
          <div className="drip"></div>
          <div className="splash-particle"></div>
          <div className="splash-particle"></div>
          <div className="splash-particle"></div>
          <div className="splash-particle"></div>
          <div className="spray-particle"></div>
          <div className="spray-particle"></div>
          <div className="spray-particle"></div>
          <div className="spray-particle"></div>
          <div className="spray-particle"></div>
        </div>
      )}

      {/* Burbujas dentro del líquido */}
      <div className="tube-bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      <div className="tube-meniscus-v2"></div>
      
      <div className="tube-bubbles-v2">
        <div className="bubble-v2"></div>
        <div className="bubble-v2"></div>
        <div className="bubble-v2"></div>
        <div className="bubble-v2"></div>
        <div className="bubble-v2"></div>
      </div>

      {isWarning && numericValue > 2000 && (
        <>
          <div className="overflow-effect-v2">
            <div className="overflow-wave-v2"></div>
            <div className="overflow-wave-v2"></div>
            <div className="fizz-bubble-v2"></div>
            <div className="fizz-bubble-v2"></div>
            <div className="fizz-bubble-v2"></div>
          </div>
          <div className="spill-container-v2">
            <div className="spill-liquid-v2"></div>
            <div className="drop-v2"></div>
            <div className="drop-v2"></div>
            <div className="drop-v2"></div>
            <div className="drip-v2"></div>
            <div className="drip-v2"></div>
          </div>
        </>
      )}
    </div>
  </div>

</div>
        </div>

        <div className="result-details">
          <div className="result-label">Añade exactamente</div>
          <div className="big">
            <span style={{ color: isWarning ? '#ff0000' : 'white' }}>
              {resValue}
            </span>
            <small>µL</small>
          </div>
          <div className="instruction" dangerouslySetInnerHTML={{ __html: resInstruction }} />
        </div>
      </div>
    );
  })()}

  <div className="formula">V (µL) = cantidad (pmol) ÷ concentración (pmol/µL)</div>
</aside>
      </section>

      <section className={`panel ${activeTab === 'dilution' ? 'active' : ''}`}>
        <div className="card">
          <h2>Preparar una dilución</h2>
          <p className="sub">Calcula el volumen de stock y el volumen de diluyente para la solución final.</p>
          <div className="grid">
            <div>
              <label htmlFor="c1">Concentración inicial (C₁)</label>
              <div className="field">
                <input 
                  id="c1" 
                  type="number" 
                  min="0" 
                  step="any" 
                  value={c1}
                  onChange={(e) => setC1(Number(e.target.value))}
                  inputMode="decimal" 
                />
                <select 
                  value={c1Unit}
                  onChange={(e) => setC1Unit(e.target.value)}
                  aria-label="Unidad de concentración inicial"
                >
                  <option value="uM">µM</option>
                  <option value="nM">nM</option>
                  <option value="mM">mM</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="c2">Concentración final (C₂)</label>
              <div className="field">
                <input 
                  id="c2" 
                  type="number" 
                  min="0" 
                  step="any" 
                  value={c2}
                  onChange={(e) => setC2(Number(e.target.value))}
                  inputMode="decimal" 
                />
                <select 
                  value={c2Unit}
                  onChange={(e) => setC2Unit(e.target.value)}
                  aria-label="Unidad de concentración final"
                >
                  <option value="uM">µM</option>
                  <option value="nM">nM</option>
                  <option value="mM">mM</option>
                </select>
              </div>
            </div>
            <div className="full">
              <label htmlFor="v2">Volumen final (V₂)</label>
              <div className="field">
                <input 
                  id="v2" 
                  type="number" 
                  min="0" 
                  step="any" 
                  value={v2}
                  onChange={(e) => setV2(Number(e.target.value))}
                  inputMode="decimal" 
                />
                <select 
                  value={v2Unit}
                  onChange={(e) => setV2Unit(e.target.value)}
                  aria-label="Unidad de volumen final"
                >
                  <option value="uL">µL</option>
                  <option value="mL">mL</option>
                </select>
              </div>
            </div>
          </div>
          {dilWarn && <div className="warning show" role="status">{dilWarn}</div>}
        </div>
        <aside className="card result" aria-live="polite">
          <h2>Preparación</h2>
          <p className="sub">Volúmenes que debes combinar.</p>
          <div className="result-label">Toma del stock</div>
          <div className="big">
            <span>{stockValue}</span>
            <small>µL</small>
          </div>
          <div className="instruction" dangerouslySetInnerHTML={{ __html: dilInstruction }} />
          <div className="formula">C₁ × V₁ = C₂ × V₂</div>
        </aside>
      </section>

      <section className={`panel guide ${activeTab === 'guide' ? 'active' : ''}`}>
        <article className="card guide-card">
          <h2>Instructivo de resuspensión de oligos y sondas</h2>
          <p className="sub">Guía de almacenamiento y manipulación</p>

          {/* === NUEVA SECCIÓN: Recomendaciones para el área de trabajo === */}
          <h3>Recomendaciones para el área de trabajo</h3>
          <div className="work-area-tips">
            <div className="tip-grid">
              <div className="tip-item">
                <span className="tip-icon">🧪</span>
                <p>Realizar la hidratación y preparación de alícuotas en un <strong>área limpia</strong> destinada a actividades pre-PCR.</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🚫</span>
                <p>Mantener esta área físicamente <strong>separada</strong> de las zonas donde se manipulan productos de PCR o amplicones.</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">⛔</span>
                <p><strong>No ingresar</strong> al área material proveniente de zonas post-PCR.</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🧹</span>
                <p><strong>Limpiar y descontaminar</strong> la superficie de trabajo antes y después de cada sesión.</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">📋</span>
                <p>Mantener la superficie <strong>despejada</strong> y colocar únicamente el material necesario para la actividad.</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🔬</span>
                <p>Utilizar <strong>micropipetas dedicadas</strong> exclusivamente al área pre-PCR.</p>
              </div>
            </div>
          </div>

          {/* === NUEVA SECCIÓN: Preparación de stock y alícuotas === */}
          <h3>Preparación de stock y alícuotas</h3>
          <div className="stock-preparation">
            <div className="stock-card">
              <div className="stock-icon">📦</div>
              <div>
                <strong>Mantener una solución stock concentrada</strong>
                <p>Preparar a partir de ella las soluciones de trabajo necesarias. Evitar utilizar rutinariamente la solución stock para preparar cada PCR.</p>
              </div>
            </div>
            <div className="stock-card">
              <div className="stock-icon">🧪</div>
              <div>
                <strong>Dividir en alícuotas</strong>
                <p>Las soluciones de trabajo deben dividirse en alícuotas de volumen acorde con el consumo habitual para evitar ciclos de congelación-descongelación.</p>
              </div>
            </div>
          </div>

          <h3>Recomendaciones de almacenamiento</h3>
          <div className="storage-grid">
            <div className="storage-item">
              <strong>Envío de nuestros productos</strong>
              <div className="temp">Temperatura ambiente</div>
              <p>Seco/liofilizado</p>
            </div>
            <div className="storage-item">
              <strong>Almacenamiento a corto plazo máximo 3 meses</strong>
              <div className="temp">Refrigeración</div>
              <p>5 °C ± 3 °C · Seco/liofilizado/hidratado</p>
            </div>
            <div className="storage-item">
              <strong>Almacenamiento a largo plazo mínimo 24 meses</strong>
              <div className="temp">Congelación</div>
              <p>-15 °C ± 5 °C · Seco/liofilizado/hidratado</p>
            </div>
          </div>

          <div className="definition">
            <p><strong>Seco:</strong> Se refiere a los oligonucleótidos en forma seca (en pellet) o liofilizados.</p>
            <p><strong>Hidratado:</strong> Se refiere a los oligonucleótidos disueltos en buffer TE (10 mM Tris HCl/1 mM EDTA) pH 8.0 o agua libre de nucleasas.</p>
          </div>

          <h3>Recomendaciones de uso</h3>
          <ol className="protocol">
            <li>Antes de utilizar <strong>da un spin o centrifuga</strong> brevemente para asegurar que el pellet quede al fondo del tubo.</li>
            <li><strong>Resuspende</strong> tus oligos y sondas en el volumen indicado en la etiqueta del tubo. Preferentemente utiliza TE Buffer (10 mM Tris HCl/1 mM EDTA) pH 8.0 o agua libre de nucleasas. <strong>Permite</strong> que tus oligos y sondas se hidraten por varios minutos.</li>
            <li><strong>Vortexea</strong> para garantizar la disolución de los oligos y sondas.</li>
            <li><strong>Da un spin</strong> para evitar que se quede material en la tapa.</li>
          </ol>
          <div className="ready">¡Tus oligos o sondas están listos para usarse!</div>

          <h3>Notas</h3>
          <ul className="notes">
            <li>Recomendamos diluir tu solución stock a una concentración de trabajo adecuada.</li>
            <li>Una vez diluida, divide esta solución de trabajo en múltiples alícuotas, las cuales pueden almacenarse refrigeradas o congeladas.</li>
            <li>Determina un volumen adecuado de cada alícuota para minimizar la exposición del oligo al entorno del laboratorio y el número de ciclos de congelación -descongelación.</li>
            <li>Para garantizar una actividad óptima, las sondas o cualquier oligo marcado con modificaciones siempre deben protegerse de la luz y el aire para evitar la fotodegradación.</li>
            <li>Recomendamos almacenarse en tubos ámbar o en tubos transparentes dentro de un recipiente opaco secundario.</li>
          </ul>
          <p>En caso de tener alguna duda o requerir asistencia adicional, no dudes en <a href="https://t4mexico.com/contacto" target="_blank" rel="noopener noreferrer">contactarnos.</a></p>
        </article>
      </section>

      <section className="steps" aria-label="Buenas prácticas">
        <article className="tip">
          <span className="n">1</span>
          <strong>Revisa las unidades</strong>
          <p>La calculadora convierte automáticamente entre nM, µM y mM.</p>
        </article>
        <article className="tip">
          <span className="n">2</span>
          <strong>Respeta tu pipeta</strong>
          <p>Si el volumen es menor a 1 µL, prepara una dilución intermedia para reducir el error.</p>
        </article>
        <article className="tip">
          <span className="n">3</span>
          <strong>Registra el resultado</strong>
          <p>Etiqueta el tubo con concentración, medio y fecha de preparación.</p>
        </article>
      </section>
      

<br />

<section className={`panel ${activeTab === 'reactions' ? 'active' : ''}`}>
  <div className="card">
    <h2>Estimador de número de reacciones</h2>
    <p className="sub">
      Calcula cuántas reacciones puedes realizar con tu cantidad de oligo disponible.
    </p>
    <br />
    <div >
      <div>
        <label htmlFor="reactionOligoAmount">Cantidad de oligo entregada</label>
        <div className="field">
          <input
            id="reactionOligoAmount"
            type="number"
            min="0"
            step="any"
            value={reactionOligoAmount}
            onChange={(e) => setReactionOligoAmount(Number(e.target.value))}
            inputMode="decimal"
          />
          <select
            value={reactionOligoUnit}
            onChange={(e) => setReactionOligoUnit(e.target.value)}
            aria-label="Unidad de cantidad de oligo"
            
          >
            <option value="nmol">nmol</option>
            <option value="pmol">pmol</option>
          </select>
        </div>
      </div>
      <br />
      <div>
        <label htmlFor="reactionConc">Concentración deseada en la reacción</label>
        <div className="field">
          <input
            id="reactionConc"
            type="number"
            min="0"
            step="any"
            value={reactionConc}
            onChange={(e) => setReactionConc(Number(e.target.value))}
            inputMode="decimal"
          />
          <select
            value={reactionConcUnit}
            onChange={(e) => setReactionConcUnit(e.target.value)}
            aria-label="Unidad de concentración"
          >
            <option value="uM">µM</option>
            <option value="nM">nM</option>
            <option value="mM">mM</option>
          </select>
        </div>
      </div>
    <br />
      <div >
        <label htmlFor="reactionVolume">Volumen de reacción</label>
        <div className="field">
          <input
            id="reactionVolume"
            type="number"
            min="0"
            step="any"
            value={reactionVolume}
            onChange={(e) => setReactionVolume(Number(e.target.value))}
            inputMode="decimal"
          />
          <select
            value={reactionVolumeUnit}
            onChange={(e) => setReactionVolumeUnit(e.target.value)}
            aria-label="Unidad de volumen"
          >
            <option value="uL">µL</option>
            <option value="mL">mL</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <aside className="card result" aria-live="polite">
    <h2>Reacciones estimadas</h2>
    <p className="sub"  style={{ marginBottom: '1.5rem' }}>Número de reacciones que puedes preparar con tu oligo.</p>
    
    <div className="result-display">
      <div className="result-details">
        <div className="result-label">Reacciones potenciales</div>
        <div className="big">
          <span style={{ color: reactionCount > 0 ? '#d2dc63' : '#ff6b6b' }}>
            {reactionCount > 0 ? reactionCount.toLocaleString('es-MX') : '—'}
          </span>
          <small>reacciones</small>
        </div>
        {reactionCount > 0 && (
          <div className="instruction">
            Con <strong>{reactionOligoAmount} {reactionOligoUnit}</strong> de oligo a 
            <strong> {reactionConc} {unitText(reactionConcUnit)}</strong> en 
            <strong> {reactionVolume} {unitText(reactionVolumeUnit)}</strong> por reacción.
          </div>
        )}
        <div className="formula">Reacciones = Cantidad (pmol) ÷ (Concentración × Volumen)</div>
      </div>
    </div>

    {/* Nota importante */}
    <div className="reaction-warning-note" role="status">
      <strong>⚡ Nota importante:</strong> Esta herramienta es para fines estimativos y los valores calculados son bajo condiciones ideales sin pérdidas por pipeteo u otras manipulaciones. El número real de reacciones puede ser menor al valor reportado.
    </div>
  </aside>
</section>






      <footer>
        <span>Calculadora orientativa para uso en investigación.</span>
        <span>Verifica siempre la ficha técnica de tu oligo y el protocolo de tu ensayo.</span>
      </footer>
    </main>
  );
};

export default Calculadora;