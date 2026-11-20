import { feature } from "@adrifer/winix";

// The LAN reverse proxy (nginx) serves wsl.t3.adrifer.com from this port, which
// forwards to the T3 server in WSL through WSL's localhost forwarding.
const listenPort = 13774;
const connect = "127.0.0.1/3774";
const reverseProxy = "192.168.1.100";
const ruleName = "T3 WSL from Nginx";

const prelude = [
  "$ErrorActionPreference = 'Stop'",
  `$listenPort = ${listenPort}`,
  "$desired = \"0.0.0.0/$listenPort\"",
  `$connect = '${connect}'`,
  `$reverseProxy = '${reverseProxy}'`,
  `$ruleName = '${ruleName}'`,
  "$key = 'HKLM:\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp'",
  "$entries = @{}",
  "if (Test-Path $key) { (Get-ItemProperty $key).PSObject.Properties | Where-Object Name -like \"*/$listenPort\" | ForEach-Object { $entries[$_.Name] = $_.Value } }",
  "$proxyOk = $entries.Count -eq 1 -and $entries[$desired] -eq $connect",
  "$rules = @(Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue)",
  "$ruleOk = $false",
  "if ($rules.Count -eq 1 -and \"$($rules[0].Enabled)\" -eq 'True' -and \"$($rules[0].Direction)\" -eq 'Inbound' -and \"$($rules[0].Action)\" -eq 'Allow') {",
  "  $ports = $rules[0] | Get-NetFirewallPortFilter",
  "  $addresses = $rules[0] | Get-NetFirewallAddressFilter",
  "  $ruleOk = $ports.Protocol -eq 'TCP' -and \"$($ports.LocalPort)\" -eq \"$listenPort\" -and \"$($addresses.RemoteAddress)\" -eq $reverseProxy -and \"$($addresses.LocalAddress)\" -eq 'Any'",
  "}",
  "function Test-Listening { @(Get-NetTCPConnection -LocalPort $listenPort -State Listen -ErrorAction SilentlyContinue).Count -gt 0 }",
];

/**
 * Exposes the WSL T3 server to the LAN reverse proxy. The forward listens on
 * 0.0.0.0: binding the LAN address fails silently when IP Helper starts before
 * DHCP, leaving nothing listening after a reboot. The firewall rule only admits
 * the reverse proxy.
 */
export const t3WslProxy = feature("t3-wsl-proxy", () => ({
  windows: {
    dsc: [{
      resourceType: "Microsoft.DSC.Transitional/PowerShellScript",
      name: "T3 WSL reverse proxy forward",
      elevated: true,
      properties: {
        getScript: [...prelude, "[pscustomobject]@{ entries = $entries; rule = $ruleOk; listening = (Test-Listening) }"].join("\n"),
        testScript: [...prelude, "$proxyOk -and $ruleOk -and (Test-Listening)"].join("\n"),
        setScript: [
          ...prelude,
          "if (-not $proxyOk) {",
          "  foreach ($name in $entries.Keys) {",
          "    $address, $port = $name -split '/'",
          "    netsh interface portproxy delete v4tov4 listenaddress=$address listenport=$port | Out-Null",
          "    if ($LASTEXITCODE -ne 0) { throw \"Failed to remove port proxy $name\" }",
          "  }",
          "  $connectAddress, $connectPort = $connect -split '/'",
          "  netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=$listenPort connectaddress=$connectAddress connectport=$connectPort | Out-Null",
          "  if ($LASTEXITCODE -ne 0) { throw 'Failed to add the T3 port proxy' }",
          "}",
          "if (-not $ruleOk) {",
          "  $rules | Remove-NetFirewallRule",
          "  New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort $listenPort -RemoteAddress $reverseProxy -Profile Any | Out-Null",
          "}",
          "Set-Service iphlpsvc -StartupType Automatic",
          "if (-not (Test-Listening)) { Restart-Service iphlpsvc -Force }",
          "foreach ($attempt in 1..10) { if (Test-Listening) { break }; Start-Sleep -Milliseconds 500 }",
        ].join("\n"),
      },
    }],
  },
}));
