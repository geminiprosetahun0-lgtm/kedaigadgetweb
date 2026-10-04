$ftpBase = "ftp://163.223.227.8/"
$user = "deployer@kedaigadget.web.id"
$pass = "Naran@1303"
$cred = New-Object System.Net.NetworkCredential($user, $pass)
$localRoot = $PSScriptRoot
if ($localRoot.EndsWith("scripts")) {
    $localRoot = Split-Path -Parent $localRoot
}

Write-Host ">>> Memulai auto-sync backend & website..." -ForegroundColor Cyan

function Ensure-FtpDirectory($dirPath) {
    try {
        $req = [System.Net.FtpWebRequest]::Create($ftpBase + $dirPath)
        $req.Credentials = $cred
        $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $req.EnableSsl = $false
        $resp = $req.GetResponse()
        $resp.Close()
    } catch {}
}

function Upload-FtpFile($localFilePath, $remotePath) {
    $remoteUri = $ftpBase + $remotePath.Replace("\", "/")
    Write-Host " Mengunggah: $remotePath"
    $req = [System.Net.FtpWebRequest]::Create($remoteUri)
    $req.Credentials = $cred
    $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $req.EnableSsl = $false
    $req.UseBinary = $true

    $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
    $req.ContentLength = $bytes.Length
    $stream = $req.GetRequestStream()
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
    $resp = $req.GetResponse()
    $resp.Close()
}

# Upload compiled backend files directly
$dirsToCreate = @("dist-server/", "server/")
foreach ($d in $dirsToCreate) {
    Ensure-FtpDirectory $d
}

$backendFiles = Get-ChildItem -Path (Join-Path $localRoot "dist-server") -File
foreach ($f in $backendFiles) {
    Upload-FtpFile $f.FullName ("dist-server/" + $f.Name)
}

$serverJson = Join-Path $localRoot "server\products.json"
if (Test-Path $serverJson) {
    Upload-FtpFile $serverJson "server/products.json"
}

# Upload package files
Upload-FtpFile (Join-Path $localRoot "package.json") "package.json"
Upload-FtpFile (Join-Path $localRoot "package-lock.json") "package-lock.json"

Write-Host ">>> SEMUA FILE BACKEND BERHASIL DI-SYNC SECARA OTOMATIS!" -ForegroundColor Green
