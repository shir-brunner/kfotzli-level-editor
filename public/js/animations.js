let animationPreviewIntervals = {};

function showAnimationsDialog($object, resourceType) {
    let $dialog = showDialog();
    let $dialogBody = $dialog.find('.dialog-body');

    $dialogBody.html('<table class="animations-table"><tr class="bg-secondary text-white"><th>Animation</th><th></th><th>Frames</th><th>Preview</th></tr></table>');
    let $animationsTable = $dialogBody.find('table');

    if(resourceType === 'prefab')
        $dialogBody.append('<div class="btn btn-success save-prefab float-right mt-3">Save Prefab</div>');
    else if(resourceType === 'character')
        $dialogBody.append('<div class="btn btn-success save-character float-right mt-3">Save Character Animations</div>');

    let objectInfo = $object.data('info');
    let animationTypes = ['idle', 'walkLeft', 'walkRight', 'climb', 'jumpLeft', 'jumpRight', 'death', 'bump'];
    $animationsTable.append(animationTypes.map(animationType => {
        return getAnimationRow(animationType, objectInfo);
    }));

    let $savePrefab = $dialogBody.find('.save-prefab');
    $savePrefab.on('click', function() {
        updatePrefab(objectInfo);
        closeDialog();
    });

    let $saveCharacter = $dialogBody.find('.save-character');
    $saveCharacter.on('click', function() {
        createOrUpdateCharacter(objectInfo, () => loadCharacters());
        closeDialog();
    });
}

function getAnimationRow(animationType, objectInfo) {
    let html = '';

    html += '<tr>';
    html += '   <td style="width: 100px;" class="bg-secondary text-white text-center">' + htmlEncode(spaceBeforeCapitals(capitalize(animationType))) + '</td>';
    html += '   <td style="width: 140px; padding: 20px;"><label><input type="checkbox" class="repeatable" /> Repeatable</label></td>';
    html += '   <td style="padding: 0;"><div class="frames"></div></td>';
    html += '   <td style="width: 100px;"><img class="animation-preview" /></td>';
    html += '</tr>';

    let $animationRow = $(html);
    let $frames = $animationRow.find('.frames');
    let $animationPreview = $animationRow.find('.animation-preview');
    let $repeatable = $animationRow.find('.repeatable');
    let repeatable = _.get(objectInfo, `animations.${animationType}.repeatable`);

    $repeatable.prop('checked', repeatable).on('change', function() {
        _.set(objectInfo, `animations.${animationType}.repeatable`, $repeatable.is(':checked'));
    });

    $frames.append('<i class="fa fa-trash fa-4x trash"></i>');
    let $trash = $frames.find('.trash');

    $frames.droppable({
        accept: '.toolbox-object',
        drop: function(event, ui) {
            let imageSrc = $(ui.helper).attr('src');
            let $frame = createAnimationFrame(imageSrc);
            $frames.append($frame);

            updateFrames(animationType, $frames, objectInfo);
        }
    });

    $frames.sortable({
        axis: 'x',
        start: function() {
            $trash.fadeIn();
        },
        stop: function(event, ui) {
            let $frame = $(ui.item);
            let trashX = parseInt($trash.css('left'));
            if(ui.position.left < (trashX + $trash.width()))
                $frame.remove();

            $trash.fadeOut();
            updateFrames(animationType, $frames, objectInfo);
        },
        containment: $frames
    });

    let existingFrames = _.get(objectInfo, `animations.${animationType}.frames`, []);
    $frames.append(existingFrames.map(frame => createAnimationFrame(frame)));

    let intervalId = setInterval(updateAnimationPreview, 100);
    animationPreviewIntervals[intervalId] = intervalId;

    let frameIndex = 0;
    function updateAnimationPreview() {
        let frames = _.get(objectInfo, `animations.${animationType}.frames`, []);
        if(frameIndex >= frames.length)
            frameIndex = 0;

        let frame = frames[frameIndex];
        frameIndex++;

        $animationPreview.attr('src', frame);
    }

    return $animationRow;
}

function updateFrames(animationType, $frames, objectInfo) {
    let frames = $frames.find('.frame').map(function() {
        return $(this).attr('src');
    }).get();

    _.set(objectInfo, `animations.${animationType}.frames`, frames);
}

function createAnimationFrame(imageSrc) {
    return $('<img class="frame" />').attr('src', imageSrc)
}