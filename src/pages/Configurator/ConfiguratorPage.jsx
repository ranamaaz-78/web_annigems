import { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useShop } from '../../hooks/useShop';
import { useUI } from '../../hooks/useUI';
import { configuratorTotal } from '../../utils/pricing';
import PreviewStep from './PreviewStep';
import RingStep from './RingStep';
import SizeStep from './SizeStep';
import StepProgress from './StepProgress';
import StoneStep from './StoneStep';

const SELECT_DELAY_MS = 200; // short pause so the selection highlight is visible
const RESTART_DELAY_MS = 3500;

export default function ConfiguratorPage() {
  const { addToCart } = useShop();
  const { showToast } = useUI();
  const [step, setStep] = useState(1);
  const [ring, setRing] = useState(null);
  const [size, setSize] = useState(null);
  const [stone, setStone] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const goToStep = (n, delay = 0) => {
    clearTimeout(timer.current);
    const go = () => {
      setStep(n);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if (delay) timer.current = setTimeout(go, delay);
    else go();
  };

  const restart = () => {
    clearTimeout(timer.current);
    setRing(null);
    setSize(null);
    setStone(null);
    goToStep(1);
  };

  const handleAddToCart = () => {
    const key = `conf-${ring.id}-${stone.id}-${size}`;
    addToCart({
      key,
      id: key,
      kind: 'config',
      name: `${ring.name} x ${stone.name}`,
      subtitle: `Custom ${ring.setting} + ${stone.name}`,
      price: configuratorTotal(ring, stone),
      image: stone.images[ring.id] ?? ring.image,
      meta: { size, stone: stone.name, ring: ring.name },
    });
    showToast(`${ring.name} x ${stone.name} added to cart!`);
    timer.current = setTimeout(restart, RESTART_DELAY_MS);
  };

  return (
    <div className="conf-wrap">
      <div className="conf-hdr">
        <Breadcrumb
          items={[{ label: 'Home', to: '/' }, { label: 'Design Your Ring' }]}
          style={{ justifyContent: 'center', border: 'none', paddingBottom: 0, marginBottom: 12 }}
        />
        <h1 className="conf-hdr-title">
          Design Your
          <br />
          <em>Perfect Ring</em>
        </h1>
        <p className="conf-hdr-sub">
          Choose your setting, select your size, pick your stone.
          <br />
          Priced live on today&apos;s gold market - every piece truly yours.
        </p>
      </div>

      <StepProgress step={step} />

      {step === 1 && (
        <RingStep
          selected={ring}
          onSelect={(r) => {
            setRing(r);
            goToStep(2, SELECT_DELAY_MS);
          }}
        />
      )}
      {step === 2 && <SizeStep selected={size} onSelect={setSize} onBack={() => goToStep(1)} onNext={() => goToStep(3)} />}
      {step === 3 && ring && size && (
        <StoneStep
          ring={ring}
          size={size}
          selected={stone}
          onSelect={(s) => {
            setStone(s);
            goToStep(4, SELECT_DELAY_MS);
          }}
          onChangeRing={() => goToStep(1)}
          onBack={() => goToStep(2)}
        />
      )}
      {step === 4 && ring && size && stone && (
        <PreviewStep ring={ring} size={size} stone={stone} onAddToCart={handleAddToCart} onRestart={restart} />
      )}
    </div>
  );
}
