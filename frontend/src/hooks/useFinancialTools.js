import { useState, useCallback } from 'react';

export const useFinancialTools = () => {
  // Calcolatore di interesse composto
  const calculateCompoundInterest = useCallback((principal, rate, time, frequency = 1) => {
    const r = rate / 100;
    const n = frequency;
    const t = time;
    
    const amount = principal * Math.pow(1 + r / n, n * t);
    const interest = amount - principal;
    
    return {
      principal,
      amount,
      interest,
      rate: rate,
      time,
      frequency
    };
  }, []);

  // Calcolatore di rendimento annualizzato
  const calculateAnnualizedReturn = useCallback((initialValue, finalValue, timeInYears) => {
    if (timeInYears <= 0 || initialValue <= 0) return null;
    
    const totalReturn = (finalValue - initialValue) / initialValue;
    const annualizedReturn = Math.pow(1 + totalReturn, 1 / timeInYears) - 1;
    
    return {
      totalReturn: totalReturn * 100,
      annualizedReturn: annualizedReturn * 100,
      initialValue,
      finalValue,
      timeInYears
    };
  }, []);

  // Calcolatore di inflazione
  const calculateInflationImpact = useCallback((amount, inflationRate, years) => {
    const r = inflationRate / 100;
    const futureValue = amount * Math.pow(1 + r, years);
    const purchasingPower = amount / Math.pow(1 + r, years);
    
    return {
      originalAmount: amount,
      futureValue,
      purchasingPower,
      inflationRate,
      years,
      loss: amount - purchasingPower
    };
  }, []);

  // Calcolatore di mutuo
  const calculateMortgage = useCallback((principal, annualRate, years, paymentFrequency = 12) => {
    const r = (annualRate / 100) / paymentFrequency;
    const n = years * paymentFrequency;
    
    if (r === 0) {
      const monthlyPayment = principal / n;
      return {
        principal,
        monthlyPayment,
        totalPayment: monthlyPayment * n,
        totalInterest: 0,
        annualRate,
        years,
        paymentFrequency
      };
    }
    
    const monthlyPayment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - principal;
    
    return {
      principal,
      monthlyPayment,
      totalPayment,
      totalInterest,
      annualRate,
      years,
      paymentFrequency
    };
  }, []);

  // Calcolatore di diversificazione
  const calculateDiversification = useCallback((weights) => {
    if (!weights || weights.length === 0) return null;
    
    // Calcola HHI (Herfindahl-Hirschman Index)
    const hhi = weights.reduce((sum, weight) => sum + Math.pow(weight / 100, 2), 0);
    
    // Calcola numero effettivo di asset
    const effectiveN = 1 / hhi;
    
    // Calcola indice di diversificazione
    const diversificationIndex = 1 - hhi;
    
    // Valuta livello di diversificazione
    let diversificationLevel = 'Bassa';
    if (diversificationIndex > 0.8) diversificationLevel = 'Molto Alta';
    else if (diversificationIndex > 0.6) diversificationLevel = 'Alta';
    else if (diversificationIndex > 0.4) diversificationLevel = 'Media';
    else if (diversificationIndex > 0.2) diversificationLevel = 'Bassa';
    
    return {
      hhi,
      effectiveN,
      diversificationIndex: diversificationIndex * 100,
      diversificationLevel,
      weights
    };
  }, []);

  // Calcolatore di correlazione
  const calculateCorrelation = useCallback((returns1, returns2) => {
    if (returns1.length !== returns2.length || returns1.length < 2) return null;
    
    const n = returns1.length;
    const mean1 = returns1.reduce((sum, val) => sum + val, 0) / n;
    const mean2 = returns2.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;
    
    for (let i = 0; i < n; i++) {
      const diff1 = returns1[i] - mean1;
      const diff2 = returns2[i] - mean2;
      numerator += diff1 * diff2;
      denominator1 += diff1 * diff1;
      denominator2 += diff2 * diff2;
    }
    
    const correlation = numerator / Math.sqrt(denominator1 * denominator2);
    
    return {
      correlation,
      strength: Math.abs(correlation) > 0.7 ? 'Forte' : 
                Math.abs(correlation) > 0.3 ? 'Moderata' : 'Debole',
      direction: correlation > 0 ? 'Positiva' : 'Negativa'
    };
  }, []);

  // Calcolatore di volatilità
  const calculateVolatility = useCallback((returns, period = 'annual') => {
    if (returns.length < 2) return null;
    
    const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (returns.length - 1);
    const stdDev = Math.sqrt(variance);
    
    // Converti in base al periodo
    const periods = {
      daily: 252,
      weekly: 52,
      monthly: 12,
      annual: 1
    };
    
    const annualizedVolatility = stdDev * Math.sqrt(periods[period] || 1);
    
    return {
      standardDeviation: stdDev,
      variance,
      annualizedVolatility,
      period,
      returns: returns.length
    };
  }, []);

  // Calcolatore di Sharpe Ratio
  const calculateSharpeRatio = useCallback((returns, riskFreeRate = 2) => {
    if (returns.length < 2) return null;
    
    const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (returns.length - 1);
    const stdDev = Math.sqrt(variance);
    
    const excessReturn = mean - (riskFreeRate / 100);
    const sharpeRatio = excessReturn / stdDev;
    
    return {
      sharpeRatio,
      excessReturn: excessReturn * 100,
      riskFreeRate,
      volatility: stdDev * 100,
      interpretation: sharpeRatio > 1 ? 'Eccellente' : 
                     sharpeRatio > 0.5 ? 'Buono' : 
                     sharpeRatio > 0 ? 'Accettabile' : 'Scarso'
    };
  }, []);

  // Calcolatore di Value at Risk (VaR)
  const calculateVaR = useCallback((returns, confidence = 95, timeHorizon = 1) => {
    if (returns.length < 2) return null;
    
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor((100 - confidence) / 100 * returns.length);
    const varValue = Math.abs(sortedReturns[index]);
    
    // Converti in base all'orizzonte temporale
    const adjustedVaR = varValue * Math.sqrt(timeHorizon);
    
    return {
      varValue: varValue * 100,
      adjustedVaR: adjustedVaR * 100,
      confidence,
      timeHorizon,
      interpretation: `Con probabilità ${confidence}%, la perdita massima sarà ${adjustedVaR.toFixed(2)}%`
    };
  }, []);

  // Calcolatore di asset allocation
  const calculateAssetAllocation = useCallback((totalAmount, allocations) => {
    const results = allocations.map(allocation => ({
      assetClass: allocation.name,
      percentage: allocation.percentage,
      amount: (totalAmount * allocation.percentage) / 100,
      riskLevel: allocation.riskLevel || 'Medio'
    }));
    
    const totalAllocated = results.reduce((sum, item) => sum + item.percentage, 0);
    const unallocated = 100 - totalAllocated;
    
    return {
      allocations: results,
      totalAmount,
      totalAllocated,
      unallocated,
      isValid: totalAllocated <= 100
    };
  }, []);

  // Calcolatore di rebalancing
  const calculateRebalancing = useCallback((currentAllocations, targetAllocations, totalValue) => {
    const rebalancing = currentAllocations.map(current => {
      const target = targetAllocations.find(t => t.assetClass === current.assetClass);
      if (!target) return null;
      
      const currentAmount = current.amount;
      const targetAmount = (totalValue * target.percentage) / 100;
      const difference = targetAmount - currentAmount;
      
      return {
        assetClass: current.assetClass,
        currentAmount,
        targetAmount,
        difference,
        action: difference > 0 ? 'Compra' : 'Vendi',
        amount: Math.abs(difference)
      };
    }).filter(Boolean);
    
    const totalRebalancing = rebalancing.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      rebalancing,
      totalRebalancing,
      needsRebalancing: totalRebalancing > (totalValue * 0.05) // 5% soglia
    };
  }, []);

  // Calcolatore di costi di transazione
  const calculateTransactionCosts = useCallback((amount, commissionRate = 0.1, taxRate = 0.26) => {
    const commission = (amount * commissionRate) / 100;
    const tax = (amount * taxRate) / 100;
    const totalCosts = commission + tax;
    const netAmount = amount - totalCosts;
    
    return {
      grossAmount: amount,
      commission,
      tax,
      totalCosts,
      netAmount,
      costRatio: (totalCosts / amount) * 100
    };
  }, []);

  return {
    calculateCompoundInterest,
    calculateAnnualizedReturn,
    calculateInflationImpact,
    calculateMortgage,
    calculateDiversification,
    calculateCorrelation,
    calculateVolatility,
    calculateSharpeRatio,
    calculateVaR,
    calculateAssetAllocation,
    calculateRebalancing,
    calculateTransactionCosts
  };
};