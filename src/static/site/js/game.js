// pad numbers smaller than 10
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
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

function setUpGame00(game,restart){

    //$('#game-space').html('<h3>Game 00: "' + gameData['game_title'] + '" here?</h3>');
    //clearGameSpace(0,0);

    $('#game-space').html("");
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

    // if(restart){
    //     setUpGame00Screen01(game);
    // }

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
        html += '<div id="cards-space" class="game00"></div>';
        html += '<div id="box-concept" class="game00">Marriage</div>';
        html += '<div id="button-restart" class="div-button game00">Restart</div>';
        html += '<div id="button-next" class="div-button game00">Next Round</div>';
        return html;
    });

    // Restart Game = New Cards/Concept
    $("#button-restart.game00").unbind("click");
    $("#button-restart.game00").click(function() {
        // ask for new set of cards
    });

    // Go to Round 2
    $("#button-next.game00").unbind("click");
    $("#button-next.game00").click(function() {
        setUpGame00Screen02(game);
    });

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
                game.lastSelectedIndex = -1;
                // handle un-drawing of link here or whatever
            }
            else{
                // If a link doesn't exist, we create it
                game.linksR1R2.push([selectedIndex,game.lastSelectedIndex]);
                console.log("Link CREATED between "+selectedIndex+" and "+game.lastSelectedIndex)
                game.lastSelectedIndex = -1;
                // handle drawing of link here or whatever
            }

            $(".marked-term-r2").removeClass("marked-term-r2");
        }

        $("#debugger").html("");
        for(var i=0; i<game.linksR1R2.length; i++){
            $("#debugger").append(game.linksR1R2[i][0]+"-"+game.linksR1R2[i][1]+"<br>");
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

    $("#button-next.game00").unbind("click");
    $("#button-next.game00").html("Restart");
    $("#button-next.game00").click(function() {
        // restart with new set of cards and new related concept
    });
}

function clearGameSpace(game_type,game_screen){

    if(game_type == 0){

        if(game_screen == 0){
            $("#button-start").unbind("click");
            $('#game-space').html("");
        }
        else if(game_screen == 1){
            $("#button-start").unbind("click");
            $('#game-space').html("");
        }
        else if(game_screen == 2){
            $('#game-space').html("");
        }
    }
    else if(game_type == 1){

    }
}








// game that follows the 01 rules
function Game01(gameData) {
    BaseGame.call(this);
    this.gameData = gameData;
    //console.log('Add game logic...')
    $('#game-space').html('<h3>Game 01: "' + gameData['game_title'] + '" here?</h3>');
}

Game00.prototype = Object.create(BaseGame.prototype);
Game01.prototype = Object.create(BaseGame.prototype);

// map game numbers to functions
var games = {'00': Game00, '01': Game01}

// main method: lookup correct js
function buildGame(gameData) {
    var gameType = gameData['game_type'];
    var Game = games[pad(gameType)];
    Game(gameData);
};
