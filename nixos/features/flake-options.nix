{ lib, ... }:

let
  moduleAttrs = lib.types.lazyAttrsOf lib.types.raw;
  moduleOption = lib.mkOption {
    type = moduleAttrs;
    default = { };
  };
in
{
  options.flake = {
    darwinModules = moduleOption;
    homeModules = moduleOption;
  };
}
