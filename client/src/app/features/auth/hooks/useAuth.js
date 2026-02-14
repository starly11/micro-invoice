import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "../api/getMe";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const setUser = useAuthStore(state => state.setUser);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data || null);
    }
    if (query.isError) {
      setUser(null);
    }
  }, [query.isSuccess, query.isError, query.data, setUser]);

  return query;
};
