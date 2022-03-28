type EventDataWithPath = { path: string; title: string };
type EventDataWithName = { name: string; title?: string; params?: object };

type EventData = EventDataWithPath | EventDataWithName;

const topWindow = window.top || window;

const dispatchEvent = (event: string, data?: EventData | string) => {
  // console.log('dispatchEvent', event, data, isFrame(), topWindow.location.href);

  let detail: EventData = { title: '', path: '' };

  if (typeof data === 'string') {
    detail['name'] = data;
  } else {
    detail = data as unknown as EventData;
  }

  topWindow.dispatchEvent(new CustomEvent(event, { detail: detail }));
};

export function isFrame(): boolean {
  return window.self !== window.top;
}
export function openTab(to: EventData | string) {
  dispatchEvent('openTab', to);
}
export async function closeTab() {
  dispatchEvent('closeTab');
}
export function refreshTab() {
  dispatchEvent('refreshTab');
}
export function replaceTab(to: EventData | string) {
  dispatchEvent('replaceTab', to);
}
export function backTab() {
  dispatchEvent('backTab');
}
