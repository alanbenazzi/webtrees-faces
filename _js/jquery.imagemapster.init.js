jQuery(document).bind("cbox_complete", function() {
    var id = Date.now(),
        $target = jQuery().colorbox.element(),
        $map = jQuery($target.data("objeNote")),
        $image = jQuery("img.cboxPhoto");
    if ($map && $map.is('map')) {
        $map.attr("name", id);
        $image.attr("usemap", "#" + id)
            .after($map);
        var pids = [];
        $map.find('area').each(function() {
            pids.push(jQuery(this).data('pid'));
        });
        if (pids.length) {
            $image.mapster({
                isSelectable: false,
                wrapClass: 'pnwim-photo-wrapper',
                mapKey: 'data-pid',
                fillColor: '000000',
                fillOpacity: 0,
                stroke: true,
                strokeColor: '3b5998',
                strokeWidth: 2,
                showToolTip: true,
                onClick: function(data) {
                    if (data.key && $(data.e.target).data('found')) {
                        window.location = 'individual.php?pid=' + data.key;
                    }
                    return false;
                }
            });
            jQuery.ajax({
                url: 'module.php',
                type: 'GET',
                data: {
                    mod: 'photo_note_with_image_map',
                    mod_action: 'search_pids',
                    pids: pids
                }
            }).done(function(data) {
                var areas = [],
                    text = [];
                jQuery.each(data, function(key, item) {
                    $map.find('area[data-pid="' + item.pid + '"]').data('found', item.found);
                    var link = item.found ? 'individual.php?pid=' + item.pid : '#';
                    areas.push({
                        key: item.pid,
                        toolTip: '<div class="pnwim-tooltip-wrapper">' +
                        '<p class="pnwim-tooltip-name">' + item.name + '</p>' +
                        '<p class="pnwim-tooltip-life">' + item.life + '</p>' +
                        '</div>'
                    });
                    text.push('<a href="' + link + '" class="pnwim-title-name" data-pid="' + item.pid + '">' + item.name + '</a>');
                });
                $image.mapster('set_options', {
                    areas: areas
                });
                jQuery('#cboxTitle').html(text.join('<span class="pnwim-title-separator">, </span>'));
                jQuery('.pnwim-title-name').hover(function(e) {
                    $image.mapster('set', null, $(e.target).data('pid'));
                });
            });
        }
    }
});