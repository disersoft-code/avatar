import { create } from "zustand";

interface SoundState {
    soundFile: string;
    duration: number;
    position: number;
    isPlaying: boolean;
    isAudioEnd: boolean;
    isMale: boolean;
    changeSoundFile: (name: string) => void;
    changeDuration: (value: number) => void;
    changePosition: (value: number) => void;
    changeIsPlaying: (value: boolean) => void;
    changeAudioEnd: (value: boolean) => void;
    changeIsMale: (value: boolean) => void;
}

export const useSoundStore = create<SoundState>((set) => ({
    soundFile: "",
    duration: 0,
    position: 0,
    isPlaying: false,
    isAudioEnd: false,
    isMale: true,
    changeSoundFile: (name) => set((state) => ({ ...state, soundFile: name })),
    changeDuration: (value) => set((state) => ({ ...state, duration: value })),
    changePosition: (value) => set((state) => ({ ...state, position: value })),
    changeIsPlaying: (value) =>
        set((state) => ({ ...state, isPlaying: value })),
    changeAudioEnd: (value) =>
        set((state) => ({ ...state, isAudioEnd: value })),
    changeIsMale: (value) => set((state) => ({ ...state, isMale: value })),
}));
