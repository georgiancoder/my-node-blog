$().ready(function(){
  $("div.sidemenu > ul > li").click(function(e){
    $("div.sidemenu > ul > li").removeClass('open');
    $(this).addClass('open');
    $("div.sidemenu > ul > li").each(function(){
      if(!$(this).hasClass('open')){
        $(this).find('ul').slideUp();
      }
    });

    $(this).find('ul').slideToggle();
    e.stopPropagation();
  });

  $("div.sidemenu > ul > li ul li").click(function(e){
    e.stopPropagation();
  });


  $(".menu button.edit").click(function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    var id = $(this).data('formid');
    $("#" + id).find('a.name').attr('contenteditable','true').toggleClass('editable');
    $("#" + id).find('input').each(function(){
      $(this).prop('disabled', function(i, v) { return !v; });
    });
    $("#" + id).find('.update').toggle();
  });
  $("button.delete").click(function(event){
    var that = this;
    var id = $(this).data('id');
    $.ajax({
      url: '/cms/menu/delete',
      type: 'DELETE',
      data: {id: id},
      success: function(res){
        if(res.msg == 'success'){
          $(that).parent().parent().parent().remove();
        }
      }
    })
    event.stopPropagation();
    event.stopImmediatePropagation();
  });

  var ns = $('.sortable').nestedSortable({
			handle: 'div',
			items: 'li',
			toleranceElement: '> div',
      change: function(){
        arraied = $('.sortable').nestedSortable('toArray', {startDepthCount: 0});
        console.log(arraied);
      }
		});

    $(".dellmenuitem").click(function(){
      var that = this;
      var id = $(this).data('id');
      $.ajax({
        url: '/cms/menu/deleteitem',
        type: 'DELETE',
        data: {id: id},
        success: function(res){
          if(res.msg == 'success'){
            $(that).parent().parent().remove();
          }
        }
      });
    });


    $('select').material_select();
    var ed = tinymce.init({
      selector:'.txtcontent',
      plugins: 'code',
      toolbar: 'undo redo | currentdate',
      setup: function(editor) {

        function insertGallery() {
          $("#modal1").modal('open');
          $("#insertg").click(function(event){
            event.stopPropagation();
            event.stopImmediatePropagation();
            editor.insertContent('<div>[--!'+$("#gallerys").val()+'!--]</div><br>');
            $("#modal1").modal('close');
          });
        }

        editor.addButton('currentdate', {
          text: 'add gallery',
          tooltip: "Insert Gallery",
          onclick: insertGallery
        });
      }
    });



});


function updateMenu(event,id){
  event.stopPropagation();
  event.stopImmediatePropagation();
  var form = event.target.form;
  var name = $(event.target).parent().find('a.name').text();
  var hide = form.hide.checked;
  $.ajax({
    url: '/cms/menu/update',
    type: 'PUT',
    data: { id: id, name: name, hide: hide},
    success: function(res){
      console.log(res);
    }
  });
  return false;
}

function addMenuItem(event){
  event.stopPropagation();
  event.stopImmediatePropagation();
  var that = event.target;
  var form = event.target.form;
  $.ajax({
    url: '/cms/menu/additem',
    type: 'POST',
    data: {nameen: form.nameen.value, nameru: form.nameru.value, nameka: form.nameka.value, url: form.url.value, hide: form.hide.checked, menuId: form.menuid.value },
    success: function(result){
      if(result.msg == 'success'){
        var newli = $("<li><div>"+ form.nameka.value+"</div></li>");
        $(that).parent().parent().find('.sortable').append(newli);
      }
    }
  });
  event.preventDefault();
  return false;
}

function deletePost(post){
  var id = $(post).data('id');
  $.ajax({
    url: '/cms/blog/deletepost',
    method: 'DELETE',
    data: {id: id},
    success: function(res){
      if(res.msg == 'success')
        $(post).parent().parent().parent().remove();
    }
  })
  return false;
}

function deleteGallery(gallery){
  var id = $(gallery).data('id');
  $.ajax({
    url: '/cms/gallery/deletegallery',
    method: 'DELETE',
    data: {id: id},
    success: function(res){
      if(res.msg == 'success')
        $(gallery).parent().remove();
    }
  })
}

function removeCategorie(categorie){
  var li = $(categorie).parent().parent();
  var id = $(li).data('id');
  $.ajax({
    url: '/cms/blog/deletecat',
    method: 'DELETE',
    data: {id: id},
    success: function(res){
      if(res.msg == 'success')
        $(li).remove();
    }
  });
}

function deletePostPic(mainpic){
  var pic = $(mainpic).data('pic');
  if(pic){
    $.ajax({
      url: '/cms/post/deletemainpic',
      method: 'DELETE',
      data: { pic: pic},
      success: function(res){
        if(res.msg == 'success'){
          $(mainpic).parent().remove();
          $("#mainpic").show();
        }
      }
    });
  }else{
    $(mainpic).parent().remove();
    $("#mainpic").show();
  }

}


function deleteMenuItem(el){
  event.stopPropagation();
  event.stopImmediatePropagation();
  var id = $(el).parent().parent().data('id') == undefined ? $(el).data('id') : $(el).parent().parent().data('id');

  $.ajax({
    url: '/cms/menu/deleteitem',
    method: 'DELETE',
    data: { id: id},
    success: function(res){
      if(res.msg == 'success'){
        $(el).parent().parent().fadeOut(function(){
          $(this).remove();
        })
      }
    }
  });
}

function saveStruct(el){
  var menuId = $(el).data('id');
  var items = [];
  var ol = $(el).parent().find('>ol');
  var lis = $(ol).find('>li');
  var order = 0;
  $(lis).each(function(){
    var item = new Object();
    item.itemId = $(this).data('id');
    item.order = order;
    item.parentId = 0;
    items.push(item);
    order++;
    getChildren(this);
  });

  function getChildren(parent){
    var lis = $(parent).find('>ol>li');
    $(lis).each(function(){
      var item = new Object();
      item.itemId = $(this).data('id');
      item.order = order;
      item.parentId = $(parent).data('id');
      items.push(item);
      order++;
      getChildren(this);
    });
  }

  items = JSON.stringify(items);

  $.ajax({
    url: '/cms/menu/sortitems',
    method: 'PUT',
    data: { menuId: menuId, items: items},
    success: function(res){
      alert('structure saved');
    }
  });
}
