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
    public Restaurant findStoreNAme(int storeId) {
        try {
            String findInfo = "SELECT name, longitude, latitude FROM dbo.Store_Fix WHERE ID = '"+ storeId + "';";
            PreparedStatement pStatement = connection.prepareStatement(findInfo);
            ResultSet rs = pStatement.executeQuery();
            String store_name = "";
            Float store_long = 0.0f;
            Float store_lat = 0.0f;
            while (rs.next()) {
                store_name = rs.getString("name");
                store_long = rs.getFloat("longitude");
                store_lat = rs.getFloat("latitude");
            }
            Restaurant res = new Restaurant(storeId, store_name, store_long, store_lat);
            return res;
        } catch (SQLException e) {
            return null;
        }
    }

    @Override
    // find all restaurants
    public List<Restaurant> findAllRestaurant() {
        try {
            List<Restaurant> restaurants = new ArrayList<Restaurant>();
            String findInfo = "SELECT ID, name, longitude, latitude FROM dbo.Store_Fix;";
            PreparedStatement pStatement = connection.prepareStatement(findInfo);
            ResultSet rs = pStatement.executeQuery();
            int store_id = -1;
            String store_name = "";
            Float store_long = 0.0f;
            Float store_lat = 0.0f;
            while (rs.next()) {
                store_id = rs.getInt("ID");
                store_name = rs.getString("name");
                store_long = rs.getFloat("longitude");
                store_lat = rs.getFloat("latitude");
                Restaurant res = new Restaurant(store_id, store_name, store_long, store_lat);
                restaurants.add(res);
            }
            return restaurants;
        } catch (SQLException e) {
            return null;
        }
    }

    @Override
    // find the corresponding customer
    public Customer findCustomer(String wechatId) {
        try {
            String findInfo = "SELECT level, current_exp, name FROM dbo.Consumer WHERE ID = '"+ wechatId + "';";
            PreparedStatement pStatement = connection.prepareStatement(findInfo);
            ResultSet rs = pStatement.executeQuery();
            int customer_level = -1;
            String customer_experience = "";
            String customer_name = "";
            while (rs.next()) {
                customer_level = rs.getInt("level");
                customer_experience = rs.getString("current_exp");
                customer_name = rs.getString("name");
            }
            Customer cus = new Customer(wechatId, customer_level, customer_experience, customer_name);
            return cus;
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