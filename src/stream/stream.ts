import StreamType from "./streamType";

class Stream {
  private totalStreamType: number;
  private streamType: StreamType[];
  private startConsumeBetween: number;
  private endConsumeBetween: number;
  private minimumPercentageToRebalance: number;
  private totalRebalance: number = 1;
  private streamHistory: any[] = [];

  constructor(
    streamType: StreamType[],
    startConsumeBetween: number,
    endConsumeBetween: number,
    minimumPercentageToRebalance: number
  ) {
    this.streamType = streamType;

    if (startConsumeBetween >= endConsumeBetween)
      throw new Error("Max consume must bigger than min consume");
    this.startConsumeBetween = startConsumeBetween;
    this.endConsumeBetween = endConsumeBetween;
    this.minimumPercentageToRebalance = minimumPercentageToRebalance;
    this.totalStreamType = this.streamType.length;
  }

  listOfStreamType() {
    return this.streamType;
  }

  getRandomConsumeBudget() {
    return Math.floor(
      Math.random() * (this.endConsumeBetween - this.startConsumeBetween + 1) +
        this.startConsumeBetween
    );
  }

  startAdvertise() {
    while (true) {
      this.streamType.forEach((stream) => {
        const amountToSpend = this.getRandomConsumeBudget();
        const budgetBeforeSpend = stream.getRunningBudget();

        stream.consumeBudget(amountToSpend);
        const history = {
          streamName: stream.getName(),
          budgetAfterRebalance: stream.getBudgetAfterRebalance(),
          runningBudget: budgetBeforeSpend,
          amountToSpend,
          remaining: stream.getRunningBudget(),
          remainingInPercentage: stream.getRemaningBudgetInPercentage(),
          totalAds: stream.getTotalAdsShow(),
          isRebalance: false,
          overUse: stream.getOverUseRunningBudget(),
        };

        const shouldRebalance = stream.isShouldRebalance(
          this.minimumPercentageToRebalance
        );
        if (shouldRebalance) {
          this.rebalanceStreamType(stream);
          this.totalRebalance += 1;
          history.isRebalance = true;
        }

        this.streamHistory.push(history);
      });

      if (this.isAllStreamOutOfBudget()) {
        break;
      }
    }
    console.log(this.totalRebalance);
    console.log(this.streamType);
    console.table(this.streamHistory);
  }

  rebalanceStreamType(streamType: StreamType) {
    // ii. Check if all stream have balance of less than 5% OR have balance of 5% or more, do nothing.
    const checkAllStreamBalanceInPercentage = this.streamType.filter(
      (stream) =>
        stream.getName() != streamType.getName() &&
        stream.getRemaningBudgetInPercentage() <
          this.minimumPercentageToRebalance
    );

    if (
      checkAllStreamBalanceInPercentage.length ==
      this.streamType.length - 1
    ) {
      return;
    }

    let totalAvailablebudget = this.streamType.reduce(
      (prev, next) => prev + next.getRunningBudget(),
      0
    );
    const totalOverUseBudget = this.streamType.reduce(
      (prev, next) => prev + next.getOverUseRunningBudget(),
      0
    );

    if (totalAvailablebudget <= 0) {
      console.log(totalAvailablebudget);
      return;
    }

    let totalBudgetToRebalance = totalAvailablebudget - totalOverUseBudget;

    this.streamType
      .filter((stream) => stream.getOverUseRunningBudget() > 0)
      .forEach((stream) => {
        const currentStreamOverBudget = stream.getOverUseRunningBudget();
        if (totalAvailablebudget <= 0) return;

        stream.setOverUseRunningBudget(
          currentStreamOverBudget > totalAvailablebudget
            ? currentStreamOverBudget - totalAvailablebudget
            : 0
        );
        totalAvailablebudget -= currentStreamOverBudget;
      });

    if (totalBudgetToRebalance <= 0) this.setAllStreamTypeBudgetToZero();

    if (totalBudgetToRebalance > 0)
      this.spreadBudgetToStream(totalBudgetToRebalance);
  }

  spreadBudgetToStream(totalBudgetToRebalance: number) {
    const amountPerStream = totalBudgetToRebalance / this.totalStreamType;
    this.streamType.map((stream) => {
      stream.setRunningBudget(amountPerStream);
      stream.setBudgetAfterRebalance(amountPerStream);
    });
  }

  setAllStreamTypeBudgetToZero() {
    this.streamType.map((stream) => stream.setRunningBudget(0));
  }

  isAllStreamOutOfBudget() {
    return (
      this.streamType.filter((stream) => stream.isOutOfBudget()).length ==
      this.streamType.length
    );
  }
}

export default Stream;
