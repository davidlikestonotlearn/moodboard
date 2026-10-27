export function DailyLoginGrid({ days }) {
  const activeDays = days.filter(Boolean).length;
  return (
    <section className="settings-section daily-login-section" aria-labelledby="daily-login-heading">
      <h2 id="daily-login-heading">Daily logins</h2>
      <div className="daily-login-grid" role="img" aria-label={`${activeDays} days with a login in the last ${days.length / 7} weeks`}>
        {days.map((count, index) => (
          <span key={index} className={`daily-login-cell${count ? ' has-activity' : ''}`} aria-hidden="true" />
        ))}
      </div>
      <p className="daily-login-caption">{activeDays ? `${activeDays} days checked in` : 'No check-ins yet'}</p>
    </section>
  );
}
