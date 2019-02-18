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
     * Returns the name of the store with id storeId.
     *
     * Does so by finding the store's name with this id in the database.
     *
     * @param  storeId   id of the store
     * @return           the name of the store
     *
     */
    public abstract String findStoreNAme(int storeId);

}
