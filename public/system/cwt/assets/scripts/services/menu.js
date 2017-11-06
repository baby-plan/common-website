//数据服务-菜单处理服务
//App.services.menu
//scripts/services/menu.js
(function (app) {
  var createTag = function (text) {
    switch (text) {
      case "new":
        return $("<span />").text("NEW").addClass("badge badge-roundless badge-danger");
      case "hot":
        return $("<span />").text("HOT").addClass("badge badge-roundless badge-warning");
      case "ok":
        return $("<span />").text("OK").addClass("badge badge-roundless badge-success");
      default:
        return $("<span />").text(text).addClass("badge badge-roundless badge-info");
    }
  }
  var initmenu = function () {
    var container = $(".hor-menu > .navbar-nav");
    var parentID = "";
    $.each(cfgs.modules, function (index, item) {
      if (item.parent == "000") { // 跟节点
        var parent = $("<li/>").addClass("mega-menu-dropdown").appendTo(container);
        parent.attr("data-id", index);
        parentID = index;
        var menu = $("<a/>")
          .attr("href", "javascript:;")
          .attr("data-toggle", "dropdown");
        if (item.icon) {
          menu.append($("<i/>").addClass(item.icon));
          menu.append(" ");
        }
        if (item.name) {
          menu.append($("<span/>").html(item.name));
          menu.append(" ");
        }
        menu.append($("<i/>").addClass("fa fa-angle-down"));
        parent.append(menu);
        var menuContainer = $("<ul/>").addClass("dropdown-menu");
        parent.append(menuContainer);
        var megacontent = $("<div/>").addClass("mega-menu-content");
        megacontent.append($("<div/>").addClass("row").append($("<div/>").addClass("tiles col-sm-12")));
        menuContainer.append($("<li/>").append(megacontent));
      } else {
        var parentItem = $("li[data-id=\"" + parentID + "\"]>ul .tiles", container);
        if (parentItem.length == 0) { return; }

        var tile = $("<a/>").appendTo(parentItem).addClass("tile");
        var tile_body = $("<div/>").addClass("tile-body").appendTo(tile);
        var tile_object = $("<div/>").addClass("tile-object").appendTo(tile);

        var css = {
          backgroundColor: item.theme,
          borderColor: '#3598dc !important',
          backgroundImage: 'none !important',
          color: '#FFFFFF !important'
        };

        if (item.iconImage) {
          css.backgroundImage = "url('assets/media/apps/" + item.iconImage + "')";
          css.backgroundRepeat = "no-repeat";
          css.backgroundPosition = "center 0px";
        } else if (item.icon) {
          tile_body.append($("<i/>").addClass(item.icon));
        } else {
          tile_body.append($("<i/>").addClass("icon-crop"));
        }


        // if (item.url == "#") {
        //   css.backgroundColor = '#ccc'
        // } else {
          if (item.theme) {
            css.backgroundColor = item.theme;
          } else {
            css.backgroundColor = '#3598dc';
          }
        // }
        tile.css(css);

        tile_object.append($("<div/>").addClass("name").append(item.name));

        if (item.url == "#") {
          tile.attr("href", "javascript:App.alert('暂时不支持该功能!');");
        } else if (item.url == undefined) {
          tile.addClass("ajaxify").attr("href", "#");
        } else {
          tile.addClass("ajaxify").attr("href", item.url);
        }
        if (item.complated) {
          tile.attr("data-complated", item.complated);
        }
      }
    });
    // 导航栏链接点击事件处理：打开窗口
    $(document).on("click", ".ajaxify", function (e) {
      e.preventDefault();
      var url = $(this).attr("href");
      if (url == "#") {
        try {
          eval($(this).attr("data-complated") + "()");
        } catch (ex) { App.alert(ex.message); }
      } else {
        App.dialog.load({ "url": $(this).attr("href"), callback: $(this).attr("data-complated") });
      }
    });
  }
  app.services.menu = {
    "init": function (parent) {
      initmenu();
    }
    , "getsids": function (tree) {
      var ids = "";
      $.each(tree.jstree().get_checked(true), function (index, item) {
        if (item.original.sid) {
          if (ids != "") {
            ids += ",";
          }
          ids += item.original.sid;
        }
      });
      return ids;
    }
  };
})(App);
