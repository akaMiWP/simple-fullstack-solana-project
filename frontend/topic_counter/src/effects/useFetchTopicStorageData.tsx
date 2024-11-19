import { useEffect, useState } from "react";
import { program, topicStoragePda } from "../anchor/setup";

export const useFetchTopicStorageData = () => {
  const [totalTopics, setTotalTopics] = useState<Number | null>(null);

  useEffect(() => {
    // @ts-ignore
    program.account.topicStorage.fetch(topicStoragePda).then((data) => {
      setTotalTopics(data.totalTopics.toNumber());
    });

    return () => {};
  }, [program]);

  return totalTopics;
};
