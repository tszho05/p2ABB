interface HealthBarProps {
  hp: number;
  label: string;
  align?: 'left' | 'right';
}

export default function HealthBar({ hp, label, align = 'left' }: HealthBarProps) {
  const labelElement = <span className="health-label">{label}</span>;
  const trackElement = (
    <div className="health-track">
      <div className="health-fill" style={{ width: `${hp}%` }} />
    </div>
  );
  const numberElement = <span className="health-number">{hp}</span>;

  return (
    <div className={`health-bar ${align}`} aria-label={`${label} HP ${hp}`} data-testid={`${align}-health-bar`}>
      {align === 'right' ? (
        <>
          {numberElement}
          {trackElement}
          {labelElement}
        </>
      ) : (
        <>
          {labelElement}
          {trackElement}
          {numberElement}
        </>
      )}
    </div>
  );
}
