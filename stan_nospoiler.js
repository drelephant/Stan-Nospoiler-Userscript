// ==UserScript==
// @name         Stan Nospoiler
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Toggle Timeline
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @author       drelephant
// @match        https://play.stan.com.au/*
// @run-at       document-end
// @grant        none
// @downloadURL    https://github.com/drelephant/Stan-Nospoiler-Userscript/raw/refs/heads/main/stan_nospoiler.js
// ==/UserScript==

(function() {

    console.log("Stan Nospoiler v1.21 userscript started!");

    let video;

    function logCurrentTime() {
        // var video = document.getElementsByTagName("video")[0];
        const currentTime = video.currentTime;
        console.log(currentTime + " secs");
    }

    function jumpforward() {
        // var video = document.getElementsByTagName("video")[0];
        video.currentTime = video.currentTime + 60;
        console.log("Jumped forward 60 secs");
    }

    function jumpforwardten() {
        // var video = document.getElementsByTagName("video")[0];
        video.currentTime = video.currentTime + 600;
        console.log("Jumped forward 10 mins");
    }

    function jumpbackward() {
        // var video = document.getElementsByTagName("video")[0];
        video.currentTime = video.currentTime - 60;
        console.log("Jumped backward 60 secs");
    }

    function jumpbackwardten() {
        // var video = document.getElementsByTagName("video")[0];
        video.currentTime = video.currentTime - 600;
        console.log("Jumped backward 10 mins");
    }

    document.onkeyup = function () {
        var e = e || window.event; // for IE to cover IEs window event-object
//         if(e.altKey && e.which == 65) {
//             alert('Keyboard shortcut working!');
//             return false;
//         }

        console.log("e.which= " + e.which);
        switch (e.which) {
            case 38: // up arrow
                if (e.ctrlKey) {
                    jumpforwardten();
                } else {
                    jumpforward();
                }
                break;
            case 40: // down arrow
                if (e.ctrlKey) {
                    jumpbackwardten();
                } else {
                    jumpbackward();
                }
                break;
            default:
        }
        return false
    }

    let loaded = false;

    function init() {
        console.log("Inside init loop");
        if (loaded) return;
        loaded = true;

        const player = document.getElementsByTagName("STAN-PLAYER")[0].shadowRoot;
        const container = player.querySelector("#player");
        video = player.querySelector("video");

        container.classList.add('hide-timeline');
        // container.classList.add('timejump');
        // container.classList.add('show-current-time');
        // controls--timeline

        player.querySelector('STYLE').textContent += `
          .vjs-button {
            background-size: contain !important;
          }
          .toggle-timeline {
            background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTIsMjBBOCw4IDAgMCwwIDIwLDEyQTgsOCAwIDAsMCAxMiw0QTgsOCAwIDAsMCA0LDEyQTgsOCAwIDAsMCAxMiwyME0xMiwyQTEwLDEwIDAgMCwxIDIyLDEyQTEwLDEwIDAgMCwxIDEyLDIyQzYuNDcsMjIgMiwxNy41IDIsMTJBMTAsMTAgMCAwLDEgMTIsMk0xMi41LDdWMTIuMjVMMTcsMTQuOTJMMTYuMjUsMTYuMTVMMTEsMTNWN0gxMi41WiIgLz48L3N2Zz4=) !important;
          }
          .timejump {
            background-image:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGlkPSJMYXllcl8xIiBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiPjwvZz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvZz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+IDxwYXRoIGQ9Ik05LDI0SDFhMSwxLDAsMCwxLDAtMkg5YTEsMSwwLDAsMSwwLDJaIE03LDIwSDFhMSwxLDAsMCwxLDAtMkg3YTEsMSwwLDAsMSwwLDJaIE01LDE2SDFhMSwxLDAsMCwxLDAtMkg1YTEsMSwwLDAsMSwwLDJaIE0xMywyMy45NTVhMSwxLDAsMCwxLS4wODktMkExMCwxMCwwLDEsMCwyLjA0MSwxMS4wOWExLDEsMCwwLDEtMS45OTItLjE4QTEyLDEyLDAsMCwxLDI0LDEyLDExLjkzNCwxMS45MzQsMCwwLDEsMTMuMDksMjMuOTUxQzEzLjA2LDIzLjk1NCwxMy4wMjksMjMuOTU1LDEzLDIzLjk1NVogTTEyLDZhMSwxLDAsMCwwLTEsMXY1YTEsMSwwLDAsMCwuMjkzLjcwN2wzLDNhMSwxLDAsMCwwLDEuNDE0LTEuNDE0TDEzLDExLjU4NlY3QTEsMSwwLDAsMCwxMiw2WiI+PC9wYXRoPjwvZz48L3N2Zz4=) !important;
          }
          .fwdfive {
            background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwLjg4IiBoZWlnaHQ9IjEyMi44OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogPHRpdGxlPjEtbWludXRlczwvdGl0bGU+CgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxwYXRoIGZpbGw9IiNmZmZmZmYiIGlkPSJzdmdfMSIgZD0ibTYwLjIyLDExMy44MWE0LjU0LDQuNTQgMCAwIDEgMCw5LjA3YTYwLjIzLDYwLjIzIDAgMSAxIDI5LjQ5LC0xMTIuNzJsLTEuMjYsLTMuM2E1LjA2LDUuMDYgMCAxIDEgOS40NSwtMy42bDUsMTMuMTVhNSw1IDAgMCAxIDAuMzIsMS41NWE1LDUgMCAwIDEgLTMuNTEsNS42NGwtMTMuNDQsNC4xMmE1LDUgMCAwIDEgLTIuOTIsLTkuNjVsMS4yOCwtMC4zOWE1MC41NSw1MC41NSAwIDAgMCAtMTAuMTksLTQuMTlhNTEuMTcsNTEuMTcgMCAxIDAgLTE0LjIyLDEwMC4zMnptLTI0LjM5LC0yMi41OWwyLjE3LC0xOC41NGw0LjU0LDBsMy44MiwxM2wzLjgyLC0xM2w0LjQ5LDBsMi4yMiwxOC41NGwtNC42NCwwbC0xLjQzLC0xMS45M2wwLjcsMGwtMi45MiwxMS45M2wtNC41NCwwbC0yLjk0LC0xMS45MWwwLjc3LDBsLTEuNCwxMS45M2wtNC42NiwtMC4wMnptMjQsMGwwLC0xOC41NGw0Ljg0LDBsMCwxOC41NGwtNC44NCwwem04LjIxLDBsMCwtMTguNTRsMy44NCwwbDYuNDcsMTAuMzJsMCwtMTAuMzJsNC44NCwwbDAsMTguNTRsLTMuODQsMGwtNi41MiwtMTAuMzNsMCwxMC4zM2wtNC43OSwwem0tMjAuMTgsLTI0LjIyYTEwLjA4LDEwLjA4IDAgMCAxIC00Ljc3LC0xYTYuMzcsNi4zNyAwIDAgMSAtMi44NCwtM2ExMC40NSwxMC40NSAwIDAgMSAtMC45MiwtNC41NmwwLC0xNC4zMWExMC44MiwxMC44MiAwIDAgMSAxLC00Ljg4YTYuNzUsNi43NSAwIDAgMSAyLjkyLC0zYTkuODgsOS44OCAwIDAgMSA0LjY3LC0xbDYuOCwwYTkuMDgsOS4wOCAwIDAgMSA0LjQ4LDFhNi42Niw2LjY2IDAgMCAxIDIuNzgsM2ExMS4yNywxMS4yNyAwIDAgMSAwLjk0LDQuODhsMCwxNC4zM2E4LjcxLDguNzEgMCAwIDEgLTIuMTIsNi4yMmE3LjkzLDcuOTMgMCAwIDEgLTYuMTMsMi4zMmwtNi44MSwwem0yLC03LjMxbDIuNTQsMGEyLjEsMi4xIDAgMCAwIDIuMzYsLTIuNDRsMCwtMTIuMjVhMi41LDIuNSAwIDAgMCAtMC41OSwtMmEyLjE5LDIuMTkgMCAwIDAgLTEuNDMsLTAuNDhsLTMuMTUsMGEyLDIgMCAwIDAgLTEuNiwwLjU5YTIuNzgsMi43OCAwIDAgMCAtMC41MSwxLjg5bDAsMTIuMTZhMi42LDIuNiAwIDAgMCAwLjU5LDEuOTFhMi41NCwyLjU0IDAgMCAwIDEuODEsMC41N2wtMC4wMiwwLjA1em0yMS42Nyw3LjAxbDAsLTIzLjdsLTUsMGwwLC01LjI2bDUuODksLTIuNTNsNy4yMywwbDAsMzEuNDlsLTguMTIsMHptMzkuNjksLTM2Ljk0Yy0zLjUyLC01LjI5IC0xMS42NSwtMC42NSAtOC41Nyw1LjIxbDAuMTQsMC4yMmE1MCw1MCAwIDAgMSA0LjIxLDguMDhhNSw1IDAgMSAwIDkuMjgsLTMuODNhNjEuMDgsNjEuMDggMCAwIDAgLTUuMDcsLTkuNjhsMC4wMSwwem0tMzMuOTUsODAuNzFhNSw1IDAgMSAwIDMuMzYsOS40NmE2MC4yOSw2MC4yOSAwIDAgMCA5Ljk0LC00LjU1YTUsNSAwIDAgMCAtNSwtOC43YTU1LjUyLDU1LjUyIDAgMCAxIC04LjMsMy43OXptMjIuMTMsLTE1LjQ3Yy0zLjY2LDQuNDQgMi4wOSwxMC44NiA3LjA4LDdhNS4zNyw1LjM3IDAgMCAwIDAuNzEsLTAuNzJhNjQuMTksNjQuMTkgMCAwIDAgNi4xMSwtOS4wNmE1LDUgMCAwIDAgLTguNDgsLTUuMzRhNzcuNSw3Ny41IDAgMCAxIC01LjQyLDguMTJ6bTEwLjg4LC0yNC44MWE1LDUgMCAwIDAgOS42MywyLjU4YTQuODMsNC44MyAwIDAgMCAwLjMsLTEuMTNhNjAuMjgsNjAuMjggMCAwIDAgMC42NCwtMTAuOWMtMC4yOCwtNi4xOSAtOS40MSwtNi42MyAtMTAsLTAuMTJsMCwwLjgyYTUyLjI4LDUyLjI4IDAgMCAxIC0wLjU1LDguNzVsLTAuMDIsMHoiLz4KIDwvZz4KPC9zdmc+)  !important;
          }
          .fwdten {
            background-image:url(data:image/png;base64,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)  !important;
          }
          .backfive {
            background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwLjg4IiBoZWlnaHQ9IjEyMi44OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogPHRpdGxlPjEtbWludXRlczwvdGl0bGU+CgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxwYXRoIGZpbGw9IiNmZmZmZmYiIGlkPSJzdmdfMSIgZD0ibTYwLjIyLDExMy44MWE0LjU0LDQuNTQgMCAwIDEgMCw5LjA3YTYwLjIzLDYwLjIzIDAgMSAxIDI5LjQ5LC0xMTIuNzJsLTEuMjYsLTMuM2E1LjA2LDUuMDYgMCAxIDEgOS40NSwtMy42bDUsMTMuMTVhNSw1IDAgMCAxIDAuMzIsMS41NWE1LDUgMCAwIDEgLTMuNTEsNS42NGwtMTMuNDQsNC4xMmE1LDUgMCAwIDEgLTIuOTIsLTkuNjVsMS4yOCwtMC4zOWE1MC41NSw1MC41NSAwIDAgMCAtMTAuMTksLTQuMTlhNTEuMTcsNTEuMTcgMCAxIDAgLTE0LjIyLDEwMC4zMnptLTI0LjM5LC0yMi41OWwyLjE3LC0xOC41NGw0LjU0LDBsMy44MiwxM2wzLjgyLC0xM2w0LjQ5LDBsMi4yMiwxOC41NGwtNC42NCwwbC0xLjQzLC0xMS45M2wwLjcsMGwtMi45MiwxMS45M2wtNC41NCwwbC0yLjk0LC0xMS45MWwwLjc3LDBsLTEuNCwxMS45M2wtNC42NiwtMC4wMnptMjQsMGwwLC0xOC41NGw0Ljg0LDBsMCwxOC41NGwtNC44NCwwem04LjIxLDBsMCwtMTguNTRsMy44NCwwbDYuNDcsMTAuMzJsMCwtMTAuMzJsNC44NCwwbDAsMTguNTRsLTMuODQsMGwtNi41MiwtMTAuMzNsMCwxMC4zM2wtNC43OSwwem0tMjAuMTgsLTI0LjIyYTEwLjA4LDEwLjA4IDAgMCAxIC00Ljc3LC0xYTYuMzcsNi4zNyAwIDAgMSAtMi44NCwtM2ExMC40NSwxMC40NSAwIDAgMSAtMC45MiwtNC41NmwwLC0xNC4zMWExMC44MiwxMC44MiAwIDAgMSAxLC00Ljg4YTYuNzUsNi43NSAwIDAgMSAyLjkyLC0zYTkuODgsOS44OCAwIDAgMSA0LjY3LC0xbDYuOCwwYTkuMDgsOS4wOCAwIDAgMSA0LjQ4LDFhNi42Niw2LjY2IDAgMCAxIDIuNzgsM2ExMS4yNywxMS4yNyAwIDAgMSAwLjk0LDQuODhsMCwxNC4zM2E4LjcxLDguNzEgMCAwIDEgLTIuMTIsNi4yMmE3LjkzLDcuOTMgMCAwIDEgLTYuMTMsMi4zMmwtNi44MSwwem0yLC03LjMxbDIuNTQsMGEyLjEsMi4xIDAgMCAwIDIuMzYsLTIuNDRsMCwtMTIuMjVhMi41LDIuNSAwIDAgMCAtMC41OSwtMmEyLjE5LDIuMTkgMCAwIDAgLTEuNDMsLTAuNDhsLTMuMTUsMGEyLDIgMCAwIDAgLTEuNiwwLjU5YTIuNzgsMi43OCAwIDAgMCAtMC41MSwxLjg5bDAsMTIuMTZhMi42LDIuNiAwIDAgMCAwLjU5LDEuOTFhMi41NCwyLjU0IDAgMCAwIDEuODEsMC41N2wtMC4wMiwwLjA1em0yMS42Nyw3LjAxbDAsLTIzLjdsLTUsMGwwLC01LjI2bDUuODksLTIuNTNsNy4yMywwbDAsMzEuNDlsLTguMTIsMHptMzkuNjksLTM2Ljk0Yy0zLjUyLC01LjI5IC0xMS42NSwtMC42NSAtOC41Nyw1LjIxbDAuMTQsMC4yMmE1MCw1MCAwIDAgMSA0LjIxLDguMDhhNSw1IDAgMSAwIDkuMjgsLTMuODNhNjEuMDgsNjEuMDggMCAwIDAgLTUuMDcsLTkuNjhsMC4wMSwwem0tMzMuOTUsODAuNzFhNSw1IDAgMSAwIDMuMzYsOS40NmE2MC4yOSw2MC4yOSAwIDAgMCA5Ljk0LC00LjU1YTUsNSAwIDAgMCAtNSwtOC43YTU1LjUyLDU1LjUyIDAgMCAxIC04LjMsMy43OXptMjIuMTMsLTE1LjQ3Yy0zLjY2LDQuNDQgMi4wOSwxMC44NiA3LjA4LDdhNS4zNyw1LjM3IDAgMCAwIDAuNzEsLTAuNzJhNjQuMTksNjQuMTkgMCAwIDAgNi4xMSwtOS4wNmE1LDUgMCAwIDAgLTguNDgsLTUuMzRhNzcuNSw3Ny41IDAgMCAxIC01LjQyLDguMTJ6bTEwLjg4LC0yNC44MWE1LDUgMCAwIDAgOS42MywyLjU4YTQuODMsNC44MyAwIDAgMCAwLjMsLTEuMTNhNjAuMjgsNjAuMjggMCAwIDAgMC42NCwtMTAuOWMtMC4yOCwtNi4xOSAtOS40MSwtNi42MyAtMTAsLTAuMTJsMCwwLjgyYTUyLjI4LDUyLjI4IDAgMCAxIC0wLjU1LDguNzVsLTAuMDIsMHoiLz4KIDwvZz4KPC9zdmc+) !important;
          }
          .backten {
            background-image:url(data:image/png;base64,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)  !important;
          }
          .hide-timeline .runtime
          {
            display: none !important;
          }
          .hide-timeline .bar
          {
            display: none !important;
          }
        `;

        let show = false;
        const buttons = player.querySelector('.settings')
        const middlebuttons = player.querySelector('.playback');

        const fwdfive = document.createElement('button');
        fwdfive.classList.add('vjs-button','vjs-control','fwdfive');
        fwdfive.onclick = evt => {
            jumpforward();
        }

        const backfive = document.createElement('button');
        backfive.classList.add('vjs-button','backfive');
        backfive.onclick = evt => {
            jumpbackward();
        }

        const backten = document.createElement('button');
        backten.classList.add('vjs-button','vjs-control','backten');
        backten.onclick = evt => {
            jumpbackwardten();
        }

        const fwdten = document.createElement('button');
        fwdten.classList.add('vjs-button','vjs-control','fwdten');
        fwdten.onclick = evt => {
            jumpforwardten();
        }

        const toggle = document.createElement('button');
        toggle.classList.add('vjs-button','vjs-control','toggle-timeline');
        toggle.onclick = evt => {
            show = !show;
            if (show) {
                container.classList.remove('hide-timeline');
            } else {
                container.classList.add('hide-timeline');
            }
        }

        const timejump = document.createElement('button');
        timejump.classList.add('vjs-button','vjs-control','timejump');
        timejump.onclick = evt => {
            let text = "";
			let relative = false;
            let negative = false;
            let totalsecs = 0;
            let timestring = prompt("Please enter amount of time to skip, eg 1h37m59s or +5m or -5m30s:", "");
            if (timestring == null || timestring == "") {
                text = "User cancelled the prompt.";
            } else {
                if (timestring.startsWith("-")) {
                    const timeArray = timestring.split("-");
                    negative = true;
					relative = true;
                    timestring = timeArray[1];
                }
				if (timestring.startsWith("+")) {
                    const timeArray = timestring.split("+");
                    negative = false;
					relative = true;
                    timestring = timeArray[1];
                }
                if (timestring.includes("h")) {
                    const timeArray = timestring.split("h");
                    let hours = parseInt(timeArray[0]);
                    text = hours + " hours";
                    totalsecs = 3600 * hours;
                    timestring = timeArray[1];
                }
                if (timestring.includes("m")) {
                    const timeArray = timestring.split("m");
                    let mins = parseInt(timeArray[0]);
                    text = text + mins + " mins";
                    totalsecs += 60 * mins;
                    timestring = timeArray[1];
                }
                if (timestring.includes("s")) {
                    const timeArray = timestring.split("s");
                    let secs = parseInt(timeArray[0]);
                    totalsecs += secs;
                    text = text + secs + " secs";
                }
                console.log("Entered time was " + text);
                console.log("Time parsed as " + totalsecs + " secs");
                //var video = document.getElementsByTagName("video")[0];
				if (!relative) {
					video.currentTime = totalsecs;
				} else {
					if (negative) {
						video.currentTime = video.currentTime - totalsecs;
					} else {
						video.currentTime = video.currentTime + totalsecs;
					}
				}
            }
        }

        middlebuttons.prepend(backfive);
        middlebuttons.prepend(backten);
        middlebuttons.append(fwdfive);
        middlebuttons.append(fwdten);
        buttons.prepend(toggle);
        buttons.prepend(timejump);
        window._toggle = toggle;
        window._timejump = timejump;

    }

    waitForKeyElements("STAN-PLAYER", () => {
     setTimeout(init, 1000); // <--- hacky
    });

    function killNode (jNode) {
         jNode.remove ();
    }

})();