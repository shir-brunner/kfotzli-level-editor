function showGameplayRules(gameplay, level) {
    let $gameplayRules = $('#gameplay-rules').empty();

    switch(gameplay) {
        case 'deathmatch': showDeathmatchRules($gameplayRules); break;
        case 'kingOfTheHill': showKingOfTheHillRules($gameplayRules); break;
        case 'captureTheFlag': showCaptureTheFlagRules($gameplayRules); break;
        case 'lastManStanding': showLastManStandingRules($gameplayRules); break;
    }

    if(level) {
        _.forEach(Object.keys(level.gameplay.rules), field => {
            let $field = $gameplayRules.find('input[field="' + field + '"], select[field="' + field + '"]');
            $field.val(level.gameplay.rules[field]);
        });
    }
}

function showDeathmatchRules($container) {
    let html = '';

    html += '<div class="form-group">';
    html += '   <label>Kills To Win</label>';
    html += '   <div class="input-group">';
    html += '       <input type="text" class="form-control" field="killsToWin" />';
    html += '       <div class="input-group-text">Kills</div>';
    html += '   </div>';
    html += '</div>';

    html += '<div class="form-group">';
    html += '   <label>Time Limit</label>';
    html += '   <div class="input-group">';
    html += '       <input type="text" class="form-control" field="timeLimit" />';
    html += '       <div class="input-group-text">Minutes</div>';
    html += '   </div>';
    html += '</div>';

    $container.html(html);
}

function showKingOfTheHillRules($container) {
    let html = '';

    html += '<div class="form-group">';
    html += '   <label>Hold Position</label>';
    html += '   <div class="input-group">';
    html += '       <div class="input-group-text">X</div>';
    html += '       <input type="text" class="form-control" field="holdX" placeholder="X"/>';
    html += '       <div class="input-group-text">Y</div>';
    html += '       <input type="text" class="form-control" field="holdY" placeholder="Y"/>';
    html += '       <div class="input-group-text">W</div>';
    html += '       <input type="text" class="form-control" field="holdWidth" placeholder="Width"/>';
    html += '       <div class="input-group-text">H</div>';
    html += '       <input type="text" class="form-control" field="holdHeight" placeholder="Height"/>';
    html += '   </div>';
    html += '</div>';

    html += '<div class="form-group">';
    html += '   <label>Hold Time</label>';
    html += '   <div class="input-group">';
    html += '       <input type="text" class="form-control" field="holdTime" />';
    html += '       <div class="input-group-text">Seconds</div>';
    html += '   </div>';
    html += '</div>';

    html += '<div class="form-group">';
    html += '   <label>Rounds To Win</label>';
    html += '   <div class="input-group">';
    html += '       <input type="text" class="form-control" field="roundsToWin" />';
    html += '       <div class="input-group-text">Rounds</div>';
    html += '   </div>';
    html += '</div>';
    
    $container.html(html);
}

function showCaptureTheFlagRules($container) {
    let html = '';

    html += '<div class="form-group">';
    html += '   <label>Rounds To Win</label>';
    html += '   <div class="input-group">';
    html += '       <input type="text" class="form-control" field="roundsToWin" />';
    html += '       <div class="input-group-text">Rounds</div>';
    html += '   </div>';
    html += '</div>';

    html += '<div class="form-group">';
    html += '   <label>Time Limit</label>';
    html += '   <div class="input-group">';
    html += '       <input type="text" class="form-control" field="timeLimit" />';
    html += '       <div class="input-group-text">Minutes</div>';
    html += '   </div>';
    html += '</div>';

    $container.html(html);
}

function showLastManStandingRules($container) {
    let html = '';

    html += '<div class="form-group">';
    html += '   <label>Rounds To Win</label>';
    html += '   <div class="input-group">';
    html += '       <input type="text" class="form-control" field="roundsToWin" />';
    html += '       <div class="input-group-text">Rounds</div>';
    html += '   </div>';
    html += '</div>';

    $container.html(html);
}

function buildGameplayRules() {
    let $gameplayRules = $('#gameplay-rules');
    let rules = {};
    $gameplayRules.find('input, select').each(function() {
        rules[$(this).attr('field')] = $(this).val();
    });
    return rules;
}