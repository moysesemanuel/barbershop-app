export function normalizeWhatsappNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function formatWhatsappDisplay(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const localDigits = digits.startsWith("55") ? digits.slice(2) : digits;
  const areaCode = localDigits.slice(0, 2);
  const firstPart = localDigits.slice(2, 7);
  const secondPart = localDigits.slice(7, 11);

  if (localDigits.length >= 11) {
    return `(${areaCode})${firstPart}-${secondPart}`;
  }

  if (localDigits.length >= 10) {
    return `(${areaCode})${localDigits.slice(2, 6)}-${localDigits.slice(6, 10)}`;
  }

  return value;
}

export function buildWhatsappUrl(phone: string, message: string) {
  return `https://wa.me/${normalizeWhatsappNumber(phone)}?text=${encodeURIComponent(message)}`;
}
