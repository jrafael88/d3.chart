import { useState, useEffect } from "react";

export function useManualRequest(request, initialStatus = "pristine") {
  const [status, setStatus] = useState(initialStatus);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  async function sendRequest(...args) {
    setStatus("loading");
    setError(null);
    try {
      const result = await request(...args);
      setStatus("success");
      setResult(result);
    } catch (error) {
      setStatus("error");
      setError(error);
    }
  }
  return [sendRequest, result, status, error];
}

export function useFetch(request, ...args) {
  const [sendRequest, ...automaticRequestHook] = useManualRequest(
    request,
    "loading"
  );
  useEffect(() => {
    sendRequest(...args);
  }, []);
  return automaticRequestHook;
}
