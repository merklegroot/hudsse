import { parseDotnetInfo } from '../../workflows/parseDotnetInfo';

describe('parseDotnetInfo', () => {
  it('should handle problematic dotnet --info output with errors and duplicated content', () => {
    // This is the actual problematic output from the user's system
    const problematicOutput = `Executing dotnet --info command...
You must install or update .NET to run this application.
App: /home/username/.dotnet/sdk/9.0.304/dotnet.dll
Architecture: x64
Framework: 'Microsoft.NETCore.App', version '9.0.8' (x64)
.NET location: /home/username/.dotnet/
The following frameworks were found:
7.0.20 at [/home/username/.dotnet/shared/Microsoft.NETCore.App]
8.0.19 at [/home/username/.dotnet/shared/Microsoft.NETCore.App]
8.0.20 at [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Learn more:
https://aka.ms/dotnet/app-launch-failed
To install missing framework, download:
https://aka.ms/dotnet-core-applaunch?framework=Microsoft.NETCore.App&framework_version=9.0.8&arch=x64&rid=linux-x64&os=ubuntu.25.04
Host:
Version:      9.0.8
Architecture: x64
Commit:       aae90fa090
RID:          linux-x64
.NET SDKs installed:
8.0.414 [/home/username/.dotnet/sdk]
9.0.304 [/home/username/.dotnet/sdk]
.NET runtimes installed:
Microsoft.AspNetCore.App 7.0.20 [/home/username/.dotnet/shared/Microsoft.AspNetCore.App]
Microsoft.AspNetCore.App 8.0.19 [/home/username/.dotnet/shared/Microsoft.AspNetCore.App]
Microsoft.AspNetCore.App 8.0.20 [/home/username/.dotnet/shared/Microsoft.AspNetCore.App]
Microsoft.NETCore.App 7.0.20 [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Microsoft.NETCore.App 8.0.19 [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Microsoft.NETCore.App 8.0.20 [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Other architectures found:
None
Environment variables:
DOTNET_ROOT       [/home/username/.dotnet]
global.json file:
Not found
Learn more:
https://aka.ms/dotnet/info
Download .NET:
https://aka.ms/dotnet/download
You must install or update .NET to run this application.
App: /home/username/.dotnet/sdk/9.0.304/dotnet.dll
Architecture: x64
Framework: 'Microsoft.NETCore.App', version '9.0.8' (x64)
.NET location: /home/username/.dotnet/
The following frameworks were found:
7.0.20 at [/home/username/.dotnet/shared/Microsoft.NETCore.App]
8.0.19 at [/home/username/.dotnet/shared/Microsoft.NETCore.App]
8.0.20 at [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Learn more:
https://aka.ms/dotnet/app-launch-failed
To install missing framework, download:
https://aka.ms/dotnet-core-applaunch?framework=Microsoft.NETCore.App&framework_version=9.0.8&arch=x64&rid=linux-x64&os=ubuntu.25.04
Host:
Version:      9.0.8
Architecture: x64
Commit:       aae90fa090
RID:          linux-x64
.NET SDKs installed:
8.0.414 [/home/username/.dotnet/sdk]
9.0.304 [/home/username/.dotnet/sdk]
.NET runtimes installed:
Microsoft.AspNetCore.App 7.0.20 [/home/username/.dotnet/shared/Microsoft.AspNetCore.App]
Microsoft.AspNetCore.App 8.0.19 [/home/username/.dotnet/shared/Microsoft.AspNetCore.App]
Microsoft.AspNetCore.App 8.0.20 [/home/username/.dotnet/shared/Microsoft.AspNetCore.App]
Microsoft.NETCore.App 7.0.20 [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Microsoft.NETCore.App 8.0.19 [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Microsoft.NETCore.App 8.0.20 [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Other architectures found:
None
Environment variables:
DOTNET_ROOT       [/home/username/.dotnet]
global.json file:
Not found
Learn more:
https://aka.ms/dotnet/info
Download .NET:
https://aka.ms/dotnet/download
env: 'dotnet'
: No such file or directory`;

    // This should not throw an error
    expect(() => {
      const result = parseDotnetInfo(problematicOutput);
    }).not.toThrow();
  });

  it('should parse the problematic output and extract available information', () => {
    const problematicOutput = `Executing dotnet --info command...
You must install or update .NET to run this application.
App: /home/username/.dotnet/sdk/9.0.304/dotnet.dll
Architecture: x64
Framework: 'Microsoft.NETCore.App', version '9.0.8' (x64)
.NET location: /home/username/.dotnet/
The following frameworks were found:
7.0.20 at [/home/username/.dotnet/shared/Microsoft.NETCore.App]
8.0.19 at [/home/username/.dotnet/shared/Microsoft.NETCore.App]
8.0.20 at [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Learn more:
https://aka.ms/dotnet/app-launch-failed
To install missing framework, download:
https://aka.ms/dotnet-core-applaunch?framework=Microsoft.NETCore.App&framework_version=9.0.8&arch=x64&rid=linux-x64&os=ubuntu.25.04
Host:
Version:      9.0.8
Architecture: x64
Commit:       aae90fa090
RID:          linux-x64
.NET SDKs installed:
8.0.414 [/home/username/.dotnet/sdk]
9.0.304 [/home/username/.dotnet/sdk]
.NET runtimes installed:
Microsoft.AspNetCore.App 7.0.20 [/home/username/.dotnet/shared/Microsoft.AspNetCore.App]
Microsoft.AspNetCore.App 8.0.19 [/home/username/.dotnet/shared/Microsoft.AspNetCore.App]
Microsoft.AspNetCore.App 8.0.20 [/home/username/.dotnet/shared/Microsoft.AspNetCore.App]
Microsoft.NETCore.App 7.0.20 [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Microsoft.NETCore.App 8.0.19 [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Microsoft.NETCore.App 8.0.20 [/home/username/.dotnet/shared/Microsoft.NETCore.App]
Other architectures found:
None
Environment variables:
DOTNET_ROOT       [/home/username/.dotnet]
global.json file:
Not found
Learn more:
https://aka.ms/dotnet/info
Download .NET:
https://aka.ms/dotnet/download`;

    const result = parseDotnetInfo(problematicOutput);

    // Should extract the host information
    expect(result.host).toBeDefined();
    expect(result.host.version).toBe('9.0.8');
    expect(result.host.architecture).toBe('x64');
    expect(result.host.commit).toBe('aae90fa090');

    // Should extract SDKs
    expect(result.installedSdks).toHaveLength(2);
    expect(result.installedSdks[0]).toEqual({
      version: '8.0.414',
      path: '/home/username/.dotnet/sdk'
    });
    expect(result.installedSdks[1]).toEqual({
      version: '9.0.304',
      path: '/home/username/.dotnet/sdk'
    });

    // Should extract runtimes
    expect(result.installedRuntimes).toHaveLength(6);
    expect(result.installedRuntimes[0]).toEqual({
      name: 'Microsoft.AspNetCore.App',
      version: '7.0.20',
      path: '/home/username/.dotnet/shared/Microsoft.AspNetCore.App'
    });

    // Should extract environment variables
    expect(result.environmentVariables).toEqual({
      'DOTNET_ROOT': '/home/username/.dotnet'
    });

    // Should handle global.json file
    expect(result.globalJsonFile).toBe('Not found');

    // Should handle other architectures
    expect(result.otherArchitectures).toEqual([]);
  });

  it('should handle normal dotnet --info output correctly', () => {
    const normalOutput = `.NET SDK:
 Version:   8.0.100
 Commit:    abc123def

Runtime Environment:
 OS Name:     ubuntu
 OS Version:  22.04
 OS Platform: Linux
 RID:         ubuntu.22.04-x64
 Base Path:   /usr/share/dotnet/

Host:
 Version:      8.0.0
 Architecture: x64
 Commit:       def456ghi

.NET SDKs installed:
 8.0.100 [/usr/share/dotnet/sdk]

.NET runtimes installed:
 Microsoft.AspNetCore.App 8.0.0 [/usr/share/dotnet/shared/Microsoft.AspNetCore.App]
 Microsoft.NETCore.App 8.0.0 [/usr/share/dotnet/shared/Microsoft.NETCore.App]

Other architectures found:
 None

Environment variables:
 DOTNET_ROOT     [/usr/share/dotnet]

global.json file:
 Not found`;

    const result = parseDotnetInfo(normalOutput);

    expect(result.sdk.version).toBe('8.0.100');
    expect(result.sdk.commit).toBe('abc123def');
    expect(result.runtimeEnvironment.osName).toBe('ubuntu');
    expect(result.runtimeEnvironment.osVersion).toBe('22.04');
    expect(result.host.version).toBe('8.0.0');
    expect(result.installedSdks).toHaveLength(1);
    expect(result.installedRuntimes).toHaveLength(2);
  });

  it('should handle current dotnet --info output format', () => {
    const currentOutput = `Host:
  Version:      9.0.8
  Architecture: x64
  Commit:       aae90fa090
  RID:          linux-x64

.NET SDKs installed:
  8.0.414 [/home/goose/.dotnet/sdk]
  9.0.304 [/home/goose/.dotnet/sdk]

.NET runtimes installed:
  Microsoft.AspNetCore.App 7.0.20 [/home/goose/.dotnet/shared/Microsoft.AspNetCore.App]
  Microsoft.AspNetCore.App 8.0.19 [/home/goose/.dotnet/shared/Microsoft.AspNetCore.App]
  Microsoft.AspNetCore.App 8.0.20 [/home/goose/.dotnet/shared/Microsoft.AspNetCore.App]
  Microsoft.NETCore.App 7.0.20 [/home/goose/.dotnet/shared/Microsoft.NETCore.App]
  Microsoft.NETCore.App 8.0.19 [/home/goose/.dotnet/shared/Microsoft.NETCore.App]
  Microsoft.NETCore.App 8.0.20 [/home/goose/.dotnet/shared/Microsoft.NETCore.App]

Other architectures found:
  None

Environment variables:
  DOTNET_ROOT       [/home/goose/.dotnet]

global.json file:
  Not found

Learn more:
  https://aka.ms/dotnet/info

Download .NET:
  https://aka.ms/dotnet/download
You must install or update .NET to run this application.

App: /home/goose/.dotnet/sdk/9.0.304/dotnet.dll
Architecture: x64
Framework: 'Microsoft.NETCore.App', version '9.0.8' (x64)
.NET location: /home/goose/.dotnet/

The following frameworks were found:
  7.0.20 at [/home/goose/.dotnet/shared/Microsoft.NETCore.App]
  8.0.19 at [/home/goose/.dotnet/shared/Microsoft.NETCore.App]
  8.0.20 at [/home/goose/.dotnet/shared/Microsoft.NETCore.App]

Learn more:
https://aka.ms/dotnet/app-launch-failed

To install missing framework, download:
https://aka.ms/dotnet-core-applaunch?framework=Microsoft.NETCore.App&framework_version=9.0.8&arch=x64&rid=linux-x64&os=ubuntu.25.04`;

    const result = parseDotnetInfo(currentOutput);

    // Should extract the host information
    expect(result.host).toBeDefined();
    expect(result.host.version).toBe('9.0.8');
    expect(result.host.architecture).toBe('x64');
    expect(result.host.commit).toBe('aae90fa090');

    // Should extract SDKs
    expect(result.installedSdks).toHaveLength(2);
    expect(result.installedSdks[0]).toEqual({
      version: '8.0.414',
      path: '/home/goose/.dotnet/sdk'
    });
    expect(result.installedSdks[1]).toEqual({
      version: '9.0.304',
      path: '/home/goose/.dotnet/sdk'
    });

    // Should extract runtimes
    expect(result.installedRuntimes).toHaveLength(6);
    expect(result.installedRuntimes[0]).toEqual({
      name: 'Microsoft.AspNetCore.App',
      version: '7.0.20',
      path: '/home/goose/.dotnet/shared/Microsoft.AspNetCore.App'
    });

    // Should extract environment variables
    expect(result.environmentVariables).toEqual({
      'DOTNET_ROOT': '/home/goose/.dotnet'
    });

    // Should handle global.json file
    expect(result.globalJsonFile).toBe('Not found');

    // Should handle other architectures
    expect(result.otherArchitectures).toEqual([]);

    // Should extract RID from host section
    expect(result.runtimeEnvironment.rid).toBe('linux-x64');

    // Should extract .NET location
    expect(result.runtimeEnvironment.basePath).toBe('/home/goose/.dotnet/');
  });
});
