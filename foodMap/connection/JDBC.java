import java.io.Serializable;
import java.sql.Connection;
import java.util.List;
import java.util.Set;

public abstract class JDBC {
    /**
     * The connection used for this session.
     */
    public Connection connection;

    /**
     * The return class for method Restaurant.
     */
    public static class Restaurant {
        public int id;
        public String name;
        public float longitude;
        public float latitude;

        public Restaurant(int id, String name, float longitude, float latitude) {
            this.id = id;
            this.name = name;
            this.longitude = longitude;
            this.latitude = latitude;
        }
    }

    /**
     * The return class for method Customer.
     */
    public static class Customer {
        public String id;
        public int level;
        public String experience;
        public String name;

        public Customer(String id, int level, String experience, String name) {
            this.id = id;
            this.level = level;
            this.experience = experience;
            this.name = name;
        }
    }


    /**
     * Connects and sets the search path.
     *
     * Establishes a connection to be used for this session, assigning it to
     * the instance variable 'connection'. In addition, sets the search
     * path to parlgov.
     *
     * @param  url       the url for the database
     * @param  username  the username to connect to the database
     * @param  password  the password to connect to the database
     * @return           true if connecting is successful, false otherwise
     */
    public abstract boolean connectDB(String url, String username, String password);

    /**
     * Closes the database connection.
     *
     * @return true if the closing was successful, false otherwise
     */
    public abstract boolean disconnectDB();

    /**
     * Returns the information of the restaurant with id storeId.
     *
     * Does so by finding the restaurant with this id in the database.
     *
     * @param  storeId   id of the restaurant
     * @return           the Restaurant object
     *
     */
    public abstract Restaurant findStoreNAme(int storeId);

    /**
     * Returns a list of Restaurant objects.
     *
     * @return           the list of Restaurant object
     */
    public abstract List<Restaurant> findAllRestaurant();

    /**
     * Returns the information of the customer with id wechatId.
     *
     * Does so by finding the customer with this id in the database.
     *
     * @param wechatId  id of the customer
     * @return           the Customer object
     */
    public abstract Customer findCustomer(String wechatId);

}
