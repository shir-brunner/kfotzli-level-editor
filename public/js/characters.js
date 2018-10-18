$(function () {
    loadCharacters();

    let $newCharacter = $('#new-character');
    $newCharacter.on('click', function () {
        editCharacter();
    });
});

function loadCharacters() {
    $.ajax({
        url: 'characters',
        method: 'GET',
        success: function (characters) {
            characters = characters.sort((a, b) => new Date(b.created) - new Date(a.created));

            let $characters = $('#characters').empty();
            characters.forEach(character => {
                let html = '';

                html += '<div class="character text-center cp">';
                html += '   <img src="' + character.image + '" />';
                html += '   <div>' + htmlEncode(character.name) + '</div>';
                html += '</div>';

                let $character = $(html);
                $character.data('info', character);
                $character.on('click', function () {
                    editCharacter($character);
                });

                $characters.append($character);
            });

            if (!characters.length)
                $characters.append('<div class="empty-message">Characters will be listed here</div>');
        }
    });
}

function editCharacter($character) {
    let characterInfo = $character && $character.data('info');
    let $dialog = showDialog(characterInfo ? 'Edit Character' : 'New Character');
    let $dialogBody = $dialog.find('.dialog-body');

    let html = '';

    html += '<div class="row p-4">';
    html += '   <div class="col-sm">';
    html += '       <div class="images"></div>';
    html += '   </div>';
    html += '   <div class="col-sm">';
    html += '       <div class="form-group">';
    html += '           <label>Character Name</label>';
    html += '           <input type="text" class="form-control character-name" />';
    html += '       </div>';
    html += '       <div class="form-group">';
    html += '           <label>Speed</label>';
    html += '           <input type="number" class="form-control speed" />';
    html += '       </div>';
    html += '       <div class="form-group">';
    html += '           <label>Jump Height</label>';
    html += '           <input type="number" class="form-control jump-height" />';
    html += '       </div>';
    html += '       <div class="form-group">';
    html += '           <label>Climb Speed</label>';
    html += '           <input type="number" class="form-control climb-speed" />';
    html += '       </div>';
    html += '       <div class="form-group">';
    html += '           <label>Team</label>';
    html += '           <select class="form-control team">';
    html += '               <option value="red">Red</option>';
    html += '               <option value="blue">Blue</option>';
    html += '               <option value="green">Green</option>';
    html += '               <option value="yellow">Yellow</option>';
    html += '               <option value="brown">Brown</option>';
    html += '           </select>';
    html += '       </div>';
    html += '       <hr class="mt-5"/>';
    html += '       <div class="form-group">';

    if (characterInfo) {
        html += '           <div class="btn btn-danger delete-character float-left">Delete Character</div>';
    }

    html += '           <div class="btn btn-success save-character float-right">' + (characterInfo ? 'Save Character' : 'Create Character') + '</div>';
    html += '           <div class="btn btn-primary float-right mr-2 animations">Animations</div>';
    html += '       </div>';
    html += '   </div>';
    html += '</div>';

    $dialogBody.html(html);
    let $images = $dialogBody.find('.images');
    window.assets.characters.forEach(characterImage => {
        let fullPath = 'img/characters/' + characterImage;
        let $image = $('<img class="character-image cp" src="' + fullPath + '" />');
        $images.append($image);
        if (characterInfo && fullPath === characterInfo.image)
            $image.addClass('selected');
    });

    let $characterName = $dialogBody.find('.character-name').val(characterInfo && characterInfo.name);
    let $speed = $dialogBody.find('.speed').val(characterInfo && characterInfo.speed);
    let $jumpHeight = $dialogBody.find('.jump-height').val(characterInfo && characterInfo.jumpHeight);
    let $climbSpeed = $dialogBody.find('.climb-speed').val(characterInfo && characterInfo.climbSpeed);
    let $team = $dialogBody.find('.team').val(characterInfo && characterInfo.team);

    $images.on('click', '.character-image', function () {
        $images.find('.character-image').removeClass('selected');
        $(this).addClass('selected');
    });

    let $animations = $dialogBody.find('.animations');
    $animations.on('click', function () {
        if (!characterInfo)
            return;

        showToolboxTab('creatures');
        showAnimationsDialog($character, 'character');
    });

    if (!characterInfo)
        $animations.addClass('disabled');

    let $saveCharacter = $dialogBody.find('.save-character');
    $saveCharacter.on('click', function () {
        if (!validateCharacterForm($dialogBody))
            return;

        createOrUpdateCharacter({
            _id: characterInfo && characterInfo._id,
            name: $characterName.val(),
            speed: $speed.val(),
            jumpHeight: $jumpHeight.val(),
            climbSpeed: $climbSpeed.val(),
            team: $team.val(),
            image: $dialogBody.find('.character-image.selected').attr('src'),
        }, () => loadCharacters());
        closeDialog();
    });

    let $deleteCharacter = $dialogBody.find('.delete-character');
    $deleteCharacter.on('click', function() {
        if(!confirm(`Delete character ${characterInfo.name} for sure?`))
            return;

        deleteCharacter(characterInfo._id, () => loadCharacters());
        closeDialog();
    });
}

function validateCharacterForm($dialogBody) {
    let $name = $dialogBody.find('.character-name');
    let $speed = $dialogBody.find('.speed');
    let $jumpHeight = $dialogBody.find('.jump-height');
    let $climbSpeed = $dialogBody.find('.climb-speed');
    let $team = $dialogBody.find('.team');
    let $selectedImage = $dialogBody.find('.character-image.selected');

    if(!$name.val()) {
        showToast('error', 'Character must have a name');
        $name.focus();
        return false;
    }

    if(!$speed.val()) {
        showToast('error', 'Character speed is not defined');
        $speed.focus();
        return false;
    }

    if(!$jumpHeight.val()) {
        showToast('error', 'Character jump height is not defined');
        $jumpHeight.focus();
        return false;
    }


    if(!$climbSpeed.val()) {
        showToast('error', 'Character climb speed is not defined');
        $climbSpeed.focus();
        return false;
    }

    if(!$team.val()) {
        showToast('error', 'Character must have a team');
        $team.focus();
        return false;
    }

    if (!$selectedImage.length) {
        showToast('error', 'Character must have an image');
        return false;
    }

    return true;
}

function createOrUpdateCharacter(characterInfo, callback) {
    $.ajax({
        url: '/characters' + (characterInfo._id ? '/' + characterInfo._id : ''),
        method: characterInfo._id ? 'PUT' : 'POST',
        data: characterInfo,
        success: () => {
            showToast('success', 'Character ' + characterInfo.name + ' ' + (characterInfo._id ? 'saved' : 'created'));
            callback();
        }
    });
}

function deleteCharacter(characterId, callback) {
    $.ajax({
        url: '/characters/' + characterId,
        method: 'DELETE',
        success: () => callback()
    });
}