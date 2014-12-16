/* vim: set expandtab sw=2 ts=2 : */

$(function() {
  // buildFolderExplorer START
  function buildFolderExplorer(folderExplorer, treeData) {
    folderExplorer.fancytree({
        checkbox: true,
        autoCollapse: true,
        autoScroll: true,
        selectMode: 3,
        source: treeData,
        select: function(event, data) {
          var filesCount = 0;
          data.tree.visit(function(node){
            if(!node.folder) filesCount += 1;
          });
          var selectedFiles = $.map(data.tree.getSelectedNodes(), function(node){
            if(node.folder) return null;
            var filename = node.title;
            while(node.parent) {
              var parent = node.parent;
              filename = parent.title + '/' + filename;
              node = parent;
            }
            return filename.replace(/^root/, '');
          });
          // Download callback
          $('#btn-download-selected-files')
            .text('下载(' + selectedFiles.length + '/' + filesCount + ')')
            .unbind('click')
            .click(function() {
              $('#folderModal').modal('hide');
              console.log('Select ' + selectedFiles);
              /*
               * selectedFiles is a Array as:
               * Array [ "/资料包/英语", "/资料包/英语/四级.rmvb", "/资料包/英语/CET6.mp4" ]
               * 
               * ############# Write your code here #################
               */
            });
        }
    });
    // select all(default)
    $('#folder-explorer').fancytree('getTree').visit(function(node){
      node.setSelected(true);
    });

  }
  // buildFolderExplorer END
  
  /*
   * Main entrance
   */
  /*
   * data is a Array. We only use the first item(Array[0]).
   * 
   * ############# Write your code here #################
   */
  var data = [{
    title: '资料包',
    folder: true,
    expanded: true,
    children: [
      {
        title: '英语',
        folder: true,
        children: [
          { title: '四级.rmvb' },
          { title: 'CET6.mp4' }
        ]
      },
      {
        title: '计算机',
        folder: true,
        children: [
          { title: '操作系统.pdf' },
          {
            title: '数据结构',
            folder: true,
            children: [
              { title: '数据结构1.txt' },
              { title: '数据结构2.txt' }
            ]
          }
        ]
      }
    ]
  }];
  var selectedFiles;
  buildFolderExplorer($('#folder-explorer'), data);

  /*
   * Change Tab(Not necessary)
   */
  $('#tab1').click(function() {
    $('#container_resources').show();
    $('#container_download_resources').hide();
  });
  $('#tab2').click(function() {
    $('#container_download_resources').show();
    $('#container_resources').hide();
  });
  $('#tab1').click();

  /*
   * Folder Events
   */
  $('#btn-select-all').click(function() {
      $('#folder-explorer').fancytree('getTree').visit(function(node){
        node.setSelected(true);
      });
      return false;
  });
  $('#btn-deselect-all').click(function() {
      $('#folder-explorer').fancytree('getTree').visit(function(node){
        node.setSelected(false);
      });
      return false;
  });

  // download
  $('#btn-download-me').click(function() {
    $('#folderModal').modal();
  });
  $('#btn-cancel-download').click(function() {
    $('#folderModal').modal('hide');
  });
})
