import { escape, feature, pkg, script } from "winix";

export const lxcProfile = feature("lxc", () => [
  {
    nixos: {
      boot: {
        isContainer: true,
      },
      systemd: {
        mounts: [
          {
            where: "/sys/kernel/debug",
            enable: false,
          },
        ],
      },
      networking: {
        useDHCP: true,
      },
      services: {
        openssh: {
          enable: true,
          settings: {
            PermitRootLogin: "yes",
            PasswordAuthentication: true,
          },
        },
      },
      users: {
        users: {
          root: {
            shell: pkg("bash"),
          },
        },
      },
      environment: {
        systemPackages: ["vim", "htop", "curl", "git", "lazygit"],
      },
      programs: {
        git: {
          enable: true,
          config: {
            user: {
              name: "Adrian Fernandez",
              email: "tracker086@outlook.com",
            },
          },
        },
      },
      nix: {
        gc: {
          automatic: true,
          dates: "weekly",
          options: "--delete-older-than 14d",
        },
        settings: { "experimental-features": ["nix-command", "flakes"] },
      },
      system: {
        activationScripts: {
          fixInit: escape(`lib.stringAfter [ "specialfs" ] ${script(`
            if [ ! -L /sbin/init ] || [ "$(readlink /sbin/init)" != "/nix/var/nix/profiles/system/init" ]; then
              rm -f /sbin/init
              ln -s /nix/var/nix/profiles/system/init /sbin/init
            fi
          `).expr}`),
        },
      },
    },
  },
]);
