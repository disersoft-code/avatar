import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";
import { useAnimationStore } from "../stores/animationStore";
import { useShallow } from "zustand/react/shallow";
import { useSoundStore } from "../stores/soundStore";
import { useFrame } from "@react-three/fiber/native";
import AudioTexto1 from "../assets/audios/audio1.json";

const corresponding = {
    A: "viseme_PP",
    B: "viseme_kk",
    C: "viseme_I",
    D: "viseme_AA",
    E: "viseme_O",
    F: "viseme_U",
    G: "viseme_FF",
    H: "viseme_TH",
    X: "viseme_PP",
};

type GLTFResult = GLTF & {
    nodes: {
        EyeLeft: THREE.SkinnedMesh;
        EyeRight: THREE.SkinnedMesh;
        Wolf3D_Head: THREE.SkinnedMesh;
        Wolf3D_Teeth: THREE.SkinnedMesh;
        Wolf3D_Hair: THREE.SkinnedMesh;
        Wolf3D_Body: THREE.SkinnedMesh;
        Wolf3D_Outfit_Bottom: THREE.SkinnedMesh;
        Wolf3D_Outfit_Footwear: THREE.SkinnedMesh;
        Wolf3D_Outfit_Top: THREE.SkinnedMesh;
        Hips: THREE.Bone;
    };
    materials: {
        Wolf3D_Eye: THREE.MeshStandardMaterial;
        Wolf3D_Skin: THREE.MeshStandardMaterial;
        Wolf3D_Teeth: THREE.MeshStandardMaterial;
        Wolf3D_Hair: THREE.MeshStandardMaterial;
        Wolf3D_Body: THREE.MeshStandardMaterial;
        Wolf3D_Outfit_Bottom: THREE.MeshStandardMaterial;
        Wolf3D_Outfit_Footwear: THREE.MeshStandardMaterial;
        Wolf3D_Outfit_Top: THREE.MeshStandardMaterial;
    };
};

type GLTFResult2 = GLTF & {
    nodes: {
        Hips: THREE.Bone;
    };
    materials: {};
};

