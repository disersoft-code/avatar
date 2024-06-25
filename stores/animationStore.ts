import { create } from "zustand";

interface AnimationState {
    animation: string;
    changeAnimation: (name: string) => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
    animation: "Standing",
    changeAnimation: (name) => set((state) => ({ animation: name })),
}));
