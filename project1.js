// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{
    for(var i = 0; i < bgImg.data.length; i+=4)
    {
        fgImg.data
        var alpha = fgOpac + (1-fgOpac) * bgImg.data[i+3];
           if(alpha == 0 || fgImg.data[i+3] == 0)
            {
                bgImg.data = bgImg.data;
            }
            else
            {
            //bgImg.data[i] =  (fgOpac*fgImg.data[i] +(1-fgOpac)*bgImg.data[i+3]*bgImg.data[i])/alpha;
            bgImg.data[i] =  (fgOpac*fgImg.data[i] +(1-fgOpac)*bgImg.data[i+3]*bgImg.data[i])/alpha;        // R value
            bgImg.data[i + 1] =  (fgOpac*fgImg.data[i+1]+(1-fgOpac)*bgImg.data[i+3]*bgImg.data[i+1])/alpha;        // G value
            bgImg.data[i + 2] =  (fgOpac* fgImg.data[i+2]+(1-fgOpac)*bgImg.data[i+3]*bgImg.data[i+2])/alpha;  // B value
            }
    }
    //context.putImageData(fgImg, fgPos.x, fgPos.y);
    //var color = (colorFg*opacityFg+(1-opacityFg)*backgroundColor * alphaBackground)/alpha
    //var alpha = foregroundAlpha + (1-forgroundAlpha)*backgroundAlpha

}
