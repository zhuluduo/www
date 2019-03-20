/**
 * Created by ezgoing on 14/9/2014.
 */

"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    var cropbox_file = function(options_file, el_file){
        var el_file = el_file || $(options_file.imageBox_file),
            obj_file =
            {
                state : {},
                ratio : 1,
                options_file : options_file,
                imageBox_file : el_file,
                thumbBox_file : el_file.find(options_file.thumbBox_file),
                spinner_file : el_file.find(options_file.spinner_file),
                image : new Image(),
                getDataURL_file: function ()
                {
                    var width = this.thumbBox_file.width(),
                        height = this.thumbBox_file.height(),
                        canvas = document.createElement("canvas"),
                        dim = el_file.css('background-position').split(' '),
                        size = el_file.css('background-size').split(' '),
                        dx = parseInt(dim[0]) - el_file.width()/2 + width/2,
                        dy = parseInt(dim[1]) - el_file.height()/2 + height/2,
                        dw = parseInt(size[0]),
                        dh = parseInt(size[1]),
                        sh = parseInt(this.image.height),
                        sw = parseInt(this.image.width);

                    canvas.width = width;
                    canvas.height = height;
                    var context = canvas.getContext("2d");
                    context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                    var imageData = canvas.toDataURL('image/png');

                    return imageData;
                },
                getBlob_file: function()
                {
                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/png;base64,','');
                    var binary = atob(b64);
                       console.log(binary);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return  new Blob([new Uint8Array(array)], {type: 'image/png'});
                },
                zoomIn_file: function ()
                {
                    this.ratio*=1.1;
                    setBackground_file();
                },
                zoomOut_file: function ()
                {
                    this.ratio*=0.9;
                    setBackground_file();
                }
            },
            setBackground_file = function()
            {
                var w =  parseInt(obj_file.image.width)*obj_file.ratio;
                var h =  parseInt(obj_file.image.height)*obj_file.ratio;

                var pw = (el_file.width() - w) / 2;
                var ph = (el_file.height() - h) / 2;

                el_file.css({
                    'background-image': 'url(' + obj_file.image.src + ')',
                    'background-size': w +'px ' + h + 'px',
                    'background-position': pw + 'px ' + ph + 'px',
                    'background-repeat': 'no-repeat'});
            },
            imgMouseDown_file = function(e)
            {
                e.stopImmediatePropagation();

                obj_file.state.dragable = true;
                obj_file.state.mouseX = e.clientX;
                obj_file.state.mouseY = e.clientY;
            },
            imgMouseMove_file = function(e)
            {
                e.stopImmediatePropagation();

                if (obj_file.state.dragable)
                {
                    var x = e.clientX - obj_file.state.mouseX;
                    var y = e.clientY - obj_file.state.mouseY;

                    var bg = el_file.css('background-position').split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    el_file.css('background-position', bgX +'px ' + bgY + 'px');

                    obj_file.state.mouseX = e.clientX;
                    obj_file.state.mouseY = e.clientY;
                }
            },
            imgMouseUp_file = function(e)
            {
            

                if ($("div").hasClass("imageBox")) {
                    console.log('0000000')
                }else if($("div").hasClass("imageBox_info")){
                    console.log('6666')
                }
                console.log(e)
                console.log(e.toElement.className)
            
                e.stopImmediatePropagation();
                obj_file.state.dragable = false;
            
            },
            zoomImage_file = function(e)
            {
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.ratio*=1.1 : obj.ratio*=0.9;
                setBackground_file();
            }

        obj_file.spinner_file.show();
        obj_file.image.onload = function() {
            obj_file.spinner_file.hide();
            setBackground_file();

            el_file.bind('mousedown', imgMouseDown_file);
            el_file.bind('mousemove', imgMouseMove_file);
            $(window).bind('mouseup', imgMouseUp_file);
            el_file.bind('mousewheel DOMMouseScroll', zoomImage_file);
        };
        obj_file.image.src = options_file.imgSrc_file;
        el_file.on('remove', function(){$(window).unbind('mouseup', imgMouseUp_file)});

        return obj_file;
    };

    jQuery.fn.cropbox_file = function(options_file){
        return new cropbox_file(options_file, this);
    };
}));

/*www.jq22.com*/
