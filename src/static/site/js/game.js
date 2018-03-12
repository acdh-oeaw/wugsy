// pad numbers smaller than 10
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

function setTheTimer(game){
    $('#timer.game00').html(game.counter);
    $("#timer.game00").addClass("running");
    game.interval = setInterval(function() {
        game.counter--;
        $("#timer.game00").html(game.counter);
        if (game.counter <= 0) {
            $("#timer.game00").html("Time out!");
            $("#timer.game00").removeClass("running");
            $("#timer.game00").addClass("timeout");
            $(".card.game00").unbind("click"); // No more card clicks allowed!
        }
    }, 1000);
}

function startTimer(game){
    game.counter = 10;
    $('#timer.game00').html(game.counter);
    if(game.interval != undefined) clearInterval(game.interval);
    setTheTimer(game);
}

function clearTimer(game){
    clearInterval(game.interval);
    $("#timer.game00").addClass("white");
}

// an abstract game class you can inherit from
function BaseGame() {
    this.height = 100;
    this.width = 100;
    this.cards = {};
}

// game that follows the 00 rules
function Game00(gameData) {
    BaseGame.call(this);
    this.gameData = gameData;
    console.log(this.gameData)
    setUpGame00(this.gameData);
}

function setUpGame00(game){

    $('#game-space').html("");
    game.counter = 10; game.interval = undefined;
    setUpGame00Screen00(game);
}

function setUpGame00Screen00(game){ // Rules of Game00 + Start R1

    $('#game-space').append(function(){
        var html = '';
        html += '<div id="game00-dashboard">';
        html += '<div id="intro" class="game00">Welcome to Game00!</div>';
        html += '<p>These are the rules of this game:</p>';
        html += '<p>1. Bla bla</p>';
        html += '<p>2. Bla bla</p>';
        html += '<p>3. Bla bla</p>';
        html += '<p>4. Bla bla</p>';
        html += '<div id="button-start" class="div-button game00">Start Round One!</div>';
        html += '</div>';
        html += '<div id="game00-field"></div>';
        return html;
    });

    $("#button-start.game00").unbind("click");
    $("#button-start.game00").click(function() {
        setUpGame00Screen01(game)
    });
}

function setUpGame00Screen01(game){ // Cards space + R1 mechanics

    //clearGameSpace(0,1);
    $('#game00-dashboard').html(function(){
        var html = '';
        html += '<div id="intro" class="game00">Game00 - Round One!</div>';
        return html;
    });
    $('#game00-field').html(function(){
        var html = '';
        html += '<div id="cards-space" class="game00">';
        html += '<div id="timer" class="game00"></div>';
        html += '</div>';
        html += '<div id="box-concept" class="game00">Marriage</div>';
        html += '<div id="button-restart" class="div-button game00">Restart</div>';
        html += '<div id="button-next" class="div-button game00">Next Round</div>';
        return html;
    });

    // Restart Game = New Cards/Concept
    $("#button-restart.game00").unbind("click");
    $("#button-restart.game00").click(function() {
        restartGame00(game);
    });

    // Go to Round 2
    $("#button-next.game00").unbind("click");
    $("#button-next.game00").click(function() {
        setUpGame00Screen02(game);
    });

    // Start timer
    startTimer(game);

    // Show cards

    for(var i=0; i<game.cards.length; i++){
        $('#cards-space.game00').append(function(){
            var html = '';
            html += '<div id="card-item-'+i+'" class="card game00">'+i+" - "+game.cards[i].card_text+'</div>';
            return html;
        });
    }

    // Mark card logic

    game.selectedCardsR1 = [];
    $('.card.game00').click(function(){

        var selectedIndex = parseInt($(this).attr('id').replace('card-item-',''));
        var index = game.selectedCardsR1.indexOf(selectedIndex);
        if (index !== -1) {
            $(this).removeClass("marked-term-r1");
            $(this).removeClass("one");$(this).removeClass("two");$(this).removeClass("three");
            game.selectedCardsR1.splice(index, 1);
        }
        else{
            // Only the THREE most meaninguful words related to the concept
            if(game.selectedCardsR1.length < 3){
                $(this).addClass("marked-term-r1");
                if($(".one").length == 0){$(this).addClass("one");}
                else if($(".two").length == 0){$(this).addClass("two");}
                else if($(".three").length == 0){$(this).addClass("three");}
                game.selectedCardsR1.push(selectedIndex);
            }
        }
    });
}

