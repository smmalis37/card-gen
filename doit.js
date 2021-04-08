// Sizing
const size = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 1000 : 3000;
const ratio = 1.4;

const width = size;
const height = size * ratio;

const edgeCurveThickness = width * 0.05;

const edgeColor = "#ECD9A1";
const outerEdgeThickness = width * 0.003;
const innerEdgeThickness = width * 0.002;

const darkBorder = "#B6922C";
const lightBorder = "#DFCA8D";
const borderGradientCount = 6;
const borderThickness = width * 0.04;

const innerBackground = "#1E1700";

const trapSize = width * 0.1;
const trapX = width * 0.1;
const trapY = height - borderThickness - outerEdgeThickness;

const textSize = width * 0.032;
const textColor = "#E8B011";
const textStyle = "italic " + textSize + "px sans-serif";

const descriptionX = width * 0.65;
const descriptionStartY = height * 0.094;
const descriptionSpacing = width * 0.005;

const statsX = width * 0.55;
const statsStartY = height * 0.33;
const statsInnerSpacing = width * 0.012;
const statsOuterSpacing = width * 0.069;

const nameY = trapY - (trapSize * 4 / 9);
const nameSize = width * 0.05;
const nameStyle = "bolder " + nameSize + "px sans-serif";
const nameBorderThickness = width * 0.006;
const nameBorderColor = "#E5E5E5";

const diamondXOffset = width * 0.045;

const diamondLength = width * 0.029;
const diamondSlant = width * 0.01;
const diamondShadowOffset = width * 0.004;
const diamondColor = "#EDD817";
const diamondBorder = width * 0.002;

const logoStartX = width * 0.06;
const logoStartY = logoStartX;
const logoSize = width * 0.17;

const imageStartY = height * 0.275;
const imageStartX = width * 0.1;
const imageWidth = (width * 0.5) - imageStartX;

function drawRoundRect(ctx, edgeProgress) {
    ctx.lineJoin = "round";
    ctx.strokeRect(edgeProgress, edgeProgress, width - (edgeProgress * 2), height - (edgeProgress * 2));
}

