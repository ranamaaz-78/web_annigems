import { CONFIG_STEPS } from '../../data/configurator';

export default function StepProgress({ step }) {
  const fill = ((step - 1) / (CONFIG_STEPS.length - 1)) * 100;
  return (
    <>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${fill}%` }} />
      </div>
      <div className="prog-steps">
        {CONFIG_STEPS.map((label, i) => {
          const n = i + 1;
          const state = n < step ? ' done' : n === step ? ' active' : '';
          return (
            <div className={`prog-step${state}`} key={label}>
              <div className="prog-circle">
                <span>{n < step ? '✓' : n}</span>
              </div>
              <div className="prog-lbl">{label}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
