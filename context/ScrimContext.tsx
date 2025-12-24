"use client";

import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";
import { Scrim } from "@/types/scrim.types";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";

type ScrimAction =
  | { type: "SET_SCRIMS"; payload: Scrim[] }
  | { type: "UPDATE_STATUS"; payload: { id: string; status: ScrimStatus } };

type ScrimState = {
  scrims: Scrim[];
};

const initialState: ScrimState = {
  scrims: [],
};

const ScrimStateContext = createContext<ScrimState | undefined>(undefined);
const ScrimDispatchContext = createContext<Dispatch<ScrimAction> | undefined>(undefined);

const reducer = (state: ScrimState, action: ScrimAction): ScrimState => {
  switch (action.type) {
    case "SET_SCRIMS":
      return { scrims: action.payload };
    case "UPDATE_STATUS":
      return {
        scrims: state.scrims.map((scrim) =>
          scrim._id === action.payload.id ? { ...scrim, status: action.payload.status } : scrim
        ),
      };
    default:
      return state;
  }
};

export const ScrimProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ScrimStateContext.Provider value={state}>
      <ScrimDispatchContext.Provider value={dispatch}>{children}</ScrimDispatchContext.Provider>
    </ScrimStateContext.Provider>
  );
};

export const useScrimState = (): ScrimState => {
  const ctx = useContext(ScrimStateContext);
  if (!ctx) throw new Error("useScrimState must be used within ScrimProvider");
  return ctx;
};

export const useScrimDispatch = (): Dispatch<ScrimAction> => {
  const ctx = useContext(ScrimDispatchContext);
  if (!ctx) throw new Error("useScrimDispatch must be used within ScrimProvider");
  return ctx;
};
