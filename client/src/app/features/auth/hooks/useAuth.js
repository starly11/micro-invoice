import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "../api/getMe";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.token);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    enabled: Boolean(token),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    if (query.isSuccess) {
      setUser(query.data || null);
    }
    if (query.isError) {
      setUser(null);
    }
  }, [token, query.isSuccess, query.isError, query.data, setUser]);

  const isHydrating = Boolean(token) && query.isPending;
  return { ...query, isHydrating };
};
