let currentLevel = null;

$(function () {
    getLevelsFromServer();

    let $saveLevel = $('#save-level');
    let loading = false;
    $saveLevel.on('click', function () {
        if (loading)
            return;
        let level = buildLevel();

        if(!level.spawnPoints.length) {
            showToast('error', 'Level must have at least 1 spawn points');
            return;
        }

        if(level.spawnPoints.length > 4) {
            showToast('error', 'Level cannot have more than 4 spawn points');
            return;
        }

        if(level.spawnPoints.length < level.minPlayers) {
            showToast('error', `Level must have at least ${level.minPlayers} spawn points`);
            return;
        }

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
        spawnPoints: $level.find('.spawn-point').map(function() {
            return {
                x: parseInt($(this).css('left')),
                y: parseInt($(this).css('top')),
            };
        }).get(),
        minPlayers: $minPlayers.val()
    };
}

function appendLevelPreviewTo($target, level, { showSize, height } = {}) {
    if(!level.background)
        return;

    let $levelPreview = $('<div class="level-preview"></div>');
    $target.append($levelPreview);
    let $background = $('<img class="background" src="' + level.background + '" />');
    $levelPreview.append($background);

    let previewWidth = $levelPreview.width();
    if(height === 'auto')
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
        let $spawnPoint = $('<img src="img/items/flagRed2.png" />');
        $spawnPoint.css({
            position: 'absolute',
            left: spawnPoint.x / level.size.width * previewWidth,
            top: spawnPoint.y / level.size.height * previewHeight,
            width: 100 / level.size.width * previewWidth,
            height: 100 / level.size.height * previewHeight,
        });
        $levelPreview.append($spawnPoint);
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

    $('#level-name').val(level.name);
    $('#level-width').val(level.size.width);
    $('#level-height').val(level.size.height);
    $('#level-background').val(level.background);
    $('#min-players').val(level.minPlayers);
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
        let $spawnPoint = createSpawnPoint({
            left: spawnPoint.x,
            top: spawnPoint.y
        }).appendTo($spawnPoints);
        setSpawnPointDraggable($spawnPoint);
    });

    currentLevel = level;
    updateMiniMap();
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
    $spawnPoint.append('<img src="img/items/flagRed2.png" />');
    $spawnPoint.css(_.pick(params, ['left', 'top']));
    return $spawnPoint;
}

function setObjectDraggable($object) {
    let $editor = $('#editor');
    let $level = $('#level');
    $object.draggable({
        containment: 'body',
        start: function() {
            if(pressedKeys[17]) { // 17 === CTRL
                let $clone = $object.clone();
                let info = _.cloneDeep($object.data('info'));
                $clone.data('info', info).appendTo($level);
                setObjectDraggable($clone);
                $clone.on('click', function() {
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
        start: function() {
            if(pressedKeys[17]) { // 17 === CTRL
                let $clone = $spawnPoint.clone();
                $clone.appendTo($level);
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

function buildGameObject($object) {
    let gameObject = $object.data('info');
    gameObject.x = parseInt($object.css('left'));
    gameObject.y = parseInt($object.css('top'));
    return gameObject;
}