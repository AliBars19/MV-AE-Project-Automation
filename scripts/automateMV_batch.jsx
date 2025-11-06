// -------------------------------------------------------
// FULL AUTOMATION PIPELINE - PHASE 1–6
// Batch Music Video Builder + Renderer
// -------------------------------------------------------
// Author: MV Automation Workflow
// Usage:
//  1. Run main.py to build /jobs/job_001 → job_012
//  2. Open your AE project (must contain comps MAIN, OUTPUT 1-12, LYRIC FONT 1-12, Assets 1-12)
//  3. File → Scripts → Run Script File → select this file
//  4. Pick the /jobs folder → AE builds + renders everything
// -------------------------------------------------------

function main() {
    app.beginUndoGroup("Batch Music Video Build");

    // Ask for the jobs folder
    var jobsFolder = Folder.selectDialog("Select your /jobs folder");
    if (!jobsFolder) return;

    var jsonFiles = jobsFolder.getFiles("*.json");
    if (jsonFiles.length === 0) {
        alert("No job_data.json files found in " + jobsFolder.fsName);
        return;
    }

    for (var i = 0; i < jsonFiles.length; i++) {
        var jobFile = jsonFiles[i];
        jobFile.open("r");
        var jobData = JSON.parse(jobFile.read());
        jobFile.close();

        $.writeln("---------- Building Job " + jobData.job_id + " ----------");

        // Import audio and cover image
        var audioItem = app.project.importFile(new ImportOptions(new File(jobData.audio_trimmed)));
        var imageItem = app.project.importFile(new ImportOptions(new File(jobData.cover_image)));

        // Duplicate MAIN template
        var template = findCompByName("MAIN");
        var newComp = template.duplicate();
        newComp.name = "MV_JOB_" + ("00" + jobData.job_id).slice(-3);

        // Replace placeholders
        replaceLayer(newComp, "AUDIO", audioItem);
        replaceLayer(newComp, "COVER", imageItem);
        updateBackgroundColors(newComp, jobData.colors);

        // --- Lyrics + Markers ---
        var outputComp = findCompByName("OUTPUT " + jobData.job_id);
        var lyricComp = findCompByName("LYRIC FONT " + jobData.job_id);

        var parsed = parseLyricsFile(jobData.lyrics_file);
        pushLyricsToCarousel(lyricComp, parsed.linesArray);
        setAudioMarkersFromTArray(lyricComp, parsed.tAndText);

        // --- Album Art ---
        try {
            var assetsComp = findCompByName("Assets " + jobData.job_id);
            replaceAlbumArt(assetsComp, imageItem);
            $.writeln("✅ Album art replaced for job " + jobData.job_id);
        } catch (e) {
            $.writeln("⚠️ Album art skipped: " + e);
        }

        // --- Add to Render Queue ---
        try {
            var renderPath = addToRenderQueue(outputComp, jobData.job_folder, jobData.job_id);
            $.writeln("✅ Queued render for job " + jobData.job_id + ": " + renderPath);
        } catch (e) {
            $.writeln("⚠️ Render queue error for job " + jobData.job_id + ": " + e);
        }

        // --- Save project copy ---
        try {
            var savedPath = saveProjectForJob(jobData.job_folder, jobData.job_id);
            $.writeln("💾 Saved AE project for job " + jobData.job_id + ": " + savedPath);
        } catch (e) {
            $.writeln("⚠️ Project save skipped: " + e);
        }
    }

    // --- Render everything ---
    app.project.renderQueue.render();
    alert("🎬 All " + jsonFiles.length + " jobs rendered successfully!");

    app.endUndoGroup();
}

// -------------------------------------------------------
// Helper Functions
// -------------------------------------------------------

function replaceLayer(comp, name, newItem) {
    for (var i = 1; i <= comp.numLayers; i++) {
        if (comp.layer(i).name === name) {
            comp.layer(i).replaceSource(newItem, false);
            return;
        }
    }
}

function updateBackgroundColors(comp, colors) {
    for (var i = 1; i <= comp.numLayers; i++) {
        var lyr = comp.layer(i);
        if (lyr.property("Effects") && lyr.property("Effects")("4-Color Gradient")) {
            var effect = lyr.property("Effects")("4-Color Gradient");
            for (var j = 0; j < colors.length; j++) {
                effect.property("Color " + (j + 1)).setValue(hexToRGB(colors[j]));
            }
        }
    }
}

