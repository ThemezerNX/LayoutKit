!macro customInstall
  DetailPrint "Running DirectX Setup..."
  File /oname=$PLUGINSDIR\ndp48-web.exe "${BUILD_RESOURCES_DIR}\ndp48-web.exe"
  ExecWait '"$PLUGINSDIR\ndp48-web.exe"'
  DetailPrint "Finished DirectX Setup"

  DetailPrint "Running DirectX Setup..."
  File /oname=$PLUGINSDIR\dxwebsetup.exe "${BUILD_RESOURCES_DIR}\dxwebsetup.exe"
  ExecWait '"$PLUGINSDIR\dxwebsetup.exe"'
  DetailPrint "Finished DirectX Setup"
!macroend