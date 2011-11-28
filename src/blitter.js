var Blitter = function(options) {
    
    var target = options.target || null;
    var resource = options.resource || "test.png"
    var width = options.width || 100;
    var height = options.height || 100;
    var frameRate = options.frameRate || 33;
    var autoplay = options.autoplay || true;
    
    var useCanvas = false;
    var image = new Image();
    var context;
    var interval;
    var rows;
    var cols;
    var frames;
    var currentFrame;
    var self = this;
    
    // =======================
    // PUBLIC
    // =======================
    this.stop = function() {
        clearInterval(interval);
    }
    
    this.start = function() {
        self.stop();
        interval = setInterval(render, 1000 / frameRate);
    }
    
    this.getContainer = function() {
        return target;
    }
    
    // =======================
    // PRIVATE
    // =======================
    var init = function() {
        if (!target) {
            target = document.createElement("canvas");
            
            if (target.getContext) {
                context = target.getContext("2d");
                useCanvas = true;
            } else {
                target = document.createElement("div");
            }
        }

        if (!useCanvas) {
            target.style.width = width + "px";
            target.style.height = height + "px";
            target.style.backgroundImage = "url(" + resource + ")";
            target.style.backgroundRepeat = "no-repeat";
        }
        
        image.onload = onImageLoaded;
        image.src = resource;
    }       
    
    var onImageLoaded = function() {
        rows = Math.ceil(image.height / height);
        cols = Math.ceil(image.width / width);
        
        frames = rows * cols;
        currentFrame = 0;
        
        autoplay && self.start();
    }
    
    var render = function() {
        
        var x = (currentFrame % cols) * width;
        var y = (~~(currentFrame / cols)) * height;
        
        if (useCanvas) {
            context.clearRect(0, 0, width, height);
            context.drawImage(image, x, y, width, height, 0, 0, width, height); 
        } else {
            target.style.backgroundPosition = -x + "px " + y + "px";
        }
        
        currentFrame = (currentFrame + 1) % frames;
    }
    
    init();
}