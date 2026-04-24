export function sanitizeCpf(value: string): string {
  return value.replace(/\D/g, '')
}

export function isValidCpf(value: string): boolean {
  const cpf = sanitizeCpf(value)

  if (cpf.length !== 11) return false
  if (/^(\d)\1+$/.test(cpf)) return false

  const digits = cpf.split('').map(Number)

  const calculateDigit = (baseLength: number): number => {
    let sum = 0

    for (let i = 0; i < baseLength; i++) {
      sum += digits[i] * (baseLength + 1 - i)
    }

    const remainder = (sum * 10) % 11
    return remainder === 10 ? 0 : remainder
  }

  const firstDigit = calculateDigit(9)
  const secondDigit = calculateDigit(10)

  return firstDigit === digits[9] && secondDigit === digits[10]
}