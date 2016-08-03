(function () {
    "use strict";

    var tIndex = 0;
    //Create an array of the letters in the alphabet
    var letterSrc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // Our Binding.List
    var lettersList = {};

    // Initializes the first set of tiles
    // Uses an array that will be converted into a Binding.List
    function initTiles() {
        var letters = [];
        for (var i = 0; i < 15; i++) {
            letters[i] = generateTile();
        }
        //lettersList里面存放 {letter:  counter: }对象
        lettersList = new WinJS.Binding.List(letters);

        var list2 = document.getElementById("listView2").winControl;
        //指定listView的dataSource
        list2.itemDataSource = lettersList.dataSource;
        list2.itemTemplate = document.querySelector(".tileTemplate");
        list2.forceLayout();
    }

    // 产生Tile的方法
    function generateTile() {
        var tile = {
            letter: letterSrc[Math.floor(Math.random() * letterSrc.length)],
            counter: tIndex
        };
        tIndex++;
        return tile;
    }

    // 对listView数据源重新排序
    function shuffleTiles() {
        var count = lettersList.length;
        if (count > 0) {
            for (var itemIndex = 0; itemIndex < count; itemIndex++) {
                var randomIndex = Math.floor(Math.random() * (count - itemIndex));
                lettersList.move(randomIndex, 0);
            }
        }
    }

    // 移除所选项
    function removeSelected() {
        // Get the control
        var list2 = document.getElementById("listView2").winControl;
        //listView所选中item
        if (list2.selection.count() > 0) {
            list2.selection.getItems().done(function (items) {
                //Sort the selection to ensure its in index order
                items.sort(function CompareForSort(item1, item2) {
                    var first = item1.index, second = item2.index;
                    if (first === second) {
                        return 0;
                    }
                    else if (first < second) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                });

                //Work backwards as the removal will affect the indices of subsequent items
                for (var j = items.length - 1; j >= 0; j--) {
                    // 删除数组中元素  （删除index位置的元素，1个）
                    lettersList.splice(items[j].index, 1);
                }
            });
        }
    }

    // 交换（假交换了）
    function swapSelected() {
        // Get the control, itemDataSource and selected items
        var list2 = document.getElementById("listView2").winControl;

        if (list2.selection.count() > 0) {
            list2.selection.getItems().done(function (items) {
                items.forEach(function (currentItem) {
                    lettersList.setAt(currentItem.index, generateTile());
                });
            });
        }
    }

    // 添加元素
    function addTile() {
        //Create the data for the tile
        var tile = generateTile();
        lettersList.push(tile);
    }


    //给button添加事件
    WinJS.UI.processAll().then(function () {
        var element = document.body;
        element.querySelector("#shuffle").addEventListener("click", shuffleTiles, false);
        element.querySelector("#removeSelected").addEventListener("click", removeSelected, false);
        element.querySelector("#swapSelected").addEventListener("click", swapSelected, false);
        element.querySelector("#addTile").addEventListener("click", addTile, false);

        initTiles();
    });
})();



