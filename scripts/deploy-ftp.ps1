$ErrorActionPreference = 'Stop'
$ftpBase = "ftp://163.223.227.8/"
$userDeployer = "deployer@kedaigadget.web.id"
$userBot = "botdeploy@kedaigadget.web.id"
if (-not $env:KEDAI_FTP_PASSWORD) { throw 'Set KEDAI_FTP_PASSWORD sebelum deploy.' }
$credDeployer = New-Object System.Net.NetworkCredential($userDeployer, $env:KEDAI_FTP_PASSWORD)
$credBot = New-Object System.Net.NetworkCredential($userBot, $env:KEDAI_FTP_PASSWORD)

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

# 2. Upload compiled backend into active Node.js application root
Write-Host ">>> [2/2] Mengunggah Backend & Bot Telegram..." -ForegroundColor Cyan
$backendFiles = Get-ChildItem -Path (Join-Path $projectRoot "dist-server") -File -Filter '*.js'
foreach ($f in $backendFiles) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    Upload-Raw $credBot ($ftpBase + "dist-server/" + $f.Name) $bytes
}
$rstBytes = [System.Text.Encoding]::UTF8.GetBytes("restart " + [System.DateTime]::UtcNow.ToString())
Upload-Raw $credBot ($ftpBase + "tmp/restart.txt") $rstBytes

Write-Host ">>> DEPLOY SELESAI! Frontend dan Backend berhasil diperbarui secara otomatis." -ForegroundColor Green
