"use client";

import { createContext, useContext } from "react";

/** A specific record the conversation is about, used to render the left
 *  context pane with that entity's detail content (mirrors its drawer). */
export type ContextEntity =
  | { kind: "asset"; id: string }
  | { kind: "contract"; id: string }
  | { kind: "opportunity"; id: string }
  | { kind: "customer"; name: string };

export interface LaunchArgs {
  /** The widget's name/context that seeds the conversation. */
  context?: string;
  /** The user's typed prompt. */
  prompt?: string;
  /** The record this conversation is about (drives the left context pane). */
  entity?: ContextEntity;
}

export type LaunchFn = (args?: LaunchArgs) => void;

export const ConversationLauncherContext = createContext<LaunchFn>(() => {});

export const useConversationLauncher = () => useContext(ConversationLauncherContext);
