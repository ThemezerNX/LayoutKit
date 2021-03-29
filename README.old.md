# **LayoutKit** 📦

A pre-configured environment with the most useful tools and scripts to create new layouts.
Files are transferred to your switch over FTP.

## **Requirements** 📝

-   Windows x64
-   [Python 3.x](https://www.python.org/downloads/)
-   [Git](https://git-scm.com/downloads)
-   [DirectX Runtime](https://www.microsoft.com/en-us/download/details.aspx?id=35)
-   [.NET Framework 4.6 or higher](https://www.microsoft.com/en-us/download/details.aspx?id=53344)
-   [WinSCP](https://winscp.net/eng/download.php) (optional: during installation pick the 'Explorer' interface type)
-   [NXThemesInstaller](https://github.com/exelix11/SwitchThemeInjector/releases/latest) (run it at least once and go through the setup)
-   NodeJS

## **How to use** ✋

1. Download the latest release from [releases page](https://github.com/ThemezerNX/LayoutKit/releases).
2. Unzip the archive.
3. Run `LayoutKit/libs/Updater.bat` to update all tools to their latest versions.
4. Install `sys-ftpd-light-reboot` on your Switch.
    1. Run `LayoutKit/1. Download Sysmodule.bat`.
    2. Unzip the archive into a new folder.
    3. Copy the contents to the root of your MicroSD card.
    4. Reboot your switch.
5. Add the Switch to WinSCP.
    1. Open WinSCP.
    2. Add a new site.
    3. Select FTP, enter your Switch's IP and put 'nxthemer' as user and password.
    4. Click 'Save' and click 'Login'.
6. Copy all files in the `/themes/systemData/` folder from your MicroSD (over FTP) to the `LayoutKit/stock` folder.
7. Run `LayoutKit/2. Extract.bat` to extract all files.
8. ???
9. Profit!

## **Included in this kit** 📜

-   [Switch Toolbox](https://github.com/KillzXGaming/Switch-Toolbox) by KillzXGaming
-   [SARC Tool](https://github.com/aboood40091/SARC-Tool) by AboodXD
-   [3DSKit](https://github.com/Tyulis/3DSkit) Tyulis

### **Other**

-   Scripts to extract `SZS` files and sort them.
-   Scripts to extract bntx files and repack them? -------------
-   Scripts to convert bflyt files into json and vice versa.
-   Scripts to automatically repack everything, push the `SZS`s to your switch and reboot.
-   A modified sys-ftpd-lite sysmodule that supports rebooting

## **Special Thanks** ❤️

Special thanks to the awesome people who created the awesome tools above!