function update(e) {
    const canvas = document.getElementById("output");
    const ctx = canvas.getContext("2d");

    const h = window.innerHeight - 40; // todo extract 40 to find css margin itself
    const w = h / ratio;
    canvas.style.height = h + "px";
    canvas.style.width = w + "px";

    const scale = window.devicePixelRatio;
    canvas.width = width * scale;
    canvas.height = height * scale;

    ctx.scale(scale, scale);

    ctx.lineWidth = edgeCurveThickness;
    var edgeProgress = edgeCurveThickness / 2;

    // Outer edge
    ctx.strokeStyle = edgeColor;
    drawRoundRect(ctx, edgeProgress);
    edgeProgress += outerEdgeThickness;

    // Gradient border
    const borderGradientAdjust = 1 / (borderGradientCount * 2);
    var borderGradient = ctx.createLinearGradient(0, 0, height, height);
    for (var i = 0; i < borderGradientCount; i++) {
        borderGradient.addColorStop(i / borderGradientCount, darkBorder);
        borderGradient.addColorStop((i + 0.5) / borderGradientCount, lightBorder);
    }
    borderGradient.addColorStop(1, darkBorder);
    ctx.strokeStyle = borderGradient;
    drawRoundRect(ctx, edgeProgress);
    edgeProgress += borderThickness;

    // Inner edge
    ctx.strokeStyle = edgeColor;
    drawRoundRect(ctx, edgeProgress);
    edgeProgress += innerEdgeThickness;

    // Background
    ctx.strokeStyle = innerBackground;
    drawRoundRect(ctx, edgeProgress);

    ctx.fillStyle = innerBackground;
    ctx.fillRect(edgeProgress, edgeProgress, width - (edgeProgress * 2), height - (edgeProgress * 2));

    // Trapezoid
    ctx.fillStyle = borderGradient;
    ctx.beginPath();
    ctx.moveTo(trapX, trapY + 1);
    ctx.lineTo(trapX + trapSize, trapY - trapSize);
    ctx.lineTo(width - trapX - trapSize, trapY - trapSize);
    ctx.lineTo(width - trapX, trapY + 1);
    ctx.fill();

    // Trapezoid border
    ctx.lineWidth = innerEdgeThickness;
    ctx.lineJoin = "miter";
    ctx.strokeStyle = edgeColor;
    ctx.beginPath();
    ctx.moveTo(trapX, trapY);
    ctx.lineTo(trapX + trapSize, trapY - trapSize);
    ctx.lineTo(width - trapX - trapSize, trapY - trapSize);
    ctx.lineTo(width - trapX, trapY);
    ctx.stroke();

    // Text setup
    ctx.fillStyle = textColor;
    ctx.font = textStyle;

    // Description positioning
    var descriptionY = descriptionStartY;
    const textMeasure = ctx.measureText("Ig");
    const descriptionHeight = textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent + descriptionSpacing;

    // Description text
    const descriptions = document.getElementsByClassName("description");
    for (const label of descriptions) {
        ctx.textAlign = "right";
        ctx.fillText(label.innerText + " ", descriptionX, descriptionY);

        ctx.textAlign = "left";
        ctx.fillText(document.getElementById(label.htmlFor).value, descriptionX, descriptionY);
        descriptionY += descriptionHeight;
    }

    // Stats positioning
    ctx.textAlign = "left";
    var statsY = statsStartY;

    // Stats
    const stats = document.getElementsByClassName("stat");
    for (const label of stats) {
        ctx.fillStyle = textColor;
        ctx.fillText(label.innerText.slice(0, -1).toUpperCase(), statsX, statsY);
        statsY += statsInnerSpacing;

        const count = document.getElementById(label.htmlFor).value;
        var diamondX = statsX + diamondXOffset;
        for (var i = 0; i < 5; i++) {
            drawDiamond(ctx, diamondX, statsY, i < count);
            diamondX += diamondXOffset;
        }

        statsY += statsOuterSpacing + textMeasure.actualBoundingBoxAscent;
    }

    // Trapezoid name
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.lineWidth = nameBorderThickness;
    ctx.lineJoin = "miter";
    ctx.miterLimit = 5;
    ctx.strokeStyle = nameBorderColor;
    ctx.textBaseline = "middle";
    ctx.font = nameStyle;
    const name = document.getElementById("name").value.toUpperCase();
    ctx.strokeText(name, width / 2, nameY);
    ctx.fillText(name, width / 2, nameY);

    // Logo
    const logoPath = document.getElementById("logo").files[0];
    if (logoPath) {
        const char = new Image();
        char.src = URL.createObjectURL(logoPath);
        char.decode().then(() => {
            ctx.drawImage(char, logoStartX, logoStartY, logoSize, logoSize);
        });
    }

    // Character
    const charPath = document.getElementById("file").files[0];
    if (charPath) {
        const char = new Image();
        char.src = URL.createObjectURL(charPath);
        char.decode().then(() => {
            ctx.drawImage(char, imageStartX, imageStartY, imageWidth, statsY - imageStartY);
        });
    }
}

function drawDiamond(ctx, x, y, isYellow) {
    ctx.fillStyle = isYellow ? diamondColor : "black";
    ctx.shadowColor = "white";
    ctx.shadowOffsetX = diamondShadowOffset;
    ctx.shadowOffsetY = diamondShadowOffset;
    ctx.beginPath();
    ctx.moveTo(x, y + diamondLength);
    ctx.lineTo(x + diamondLength, y + diamondLength);
    ctx.lineTo(x + diamondLength + diamondSlant, y);
    ctx.lineTo(x + diamondSlant, y);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.lineJoin = "miter";
    ctx.lineWidth = diamondBorder;
    ctx.strokeStyle = "white";
    ctx.stroke();
}
