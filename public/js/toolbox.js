$(function () {
    setNavnarHandlers();
    getAssetsFromServer();
    setLevelInfoHandlers();
    setEditorDroppable();
    setMiniMapHandlers();
    setGameplayHandlers();

    let $toolboxNav = $('#toolbox-nav');
    $(window).on('resize', function () {
        $toolboxNav.width($toolboxNav.parent().width() - 20);
    }).trigger('resize');
});

function setNavnarHandlers() {
    let $toolbox = $('#toolbox');
    let $toolboxNav = $toolbox.find('#toolbox-nav');

    $toolboxNav.find('.btn').on('click', function () {
        let toggles = $(this).attr('toggles');
        if (toggles)
            showToolboxTab(toggles);
    });

    showToolboxTab($toolboxNav.find('.btn.default').attr('toggles'));
}

function showToolboxTab(tab) {
    let $toolbox = $('#toolbox');
    let $toolboxNav = $toolbox.find('#toolbox-nav');
    let $toolboxTabs = $toolbox.find('#toolbox-tabs');

    $toolboxNav.find('.btn').removeClass('active');
    $toolboxTabs.find('.toolbox-tab').hide();
    $toolboxTabs.find('.toolbox-tab[tab="' + tab + '"]').show();
    $toolboxNav.find('.btn[toggles="' + tab + '"]').addClass('active');

    if (tab === 'load-levels')
        $toolbox.addClass('hide-mini-map');
    else
        $toolbox.removeClass('hide-mini-map');
}

function getAssetsFromServer() {
    let $groundObjects = $('#ground-objects').empty();
    let $items = $('#items').empty();
    let $creatures = $('#creatures').empty();
    let $buildings = $('#buildings').empty();
    let $iceAssets = $('#ice').empty();

    $.ajax({
        url: 'assets',
        method: 'GET',
        success: function (assets) {
            let $levelBackground = $('#level-background');
            $levelBackground.append(assets.backgrounds.map(x => '<option value="img/backgrounds/' + htmlEncode(x) + '">' + htmlEncode(x) + '</option>'));

            $groundObjects.append(assets.grounds.map(file => '<img class="toolbox-object draggable" src="img/ground/' + file + '"/>'));
            $items.append(assets.items.map(file => '<img class="toolbox-object draggable" src="img/items/' + file + '"/>'));
            $creatures.append(assets.creatures.map(file => '<img class="toolbox-object draggable" src="img/enemies/' + file + '"/>'));
            $creatures.append(assets.characters.map(file => '<img class="toolbox-object draggable" src="img/characters/' + file + '"/>'));
            $buildings.append(assets.buildings.map(file => '<img class="toolbox-object draggable" src="img/buildings/' + file + '"/>'));
            $iceAssets.append(assets.ice.map(file => '<img class="toolbox-object draggable" src="img/ice/' + file + '"/>'));

            window.assets = assets;

            setToolboxObjectsDraggable();
            updateLevel();
        }
    });
}

function setToolboxObjectsDraggable($container) {
    let $toolbox = $container || $('#toolbox');
    $toolbox.find('.draggable').draggable({
        helper: 'clone',
        appendTo: 'body',
        containment: 'body'
    });
}

function setLevelInfoHandlers() {
    let $levelBackground = $('#level-background');
    let $levelWidth = $('#level-width');
    let $levelHeight = $('#level-height');

    $levelWidth.on('input', updateLevel);
    $levelHeight.on('input', updateLevel);
    $levelBackground.on('input', updateLevel);
}

function updateLevel() {
    let $level = $('#level');

    let $levelBackground = $('#level-background');
    let $levelWidth = $('#level-width');
    let $levelHeight = $('#level-height');

    $level.css('width', $levelWidth.val());
    $level.css('height', $levelHeight.val());
    $level.find('#background').attr('src', $levelBackground.val());

    updateMiniMap();
}

function updateMiniMap() {
    let $miniMap = $('#mini-map').empty();
    appendLevelPreviewTo($miniMap, buildLevel(), {
        showSize: true,
        height: 'auto'
    });
    $miniMap.find('.level-preview').append('<div id="mini-map-rect"></div>');
    updateMiniMapRect();
}

function updateMiniMapRect() {
    let $miniMap = $('#mini-map');
    let $miniMapRect = $('#mini-map-rect');
    let $editor = $('#editor');

    let scrollHeight = $editor[0].scrollHeight;
    let scrollWidth = $editor[0].scrollWidth;
    let editorWidth = $editor.width() - 17; //17 = scrollbar width
    let editorHeight = $editor.height() - 17; //17 = scrollbar height

    let left = $editor.scrollLeft() / scrollWidth * $miniMap.width();
    let top = $editor.scrollTop() / scrollHeight * $miniMap.height();
    let width = editorWidth / scrollWidth * $miniMap.width();
    let height = editorHeight / scrollHeight * $miniMap.height();

    $miniMapRect.css({
        left: left,
        top: top,
        width: width - 1,
        height: height - 1
    });
}

function setMiniMapHandlers() {
    let $miniMap = $('#mini-map');
    let $editor = $('#editor');

    let holding = false;
    $miniMap.on('mousedown', function () {
        holding = true;
    }).on('mousemove', function(e) {
        holding && setView(e);
    }).on('mouseup', function() {
        holding = false;
    }).on('click', setView);

    function setView(e) {
        let rect = e.currentTarget.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let offsetY = e.clientY - rect.top;
        let scrollLeft = (offsetX / $miniMap.width() * $editor[0].scrollWidth) - ($editor.width() / 2);
        let scrollTop = (offsetY / $miniMap.height() * $editor[0].scrollHeight) - ($editor.height() / 2);

        $editor.scrollLeft(scrollLeft);
        $editor.scrollTop(scrollTop);
    }
}

function setGameplayHandlers() {
    let $gameplay = $('#gameplay');
    $gameplay.on('change', () => showGameplayRules($gameplay.val()));
    showGameplayRules($gameplay.val());
}