function setUpGame00Screen02(game){ // Rules of R2 + Start R2

    $('#game00-field').hide();

    //clearGameSpace(0,2);
    $('#game00-dashboard').html(function(){
        var html = '';
        html += '<div id="intro" class="game00">Game00 - Round Two!</div>';
        html += '<p>1. Bla bla</p>';
        html += '<p>2. Bla bla</p>';
        html += '<p>3. Bla bla</p>';
        html += '<p>4. Bla bla</p>';
        html += '<div id="button-start" class="div-button game00">Start Round Two!</div>';
        return html;
    });

    $("#button-start").unbind("click");
    $("#button-start.game00").click(function() {
        setUpGame00Screen03(game)
    });
}

function setUpGame00Screen03(game){ // Cards for R2 + R2 mechanics

    $('#game00-dashboard').html(function(){
        var html = '';
        html += '<div id="intro" class="game00">Game00 - Round Two!</div>';
        return html;
    });

    $("#button-restart.game00").remove();

    // Go to Results screen
    $("#button-next.game00").unbind("click");
    $("#button-next.game00").html("End Game");
    $("#button-next.game00").click(function() {
        setUpGame00Screen04(game);
    });

    $('#game00-field').show(); // The field maintains the state of R1

    // Start timer
    startTimer(game);

    // Mark card logic

    // Reset card behavior prior to start
    game.lastSelectedIndex = -1;
    $(".card.game00").unbind("click");

    game.linksR1R2 = [];

    $('.card.game00').click(function(){

        // Check if clicked card was already selected
        var selectedIndex = parseInt($(this).attr('id').replace('card-item-',''));
        console.log("Clicked on: "+selectedIndex+" - Last clicked was: "+game.lastSelectedIndex);

        if(selectedIndex == game.lastSelectedIndex){ // Nothing to do here
            $(this).toggleClass("marked-term-r2");
            if(!$(this).hasClass("marked-term-r2")){game.lastSelectedIndex = -1;}
            return;
        }
        else{ // Handle action

            if(game.lastSelectedIndex == -1){
                game.lastSelectedIndex = selectedIndex;
                $(this).addClass("marked-term-r2");
                return;
            }

            // Different card from the one selected previously. Gotta check links
            var linkFound = false;
            var atIndex = -1;
            for(var i=0; i<game.linksR1R2.length; i++){
                // Try to find a link between the cards
                if((game.linksR1R2[i][0] == selectedIndex && game.linksR1R2[i][1] == game.lastSelectedIndex)
                || (game.linksR1R2[i][1] == selectedIndex && game.linksR1R2[i][0] == game.lastSelectedIndex)){
                    linkFound = true;
                    atIndex = i;
                    console.log("Link FOUND between "+game.linksR1R2[i][0]+" and "+game.linksR1R2[i][1])
                }
            }

            if(linkFound){
                // If a link already exists, we remove it
                console.log("Link REMOVED between "+game.linksR1R2[atIndex][0]+" and "+game.linksR1R2[atIndex][1])
                game.linksR1R2.splice(atIndex, 1);

                // Links always feature the lower index first
                if(selectedIndex<game.lastSelectedIndex){
                    $("connection-"+selectedIndex+"-"+game.lastSelectedIndex).remove();
                }
                else{
                    $("connection-"+game.lastSelectedIndex+"-"+selectedIndex).remove();
                }
                game.lastSelectedIndex = -1;
            }
            else{
                // If a link doesn't exist, we create it (only if one card was marked in R1)
                console.log(game.selectedCardsR1)
                if(game.selectedCardsR1.indexOf(selectedIndex) !== -1 ||
                game.selectedCardsR1.indexOf(game.lastSelectedIndex) !== -1){
                    var connectionTag = "";
                    // Links always feature the lower index first
                    if(selectedIndex<game.lastSelectedIndex){
                        game.linksR1R2.push([selectedIndex,game.lastSelectedIndex]);
                        connectionTag = "connection-"+selectedIndex+"-"+game.lastSelectedIndex;
                    }
                    else{
                        game.linksR1R2.push([game.lastSelectedIndex,selectedIndex]);
                        connectionTag = "connection-"+game.lastSelectedIndex+"-"+selectedIndex;
                    }
                    console.log("Link CREATED between "+selectedIndex+" and "+game.lastSelectedIndex)

                    $('#card-item-'+game.lastSelectedIndex).connections({
                        to:'#card-item-'+selectedIndex,
                        within:'#cards-space.game00',
                        tag:connectionTag,
                        css: {
                            "z-index": 5,
                            "pointer-events": "none",
                            "opacity": 0.5,
                            "border-radius": "0px",
                            "border": function(){
                                if(game.selectedCardsR1.indexOf(selectedIndex) !== -1 &&
                                game.selectedCardsR1.indexOf(game.lastSelectedIndex) !== -1){
                                    // two cards from R1, gray "shared" link
                                    return "3px solid gray";
                                }
                                else if($('#card-item-'+game.lastSelectedIndex).attr("class").indexOf("one") !== -1 ||
                                $('#card-item-'+selectedIndex).attr("class").indexOf("one") !== -1){
                                    return "3px solid #ffebba";
                                }
                                else if($('#card-item-'+game.lastSelectedIndex).attr("class").indexOf("two") !== -1 ||
                                $('#card-item-'+selectedIndex).attr("class").indexOf("two") !== -1){
                                    return "3px solid #6dc9c9";
                                }
                                else if($('#card-item-'+game.lastSelectedIndex).attr("class").indexOf("three") !== -1 ||
                                $('#card-item-'+selectedIndex).attr("class").indexOf("three") !== -1){
                                    return "3px solid #ffb2b2";
                                }
                            },
                            "border-width": "6px"
                        }
                    });

                    // If the selected card is not from R1, we change its background,
                    // only if we are not linking two R1 cards
                    if(game.selectedCardsR1.indexOf(selectedIndex) !== -1 &&
                    game.selectedCardsR1.indexOf(game.lastSelectedIndex) !== -1){
                        // two cards from R1, do nothing
                    }
                    else{
                        if(game.selectedCardsR1.indexOf(selectedIndex) !== -1){
                            $('#card-item-'+game.lastSelectedIndex).removeClass("one");
                            $('#card-item-'+game.lastSelectedIndex).removeClass("two");
                            $('#card-item-'+game.lastSelectedIndex).removeClass("three");
                            if($('#card-item-'+selectedIndex).attr("class").indexOf("one") !== -1){
                                $('#card-item-'+game.lastSelectedIndex).addClass("one");
                            }
                            if($('#card-item-'+selectedIndex).attr("class").indexOf("two") !== -1){
                                $('#card-item-'+game.lastSelectedIndex).addClass("two");
                            }
                            if($('#card-item-'+selectedIndex).attr("class").indexOf("three") !== -1){
                                $('#card-item-'+game.lastSelectedIndex).addClass("three");
                            }
                        }
                        else{
                            $('#card-item-'+selectedIndex).removeClass("one");
                            $('#card-item-'+selectedIndex).removeClass("two");
                            $('#card-item-'+selectedIndex).removeClass("three");
                            if($('#card-item-'+game.lastSelectedIndex).attr("class").indexOf("one") !== -1){
                                $('#card-item-'+selectedIndex).addClass("one");
                            }
                            if($('#card-item-'+game.lastSelectedIndex).attr("class").indexOf("two") !== -1){
                                $('#card-item-'+selectedIndex).addClass("two");
                            }
                            if($('#card-item-'+game.lastSelectedIndex).attr("class").indexOf("three") !== -1){
                                $('#card-item-'+selectedIndex).addClass("three");
                            }
                        }
                    }
                }
                else{
                    console.log("Link NOT CREATED (no R1 card was picked)")
                    game.lastSelectedIndex = -1;
                }
                game.lastSelectedIndex = -1;
            }

            $(".marked-term-r2").removeClass("marked-term-r2");
        }
    });
}

