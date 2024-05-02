import Stream from "./stream";
import StreamType from "./streamType";

describe.each(Array(100).fill(1))("Test stream", () => {
  const masterStreamType: {
    name: string;
    budget: number;
  }[] = [
    {
      name: "TV Linear",
      budget: 50000,
    },
    {
      name: "Over-the-top Video on Demand",
      budget: 50000,
    },
  ];

  const minRange = 2000;
  const maxRange = 5000;
  const thresholdPercentage = 5;

  it(`Should have ${masterStreamType.length} active stream`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );
    expect(stream.listOfStreamType()).toBe(listOfStreamToPromote);
  });

  it(`Should throw error if min consume higher then max consume`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });
    expect(() => {
      new Stream(listOfStreamToPromote, 6000, 5000, thresholdPercentage);
    }).toThrow("Max consume must bigger than min consume");
  });

  it(`Should throw error if min consume equal to max consume`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    expect(() => {
      new Stream(listOfStreamToPromote, 5000, 5000, thresholdPercentage);
    }).toThrow("Max consume must bigger than min consume");
  });

  it(`Should return random amount between min and max amount within 50 loop`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );
    for (let i = 0; i < 50; i++) {
      expect(stream.getRandomConsumeBudget()).toBeGreaterThanOrEqual(minRange);
      expect(stream.getRandomConsumeBudget()).toBeLessThanOrEqual(maxRange);
    }
  });

  it(`Should set all stream to 0`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );
    stream.setAllStreamTypeBudgetToZero();
    stream.listOfStreamType().map((st) => {
      expect(st.getRunningBudget()).toBe(0);
    });
  });

  it(`Should return false if all stream not out of budget`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );

    expect(stream.isAllStreamOutOfBudget()).toBe(false);
  });

  it(`Should return false if only 1 stream out of budget`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );
    listOfStreamToPromote[0].setRunningBudget(0);
    expect(stream.isAllStreamOutOfBudget()).toBe(false);
  });

  it(`Should spread budget accros stream from 30000 into 15000 per stream`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );
    const budgetToSpread = 30000;
    stream.spreadBudgetToStream(budgetToSpread);
    listOfStreamToPromote.map((streamType) => {
      expect(streamType.getBudgetAfterRebalance()).toBe(
        budgetToSpread / listOfStreamToPromote.length
      );
    });
  });

  it(`Should have 0 value for each stream after budget finish`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );
    stream.startAdvertise();
    stream.listOfStreamType().map((streamType) => {
      expect(streamType.getRunningBudget()).toBe(0);
    });
    expect(stream.isAllStreamOutOfBudget()).toBe(true);
  });

  it(`Should not rebalance if budget is 0`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );
    stream.listOfStreamType().map((streamType) => {
      streamType.setRunningBudget(0);
    });
    expect(stream.rebalanceStreamType()).toBe(
      false
    );
    expect(stream.rebalanceStreamType()).toBe(
      false
    );
  });

  it(`Should not rebalance if all stream budget under ${thresholdPercentage} percentage`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );

    stream
      .listOfStreamType()[0]
      .setRunningBudget(
        (stream.listOfStreamType()[0].getRunningBudget() *
          (thresholdPercentage - 1)) /
          100
      );
    stream
      .listOfStreamType()[1]
      .setRunningBudget(
        (stream.listOfStreamType()[1].getRunningBudget() *
          (thresholdPercentage - 1)) /
          100
      );

    expect(stream.rebalanceStreamType()).toBe(
      false
    );
    expect(stream.rebalanceStreamType()).toBe(
      false
    );
  });

  it(`Should not rebalance if all stream budget above ${thresholdPercentage} percentage`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );

    stream
      .listOfStreamType()[0]
      .setRunningBudget(
        (stream.listOfStreamType()[0].getRunningBudget() *
          (thresholdPercentage + 1)) /
          100
      );
    stream
      .listOfStreamType()[1]
      .setRunningBudget(
        (stream.listOfStreamType()[1].getRunningBudget() *
          (thresholdPercentage + 1)) /
          100
      );

    expect(stream.rebalanceStreamType()).toBe(
      false
    );
    expect(stream.rebalanceStreamType()).toBe(
      false
    );
  });

  it(`Should rebalance if budget still available and return divided value`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );

    const stream1Budget =
      (stream.listOfStreamType()[0].getRunningBudget() *
        (thresholdPercentage - 1)) /
      100;

    stream.listOfStreamType()[0].setRunningBudget(stream1Budget);
    stream.rebalanceStreamType();
    stream.listOfStreamType().map((streamType) => {
      expect(streamType.getRunningBudget()).toBe(
        stream.getTotalAvailableBudget() / listOfStreamToPromote.length
      );
    });
  });

  it(`should rebalance 2 times if consume 1000 for every looping`, () => {
    const listOfStreamToPromote: StreamType[] = masterStreamType.map((m) => {
      return new StreamType(m.name, m.budget);
    });

    const stream = new Stream(
      listOfStreamToPromote,
      minRange,
      maxRange,
      thresholdPercentage
    );

    jest.spyOn(stream, "getRandomConsumeBudget").mockImplementation(() => 1000);
    const spyRebalanceStreamType = jest.spyOn(stream, "rebalanceStreamType");
    stream.startAdvertise();

    expect(spyRebalanceStreamType).toHaveBeenCalledTimes(2);
  });
});
