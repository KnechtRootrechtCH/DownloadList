$folders = Get-ChildItem | Where-Object { $_.PSIsContainer } | Where-Object { -not $_.Name.StartsWith("[") }
Write-Host "Found $($folders.length) folders..."
$regex = "(.+?)([1,2]\d{3})(?:.*)"

for ($i = 0; $i -le $folders.length; $i++) {
  $percentage = 100 * $i / $folders.length
  $folder = $folders[$i]
  Write-Progress -Activity "Sanitizing $($folder.Name)" -Status "$i/$($folders.length)" -PercentComplete $percentage;
  Write-Host $folder

  $year = $null
  $name = $folder.Name
  $title = $name

  $match = [regex]::Match($name, $regex)
  if ($match.Success) {
    $title = $match.captures.groups[1]
    $year = $match.captures.groups[2]
  }

  $title = $title -replace "\.", " "
  $title = $title.Trim()

  $newName = $title
  if (-not [string]::IsNullOrEmpty($year)) {
    $newName = "$title ($year)"
  }

  if (-not [string]::IsNullOrEmpty($name) -and -not [string]::IsNullOrEmpty($newName)) {
    Write-Host "`nRenaming:"
    Write-Host $name
    Write-Host $newName
    Rename-Item -Path ".\$name" -NewName "$newName"
  }
}
