// ALL VARIABLE AND CONSTANT DECLARATIONS ARE
// MADE AT THE TOP OF THIS FILE

// FIRST THE CONSTANTS, WHICH ARE THINGS THAT NEVER
// CHANGE AND ARE USED FOR INITIALIZATION AND
// RESETTING OF GAME CONTROL SETTINGS

// FIRST FOR INITIALIZING THE CANVAS
var MIN_CANVAS_DIM;
var MAX_CANVAS_DIM;
var CANVAS_STEP;

// THESE ARE FOR INITIALIZING THE FPS SLIDER
var FPS_MIN;
var FPS_MAX;
var FPS_STEP;
var FPS_INIT;

// THESE ARE FOR INITIALIZING POSITION CONTROLS
var XY_MIN;
var XY_MAX;
var XY_INIT;
var XY_STEP;

// INITIAL WHIZZLE VELOCITY
var V_INIT;

// requirement 6 --- for initializing thickness
// control
var THICKNESS_MIN;
var THICKNESS_MAX;
var THICKNESS_INIT;
var THICKNESS_STEP;

// TYPES OF WHIZZLES
var ELLIPSE_WHIZZLE_TYPE;
var RECTANGLE_WHIZZLE_TYPE;
var OUTLINE_WHIZZLE_MODE;
var FILLED_WHIZZLE_MODE;

// WHIZZLE PROPERTIES
var W_TYPE;
var W_MODE;
// requirement 5
var W_COLOR;
// requirement 6
var W_THICKNESS;
var W_WIDTH;
var W_HEIGHT;
var W_X;
var W_Y;
var W_VX;
var W_VY;

// NOW FOR THE VARIABLES, THINGS THAT MAY CHANGE
// DURING THE EXECUTION OF THIS APPLICATION

// CANVAS SETTINGS
var canvasWidth;
var canvasHeight;
var canvas;
var canvas2D;

// TIMER SETTINGS FOR RUNNING, SLOWING DOWN, SPEEDING UP,
// AND PAUSING THE ANIMATION
var timer;
var fps;
var fpsInc;
var millisPerFrame;

// WHIZZLE INITIALIZATION SETTINGS
var xInc;
var yInc;
var xAcc;
var yAcc;
var centerX;
var centerY;
var radius;

// HERE IS OUR ARRAY OF WHIZZLES AND A COUNTER
var whizzles;
var whizzleCounter;

// slider values bug fix --- when slider values are
// retrieved to set whizzle back to its original position, 
// the retrieved values are  3-5 pixels off from the values
// actually displayed on the sliders; use this flag to 
// determine which render method to call so that the bug is
// not discernible
var gameStarted;

/*
 * This function prepares the initial controls and canvas
 * so that the app can run.
 */
function initTheWhizzler()
{
    // INITIALIZE THE THINGS THAT WILL NEVER CHANGE
    initConstants();
    
    // INITIALIZE THE HTML5 RENDERING SURFACE
    initCanvas();
    
    // INITIALIZE THE APPLICATION CONTROLS
    initControls();
    
    // INITIALIZE THE DATA STRUCTURE FOR STORING THE WHIZZLES
    initData();    
}

/**
 * This function initializes all the things that will never change and
 * are used for initializing and resetting controls and other data.
 */
function initConstants()
{
    // 2 TYPES OF WHIZZLES
    ELLIPSE_WHIZZLE_TYPE = "Ellipse";
    RECTANGLE_WHIZZLE_TYPE = "Rectangle";
    
    // 2 MODES OF WHIZZLE RENDERING
    OUTLINE_WHIZZLE_MODE = "Outline";
    FILLED_WHIZZLE_MODE = "Filled";    
    
    // CANVAS DIMENSION BOUNDARIES
    MIN_CANVAS_DIM = 100;
    MAX_CANVAS_DIM = 1400;
    CANVAS_STEP = 100;

    // POSSIBLE WHIZZLE LOCATIONS
    XY_MIN = 0;
    XY_MIN = 0;
    XY_MAX = MAX_CANVAS_DIM;
    XY_MAX = MAX_CANVAS_DIM;    

    // THE INITIAL VELOCITY FOR ALL WHIZZLES FOR BOTH AXES
    V_INIT = 5;

    // FPS INITIALIZION
    FPS_MIN = 1;
    FPS_MAX = 100;
    FPS_STEP = 1;
    FPS_INIT = 30;
    
    // requirement 6 --- thickness initialization
    THICKNESS_MIN = 1;
    THICKNESS_MAX = 32;
    THICKNESS_STEP = 1;
    THICKNESS_INIT = 1;
    
    // WHIZZLE PROPERTIES, THIS HELPS US ACCESS AND CHANGE
    // DATA INSIDE A WHIZZLE
    W_TYPE      = 0;
    W_MODE      = 1;
    W_COLOR     = 2;
    // requirement 6
    W_THICKNESS = 3;
    W_WIDTH     = 4;
    W_HEIGHT    = 5;
    W_X         = 6;
    W_Y         = 7;
    W_VX        = 8;
    W_VY        = 9;

    // INCREMENT FOR SLIDERS
    XY_STEP = 1;
    
    // INITIAL SIZE OF WHIZZLES
    XY_INIT = 50;
}

/*
 * This function initializes the HTML5 canvas so that we 
 * can rendering whizzles to it.
 */