function setUpGame00Screen04(game){ // Final screen (summary) + Restart

    $(".card.game00").unbind("click");

    $('#game00-dashboard').html(function(){
        var html = '';
        html += '<div id="intro" class="game00">Game00 - Results!</div>';
        html += '<p>This is how your mental map compares to the field</p>';
        html += '<p>Some interesting comment here...</p>';
        html += '<p>Some interesting comment here...</p>';
        html += '<p>Some interesting comment here...</p>';
        return html;
    });
    clearTimer(game);

    $("#button-next.game00").unbind("click");
    $("#button-next.game00").html("Restart");
    $("#button-next.game00").click(function() {
        restartGame00(game);
    });

    // Change the connection weight to reflect other people results
    for(var i=0; i<game.linksR1R2.length; i++){
        var borderwidth = $("connection-"+game.linksR1R2[i][0]+"-"+game.linksR1R2[i][1]).css("border-width");
        $("connection-"+game.linksR1R2[i][0]+"-"+game.linksR1R2[i][1]).css("border-width",function(){
            var widthParts = borderwidth.split(" ");
            var newWidth = Math.floor(Math.random()*16)+1+"px";
            var newWidthString = "";
            for(var j=0; j<widthParts.length; j++){
                if(widthParts[j].indexOf("0px") == -1){widthParts[j] = newWidth;}
                newWidthString += widthParts[j];
                if(j!=widthParts.length-1){newWidthString+=" ";}
            }
            return newWidthString;
        });
        $("connection-"+game.linksR1R2[i][0]+"-"+game.linksR1R2[i][1]).css("z-index","-1");
    }
}

