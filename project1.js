// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{
    var x = fgPos.x;
    var y = fgPos.y;
    for(var i = 0; i < fgImg.data.length; i+=4)
    {
        var fgRed = fgImg.data[(i - x)];
        var fgGreen =   fgImg.data[(i-x) + 1];
        var fgBlue = fgImg.data[(i-x) + 2];
        var fgAlpha = (fgImg.data[((i-x) + 3)] * fgOpac);
        var bgAlpha = bgImg.data[i + 3];
        var alpha = (fgAlpha) + (1.0 - fgOpac) * bgAlpha;
           if(alpha != 0 && fgAlpha != 0)
            {
                bgImg.data[i] =  (fgAlpha * fgRed + (1.0 - fgOpac) * bgAlpha * bgImg.data[i]) / alpha;        // R value
                bgImg.data[i + 1] =  (fgAlpha * fgGreen + (1.0 - fgOpac) * bgAlpha * bgImg.data[i + 1]) / alpha;        // G value
                bgImg.data[i + 2] =  (fgAlpha * fgBlue + (1.0 - fgOpac) * bgAlpha * bgImg.data[i + 2]) / alpha; // B value
                bgImg.data[i + 3] = alpha;  // A value
            }       
    }
    //context.putImageData(fgImg, fgPos.x, fgPos.y);
    //var color = (colorFg*opacityFg+(1-opacityFg)*backgroundColor * alphaBackground)/alpha
    //var alpha = foregroundAlpha + (1-forgroundAlpha)*backgroundAlpha

}