function initCanvas()
{
    canvasWidth = 800;
    canvasHeight = 500;
    canvas = document.getElementById("whizzler_canvas");
    canvas2D = canvas.getContext("2d");
}

/*
 * This function initializes the controls that are available at the
 * start of the app. Note that the whizzle controls are added dynamically
 * as whizzles are added.
 */
function initControls()
{
    // INITIALIZE THE THREE SLIDER CONTROLS
    initSlider("#canvas_width_slider", MIN_CANVAS_DIM, MAX_CANVAS_DIM, CANVAS_STEP, canvasWidth, updateCanvas);
    initSlider("#canvas_height_slider", MIN_CANVAS_DIM, MAX_CANVAS_DIM, CANVAS_STEP, canvasHeight, updateCanvas);
    initSlider("#anim_speed_slider", FPS_MIN, FPS_MAX, FPS_STEP, FPS_INIT, updateSpeed);
    
    // AND THE CUSTOM JSCOLOR CONTROL FOR CHANGING THE
    // CANVAS' BACKGROUND COLOR
    $("#canvas_background_color").change(function(){
        var selectedColor = $("#canvas_background_color").val();
        $("#whizzler_canvas").css("background-color", "#" + selectedColor);
    });
    
    // requirement 2 --- make a button's text get larger when you mouse
    // over it
    $("button").mouseenter(function(){
        $(this).animate({fontSize:'18pt'},"fast");
    });
    $("button").mouseleave(function(){
        $(this).animate({fontSize:'16pt'},"fast");
    });
}

/*
 * Initializes a slider for use. Note that this function accepts
 * the update method as an argument. This is the function that
 * will be called as the user moves the slider. Note that we
 * are using a JQuery Slider. This is a custom UI component
 * provided by the JQuery library.
 * 
 * http://jqueryui.com/slider/
 */
function initSlider(slider, initMin, initMax, initStep, initValue, updateMethod)
{
    // requirement 1
    var sliderParent;
    var sliderTitle;
    var sliderText;
    
    $(slider).slider();
    $(slider).slider({ min: initMin });
    $(slider).slider({ max: initMax });
    $(slider).slider({ step: initStep });
    $(slider).slider({ value: initValue });
    $(slider).slider({
        slide: function(){ 
            updateMethod();
            // requirement 1 --- update the slider value displayed alongside the
           // slider
            if (slider === "#canvas_width_slider")
                {
                    sliderParent = $(this).parent();
                    sliderTitle = sliderParent.find(".toolbar_title");
                    sliderText = "Canvas Width: " + $(this).slider("value");
                    sliderTitle.text(sliderText);
                }
            else if (slider === "#canvas_height_slider")
                {
                    sliderParent = $(this).parent();
                    sliderTitle = sliderParent.find(".toolbar_title");
                    sliderText = "Canvas Height: " + $(this).slider("value");
                    sliderTitle.text(sliderText);
                }
            else if (slider === "#anim_speed_slider")
                {
                    sliderParent = $(this).parent();
                    sliderTitle = sliderParent.find(".toolbar_title");
                    sliderText = "FPS: \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
                                    + $(this).slider("value");
                    sliderTitle.text(sliderText);
                }
        }
    });
    
    // requirement 1 --- display the slider value alongside each slider
    if (slider === "#canvas_width_slider")
        {
            sliderParent = $(slider).parent();
            sliderTitle = sliderParent.find(".toolbar_title");
            sliderText = "Canvas Width: " + $(slider).slider("value");
            sliderTitle.text(sliderText);
        }
    else if (slider === "#canvas_height_slider")
        {
            sliderParent = $(slider).parent();
            sliderTitle = sliderParent.find(".toolbar_title");
            sliderText = "Canvas Height: " + $(slider).slider("value");
            sliderTitle.text(sliderText);
        }
    else if (slider === "#anim_speed_slider")
        {
            sliderParent = $(slider).parent();
            sliderTitle = sliderParent.find(".toolbar_title");
            sliderText = "FPS: \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0" 
                            + $(slider).slider("value");
            sliderTitle.text(sliderText);
        }
}

/* 
 * Initializes data for our app, including the array that will
 * contain all the whizzles.
 */
function initData()
{
    // INIT FRAME RATE STUFF
    fps = FPS_INIT;
    fpsInc = FPS_STEP;
    millisPerFrame = 1000/fps;

    // WE HAVE NOT YET STARTED ANIMATION, SO MAKE THE TIMER NULL,
    // NOTE THAT EVERY TIME WE PAUSE THE TIMER WE'LL NEED TO ALSO
    // MAKE THE TIMER NULL
    timer = null;
    
    // THIS WILL HOLD ALL THE WHIZZLES
    whizzles = new Array();
    whizzleCounter = 0;
    
    // slider values bug fix
    gameStarted = false;
}

/*
 * This makes and returns a whizzle, which has a bunch of
 * properties, which can really be anything, but we'll put
 * rendering settings inside.
 */
function Whizzle(initIdNum)
{
    this.properties = new Array();
    this.idNum = initIdNum;
    this.setProperty = function(property, value) {
        this.properties[property] = value;
    };
    this.getProperty = function(property) {
        return this.properties[property];
    };
}

/*
 * Called when the FPS changes, it updates the frame
 * rate and then restarts the timer if the animation
 * is currently running.
 */
