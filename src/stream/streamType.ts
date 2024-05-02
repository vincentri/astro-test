class StreamType {
  private name: String;
  private originalBudget: number = 0;
  private budgetAfterRebalance: number = 0;
  private runningBudget: number = 0;
  private overUseRunningBudget: number = 0;
  private totalAdsShow: number = 0;

  constructor(name: string, budget: number) {
    this.name = name;
    this.originalBudget = budget;
    this.budgetAfterRebalance = budget;
    this.runningBudget = budget;
  }

  getName() {
    return this.name;
  }

  getOriginalBudget() {
    return this.originalBudget;
  }

  getTotalAdsShow() {
    return this.totalAdsShow;
  }

  getBudgetAfterRebalance() {
    return this.budgetAfterRebalance;
  }

  getRunningBudget() {
    return this.runningBudget;
  }

  getOverUseRunningBudget() {
    return this.overUseRunningBudget;
  }

  getRemaningBudgetInPercentage() {
    return (this.runningBudget / this.budgetAfterRebalance) * 100;
  }

  setOverUseRunningBudget(amount: number) {
    this.overUseRunningBudget = amount;
  }

  setRunningBudget(amount: number) {
    this.runningBudget = amount;
  }

  setBudgetAfterRebalance(amount: number) {
    this.budgetAfterRebalance = amount;
  }

  isOutOfBudget() {
    return this.runningBudget <= 0;
  }

  isShouldRebalance(minBudgetInPercentage: number) {
    return minBudgetInPercentage > this.getRemaningBudgetInPercentage();
  }

  consumeBudget(amount: number) {
    if (this.getRunningBudget() === 0) return;
    if (amount > this.getRunningBudget()) {
      this.overUseRunningBudget = amount - this.getRunningBudget();
      amount = this.getRunningBudget();
    }
    this.setRunningBudget(this.runningBudget - amount);
    this.totalAdsShow += 1;
  }
}

export default StreamType;
