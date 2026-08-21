export function checkBusinessHours() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
  const hour = now.getHours();

  // Sunday is closed (0)
  if (day === 0) {
    return { isOpen: false, message: 'Closed on Sundays. Open Monday–Saturday.' };
  }

  // Monday to Saturday: 10am (10) to 7pm (19)
  if (hour < 10 || hour >= 19) {
    return { isOpen: false, message: 'Store is Closed (Hours: 10 AM - 7 PM)' };
  }

  return { isOpen: true, message: 'Open Now • Accepting Orders' };
}
