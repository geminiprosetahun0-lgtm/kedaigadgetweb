$ftpBase = "ftp://163.223.227.8/"
$user = "deployer@kedaigadget.web.id"
$pass = "Naran@1303"
$cred = New-Object System.Net.NetworkCredential($user, $pass)
$localDist = Join-Path $PSScriptRoot "dist"

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

Write-Host ">>> DEPLOY SELESAI! Website berhasil diperbarui." -ForegroundColor Green