function updateSpeed()
{
    // UDPATE THE FPS WITH THE SLIDER VALUE
    fps = $("#anim_speed_slider").slider("value");
    millisPerFrame = 1000/fps;

    // IF THE ANIMATION IS RUNNING, UPDATE THE
    // TIMER WITH THE NEW FRAME RATE
    if (timer !== null)
    {
        clearInterval(timer);
        timer = setInterval(stepSimulation, millisPerFrame);
    }
}

/*
 * Clears all the old whizzles off the screen.
 */
function resetWhizzles()
{
    // slider values bug fix
    gameStarted = false;
    
    canvas2D.clearRect(0, 0, canvas.width, canvas.height);
    
    // bug fix --- make sure animation doesn't start up again
    // after initial canvas clear
    if (timer !== null)
    {
        clearInterval(timer);
        timer = null;
    }
    
    // when whizzles are reset, start them back at their
    // original initial positions as opposed to at the
    // positions they were at when the reset button was
    // clicked
    renderAfterReset();
}

// slider values bug fix
function resetWhizzlesStationary()
{
    canvas2D.clearRect(0, 0, canvas.width, canvas.height);
    
    if (timer !== null)
    {
        clearInterval(timer);
        timer = null;
    }
    
    render();
}

/*
 * Pauses animation.
 */
function pauseWhizzles()
{
    if (timer !== null)
    {
        clearInterval(timer);
        timer = null;
    }
}

/*
 * Starts animation, which causes the stepSimulation method
 * to be called each frame.
 */
function startWhizzles()
{
    // slider values bug fix
    gameStarted = true;
    
    // bug fix --- so that the game doesn't reach a point
    // where it can't be paused
    if (timer === null)
    {
        timer = setInterval(stepSimulation, millisPerFrame);
    }
}

/*
 * Called after canvas settings are changed, it uses the
 * settings in the canvas controls to update the canvas.
 */
function updateCanvas()
{
    canvasWidth = $("#canvas_width_slider").slider("value");
    canvasHeight = $("#canvas_height_slider").slider("value");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    resetWhizzles();
}

/*
 * Called whtn the user presses the Add Whizzle button, it
 * makes all the new controls and puts them in the DOM.
 */
