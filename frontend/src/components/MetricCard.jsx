function MetricCard({ eyebrow, value, tone = "neutral", detail }) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <p className="metric-eyebrow">{eyebrow}</p>
      <h3 className="metric-value">{value}</h3>
      <p className="metric-detail">{detail}</p>
    </article>
  );
}

export default MetricCard;

