param (
    [int]$Port = 8080,
    [string]$Root = $PSScriptRoot
)

if (-not $Root) {
    $Root = (Get-Location).Path
}

Add-Type -TypeDefinition @"
using System;
using System.IO;
using System.Net;
using System.Threading;

public class TinyStaticServer {
    private HttpListener listener;
    private string rootPath;
    private int port;
    public bool Running = false;

    public void Start(string root, int portNumber) {
        rootPath = Path.GetFullPath(root);
        port = portNumber;
        listener = new HttpListener();
        listener.Prefixes.Add(string.Format("http://localhost:{0}/", port));
        listener.Prefixes.Add(string.Format("http://127.0.0.1:{0}/", port));
        listener.Start();
        Running = true;
        Console.WriteLine("Serving " + rootPath + " on http://localhost:" + port + "/");

        ThreadPool.QueueUserWorkItem(ListenLoop);
    }

    private void ListenLoop(object state) {
        while (Running) {
            try {
                var context = listener.GetContext();
                ThreadPool.QueueUserWorkItem(ProcessRequest, context);
            } catch (Exception) {
                if (!Running) break;
            }
        }
    }

    private void ProcessRequest(object state) {
        var context = (HttpListenerContext)state;
        try {
            string rawUrl = context.Request.Url.AbsolutePath;
            if (string.IsNullOrEmpty(rawUrl) || rawUrl == "/") {
                rawUrl = "/index.html";
            }
            string decodedPath = Uri.UnescapeDataString(rawUrl.TrimStart('/', '\\'));
            string fullPath = Path.GetFullPath(Path.Combine(rootPath, decodedPath.Replace('/', Path.DirectorySeparatorChar)));

            if (!fullPath.StartsWith(rootPath, StringComparison.OrdinalIgnoreCase)) {
                context.Response.StatusCode = 403;
                context.Response.Close();
                return;
            }

            if (!File.Exists(fullPath)) {
                context.Response.StatusCode = 404;
                context.Response.Close();
                return;
            }

            string ext = Path.GetExtension(fullPath).ToLowerInvariant();
            string mimeType = "application/octet-stream";
            switch (ext) {
                case ".html": mimeType = "text/html; charset=utf-8"; break;
                case ".css": mimeType = "text/css; charset=utf-8"; break;
                case ".js": mimeType = "application/javascript; charset=utf-8"; break;
                case ".jpg":
                case ".jpeg": mimeType = "image/jpeg"; break;
                case ".png": mimeType = "image/png"; break;
                case ".webp": mimeType = "image/webp"; break;
                case ".svg": mimeType = "image/svg+xml"; break;
                case ".json": mimeType = "application/json"; break;
                case ".ico": mimeType = "image/x-icon"; break;
            }

            context.Response.ContentType = mimeType;
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Response.Headers.Add("Cache-Control", "public, max-age=86400");

            byte[] buffer = new byte[64 * 1024];
            using (var fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read)) {
                context.Response.ContentLength64 = fs.Length;
                int read;
                while ((read = fs.Read(buffer, 0, buffer.Length)) > 0) {
                    context.Response.OutputStream.Write(buffer, 0, read);
                }
            }
            context.Response.OutputStream.Close();
        } catch (Exception) {
            try { context.Response.Close(); } catch {}
        }
    }

    public void Stop() {
        Running = false;
        try { listener.Stop(); } catch {}
        try { listener.Close(); } catch {}
    }
}
"@

$server = New-Object TinyStaticServer
$server.Start($Root, $Port)
Write-Host "SUCCESS: Server is listening on http://localhost:$Port/"

# Keep PowerShell process alive
try {
    while ($server.Running) {
        Start-Sleep -Seconds 1
    }
} finally {
    $server.Stop()
}

