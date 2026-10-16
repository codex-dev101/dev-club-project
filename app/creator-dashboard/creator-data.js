export const CUSTOM_PACKS_KEY = "cbt_custom_packs";
export const CREATOR_PROFILE_KEY = "cbt_creator_profile";

export const stagedQuestions = [];

// Initialize Creator Profile
export function loadCreatorProfile() {
    try {
        const saved = JSON.parse(localStorage.getItem(CREATOR_PROFILE_KEY) || "null");
        if (saved) {
            const nameEl = document.getElementById("creatorName");
            const tagEl = document.getElementById("creatorTag");
            if (nameEl && saved.name) nameEl.value = saved.name;
            if (tagEl && saved.tag) tagEl.value = saved.tag;
        }
    } catch (e) {
        console.error("Error loading creator profile:", e);
    }
}

export function saveCreatorProfile() {
    const nameEl = document.getElementById("creatorName");
    const tagEl = document.getElementById("creatorTag");
    const profile = {
        name: nameEl?.value.trim() || "Instructor",
        tag: tagEl?.value.trim() || "@teacher"
    };
    if (!profile.tag.startsWith("@")) profile.tag = "@" + profile.tag;
    localStorage.setItem(CREATOR_PROFILE_KEY, JSON.stringify(profile));
    return profile;
}

// Get all custom packs
export function getCustomPacks() {
    try {
        const packs = JSON.parse(localStorage.getItem(CUSTOM_PACKS_KEY) || "[]");
        const cleanPacks = Array.isArray(packs)
            ? packs.filter(pack => pack && pack.id !== "custom_web_dev_101")
            : [];

        if (JSON.stringify(cleanPacks) !== JSON.stringify(packs)) {
            localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(cleanPacks));
        }

        return cleanPacks;
    } catch (e) {
        console.error("Error loading custom packs:", e);
        return [];
    }
}

export function saveCustomPack(pack) {
    const packs = getCustomPacks();
    const existingIdx = packs.findIndex(p => p.id === pack.id);
    if (existingIdx >= 0) {
        packs[existingIdx] = pack;
    } else {
        packs.unshift(pack);
    }
    localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(packs));
}
