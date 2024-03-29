export default function useNotFound(data) {
  return data === null ||
    data === undefined ||
    (typeof data === "object" && Object.keys(data).length === 0) ||
    (Array.isArray(data) && data.length === 0)
    ? true
    : false;
}
