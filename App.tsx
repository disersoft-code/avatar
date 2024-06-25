import { Canvas } from "@react-three/fiber/native";
import { StatusBar } from "expo-status-bar";
import { Suspense, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "./components/Loader";
import useControls from "r3f-native-orbitcontrols";
import { Environment } from "@react-three/drei/native";
import Trigger from "./components/Trigger";
import Experience from "./components/Experience";
import SoundPlayer from "./components/SoundPlayer";
import { useSoundStore } from "./stores/soundStore";
import { useAnimationStore } from "./stores/animationStore";
import { useAvatarStore } from "./stores/avatarStore";
import { useShallow } from "zustand/react/shallow";
import { ANIMATIONS } from "./helpers/enumHelpers";

export default function App() {
    const [loading, setLoading] = useState(false);
    const [OrbitControls, events] = useControls();
    const [number, setNumber] = useState(0);

    const { changeSoundFile, isAudioEnd } = useSoundStore(
        useShallow((state) => ({
            changeSoundFile: state.changeSoundFile,
            isAudioEnd: state.isAudioEnd,
        }))
    );
    const { changeAnimation } = useAnimationStore(
        useShallow((state) => ({
            changeAnimation: state.changeAnimation,
        }))
    );

    const { avatar, changeAvatar } = useAvatarStore(
        useShallow((state) => ({
            avatar: state.avatar,
            changeAvatar: state.changeAvatar,
        }))
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.modelContainer} {...events}>
                {loading && <Loader />}
                <Canvas
                    shadows
                    camera={{ position: [0, 0, 8], fov: 42 }}
                    onCreated={(state) => {
                        const _gl = state.gl.getContext();
                        const pixelStorei = _gl.pixelStorei.bind(_gl);
                        _gl.pixelStorei = function (...args) {
                            const [parameter] = args;
                            switch (parameter) {
                                case _gl.UNPACK_FLIP_Y_WEBGL:
                                    return pixelStorei(...args);
                            }
                        };
                    }}
                >
                    {/* <color attach="background" args={["#512DA8"]} /> */}
                    <OrbitControls enablePan={true} enableZoom={true} />

                    <Suspense fallback={<Trigger setLoading={setLoading} />}>
                        <Environment preset="sunset" />
                        <Experience />
                        {/* <mesh>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshBasicMaterial color="blue" />
                        </mesh> */}
                    </Suspense>
                </Canvas>
                <StatusBar style="auto" />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    console.log("Press button...", number);
                    changeSoundFile("saludo");
                    let animation = "";
                    switch (number) {
                        case 0:
                            animation = ANIMATIONS.GREETING;
                            break;
                        case 1:
                            animation = ANIMATIONS.FORMAL_BOW;
                            break;
                        case 2:
                            animation = ANIMATIONS.SALUTE;
                            break;
                        case 3:
                            animation = ANIMATIONS.INFORMAL_BOW;
                            break;
                        case 4:
                            animation = ANIMATIONS.SHAKING_HANDS;
                            setNumber(0);
                            changeAnimation(animation);
                            return;

                        default:
                            animation = ANIMATIONS.GREETING;
                            break;
                    }
                    setNumber((current) => current + 1);
                    changeAnimation(animation);
                }}
            >
                <Text style={styles.textButton}>Continue</Text>
            </TouchableOpacity>
            <SoundPlayer />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    modelContainer: {
        flex: 1,
    },
    textTitle: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
    },
    text: {
        color: "white",
        fontSize: 14,
        textAlign: "center",
        fontWeight: "100",
    },
    textContainer: {
        gap: 4,
        marginVertical: 20,
    },
    button: {
        backgroundColor: "white",
        padding: 14,
        margin: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 1,
    },
    textButton: {
        color: "black",
        fontSize: 14,
        fontWeight: "900",
    },
});
