{ lib, ... }:

let
  moduleAttrs = lib.types.lazyAttrsOf lib.types.raw;
in
{
  options.flake = {
    homeModules = lib.mkOption {
      type = moduleAttrs;
      default = { };
    };

  };
}
