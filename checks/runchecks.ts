const skycrypt = (endpoint: string, player: string, profile: string = "") =>
  `https://sky.shiiyu.moe/api/v2/${endpoint}/${player}/${profile}`;
import axios from "axios";
import { Profiles, SkyCryptDung } from "./skycrypt";
import jp from "jsonpath";

export default async function runchecks(username: string) {
  try {
    const player = (await axios.get(skycrypt("profile", username))).data;

    const profileList = player.profiles;

    let currProfileID;
    let weight = 0;
    let discord = "";
    let souls = 0;

    for (let key in profileList) {
      const currProfile = profileList[key] as Profiles;
      if (currProfile.current) {
        currProfileID = currProfile.cute_name;
        weight = Number(currProfile.data.weight.senither.overall);
        discord = currProfile.data.social.DISCORD;
        souls = currProfile.data.fairy_souls.total
      }
    }

    const playerDung: SkyCryptDung = (
      await axios.get(skycrypt("dungeons", username, currProfileID))
    ).data;

    const nick = createNick(playerDung, username);

    // run the 3 checks
    console.log("\n\x1b[34m====================================\x1b[0m");
    console.log("\x1b[34mcata check for\x1b[35m", username, "\x1b[0m");
    const dungcheck = dungChecks(playerDung);
    console.log("\x1b[34mmm check for\x1b[35m", username, "\x1b[0m");
    const mastercheck = masterChecks(playerDung);
    console.log("\x1b[34mweight check for\x1b[35m", username, "\x1b[0m");
    const weightcheck = weightChecks(weight);

    let rank = -1;
    let rankid = 0;
    let rankname = "";
    // this means failure
    if (
      dungcheck == undefined &&
      mastercheck == undefined &&
      weightcheck == undefined &&
      souls < 200
    ) {
      return null;
    }
    // success
    // check the top rank
    if (dungcheck != undefined && dungcheck![2] >= rank) {
      rankid = dungcheck![1] as number;
      rankname = dungcheck![0] as string;
      rank = dungcheck![2] as number;
    }
    if (mastercheck != undefined && mastercheck[2] >= rank) {
      rankid = mastercheck![1] as number;
      rankname = mastercheck![0] as string;
      rank = mastercheck![2] as number;
    }
    if (weightcheck != undefined && weightcheck![2] >= rank) {
      rankid = weightcheck![1] as number;
      rankname = weightcheck![0] as string;
      rank = weightcheck![2] as number;
    }
    console.log(`\x1b[34mThe rank is \x1b[33m${rankname}\x1b[0m`);

    console.log("\x1b[34m====================================\x1b[0m\n");
    return [nick, rankid, discord];
  } catch (err) {
    console.log(err);
  }
}

export function createNick(playerDung: SkyCryptDung, username: string) {
  const nick = `[${
    playerDung.dungeons.catacombs.level.level
  }] [${playerDung.dungeons.selected_class[0].toUpperCase()}] ${username}`;

  return nick;
}

// all the checks
// Check 1 : Dungeons Player
function dungChecks(player: SkyCryptDung) {
  // Livid cata 30, 5000 secrets, pb n/a
  // Sadan cata 33, 7000 sec, pb n/a
  // Necron cata 35, 10000 sec, pb 8min f7 S+
  // KC cata 39, 20000 sec, pb 7:30 f7

  const map = {
    name: null,
    role_id: null,
    cata: "$.dungeons.catacombs.level.level",
    sec: "$.dungeons.secrets_found",
    pb: (pb: string | number) => {
      if (pb == "any") {
        return "$.dungeons.catacombs.floors.7.stats.fastest_time";
      } else if (pb == "s+") {
        return "$.dungeons.catacombs.floors.7.stats.fastest_time_s_plus";
      }
      return "clean";
    },
    comps: "$.dungeons.catacombs.floors.7.stats.tier_completions",
  };

  const dungreq = {
    req: [
      {
        name: "Kyros Champ",
        role_id: 909453514953064469,
        cata: 39,
        sec: 20000,
        pb: [7, "any", 420000],
        rank: 3,
        comps: 300,
      },
      {
        name: "Necron",
        role_id: 804114592774881330,
        cata: 35,
        sec: 10000,
        pb: [7, "s+", 450000],
        rank: 2,
        comps: null,
      },
      {
        name: "Sadan",
        role_id: 804114554602520586,
        cata: 33,
        sec: 7000,
        pb: null,
        rank: 1,
        comps: null,
      },
      {
        name: "Livid",
        role_id: 804114416898801735,
        cata: 30,
        sec: 4000,
        pb: null,
        rank: 0,
        comps: null,
      },
    ],
  };

  // actual code
  let roles = undefined;
  try {
    for (let i = 0; i <= dungreq.req.length - 1; i++) {
      const cata = jp.query(player, map.cata)[0] >= dungreq.req[i].cata;
      const secrets = jp.query(player, map.sec)[0] >= dungreq.req[i].sec;
      const pb =
        dungreq.req[i].pb == null || // if == null, the evaluation stops here
        jp.query(player, map.pb(dungreq.req[i].pb![1]))[0] <=
          dungreq.req[i].pb![2];
      const comps =
        dungreq.req[i].comps == null || // if == null, the evaluation stops here
        jp.query(player, map.comps)[0] >= dungreq.req[i].comps!;

      //console.log({cata, secrets, pb})
      if (cata && secrets && pb && comps) {
        roles = [
          dungreq.req[i].name,
          dungreq.req[i].role_id,
          dungreq.req[i].rank,
        ];
        break;
      }
    }
    console.log(roles);
  } catch (e: any) {
    console.log(e);
  }
  return roles;
}

