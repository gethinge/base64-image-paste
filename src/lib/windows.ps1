param($dir,$name,$index)

Add-Type -Assembly PresentationCore

$save_images = 0

$img = get-clipboard -format image

$fileDropList = $null
if ([System.Windows.Clipboard]::ContainsFileDropList()) {
    $fileDropList = [System.Windows.Clipboard]::GetFileDropList()
}

if ($fileDropList -eq $null -and $img -eq $null) {
    Write-Host $save_images
    Exit 1  
}

if ($img -ne $null) {
    $path = $dir + "\" + $name + "-" + $index + ".jpg"
    $img.save($path)
    $save_images += 1
    $index += 1
}

if ($fileDropList -ne $null) {
    foreach ($fileDrop in $fileDropList) {
        $img = [System.Drawing.Image]::FromFile($fileDrop)
        $path = $dir + "\" + $name + "-" + $index + ".jpg"
        $img.save($path)
        $save_images += 1
        $index += 1
    }
}

Write-Host $save_images

