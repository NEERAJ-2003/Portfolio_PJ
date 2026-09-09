const STACK = [
  "Manual Testing",
  "Selenium",
  "TestNG",
  "Core Java",
  "Postman",
  "API Testing",
  "SQL",
  "Jira",
  "JMeter",
  "Apache POI",
  "Page Object Model",
  "Hybrid Framework",
  "Eclipse",
  "VS Code",
];

export default function TechMarquee() {
  const loop = [...STACK, ...STACK];
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-fade" />
      <div className="marquee-track">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-chip">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