// Check 2 : Master Mode Player
function masterChecks(player: SkyCryptDung) {
  // Livid cata 32, 3000 secrets, pb n/a
  // Sadan cata 34, 5000 sec, pb n/a
  // Necron cata 36, 7500 sec, pb 5min m3 S
  // KC cata 40, 12000 sec, pb 6min m5

  const map = {
    name: null,
    role_id: null,
    cata: "$.dungeons.catacombs.level.level",
    sec: "$.dungeons.secrets_found",
    pb: (pb: string | number) => {
      if (pb == 3) {
        return "$.dungeons.master_catacombs.floors.3.stats.fastest_time_s";
      } else if (pb == 5) {
        return "$.dungeons.master_catacombs.floors.5.stats.fastest_time";
      }
      return "clean";
    },
  };

  const dungreq = {
    req: [
      {
        name: "Kyros Champ",
        role_id: 909453514953064469,
        cata: 40,
        sec: 12000,
        pb: [5, "any", 300000],
        rank: 3,
      },
      {
        name: "Necron",
        role_id: 804114592774881330,
        cata: 36,
        sec: 7500,
        pb: [3, "s", 240000],
        rank: 2,
      },
      {
        name: "Sadan",
        role_id: 804114554602520586,
        cata: 34,
        sec: 5000,
        pb: null,
        rank: 1,
      },
      {
        name: "Livid",
        role_id: 804114416898801735,
        cata: 32,
        sec: 3000,
        pb: null,
        rank: 0,
      },
    ],
  };

  // actual code
  let roles = undefined;
  try {
    for (let i = 0; i <= dungreq.req.length - 1; i++) {
      const cata = jp.query(player, map.cata)[0] >= dungreq.req[i].cata;
      const secrets = jp.query(player, map.sec)[0] >= dungreq.req[i].sec;
      const pb =
        dungreq.req[i].pb == null || // if == null, the evaluation stops here
        jp.query(player, map.pb(dungreq.req[i].pb![0]))[0] <=
          dungreq.req[i].pb![2];

      //console.log({cata, secrets, pb})
      if (cata && secrets && pb) {
        roles = [
          dungreq.req[i].name,
          dungreq.req[i].role_id,
          dungreq.req[i].rank,
        ];
        break;
      }
    }
    console.log(roles);
  } catch (e: any) {
    console.log(e);
  }
  return roles;
}

// Check 3 : Weighted Player
function weightChecks(weight: number) {
  // Livid 2500
  // Sadan 3300
  // Necron 5500
  // KC 9000
  const wreq = {
    req: [
      {
        name: "Kyros Champ",
        role_id: 909453514953064469,
        weight: 9000,
        rank: 3,
      },
      {
        name: "Necron",
        role_id: 804114592774881330,
        weight: 6900,
        rank: 2,
      },
      {
        name: "Sadan",
        role_id: 804114554602520586,
        weight: 3300,
        rank: 1,
      },
      {
        name: "Livid",
        role_id: 804114416898801735,
        weight: 2500,
        rank: 0,
      },
    ],
  };

  let roles = undefined;
  try {
    for (let i = 0; i <= wreq.req.length - 1; i++) {
      if (weight >= wreq.req[i].weight) {
        console.log(weight);
        roles = [wreq.req[i].name, wreq.req[i].role_id, wreq.req[i].rank];
        break;
      }
    }
    console.log(roles);
  } catch (e: any) {
    console.log(e);
  }
  return roles;
}
