"use strict"

function CarthographicGenerator()
{
    
    this.generateToTexture = function(noiseData, thresholds, colors, img, w, h)
    {
        let values = new Array(noiseData.length);

        let colorRgbs = [];
        for(let i  =0; i < colors.length; i++)
        {
            colorRgbs.push(hexToRgb(colors[i]));
        }

        // console.log(colorRgbs);
        for(let i =0 ; i < w ; i++)
        {
            for(let j =0 ; j < h ; j++)
            {
                let v = noiseData[ i*h +j];
                
                let pixel = colorRgbs[0];
                for(let k = thresholds.length - 1; k >= 0; k--)
                {
                    let t = thresholds[k];

                    if(v >= t)
                    {
                        pixel = colorRgbs[k+1];
                        break;
                    }               
                }

                v = v*1.5 + 0.25; // Add a gain
                v = v > 1.0 ? 1.0 : v;

                img.data[i*h*4 + j*4 + 0] = pixel.r * v;
                img.data[i*h*4 + j*4 + 1] = pixel.g * v;
                img.data[i*h*4 + j*4 + 2] = pixel.b * v;
                img.data[i*h*4 + j*4 + 3] = 255;
                
                
            }
        }

    }
}