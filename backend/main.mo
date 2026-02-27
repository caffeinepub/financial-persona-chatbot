import Runtime "mo:core/Runtime";

actor {
  public type AssetClass = {
    #stocks;
    #crypto;
    #realEstate;
    #fixed;
    #other;
  };

  public type Income = {
    #low;
    #medium;
    #high;
  };

  public type LoanAmount = {
    #none;
    #small;
    #medium;
    #large;
  };

  public type FamilyContribution = {
    #none;
    #partial;
    #full;
  };

  public type Expenses = {
    #none;
    #low;
    #medium;
    #high;
  };

  public type QuestionResponses = {
    assetClasses : [AssetClass];
    income : Income;
    loanAmount : LoanAmount;
    familyContribution : FamilyContribution;
    upcomingExpenses : Expenses;
  };

  public type PersonaScores = {
    riskAppetite : Nat;
    debtProfile : Nat;
    earningPotential : Nat;
    emergencyBrokeLikelihood : Nat;
    upcomingExpenseFulfillmentLikelihood : Nat;
  };

  public func calculatePersonaScores(responses : QuestionResponses) : async PersonaScores {
    // Calculate scores based on responses
    let riskAppetite = calculateRiskAppetite(responses.assetClasses);
    let debtProfile = calculateDebtProfile(responses.loanAmount);
    let earningPotential = calculateEarningPotential(responses.income);
    let emergencyBrokeLikelihood = calculateEmergencyBrokeLikelihood(responses.income, responses.upcomingExpenses, responses.loanAmount);
    let upcomingExpenseFulfillmentLikelihood = calculateUpcomingExpenseFulfillmentLikelihood(responses.income, responses.familyContribution, responses.upcomingExpenses);

    {
      riskAppetite;
      debtProfile;
      earningPotential;
      emergencyBrokeLikelihood;
      upcomingExpenseFulfillmentLikelihood;
    };
  };

  func calculateRiskAppetite(assetClasses : [AssetClass]) : Nat {
    var score = 50;

    for (assetClass in assetClasses.values()) {
      switch (assetClass) {
        case (#stocks) { score += 10 };
        case (#crypto) { score += 20 };
        case (#realEstate) { score += 5 };
        case (#fixed) { score -= 10 };
        case (#other) { score += 0 };
      };
    };

    clamp(score, 0, 100);
  };

  func calculateDebtProfile(loanAmount : LoanAmount) : Nat {
    switch (loanAmount) {
      case (#none) { 100 };
      case (#small) { 75 };
      case (#medium) { 50 };
      case (#large) { 25 };
    };
  };

  func calculateEarningPotential(income : Income) : Nat {
    switch (income) {
      case (#low) { 25 };
      case (#medium) { 50 };
      case (#high) { 75 };
    };
  };

  func calculateEmergencyBrokeLikelihood(income : Income, expenses : Expenses, loanAmount : LoanAmount) : Nat {
    var score = 50;

    switch (income) {
      case (#low) { score += 25 };
      case (#medium) { score += 0 };
      case (#high) { score -= 25 };
    };

    switch (expenses) {
      case (#none) { score -= 25 };
      case (#low) { score -= 10 };
      case (#medium) { score += 0 };
      case (#high) { score += 20 };
    };

    switch (loanAmount) {
      case (#none) { score -= 10 };
      case (#small) { score += 0 };
      case (#medium) { score += 10 };
      case (#large) { score += 20 };
    };

    clamp(score, 0, 100);
  };

  func calculateUpcomingExpenseFulfillmentLikelihood(income : Income, familyContribution : FamilyContribution, upcomingExpenses : Expenses) : Nat {
    var score = 50;

    switch (income) {
      case (#low) { score -= 20 };
      case (#medium) { score += 0 };
      case (#high) { score += 20 };
    };

    switch (familyContribution) {
      case (#none) { score -= 20 };
      case (#partial) { score += 0 };
      case (#full) { score += 20 };
    };

    switch (upcomingExpenses) {
      case (#none) { score += 10 };
      case (#low) { score += 0 };
      case (#medium) { score -= 10 };
      case (#high) { score -= 20 };
    };

    clamp(score, 0, 100);
  };

  func clamp(value : Nat, min : Nat, max : Nat) : Nat {
    if (value < min) { return min };
    if (value > max) { return max };
    value;
  };

  // Test method to verify functionality
  public shared ({ caller }) func testCalculateScores() : async () {
    let responses : QuestionResponses = {
      assetClasses = [#stocks, #crypto, #realEstate];
      income = #medium;
      loanAmount = #small;
      familyContribution = #partial;
      upcomingExpenses = #medium;
    };

    let scores = await calculatePersonaScores(responses);

    // Check some expected output ranges (mock)
    assert(scores.riskAppetite <= 100); // Risk appetite shouldn't exceed 100
    assert(scores.riskAppetite >= 50); // With #stocks and #crypto, risk appetite should be at least 50
    assert(scores.debtProfile == 75); // #small loan should map to 75
    assert(scores.earningPotential == 50); // #medium income should map to 50
    assert(scores.emergencyBrokeLikelihood < 100); // Should not be worst case
    assert(scores.upcomingExpenseFulfillmentLikelihood <= 100); // Should not exceed 100
  };
};
