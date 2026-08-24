import { feature, nix } from "@adrifer/winix";

const mingw = nix.expr("pkgs.pkgsCross.mingwW64.stdenv.cc");

export const rust = feature("rust", ({ home }) => {
  home.packages(
    "rustup",
    "just",
    mingw,
  );
  home.env({
    CARGO_TARGET_X86_64_PC_WINDOWS_GNU_LINKER:
      nix.str`${mingw}/bin/x86_64-w64-mingw32-gcc`,
  });
  home.path(nix.homePath(".cargo/bin"));
  home.activation("installRustToolchain", {
    script: `
      export PATH="\${pkgs.rustup}/bin:$PATH"

      if ! rustup toolchain list | grep -q '^stable-'; then
        rustup toolchain install stable \
          --profile default \
          --component rustfmt \
          --component clippy \
          --target x86_64-pc-windows-gnu \
          --no-self-update
      else
        for component in rustfmt clippy; do
          if ! rustup component list --toolchain stable --installed |
            grep -q "^$component-"; then
            rustup component add "$component" --toolchain stable
          fi
        done

        if ! rustup target list --toolchain stable --installed |
          grep -q '^x86_64-pc-windows-gnu$'; then
          rustup target add x86_64-pc-windows-gnu --toolchain stable
        fi
      fi

      rustup default stable
    `,
  });
});