function addWhizzle()
{
    // STOP THE SIMULATION
    if (timer !== null)
    {
        clearInterval(timer);
        timer = null;
    }
    
    // slider values bug fix
    if (gameStarted === true)
    {
        // REST ALL THE WHIZZLES ALREADY RUNNING        
        resetWhizzles();
    }
    else
    {
        resetWhizzlesStationary();
    }

    // LET'S BUILD THE NEWEST WHIZZLE CONTROLS
    
    // FIRST, MAKE A WHIZZLE DIV
    var whizzleId = "" + whizzleCounter;
    // requirement 4; make whizzles able to be dragged and dropped
    $("#whizzles").append("<div id='" + whizzleId + "' class='whizzle' draggable='true' ondragstart='drag(event)' ondragover='allowDrop(event)' ondrop='drop(event)'></div>");
    whizzleId = "#" + whizzleId;
    
    // ADD THE TITLE DIV
    var whizzleDiv = $(whizzleId);
    whizzleDiv.append("<div class='toolbar_title'></div>");
    var toolbarTitleDiv = whizzleDiv.find(".toolbar_title");
    toolbarTitleDiv.text("Whizzle #");
    toolbarTitleDiv.append("<span class='whizzle_id'>" + whizzleCounter + "</span>");
    
    // NOW ADD THE DIV TO HOLD THE MIN, MAX, AND REMOVE BUTTONS
    whizzleDiv.append("<div class='buttons_toolbar'></div>");
    var buttonsDiv = whizzleDiv.find(".buttons_toolbar");
    
    // AND THE MIN BUTTON
    // NOTE THAT THIS BUTTON CURRENTLY DOESN'T DO ANYTHING
    buttonsDiv.append("<button class='min_button'>-</button>");
    // requirement 3 --- add functionality to min button
    var minButton = buttonsDiv.find(".min_button");
    minButton.click(function(){
        collapseWhizzle($(whizzleId));
    });

    // AND THE MAX BUTTON
    // NOTE THAT THIS BUTTON CURRENTLY DOESN'T DO ANYTHING
    buttonsDiv.append("<button class='max_button'>+</button>");
    // requirement 3 --- add functionality to max button
    var maxButton = buttonsDiv.find(".max_button");
    maxButton.click(function(){
        expandWhizzle($(whizzleId));
    });

    // AND THE REMOVE BUTTON
    buttonsDiv.append("<button class='remove_button'>X</button>");
    var removeButton = buttonsDiv.find(".remove_button");
    removeButton.click(function(){
        removeWhizzle($(whizzleId));
    });

    // requirement 2 --- make a button's text get larger when you mouse
    // over it
    $("button").mouseenter(function(){
        $(this).animate({fontSize:'18pt'},"fast");
    });
    $("button").mouseleave(function(){
        $(this).animate({fontSize:'16pt'},"fast");
    });

    // NOW ADD ALL THE WHIZZLE CONTROLS. FIRST THE DIV TO HOLD THEM
    whizzleDiv.append("<div class='whizzle_controls_toolbar'></div>");
    var whizzleControlsDiv = whizzleDiv.find('.whizzle_controls_toolbar');

    // ADD THE WHIZZLE TYPE SELECTION DROP DOWN LISTS
    whizzleControlsDiv.append("<div class='whizzle_toolbar'><div class='whizzle_toolbar_title'>Type:</div><div class='whizzle_toolbar_control'><select class='whizzle_type' name='whizzle_type'><option value='" + ELLIPSE_WHIZZLE_TYPE + "'>" + ELLIPSE_WHIZZLE_TYPE + "</option><option value='" + RECTANGLE_WHIZZLE_TYPE + "'>" + RECTANGLE_WHIZZLE_TYPE + "</option></select></div></div><br />\n");
    whizzleControlsDiv.append("<div class=\"whizzle_toolbar\"><div class=\"whizzle_toolbar_title\">Mode:</div> <div class='whizzle_toolbar_control'><select class='whizzle_mode' name='whizzle_mode'><option value='" + OUTLINE_WHIZZLE_MODE + "'>" + OUTLINE_WHIZZLE_MODE + "</option><option value='" + FILLED_WHIZZLE_MODE + "'>" + FILLED_WHIZZLE_MODE + "</option></select></div></div><br />\n");
    // requirement 5 --- make it so that you can select what color
    // you want the whizzle to be
    var colorId = "color" + whizzleId.substr(1);
    whizzleControlsDiv.append("<div class=\"whizzle_toolbar\"><div class=\"whizzle_toolbar_title\">Color:</div> <div id='colorId' class='whizzle_toolbar_control'></div></div><br />\n");
    var colorDiv = whizzleControlsDiv.find("#colorId");
    var colorInput = document.createElement('input');
    colorInput.value = '009900';
    var colorPickerId = "colorPicker" + whizzleId.substr(1);
    colorInput.id = colorPickerId;
    var col = new jscolor.color(colorInput);
    colorDiv.append(colorInput);
    // requirement 6 --- make it so that you can change the thickness of a whizzle
    whizzleControlsDiv.append("  <div class=\"whizzle_toolbar\"><div class=\"whizzle_toolbar_title\">Thickness: </div> <div class='whizzle_thickness_slider'></div></div><br />\n");
    whizzleControlsDiv.append("  <div class=\"whizzle_toolbar\"><div class=\"whizzle_toolbar_title\">Width: </div> <div class='whizzle_width_slider'></div></div><br />\n");
    whizzleControlsDiv.append("  <div class=\"whizzle_toolbar\"><div class=\"whizzle_toolbar_title\">Height: </div> <div class='whizzle_height_slider'></div></div><br />\n");
    whizzleControlsDiv.append("  <div class=\"whizzle_toolbar\"><div class=\"whizzle_toolbar_title\">Start X: </div> <div class='whizzle_x_slider'></div></div><br />\n");
    whizzleControlsDiv.append("  <div class=\"whizzle_toolbar\"><div class=\"whizzle_toolbar_title\">Start Y: </div> <div class='whizzle_y_slider'></div></div><br />\n");
    whizzleControlsDiv.append("  <div class=\"whizzle_toolbar\"><div class=\"whizzle_toolbar_title\">Start Vx: </div> <div class='whizzle_vX_slider'></div></div><br />\n");
    whizzleControlsDiv.append("  <div class=\"whizzle_toolbar\"><div class=\"whizzle_toolbar_title\">Start Vy: </div> <div class='whizzle_vY_slider'></div></div><br />\n");
    
    // NOW INIT THE SLIDERS THAT WE JUST ADDED
    // requirement 6
    initWhizzleSlider(whizzleDiv.find(".whizzle_thickness_slider"), THICKNESS_MIN, THICKNESS_MAX, THICKNESS_STEP, THICKNESS_INIT);
    initWhizzleSlider(whizzleDiv.find(".whizzle_width_slider"), XY_MIN, XY_MAX/10, XY_STEP, XY_INIT);
    initWhizzleSlider(whizzleDiv.find(".whizzle_height_slider"), XY_MIN, XY_MAX/10, XY_STEP, XY_INIT);
    initWhizzleSlider(whizzleDiv.find(".whizzle_x_slider"),  XY_MIN, canvasWidth, XY_STEP, canvasWidth/2);
    initWhizzleSlider(whizzleDiv.find(".whizzle_y_slider"),  XY_MIN, canvasHeight, XY_STEP, canvasHeight/2);
    initWhizzleSlider(whizzleDiv.find(".whizzle_vX_slider"), XY_MIN, canvasWidth, XY_STEP, V_INIT);    
    initWhizzleSlider(whizzleDiv.find(".whizzle_vY_slider"), XY_MIN, canvasHeight, XY_STEP, V_INIT);

    // requirement 1 --- display the slider value alongside each slider
    var whizzleSlider = whizzleControlsDiv.find(".whizzle_thickness_slider");
    var whizzleSliderParent = whizzleSlider.parent();
    var sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
    var sliderText = "Thickness: \u00a0\u00a0" + whizzleSlider.slider("value");
    sliderTitle.text(sliderText);
    
    whizzleSlider = whizzleControlsDiv.find(".whizzle_width_slider");
    whizzleSliderParent = whizzleSlider.parent();
    sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
    sliderText = "Width: \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0" + whizzleSlider.slider("value");
    sliderTitle.text(sliderText);
    
    whizzleSlider = whizzleControlsDiv.find(".whizzle_height_slider");
    whizzleSliderParent = whizzleSlider.parent();
    sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
    sliderText = "Height: \u00a0\u00a0\u00a0\u00a0\u00a0" + whizzleSlider.slider("value");
    sliderTitle.text(sliderText);
    
    whizzleSlider = whizzleControlsDiv.find(".whizzle_x_slider");
    whizzleSliderParent = whizzleSlider.parent();
    sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
    sliderText = "Start X: \u00a0\u00a0\u00a0" + whizzleSlider.slider("value");
    sliderTitle.text(sliderText);
    
    whizzleSlider = whizzleControlsDiv.find(".whizzle_y_slider");
    whizzleSliderParent = whizzleSlider.parent();
    sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
    sliderText = "Start Y: \u00a0\u00a0\u00a0" + whizzleSlider.slider("value");
    sliderTitle.text(sliderText);
    
    whizzleSlider = whizzleControlsDiv.find(".whizzle_vX_slider");
    whizzleSliderParent = whizzleSlider.parent();
    sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
    sliderText = "Start Vx: \u00a0\u00a0" + whizzleSlider.slider("value");
    sliderTitle.text(sliderText);
    
    whizzleSlider = whizzleControlsDiv.find(".whizzle_vY_slider");
    whizzleSliderParent = whizzleSlider.parent();
    sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
    sliderText = "Start Vy: \u00a0\u00a0" + whizzleSlider.slider("value");
    sliderTitle.text(sliderText);

    // SETUP ALL THE EVENT RESPONSES
    $(whizzleId).find(".whizzle_type").change(function(){
        updateWhizzleAfterControlChange(whizzleId, $(this), W_TYPE, false);
    });
    $(whizzleId).find(".whizzle_mode").change(function(){
        updateWhizzleAfterControlChange(whizzleId, $(this), W_MODE, false);
    });
    
    // requirement 6
    $(whizzleId).find(".whizzle_thickness_slider").slider({
        slide: function(){
            updateWhizzleAfterControlChange(whizzleId, $(this), W_THICKNESS, true);
            // requirement 1 --- update the slider value displayed alongside the
            // slider
            whizzleSliderParent = $(this).parent();
            sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
            sliderText = "Thickness: \u00a0\u00a0" + $(this).slider("value");
            sliderTitle.text(sliderText);
        }
    });
    $(whizzleId).find(".whizzle_width_slider").slider({
        slide: function(){
           updateWhizzleAfterControlChange(whizzleId, $(this), W_WIDTH, true);
           // requirement 1 --- update the slider value displayed alongside the
           // slider
           whizzleSliderParent = $(this).parent();
           sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
           sliderText = "Width: \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0" + $(this).slider("value");
           sliderTitle.text(sliderText);
        }
    });
    $(whizzleId).find(".whizzle_height_slider").slider({
        slide: function(){
           updateWhizzleAfterControlChange(whizzleId, $(this), W_HEIGHT, true);
           // requirement 1 --- update the slider value displayed alongside the
           // slider
           whizzleSliderParent = $(this).parent();
           sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
           sliderText = "Height: \u00a0\u00a0\u00a0\u00a0\u00a0" + $(this).slider("value");
           sliderTitle.text(sliderText);
        }
    });
    $(whizzleId).find(".whizzle_x_slider").slider({
        slide: function(){
           updateWhizzleAfterControlChange(whizzleId, $(this), W_X, true);
           // requirement 1 --- update the slider value displayed alongside the
           // slider
           whizzleSliderParent = $(this).parent();
           sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
           sliderText = "Start X: \u00a0\u00a0\u00a0" + $(this).slider("value");
           sliderTitle.text(sliderText);
        }
    });    
    $(whizzleId).find(".whizzle_y_slider").slider({
        slide: function(){
           updateWhizzleAfterControlChange(whizzleId, $(this), W_Y, true);
           // requirement 1 --- update the slider value displayed alongside the
           // slider
           whizzleSliderParent = $(this).parent();
           sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
           sliderText = "Start Y: \u00a0\u00a0\u00a0" + $(this).slider("value");
           sliderTitle.text(sliderText);
        }
    });    
    $(whizzleId).find(".whizzle_vX_slider").slider({
        slide: function(){
           updateWhizzleAfterControlChange(whizzleId, $(this), W_VX, true);
           // requirement 1 --- update the slider value displayed alongside the
           // slider
           whizzleSliderParent = $(this).parent();
           sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
           sliderText = "Start Vx: \u00a0\u00a0" + $(this).slider("value");
           sliderTitle.text(sliderText);
        }
    });
    $(whizzleId).find(".whizzle_vY_slider").slider({
        slide: function(){
           updateWhizzleAfterControlChange(whizzleId, $(this), W_VY, true);
           // requirement 1 --- update the slider value displayed alongside the
           // slider
           whizzleSliderParent = $(this).parent();
           sliderTitle = whizzleSliderParent.find(".whizzle_toolbar_title");
           sliderText = "Start Vy: \u00a0\u00a0" + $(this).slider("value");
           sliderTitle.text(sliderText);
        }
    });
    
    // FINALLY, MAKE THE WHIZZLE WITH ALL THE CURRENT UI SETTINGS
    // AND PUT IT IN THE ARRAY
    // bug fix --- make sure the correct whizzle is being passed in to 
    // makeWhizzle to ensure that the value's pulled from it are the defaults
    // and not the current values of the first whizzle
    var whizzleToAdd = makeWhizzle(/*$("#whizzles").last()*/whizzleDiv, whizzleCounter);    
    whizzles[whizzleCounter] = whizzleToAdd;
    whizzleCounter++;
    
    // requirement 5 --- when a new color is picked from the color picker,
    // update the color of the whizzle
    var colorPickerIdString = "#" + colorPickerId;
    $(colorPickerIdString).change(function(){
        updateWhizzleAfterControlChange(whizzleId, $(this), W_COLOR, false);
    });
    
    // UPDATE THE CANVAS DISPLAY
    render();
}

