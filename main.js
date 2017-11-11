"use strict";

// General
let perlinNoiseMaker = new PerlinNoise();
let worldGenerator = new CarthographicGenerator();
let canvasController=  {canvas: null, context: null };
let map = {canvas: null, context: null};
let world = null;
let updateButton = null;
let textureDimension = {width: 512, height: 512};


// Noise
let seed = 
{
    offsetx : 0,
    offsety : 0,
    scalex : 0.05,
    scaley : 0.05,
    persistence: 0.5
};
let octaves = [0, 1, 2, 3];

// World
let worldThreshold = {width: 256, height: 256};
let colors = [];
let thresholds = [];

function init()
{
    canvasController.canvas = document.getElementById("canvas");
    canvasController.context = canvasController.canvas.getContext("2d");

    map.canvas = document.getElementById("map");
    map.context = map.canvas.getContext("2d");

    world = document.getElementById("world");

    let updateButton = document.getElementById("update-button");
    updateButton.addEventListener("click", ()=>
    {
        updateParameters();
        update();
    });

    let randomizeAllButton = document.getElementById("randomize-all-button");
    randomizeAllButton.addEventListener("click", ()=>
    {
        randomizeAll();
        updateParameters();
        update();
    });

    let randomizeNoiseButton = document.getElementById("randomize-noise-button");
    randomizeNoiseButton.addEventListener("click", ()=>
    {
        randomizeNoise();
        updateParameters();
        update();
    });

    let randomizeThresholdsButton = document.getElementById("randomize-thresholds-button");
    randomizeThresholdsButton.addEventListener("click", ()=>
    {
        randomizeThresholds();
        updateParameters();
        update();
    });

    let randomizeColorsButton = document.getElementById("randomize-colors-button");
    randomizeColorsButton.addEventListener("click", ()=>
    {
        randomizeColors();
        updateParameters();
        update();
    });
}

function setImageFromCanvas(canvas, image)
{
    image.src = canvas.toDataURL();
}

function random (min, max)
{
    return min + (max-min) * Math.random();
}

function randomizeNoise()
{
    document.getElementById("persistence-input").value = random(0.4, 0.6) ;
    document.getElementById("offsetx-input").value = random(0, 200);
    document.getElementById("offsety-input").value = random(0, 200);
    document.getElementById("scalex-input").value = random(0.01, 0.1);
    document.getElementById("scaley-input").value = random(0.01, 0.1);
}
function randomizeThresholds()
{
    let firstThreshold = random(0.1, 0.4);
    let diff = random(0.01, 0.2);
    document.getElementById("second-threshold").value = firstThreshold;
    document.getElementById("third-threshold").value = firstThreshold + diff;
}

function randomizeColors()
{
    let getRandomColor = () =>
    {
        let hsb = {h: Math.random(), s: 0.8, b: 0.8, a: 1.0};
        let rgb = Hsb2Rgb(hsb); 
        return  rgbToHex(rgb.r, rgb.g, rgb.b);
    }
    
    document.getElementById("first-color").value = getRandomColor();
    document.getElementById("second-color").value= getRandomColor();
    document.getElementById("third-color").value = getRandomColor();
}

function randomizeAll()
{
    randomizeNoise();
    randomizeThresholds();
    randomizeColors();    
}

function updateParameters()
{
    // Noise parameters
    textureDimension.width = parseFloat(document.getElementById("texture-width-input").value);
    textureDimension.height = parseFloat(document.getElementById("texture-height-input").value);
    seed.persistence = parseFloat(document.getElementById("persistence-input").value);
    seed.offsetx = parseFloat(document.getElementById("offsetx-input").value);
    seed.offsety = parseFloat(document.getElementById("offsety-input").value);
    seed.scalex = parseFloat(document.getElementById("scalex-input").value);
    seed.scaley = parseFloat(document.getElementById("scaley-input").value);
    
    // Octaves
    let newOctaves = [];
    if(document.getElementById("octave0-checkbox").checked)
    {
        newOctaves.push(0);
    }
    if(document.getElementById("octave1-checkbox").checked)
    {
        newOctaves.push(1);
    }
    if(document.getElementById("octave2-checkbox").checked)
    {
        newOctaves.push(2);
    }
    if(document.getElementById("octave3-checkbox").checked)
    {
        newOctaves.push(3);
    }

    // World Parameters
    let color1 = document.getElementById("first-color").value;
    let color2 = document.getElementById("second-color").value;
    let color3 = document.getElementById("third-color").value;

    colors = [color1, color2, color3];

    let threshold1 = document.getElementById("second-threshold").value;
    let threshold2 = document.getElementById("third-threshold").value;
    thresholds = [threshold1, threshold2];

    octaves = newOctaves;
}

function update()
{
    let noiseCanvas = canvasController.canvas;
    let noiseContext = canvasController.context;
    let mapCanvas = map.canvas;
    let mapContext = map.context;

    let w = textureDimension.width;
    let h = textureDimension.height;

    noiseCanvas.width = w;
    noiseCanvas.height = h;
    mapCanvas.width = w;
    mapCanvas.height = h;

    //Noise
    let noiseImage = noiseContext.createImageData(w, h);

    let noiseData = perlinNoiseMaker.getNoiseData(w, h, false, seed, octaves);

    for(let i =0 ; i < w ; i++)
    {
        for(let j =0 ; j < h ; j++)
        {
            let v = noiseData[ i*h +j];
            
            let pixel = v*255.0;
            noiseImage.data[i*h*4 + j*4 + 0] = pixel;
            noiseImage.data[i*h*4 + j*4 + 1] = pixel;
            noiseImage.data[i*h*4 + j*4 + 2] = pixel;
            noiseImage.data[i*h*4 + j*4 + 3] = 255;
        }
    }
    noiseContext.putImageData(noiseImage,0,0);

    // World
    let mapImage = mapContext.createImageData(w, h);
    worldGenerator.generateToTexture(noiseData, thresholds, colors, mapImage, w, h);
    mapContext.putImageData(mapImage, 0, 0);

    setImageFromCanvas(mapCanvas, world);    
}


window.addEventListener("load", function()
{
	 init();
});