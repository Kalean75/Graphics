// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{
    var offsetX = fgPos.x * 4;
    var offsetY = fgPos.y * bgImg.width * 4;
    var offset = offsetX + offsetY;
    var maxDrawX = Math.min(fgImg.width, bgImg.width - fgPos.x - 1)*4;
    var fgRed;
    var fgGreen;
    var fgBlue;
    var fgAlpha;
    var bgAlpha;
    var alpha;
    for(var i = 0; i < fgImg.height*4; i+=4)
    {
        for(var j = 0; j <maxDrawX; j+=4)
        {
            var bgIndex = i*bgImg.width + j + offset;
            var fgIndex = i*fgImg.width + j;
            fgRed = fgImg.data[fgIndex]; //foreground red
            fgGreen =   fgImg.data[fgIndex +1]; //foreground green
            fgBlue = fgImg.data[fgIndex+ 2]; //foreground blue
            fgAlpha = (fgImg.data[fgIndex+ 3] * fgOpac)/255; //foreground alpha
            bgAlpha = bgImg.data[bgIndex + 3]/255; //background alpha
            alpha = fgAlpha + (1.0 - fgAlpha) * bgAlpha; //composite alpha

            //Adjust RGB of background image
            //[R,G,B,A]
            bgImg.data[bgIndex] =  (fgAlpha * fgRed + (1.0 - fgAlpha) * bgAlpha * bgImg.data[bgIndex]) / alpha;        // R value
            bgImg.data[bgIndex+ 1] =  (fgAlpha * fgGreen + (1.0 - fgAlpha) * bgAlpha * bgImg.data[bgIndex +1]) / alpha;        // G value
            bgImg.data[bgIndex+ 2] =  (fgAlpha * fgBlue + (1.0 - fgAlpha) * bgAlpha * bgImg.data[bgIndex+ 2]) / alpha; // B value
            bgImg.data[bgIndex+ 3] = alpha * 255;  // A value
    
        }
    }
    //var color = (colorFg*opacityFg+(1-opacityFg)*backgroundColor * alphaBackground)/alpha
    //var alpha = foregroundAlpha + (1-forgroundAlpha)*backgroundAlpha

}
