import { feature, nix } from "@adrifer/winix";

export const lxc = feature("lxc", ({ nixos }) => {
  nixos.boot({
    isContainer: true,
  });
  nixos.nix({
    gc: {
      automatic: true,
      dates: "weekly",
      options: "--delete-older-than 14d",
    },
    settings: { "experimental-features": ["nix-command", "flakes"] },
  });
  nixos.networking({
    useDHCP: true,
  });
  nixos.environment({
    systemPackages: ["vim", "htop", "curl", "git", "lazygit"],
  });
  nixos.systemd({
    mounts: [
      {
        where: "/sys/kernel/debug",
        enable: false,
      },
    ],
  });
  nixos.service("openssh", {
    settings: {
      PermitRootLogin: "yes",
      PasswordAuthentication: true,
    },
  });
  nixos.program("git", {
    config: {
      user: {
        name: "Adrian Fernandez",
        email: "tracker086@outlook.com",
      },
    },
  });
  nixos.users({
    users: {
      root: {
        shell: nix.pkg("bash"),
      },
    },
  });
  nixos.system({
    activationScripts: {
      fixInit: nix.expr(`lib.stringAfter [ "specialfs" ] ${nix.script(`
        if [ ! -L /sbin/init ] || [ "$(readlink /sbin/init)" != "/nix/var/nix/profiles/system/init" ]; then
          rm -f /sbin/init
          ln -s /nix/var/nix/profiles/system/init /sbin/init
        fi
      `).expr}`),
    },
  });
});
