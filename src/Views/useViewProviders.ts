import type { ViewProvider } from "@/viewProvider";
// import {
//   useTimelineRowsProvider,
// } from "@/Views/Timeline/timelineViewProvider";

export const useCalendar: () => ViewProvider = () => ({
  name: "Calendar",
  component: () =>
    "https://calendar.markwhen.com",
  iconSvg: `<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"></path></svg>`,
  settings: [],
  capabilities: { edit: true, hoveringEvent: true, jumpToEvent: true },
  uses: { tags: true, drawerDescription: true, sort: true, pages: true },
  framed: true,
});

export const useMapProvider: () => ViewProvider = () => ({
  name: "Map",
  component: () =>
    import.meta.env.DEV ? "http://localhost:5174" : "https://map.markwhen.com",
  iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="h-5 w-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7">
  </path></svg>`,
  settings: [],
  capabilities: { edit: true, hoveringEvent: true },
  uses: { tags: true, drawerDescription: true, sort: true, pages: true },
  framed: true,
});

export const useTimelineExternalProvider = () => ({
  name: "Timeline2",
  component: () =>
    import.meta.env.DEV
      ? "http://localhost:5176"
      : "https://timeline.markwhen.com",
  iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-5 w-5"><path 
  fill="currentColor" 
  d="m 13 13 h -5 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 5 c 0.55 0 1 0.45 1 1 s -0.45 1 -1 1 z m -1 -4 h -7 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 7 c 0.55 0 1 0.45 1 1 s -0.45 1 -1 1 z m -9 -4 h 0 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 2 c 0.55 0 1 0.45 1 1 s -0.45 1 -1 1 z">
</path></svg>`,
  settings: [],
  capabilities: { edit: true, hoveringEvent: true },
  uses: {
    tags: true,
    drawerDescription: true,
    sort: true,
    pages: true,
    jump: true,
  },
  framed: true,
});

export const useViewProviders: () => ViewProvider[] = () => {
  return [
    useMapProvider(),
    useCalendarProvider(),
    useTimelineExternalProvider(),
  ];
};
