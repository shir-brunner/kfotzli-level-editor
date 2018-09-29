let currentLevel = null;

$(function () {
    getLevelsFromServer();

    let $saveLevel = $('#save-level');
    let loading = false;
    $saveLevel.on('click', function () {
        if (loading)
            return;
        let level = buildLevel();
        if (!validateLevel(level))
            return;

        loading = true;
        $.ajax({
            url: 'levels' + (currentLevel ? '/' + currentLevel._id : ''),
            method: currentLevel ? 'PUT' : 'POST',
            data: level,
            success: function (level) {
                showToast('success', currentLevel ? 'Level saved' : 'Level created');
                currentLevel = level;
                loading = false;
            }
        });
    });
});

function getLevelsFromServer() {
    $.ajax({
        url: 'levels',
        method: 'GET',
        success: function (levels) {
            levels = levels.sort((a, b) => new Date(b.created) - new Date(a.created));

            let $levels = $('#levels').empty();
            levels.forEach(level => {
                let html = '';

                html += '<div class="card mb-3">';
                html += '   <div class="card-header">' + htmlEncode(level.name) + ' <i class="fa fa-trash mt-1 float-right cp delete"></i></div>';
                html += '   <div class="card-body cp p-0">';
                html += '   </div>';
                html += '</div>';

                let $level = $(html);
                let $cardBody = $level.find('.card-body');
                $level.on('click', '.delete', function () {
                    if (!confirm(`Delete level ${level.name} for sure?`))
                        return;

                    deleteLevel(level._id);
                    $level.remove();
                });

                $cardBody.on('click', function () {
                    showToolboxTab('level-info');
                    loadLevel(level);
                });
                $levels.append($level);

                appendLevelPreviewTo($cardBody, level, { height: 200 });
            });
        }
    });
}

function buildLevel() {
    let $level = $('#level');
    let $levelName = $('#level-name');
    let $levelWidth = $('#level-width');
    let $levelHeight = $('#level-height');
    let $levelBackground = $('#level-background');
    let $minPlayers = $('#min-players');
    let $gameplay = $('#gameplay');

    return {
        name: $levelName.val(),
        size: {
            width: $levelWidth.val(),
            height: $levelHeight.val(),
        },
        background: $levelBackground.val(),
        gameObjects: $level.find('.world-object').map(function () {
            return buildGameObject($(this));
        }).get(),
        spawnPoints: $level.find('.spawn-point').map(function () {
            return buildSpawnPoint($(this));
        }).get(),
        minPlayers: $minPlayers.val(),
        gameplay: {
            name: $gameplay.val(),
            rules: buildGameplayRules(),
            flags: $('#flags').find('.flag').map(function () {
                return buildFlag($(this));
            }).get()
        }
    };
}

function appendLevelPreviewTo($target, level, { showSize, height } = {}) {
    if (!level.background)
        return;

    let $levelPreview = $('<div class="level-preview"></div>');
    $target.append($levelPreview);
    let $background = $('<img class="background" src="' + level.background + '" />');
    $levelPreview.append($background);

    let previewWidth = $levelPreview.width();
    if (height === 'auto')
        height = $levelPreview.parent().height();

    let previewHeight = height || (previewWidth / (level.size.width / level.size.height));
    $levelPreview.css('height', previewHeight);

    level.gameObjects.forEach(gameObject => {
        let $gameObject = $('<img src="' + gameObject.image + '" />');
        $gameObject.css({
            position: 'absolute',
            left: gameObject.x / level.size.width * previewWidth,
            top: gameObject.y / level.size.height * previewHeight,
            width: 100 / level.size.width * previewWidth,
            height: 100 / level.size.height * previewHeight,
        });
        $levelPreview.append($gameObject);
    });

    level.spawnPoints.forEach(spawnPoint => {
        let $spawnPoint = $('<img src="' + spawnPoint.image + '" />');
        $spawnPoint.css({
            position: 'absolute',
            left: spawnPoint.x / level.size.width * previewWidth,
            top: spawnPoint.y / level.size.height * previewHeight,
            width: SQUARE_SIZE / level.size.width * previewWidth,
            height: SQUARE_SIZE / level.size.height * previewHeight,
        });
        $levelPreview.append($spawnPoint);
    });

    (level.gameplay.flags || []).forEach(flag => {
        let $flag = $('<img src="' + flag.image + '" />');
        $flag.css({
            position: 'absolute',
            left: flag.x / level.size.width * previewWidth,
            top: flag.y / level.size.height * previewHeight,
            width: SQUARE_SIZE / level.size.width * previewWidth,
            height: SQUARE_SIZE / level.size.height * previewHeight,
        });
        $levelPreview.append($flag);
    });

    if (showSize) {
        let $size = $('<div class="level-preview-size">' + level.size.width + 'x' + level.size.height + '</div>');
        $levelPreview.append($size);
    }

    return $levelPreview;
}

function deleteLevel(levelId) {
    $.ajax({
        url: 'levels/' + levelId,
        method: 'DELETE',
    });
}

