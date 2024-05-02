import Stream from "./src/stream/stream";
import StreamType from "./src/stream/streamType";

export interface MasterStreamTypeProps {
  name: string;
  budget: number;
}

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

const listOfStreamToPromote: StreamType[] = [];

masterStreamType.map((m) => {
  listOfStreamToPromote.push(new StreamType(m.name, m.budget));
});

const stream = new Stream(listOfStreamToPromote, 2000, 5000, 5);
stream.startAdvertise();
console.log(stream.listOfStreamType())