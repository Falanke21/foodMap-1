import java.sql.*;
import java.util.List;
import java.util.ArrayList;
//import java.util.Map;
//import java.util.HashMap;
//import java.util.Set;
//import java.util.HashSet;
public class Connect extends JDBC {

    public Connect() throws ClassNotFoundException {
        Class.forName("org.postgresql.Driver");
    }

    @Override
    public boolean connectDB(String url, String username, String password) {
        try{
            connection = DriverManager.getConnection(url, username, password);
            connection.setSchema("MOCA");
            return true;
        }catch (java.sql.SQLException e) {
            return false;
        }
    }

    @Override
    public boolean disconnectDB() {
        try{
            connection.close();
            return true;
        }catch (java.sql.SQLException e) {
            return false;
        }
    }

    @Override
    public String findStoreNAme(int storeId) {
        try {
            String findName = "SELECT name FROM dbo.Customer WHERE id = '"+ storeId + "';";
            PreparedStatement pStatement = connection.prepareStatement(findName);
            ResultSet rs = pStatement.executeQuery();
            String store_name = "";
            while (rs.next()) {
                store_name = rs.getString("name");
            }
            return store_name;
        } catch (SQLException e) {
            return null;
        }
    }

    public static void main(String[] args) {
        // You can put testing code in here. It will not affect our autotester.
        try{
            Connect a = new Connect();
            a.connectDB("jdbc:postgresql://localhost:moca.database.windows.net","yxktroy","mocA2019");
            //
        }catch (ClassNotFoundException e) {
            System.out.println("file not found");
        }
    }

}