export default function PageIndex({ items, activeSection, progress }) {
  return (
    <nav className="page-index" aria-label="页面章节索引">
      <span className="page-index-heading" aria-hidden="true">PAGE INDEX <b>{String(progress).padStart(3, '0')}%</b></span>
      <div className="page-index-map">
        <span className="page-index-position" style={{ '--reading-progress': Math.max(0, Math.min(progress, 100)) / 100 }} aria-hidden="true" />
        {[{ label: '首页', en: 'HOME', href: '#top' }, ...items].map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={activeSection === item.href.slice(1) ? 'is-active' : undefined}
            aria-label={`跳转到${item.label}`}
            aria-current={activeSection === item.href.slice(1) ? 'location' : undefined}
          >
            <span className="page-index-number" aria-hidden="true">{String(index).padStart(2, '0')}</span>
            <span className="page-index-lines" aria-hidden="true"><i /><i /><i /></span>
            <span className="page-index-name" aria-hidden="true">{item.label}<small>{item.en}</small></span>
          </a>
        ))}
      </div>
    </nav>
  )
}
