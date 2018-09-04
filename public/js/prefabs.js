$(function () {
    loadPrefabs();
});

function loadPrefabs() {
    $.ajax({
        url: 'prefabs',
        method: 'GET',
        success: function (prefabs) {
            prefabs = prefabs.sort((a, b) => new Date(b.created) - new Date(a.created));

            let $prefabs = $('#prefabs').empty();
            prefabs.forEach(prefab => {
                let html = '';

                html += '<div class="prefab-container text-center cp">';
                html += '   <img class="draggable prefab toolbox-object" src="' + prefab.image + '" />';
                html += '   <div>' + htmlEncode(prefab.name) + '</div>';
                html += '</div>';

                let $prefabContainer = $(html);
                let $prefab = $prefabContainer.find('.prefab');
                $prefab.data('info', prefab);
                $prefabContainer.on('click', function() {
                    editObject($prefab, true);
                });

                $prefabs.append($prefabContainer);
            });

            setToolboxObjectsDraggable();
        }
    });
}

function deletePrefab(prefabId) {
    return new Promise(function(resolve) {
        $.ajax({
            url: 'prefabs/' + prefabId,
            method: 'DELETE',
            success: resolve
        });
    });
}

function createPrefab($object) {
    let params = buildGameObject($object);
    params.name = 'Untitled';
    $.ajax({
        url: 'prefabs',
        method: 'POST',
        data: params,
        success: function () {
            showToast('success', 'Prefab created');
            loadPrefabs();
            showToolboxTab('prefabs');
        }
    });
}

function updatePrefab(prefab) {
    $.ajax({
        url: 'prefabs/' + prefab._id,
        method: 'PUT',
        data: prefab,
        success: function () {
            showToast('success', 'Prefab saved');
            loadPrefabs();
            showToolboxTab('prefabs');
        }
    });
}