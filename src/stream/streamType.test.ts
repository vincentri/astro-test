import StreamType from "./streamType";

describe.each(Array(100).fill(1))("Test stream type", () => {
  const name = "TV Linear";
  const amount = 50000;
  const minPercentageToRebalance = 5;

  it(`Should has initial name ${name}`, () => {
    const streamType = new StreamType(name, amount);
    expect(streamType.getName()).toBe(name);
  });

  it(`Should has initial original amount ${amount}`, () => {
    const streamType = new StreamType(name, amount);
    expect(streamType.getOriginalBudget()).toBe(amount);
  });

  it(`Should has initial budget same with original amount`, () => {
    const streamType = new StreamType(name, amount);
    expect(streamType.getBudgetAfterRebalance()).toBe(amount);
  });

  it(`Should set new budget after rebalance`, () => {
    const streamType = new StreamType(name, amount);
    const newBudget = amount * 2;
    streamType.setBudgetAfterRebalance(newBudget);
    expect(streamType.getBudgetAfterRebalance()).toBe(newBudget);
  });

  it(`Should has running budget same with original amount`, () => {
    const streamType = new StreamType(name, amount);
    expect(streamType.getRunningBudget()).toBe(amount);
  });

  it(`Should has default ads show as 0`, () => {
    const streamType = new StreamType(name, amount);
    expect(streamType.getTotalAdsShow()).toBe(0);
  });

  it(`Should has default overuse running budget as 0`, () => {
    const streamType = new StreamType(name, amount);
    expect(streamType.getOverUseRunningBudget()).toBe(0);
  });

  it(`Should set overuse running budget to 100`, () => {
    const streamType = new StreamType(name, amount);
    streamType.setOverUseRunningBudget(100);
    expect(streamType.getOverUseRunningBudget()).toBe(100);
  });

  it(`Should has remaining budget 50% because we multiply budget 2 times`, () => {
    const streamType = new StreamType(name, amount);
    streamType.setBudgetAfterRebalance(amount * 2);
    expect(streamType.getRemaningBudgetInPercentage()).toBe(50);
  });

  it(`Should has running budget to be half because we divide 2`, () => {
    const streamType = new StreamType(name, amount);
    const divideBudget = streamType.getBudgetAfterRebalance() / 2;
    streamType.setRunningBudget(divideBudget);
    expect(streamType.getRunningBudget()).toBe(divideBudget);
  });

  it(`Should return false if still has budget`, () => {
    const streamType = new StreamType(name, amount);
    expect(streamType.isOutOfBudget()).toBe(false);
  });

  it(`Should return true if out of budget`, () => {
    const streamType = new StreamType(name, amount);
    streamType.setRunningBudget(0);
    expect(streamType.isOutOfBudget()).toBe(true);
  });

  it(`Should return false if above percentage threshold`, () => {
    const streamType = new StreamType(name, amount);
    expect(streamType.isShouldRebalance(minPercentageToRebalance)).toBe(false);
  });

  it(`Should return true if under percentage threshold`, () => {
    const streamType = new StreamType(name, amount);
    streamType.setRunningBudget((amount * 4) / 100);
    expect(streamType.isShouldRebalance(minPercentageToRebalance)).toBe(true);
  });

  it(`Should return false if equal percentage threshold`, () => {
    const streamType = new StreamType(name, amount);
    streamType.setRunningBudget((amount * 5) / 100);
    expect(streamType.isShouldRebalance(minPercentageToRebalance)).toBe(false);
  });

  it(`Should not increase if no more budget to consume`, () => {
    const streamType = new StreamType(name, amount);
    streamType.setRunningBudget(0);
    streamType.consumeBudget(5000);
    expect(streamType.getTotalAdsShow()).toBe(0);
  });

  it(`Should consume running budget and increase total ads show`, () => {
    const streamType = new StreamType(name, amount);
    const consumeAmount = 5000;
    streamType.consumeBudget(consumeAmount);
    expect(streamType.getTotalAdsShow()).toBe(1);
    expect(streamType.getRunningBudget()).toBe(amount - consumeAmount);
  });

  it(`Should consume running budget, increase total ads show and increase running overuse budget`, () => {
    const streamType = new StreamType(name, amount);
    const consumeAmount = 55000;
    streamType.consumeBudget(consumeAmount);
    expect(streamType.getTotalAdsShow()).toBe(1);
    expect(streamType.getRunningBudget()).toBe(0);
    expect(streamType.getOverUseRunningBudget()).toBe(consumeAmount - amount);
  });
});
