import { useMobileViewProviders } from "@/App/composables/useMobileViewProviders";
import { useViewProviders } from "@/App/composables/useViewProviders";
import type { ViewProvider } from "@/viewProvider";
import { useMediaQuery } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { useTimelineStore } from "./Timeline/timelineStore";

export const useViewStore = defineStore("views", () => {
  const selectedViewIndex = ref(-1);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const timelineStore = useTimelineStore();

  const views = computed<ViewProvider[]>(() => useViewProviders());
  const framedViews = computed(() => views.value.filter((v) => v.framed));
  const currentView = computed<ViewProvider>(
    () => views.value[selectedViewIndex.value]
  );

  watchEffect(() => {
    if (selectedViewIndex.value >= views.value.length) {
      selectedViewIndex.value = 0;
    } else if (selectedViewIndex.value < 0) {
      // Set initial view to timeline
      selectedViewIndex.value = 2;
    }
    if (currentView.value.name === "Timeline") {
      timelineStore.setMode("timeline");
    } else if (currentView.value.name === "Gantt") {
      timelineStore.setMode("gantt");
    }
  });

  const setSelectedViewIndex = (i: number) => {
    selectedViewIndex.value = i;
  };

  return {
    // state
    selectedViewIndex,
    views,
    isMobile,

    // getters
    currentView,
    framedViews,

    // actions
    setSelectedViewIndex,
  };
});
