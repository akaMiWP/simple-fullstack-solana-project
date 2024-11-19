import { useEffect, useState } from "react";
import { program, topicStoragePda, TopicStorageData } from "../anchor/setup";

export const useFetchTopicStorageData = () => {
  const [totalTopics, setTotalTopics] = useState<TopicStorageData | null>(null);

  useEffect(() => {
    program.account.topicStorage.fetch(topicStoragePda).then((data) => {
      setTotalTopics(data.totalTopics.toNumber());
    });

    return () => {};
  }, [program]);

  return totalTopics;
};
