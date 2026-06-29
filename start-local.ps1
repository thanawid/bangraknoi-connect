param(
  [int]$Port = 4173,
  [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Split-Path -Parent $MyInvocation.MyCommand.Path))
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)

$contentTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css' = 'text/css; charset=utf-8'
  '.js' = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.webmanifest' = 'application/manifest+json; charset=utf-8'
  '.png' = 'image/png'
  '.svg' = 'image/svg+xml'
  '.ico' = 'image/x-icon'
  '.md' = 'text/markdown; charset=utf-8'
}

try {
  $listener.Start()
  Write-Host "Bangraknoi Connect is running at http://localhost:$Port/" -ForegroundColor Magenta
  Write-Host 'Close this window to stop the local server.' -ForegroundColor DarkGray
  if (-not $NoBrowser) { Start-Process "http://localhost:$Port/" }

  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 1024, $true)
      $requestLine = $reader.ReadLine()
      do { $headerLine = $reader.ReadLine() } while ($null -ne $headerLine -and $headerLine.Length -gt 0)

      $status = '200 OK'
      $contentType = 'application/octet-stream'
      $bytes = [byte[]]::new(0)
      $parts = if ($requestLine) { $requestLine.Split(' ') } else { @() }

      if ($parts.Count -lt 2 -or $parts[0] -ne 'GET') {
        $status = '405 Method Not Allowed'
        $bytes = [Text.Encoding]::UTF8.GetBytes('405 - Method not allowed')
      } else {
        $uri = [Uri]::new("http://localhost$($parts[1])")
        $relative = [Uri]::UnescapeDataString($uri.AbsolutePath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
        $file = [IO.Path]::GetFullPath((Join-Path $root $relative))
        $insideRoot = $file.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)

        if (-not $insideRoot -or -not [IO.File]::Exists($file)) {
          $status = '404 Not Found'
          $contentType = 'text/plain; charset=utf-8'
          $bytes = [Text.Encoding]::UTF8.GetBytes('404 - File not found')
        } else {
          $extension = [IO.Path]::GetExtension($file).ToLowerInvariant()
          if ($contentTypes.ContainsKey($extension)) { $contentType = $contentTypes[$extension] }
          $bytes = [IO.File]::ReadAllBytes($file)
        }
      }

      $header = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`nCache-Control: no-cache`r`n`r`n"
      $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      if ($bytes.Length -gt 0) { $stream.Write($bytes, 0, $bytes.Length) }
      $stream.Flush()
    } finally {
      $client.Close()
    }
  }
} finally {
  $listener.Stop()
}
