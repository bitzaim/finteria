import { optionsApi } from "@/services/axios";
import type { ContestLeader } from "./types/contest.type";

const getContestWeekly = async (from: string, to: string) => {
  const { data } = await optionsApi().get<ContestLeader[]>("/contest/weekly", {
    params: {
      from,
      to,
    },
  });

  return data;
};

export { getContestWeekly };
