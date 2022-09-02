// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{
    for(var i = 0; i < bgImg.data.length; i+=4)
    {
        bgImg.data[i + 0] =  bgImg.data[i + 0];        // R value
        bgImg.data[i + 1] =  bgImg.data[i + 1];        // G value
        bgImg.data[i + 2] =  bgImg.data[i + 2];  // B value
        bgImg.data[i + 3] = 0;      // A value
    }
    //var color = (alphafG*opacityFg+(1-opacityFg)*backgroundColor * alphaBackground)/alpha
    //var alpha = foregroundAlpha + (1-forgroundAlpha)*backgroundAlpha

}
