import { useEffect, useState } from "react";
import { AVPlaybackStatus, Audio } from "expo-av";
import { useSoundStore } from "../stores/soundStore";
import { useShallow } from "zustand/react/shallow";
import { GetAudio } from "../helpers/audioHelpers";
import { useAnimationStore } from "../stores/animationStore";

interface Props {
    audio: string;
}

const SoundPlayer = () => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const {
        soundFile,
        isMale,
        changeDuration,
        changePosition,
        changeIsPlaying,
        changeSoundFile,
        changeAudioEnd,
    } = useSoundStore(
        useShallow((state) => ({
            soundFile: state.soundFile,
            isMale: state.isMale,
            changeDuration: state.changeDuration,
            changePosition: state.changePosition,
            changeIsPlaying: state.changeIsPlaying,
            changeSoundFile: state.changeSoundFile,
            changeAudioEnd: state.changeAudioEnd,
        }))
    );

    const { changeAnimation } = useAnimationStore(
        useShallow((state) => ({
            changeAnimation: state.changeAnimation,
        }))
    );

    useEffect(() => {
        const playSound = async () => {
            const { sound: newSound, status } = await Audio.Sound.createAsync(
                GetAudio(soundFile, isMale),
                { progressUpdateIntervalMillis: 100 }
            );
            setSound(newSound);
            if (status.isLoaded) {
                changeDuration(status.durationMillis ?? 0);
                changeIsPlaying(status.isPlaying);
                changeAudioEnd(false);
            }

            await newSound.playAsync();
        };

        if (soundFile && soundFile.length > 3) {
            console.log('soundFile', soundFile, 'isMale', isMale);
            playSound();
        }

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [soundFile, isMale]);

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
            changeIsPlaying(status.isPlaying);
            if (status.positionMillis > 0) {
                changePosition(status.positionMillis / 1000);
            } else {
                changePosition(status.positionMillis);
            }

            if (status.didJustFinish) {
                console.log("end sound 2...");
                changeSoundFile("");
                changePosition(0);
                changeAudioEnd(true);
            }
        }
    };

    return null;
};

export default SoundPlayer;
