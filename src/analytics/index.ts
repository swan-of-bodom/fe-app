export const sendGtagEvent = (event: string, params: Object) => {
  if (!window.gtag) {
    return;
  }
  window.gtag("event", event, params);
};

declare global {
  interface Window {
    gtag?: (
      command: string,
      command_parameter: string,
      arguments: Object
    ) => void;
  }
}
