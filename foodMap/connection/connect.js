


function addNewBookToBookList(e) {
    var connection = new ActiveXObject("ADODB.Connection");

    var connectionstring = "Data Source=<moca.database.windows.net>;Initial Catalog=<catalog>;User ID=<yxktroy>;Password=<mocA2019>;Provider=SQLOLEDB";

    connection.Open(connectionstring);
    var rs = new ActiveXObject("ADODB.Recordset");

    rs.Open("SELECT * FROM table", connection);
    while (!rs.eof) {
        document.write(rs.fields(1));
        rs.movenext;
    }

    rs.close;
    connection.close;
}