import { AssetClass, Income, LoanAmount, FamilyContribution, Expenses } from '../backend';

// Map asset class selections to backend enum values
export function mapAssetClasses(selections: string[]): AssetClass[] {
    const mapping: Record<string, AssetClass> = {
        'fd_rd_savings': AssetClass.fixed,
        'gold_silver_etfs': AssetClass.crypto,
        'real_estate': AssetClass.realEstate,
        'mfs_equity': AssetClass.stocks,
        'debt': AssetClass.other,
    };
    return selections.map(s => mapping[s]).filter(Boolean);
}

// Map monthly income (INR) to Income enum
export function mapIncome(incomeINR: number): Income {
    if (incomeINR < 30000) return Income.low;
    if (incomeINR < 100000) return Income.medium;
    return Income.high;
}

// Map total loan amount (INR) to LoanAmount enum
export function mapLoanAmount(totalLoanINR: number): LoanAmount {
    if (totalLoanINR === 0) return LoanAmount.none;
    if (totalLoanINR < 500000) return LoanAmount.small;
    if (totalLoanINR < 2000000) return LoanAmount.medium;
    return LoanAmount.large;
}

// Map family contribution percentage to FamilyContribution enum
export function mapFamilyContribution(percentage: number): FamilyContribution {
    if (percentage === 0) return FamilyContribution.none;
    if (percentage < 50) return FamilyContribution.partial;
    return FamilyContribution.full;
}

// Map number of upcoming expenses to Expenses enum
export function mapExpenses(count: number): Expenses {
    if (count === 0) return Expenses.none;
    if (count === 1) return Expenses.low;
    if (count <= 3) return Expenses.medium;
    return Expenses.high;
}

// Get qualitative descriptor for a score
export function getScoreDescriptor(score: number): { label: string; color: string } {
    if (score <= 25) return { label: 'Low', color: '#4ade80' };
    if (score <= 50) return { label: 'Moderate', color: '#facc15' };
    if (score <= 75) return { label: 'High', color: '#fb923c' };
    return { label: 'Very High', color: '#f87171' };
}

export function getInverseScoreDescriptor(score: number): { label: string; color: string } {
    if (score >= 75) return { label: 'Excellent', color: '#4ade80' };
    if (score >= 50) return { label: 'Good', color: '#a3e635' };
    if (score >= 25) return { label: 'Fair', color: '#facc15' };
    return { label: 'Poor', color: '#f87171' };
}
