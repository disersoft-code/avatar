const audios_male = {
    saludo: require("../assets/audios/male/saludo.mp3"),
};

const audios_female = {
    saludo: require("../assets/audios/female/saludo.mp3"),
};

export function GetAudio(name: string, isMale: boolean) {
    let audio = audios_male.saludo;

    if (isMale) {
        switch (name) {
            case "saludo":
                audio = audios_male.saludo;
                break;
        }
        return audio;
    }

    switch (name) {
        case "saludo":
            audio = audios_female.saludo;
            break;
    }
    return audio;
}

