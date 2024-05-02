# Astro Test
## How to run
1. Pull the test from https://github.com/vincentri/astro-test. `git clone git@github.com:vincentri/astro-test.git`
2. Run `pnpm install` or `npm install`
3. Run `pnpm start`
4. It will print the json for final value of each stream.

## Testing
1. Run `pnpm test` or `npm test`.
2. Run `pnpm test:cov` or `npm test:cov` to print the coverage of the test.

## Notes
1. Example data structure of stream type
a. originalBudget => first time budget before rebalancing the stream budget
b. budgetAfterRebalance => latest budget after rebalancing happen
c. runningBudget => Available budget to do advertisement
d. overUseRunningBudget => Overuse budget use by the stream whenever consume.
e. totalAdsShow => total ads show everytime budget consume
f. name => name of the ads

```
 StreamType {
    originalBudget: 50000,
    budgetAfterRebalance: 1217,
    runningBudget: 0,
    overUseRunningBudget: 0,
    totalAdsShow: 15,
    name: 'TV Linear'
  },
  StreamType {
    originalBudget: 50000,
    budgetAfterRebalance: 1217,
    runningBudget: 0,
    overUseRunningBudget: 1410,
    totalAdsShow: 15,
    name: 'Over-the-top Video on Demand'
  }
```
2. The logic behind the code is whenever a stream take random number to consume the budget and if the amount exceed available running budget, it will recorded in overUseRunningBudget. then during rebalancing, we will calculate the total runningBudget and total overUseRunningBudget across all stream and sum it. The reason because we don't want astro to charge advertiser of their overuse budget.
