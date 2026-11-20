import {
  account,
  feature,
  type AccountUserRef,
} from "@adrifer/winix";

const dockerGroup = account.group(
  "docker",
  (user: AccountUserRef) => ({ members: [user] }),
);

export const docker = feature(
  "docker",
  ({ nixos }, user: AccountUserRef) => {
    nixos.virtualisation({
      docker: {
        enable: true,
        enableOnBoot: true,
        autoPrune: {
          enable: true,
          dates: "weekly",
          flags: ["--filter=until=168h"],
        },
      },
    });

    return dockerGroup(user);
  },
);
