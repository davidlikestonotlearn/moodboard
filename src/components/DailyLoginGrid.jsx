export function DailyLoginGrid({ days, title = 'Daily logins', variant = '' }) {
  const activeDays = days.filter(Boolean).length;
  const headingId = variant === 'mudo' ? 'mudo-use-heading' : 'daily-login-heading';
  return (
    <section className={`daily-login-section${variant === 'mudo' ? ' mudo-use-dashboard' : ''}`} aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      <div className="daily-login-grid" role="img" aria-label={`${activeDays} days with a login in the last ${days.length / 7} weeks`}>
        {days.map((count, index) => (
          <span key={index} className={`daily-login-cell${count ? ' has-activity' : ''}`} aria-hidden="true" />
        ))}
      </div>
      <p className="daily-login-caption">{activeDays ? `${activeDays} days checked in` : 'No check-ins yet'}</p>
    </section>
  );
}
