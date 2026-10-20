const RETAIL_STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutSteps({ current, steps = RETAIL_STEPS }) {
  return (
    <div className="co-steps">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < current ? ' done' : n === current ? ' active' : '';
        return (
          <div key={label} style={{ display: 'contents' }}>
            {i > 0 && <div className="co-step-line" />}
            <div className={`co-step${state}`}>
              <span>{n}</span> {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
