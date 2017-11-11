"use strict";

function hexToRgb(hex) 
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
    {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) 
{
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function Hsb2Rgb(hsbColor)
{
    let r = hsbColor.b;
    let g = hsbColor.b;
    let b = hsbColor.b;
    if (hsbColor.s != 0)
    {
        let max = hsbColor.b;
        let dif = hsbColor.b * hsbColor.s;
        let min = hsbColor.b - dif;
        
        let h = hsbColor.h * 360;
        
        if (h < 60)
        {
            r = max;
            g = h * dif / 60 + min;
            b = min;
        }
        else if (h < 120)
        {
            r = -(h - 120) * dif / 60 + min;
            g = max;
            b = min;
        }
        else if (h < 180)
        {
            r = min;
            g = max;
            b = (h - 120) * dif / 60 + min;
        }
        else if (h < 240)
        {
            r = min;
            g = -(h - 240) * dif / 60 + min;
            b = max;
        }
        else if (h < 300)
        {
            r = (h - 240) * dif / 60 + min;
            g = min;
            b = max;
        }
        else if (h <= 360)
        {
            r = max;
            g = min;
            b = -(h - 360) * dif / 60 + min;
        }
        else
        {
            r = 0;
            g = 0;
            b = 0;
        }
    }
    
    r = r >= 1 ? 1: r;
    g = g >= 1 ? 1: g;
    b = b >= 1 ? 1: b;

    r = r <= 0 ? 0: r;
    g = g <= 0 ? 0: g;
    b = b <= 0 ? 0: b;

    return {r: parseInt(r*255),
            g: parseInt(g*255),
            b: parseInt(b*255),
            a: hsbColor.a};
}