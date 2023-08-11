export function getOrigin() {
  const localHost = "http://test.local:8081",
    testHost = "http://myoa.mmzqoa.net";

  return window.location.origin === localHost
    ? testHost
    : window.location.origin;
}