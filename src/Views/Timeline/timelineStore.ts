import { defineStore } from "pinia";
import type { Timeline, TimelineMetadata } from "@markwhen/parser/lib/Types";
import { DateTime } from "luxon";
import {
  diffScale,
  floorDateTime,
  viewportLeftMarginPixels,
  type DateInterval,
} from "@/Views/Timeline/utilities/dateTimeUtilities";
import { usePageEffect } from "@/Markwhen/composables/usePageEffect";
import { usePageStore } from "@/Markwhen/pageStore";
import { ref, computed } from "vue";

export interface Viewport {
  left: number;
  width: number;
  top: number;
}

export interface Settings {
  scale: number;
  viewportDateInterval: DateInterval;
  viewport: Viewport;
}

export const MIN_SCALE = 0.04;
export const MAX_SCALE = 30000000;
const initialScale = 0.3;

export function blankSettings(): Settings {
  return {
    scale: initialScale,
    viewportDateInterval: {
      from: DateTime.now().minus({ years: 10 }),
      to: DateTime.now().plus({ years: 10 }),
    },
    viewport: { left: 0, width: 0, top: 0 },
  };
}

export const useTimelineStore = defineStore("timeline", () => {
  const viewportGetter = ref<() => Viewport>();
  const pageSettings = usePageEffect(() => blankSettings());
  const startedWidthChange = ref(false);
  const hideNowLine = ref(false);

  const pageTimelineMetadata = computed(
    () => usePageStore().pageTimelineMetadata
  );
  const pageScale = computed(() => pageSettings.value.scale);
  const baselineLeftmostDate = computed(() => {
    const md = pageTimelineMetadata.value;
    const earliestTime = md.earliestTime;
    const days = md.maxDuration.as("days");

    if (days < 0.1) {
      return floorDateTime(earliestTime.minus({ hours: 1 }), "hour");
    }
    if (days < 1) {
      return floorDateTime(earliestTime.minus({ days: 1 }), "day");
    }
    if (days < 30) {
      return floorDateTime(earliestTime.minus({ months: 4 }), "year");
    }
    if (days < 180) {
      return floorDateTime(earliestTime.minus({ months: 3 }), "year");
    }
    return floorDateTime(earliestTime, "year");
  });
  const baselineRightmostDate = computed(() =>
    floorDateTime(
      pageTimelineMetadata.value.latestTime.plus({ years: 30 }),
      "year"
    )
  );
  const dateIntervalFromViewport = computed(() => {
    return (scrollLeft: number, width: number) => {
      // We're adding these so that when we are scrolling it looks like the left
      // time markers are going off the screen
      scrollLeft = scrollLeft - viewportLeftMarginPixels;
      width = width + viewportLeftMarginPixels;

      const earliest = baselineLeftmostDate.value;
      const leftDate = earliest.plus({
        [diffScale]: (scrollLeft / pageScale.value) * 24,
      });
      const rightDate = earliest.plus({
        [diffScale]: ((scrollLeft + width) / pageScale.value) * 24,
      });
      return { from: leftDate, to: rightDate };
    };
  });
  const scalelessDistanceBetweenDates = computed(
    () => (a: DateTime, b: DateTime) => b.diff(a).as(diffScale)
  );
  const distanceBetweenDates = computed(
    () => (a: DateTime, b: DateTime) =>
      (b.diff(a).as(diffScale) * pageScale.value) / 24
  );
  const distanceFromBaselineLeftmostDate = computed(
    () => (a: DateTime) =>
      (a.diff(baselineLeftmostDate.value).as(diffScale) * pageScale.value) / 24
  );
  const distanceBetweenBaselineDates = computed(() =>
    distanceFromBaselineLeftmostDate.value(baselineRightmostDate.value)
  );
  const dateFromClientLeft = computed(() => (offset: number) => {
    const leftDate = baselineLeftmostDate.value.plus({
      [diffScale]: (pageSettings.value.viewport.left / pageScale.value) * 24,
    });
    return leftDate.plus({
      [diffScale]: (offset / pageScale.value) * 24,
    });
  });

  const setViewport = (viewport: Viewport) => {
    pageSettings.value.viewport = viewport;
    pageSettings.value.viewportDateInterval = dateIntervalFromViewport.value(
      viewport.left,
      viewport.width
    );
  };
  const setViewportGetter = (getter: () => Viewport) => {
    viewportGetter.value = getter;
  };
  const setPageScale = (s: number) => {
    // TODO: also limit zooming in based on our position, if it would put us
    // past the browser's limit of a div's width
    const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
    pageSettings.value.scale = scale;
  };
  const setStartedWidthChange = (started: boolean) => {
    startedWidthChange.value = started;
  };
  const setHideNowLine = (hide: boolean) => {
    hideNowLine.value = hide;
  };
  return {
    // state
    pageSettings,
    startedWidthChange,
    hideNowLine,

    // getters
    pageTimelineMetadata,
    pageScale,
    baselineLeftmostDate,
    baselineRightmostDate,
    dateIntervalFromViewport,
    scalelessDistanceBetweenDates,
    distanceBetweenDates,
    distanceFromBaselineLeftmostDate,
    distanceBetweenBaselineDates,
    dateFromClientLeft,

    // actions
    setViewport,
    setViewportGetter,
    setPageScale,
    setStartedWidthChange,
    setHideNowLine,
  };
});