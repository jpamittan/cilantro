$(document).ready(function() {
  
});

function initializeDataTable() {
  $('.table-list').removeClass('display').addClass('table table-striped table-bordered');
  var table_name;
  var columns = [];
  var aTargets = [];
  var order = [];
  
  table_name = '#table-transactions';
  columns = [
    { "data": "id" },
    { "data": "item" },
    { "data": "created_at" }
  ];
  aTargets = [2];
  order = [[2, 'desc']];

  table_list = $(table_name).DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      url: '/v1/accounts/' + subscriber_id + '/transactions?account_id=' + subscriber_id,
      data: function (data) {
      },
      dataSrc: function (json) {
        //kyc_list = json.data;
        return json.data;
      },
      error: function (xhr, error, thrown) {
        console.log(xhr);
        //handleErrorResponse(xhr, '.kyc-list .errmsg');
        $('.dataTables_processing').hide();
      }
    },
    aoColumnDefs : [
      {
        aTargets: aTargets,
        mRender: function ( data, type, row ) {
          return formatDate(data);
        }
      },
      { 
        bSortable: false, 
        aTargets: [ 0, 1 ] 
      }
    ],
    columns: columns,
    order: order
  });
  $.fn.dataTableExt.sErrMode = 'throw';

  $('#startdate, #enddate').on('change', function() {
    table_list.draw();
  });

}
