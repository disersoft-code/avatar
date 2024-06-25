import { create } from "zustand";

interface AvatarState {
    avatar: string;
    changeAvatar: (name: string) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
    avatar: "Paola",
    changeAvatar: (name) => set((state) => ({ avatar: name })),
}));
