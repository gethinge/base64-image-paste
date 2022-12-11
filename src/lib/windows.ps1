 param($path)

$img = get-clipboard -format image
if ($img -eq  $null) {
    Write-Host "No picture in clipboard."
    Exit 1
}
$img.save($path)
Write-Host "Picture saved."
