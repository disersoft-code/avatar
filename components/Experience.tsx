import React from "react";
import { useTexture } from "@react-three/drei/native";
import { Lolo2 } from "./Lolo2";
import { Luis } from "./Luis";
import { Paola } from "./Paola";
import { useThree } from "@react-three/fiber/native";
import { useAvatarStore } from "../stores/avatarStore";
import { useShallow } from "zustand/react/shallow";

export default function Experience() {
    const texture = useTexture(require("../assets/textures/lobby2.jpg"));
    const viewport = useThree((state) => state.viewport);
    const { avatar } = useAvatarStore(
        useShallow((state) => ({
            avatar: state.avatar,
        }))
    );

    return (
        <>
            {avatar === "Paola" && <Paola />}
            {avatar === "Luis" && <Luis />}
            {avatar === "Lolo" && <Lolo2 />}

            <mesh>
                <planeGeometry args={[viewport.width, viewport.height]} />
                <meshBasicMaterial map={texture} />
            </mesh>
        </>
    );
}
