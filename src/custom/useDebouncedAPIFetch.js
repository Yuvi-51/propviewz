// INFO: THIS CUSTOM HOOK IS USED FOR FETCHING ALL CLIENT SIDE COMPONENT'S API REQUESTS

import { useState } from "react";
import useDebounce from "./useDebounce";

export default function useDebouncedAPIFetch(
  callback,
  dependencies = [],
  initialArgs = []
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [value, setValue] = useState();

  useDebounce(
    () => {
      setLoading(true);
      callback(...initialArgs)
        .then((response) => (response ? setValue(response) : setError(true)))
        .catch((error) => setError(true))
        .finally(() => setLoading(false));
    },
    300,
    dependencies
  );

  return { loading, error, value };
}
