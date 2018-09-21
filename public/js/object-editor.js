function editObject($object, isPrefab) {
    let objectInfo = $object.data('info');
    let $objectEditor = $('#object-editor').empty();
    let html = '';

    if (isPrefab) {
        html += '<div class="form-group">';
        html += '    <label>Prefab Name:</label>';
        html += '   <div class="input-group">';
        html += '       <input type="text" class="form-control prefab-name" />';
        html += '   </div>';
        html += '</div>';
    }
    html += '<div style="display: table; width: 100%;" class="mb-3">';
    html += '   <div class="form-group" style="display: table-cell;">';
    html += '       <label class="check-container"> Stuckable';
    html += '           <input type="checkbox" class="stuckable" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '       <label class="check-container"> Climbable';
    html += '           <input type="checkbox" class="climbable" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '       <label class="check-container"> Bumpable';
    html += '           <input type="checkbox" class="bumpable" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '       <div class="bumpable-options mb-3">';
    html += '           <div class="input-group" style="width: 160px;">';
    html += '               <div class="input-group-text">Height</div>';
    html += '               <input type="number" class="form-control bump-height" />';
    html += '           </div>';
    html += '       </div>';
    html += '       <label class="check-container"> Obstacle';
    html += '           <input type="checkbox" class="obstacle" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '   </div>';
    html += '   <div class="form-group" style="display: table-cell;">';

    if (isPrefab)
        html += '        <div class="btn btn-success btn-sm btn-block save-prefab">Save Prefab</div>';
    else
        html += '        <div class="btn btn-primary btn-sm btn-block make-prefab">Make Prefab</div>';

    html += '        <div class="btn btn-primary btn-sm btn-block edit-animations">Animations</div>';
    html += '   </div>';
    html += '</div>';
    html += '<div class="form-group relative containment">';
    html += '   <img class="full-width" src="' + objectInfo.image + '" />';
    html += '   <div class="collider">' +
        '           <div class="ui-resizable-handle ui-resizable-nw" id="nwgrip"></div>' +
        '           <div class="ui-resizable-handle ui-resizable-ne" id="negrip"></div>' +
        '           <div class="ui-resizable-handle ui-resizable-sw" id="swgrip"></div>' +
        '           <div class="ui-resizable-handle ui-resizable-se" id="segrip"></div>' +
        '           <div class="ui-resizable-handle ui-resizable-n" id="ngrip"></div>' +
        '           <div class="ui-resizable-handle ui-resizable-s" id="sgrip"></div>' +
        '           <div class="ui-resizable-handle ui-resizable-e" id="egrip"></div>' +
        '           <div class="ui-resizable-handle ui-resizable-w" id="wgrip"></div>' +
        '       </div>';
    html += '</div>';

    if(isPrefab)
        html += '<div class="btn btn-danger btn-sm btn-block delete-prefab">Delete Prefab</div>';

    // must be called before initialising the collider because it has no width to rely on
    showToolboxTab('object-editor');

    $objectEditor.append(html);
    let $bumpable = $objectEditor.find('.bumpable');
    let $bumpableOptions = $objectEditor.find('.bumpable-options');
    let $bumpHeight = $objectEditor.find('.bump-height');

    $bumpable.prop('checked', objectInfo.bumpable).on('change', function () {
        objectInfo.bumpable = $(this).is(':checked');
        showOrHideBumpableOptions($bumpable, $bumpableOptions);
        if (!objectInfo.bumpable)
            delete objectInfo.bumpPower;
    });

    $bumpHeight.val(objectInfo.bumpHeight).on('input', function () {
        objectInfo.bumpHeight = $(this).val();
    });

    showOrHideBumpableOptions($bumpable, $bumpableOptions);

    let $stuckable = $objectEditor.find('.stuckable');
    $stuckable.prop('checked', objectInfo.stuckable).on('change', function () {
        objectInfo.stuckable = $(this).is(':checked');
    });

    let $climbable = $objectEditor.find('.climbable');
    $climbable.prop('checked', objectInfo.climbable).on('change', function () {
        objectInfo.climbable = $(this).is(':checked');
    });

    let $obstacle = $objectEditor.find('.obstacle');
    $obstacle.prop('checked', objectInfo.obstacle).on('change', function () {
        objectInfo.obstacle = $(this).is(':checked');
    });

    let $makePrefab = $objectEditor.find('.make-prefab');
    $makePrefab.on('click', function () {
        createPrefab($object);
    });

    let $prefabName = $objectEditor.find('.prefab-name');
    $prefabName.val(objectInfo.name).on('input', function() {
        objectInfo.name = $prefabName.val();
    });

    let $savePrefab = $objectEditor.find('.save-prefab');
    $savePrefab.on('click', function () {
        if($prefabName.val())
            updatePrefab(objectInfo);
    });

    let $deletePrefab = $objectEditor.find('.delete-prefab');
    $deletePrefab.on('click', function () {
        if(confirm('Delete prefab ' + objectInfo.name + '?'))
            deletePrefab(objectInfo._id).then(() => {
                loadPrefabs();
                showToolboxTab('prefabs');
            });
    });

    let $editAnimations = $objectEditor.find('.edit-animations');
    $editAnimations.on('click', function() {
        showAnimationsDialog($object, isPrefab ? 'prefab' : 'gameObject');
    });

    handleCollider($object);
}

function handleCollider($object) {
    let objectInfo = $object.data('info');
    let $objectEditor = $('#object-editor');
    let $collider = $objectEditor.find('.collider');
    let $containment = $objectEditor.find('.containment');

    let actualPadding = {
        top: _.get(objectInfo, 'padding.top', 0) / $object.height() * $containment.height(),
        left: _.get(objectInfo, 'padding.left', 0) / $object.width() * $containment.width(),
        right: _.get(objectInfo, 'padding.right', 0) / $object.width() * $containment.width(),
        bottom: _.get(objectInfo, 'padding.bottom', 0) / $object.height() * $containment.height(),
    };

    $collider.css({
        top: actualPadding.top,
        left: actualPadding.left,
        width: $containment.width() - actualPadding.right - actualPadding.left,
        height: $containment.height() - actualPadding.bottom - actualPadding.top,
    });

    $collider.resizable({
        containment: $containment,
        handles: {
            'nw': '#nwgrip',
            'ne': '#negrip',
            'sw': '#swgrip',
            'se': '#segrip',
            'n': '#ngrip',
            'e': '#egrip',
            's': '#sgrip',
            'w': '#wgrip'
        },
        stop: function () {
            let newPaddingRight = $containment.width() - parseInt($collider.css('width')) - parseInt($collider.css('left'));
            let newPaddingBottom = $containment.height() - parseInt($collider.css('height')) - parseInt($collider.css('top'));

            objectInfo.padding = {
                top: Math.round(parseInt($collider.css('top')) / $containment.height() * $object.height()),
                left: Math.round(parseInt($collider.css('left')) / $containment.width() * $object.width()),
                right: Math.round(newPaddingRight / $containment.width() * $object.width()),
                bottom: Math.round(newPaddingBottom / $containment.height() * $object.height()),
            };
        }
    });
}

function showOrHideBumpableOptions($bumpable, $bumpableOptions) {
    if ($bumpable.is(':checked'))
        $bumpableOptions.show();
    else
        $bumpableOptions.hide();
}