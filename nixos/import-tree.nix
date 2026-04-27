dir:
let
  entries = builtins.readDir dir;
  isModule = name: entries.${name} == "regular" && builtins.match ".*\\.nix" name != null;
in
builtins.map (name: dir + "/${name}") (builtins.filter isModule (builtins.attrNames entries))
