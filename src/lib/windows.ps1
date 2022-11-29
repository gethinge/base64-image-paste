 # Convert string to base64 string
function ConvertTo-Base64String([string]$string)
{
    $byteArray = [System.Text.UnicodeEncoding]::Unicode.GetBytes($string)
    [Convert]::ToBase64String( $byteArray )
}

# Convert base64 string to string
function ConvertFrom-Base64String([string]$string)
{
    $byteArray = [Convert]::FromBase64String($string)
    [System.Text.UnicodeEncoding]::Unicode.GetString($byteArray)
}

function ConvertTo-Base64String() {}

# test case 
$wishWords = 'VINel9SCXXlQAG8AdwBlAHIAUwBoAGUAbABsAKR/y1PsThr/sGV0XutfUE4M/2yaMFIQYp9SDP9smnReJ1kJVAz/aFG2W3hej3kB/wH/Af8='
$wishWords = ConvertFrom-Base64String $wishWords

# for($i=1;$i -le $wishWords.Length;$i++)
# {
#     Clear-Host
#     $wishWords.Substring(0,$i)
#     sleep -Milliseconds 200
# }
 get-clipboard -format image
 $img = get-clipboard -format image
 echo "yes"
 echo $img.getType()
 $img.save("c:\temp\temp.jpg")