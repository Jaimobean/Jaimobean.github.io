///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console. Hello
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                if (chr === String.fromCharCode(9)) { //tab

                    //get full command
                    var fullCommand = _OsShell.tabPressed(this.buffer);

                    //get the buffer length
                    var bufflength = this.buffer.length;

                    //clear from canvas
                    var deleteoffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.substr(0, bufflength));
                    _DrawingContext.clearRect(this.currentXPosition - CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer.substr(0, bufflength -1)), this.currentYPosition - 14, 18, 18);

                    //change current x position because ALAN didn't do it for us.
                    this.currentXPosition = this.currentXPosition - deleteoffset;

                    //clear partial command from buffer
                    this.buffer = "";

                    //put full command in queue
                    _KernelInputQueue.enqueue(fullCommand);

                }
                else if (chr === String.fromCharCode(8)) { //backspace
                    //get the buffer length
                    var bufflength = this.buffer.length;

                    //clear from canvas
                    var deleteoffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.substr(bufflength - 1, bufflength));
                    _DrawingContext.clearRect(this.currentXPosition - CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer.substr(bufflength - 1, bufflength)), this.currentYPosition - 14, 18, 18);

                    //change current x position because ALAN didn't do it for us.
                    this.currentXPosition = this.currentXPosition - deleteoffset;

                    //clear from buffer
                    this.buffer = this.buffer.substr(0, bufflength - 1);


                }
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                else if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...

                    //add command to array of previous commands
                    _PreviousCommand.push(this.buffer);

                    //set value of command index = to length of the array minus 1
                    _CommandIndex = _PreviousCommand.length -1;

                    //finally handle the input
                    _OsShell.handleInput(this.buffer);

                    // ... and reset our buffer.
                    this.buffer = "";
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.



                if (text !== "") {
                    var stringlength = text.length;
                    for (var z = 1; z <= stringlength; z++) {
                        var currentletter = text.substring(z-1, z);

                        if (this.currentXPosition > 490) {

                            this.advanceLine();
                            this.currentXPosition = 0;
                            //.currentYPosition += _DefaultFontSize +
                            //    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                            //    _FontHeightMargin;

                        }
                        // Draw the text at the current X and Y coordinates.
                        _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition,currentletter );
                        // Move the current X position.
                        var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, currentletter);
                        this.currentXPosition = this.currentXPosition + offset;
                    }



                }
         }


        public deleteLine() {
            var bufflength = this.buffer.length;

            //clear from canvas
            var deleteoffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.substr(0, bufflength));
            _DrawingContext.clearRect(_DefaultFontSize, this.currentYPosition - 14, 100, 100);

            //clear from buffer
            this.buffer = "";
            this.currentXPosition = this.currentXPosition - deleteoffset;

        }

        public advanceLine(): void {
            this.currentXPosition = 0;

            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */

            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;

            //Scrolling: create image data
            var imgData = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);

            //check if y is going off canvas
            if (this.currentYPosition >= _Canvas.height) {


                //clear the screen
                this.clearScreen();

                //reset Y value
                this.currentYPosition = _Canvas.height - _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;

                //redraw img data using negative y value in order to shift image upwards
                _DrawingContext.putImageData(imgData,this.currentXPosition,-(_DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin));

            }
        }
    }
 }
