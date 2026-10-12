import { Link } from 'react-router-dom';
import { MEGA_MENU } from '../../data/site';

export default function MegaMenu() {
  const { columns, featured } = MEGA_MENU;
  return (
    <div className="mega">
      <div className="mega-box">
        {columns.map((col) => (
          <div className="mega-col" key={col.heading}>
            <p className="mega-head">{col.heading}</p>
            {col.links.map((link) => (
              <Link className="mega-lk" key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
        <div className="mega-feat">
          <img src={featured.image} alt={featured.name} />
          <p className="mega-feat-tag">{featured.tag}</p>
          <p className="mega-feat-name">{featured.name}</p>
          <Link className="btn-gsm" to={featured.to}>
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
