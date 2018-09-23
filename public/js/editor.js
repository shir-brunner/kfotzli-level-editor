$(function () {
    setEditorDroppable();

    $('#editor').on('scroll', updateMiniMapRect);
    $(window).on('resize', function () {
        updateMiniMap();
    });
});

function setEditorDroppable() {
    let $editor = $('#editor');
    let $level = $editor.find('#level');
    let $gameObjects = $level.find('#game-objects');
    let $spawnPoints = $level.find('#spawn-points');
    let $flags = $level.find('#flags');

    $editor.droppable({
        accept: '.toolbox-object, .world-object, .spawn-point, .flag',
        drop: function (event, ui) {
            if (isDialogOpen())
                return;

            let $draggable = $(ui.helper);
            let position = $draggable.position();

            if ($(ui.draggable).hasClass('toolbox-spawn-point')) {
                let left = position.left + $editor.scrollLeft();
                let top = position.top + $editor.scrollTop();
                let $spawnPoint = createSpawnPoint({
                    x: Math.round(left / SQUARE_SIZE) * SQUARE_SIZE,
                    y: Math.round(top / SQUARE_SIZE) * SQUARE_SIZE,
                    team: $(ui.draggable).attr('team'),
                    image: $(ui.draggable).attr('src')
                }).appendTo($spawnPoints);
                setSpawnPointDraggable($spawnPoint);
            } else if ($(ui.draggable).hasClass('toolbox-flag')) {
                let left = position.left + $editor.scrollLeft();
                let top = position.top + $editor.scrollTop();
                let $flag = createFlag({
                    x: Math.round(left / SQUARE_SIZE) * SQUARE_SIZE,
                    y: Math.round(top / SQUARE_SIZE) * SQUARE_SIZE,
                    team: $(ui.draggable).attr('team'),
                }).appendTo($flags);
                setFlagDraggable($flag);
            } else if ($draggable.hasClass('toolbox-object')) {
                let left = position.left + $editor.scrollLeft();
                let top = position.top + $editor.scrollTop();
                let info = getDefaultInfoFromToolboxObject($(ui.draggable));
                let $object = createWorldObject(_.assign(info,{ image: $draggable.attr('src') }));
                $object.css({
                    left: Math.round(left / SQUARE_SIZE) * SQUARE_SIZE,
                    top: Math.round(top / SQUARE_SIZE) * SQUARE_SIZE
                });
                $gameObjects.append($object);
                setObjectDraggable($object);
            } else {
                $draggable.css({
                    left: Math.round(position.left / SQUARE_SIZE) * SQUARE_SIZE,
                    top: Math.round(position.top / SQUARE_SIZE) * SQUARE_SIZE
                });
            }

            $draggable.css('width', SQUARE_SIZE);
            $draggable.css('height', SQUARE_SIZE);

            updateMiniMap();
        }
    });
}

function getDefaultInfoFromToolboxObject($toolboxObject) {
    let info = {};

    if ($toolboxObject.parents('#ground-objects').length)
        info.stuckable = true;

    return info;
}