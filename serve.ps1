# Robust PowerShell HTTP server — handles aborted connections gracefully
$port = 8000
$root = $PSScriptRoot
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/"
Write-Host "Press Ctrl+C to stop."

try {
    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        $localPath = $req.Url.LocalPath -replace '/', '\'
        if ($localPath -eq '\') { $localPath = '\index.html' }
        $filePath = Join-Path $root $localPath.TrimStart('\')

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.mp3'  { 'audio/mpeg' }
                '.mp4'  { 'video/mp4' }
                '.png'  { 'image/png' }
                '.jpg'  { 'image/jpeg' }
                '.jpeg' { 'image/jpeg' }
                '.svg'  { 'image/svg+xml' }
                '.ico'  { 'image/x-icon' }
                '.webm' { 'video/webm' }
                '.woff2'{ 'font/woff2' }
                '.woff' { 'font/woff' }
                default { 'application/octet-stream' }
            }
            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $res.ContentType = $mime
                $res.ContentLength64 = $bytes.Length
                $res.Headers.Add('Access-Control-Allow-Origin', '*')
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                # Client disconnected mid-transfer (e.g. audio seek/cancel) — ignore
            }
        } else {
            try {
                $res.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $($req.Url.LocalPath)")
                $res.OutputStream.Write($msg, 0, $msg.Length)
            } catch { }
        }

        try { $res.OutputStream.Close() } catch { }
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped."
}
