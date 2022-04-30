export interface Skycrypt {
    PROFILE_ID: ProfileID;
}

export interface Profiles {
    profile_id: string;
    cute_name:  string;
    current:    boolean;
    last_save:  number;
    raw:        any;
    items:      any;
    data:       any;
}


export interface SkyCryptDung {
    profile_id: string;
    cute_name:  string;
    dungeons:   Dungeons;
}

export interface Dungeons {
    catacombs:            Catacombs;
    classes:              Classes;
    used_classes:         boolean;
    unlocked_collections: boolean;
    boss_collections:     BossCollections;
    selected_class:       string;
    secrets_found:        number;
}

export interface BossCollections {
    "1": BossCollections1;
}

export interface BossCollections1 {
    name:    string;
    texture: string;
    tier:    number;
    killed:  number;
    claimed: string[];
}

export interface Catacombs {
    visited:       boolean;
    level:         Level;
    highest_floor: string;
    floors:        Floors;
}

export interface Floors {
    "1": Floors1;
}

export interface Floors1 {
    name:         string;
    icon_texture: string;
    stats:        Stats;
    best_runs:    BestRun[];
    most_damage:  MostDamage;
    current:      boolean;
}

export interface BestRun {
    timestamp:         number;
    score_exploration: number;
    score_speed:       number;
    score_skill:       number;
    score_bonus:       number;
    dungeon_class:     string;
    teammates:         string[];
    elapsed_time:      number;
    damage_dealt:      number;
    deaths:            number;
    mobs_kills:        number;
    secrets_found:     number;
    damage_mitigated:  number;
    ally_healing:      number;
}

export interface MostDamage {
    class: string;
    value: number;
}

export interface Stats {
    times_played:        number;
    tier_completions:    number;
    fastest_time:        number;
    best_score:          number;
    mobs_killed:         number;
    most_mobs_killed:    number;
    most_healing:        number;
    watcher_kills:       number;
    fastest_time_s:      number;
    fastest_time_s_plus: number;
}

export interface Level {
    xp:        number;
    level:     number;
    maxLevel:  number;
    xpCurrent: number;
    xpForNext: number;
    progress:  number;
}

export interface Classes {
    healer: Archer;
    mage:   Archer;
    beserk: Archer;
    archer: Archer;
    tank:   Archer;
}

export interface Archer {
    experience: Level;
    current:    boolean;
}
