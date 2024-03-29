// INFO: THIS CUSTOM HOOK IS USED FOR FETCHING ALL CLIENT SIDE COMPONENT'S API REQUESTS

import { useCallback, useEffect, useState } from "react";

export default function useAsync(
  callback,
  dependencies = [],
  initialArgs = []
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const callbackMemoized = useCallback(async (...args) => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    try {
      const result = await callback(...args);
      setValue(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    callbackMemoized(...initialArgs);
  }, [callbackMemoized, ...initialArgs]);

  return { loading, error, value };
}
