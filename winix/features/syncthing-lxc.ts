import { feature, nix, nixos } from "@adrifer/winix";

export const syncthingLxc = feature("syncthing-lxc", () => [
  nixos.networking({
    hostName: "syncthing-lxc",
    firewall: { allowedTCPPorts: [8384] },
  }),
  nixos.packages("gh"),
  nixos.service("syncthing", {
    user: "syncthing",
    group: "syncthing",
    dataDir: "/var/lib/syncthing",
    configDir: "/var/lib/syncthing/.config/syncthing",
    guiAddress: "0.0.0.0:8384",
    openDefaultPorts: true,
    settings: {
      folders: {
        TrackVault: {
          path: "/var/lib/syncthing/TrackVault",
          devices: [
            "ADRIFER-Ultron",
            "iPhone",
            "Ela",
          ],
          versioning: {
            type: "simple",
            params: {
              keep: "10",
            },
          },
        },
      },
      devices: {
        "ADRIFER-Ultron": {
          id: "SUYK5EV-GZD6WAJ-DOHS524-7RMYH54-23I4TYS-YN6HYL2-V4FCOEN-MBBG7AG",
        },
        iPhone: {
          id: "Z2LB3T3-MW5JCBR-ZAFY6XE-SUIKOV4-JAEGMDZ-JQIZLZC-2W346Y6-XI2WXQX",
        },
        Ela: {
          id: "DTDYOAX-QOJUM4U-ENTU5W3-P5XCUGG-R5M67OU-ARZBZVP-7TZKSU2-SYRJFAF",
        },
      },
    },
  }),
  nixos.systemd.service("vault-git-backup", {
    description: "Backup TrackVault to GitHub",
    path: [nix.pkg("git"), nix.pkg("openssh")],
    serviceConfig: {
      Type: "oneshot",
      User: "syncthing",
      WorkingDirectory: "/var/lib/syncthing/TrackVault",
    },
    script: nix.script(`
      if [[ -n $(git status --porcelain) ]]; then
        git add .
        git commit -m "Auto backup $(date '+%Y-%m-%d %H:%M')"
        git push
      fi
    `),
  }),
  nixos.systemd.timer("vault-git-backup", {
    description: "Run Vault backup every 6 hours",
    wantedBy: ["timers.target"],
    timerConfig: {
      OnCalendar: "*-*-* 00/6:00:00",
      Persistent: true,
    },
  }),
  nixos({
    system: {
      stateVersion: "25.05",
    },
  }),
]);
