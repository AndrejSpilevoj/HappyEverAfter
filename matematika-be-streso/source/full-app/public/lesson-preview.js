async function showTeacherPreview() {
  try {
    const response = await fetch('/api/me', {cache: 'no-store'});
    if (!response.ok) return;
    const {user} = await response.json();
    if (user?.role !== 'teacher') return;
    document.querySelectorAll('[data-teacher-link]').forEach(link => { link.hidden = false; });
    document.querySelectorAll('[data-public-offer]').forEach(link => { link.hidden = true; });
  } catch {
    // Public lesson navigation remains available if the session check fails.
  }
}
showTeacherPreview();
