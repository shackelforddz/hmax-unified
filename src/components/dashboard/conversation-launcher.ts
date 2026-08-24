"use client";

import { createContext, useContext } from "react";

export interface LaunchArgs {
  /** The widget's name/context that seeds the conversation. */
  context?: string;
  /** The user's typed prompt. */
  prompt?: string;
}

export type LaunchFn = (args?: LaunchArgs) => void;

export const ConversationLauncherContext = createContext<LaunchFn>(() => {});

export const useConversationLauncher = () => useContext(ConversationLauncherContext);
