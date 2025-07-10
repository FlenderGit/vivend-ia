import type { ResultAsyncApi } from "../api/base";

export function useApi<T>(apiCall: () => ResultAsyncApi<T>) {
  let data: T | null = $state(null);
  let isLoading = $state(true);
  let error: Error | null = $state(null);

  function fetchData() {
    apiCall().then((result) => {
      isLoading = false;
      result.match(
        (responseData) => {
          data = responseData;
          console.log("Data fetched successfully:", data);
        },
        (err) => {
          error = err;
          console.error("Error fetching data:", error);
        },
      );
    });
  }

  // Initial fetch
  $effect(() => {
    fetchData();
  });

  // apiCall().then((result) => {
  //   isLoading = false;
  //   result.match(
  //     (responseData) => {
  //       data = responseData;
  //       console.log("Data fetched successfully:", data);
  //     },
  //     (err) => {
  //       error = err;
  //     },
  //   );
  // });

  return {
    get data() {
      return data;
    },
    get isLoading() {
      return isLoading;
    },
    get error() {
      return error;
    },

    // data,
    // isLoading,
    // error,
    // refetch: fetchData,
  };
}