// requirement 4; handle whizzle drag and drop events
function allowDrop(ev)
{
    ev.preventDefault();
}

function drag(ev)
{
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev)
{
    ev.preventDefault();
    var draggedId = ev.dataTransfer.getData("Text");
    var draggedWhizzleDiv = document.getElementById(draggedId);
    // figure out whether or not the dropped on target is the
    // whizzle div itself and not one of its children elements
    var droppedOnElement = ev.target;
    var droppedOnClass = ev.target.getAttribute("class");
    // if it is one of the whizzle div's children elements, go
    // back up to its parent to get to the whizzle div itself;
    // go up as many times as necessary till you reach it
    while (droppedOnClass !== "whizzle")
    {
        droppedOnElement = droppedOnElement.parentNode;
        droppedOnClass = droppedOnElement.getAttribute("class");
    }
    var droppedOnId = droppedOnElement.getAttribute("id");
    
    // update each swapped whizzle's id attribute
    draggedWhizzleDiv.setAttribute("id", droppedOnId);
    droppedOnElement.setAttribute("id", draggedId);
    
    // update each swapped whizzle's span that contains the text
    // with its id number
    var idSpan = $(draggedWhizzleDiv).find('.whizzle_id');
    idSpan.text("" + droppedOnId);
    idSpan = $(droppedOnElement).find('.whizzle_id');
    idSpan.text("" + draggedId);
    
    var mainWhizzlesDiv = document.getElementById("whizzles");
    // get all of the whizzle divs
    var whizzleDivs = mainWhizzlesDiv.childNodes;
    var whizzleDivsArray = [];
    // and store them in an array to ensure that they are still
    // around after they are removed from the main whizzles div,
    // so that they could then be added back to the main whizzles
    // div in their new order
    for (var i = 0; i < whizzleDivs.length; i++)
    {
        whizzleDivsArray[i] = whizzleDivs[i];
    }
    // re-order the whizzle divs in the NodeList representing
    // the main whizzles div's children (all of the individual
    // whizzles)
    whizzleDivsArray[droppedOnId] = draggedWhizzleDiv;
    whizzleDivsArray[draggedId] = droppedOnElement;
    // then remove all of the main whizzles div's children
    while (mainWhizzlesDiv.firstChild)
    {
        mainWhizzlesDiv.removeChild(mainWhizzlesDiv.firstChild);
    }
    // and add them back from the newly-ordered NodeList of
    // whizzle divs
    for (var i = 0; i < whizzleCounter; i++)
    {
        $(mainWhizzlesDiv).append(whizzleDivsArray[i]);
    }
    
    // update the array of whizzle objects so that they are
    // rendered in the correct order
    var draggedWhizzle = whizzles[draggedId];
    var droppedOnWhizzle = whizzles[droppedOnId];
    whizzles[droppedOnId] = draggedWhizzle;
    whizzles[draggedId] = droppedOnWhizzle;
    // correct the whizzle objects idNums to reflect their
    // new order
    for (var i = 0; i < whizzleCounter; i++)
    {
        whizzles[i].idNum = i;
    }
    
    render();
}