export function Luis(props: JSX.IntrinsicElements["group"]) {
    const group = useRef<THREE.Group>(null);
    const { nodes, materials } = useGLTF(
        require("../assets/models/Luis.glb")
    ) as GLTFResult;

    const { animations } = useGLTF(
        require("../assets/animations/animations.glb")
    ) as GLTFResult2;

    const { actions } = useAnimations(animations, group);

    const animation = useAnimationStore(useShallow((state) => state.animation));
    const changeAnimation = useAnimationStore(
        useShallow((state) => state.changeAnimation)
    );

    const { position, isPlaying, isAudioEnd, changeIsMale } = useSoundStore(
        useShallow((state) => ({
            position: state.position,
            isPlaying: state.isPlaying,
            isAudioEnd: state.isAudioEnd,
            changeIsMale: state.changeIsMale,
        }))
    );
    const [script, setScript] = useState<string>("audio1");
    const [smoothMorphTarget, setSmoothMorphTarget] = useState<boolean>(true);
    const morphTargetSmoothing = 0.5;

    // *****************************************************************
    // Aplicar animaciones
    // *****************************************************************
    useEffect(() => {
        if (animation) {
            console.log("play animation...", animation);
            actions[animation]?.reset().fadeIn(0.5).play();

            return () => {
                console.log("end animation...", animation);
                actions[animation]?.reset().fadeOut(0.5);
            };
        }
    }, [animation]);

    useEffect(() => {
        if (isAudioEnd) {
            console.log("set animation Standing...");
            changeAnimation("Standing");
            if (
                nodes.Wolf3D_Head.morphTargetInfluences &&
                nodes.Wolf3D_Head.morphTargetDictionary &&
                nodes.Wolf3D_Teeth.morphTargetInfluences &&
                nodes.Wolf3D_Teeth.morphTargetDictionary
            ) {
                nodes.Wolf3D_Head.morphTargetInfluences[
                    nodes.Wolf3D_Head.morphTargetDictionary["viseme_I"]
                ] = 0;
                nodes.Wolf3D_Teeth.morphTargetInfluences[
                    nodes.Wolf3D_Teeth.morphTargetDictionary["viseme_I"]
                ] = 0;
            }
        }
    }, [isAudioEnd]);

    useEffect(() => {
        console.log(
            "set animation Standing...",
            nodes.Wolf3D_Head.morphTargetDictionary
        );
        changeIsMale(true);
    }, []);

    useFrame(() => {
        //const currentAudioTime = audio.currentTime;
        if (isPlaying === false) {
            //setCurrentAnimation("Standing");
            //console.log("set animation Standing...");
            //changeAnimation("Standing")
            return;
        }

        Object.values(corresponding).forEach((value) => {
            if (
                nodes.Wolf3D_Head.morphTargetInfluences &&
                nodes.Wolf3D_Head.morphTargetDictionary &&
                nodes.Wolf3D_Teeth.morphTargetInfluences &&
                nodes.Wolf3D_Teeth.morphTargetDictionary
            ) {
                if (!smoothMorphTarget) {
                    nodes.Wolf3D_Head.morphTargetInfluences[
                        nodes.Wolf3D_Head.morphTargetDictionary[value]
                    ] = 0;
                    nodes.Wolf3D_Teeth.morphTargetInfluences[
                        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
                    ] = 0;
                } else {
                    nodes.Wolf3D_Head.morphTargetInfluences[
                        nodes.Wolf3D_Head.morphTargetDictionary[value]
                    ] = THREE.MathUtils.lerp(
                        nodes.Wolf3D_Head.morphTargetInfluences[
                            nodes.Wolf3D_Head.morphTargetDictionary[value]
                        ],
                        0,
                        morphTargetSmoothing
                    );

                    nodes.Wolf3D_Teeth.morphTargetInfluences[
                        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
                    ] = THREE.MathUtils.lerp(
                        nodes.Wolf3D_Teeth.morphTargetInfluences[
                            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
                        ],
                        0,
                        morphTargetSmoothing
                    );
                }
            }
        });

        for (let i = 0; i < AudioTexto1.mouthCues.length; i++) {
            const mouthCue = AudioTexto1.mouthCues[i];
            //console.log('value', mouthCue.value, position, mouthCue.start, mouthCue.end);
            if (position >= mouthCue.start && position <= mouthCue.end) {
                if (
                    nodes.Wolf3D_Head.morphTargetInfluences &&
                    nodes.Wolf3D_Head.morphTargetDictionary &&
                    nodes.Wolf3D_Teeth.morphTargetInfluences &&
                    nodes.Wolf3D_Teeth.morphTargetDictionary
                ) {
                    if (!smoothMorphTarget) {
                        nodes.Wolf3D_Head.morphTargetInfluences[
                            nodes.Wolf3D_Head.morphTargetDictionary[
                                corresponding[mouthCue.value]
                            ]
                        ] = 1;
                        nodes.Wolf3D_Teeth.morphTargetInfluences[
                            nodes.Wolf3D_Teeth.morphTargetDictionary[
                                corresponding[mouthCue.value]
                            ]
                        ] = 1;
                    } else {
                        nodes.Wolf3D_Head.morphTargetInfluences[
                            nodes.Wolf3D_Head.morphTargetDictionary[
                                corresponding[mouthCue.value]
                            ]
                        ] = THREE.MathUtils.lerp(
                            nodes.Wolf3D_Head.morphTargetInfluences[
                                nodes.Wolf3D_Head.morphTargetDictionary[
                                    corresponding[mouthCue.value]
                                ]
                            ],
                            1,
                            morphTargetSmoothing
                        );
                        nodes.Wolf3D_Teeth.morphTargetInfluences[
                            nodes.Wolf3D_Teeth.morphTargetDictionary[
                                corresponding[mouthCue.value]
                            ]
                        ] = THREE.MathUtils.lerp(
                            nodes.Wolf3D_Teeth.morphTargetInfluences[
                                nodes.Wolf3D_Teeth.morphTargetDictionary[
                                    corresponding[mouthCue.value]
                                ]
                            ],
                            1,
                            morphTargetSmoothing
                        );
                    }
                }

                break;
            }
        }
    });

    return (
        <group
            {...props}
            dispose={null}
            ref={group}
            position={[0, -3, 4]}
            scale={2}
        >
            <primitive object={nodes.Hips} />
            <skinnedMesh
                name="EyeLeft"
                geometry={nodes.EyeLeft.geometry}
                material={materials.Wolf3D_Eye}
                skeleton={nodes.EyeLeft.skeleton}
                morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
                morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
                frustumCulled={false}
            />
            <skinnedMesh
                name="EyeRight"
                geometry={nodes.EyeRight.geometry}
                material={materials.Wolf3D_Eye}
                skeleton={nodes.EyeRight.skeleton}
                morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
                morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
                frustumCulled={false}
            />
            <skinnedMesh
                name="Wolf3D_Head"
                geometry={nodes.Wolf3D_Head.geometry}
                material={materials.Wolf3D_Skin}
                skeleton={nodes.Wolf3D_Head.skeleton}
                morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
                morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
                frustumCulled={false}
            />
            <skinnedMesh
                name="Wolf3D_Teeth"
                geometry={nodes.Wolf3D_Teeth.geometry}
                material={materials.Wolf3D_Teeth}
                skeleton={nodes.Wolf3D_Teeth.skeleton}
                morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
                morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
                frustumCulled={false}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Hair.geometry}
                material={materials.Wolf3D_Hair}
                skeleton={nodes.Wolf3D_Hair.skeleton}
                frustumCulled={false}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Body.geometry}
                material={materials.Wolf3D_Body}
                skeleton={nodes.Wolf3D_Body.skeleton}
                frustumCulled={false}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
                material={materials.Wolf3D_Outfit_Bottom}
                skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
                frustumCulled={false}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
                material={materials.Wolf3D_Outfit_Footwear}
                skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
                frustumCulled={false}
            />
            <skinnedMesh
                geometry={nodes.Wolf3D_Outfit_Top.geometry}
                material={materials.Wolf3D_Outfit_Top}
                skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
                frustumCulled={false}
            />
        </group>
    );
}

// useGLTF.preload('/Luis.glb')
