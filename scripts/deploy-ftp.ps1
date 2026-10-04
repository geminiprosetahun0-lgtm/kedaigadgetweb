$ftpBase = "ftp://163.223.227.8/"
$user = "deployer@kedaigadget.web.id"
$pass = "Naran@1303"
$cred = New-Object System.Net.NetworkCredential($user, $pass)
$projectRoot = Split-Path -Parent $PSScriptRoot
$localDist = Join-Path $projectRoot "dist"

Write-Host ">>> Memulai upload ke kedaigadget.web.id..." -ForegroundColor Cyan

function Ensure-FtpDirectory($dirPath) {
    try {
        $req = [System.Net.FtpWebRequest]::Create($ftpBase + $dirPath)
        $req.Credentials = $cred
        $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $req.EnableSsl = $false
        $resp = $req.GetResponse()
        $resp.Close()
    } catch {
        # Abaikan jika folder sudah ada
    }
}

function Upload-FtpFile($localFilePath, $remoteRelativePath) {
    $remoteUri = $ftpBase + $remoteRelativePath.Replace("\", "/")
    Write-Host " Mengunggah: $remoteRelativePath"
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

# 1. Upload Frontend (public_html)
$files = Get-ChildItem -Path $localDist -Recurse -File
foreach ($f in $files) {
    $rel = $f.FullName.Substring($localDist.Length).TrimStart("\")
    $dirName = [System.IO.Path]::GetDirectoryName($rel)
    if ($dirName) {
        $parts = $dirName.Split("\")
        $curr = ""
        foreach ($p in $parts) {
            $curr += $p + "/"
            Ensure-FtpDirectory($curr)
        }
    }
    Upload-FtpFile $f.FullName $rel
}

# 2. Upload Backend Files Otomatis
Write-Host ">>> Mengunggah file backend terbaru..." -ForegroundColor Cyan
$projectRoot = Split-Path -Parent $PSScriptRoot
$dirsToCreate = @("dist-server/", "server/")
foreach ($d in $dirsToCreate) {
    Ensure-FtpDirectory $d
}

$backendFiles = Get-ChildItem -Path (Join-Path $projectRoot "dist-server") -File
foreach ($f in $backendFiles) {
    Upload-FtpFile $f.FullName ("dist-server/" + $f.Name)
}

$serverJson = Join-Path $projectRoot "server\products.json"
if (Test-Path $serverJson) {
    Upload-FtpFile $serverJson "server/products.json"
}
Upload-FtpFile (Join-Path $projectRoot "package.json") "package.json"
Upload-FtpFile (Join-Path $projectRoot "package-lock.json") "package-lock.json"

Write-Host ">>> DEPLOY SELESAI! Frontend & Backend berhasil diperbarui secara otomatis." -ForegroundColor Green
