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
    var cropbox_info = function(options_info, el_info){
        var el_info = el_info || $(options_info.imageBox_info),
            obj_info =
            {
                state_info : {},
                ratio_info : 1,
                options_info : options_info,
                imageBox_info : el_info,
                thumbBox_info : el_info.find(options_info.thumbBox_info),
                spinner_info : el_info.find(options_info.spinner_info),
                image : new Image(),
                getDataURL_info: function ()
                {
                    var width = this.thumbBox_info.width(),
                        height = this.thumbBox_info.height(),
                        canvas_info = document.createElement("canvas"),
                        dim = el_info.css('background-position').split(' '),
                        size = el_info.css('background-size').split(' '),
                        dx = parseInt(dim[0]) - el_info.width()/2 + width/2,
                        dy = parseInt(dim[1]) - el_info.height()/2 + height/2,
                        dw = parseInt(size[0]),
                        dh = parseInt(size[1]),
                        sh = parseInt(this.image.height),
                        sw = parseInt(this.image.width);

                    canvas_info.width = width;
                    canvas_info.height = height;
                    var context = canvas_info.getContext("2d");
                    context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                    var imageData = canvas_info.toDataURL('image/png');

                    return imageData;
                },
                getBlob_info: function()
                {
                    var imageData = this.getDataURL_info();
                    var b64 = imageData.replace('data:image/png;base64,','');
                    var binary = atob(b64);
                       console.log(binary);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return  new Blob([new Uint8Array(array)], {type: 'image/png'});
                },
                zoomIn_info: function ()
                {
                    this.ratio_info*=1.1;
                    Background();
                },
                zoomOut_info: function ()
                {
                    this.ratio_info*=0.9;
                    Background();
                }
            },
            Background = function()
            {
                var w =  parseInt(obj_info.image.width)*obj_info.ratio_info;
                var h =  parseInt(obj_info.image.height)*obj_info.ratio_info;

                var pw = (el_info.width() - w) / 2;
                var ph = (el_info.height() - h) / 2;

                el_info.css({
                    'background-image': 'url(' + obj_info.image.src + ')',
                    'background-size': w +'px ' + h + 'px',
                    'background-position': pw + 'px ' + ph + 'px',
                    'background-repeat': 'no-repeat'});
            },
            imgMouseDown_info = function(info_e)
            {
                info_e.stopImmediatePropagation();

                obj_info.state_info.dragable = true;
                obj_info.state_info.mouseX = info_e.clientX;
                obj_info.state_info.mouseY = info_e.clientY;
            },
            imgMouseMove_info = function(info_e)
            {
                info_e.stopImmediatePropagation();

                if (obj_info.state_info.dragable)
                {
                    var x = info_e.clientX - obj_info.state_info.mouseX;
                    var y = info_e.clientY - obj_info.state_info.mouseY;

                    var bg = el_info.css('background-position').split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    el_info.css('background-position', bgX +'px ' + bgY + 'px');

                    obj_info.state_info.mouseX = info_e.clientX;
                    obj_info.state_info.mouseY = info_e.clientY;
                }
            },
            imgMouseUp_info = function(info_e)
            {
                  console.log(info_e)
                console.log('2222')
                info_e.stopImmediatePropagation();
                obj_info.state_info.dragable = false;

            },
            zoomImage_info = function(info_e)
            {
                info_e.originalEvent.wheelDelta > 0 || info_e.originalEvent.detail < 0 ? obj_info.ratio_info*=1.1 : obj_info.ratio_info*=0.9;
                Background();
            }

        obj_info.spinner_info.show();
        obj_info.image.onload = function() {
            obj_info.spinner_info.hide();
            Background();

            el_info.bind('mousedown', imgMouseDown_info);
            el_info.bind('mousemove', imgMouseMove_info);
            $(window).bind('mouseup', imgMouseUp_info);
            el_info.bind('mousewheel DOMMouseScroll', zoomImage_info);
        };
        obj_info.image.src = options_info.imgSrc_info;
        el_info.on('remove', function(){$(window).unbind('mouseup', imgMouseUp_info)});

        return obj_info;
    };

    jQuery.fn.cropbox_info = function(options_info){
        return new cropbox_info(options_info, this);
    };
}));

/*www.jq22.com*/
