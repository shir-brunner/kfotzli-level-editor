$(function () {
    setEditorDroppable();
    $('#editor').on('scroll', updateMiniMapRect);
    $(window).on('resize', function () {
        updateMiniMap();
    });

    initDragSelector();

    let $level = $('#level');
    $(document).on('keydown', function (e) {
        if (e.keyCode === 46) { // 46 === DELETE
            $level.find('.draggable.selected').remove();
        }
    })
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
            let objectInfo = $draggable.data('info') || {};

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
                    image: $(ui.draggable).attr('src')
                }).appendTo($flags);
                setFlagDraggable($flag);
            } else if ($draggable.hasClass('toolbox-object')) {
                let left = position.left + $editor.scrollLeft();
                let top = position.top + $editor.scrollTop();
                let info = getDefaultInfoFromToolboxObject($(ui.draggable));
                let $object = createWorldObject(_.assign(info, { image: $draggable.attr('src') }));
                $object.css({
                    left: Math.round(left / SQUARE_SIZE) * SQUARE_SIZE,
                    top: Math.round(top / SQUARE_SIZE) * SQUARE_SIZE
                });
                $gameObjects.append($object);
                setObjectDraggable($object);
            } else {
                $draggable.css({
                    left: _.get(objectInfo, 'stickToGrid.x') === false ? position.left : Math.round(position.left / SQUARE_SIZE) * SQUARE_SIZE,
                    top: _.get(objectInfo, 'stickToGrid.y') === false ? position.top : Math.round(position.top / SQUARE_SIZE) * SQUARE_SIZE
                });
            }

            $draggable.css('width', objectInfo.width || SQUARE_SIZE);
            $draggable.css('height', objectInfo.width ? 'auto' : SQUARE_SIZE);

            updateMiniMap();
        }
    });
}

function getDefaultInfoFromToolboxObject($toolboxObject) {
    let info = {
        stickToGrid: { x: true, y: true }
    };

    if ($toolboxObject.parents('#ground-objects').length)
        info.stuckable = true;

    return info;
}

function initDragSelector() {
    let $level = $('#level');
    let $editor = $('#editor');
    let $selector = $('<div id="drag-selector"></div>').appendTo($level);
    let dragging = false;
    let startX, startY;

    $level.on('mousedown', function (e) {
        if ($(e.target).attr('id') !== 'background')
            return;

        unselectDraggables();
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;

        $selector.show().css({
            left: startX + $editor.scrollLeft(),
            top: startY + $editor.scrollTop(),
            width: 0,
            height: 0
        });
        e.preventDefault();
    }).on('mousemove', function (e) {
        if (!dragging)
            return;

        let left = startX + $editor.scrollLeft();
        let top = startY + $editor.scrollTop();
        let width = e.clientX - startX;
        let height = e.clientY - startY;

        if (width < 0) {
            left -= Math.abs(width);
            width = Math.abs(width);
        }
        if (height < 0) {
            top -= Math.abs(height);
            height = Math.abs(height);
        }

        $selector.css({
            left: left,
            top: top,
            width: width,
            height: height
        });
    }).on('mouseup', function () {
        dragging = false;

        let selectorLeft = parseInt($selector.css('left'));
        let selectorTop = parseInt($selector.css('top'));
        let selectorWidth = parseInt($selector.css('width'));
        let selectorHeight = parseInt($selector.css('height'));

        $level.find('.draggable').each(function () {
            let $draggable = $(this);
            let draggableLeft = parseInt($draggable.css('left'));
            let draggableTop = parseInt($draggable.css('top'));
            let draggableWidth = parseInt($draggable.css('width'));
            let draggableHeight = parseInt($draggable.css('height'));

            if (selectorLeft + selectorWidth >= draggableLeft &&
                selectorLeft <= draggableLeft + draggableWidth &&
                selectorTop + selectorHeight >= draggableTop &&
                selectorTop <= draggableTop + draggableHeight) {
                $draggable.addClass('selected');
            }
        });

        let $selected = $level.find('.world-object.selected');
        if ($selected.length === 1)
            editObject($selected);
        else if ($selected.length > 1)
            editMultipleObjects($selected);

        $selector.hide().css({ left: 0, top: 0 });
    });
}

function unselectDraggables() {
    $('#level').find('.draggable').removeClass('selected');
}