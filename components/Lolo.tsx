/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";
import AnimationIdle from "../assets/animations/standingIdle.fbx";
import AnimationDance from "../assets/animations/rumbaDancing.fbx";
import AnimationGreeting from "../assets/animations/standingGreeting.fbx";
import { useFrame, useLoader } from "@react-three/fiber/native";
import { Audio, AVPlaybackStatus } from "expo-av";
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

export function Lolo(props: JSX.IntrinsicElements["group"]) {
    const group = useRef<THREE.Group>(null);
    const { nodes, materials } = useGLTF(
        require("../assets/models/Lolo.glb")
    ) as GLTFResult;

    const { animations: standingAnimation } = useFBX(AnimationIdle);
    const { animations: dancingAnimation } = useFBX(AnimationDance);
    const { animations: greetingAnimation } = useFBX(AnimationGreeting);

    const [currentAnimation, setCurrentAnimation] = useState<string | null>(
        null
    );
    const [script, setScript] = useState<string>("audio1");
    const [playAudio, setPlayAudio] = useState<boolean>(false);
    const [smoothMorphTarget, setSmoothMorphTarget] = useState<boolean>(true);

    const morphTargetSmoothing = 0.5;

    //const audio = useMemo(() => new Audio(`/audios/${script}.mp3`), [script]);
    //const jsonFile = useLoader(THREE.FileLoader, `../assets/audios/${script}.json`);
    // const jsonFile = require(`../assets/audios/${script}.json`);
    // const lipsync = JSON.parse(jsonFile.toString());

    standingAnimation[0].name = "Standing";
    dancingAnimation[0].name = "Dancing";
    greetingAnimation[0].name = "Greeting";

    const { actions } = useAnimations(
        [standingAnimation[0], dancingAnimation[0], greetingAnimation[0]],
        group
    );

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [position, setPosition] = useState<number>(0);

    async function loadSound() {
        const { sound, status } = await Audio.Sound.createAsync(
            require(`../assets/audios/audio1.mp3`),
            { shouldPlay: true }
        );
        setSound(sound);
        if (status.isLoaded) {
            setDuration(status.durationMillis ?? 0);
            setIsPlaying(status.isPlaying);
        }
    }

    useEffect(() => {
        if (sound) {
            sound.setOnPlaybackStatusUpdate(updateStatus);
        }

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const updateStatus = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setPosition(status.positionMillis);
        }
    };

    const handlePlayPause = async () => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
        } else {
            loadSound();
        }
    };

    console.log("currentAnimation", currentAnimation);

    // *****************************************************************
    // Aplicar animaciones
    // *****************************************************************
    useEffect(() => {
        if (currentAnimation) {
            console.log("play animation...");
            actions[currentAnimation]?.reset().fadeIn(0.5).play();

            // Obteniendo la posición, rotación y escala del modelo
            if (group.current) {
                const { position, rotation, scale } = group.current;
                console.log("Posición inicial:", position);
                console.log("Rotación inicial:", rotation);
                console.log("Escala inicial:", scale);
            }

            return () => {
                actions[currentAnimation]?.reset().fadeOut(0.5);
            };
        }
    }, [currentAnimation]);

    // *****************************************************************
    // Aplicar animaciones
    // *****************************************************************
    // useEffect(() => {
    //     nodes.Wolf3D_Head.morphTargetInfluences[
    //         nodes.Wolf3D_Head.morphTargetDictionary["viseme_I"]
    //     ] = 0;
    //     nodes.Wolf3D_Teeth.morphTargetInfluences[
    //         nodes.Wolf3D_Teeth.morphTargetDictionary["viseme_I"]
    //     ] = 0;
    //     if (playAudio) {
    //         //audio.play();
    //         if (script === "audio1") {
    //             console.log("set animation Greeting");
    //             setCurrentAnimation("Greeting");
    //         } else {
    //             console.log("set animation Dancing");
    //             setCurrentAnimation("Dancing");
    //         }
    //         console.log("play audio");
    //         handlePlayPause();
    //     } else {
    //         setCurrentAnimation("Standing");
    //         //handlePlayPause();
    //         //audio.pause();
    //     }
    // }, [playAudio, script]);

    // useFrame(() => {
    //     //const currentAudioTime = audio.currentTime;
    //     if (isPlaying === false && playAudio) {
    //         //setCurrentAnimation("Standing");
    //         return;
    //     }

    //     Object.values(corresponding).forEach((value) => {
    //         if (!smoothMorphTarget) {
    //             nodes.Wolf3D_Head.morphTargetInfluences[
    //                 nodes.Wolf3D_Head.morphTargetDictionary[value]
    //             ] = 0;
    //             nodes.Wolf3D_Teeth.morphTargetInfluences[
    //                 nodes.Wolf3D_Teeth.morphTargetDictionary[value]
    //             ] = 0;
    //         } else {
    //             nodes.Wolf3D_Head.morphTargetInfluences[
    //                 nodes.Wolf3D_Head.morphTargetDictionary[value]
    //             ] = THREE.MathUtils.lerp(
    //                 nodes.Wolf3D_Head.morphTargetInfluences[
    //                     nodes.Wolf3D_Head.morphTargetDictionary[value]
    //                 ],
    //                 0,
    //                 morphTargetSmoothing
    //             );

    //             nodes.Wolf3D_Teeth.morphTargetInfluences[
    //                 nodes.Wolf3D_Teeth.morphTargetDictionary[value]
    //             ] = THREE.MathUtils.lerp(
    //                 nodes.Wolf3D_Teeth.morphTargetInfluences[
    //                     nodes.Wolf3D_Teeth.morphTargetDictionary[value]
    //                 ],
    //                 0,
    //                 morphTargetSmoothing
    //             );
    //         }
    //     });

    //     for (let i = 0; i < AudioTexto1.mouthCues.length; i++) {
    //         const mouthCue = AudioTexto1.mouthCues[i];
    //         if (position >= mouthCue.start && position <= mouthCue.end) {
    //             if (!smoothMorphTarget) {
    //                 nodes.Wolf3D_Head.morphTargetInfluences[
    //                     nodes.Wolf3D_Head.morphTargetDictionary[
    //                         corresponding[mouthCue.value]
    //                     ]
    //                 ] = 1;
    //                 nodes.Wolf3D_Teeth.morphTargetInfluences[
    //                     nodes.Wolf3D_Teeth.morphTargetDictionary[
    //                         corresponding[mouthCue.value]
    //                     ]
    //                 ] = 1;
    //             } else {
    //                 nodes.Wolf3D_Head.morphTargetInfluences[
    //                     nodes.Wolf3D_Head.morphTargetDictionary[
    //                         corresponding[mouthCue.value]
    //                     ]
    //                 ] = THREE.MathUtils.lerp(
    //                     nodes.Wolf3D_Head.morphTargetInfluences[
    //                         nodes.Wolf3D_Head.morphTargetDictionary[
    //                             corresponding[mouthCue.value]
    //                         ]
    //                     ],
    //                     1,
    //                     morphTargetSmoothing
    //                 );
    //                 nodes.Wolf3D_Teeth.morphTargetInfluences[
    //                     nodes.Wolf3D_Teeth.morphTargetDictionary[
    //                         corresponding[mouthCue.value]
    //                     ]
    //                 ] = THREE.MathUtils.lerp(
    //                     nodes.Wolf3D_Teeth.morphTargetInfluences[
    //                         nodes.Wolf3D_Teeth.morphTargetDictionary[
    //                             corresponding[mouthCue.value]
    //                         ]
    //                     ],
    //                     1,
    //                     morphTargetSmoothing
    //                 );
    //             }

    //             break;
    //         }
    //     }
    // });

    useEffect(() => {
        // setTimeout(() => {
        //     // console.log("play audio...");
        //     // setPlayAudio(true);
        //     console.log("set animation greeting...");
        //     setCurrentAnimation("Greeting");
        //     // setPlayAudio(true);
        //     handlePlayPause();

        // }, 5000);

        setTimeout(() => {
            console.log("set standing...");
            setCurrentAnimation("Standing");
        }, 100);
    }, []);

    return (
        <group {...props} ref={group} dispose={null}>
            {/* <group {...props} ref={group} dispose={null} position={[0, -1, 0]}> */}
            {/* <group {...props} ref={group} dispose={null} position={[0, -6, 0]} scale={4}> */}
            {/* <group rotation-x={-Math.PI / 2}> */}
            <group
                name="Armature"
                rotation={[0, 0, 0]}
                scale={4}
                position={[0, -6, 0]}
                
            >
                <primitive object={nodes.Hips} />
                <skinnedMesh
                    name="EyeLeft"
                    geometry={nodes.EyeLeft.geometry}
                    material={materials.Wolf3D_Eye}
                    skeleton={nodes.EyeLeft.skeleton}
                    morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
                    morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
                />
                <skinnedMesh
                    name="EyeRight"
                    geometry={nodes.EyeRight.geometry}
                    material={materials.Wolf3D_Eye}
                    skeleton={nodes.EyeRight.skeleton}
                    morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
                    morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
                />
                <skinnedMesh
                    name="Wolf3D_Head"
                    geometry={nodes.Wolf3D_Head.geometry}
                    material={materials.Wolf3D_Skin}
                    skeleton={nodes.Wolf3D_Head.skeleton}
                    morphTargetDictionary={
                        nodes.Wolf3D_Head.morphTargetDictionary
                    }
                    morphTargetInfluences={
                        nodes.Wolf3D_Head.morphTargetInfluences
                    }
                />
                <skinnedMesh
                    name="Wolf3D_Teeth"
                    geometry={nodes.Wolf3D_Teeth.geometry}
                    material={materials.Wolf3D_Teeth}
                    skeleton={nodes.Wolf3D_Teeth.skeleton}
                    morphTargetDictionary={
                        nodes.Wolf3D_Teeth.morphTargetDictionary
                    }
                    morphTargetInfluences={
                        nodes.Wolf3D_Teeth.morphTargetInfluences
                    }
                />
                <skinnedMesh
                    geometry={nodes.Wolf3D_Hair.geometry}
                    material={materials.Wolf3D_Hair}
                    skeleton={nodes.Wolf3D_Hair.skeleton}
                />
                <skinnedMesh
                    geometry={nodes.Wolf3D_Body.geometry}
                    material={materials.Wolf3D_Body}
                    skeleton={nodes.Wolf3D_Body.skeleton}
                />
                <skinnedMesh
                    geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
                    material={materials.Wolf3D_Outfit_Bottom}
                    skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
                />
                <skinnedMesh
                    geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
                    material={materials.Wolf3D_Outfit_Footwear}
                    skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
                />
                <skinnedMesh
                    geometry={nodes.Wolf3D_Outfit_Top.geometry}
                    material={materials.Wolf3D_Outfit_Top}
                    skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
                />
            </group>
        </group>
    );
}

useGLTF.preload(require("../assets/models/Lolo.glb"));