function hexToRGB(hex) {
    hex = hex.replace("#", "");
    return [
        parseInt(hex.substring(0, 2), 16) / 255,
        parseInt(hex.substring(2, 4), 16) / 255,
        parseInt(hex.substring(4, 6), 16) / 255
    ];
}

function findCompByName(name) {
    for (var i = 1; i <= app.project.numItems; i++) {
        var it = app.project.item(i);
        if (it instanceof CompItem && it.name === name) return it;
    }
    throw new Error("Comp not found: " + name);
}

function readTextFile(p) {
    var f = new File(p);
    f.open("r");
    var t = f.read();
    f.close();
    return t;
}

function parseLyricsFile(p) {
    var raw = readTextFile(p);
    var data = JSON.parse(raw);
    var linesArray = [], tAndText = [];
    for (var i = 0; i < data.length; i++) {
        var cur = String(data[i].lyric_current || data[i].cur || "");
        linesArray.push(cur);
        tAndText.push({ t: Number(data[i].t || 0), cur: cur });
    }
    return { linesArray: linesArray, tAndText: tAndText };
}

function replaceLyricArrayInLayer(layer, linesArray) {
    var lines = linesArray.map(function(l) {
        return '"' + l.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    });
    var newBlock = "var lyrics = [\n" + lines.join(",\n") + "\n];";
    var prop = layer.property("Source Text");
    var expr = prop.expression;
    var re = /var\s+lyrics\s*=\s*\[[\s\S]*?\];/;
    prop.expression = re.test(expr) ? expr.replace(re, newBlock) : newBlock + "\n" + expr;
}

function pushLyricsToCarousel(comp, arr) {
    var names = ["LYRIC PREVIOUS", "LYRIC CURRENT", "LYRIC NEXT 1", "LYRIC NEXT 2"];
    for (var i = 0; i < names.length; i++) {
        replaceLyricArrayInLayer(comp.layer(names[i]), arr);
    }
}

function clearAllMarkers(layer) {
    var mk = layer.property("Marker");
    for (var i = mk.numKeys; i >= 1; i--) mk.removeKey(i);
}

function setAudioMarkersFromTArray(comp, arr) {
    var audio = comp.layer("AUDIO");
    var mk = audio.property("Marker");
    clearAllMarkers(audio);
    var lastT = 0;
    for (var i = 0; i < arr.length; i++) {
        var mv = new MarkerValue(arr[i].cur || "LYRIC_" + (i + 1));
        mk.setValueAtTime(arr[i].t, mv);
        if (arr[i].t > lastT) lastT = arr[i].t;
    }
    if (lastT + 2 > comp.duration) comp.duration = lastT + 2;
}

function replaceAlbumArt(assetComp, newImage) {
    for (var i = 1; i <= assetComp.numLayers; i++) {
        var lyr = assetComp.layer(i);
        if (lyr.source && lyr.source instanceof FootageItem) {
            var n = lyr.source.name.toLowerCase();
            if (n.indexOf(".jpg") !== -1 || n.indexOf(".png") !== -1) {
                lyr.replaceSource(newImage, false);
                return;
            }
        }
    }
}

function addToRenderQueue(comp, jobFolder, jobId) {
    var root = new Folder(jobFolder).parent;
    var renderDir = new Folder(root.fsName + "/renders");
    if (!renderDir.exists) renderDir.create();
    var outPath = renderDir.fsName + "/job_" + ("00" + jobId).slice(-3) + ".mp4";
    var outFile = new File(outPath);
    var rq = app.project.renderQueue.items.add(comp);
    try { rq.applyTemplate("Best Settings"); } catch (_) {}
    try { rq.outputModule(1).applyTemplate("H.264"); } catch (_) {}
    rq.outputModule(1).file = outFile;
    return outPath;
}

function saveProjectForJob(jobFolder, jobId) {
    var root = new Folder(jobFolder).parent;
    var projDir = new Folder(root.fsName + "/projects");
    if (!projDir.exists) projDir.create();
    var projPath = projDir.fsName + "/MV_JOB_" + ("00" + jobId).slice(-3) + ".aep";
    app.project.save(new File(projPath));
    return projPath;
}

// -------------------------------------------------------
main();
