$filePath = "c:\Users\Evgenia\Desktop\Websote\index.html"
$content = Get-Content -Path $filePath -Raw

# Remove the <audio> tag
$content = $content -replace '(?s)<audio id="ap-audio"[^>]*>.*?</audio>\s*', ''

# Remove ALL existing Ambient Audio Player Logic blocks
# Match from the comment start to the closing brace after loadTrack(0);
$pattern = '(?s)/\*\s*[^\*]*Ambient Audio Player Logic.*?\*/.*?loadTrack\(0\);\s*\}'
$content = $content -replace $pattern, ''

# We will inject the new logic right before </body>
$newLogic = @"
<script>
(function() {
    'use strict';
    /* ── NEW Ambient Audio Player Logic ── */
    var apPlay = document.getElementById('ap-play');
    var apPrev = document.getElementById('ap-prev');
    var apNext = document.getElementById('ap-next');
    var apTrackName = document.getElementById('ap-track-name');

    if (!apPlay) return;

    var tracks = [
        { name: "SoundHelix 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { name: "SoundHelix 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
    ];
    var currentTrackIdx = 0;

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.loop = true;

    function loadTrack(idx) {
        apTrackName.textContent = tracks[idx].name;
        audio.src = tracks[idx].url;
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => {
                console.log("Audio playing successfully");
                apPlay.innerHTML = '&#10074;&#10074;';
            }).catch((error) => {
                console.error("Audio playback failed:", error);
            });
        } else {
            audio.pause();
            apPlay.innerHTML = '&#9654;';
        }
    }

    apPlay.addEventListener('click', togglePlay);

    // Keep visual state in sync with actual audio events
    audio.addEventListener('play', function() { apPlay.innerHTML = '&#10074;&#10074;'; });
    audio.addEventListener('playing', function() { apPlay.innerHTML = '&#10074;&#10074;'; });
    audio.addEventListener('pause', function() { apPlay.innerHTML = '&#9654;'; });

    apNext.addEventListener('click', function() {
        currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
        loadTrack(currentTrackIdx);
        audio.play().then(() => {
            console.log("Audio playing successfully");
        }).catch((error) => {
            console.error("Audio playback failed:", error);
        });
    });

    apPrev.addEventListener('click', function() {
        currentTrackIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIdx);
        audio.play().then(() => {
            console.log("Audio playing successfully");
        }).catch((error) => {
            console.error("Audio playback failed:", error);
        });
    });

    loadTrack(0);
})();
</script>
</body>
"@

$content = $content -replace '</body>', $newLogic

Set-Content -Path $filePath -Value $content
Write-Host "Cleanup and injection complete!"