// requirement 3; when the "-" button is clicked,
function collapseWhizzle(whizzleToCollapse)
{
    // collapse all of this Whizzle's controls so that they
    // are hidden
    $(whizzleToCollapse).find(".whizzle_controls_toolbar").hide();
}

// requirement 3; when the "+" button is clicked,
function expandWhizzle(whizzleToExpand)
{
    // expand all of this Whizzle's controls so that they
    // are visible
    $(whizzleToExpand).find(".whizzle_controls_toolbar").show();
}

/*
 * Provides the response to when the user changes a value
 * in a whizzle control.
 */
function updateWhizzleAfterControlChange(whizzleId, control, valueToChange, isSlider)
{
    // PAUSE EVERYTHING AND CLEAR THE CANVAS
    pauseWhizzles();
    
    // GET THE UPDATED VALUE
    var newValue;
    if (isSlider)
        newValue = control.slider("value");
    else
        newValue = control.val();
    
    // GET THE AFFECTED WHIZZLE
    // requirement 4
    // instead of this
    /*
    var indexStr = whizzleId.substr(1);
    var index = Number(indexStr).valueOf();
    */
    // THIS
    var whizzleDiv = control;
    var elementClass = control.attr("class");
    // go up to the control's parent to get to the whizzle
    // div itself; go up as many times as necessary till
    // you reach it
    while (elementClass !== "whizzle")
    {
        whizzleDiv = whizzleDiv.parent();
        elementClass = whizzleDiv.attr("class");
    }
    var indexStr = whizzleDiv.attr("id");
    var index = Number(indexStr).valueOf();
    var whiz = whizzles[index];
    
    // CHANGE THE AFFECTED WHIZZLE
    whiz.setProperty(valueToChange, newValue);
    
    // CLEAR THE CANVAS AND RENDER FROM SCRATCH WITH THE CHANGE
    clearCanvas();
    render();
}