function restartGame00(game){
    console.log("restarting")
    $.ajax({
        url:'gamegenerate_data/',
        type:'post',
        data:$('#get-game').serialize(),
        success:function(e){
          //console.log('Below is validated game JSON, which should be interpretable')
          //console.log(e);
          // now, you can call the code that builds and inserts a game
          buildGame(e)
          // here, have the json on screen :)
          //var jsonData = '<code align="left">' + JSON.stringify(e, null, 4) + '</code>'
          //jsonData = jsonData.replace(/\n/g, '<br>');
          //$("#json-space").html(jsonData);
        }
    });
}








// game that follows the 01 rules
function Game01(gameData) {
    BaseGame.call(this);
    this.gameData = gameData;
    console.log(this.gameData)
    setUpGame01(this.gameData);
}

function setUpGame01(game){

    $('#game-space').html("");
    setUpGame01Screen00(game);
}

function setUpGame01Screen00(game){ // Rules of Game01

    $('#game-space').append(function(){
        var html = '';
        html += '<div id="game01-dashboard">';
        html += '<div id="intro" class="game01">Welcome to Game01!</div>';
        html += '<p>These are the rules of this game:</p>';
        html += '<p>1. Bla bla</p>';
        html += '<p>2. Bla bla</p>';
        html += '<p>3. Bla bla</p>';
        html += '<p>4. Bla bla</p>';
        html += '<div id="button-start" class="div-button game01">Start!</div>';
        html += '</div>';
        html += '<div id="game01-field"></div>';
        return html;
    });

    $("#button-start.game01").unbind("click");
    $("#button-start.game01").click(function() {
        setUpGame01Screen01(game)
    });
}

