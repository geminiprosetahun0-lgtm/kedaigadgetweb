$ftpBase = "ftp://163.223.227.8/"
$userDeployer = "deployer@kedaigadget.web.id"
$userWeb = "deployweb@kedaigadget.web.id"
$pass = "Naran@1303"
$credDeployer = New-Object System.Net.NetworkCredential($userDeployer, $pass)
$credWeb = New-Object System.Net.NetworkCredential($userWeb, $pass)

$projectRoot = Split-Path -Parent $PSScriptRoot
$localDist = Join-Path $projectRoot "dist"

Write-Host ">>> Memulai Deploy Otomatis..." -ForegroundColor Cyan

function Upload-Raw($cred, $uri, $bytes) {
    $req = [System.Net.FtpWebRequest]::Create($uri)
    $req.Credentials = $cred
    $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $req.EnableSsl = $false
    $req.UseBinary = $true
    $req.ContentLength = $bytes.Length
    $stream = $req.GetRequestStream()
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
    $resp = $req.GetResponse()
    $resp.Close()
}

function Ensure-Dir($cred, $uri) {
    try {
        $req = [System.Net.FtpWebRequest]::Create($uri)
        $req.Credentials = $cred
        $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $req.EnableSsl = $false
        $resp = $req.GetResponse()
        $resp.Close()
    } catch {}
}

# 1. Upload Frontend via deployer (deployer root IS the frontend / public_html)
Write-Host ">>> [1/2] Mengunggah Frontend..." -ForegroundColor Cyan
$distFiles = Get-ChildItem -Path $localDist -Recurse -File
foreach ($f in $distFiles) {
    $rel = $f.FullName.Substring($localDist.Length).TrimStart("\").Replace("\", "/")
    $dirName = [System.IO.Path]::GetDirectoryName($rel)
    if ($dirName) {
        $parts = $dirName.Split("\")
        $curr = ""
        foreach ($p in $parts) {
            $curr += $p + "/"
            Ensure-Dir $credDeployer ($ftpBase + $curr)
        }
    }
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    Upload-Raw $credDeployer ($ftpBase + $rel) $bytes
}
Write-Host ">>> Frontend sukses terupload!" -ForegroundColor Green

# 2. Upload Backend via deployweb into deployer/ folder (where Node.js runs)
Write-Host ">>> [2/2] Mengunggah Backend & Bot Telegram..." -ForegroundColor Cyan
Ensure-Dir $credWeb ($ftpBase + "deployer/dist-server/")
Ensure-Dir $credWeb ($ftpBase + "deployer/server/")
Ensure-Dir $credWeb ($ftpBase + "deployer/tmp/")

$backendFiles = Get-ChildItem -Path (Join-Path $projectRoot "dist-server") -File
foreach ($f in $backendFiles) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    Upload-Raw $credWeb ($ftpBase + "deployer/dist-server/" + $f.Name) $bytes
}

$serverJson = Join-Path $projectRoot "server\products.json"
if (Test-Path $serverJson) {
    $pBytes = [System.IO.File]::ReadAllBytes($serverJson)
    Upload-Raw $credWeb ($ftpBase + "deployer/server/products.json") $pBytes
    Upload-Raw $credWeb ($ftpBase + "deployer/dist-server/products.json") $pBytes
}

$pkgJson = Join-Path $projectRoot "package.json"
if (Test-Path $pkgJson) {
    $pkgBytes = [System.IO.File]::ReadAllBytes($pkgJson)
    Upload-Raw $credWeb ($ftpBase + "deployer/package.json") $pkgBytes
}

# Restart Passenger automatically
$rstBytes = [System.Text.Encoding]::UTF8.GetBytes("restart " + [System.DateTime]::UtcNow.ToString())
Upload-Raw $credWeb ($ftpBase + "deployer/tmp/restart.txt") $rstBytes

Write-Host ">>> DEPLOY SELESAI! Frontend dan Backend berhasil diperbarui secara otomatis." -ForegroundColor Green
