function editObject($object, isPrefab) {
    let objectInfo = $object.data('info');
    let $objectEditor = $('#object-editor').empty();
    let html = '';

    let slopeOptions = '';
    slopeOptions += '<option value="flat">Flat</option>';
    slopeOptions += '<option value="right">Right</option>';
    slopeOptions += '<option value="left">Left</option>';

    if (isPrefab) {
        html += '<div class="form-group">';
        html += '   <label>Prefab Name:</label>';
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
    html += '       <label class="check-container"> Invisible';
    html += '           <input type="checkbox" class="invisible" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '       <label class="check-container"> Stick To Grid (X)';
    html += '           <input type="checkbox" class="stick-x" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '       <label class="check-container"> Stick To Grid (Y)';
    html += '           <input type="checkbox" class="stick-y" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '   </div>';
    html += '   <div class="form-group" style="display: table-cell;">';

    if (isPrefab)
        html += '        <div class="btn btn-success btn-sm btn-block save-prefab">Save Prefab</div>';
    else
        html += '        <div class="btn btn-primary btn-sm btn-block make-prefab">Make Prefab</div>';

    html += '        <div class="btn btn-primary btn-sm btn-block edit-animations">Animations</div>';
    html += '        <div style="margin-top: 15px;">ID: <input class="form-control identifier" type="text" /></div>';
    html += '        <div style="margin-top: 15px;">Z-Index: <input class="form-control z-index" type="text" /></div>';
    html += '        <div style="margin-top: 15px;">Slope: <select class="form-control slope">' + slopeOptions + '</select></div>';
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

    if (isPrefab)
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

    let $identifier = $objectEditor.find('.identifier');
    $identifier.val(objectInfo.identifier).on('input', function () {
        objectInfo.identifier = $(this).val();
    });

    let $slope = $objectEditor.find('.slope');
    $slope.val(objectInfo.slope).on('input', function () {
        objectInfo.slope = $(this).val();
    });

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

    let $invisible = $objectEditor.find('.invisible');
    $invisible.prop('checked', objectInfo.invisible).on('change', function () {
        objectInfo.invisible = $(this).is(':checked');
    });

    let $stickX = $objectEditor.find('.stick-x');
    $stickX.prop('checked', objectInfo.stickToGrid.x).on('change', function () {
        objectInfo.stickToGrid.x = $(this).is(':checked');
    });

    let $stickY = $objectEditor.find('.stick-y');
    $stickY.prop('checked', objectInfo.stickToGrid.y).on('change', function () {
        objectInfo.stickToGrid.y = $(this).is(':checked');
    });

    let $zIndex = $objectEditor.find('.z-index');
    $zIndex.val(objectInfo.zIndex).on('input', function () {
        objectInfo.zIndex = $(this).val();
        $object.css('z-index', objectInfo.zIndex);
    });

    let $makePrefab = $objectEditor.find('.make-prefab');
    $makePrefab.on('click', function () {
        createPrefab($object);
    });

    let $prefabName = $objectEditor.find('.prefab-name');
    $prefabName.val(objectInfo.name).on('input', function () {
        objectInfo.name = $prefabName.val();
    });

    let $savePrefab = $objectEditor.find('.save-prefab');
    $savePrefab.on('click', function () {
        if ($prefabName.val())
            updatePrefab(objectInfo);
    });

    let $deletePrefab = $objectEditor.find('.delete-prefab');
    $deletePrefab.on('click', function () {
        if (confirm('Delete prefab ' + objectInfo.name + '?'))
            deletePrefab(objectInfo._id).then(() => {
                loadPrefabs();
                showToolboxTab('prefabs');
            });
    });

    let $editAnimations = $objectEditor.find('.edit-animations');
    $editAnimations.on('click', function () {
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

function editMultipleObjects($objects) {
    let $objectEditor = $('#object-editor').empty();
    let html = '';

    html += '<h3>Editing ' + $objects.length + ' objects</h3><hr/>';
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
    html += '       <label class="check-container"> Obstacle';
    html += '           <input type="checkbox" class="obstacle" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '       <label class="check-container"> Invisible';
    html += '           <input type="checkbox" class="invisible" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '       <label class="check-container"> Stick To Grid (X)';
    html += '           <input type="checkbox" class="stick-x" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '       <label class="check-container"> Stick To Grid (Y)';
    html += '           <input type="checkbox" class="stick-y" />';
    html += '           <span class="checkmark"></span>';
    html += '       </label>';
    html += '   </div>';
    html += '   <div class="form-group" style="display: table-cell;">';
    html += '        <div style="margin-top: 15px;">Z-Index: <input class="form-control z-index" type="text" /></div>';
    html += '   </div>';
    html += '</div>';

    showToolboxTab('object-editor');

    $objectEditor.append(html);

    let infos = $objects.map(function () {
        return $(this).data('info');
    }).get();

    let editableProps = ['stuckable', 'climbable', 'obstacle', 'invisible',
        { className: 'stick-x', field: 'stickToGrid.x' },
        { className: 'stick-y', field: 'stickToGrid.y' },
        { className: 'z-index', field: 'zIndex', type: 'text' },
        { className: 'slope', field: 'slope', type: 'text' }
    ];

    editableProps.forEach(prop => {
        let className = typeof prop === 'string' ? prop : prop.className;
        let field = typeof prop === 'string' ? prop : prop.field;
        let type = typeof prop === 'string' ? 'checkbox' : prop.type || 'checkbox';

        let $field = $objectEditor.find('.' + className);
        if (type === 'checkbox') {
            let isAllChecked = _.every(infos, info => _.get(info, field));
            $field.prop('checked', isAllChecked).on('change', function () {
                infos.forEach(info => _.set(info, field, $(this).is(':checked')));
            });
        } else if (type === 'text') {
            $field.on('input', function () {
                infos.forEach(info => _.set(info, field, $(this).val()));
                className === 'z-index' && $objects.css('z-index', $(this).val());
            });
        }
    });
}