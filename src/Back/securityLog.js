export function logSecurityEvent(type, details = {}) {
  const safeDetails = { ...details };

  // Evitar guardar secretos en claro si llegan por error
  delete safeDetails.email;
  delete safeDetails.phone;

  const raw = localStorage.getItem("securityLogs");
  let current = [];

  try {
    current = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(current)) current = [];
  } catch {
    current = [];
  }

  current.push({
    type,
    details: safeDetails,
    ts: new Date().toISOString(),
  });

  localStorage.setItem("securityLogs", JSON.stringify(current));
}
