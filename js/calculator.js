// Financial Calculator Module
class CalculatorManager {
    constructor() {
        this.currentCalculator = 'compound';
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Calculator tabs
        const calculatorTabs = document.querySelectorAll('.calculator-tabs .tab-btn');
        calculatorTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const calculator = e.target.dataset.calc;
                this.switchCalculator(calculator);
            });
        });

        // Compound interest calculator
        const compoundBtn = document.getElementById('calculate-compound');
        if (compoundBtn) {
            compoundBtn.addEventListener('click', () => {
                this.calculateCompoundInterest();
            });
        }

        // Real-time calculation on input change
        this.setupRealTimeCalculation();
    }

    setupRealTimeCalculation() {
        const inputs = ['initial-amount', 'monthly-contribution', 'interest-rate', 'time-period'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    if (this.currentCalculator === 'compound') {
                        this.calculateCompoundInterest();
                    }
                });
            }
        });
    }

    loadCalculators() {
        this.renderCalculatorContent(this.currentCalculator);
    }

    switchCalculator(calculator) {
        this.currentCalculator = calculator;
        
        // Update tab states
        document.querySelectorAll('.calculator-tabs .tab-btn').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.calc === calculator);
        });

        this.renderCalculatorContent(calculator);
    }

    renderCalculatorContent(calculator) {
        const container = document.getElementById('calculator-content');
        if (!container) return;

        // Hide all calculator forms
        document.querySelectorAll('.calc-form').forEach(form => {
            form.classList.remove('active');
        });

        // Show selected calculator
        const targetForm = document.getElementById(`${calculator}-calc`);
        if (targetForm) {
            targetForm.classList.add('active');
        } else {
            // Create calculator form if it doesn't exist
            this.createCalculatorForm(calculator, container);
        }

        // Load calculator-specific functionality
        this.loadCalculatorSpecificFeatures(calculator);
    }

    createCalculatorForm(calculator, container) {
        let formHTML = '';

        switch (calculator) {
            case 'retirement':
                formHTML = this.createRetirementCalculatorForm();
                break;
            case 'loan':
                formHTML = this.createLoanCalculatorForm();
                break;
            default:
                return; // Compound interest form already exists in HTML
        }

        // Add the new form to the container
        container.insertAdjacentHTML('beforeend', formHTML);
    }

    createRetirementCalculatorForm() {
        return `
            <div id="retirement-calc" class="calc-form active">
                <div class="input-group">
                    <label>Età Attuale</label>
                    <input type="number" id="current-age" value="30" min="18" max="100">
                </div>
                <div class="input-group">
                    <label>Età di Pensionamento</label>
                    <input type="number" id="retirement-age" value="65" min="50" max="100">
                </div>
                <div class="input-group">
                    <label>Capitale Attuale (€)</label>
                    <input type="number" id="current-savings" value="50000" min="0">
                </div>
                <div class="input-group">
                    <label>Contributo Mensile (€)</label>
                    <input type="number" id="monthly-savings" value="500" min="0">
                </div>
                <div class="input-group">
                    <label>Rendimento Annuo Atteso (%)</label>
                    <input type="number" id="expected-return" value="6" min="0" max="20" step="0.1">
                </div>
                <div class="input-group">
                    <label>Inflazione Annua (%)</label>
                    <input type="number" id="inflation-rate" value="2" min="0" max="10" step="0.1">
                </div>
                <button id="calculate-retirement" class="btn btn-primary">Calcola Pensione</button>
                <div id="retirement-result" class="calc-result"></div>
            </div>
        `;
    }

    createLoanCalculatorForm() {
        return `
            <div id="loan-calc" class="calc-form active">
                <div class="input-group">
                    <label>Importo Prestito (€)</label>
                    <input type="number" id="loan-amount" value="200000" min="1000">
                </div>
                <div class="input-group">
                    <label>Tasso di Interesse Annuo (%)</label>
                    <input type="number" id="loan-rate" value="3.5" min="0.1" max="20" step="0.1">
                </div>
                <div class="input-group">
                    <label>Durata (anni)</label>
                    <input type="number" id="loan-term" value="25" min="1" max="50">
                </div>
                <div class="input-group">
                    <label>Tipo di Prestito</label>
                    <select id="loan-type">
                        <option value="fixed">Tasso Fisso</option>
                        <option value="variable">Tasso Variabile</option>
                    </select>
                </div>
                <button id="calculate-loan" class="btn btn-primary">Calcola Prestito</button>
                <div id="loan-result" class="calc-result"></div>
                <div id="loan-schedule" class="loan-schedule" style="display: none;">
                    <h4>Piano di Ammortamento</h4>
                    <div id="loan-schedule-table"></div>
                </div>
            </div>
        `;
    }

    loadCalculatorSpecificFeatures(calculator) {
        switch (calculator) {
            case 'compound':
                this.setupCompoundInterestCalculator();
                break;
            case 'retirement':
                this.setupRetirementCalculator();
                break;
            case 'loan':
                this.setupLoanCalculator();
                break;
        }
    }

    setupCompoundInterestCalculator() {
        // Already handled in constructor
        this.calculateCompoundInterest(); // Calculate with default values
    }

    setupRetirementCalculator() {
        const calculateBtn = document.getElementById('calculate-retirement');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.calculateRetirement();
            });
        }

        // Real-time calculation
        const inputs = ['current-age', 'retirement-age', 'current-savings', 'monthly-savings', 'expected-return', 'inflation-rate'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.calculateRetirement();
                });
            }
        });

        this.calculateRetirement(); // Calculate with default values
    }

    setupLoanCalculator() {
        const calculateBtn = document.getElementById('calculate-loan');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.calculateLoan();
            });
        }

        // Real-time calculation
        const inputs = ['loan-amount', 'loan-rate', 'loan-term'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.calculateLoan();
                });
            }
        });

        this.calculateLoan(); // Calculate with default values
    }

    // Compound Interest Calculator
    calculateCompoundInterest() {
        const initialAmount = parseFloat(document.getElementById('initial-amount')?.value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthly-contribution')?.value) || 0;
        const annualRate = parseFloat(document.getElementById('interest-rate')?.value) || 0;
        const years = parseFloat(document.getElementById('time-period')?.value) || 0;

        if (years <= 0 || annualRate < 0) {
            this.showCalculatorError('compound-result', 'Inserisci valori validi');
            return;
        }

        const monthlyRate = annualRate / 100 / 12;
        const totalMonths = years * 12;

        // Calculate compound interest with monthly contributions
        let futureValue = initialAmount;
        let totalContributions = initialAmount;

        // Compound the initial amount
        futureValue = initialAmount * Math.pow(1 + monthlyRate, totalMonths);

        // Add compound monthly contributions
        if (monthlyContribution > 0 && monthlyRate > 0) {
            const monthlyCompound = monthlyContribution * 
                ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
            futureValue += monthlyCompound;
            totalContributions += monthlyContribution * totalMonths;
        } else if (monthlyContribution > 0) {
            futureValue += monthlyContribution * totalMonths;
            totalContributions += monthlyContribution * totalMonths;
        }

        const totalInterest = futureValue - totalContributions;
        const effectiveRate = totalContributions > 0 ? (totalInterest / totalContributions) * 100 : 0;

        this.displayCompoundResult({
            futureValue,
            totalContributions,
            totalInterest,
            effectiveRate,
            years
        });
    }

    displayCompoundResult(result) {
        const container = document.getElementById('compound-result');
        if (!container) return;

        container.innerHTML = `
            <h4>Risultati del Calcolo</h4>
            <div class="result-item">
                <span class="result-label">Valore Finale</span>
                <span class="result-value">${this.formatCurrency(result.futureValue)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Totale Versato</span>
                <span class="result-value">${this.formatCurrency(result.totalContributions)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Interessi Maturati</span>
                <span class="result-value text-success">${this.formatCurrency(result.totalInterest)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Rendimento Totale</span>
                <span class="result-value text-info">${result.effectiveRate.toFixed(2)}%</span>
            </div>
            <div class="result-summary">
                <p><strong>In ${result.years} anni</strong>, il tuo investimento crescerà da 
                ${this.formatCurrency(result.totalContributions)} a 
                ${this.formatCurrency(result.futureValue)}, generando 
                ${this.formatCurrency(result.totalInterest)} di interessi.</p>
            </div>
        `;
    }

    // Retirement Calculator
    calculateRetirement() {
        const currentAge = parseInt(document.getElementById('current-age')?.value) || 0;
        const retirementAge = parseInt(document.getElementById('retirement-age')?.value) || 0;
        const currentSavings = parseFloat(document.getElementById('current-savings')?.value) || 0;
        const monthlySavings = parseFloat(document.getElementById('monthly-savings')?.value) || 0;
        const expectedReturn = parseFloat(document.getElementById('expected-return')?.value) || 0;
        const inflationRate = parseFloat(document.getElementById('inflation-rate')?.value) || 0;

        if (retirementAge <= currentAge) {
            this.showCalculatorError('retirement-result', 'L\'età di pensionamento deve essere maggiore dell\'età attuale');
            return;
        }

        const yearsToRetirement = retirementAge - currentAge;
        const monthlyRate = expectedReturn / 100 / 12;
        const totalMonths = yearsToRetirement * 12;

        // Calculate future value of current savings
        const futureCurrentSavings = currentSavings * Math.pow(1 + monthlyRate, totalMonths);

        // Calculate future value of monthly contributions
        let futureMonthlySavings = 0;
        if (monthlySavings > 0 && monthlyRate > 0) {
            futureMonthlySavings = monthlySavings * 
                ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        } else if (monthlySavings > 0) {
            futureMonthlySavings = monthlySavings * totalMonths;
        }

        const totalRetirementSavings = futureCurrentSavings + futureMonthlySavings;
        const totalContributed = currentSavings + (monthlySavings * totalMonths);
        const totalGrowth = totalRetirementSavings - totalContributed;

        // Calculate purchasing power (adjusted for inflation)
        const realValue = totalRetirementSavings / Math.pow(1 + inflationRate / 100, yearsToRetirement);

        // Estimate monthly retirement income (4% rule)
        const monthlyRetirementIncome = totalRetirementSavings * 0.04 / 12;
        const realMonthlyIncome = realValue * 0.04 / 12;

        this.displayRetirementResult({
            totalRetirementSavings,
            totalContributed,
            totalGrowth,
            realValue,
            monthlyRetirementIncome,
            realMonthlyIncome,
            yearsToRetirement
        });
    }

    displayRetirementResult(result) {
        const container = document.getElementById('retirement-result');
        if (!container) return;

        container.innerHTML = `
            <h4>Proiezione Pensione</h4>
            <div class="result-item">
                <span class="result-label">Capitale al Pensionamento</span>
                <span class="result-value">${this.formatCurrency(result.totalRetirementSavings)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Valore Reale (inflazione)</span>
                <span class="result-value">${this.formatCurrency(result.realValue)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Totale Versato</span>
                <span class="result-value">${this.formatCurrency(result.totalContributed)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Crescita Investimenti</span>
                <span class="result-value text-success">${this.formatCurrency(result.totalGrowth)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Reddito Mensile Stimato</span>
                <span class="result-value text-info">${this.formatCurrency(result.monthlyRetirementIncome)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Reddito Reale Mensile</span>
                <span class="result-value text-warning">${this.formatCurrency(result.realMonthlyIncome)}</span>
            </div>
            <div class="result-summary">
                <p><strong>Tra ${result.yearsToRetirement} anni</strong>, dovresti avere abbastanza risparmi per 
                generare un reddito mensile di circa ${this.formatCurrency(result.realMonthlyIncome)} 
                (valore odierno) seguendo la regola del 4%.</p>
            </div>
        `;
    }

    // Loan Calculator
    calculateLoan() {
        const loanAmount = parseFloat(document.getElementById('loan-amount')?.value) || 0;
        const annualRate = parseFloat(document.getElementById('loan-rate')?.value) || 0;
        const loanTermYears = parseFloat(document.getElementById('loan-term')?.value) || 0;

        if (loanAmount <= 0 || annualRate < 0 || loanTermYears <= 0) {
            this.showCalculatorError('loan-result', 'Inserisci valori validi');
            return;
        }

        const monthlyRate = annualRate / 100 / 12;
        const totalPayments = loanTermYears * 12;

        // Calculate monthly payment using the formula
        let monthlyPayment;
        if (monthlyRate > 0) {
            monthlyPayment = loanAmount * 
                (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
                (Math.pow(1 + monthlyRate, totalPayments) - 1);
        } else {
            monthlyPayment = loanAmount / totalPayments;
        }

        const totalPayment = monthlyPayment * totalPayments;
        const totalInterest = totalPayment - loanAmount;

        this.displayLoanResult({
            loanAmount,
            monthlyPayment,
            totalPayment,
            totalInterest,
            loanTermYears
        });

        this.generateAmortizationSchedule(loanAmount, monthlyRate, totalPayments, monthlyPayment);
    }

    displayLoanResult(result) {
        const container = document.getElementById('loan-result');
        if (!container) return;

        container.innerHTML = `
            <h4>Dettagli Prestito</h4>
            <div class="result-item">
                <span class="result-label">Rata Mensile</span>
                <span class="result-value">${this.formatCurrency(result.monthlyPayment)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Importo Prestito</span>
                <span class="result-value">${this.formatCurrency(result.loanAmount)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Totale da Pagare</span>
                <span class="result-value">${this.formatCurrency(result.totalPayment)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Totale Interessi</span>
                <span class="result-value text-warning">${this.formatCurrency(result.totalInterest)}</span>
            </div>
            <div class="result-summary">
                <p><strong>In ${result.loanTermYears} anni</strong>, pagherai un totale di 
                ${this.formatCurrency(result.totalPayment)}, di cui 
                ${this.formatCurrency(result.totalInterest)} sono interessi.</p>
            </div>
        `;
    }

    generateAmortizationSchedule(principal, monthlyRate, totalPayments, monthlyPayment) {
        const scheduleContainer = document.getElementById('loan-schedule');
        const tableContainer = document.getElementById('loan-schedule-table');
        
        if (!scheduleContainer || !tableContainer) return;

        let balance = principal;
        const schedule = [];

        // Generate first 12 months of schedule
        for (let month = 1; month <= Math.min(12, totalPayments); month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;

            schedule.push({
                month,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: Math.max(0, balance)
            });
        }

        tableContainer.innerHTML = `
            <div class="schedule-table">
                <div class="schedule-header">
                    <div>Mese</div>
                    <div>Rata</div>
                    <div>Capitale</div>
                    <div>Interessi</div>
                    <div>Residuo</div>
                </div>
                ${schedule.map(row => `
                    <div class="schedule-row">
                        <div>${row.month}</div>
                        <div>${this.formatCurrency(row.payment)}</div>
                        <div>${this.formatCurrency(row.principal)}</div>
                        <div>${this.formatCurrency(row.interest)}</div>
                        <div>${this.formatCurrency(row.balance)}</div>
                    </div>
                `).join('')}
            </div>
            <p class="text-secondary mt-2">
                <small>Mostrati i primi 12 mesi. Il piano completo continua per ${totalPayments} rate.</small>
            </p>
        `;

        scheduleContainer.style.display = 'block';
    }

    showCalculatorError(containerId, message) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="alert alert-error">
                <strong>Errore:</strong> ${message}
            </div>
        `;
    }

    // Utility methods
    formatCurrency(value) {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    formatPercentage(value) {
        return `${value.toFixed(2)}%`;
    }

    // Export calculator results
    exportCalculatorResults(calculatorType) {
        const resultContainer = document.getElementById(`${calculatorType}-result`);
        if (!resultContainer) return;

        const data = {
            calculator: calculatorType,
            timestamp: new Date().toISOString(),
            results: resultContainer.textContent || resultContainer.innerText
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calculator-${calculatorType}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Create global calculator instance
const calculator = new CalculatorManager();