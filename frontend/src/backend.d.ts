import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuestionResponses {
    loanAmount: LoanAmount;
    upcomingExpenses: Expenses;
    assetClasses: Array<AssetClass>;
    income: Income;
    familyContribution: FamilyContribution;
}
export interface PersonaScores {
    upcomingExpenseFulfillmentLikelihood: bigint;
    debtProfile: bigint;
    riskAppetite: bigint;
    emergencyBrokeLikelihood: bigint;
    earningPotential: bigint;
}
export enum AssetClass {
    fixed = "fixed",
    stocks = "stocks",
    realEstate = "realEstate",
    other = "other",
    crypto = "crypto"
}
export enum Expenses {
    low = "low",
    high = "high",
    none = "none",
    medium = "medium"
}
export enum FamilyContribution {
    full = "full",
    none = "none",
    partial = "partial"
}
export enum Income {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum LoanAmount {
    none = "none",
    large = "large",
    small = "small",
    medium = "medium"
}
export interface backendInterface {
    calculatePersonaScores(responses: QuestionResponses): Promise<PersonaScores>;
    testCalculateScores(): Promise<void>;
}
