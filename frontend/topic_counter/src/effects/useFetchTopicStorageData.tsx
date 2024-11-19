import { useEffect, useState } from "react";
import { program, topicStoragePda } from "../anchor/setup";

export const useFetchTopicStorageData = (isConfirmed: boolean) => {
  const [totalTopics, setTotalTopics] = useState<Number | null>(null);
  const [hasFetched, setHashFetched] = useState<boolean>(false);

  useEffect(() => {
    if (isConfirmed || !hasFetched) {
      // @ts-ignore
      program.account.topicStorage.fetch(topicStoragePda).then((data) => {
        setTotalTopics(data.totalTopics.toNumber());
      });
    }

    return () => {};
  }, [program, isConfirmed]);

  return totalTopics;
};
