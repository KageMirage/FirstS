export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}

export interface MortgageResult {
  monthlyPayment: number;
  totalLoanAmount: number;
  totalInterestPaid: number;
  totalPaid: number;
}

export function calculateMortgage(
  housePrice: number,
  downPaymentPercent: number,
  years: number,
  interestRateAnnual: number
): MortgageResult {
  const downPayment = (housePrice * downPaymentPercent) / 100;
  const loanAmount = Math.max(0, housePrice - downPayment);
  
  if (loanAmount <= 0) {
    return {
      monthlyPayment: 0,
      totalLoanAmount: 0,
      totalInterestPaid: 0,
      totalPaid: 0,
    };
  }

  const monthlyRate = interestRateAnnual / 100 / 12;
  const totalMonths = years * 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / totalMonths;
  } else {
    monthlyPayment = 
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalPaid = monthlyPayment * totalMonths;
  const totalInterestPaid = Math.max(0, totalPaid - loanAmount);

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalLoanAmount: Math.round(loanAmount),
    totalInterestPaid: Math.round(totalInterestPaid),
    totalPaid: Math.round(totalPaid),
  };
}
