# SkillSwap Local Development Server
# Pure PowerShell HTTP Server using .NET HttpListener

$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "SkillSwap Local Server running at http://localhost:$port/"
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/" -or $localPath -eq "") {
            $localPath = "/index.html"
        }
        
        # Clean path to prevent path traversal
        $cleanPath = $localPath.Replace("/", "\").TrimStart('\')
        $filePath = Join-Path (Get-Location) $cleanPath
        
        if (Test-Path $filePath -PathType Leaf) {
            # Determine Content Type
            if ($filePath -like "*.html") {
                $response.ContentType = "text/html; charset=utf-8"
            } elseif ($filePath -like "*.css") {
                $response.ContentType = "text/css; charset=utf-8"
            } elseif ($filePath -like "*.js") {
                $response.ContentType = "application/javascript; charset=utf-8"
            } elseif ($filePath -like "*.png") {
                $response.ContentType = "image/png"
            } elseif ($filePath -like "*.jpg" -or $filePath -like "*.jpeg") {
                $response.ContentType = "image/jpeg"
            } elseif ($filePath -like "*.svg") {
                $response.ContentType = "image/svg+xml"
            } else {
                $response.ContentType = "application/octet-stream"
            }
            
            # Read and serve file bytes
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # Return 404 Not Found
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $localPath")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        
        $response.OutputStream.Close()
    }
} catch {
    Write-Error $_
} finally {
    if ($listener) {
        $listener.Stop()
        $listener.Close()
    }
}
