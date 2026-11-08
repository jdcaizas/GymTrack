export function validarCedulaEcuatoriana(cedula: string): boolean {
  // 1. Debe tener exactamente 10 dígitos
  if (!/^\d{10}$/.test(cedula)) return false;

  // 2. Los dos primeros dígitos son la provincia (01-24, o 30 para ecuatorianos en el exterior)
  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) return false;

  // 3. El tercer dígito debe ser menor a 6 (persona natural)
  const tercero = parseInt(cedula[2], 10);
  if (tercero >= 6) return false;

  // 4. Algoritmo módulo 10
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula[i], 10) * coeficientes[i];
    if (valor > 9) valor -= 9;
    suma += valor;
  }
  const verificador = (10 - (suma % 10)) % 10;

  // 5. Debe coincidir con el último dígito
  return verificador === parseInt(cedula[9], 10);
}