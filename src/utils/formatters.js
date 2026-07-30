/**
 * Utility functions for Indian Currency (INR), Area Conversion, 
 * and Real Estate formatting in Mangalore & Karnataka.
 */

export function formatINR(price, listingType = 'sale') {
  if (!price && price !== 0) return '₹ N/A';

  if (listingType === 'rent') {
    return `₹${price.toLocaleString('en-IN')}/mo`;
  }

  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2);
    // Trim trailing zeros like 1.50 -> 1.5
    const cleanCr = parseFloat(cr).toString();
    return `₹${cleanCr} Cr`;
  } else if (price >= 100000) {
    const lakh = (price / 100000).toFixed(2);
    const cleanLakh = parseFloat(lakh).toString();
    return `₹${cleanLakh} L`;
  } else {
    return `₹${price.toLocaleString('en-IN')}`;
  }
}

export function formatArea(sqFt, unit = 'sqft') {
  if (!sqFt) return '';
  if (unit === 'sqm') {
    const sqM = Math.round(sqFt / 10.7639);
    return `${sqM.toLocaleString('en-IN')} sq.m`;
  }
  return `${sqFt.toLocaleString('en-IN')} sq.ft`;
}

export function calculatePricePerSqFt(price, areaSqFt, listingType = 'sale') {
  if (!price || !areaSqFt || listingType === 'rent') return null;
  const rate = Math.round(price / areaSqFt);
  return `₹${rate.toLocaleString('en-IN')}/sq.ft`;
}

export function calculateEMI(principal, annualInterestRate = 8.5, tenureYears = 20) {
  if (!principal || principal <= 0) return { monthlyEMI: 0, totalInterest: 0, totalPayment: 0 };

  const monthlyRate = (annualInterestRate / 12) / 100;
  const totalMonths = tenureYears * 12;

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
              (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const monthlyEMI = Math.round(emi);
  const totalPayment = Math.round(monthlyEMI * totalMonths);
  const totalInterest = Math.round(totalPayment - principal);

  return {
    monthlyEMI,
    totalInterest,
    totalPayment,
    formattedEMI: `₹${monthlyEMI.toLocaleString('en-IN')}/mo`
  };
}