function setUpGame01Screen01(game){ // Photo + Everything Else

    //clearGameSpace(0,1);
    $('#game01-dashboard').html(function(){
        var html = '';
        html += '<div id="intro" class="game01">Game01 - Round One!</div>';
        return html;
    });
    $('#game01-field').html(function(){
        var html = '';
        html += '<div id="photo-space" class="game01">';
        html += '<div id="photo-box" class="game01"><img src="/static/site/img/placeholder.png"/></div>';
        html += '</div>';
        html += '<div id="action-space" class="game01">';
        html += '<div id="tab-space" class="game01">';
        html += '<ul class="nav nav-tabs game01">';
        html += '<li id="tab-paragraph" class="active"><a href="#">Paragraph</a></li>';
        html += '<li id="tab-textbox"><a href="#">Textbox</a></li>';
        html += '<li id="tab-visualization"><a href="#">Visualization</a></li>';
        html += '</ul>';
        html += '</div>';
        html += '<div id="under-tab-space" class="game01">';
        html += 'This is a paragraph.'
        html += '</div>';
        html += '</div>';
        html += '<div id="button-submit" class="div-button game01">Submit</div>';
        html += '<div class="clearfix"></div>';
        html += '<div id="button-restart" class="div-button game01">Restart</div>';
        return html;
    });

    // Restart Game = New Image
    $("#button-restart.game01").unbind("click");
    $("#button-restart.game01").click(function() {
        restartGame01(game);
    });

    // Tabs handler
    $('.nav-tabs.game01 li').click(function(e){

        // Dont move screen to #
        e.preventDefault();

        $(".nav-tabs.game01 li").each(function(){
                $(this).removeClass("active");
        })
        $(this).addClass("active");

        if($(this).attr("id") == "tab-paragraph"){
            $('#under-tab-space.game01').html(function(){
                var html = "";
                html += "This is a paragraph.";
                return html;
            });
        }
        else if($(this).attr("id") == "tab-textbox"){
            $('#under-tab-space.game01').html(function(){
                var html = "";
                html += "A textbox should be here.";
                return html;
            });
        }
        else if($(this).attr("id") == "tab-visualization"){
            $('#under-tab-space.game01').html(function(){
                var html = "";
                html += "Fancy visualization!";
                return html;
            });
        }
    });

    // Submit handler
    $("#button-submit.game01").unbind("click");
    $("#button-submit.game01").click(function() {

        if($(".nav-tabs.game01 li.active").attr("id") == "tab-paragraph"){
            console.log("tab paragraph")
        }
        else if($(".nav-tabs.game01 li.active").attr("id") == "tab-textbox"){
            console.log("tab textbox")
        }
        else if($(".nav-tabs.game01 li.active").attr("id") == "tab-visualization"){
            console.log("tab visualization")
        }
    });

    // Show whatever

}

function restartGame01(game){
    console.log("restarting")
    $.ajax({
        url:'gamegenerate_data/',
        type:'post',
        data:$('#get-game').serialize(),
        success:function(e){
          //console.log('Below is validated game JSON, which should be interpretable')
          //console.log(e);
          // now, you can call the code that builds and inserts a game
          e.game_type = 1; // YADA YADA FIX THIS HACK!
          buildGame(e)
          // here, have the json on screen :)
          //var jsonData = '<code align="left">' + JSON.stringify(e, null, 4) + '</code>'
          //jsonData = jsonData.replace(/\n/g, '<br>');
          //$("#json-space").html(jsonData);
        }
    });
}
































Game00.prototype = Object.create(BaseGame.prototype);
Game01.prototype = Object.create(BaseGame.prototype);

// map game numbers to functions
var games = {
    '00': Game00,
    '01': Game01
}

// main method: lookup correct js
function buildGame(gameData) {
    var gameType = gameData['game_type'];
    var Game = games[pad(gameType)];
    Game(gameData);
};