/*
 * This function removes a whizzle.
 */
function removeWhizzle(whizzleToRemove)
{
    // GET THE ID NUMBER OF THE WHIZZLE TO REMOVE, WHICH
    // CORRESPONDS TO ITS INDEX IN THE ARRAY
    var whizzleId = whizzleToRemove.find('.whizzle_id');
    var whizzleIdText = whizzleId.text();
    var whizzleIdNum = Number(whizzleIdText);

    // REMOVE THIS WHIZZLE
    var parent = whizzleToRemove.parent();
    whizzleToRemove.remove();
    console.log("" + whizzleCounter);

    // DEC THE COUNTER
    whizzleCounter--;
    
    // UPDATE THE WHIZZLE ARRAY
    for (var i = whizzleIdNum; i < whizzleCounter; i++)
    {
        whizzles[i] = whizzles[i+1];
    }
    
    // NOW GO THROUGH ALL THE WIZZLES TO CORRECT
    // ANY POSSIBLE IDS
    for (var i = 0; i < whizzleCounter; i++)
    {
        whizzles[i].idNum = i;
    }    
    
    // AND MAKE SURE THE DISPLAY IS UPDATED PROPERLY
    var children = parent.children('.whizzle');
    children.each(function (i) {
        var idSpan = $(this).find('.whizzle_id');
        idSpan.text("" + i);
    });
}

/*
 * Used for setting up a whizzle slider
 */
function initWhizzleSlider(whizzleSlider, initMin, initMax, initStep, initValue)
{
    // NOTE THAT .slider IS A JQuery METHOD FOR THE CUSTOM
    // JQuery UI SLIDER COMPONENT
    whizzleSlider.slider();
    whizzleSlider.slider({ min: initMin });
    whizzleSlider.slider({ max: initMax });
    whizzleSlider.slider({ step: initStep });
    whizzleSlider.slider({ value: initValue });
}

/*
 * This method retrives the controls setttings for the proper
 * whizzle and makes and returns a new whizzle.
 */
function makeWhizzle(whizzleDiv, initIdNum)
{
    // FIRST GET ALL THE DATA
    var wControls = whizzleDiv.find(".whizzle_controls_toolbar");
    var wTypeControl = wControls.find(".whizzle_type");
    var wType = wTypeControl.val();
    var wModeControl = wControls.find(".whizzle_mode");
    var wMode = wModeControl.val();
    // requirement 5
    var colorPickerId = "colorPicker" + initIdNum;
    var colorPickerIdString = "#" + colorPickerId;
    var wColorControl = wControls.find(colorPickerIdString);
    var wColor = wColorControl.val();
    // requirement 6
    var wThickness = wControls.find(".whizzle_thickness_slider").slider("value");
    var wWidth = wControls.find(".whizzle_width_slider").slider("value");
    var wHeight = wControls.find(".whizzle_height_slider").slider("value");
    var wX = wControls.find(".whizzle_x_slider").slider("value");
    var wY = wControls.find(".whizzle_y_slider").slider("value");
    var wVx = wControls.find(".whizzle_vX_slider").slider("value");
    var wVy = wControls.find(".whizzle_vY_slider").slider("value");

    // AND NOW USE IT TO MAKE AND RETURN A NEW WHIZZLE
    
    // FIRST CONSTRUCT IT
    var newWhizzle = new Whizzle(initIdNum);
    
    // NOW INIT ALL ITS PROPERTIES
    newWhizzle.setProperty(W_TYPE, wType);
    newWhizzle.setProperty(W_MODE, wMode);
    // requirement 5
    newWhizzle.setProperty(W_COLOR, wColor);
    // requirement 6
    newWhizzle.setProperty(W_THICKNESS, wThickness);
    newWhizzle.setProperty(W_WIDTH, wWidth);
    newWhizzle.setProperty(W_HEIGHT, wHeight);
    newWhizzle.setProperty(W_X, wX);
    newWhizzle.setProperty(W_Y, wY);
    newWhizzle.setProperty(W_VX, wVx);
    newWhizzle.setProperty(W_VY, wVy);
    
    // NOW RETURN THE WHIZZLE
    return newWhizzle;
}

/*
 * Called oncde per frame, it just updates and renders.
 */
function stepSimulation()
{
    // UPDATE ALL WHIZZLES
    updateWhizzles();
    
    // AND RENDER. NOTE WE DON'T CLEAR THE CANVAS
    render();
}

/*
 * Updates the position of each whizzle using its velocity and bouncing
 * it off of walls.
 */
function updateWhizzles()
{
    // GO THROUGH ALL THE WHIZZLES
    for (var i = 0; i < whizzleCounter; i++)
    {
        var whiz = whizzles[i];
        whiz.setProperty(W_X, whiz.getProperty(W_X) + whiz.getProperty(W_VX));
        whiz.setProperty(W_Y, whiz.getProperty(W_Y) + whiz.getProperty(W_VY));
        
        // CLAMPING, WHICH BOUNCES IT OFF WALLS
        if (whiz.getProperty(W_X) <= 0)
            whiz.setProperty(W_VX, whiz.getProperty(W_VX) * -1);
        if ((whiz.getProperty(W_X) + whiz.getProperty(W_WIDTH)) >= canvasWidth) 
            whiz.setProperty(W_VX, whiz.getProperty(W_VX) * -1);
        if (whiz.getProperty(W_Y) <= 0)
            whiz.setProperty(W_VY, whiz.getProperty(W_VY) * -1);
        if ((whiz.getProperty(W_Y) + whiz.getProperty(W_HEIGHT)) >= canvasHeight)
            whiz.setProperty(W_VY, whiz.getProperty(W_VY) * -1);
    }
}

