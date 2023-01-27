import { useEditorOrchestratorStore } from "@/EditorOrchestrator/editorOrchestratorStore";
import { usePageAdjustedRanges } from "@/EditorOrchestrator/usePageAdjustedRanges";
import { useEventFinder } from "@/Markwhen/composables/useEventFinder";
import type { EventPaths } from "@/Views/ViewOrchestrator/useStateSerializer";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import { isEventNode } from "@markwhen/parser/lib/Noder";
import { useEventListener } from "@vueuse/core";
import { toRaw } from "vue";
import { useViewStore } from "@/Views/viewStore";

// @ts-ignore
export const vscodeApi = acquireVsCodeApi();

interface Message {
  type: "hoverFromEditor" | "update" | "scrollTo" | "canUseSource";
  request?: boolean;
  response?: boolean;
  id: string;
  params?: any;
}

export const getNonce = () => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const useVsCode = () => {
  const markwhenStore = useMarkwhenStore();
  const timelineStore = useTimelineStore();
  const editorOrchestrator = useEditorOrchestratorStore();
  const viewStore = useViewStore();
  const { rangeOffset } = usePageAdjustedRanges();

  const calls: Map<
    string,
    {
      resolve: (a: any) => void;
      reject: (a: any) => void;
    }
  > = new Map();

  const postRequest = (type: Message["type"], params: any) => {
    const id = getNonce();
    return new Promise((resolve, reject) => {
      calls.set(id, { resolve, reject });
      post({
        type,
        request: true,
        id,
        params,
      });
    });
  };

  const postResponse = (type: Message["type"], id: string, params?: any) =>
    post({ type, response: true, id, params });

  const post = (message: Message) => {
    console.log("posting", message);
    vscodeApi.postMessage(message);
  };

  const updateText = (text: string) => {
    postRequest("update", { text });
  };

  const allowSource = (text?: string) => {
    postRequest("canUseSource", { source: text });
  };

  useEventListener("message", (event) => {
    const message = event.data;
    if (!message.id) {
      throw new Error("No id");
    }
    if (message.response) {
      calls.get(message.id)?.resolve(message.response);
      calls.delete(message.id);
    } else if (message.request) {
      switch (message.type as Message["type"]) {
        case "update":
          markwhenStore.setRawTimelineString(message.params.text);
          postResponse("update", message.id);
          break;
        case "hoverFromEditor":
          const index = message.params.index as number;
          const indexType = message.params.indexType as "page" | "whole";
          if (!indexType || indexType === "whole") {
            editorOrchestrator.setHoveringEvent(index - rangeOffset.value);
          } else {
            editorOrchestrator.setHoveringEvent(index);
          }
          const hoveringEvent = useEventFinder(
            editorOrchestrator.hoveringEventPaths
          ).value;
          let from: number | undefined, to: number | undefined;
          if (hoveringEvent) {
            if (isEventNode(hoveringEvent)) {
              from = hoveringEvent.value.dateRangeInText.from;
              to = hoveringEvent.value.dateRangeInText.to;
            } else {
              from = hoveringEvent.rangeInText?.from;
              to = hoveringEvent.rangeInText?.to;
            }
          }
          if (from && to) {
            postResponse("hoverFromEditor", message.id, {
              range: {
                from,
                to,
              },
              path: toRaw(editorOrchestrator.hoveringEventPaths),
            });
          } else {
            postResponse("hoverFromEditor", message.id, undefined);
          }
          break;
        case "scrollTo":
          const path = message.params.path as EventPaths;
          timelineStore.setScrollToPaths(path);
          break;
        case "canUseSource":
          const sources = message.params.sources as string[];
          viewStore.setAllowedSources(sources);
      }
    } else {
      throw new Error("Not a request or response");
    }
  });

  return { updateText, allowSource };
};