function loadLevel(level) {
    let $level = $('#level');
    let $gameObjects = $level.find('#game-objects').empty();
    let $spawnPoints = $level.find('#spawn-points').empty();
    let $flags = $level.find('#flags').empty();

    $('#level-name').val(level.name);
    $('#level-width').val(level.size.width);
    $('#level-height').val(level.size.height);
    $('#level-background').val(level.background);
    $('#min-players').val(level.minPlayers);
    $('#gameplay').val(level.gameplay.name);
    updateLevel();

    level.gameObjects.forEach(gameObject => {
        let $object = createWorldObject(gameObject);
        $object.css({
            left: gameObject.x,
            top: gameObject.y
        });
        $gameObjects.append($object);
        setObjectDraggable($object);
    });

    level.spawnPoints.forEach(spawnPoint => {
        let $spawnPoint = createSpawnPoint(spawnPoint).appendTo($spawnPoints);
        setSpawnPointDraggable($spawnPoint);
    });

    if (level.gameplay.flags) {
        level.gameplay.flags.forEach(flag => {
            let $flag = createFlag(flag).appendTo($flags);
            setFlagDraggable($flag);
        });
    }

    showGameplayRules(level.gameplay.name, level);
    currentLevel = level;
    updateMiniMap();
}

function validateLevel(level) {
    if (!level.spawnPoints.length) {
        showToast('error', 'Level must have at least 1 spawn points');
        return false;
    }

    if (level.spawnPoints.length > 4) {
        showToast('error', 'Level cannot have more than 4 spawn points');
        return false;
    }

    if (level.spawnPoints.length < level.minPlayers) {
        showToast('error', `Level must have at least ${level.minPlayers} spawn points`);
        return false;
    }

    if (level.gameplay.flags && hasDuplicates(level.gameplay.flags.map(flag => flag.team))) {
        showToast('error', 'Cannot have more than one flag of the same color');
        return false;
    }

    return true;
}

function createWorldObject(info = {}) {
    let $object = $('<div class="draggable world-object"></div>');
    $object.append('<img src="' + info.image + '" />');
    $object.data('info', info);
    $object.on('click', function () {
        editObject($object);
    });
    return $object;
}

function createSpawnPoint(params = {}) {
    let $spawnPoint = $('<div class="draggable spawn-point"></div>');
    $spawnPoint.append('<img src="' + params.image + '" />');
    $spawnPoint.css({ left: params.x + 'px', top: params.y + 'px' });
    $spawnPoint.data('info', _.omit(params, ['x', 'y']));
    return $spawnPoint;
}

function createFlag(params = {}) {
    let $flag = $('<div class="draggable flag"></div>');
    $flag.append('<img src="' + params.image + '" />');
    $flag.css({ left: params.x + 'px', top: params.y + 'px' });

    let info = _.omit(params, ['x', 'y']);
    _.set(info, 'animations.idle.frames', [params.image, params.image.replace(2, 1)]);
    $flag.data('info', info);
    return $flag;
}

function setObjectDraggable($object) {
    let $editor = $('#editor');
    let $level = $('#level');
    $object.draggable({
        containment: 'body',
        start: function () {
            if (pressedKeys[17]) { // 17 === CTRL
                let $clone = $object.clone();
                let info = _.cloneDeep($object.data('info'));
                $clone.data('info', info).appendTo($level);
                setObjectDraggable($clone);
                $clone.on('click', function () {
                    editObject($clone);
                });
            }
        },
        stop: function () {
            if ($object.position().left - $editor.scrollLeft() > $editor.width()) {
                $object.remove();
                updateMiniMap();
            }
        }
    });
}

function setSpawnPointDraggable($spawnPoint) {
    let $editor = $('#editor');
    let $level = $('#level');
    $spawnPoint.draggable({
        containment: 'body',
        start: function () {
            if (pressedKeys[17]) { // 17 === CTRL
                let $clone = $spawnPoint.clone();
                let info = _.cloneDeep($spawnPoint.data('info'));
                $clone.data('info', info).appendTo($level);
                setSpawnPointDraggable($clone);
            }
        },
        stop: function () {
            if ($spawnPoint.position().left - $editor.scrollLeft() > $editor.width()) {
                $spawnPoint.remove();
                updateMiniMap();
            }
        }
    });
}

function setFlagDraggable($flag) {
    let $editor = $('#editor');
    $flag.draggable({
        containment: 'body',
        stop: function () {
            if ($flag.position().left - $editor.scrollLeft() > $editor.width()) {
                $flag.remove();
                updateMiniMap();
            }
        }
    });
}

function buildGameObject($object) {
    let gameObject = $object.data('info');
    gameObject.x = parseInt($object.css('left'));
    gameObject.y = parseInt($object.css('top'));
    gameObject.width = SQUARE_SIZE;
    gameObject.height = SQUARE_SIZE;
    return gameObject;
}

function buildSpawnPoint($spawnPoint) {
    let spawnPoint = $spawnPoint.data('info');
    spawnPoint.x = parseInt($spawnPoint.css('left'));
    spawnPoint.y = parseInt($spawnPoint.css('top'));
    return spawnPoint;
}

function buildFlag($flag) {
    let flag = $flag.data('info');
    flag.x = parseInt($flag.css('left'));
    flag.y = parseInt($flag.css('top'));
    return flag;
}