$html = Get-Content 'c:\Users\Evgenia\Desktop\Websote\index.html' -Raw
$matches = [regex]::Matches($html, '(?s)<script>(.*?)</script>')
$js = ''
foreach ($m in $matches) {
    $js += $m.Groups[1].Value + "`n"
}
Set-Content -Path 'c:\Users\Evgenia\Desktop\Websote\test.js' -Value $js
