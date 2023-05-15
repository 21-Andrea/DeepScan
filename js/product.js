$(document).ready(function() {

    let productData = $('#productList').DataTable({
        "lengthChange": false,
        "processing": true,
        "serverSide": true,
        "order": [],
        "ajax": {
            url: "action.php",
            type: "POST",
            data: { action: 'listProduct' },
            dataType: "json"
        },
        "columnDefs": [{
            "targets": [0, 8],
            "orderable": false,
        }, ],
        "pageLength": 10,
        'rowCallback': function(row, data, index) {
            $(row).find('td').addClass('align-middle')
            $(row).find('td:eq(0), td:eq(8)').addClass('text-center')
        },
    });

    $('#addProduct').click(function() {
        $('#productModal').modal('show');
        $('#productForm')[0].reset();
        $('.modal-title').html("<i class='fa fa-plus'></i> Agregar Producto");
        $('#action').val("Agregar");
        $('#btn_action').val("addProduct");
    });

    $(document).on('change', '#categoryid', function() {
        let categoryid = $('#categoryid').val();
        let btn_action = 'getCategoryBrand';
        $.ajax({
            url: "action.php",
            method: "POST",
            data: { categoryid: categoryid, btn_action: btn_action },
            success: function(data) {
                $('#brandid').html(data);
            }
        });
    });

    $(document).on('submit', '#productForm', function(event) {
        event.preventDefault();
        $('#action').attr('disabled', 'disabled');
        let formData = $(this).serialize();
        $.ajax({
            url: "action.php",
            method: "POST",
            data: formData,
            success: function(data) {
                $('#productForm')[0].reset();
                $('#productModal').modal('hide');
                $('#action').attr('disabled', false);
                productData.ajax.reload();
            }
        })
    });

    $(document).on('click', '.view', function() {
        let pid = $(this).attr("id");
        let btn_action = 'viewProduct';
        $.ajax({
            url: "action.php",
            method: "POST",
            data: { pid: pid, btn_action: btn_action },
            success: function(data) {
                $('#productViewModal').modal('show');
                $('#productDetails').html(data);
            }
        })
    });

    $(document).on('click', '.update', function() {
         let userid = $(this).attr("id");
         let btn_action = 'getCustomer';
         $.ajax({
         url: "action.php",
         method: "POST",
         data: { userid: userid, btn_action: btn_action },
         dataType: "json",
         success: function(data) {
         $('#customerModal').modal('show');
         $('#cname').val(data.name);
         $('#mobile').val(data.mobile);
         $('#balance').val(data.balance);
         $('#address').val(data.address);
         $('.modal-title').html("<i class='fa fa-edit'></i> Editar Cliente");
         $('#userid').val(userid);
         $('#btn_action').val('customerUpdate');
        }
         })
        });

    $(document).on('click', '.delete', function() {
        let pid = $(this).attr("id");
        let status = $(this).data("status");
        let btn_action = 'deleteProduct';
        if (confirm("¿Está seguro de que desea eliminar este producto?")) {
            $.ajax({
                url: "action.php",
                method: "POST",
                data: { pid: pid, status: status, btn_action: btn_action },
                success: function(data) {
                    $('#alert_action').fadeIn().html('<div class="alert alert-info">' + data + '</div>');
                    productData.ajax.reload();
                }
            });
        } else {
            return false;
        }
    });
});