/*
 * This method renders all the whizzles, whether they are rectangles
 * or ovals, filled or not.
 */
function render()
{
    // GO THROUGH ALL THE WHIZZLES
    for (var i = 0; i < whizzleCounter; i++)
    {
        // GET THE WHIZZLE
        var whiz = whizzles[i];
        
        // START RENDERING
        canvas2D.beginPath();
        
        // THESE SHOULD BE CUSTOM COLORS
        // requirement 5
        canvas2D.strokeStyle = whiz.getProperty(W_COLOR);
        canvas2D.fillStyle = whiz.getProperty(W_COLOR);
        // requirement 6
        canvas2D.lineWidth = whiz.getProperty(W_THICKNESS);
        var x = whiz.getProperty(W_X);
        var y = whiz.getProperty(W_Y);
        var width = whiz.getProperty(W_WIDTH);
        var height = whiz.getProperty(W_HEIGHT);
        
        // RENDER AS AN ELLIPSE, WHICH IS A LITTLE TRICKY
        // IF WE WANT IT TO LOOK GOOD
        if (whiz.getProperty(W_TYPE) === ELLIPSE_WHIZZLE_TYPE)
        {            
            drawEllipse(x, y, width, height, whiz.getProperty(W_MODE));
        }
        // RENDER WHIZZLE AS RECTANGLE
        else if (whiz.getProperty(W_TYPE) === RECTANGLE_WHIZZLE_TYPE)
        {
            canvas2D.rect(x, y, width, height);
            if (whiz.getProperty(W_MODE) === FILLED_WHIZZLE_MODE)
            {
                canvas2D.fill();
            }
            else
            {
                canvas2D.stroke();
            }
        }
    }
}

// bug fix --- when whizzles are reset, start them back
// at their original initial positions as opposed to at
// the positions they were at when the reset button was
// clicked
function renderAfterReset()
{
    // GO THROUGH ALL THE WHIZZLES
    for (var i = 0; i < whizzleCounter; i++)
    {
        // GET THE WHIZZLE
        var whiz = whizzles[i];
        
        // START RENDERING
        canvas2D.beginPath();
        
        // THESE SHOULD BE CUSTOM COLORS
        // requirement 5
        canvas2D.strokeStyle = whiz.getProperty(W_COLOR);
        canvas2D.fillStyle = whiz.getProperty(W_COLOR);
        // requirement 6
        canvas2D.lineWidth = whiz.getProperty(W_THICKNESS);
        // start whizzle back at its original initial position as opposed
        // to where it was when the reset button was clicked, i.e., set its
        // x and y to the values that are still on the x- and y- sliders
        var whizzleId = "#" + i;
        var whizzleDiv = $("#whizzles").find(whizzleId);
        var wX = whizzleDiv.find(".whizzle_x_slider").slider("value");
        var wY = whizzleDiv.find(".whizzle_y_slider").slider("value");
        whiz.setProperty(W_X, wX);
        whiz.setProperty(W_Y, wY);
        var x = whiz.getProperty(W_X);
        var y = whiz.getProperty(W_Y);
        var width = whiz.getProperty(W_WIDTH);
        var height = whiz.getProperty(W_HEIGHT);
        
        // RENDER AS AN ELLIPSE, WHICH IS A LITTLE TRICKY
        // IF WE WANT IT TO LOOK GOOD
        if (whiz.getProperty(W_TYPE) === ELLIPSE_WHIZZLE_TYPE)
        {            
            drawEllipse(x, y, width, height, whiz.getProperty(W_MODE));
        }
        // RENDER WHIZZLE AS RECTANGLE
        else if (whiz.getProperty(W_TYPE) === RECTANGLE_WHIZZLE_TYPE)
        {
            canvas2D.rect(x, y, width, height);
            if (whiz.getProperty(W_MODE) === FILLED_WHIZZLE_MODE)
            {
                canvas2D.fill();
            }
            else
            {
                canvas2D.stroke();
            }
        }
    }
}

/*
 * Renders an ellipse using a Bezier curve.
 */
function drawEllipse(x, y, w, h, mode) 
{
    var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

    canvas2D.beginPath();
    canvas2D.moveTo(x, ym);
    canvas2D.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    canvas2D.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    canvas2D.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    canvas2D.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    canvas2D.closePath();
    if (mode === OUTLINE_WHIZZLE_MODE)
        canvas2D.stroke();
    else
        canvas2D.fill();
}

/*
 * Clears the canvas, removing all past whizzle paths.
 */
function clearCanvas()
{
    canvas2D.clearRect(0, 0, canvas.width, canvas.height);    
}

/*
 * This helper method gets the whizzle that corresponds to
 * a given slider control. This is useful when setting up
 * the controls such that we may respond to a slider change
 * by updating the correct whizzle data.
 */
function getSliderWhizzle(slider)
{
    var sliderParent = slider.parent();            
    var sliderGrandParent = sliderParent.parent();
    var whizzleId = sliderGrandParent.find(".whizzle_id");
    var whizzleIdNum = whizzleId.text();
    var whiz = whizzles[whizzleIdNum];
    return whiz;
}