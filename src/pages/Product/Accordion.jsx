import { useState } from 'react';

// Single-open accordion. items: [{ title, points: string[] }]
export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="acc">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div className={`acc-item${open ? ' open' : ''}`} key={item.title}>
            <button className="acc-hdr" onClick={() => setOpenIndex(open ? null : i)} aria-expanded={open}>
              <span>{item.title}</span>
              <span className="acc-arrow">+</span>
            </button>
            <div className="acc-body">
              <ul>
                {item.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
